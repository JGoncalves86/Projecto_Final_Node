require('dotenv').config(); // variáveis de ambiente
const express = require('express');
const morgan = require('morgan'); // logs de requisições
const cors = require('cors');
const path = require('path');

const bodyParser = require('body-parser');

const userRoutes = require('./routes/user.routes');
const flatRoutes = require('./routes/flat.routes');
const messageRoutes = require('./routes/message.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('MONGO_URI:', process.env.MONGO_URI);


// ==========================
// MIDDLEWARES GLOBAIS
// ==========================
app.use(cors()); // permitir requisições cross-origin
app.use(morgan('dev')); // logs no console
app.use(express.json()); // body JSON
app.use(express.urlencoded({ extended: true })); // body urlencoded


// Forçar parse de JSON mesmo se Content-Type estiver estranho
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==========================
// ARQUIVOS ESTÁTICOS (UPLOADS)
// ==========================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
