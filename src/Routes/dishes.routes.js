const { Router } = require("express");
const multer = require('multer');
const uploadConfig = require("../configs/upload");

const DishesController = require("../Controllers/DishesController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");
const ensureIsAdmin  = require("../middleware/ensureAuthenticatedAdmin");

const dishesRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const dishesController = new DishesController();

dishesRoutes.use(ensureAuthenticated);

dishesRoutes.post("/", ensureIsAdmin, upload.single("image"),dishesController.create);
dishesRoutes.get("/", dishesController.index);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.delete("/:id", ensureIsAdmin, dishesController.delete);
dishesRoutes.put("/:id", ensureIsAdmin, upload.single("image"), dishesController.update);

module.exports = dishesRoutes;