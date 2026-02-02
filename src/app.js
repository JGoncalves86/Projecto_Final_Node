require('dotenv').config(); // variáveis de ambiente
const express = require('express');
const morgan = require('morgan'); // logs de requisições
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/user.routes');
const flatRoutes = require('./routes/flat.routes');
const messageRoutes = require('./routes/message.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// ==========================
// MIDDLEWARES GLOBAIS
// ==========================
app.use(cors()); // permitir requisições cross-origin
app.use(morgan('dev')); // logs no console
app.use(express.json()); // body JSON
app.use(express.urlencoded({ extended: true })); // body urlencoded

// ==========================
// ARQUIVOS ESTÁTICOS (UPLOADS)
// ==========================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ==========================
// ROTAS
// ==========================
app.use('/users', userRoutes);
app.use('/flats', flatRoutes);
app.use('/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running! Visit /users, /flats or /messages for API.');
});


// ==========================
// MIDDLEWARE GLOBAL DE ERROS
// ==========================
app.use(errorMiddleware);

module.exports = app;
