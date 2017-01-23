'use strict';

var _flat = require('../models/flat');

var _flat2 = _interopRequireDefault(_flat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toby = new _flat2.default('Toby');

console.log(toby.bark());