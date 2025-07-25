const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const logger = require('./config/logger');
const productRoutes = require('./routes/product_routes');
const authRoutes = require('./routes/auth_route');
const supermarketRoutes = require('./routes/supermarket_route');
const userRoutes = require('./routes/user_route');
const productListRoutes = require('./routes/product_lists_route');
const priceRecordsRoutes = require('./routes/price_records_route');
const swaggerSpec = require('./config/swaggerConfig');

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
morgan.token('req-body', (req) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :response-time ms - req-body: :req-body', {
    stream: { write: (msg) => logger.info(msg.trim()) },
  }),
);
app.use('/auth', authRoutes);
app.use('/supermarkets', supermarketRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/product-lists', productListRoutes);
app.use('/price-records', priceRecordsRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Projeto Rodando');
});

app.listen(3001, () => {});
module.exports = app;
