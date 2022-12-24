import Diet from "../models/Diet.js";
import DietRecipe from "../models/DietRecipe.js";
import Recipe from "../models/Recipe.js";
import Step from "../models/Step.js";
import "../models/User.js"

Recipe.belongsToMany(Diet, {
  through: { model: DietRecipe, unique: false },
  foreignKey: 'recipe_id',
  otherKey: 'diet_id',
  as: 'diets'
})
Diet.belongsToMany(Recipe, {
  through: { model: DietRecipe, unique: false },
  foreignKey: 'diet_id',
  otherKey: 'recipe_id'
})

Recipe.hasMany(Step, { foreignKey: 'recipe_id', as: 'steps' })
Step.belongsTo(Recipe, { foreignKey: 'recipe_id' })

export const sequelize = Recipe.sequelize