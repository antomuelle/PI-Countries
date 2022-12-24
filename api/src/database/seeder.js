import { encryptPass } from "../code/utils.js";
import { dietsFromApi } from "../controllers/foodController.js";
import { sequelize } from "./relations.js";

const { Diet, User } = sequelize.models

export async function seed() {
  User.create({ names: 'Antonio Muelle', username: 'antomuelle', email: 'mguznman.muelle@gmail.com', password: await encryptPass('sh4redp@ssword') })

  // Diet.bulkCreate(dietsFromApi())
  Diet.bulkCreate([
    { name: "gluten free" },
    { name: "dairy free" },
    { name: "paleolithic" },
    { name: "primal",},
    { name: "whole 30" },
    { name: "pescatarian" },
    { name: "fodmap friendly" },
    { name: "ketogenic" },
    { name: "lacto ovo vegetarian" },
    { name: "vegan" }
  ])
}