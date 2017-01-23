"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Example model

// import mongoose from 'mongoose';
// //var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// var FlatSchema = new Schema({
//   address: String,
//   price: Number
// });

// FlatSchema.virtual('date')
//   .get(function(){
//     return this._id.getTimestamp();
//   });

// mongoose.model('Flat', FlatSchema);

var _class = function () {
  function _class(name) {
    _classCallCheck(this, _class);

    this.name = name;
  }

  _createClass(_class, [{
    key: "bark",
    value: function bark() {
      return "Wah wah, I am " + this.name;
    }
  }]);

  return _class;
}();

exports.default = _class;