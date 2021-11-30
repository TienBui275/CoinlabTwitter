const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();
const connectDB = require('./db/connect');
const user = require('./routes/user-route');
const twitter = require('./routes/twitter-route')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));


app.use(express.static('./public'));

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});


// router
app.use('/api/user', user);
app.use('/api/twitter', twitter);




app.use((req, res, next) => {
  next(createError.NotFound());
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});


const PORT = process.env.PORT || 3333;
//app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();