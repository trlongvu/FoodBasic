require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/connectDB');
const router = require('./routers/index');

const port = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use(cors());

router(app);

connectDB();

app.listen(port, () => {
  console.log(`Server is running with port ${port}`);
});
