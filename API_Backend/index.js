require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

const authRoute = require('./src/routes/authRoute');
const productRoute = require('./src/routes/productRoute');
const cartRoute = require('./src/routes/cartRoutes');
const orderRoute = require('./src/routes/orderRoute');
const checkoutRoute = require('./src/routes/checkoutRoute');

const app = express();
// const applySecurity = require('./src/middlewares/securityMiddleware');
// applySecurity(app); 
app.use(cors());

const port = Number(process.env.PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoute);
app.use('/api', productRoute);
app.use('/cart', cartRoute);
app.use('/order', orderRoute);
app.use('/cart', checkoutRoute);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/uploads/products', express.static(path.join(__dirname, 'uploads', 'products')));

app.listen(port, ()=> {
  console.log(`Server is running on port ${port}`);
}); 