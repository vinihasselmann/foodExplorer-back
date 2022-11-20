const { json } = require("stream/consumers");
const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");

class DishesController {
  async create(request, response) {
    const { title, description, ingredients, category, price } = request.body;

    const { filename: imageFilename } = request.file;

    const diskStorage = new DiskStorage();

    const filename = await diskStorage.saveFile(imageFilename);

    const dishes_id = await knex("dishes").insert({
      image: filename,
      title,
      description,
      category,
      price
    });
    
    const hasOnlyOneIngredient = typeof(ingredients) === "string";

    let ingredientsInsert
    if (hasOnlyOneIngredient) {
      ingredientsInsert = {
        name: ingredients,
        dishes_id
      }

    } else if (ingredients.length > 1) {
      ingredientsInsert = ingredients.map(ingredient => {
        return {
          name : ingredient,
          dishes_id
        }
      });

    } else {
      return
    }


    await knex("ingredients").insert(ingredientsInsert);

    return response.status(201).json();
  }

  async update(request, response) {
    const { title, description, ingredients, price, category} = request.body;
    const { id } = request.params;
    const { filename: imageFilename } = request.file;

    const diskStorage = new DiskStorage();
    
    const dish = await knex("dishes").where({ id }).first();

    if(dish.image) {

    await diskStorage.deleteFile(dish.image);
    }

    const filename = await diskStorage.saveFile(imageFilename);

    dish.image = filename;
    dish.title = title ?? dish.title;
    dish.description = description ?? dish.description;
    dish.price = price ?? dish.price;
    dish.category = category ?? dish.category;

   
    
    const ingredientsInsert = ingredients.map(name => ({
        name,
        dishes_id: dish.id
    }));

    await knex ("dishes").where({ id }).update(dish);
    await knex("dishes").where({ id }).update('updated_at', knex.fn.now())

    await knex("ingredients").where({dishes_id: id}).delete();
    await knex("ingredients").insert(ingredientsInsert);

    return response.status(200).json();
    
  }

  async index(request, response) {
    const { title, ingredients } = request.query;

    let dishes;

    if (ingredients) {
      const filterIngredients = ingredients.split(',').map(tag => tag.trim());

      dishes = await knex('ingredients')
        .select([
          'dishes.id',
          'dishes.title',
          'dishes.description',
          'dishes.price',
          'dishes.img'
        ])
        .whereLike('dishes.title', `%${title}%`)
        .whereIn('name', filterIngredients)
        .innerJoin('dishes', 'dishes.id', 'ingredients.dishes_id')
        .groupBy('dishes.id')
        .orderBy('dishes.title');
    } else {
      dishes = await knex('dishes')
        .whereLike('title', `%${title}%`)
        .orderBy('title');
    }

    const listIngredients = await knex('ingredients');

    const dishesWithIngredients = dishes.map(dish => {
      const dishIngredients = listIngredients.filter(
        ingredient => ingredient.dish_id === dish.id
      );

      return {
        ...dish,
        ingredients: dishIngredients
      };
    });

    return response.json(dishesWithIngredients);
  }

  async show(request, response) {
    const { id } = request.params;

    const dish = await knex("dishes").where({ id }).first();
    const ingredients = await knex("ingredients")
        .where({ dishes_id: id})
        .orderBy("name");

    return response.json({
        ...dish,
        ingredients
    });
  }

  async delete(request, response){
    const { id } = request.params;

    await knex("dishes").where({ id }).delete();

    return response.json();
  };

 
}

module.exports = DishesController;
