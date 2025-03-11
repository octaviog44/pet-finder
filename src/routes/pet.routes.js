const express = require("express");
const router = express.Router();
const PetController = require("../controllers/pet.controller");
const auth = require("../middleware/auth");

// Rutas de mascotas
router.post("/", auth, PetController.createPet);
router.put("/:id", auth, PetController.updatePet);
router.delete("/:id", auth, PetController.deletePet);
router.get("/user", auth, PetController.getPetsByUser);
router.get("/nearby", PetController.searchNearbyPets);

module.exports = router;
