const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();
const connectDB = require('./db/connect');
const user = require('./routes/user-route');
const twitter = require('./routes/twitter-route')

//twitter activity
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const TwitterStrategy = require('passport-twitter')
const uuid = require('uuid/v4')
const security = require('./helpers/security')
const auth = require('./helpers/auth')
const cacheRoute = require('./helpers/cache-route')
const socket = require('./helpers/socket')


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


// form parser middleware
var parseForm = bodyParser.urlencoded({ extended: false })

/**
 * Receives challenge response check (CRC)
 **/
app.get('/webhook/twitter', function(request, response) {

  var crc_token = request.query.crc_token

  if (crc_token) {
    var hash = security.get_challenge_response(crc_token, auth.twitter_oauth.consumer_secret)

    response.status(200);
    response.send({
      response_token: 'sha256=' + hash
    })
  } else {
    response.status(400);
    response.send('Error: crc_token missing from request.')
  }
})


/**
 * Receives Account Acitivity events
 **/
app.post('/webhook/twitter', function(request, response) {

  console.log(request.body)
  
  socket.io.emit(socket.activity_event, {
    internal_id: uuid(),
    event: request.body
  })

  response.send('200 OK')
})

/**
 * Subscription management
 **/

 auth.basic = auth.basic || ((req, res, next) => next())

 app.get('/subscriptions', auth.basic, cacheRoute(1000), require('./routes/subscriptions'))
 
 
 /**
  * Starts Twitter sign-in process for adding a user subscription
  **/
 app.get('/subscriptions/add', passport.authenticate('twitter', {
   callbackURL: '/callbacks/addsub'
 }));
 
 /**
  * Starts Twitter sign-in process for removing a user subscription
  **/
 app.get('/subscriptions/remove', passport.authenticate('twitter', {
   callbackURL: '/callbacks/removesub'
 }));
 
 
 /**
  * Webhook management routes
  **/
 var webhook_view = require('./routes/webhook')
 app.get('/webhook', auth.basic, auth.csrf, webhook_view.get_config)
 app.post('/webhook/update', parseForm, auth.csrf, webhook_view.update_config)
 app.post('/webhook/validate', parseForm, auth.csrf, webhook_view.validate_config)
 app.post('/webhook/delete', parseForm, auth.csrf, webhook_view.delete_config)
 
 
 /**
  * Activity view
  **/
 app.get('/activity', auth.basic, require('./routes/activity'))
 
 
 /**
  * Handles Twitter sign-in OAuth1.0a callbacks
  **/
 app.get('/callbacks/:action', passport.authenticate('twitter', { failureRedirect: '/' }),
   require('./routes/sub-callbacks'))

   



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
    const server = app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );

    // initialize socket.io
    socket.init(server)

  } catch (error) {
    console.log(error);
  }
};

start();

