import axios from "axios"
import { encryptPass } from "../code/utils.js"
import { sequelize } from "./relations.js"

const { Continent, Country, Currency, Language, User } = sequelize.models

export async function seed() {
  User.create({ names: 'Antonio Muelle', username: 'antomuelle', email: 'mguznman.muelle@gmail.com', password: await encryptPass('sh4redp@ssword') })

  let continents = new Set()
  const languages = {}
  const currencies = {}

  const { data } = await axios.get('https://restcountries.com/v3/all')
  data.forEach(country => {
    continents.add(country.continents[0])
    if (country.languages) {
      for (let key in country.languages) { languages[key] = country.languages[key] }
    }
    if (country.currencies) {
      for (let key in country.currencies) { currencies[key] = country.currencies[key] }
    }
  })

  continents = await createContinents(continents)
  await createLanguages(languages)
  await createCurrencies(currencies)

  data.forEach(async country => {
    const ctry = await Country.create({
      id: country.cca3,
      cca2: country.cca2,
      name: country.name.common,
      official_name: country.name.official,
      image: country.flags[0],
      capital: country.capital ? country.capital.toString() : null,
      continent_id: continents[country.continents[0]],
      area: country.area,
      population: country.population,
      subregion: country.subregion,
    })
    if (country.languages) { ctry.setLanguages( Object.keys(country.languages) ) }
    if (country.currencies) { ctry.setCurrencies( Object.keys(country.currencies) ) }
  })
}

async function createContinents(continents) {
  await Continent.bulkCreate( Array.from(continents).map(continent => ({ name: continent })) )
  const all = await Continent.findAll()
  const map = {}
  all.forEach(continent => map[continent.name] = continent.id)
  return map
}

function createLanguages(languages) {
  return  Language.bulkCreate( Object.keys(languages).map(code => ({ code, name: languages[code] })) )
}

function createCurrencies(currencies) {
  return Currency.bulkCreate( Object.keys(currencies).map(code => ({
    code,
    name: currencies[code]['name'],
    symbol: currencies[code]['symbol']
  })) )
}