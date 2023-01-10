import Activity from "../models/Activity.js"
import Continent from "../models/Continent.js"
import Country from "../models/Country.js"
import CountryActivity from "../models/CountryActivity.js"
import CountryCurrency from "../models/CountryCurrency.js"
import CountryLanguage from "../models/CountryLanguage.js"
import Currency from "../models/Currency.js"
import Language from "../models/Language.js"
import "../models/User.js"

Continent.hasMany(Country, { foreignKey: 'continent_id' })
Country.belongsTo(Continent, { as: 'continent', foreignKey: 'continent_id' })

Country.belongsToMany(Activity, {
  through: { model: CountryActivity, unique: false },
  foreignKey: 'country_id',
  otherKey: 'activity_id',
  as: 'activities'
})
Activity.belongsToMany(Country, {
  through: { model: CountryActivity, unique: false },
  foreignKey: 'activity_id',
  otherKey: 'country_id'
})

Country.belongsToMany(Currency, {
  through: { model: CountryCurrency, unique: false },
  foreignKey: 'country_id',
  otherKey: 'currency_code',
  as: 'currencies'
})
Currency.belongsToMany(Country, {
  through: { model: CountryCurrency, unique: false },
  foreignKey: 'currency_code',
  otherKey: 'country_id'
})

Country.belongsToMany(Language, {
  through: { model: CountryLanguage, unique: false },
  foreignKey: 'country_id',
  otherKey: 'language_code',
  as: 'languages'
})
Language.belongsToMany(Country, {
  through: { model: CountryLanguage, unique: false },
  foreignKey: 'language_code',
  otherKey: 'country_id'
})

export const sequelize = Country.sequelize