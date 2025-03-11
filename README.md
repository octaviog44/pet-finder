# PetFinder App

Aplicación web para ayudar a encontrar mascotas perdidas.

## URLs

- **Webapp**: [URL de la aplicación en producción]


## Características

- Registro y autenticación de usuarios
- Reportar mascotas perdidas/encontradas
- Búsqueda de mascotas por ubicación
- Sistema de notificaciones por email
- Gestión de reportes de avistamientos

## Tecnologías

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Base de datos: PostgreSQL
- Servicios:
  - Algolia (búsqueda geoespacial)
  - Resend (envío de emails)

## API Endpoints

### Autenticación

- Registro de usuario: POST /registrarse
- Inicio de sesión: POST /iniciar-sesion

### Mascotas

- `POST /api/pets` - Crear reporte de mascota
- `PUT /api/pets/:id` - Actualizar reporte
- `DELETE /api/pets/:id` - Eliminar reporte
- `GET /api/pets/user` - Obtener mascotas del usuario
- `GET /api/pets/nearby` - Buscar mascotas cercanas

### Reportes de Avistamientos

- `POST /api/reports` - Crear reporte de avistamiento
- `GET /api/reports/pet/:petId` - Obtener reportes de una mascota
- `DELETE /api/reports/:id` - Eliminar reporte

## Instalación

1. Clonar el repositorio

```bash
git clone [URL del repositorio]
```

2. Instalar dependencias

```bash
npm install
```

3. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus valores
```

4. Iniciar el servidor

```bash
npm start
```

## Variables de Entorno

```env
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=petfinder
JWT_SECRET=your_jwt_secret
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_API_KEY=your_algolia_api_key
RESEND_API_KEY=your_resend_api_key
```

## Base de Datos

### Tablas

```sql
-- Usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mascotas
CREATE TABLE pets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  image_url TEXT,
  reporter_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reportes
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  pet_id INTEGER REFERENCES pets(id),
  reporter_phone VARCHAR(20) NOT NULL,
  location VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
