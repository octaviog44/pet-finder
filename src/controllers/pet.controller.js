const Pet = require("../models/pet.model");
const AlgoliaService = require("../services/algolia.service");

class PetController {
  static async createPet(req, res) {
    try {
      const { name, status, location, imageUrl } = req.body;
      const reporterId = req.user.id; // Asumiendo que tenemos middleware de autenticación

      // Validar datos
      if (!name || !status || !location) {
        return res.status(400).json({ message: "Faltan datos requeridos" });
      }

      // Crear mascota
      const pet = await Pet.create({
        name,
        status,
        location,
        imageUrl,
        reporterId,
      });

      // Indexar en Algolia
      await AlgoliaService.indexPet(pet);

      res.status(201).json({
        message: "Mascota registrada exitosamente",
        pet,
      });
    } catch (error) {
      console.error("Error al crear mascota:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async updatePet(req, res) {
    try {
      const { id } = req.params;
      const { name, status, location, imageUrl } = req.body;
      const reporterId = req.user.id;

      // Verificar que la mascota existe y pertenece al usuario
      const existingPet = await Pet.findById(id);
      if (!existingPet) {
        return res.status(404).json({ message: "Mascota no encontrada" });
      }
      if (existingPet.reporter_id !== reporterId) {
        return res.status(403).json({ message: "No autorizado" });
      }

      // Actualizar mascota
      const pet = await Pet.update(id, {
        name,
        status,
        location,
        imageUrl,
      });

      // Actualizar en Algolia
      await AlgoliaService.updatePet(pet);

      res.json({
        message: "Mascota actualizada exitosamente",
        pet,
      });
    } catch (error) {
      console.error("Error al actualizar mascota:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async deletePet(req, res) {
    try {
      const { id } = req.params;
      const reporterId = req.user.id;

      // Verificar que la mascota existe y pertenece al usuario
      const existingPet = await Pet.findById(id);
      if (!existingPet) {
        return res.status(404).json({ message: "Mascota no encontrada" });
      }
      if (existingPet.reporter_id !== reporterId) {
        return res.status(403).json({ message: "No autorizado" });
      }

      // Eliminar mascota
      await Pet.delete(id);

      // Eliminar de Algolia
      await AlgoliaService.deletePet(id);

      res.json({ message: "Mascota eliminada exitosamente" });
    } catch (error) {
      console.error("Error al eliminar mascota:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async getPetsByUser(req, res) {
    try {
      const userId = req.user.id;
      const pets = await Pet.findByReporter(userId);
      res.json({ pets });
    } catch (error) {
      console.error("Error al obtener mascotas:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async searchNearbyPets(req, res) {
    try {
      const { location, radius } = req.query;
      if (!location) {
        return res.status(400).json({ message: "Se requiere la ubicación" });
      }

      const results = await AlgoliaService.searchNearby(
        location,
        parseInt(radius)
      );
      res.json(results);
    } catch (error) {
      console.error("Error al buscar mascotas cercanas:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

module.exports = PetController;
