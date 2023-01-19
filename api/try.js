// read all files in a directory
// and rename them with a number incrementing
// from 1 to n

import { sequelize } from "./src/database/relations.js"

const { Activity, Continent, Country, Currency, Language } = sequelize.models

const all = await Country.findAndCountAll({
  attributes: ["id", "name", "image"],
  include: { model: Continent, as: "continent", attributes: ["name"] },
})
console.log(all.count)


/* import axios from "axios";

const continents = new Set()
const languages = {}

const {data} = await axios.get('https://restcountries.com/v3/all')
data.forEach(country => {
  const name = country.name.common
  // 5 no tienen capital y 1 tiene varias capitales
  if (country.capital) {
    if (country.capital.length > 1) {
      console.log(name + country.capital + ' many capitals')
    }
  }
  else console.log(country.name.common + ' have no capital')

  // todos tienen un solo continente
  if (country.continents) {
    continents.add(country.continents[0])
    if (country.continents.length > 1)
      console.log(name + ' many continents--')
  }

  // 3 no tienen moneda y muchos tienen varias monedas
  if (country.currencies) {
    if (Object.keys(country.currencies).length > 1)
      console.log(name + ' many currencies', country.currencies)
  }
  else console.log(name + ' no currencies')

  // 1 no tiene idioma y los demas tienen 1 idioma
  if (country.languages) {
    let len = 0
    for (const key in country.languages) {
      languages[key] = country.languages[key]
      if (key.length > 3) console.log('len of key more than 3')
    }
    len > 1 && console.log('many languages in country')
  }
  else console.log(name + ' ++ no languages')
  
});

console.log(continents, Object.keys(languages).length) */