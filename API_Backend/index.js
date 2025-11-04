require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoute = require('./routes/authRoute');
const productRoute = require('./routes/productRoute');
const cartRoute = require('./routes/cartRoutes');
const orderRoute = require('./routes/orderRoute');
const checkoutRoute = require('./routes/checkoutRoute');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRoute);
app.use('/api', productRoute);
app.use('/cart', cartRoute);
app.use('/order', orderRoute);
app.use('/cart', checkoutRoute)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, ()=> {
  console.log(`Server is running on port ${port}`);
}); 