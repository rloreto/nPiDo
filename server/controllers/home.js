const wrap = require('co-express');

exports.index = wrap(function* (req, res) {
  res.render('index');
});
