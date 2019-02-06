require('dotenv').config();
const express = require('express');
const expressSession = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
require('./config/passport')(passport);

const RedisStore = require('connect-redis')(expressSession);

// routes
const index = require('./routes/index');
const users = require('./routes/users');
const auth = require('./routes/auth');
const deployments = require('./routes/deployments');
const organisations = require('./routes/organisations');
const food = require('./routes/food');
const questions = require('./routes/questions');
const deploymentUserState = require('./routes/deploymentUserState');

(async () => {
  const app = express();

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
  app.set('trust proxy', 1);

  // uncomment after placing your favicon in /public
  // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  if (process.env.NODE_ENV !== 'testing') {
    app.use(logger('dev'));
  }
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(expressSession({
    store: new RedisStore({
      host: process.env.REDIS_URL
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitiialized: false
  }));

  app.use(cors({
    origin: process.env.WEB_URL || 'http://localhost:8080',
    credentials: true,
    allowHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }));

  // Initialize Passport and restore authentication state, if any, from the
  // session.
  app.use(passport.initialize());
  app.use(passport.session());

  // Routes
  app.use('/', index);
  app.use('/auth', auth);
  app.use('/users', users);
  app.use('/deployments', deployments);
  app.use('/organisations', organisations);
  app.use('/food', food);
  app.use('/questions', questions);
  app.use('/deploymentUserState', deploymentUserState);
  app.use('/docs', express.static('docs'));

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  module.exports = app;
})();
