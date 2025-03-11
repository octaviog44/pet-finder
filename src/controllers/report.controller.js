const Report = require("../models/report.model");
const Pet = require("../models/pet.model");
const User = require("../models/user.model");
const EmailService = require("../services/email.service");

class ReportController {
  static async createReport(req, res) {
    try {
      const { petId, reporterPhone, location } = req.body;

      // Validar datos
      if (!petId || !reporterPhone || !location) {
        return res.status(400).json({ message: "Faltan datos requeridos" });
      }

      // Verificar que la mascota existe
      const pet = await Pet.findById(petId);
      if (!pet) {
        return res.status(404).json({ message: "Mascota no encontrada" });
      }

      // Crear reporte
      const report = await Report.create({
        petId,
        reporterPhone,
        location,
      });

      // Obtener información del dueño de la mascota
      const owner = await User.findById(pet.reporter_id);

      // Enviar notificación por email
      await EmailService.sendPetReportNotification(
        owner.email,
        pet.name,
        report.location,
        report.reporter_phone
      );

      res.status(201).json({
        message: "Reporte creado exitosamente",
        report,
      });
    } catch (error) {
      console.error("Error al crear reporte:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async getReportsByPet(req, res) {
    try {
      const { petId } = req.params;
      const reporterId = req.user.id;

      // Verificar que la mascota existe y pertenece al usuario
      const pet = await Pet.findById(petId);
      if (!pet) {
        return res.status(404).json({ message: "Mascota no encontrada" });
      }
      if (pet.reporter_id !== reporterId) {
        return res.status(403).json({ message: "No autorizado" });
      }

      // Obtener reportes
      const reports = await Report.findByPetId(petId);
      res.json({ reports });
    } catch (error) {
      console.error("Error al obtener reportes:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async deleteReport(req, res) {
    try {
      const { id } = req.params;
      const reporterId = req.user.id;

      // Verificar que el reporte existe
      const report = await Report.findById(id);
      if (!report) {
        return res.status(404).json({ message: "Reporte no encontrado" });
      }

      // Verificar que la mascota pertenece al usuario
      const pet = await Pet.findById(report.pet_id);
      if (pet.reporter_id !== reporterId) {
        return res.status(403).json({ message: "No autorizado" });
      }

      // Eliminar reporte
      await Report.delete(id);
      res.json({ message: "Reporte eliminado exitosamente" });
    } catch (error) {
      console.error("Error al eliminar reporte:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

module.exports = ReportController;
