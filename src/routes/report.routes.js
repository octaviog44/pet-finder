const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/report.controller");
const auth = require("../middleware/auth");

// Rutas de reportes
router.post("/", ReportController.createReport);
router.get("/pet/:petId", auth, ReportController.getReportsByPet);
router.delete("/:id", auth, ReportController.deleteReport);

module.exports = router;
