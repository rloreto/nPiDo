
const path = require('path');
const express = require('express');
const webpack = require('webpack');

const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const fs = require('fs');
const join = require('path').join;
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config/config');

const models = join(__dirname, 'server/models');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
var securityOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('certificate.pem'),
    requestCert: true
};

const app = express();
var secureServer = require('https').createServer(securityOptions, app);

// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.indexOf('.js'))
  .forEach(file => require(join(models, file)));

// Require bootstrat component
const bootstrap = require('./server/bootstrap');

// Bootstrap routes
require('./config/passport')(passport);
require('./config/express')(app, passport);


if (isDeveloping) {
  const webpackConfig = require('./webpack.config.js');

  const compiler = webpack(webpackConfig);
  const middleware = webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: 'src',
    hot: true,
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    },
    watchOptions: {
		aggregateTimeout: 300,
		poll: true
	},
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('/index.html', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(__dirname + '/dist'));
  app.get('/index.html', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

require('./config/routes')(app, passport);


app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }

  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
  var options = { server: { socketOptions: { keepAlive: 1 } } };

  var connection = mongoose.connect(config.db, options).connection;
  console.info('==> 🌎 Connected to mongodb  "%s".', config.db);

  //console.info('==> Init bootstrap...');
  //bootstrap.init();

});
