'use strict';

/*!
 * Module dependencies.
 */

// Note: We can require users, articles and other cotrollers because we have
// set the NODE_PATH to be ./app/controllers (package.json # scripts # start)

const home = require('../server/controllers/home');
const users = require('../server/controllers/users');
const articles = require('../server/controllers/articles');
const comments = require('../server/controllers/comments');
const tags = require('../server/controllers/tags');
const auth = require('./middlewares/authorization');

const devices = require('../server/controllers/api/devices');
const components = require('../server/controllers/api/components');
const gpios = require('../server/controllers/api/gpios');
const appController = require('../server/controllers/api/app');
/**
 * Route middlewares
 */

const articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
const commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];

/**
 * Expose routes
 */

module.exports = function(app, passport) {

  // user routes
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session);
  app.get('/users/:userId', users.show);
  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: ['email', 'user_about_me'],
      failureRedirect: '/login'
    }), users.signin);
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/github',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }), users.signin);
  app.get('/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/twitter',
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }), users.signin);
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/google',
    passport.authenticate('google', {
      failureRedirect: '/login',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }), users.signin);
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/linkedin',
    passport.authenticate('linkedin', {
      failureRedirect: '/login',
      scope: [
        'r_emailaddress'
      ]
    }), users.signin);
  app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', {
      failureRedirect: '/login'
    }), users.authCallback);

  app.param('userId', users.load);

  // article routes
  //app.param('id', articles.load);
  app.get('/articles', articles.index);
  app.get('/articles/new', auth.requiresLogin, articles.new);
  app.post('/articles', auth.requiresLogin, articles.create);
  app.get('/articles/:id', articles.show);
  app.get('/articles/:id/edit', articleAuth, articles.edit);
  app.put('/articles/:id', articleAuth, articles.update);
  app.delete('/articles/:id', articleAuth, articles.destroy);

  // comment routes
  app.param('commentId', comments.load);
  app.post('/articles/:id/comments', auth.requiresLogin, comments.create);
  app.get('/articles/:id/comments', auth.requiresLogin, comments.create);
  app.delete('/articles/:id/comments/:commentId', commentAuth, comments.destroy);

  // tag routes
  app.get('/tags/:tag', tags.index);


  app.post('/api/devices/join', devices.join);

  app.get('/api/components', components.get);
  app.get('/api/components/:id', components.getById);
  app.post('/api/components', components.create);
  app.put('/api/components/socket/:id', components.socket);
  app.put('/api/components/dimmer/:id', components.dimmer);
  app.put('/api/components/switch/:id', components.switch);
  app.put('/api/components/switchBlind/:id', components.switchBlind);
  app.put('/api/components/switchAudio/:id', components.switchAudio);
  app.get('/api/components/testAC/:id', components.testAC);
  app.get('/api/components/temperatureSensor/:id', components.temperatureSensor);
  app.get('/api/components/luminanceSensor/:id', components.luminanceSensor);
  app.delete('/api/components/:id', components.remove);


  app.get('/api/app/ping', appController.ping);
  app.put('/api/gpiosVirtual/:ip/:number', gpios.updateVirtualGpio);
  app.post('/api/gpiosVirtual/availables', gpios.getAvailablesGpios);
  app.get('/api/gpios/device', gpios.getDeviceGpios);
  app.get('/api/gpios/reset/out/:value', gpios.reset);
  app.put('/api/gpios/:number', gpios.set);
  app.put('/api/gpios/:number/action', gpios.changeState);
  app.get('/api/gpios/:number', gpios.get);
  app.get('/api/gpios/:number/dht', gpios.getDhtSensor);
  app.get('/api/gpios/:number/analog', gpios.getAnalogValue);




  app.use(function(err, req, res, next) {
    // treat as 404
    if (err.message && (~err.message.indexOf('not found') || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }

    console.error(err.stack);

    if (err.stack.includes('ValidationError')) {
      res.status(422).render('422', {
        error: err.stack
      });
      return;
    }

    // error page
    res.status(500).render('500', {
      error: err.stack
    });
  });

  // assume 404 since no middleware responded
  app.use(function(req, res) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
};
