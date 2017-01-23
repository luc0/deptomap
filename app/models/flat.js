import mongoose from 'mongoose';
//var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FlatSchema = new Schema({
  address: String,
  price: Number
});

FlatSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Flat', FlatSchema);