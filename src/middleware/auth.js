const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports = async (req, res, next) => {
  try {
    // Obtener el token del header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "No autorizado - Token no proporcionado" });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar el usuario
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res
        .status(401)
        .json({ message: "No autorizado - Usuario no encontrado" });
    }

    // Agregar el usuario a la request
    req.user = user;
    next();
  } catch (error) {
    console.error("Error en autenticación:", error);
    res.status(401).json({ message: "No autorizado - Token inválido" });
  }
};
