# 🛒 eCommerce API Backend

Bienvenido al **eCommerce API Backend**, un sistema robusto de comercio electrónico creado con **Node.js y Express** que proporciona un conjunto completo de endpoints RESTful para manejar productos, usuarios, pedidos y mucho más. Diseñado para ser el backend de una aplicación eCommerce moderna, este proyecto se puede integrar fácilmente con un frontend en React u otro framework de tu elección.

## 🚀 Características

- **Gestión de productos**: CRUD para productos, categorías y marcas.
- **Gestión de usuarios**: Registro e inicio de sesión seguro con autenticación basada en JWT.
- **Carrito de compras y pedidos**: Añadir al carrito, realizar pedidos y ver el historial de compras.
- **Roles de usuario**: Control de acceso basado en roles (usuario y administrador).
- **API segura y escalable**: Protección mediante CORS, sanitización de datos y encriptación de contraseñas.

## 🛠️ Tecnologías

- **Servidor**: Node.js, Express
- **Base de datos**: MongoDB (Mongoose para el ODM)
- **Autenticación y Seguridad**: JSON Web Tokens (JWT), bcryptjs para encriptación
- **Manejo de Errores**: Controlador global de errores y middleware personalizado
- **Variables de Entorno**: Configuración centralizada para seguridad y despliegue

## 📂 Estructura del Proyecto

```plaintext
backend/
│
├── config/               # Archivos de configuración (DB, variables de entorno)
├── controllers/          # Controladores de las rutas de la API
├── models/               # Modelos de datos (esquemas de Mongoose)
├── middlewares/          # Middlewares personalizados (auth, validación de datos)
├── routes/               # Rutas de la API
├── utils/                # Utilidades y funciones auxiliares
├── server.js             # Punto de entrada del servidor
└── app.js                # Configuración de la app y middlewares
```

## 🏗️ Instalación y Configuración

### Requisitos previos

- **Node.js** y **npm** instalados
- **MongoDB** (en MongoDB Atlas o una instancia local)

### Instalación Paso a Paso

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu_usuario/ecommerce-api-backend.git
   cd ecommerce-api-backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar el archivo `.env`**

   Crea un archivo `.env` en la raíz del proyecto y configura las siguientes variables de entorno:

   ```plaintext
   PORT=5000
   DB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/dbname
   JWT_SECRET=mysecretkey
   CLIENT_URL=http://localhost:3000
   ```

4. **Iniciar el servidor**

   ```bash
   npm start
   ```

5. La API estará corriendo en `http://localhost:5000`.

## 📋 Uso de la API

### Endpoints Principales

- **Usuarios**
  - `POST /api/v1/users/register`: Registro de usuarios
  - `POST /api/v1/users/login`: Inicio de sesión

- **Productos**
  - `GET /api/v1/products`: Listar productos
  - `GET /api/v1/products/:id`: Obtener detalles de un producto
  - `POST /api/v1/products`: Crear un producto (solo admin)
  - `PUT /api/v1/products/:id`: Editar un producto (solo admin)
  - `DELETE /api/v1/products/:id`: Eliminar un producto (solo admin)

- **Pedidos**
  - `POST /api/v1/orders`: Crear un nuevo pedido
  - `GET /api/v1/orders`: Listar pedidos del usuario autenticado

### Ejemplo de Solicitud a la API

```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

### Respuesta de Ejemplo

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "email": "usuario@example.com",
      "name": "Nombre Usuario",
      "token": "jwt_token"
    }
  }
}
```

## 🔐 Seguridad

La API está protegida con JWT para manejar la autenticación y autorización. Cada solicitud a un endpoint seguro requiere un token válido. Los datos sensibles, como contraseñas, se almacenan de forma segura mediante hashing con **bcryptjs**. Adicionalmente:

- **CORS**: Configurado para aceptar solicitudes solo del dominio configurado en `CLIENT_URL`.
- **Protección contra CSRF**: La autenticación basada en tokens protege contra ataques de CSRF.
- **Sanitización**: Se filtran las entradas del usuario para evitar inyecciones de código.

## ✨ Contribuir

1. Haz un fork del proyecto.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Haz commit de tus cambios (`git commit -am 'Agrega nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## 📜 Licencia

Este proyecto está bajo la licencia MIT. ¡Eres libre de usarlo, modificarlo y distribuirlo como quieras!

---

¡Gracias por tu interés en **eCommerce API Backend**! 🚀
