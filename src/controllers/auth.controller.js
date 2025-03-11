const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const EmailService = require("../services/email.service");

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password, location } = req.body;

      // Validar datos
      if (!email || !password || !name) {
        return res.status(400).json({ message: "Faltan datos requeridos" });
      }

      // Verificar si el usuario ya existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }

      // Crear usuario
      const user = await User.create({ name, email, password, location });

      // Enviar email de bienvenida
      await EmailService.sendWelcomeEmail(email, name);

      res.status(201).json({
        message: "Usuario registrado exitosamente",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          location: user.location,
        },
      });
    } catch (error) {
      console.error("Error en registro:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validar datos
      if (!email || !password) {
        return res.status(400).json({ message: "Faltan datos requeridos" });
      }

      // Buscar usuario
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      res.status(200).json({
        message: "Inicio de sesión exitoso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          location: user.location,
        },
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

module.exports = AuthController;
