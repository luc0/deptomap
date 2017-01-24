const mongoose = require('mongoose');

let model = {
	name: 'Flat',
	schema: {	
		address: String,
		price: Number,
		lat: Number,
		lng: Number
	}
}

let Schema = mongoose.Schema;
let FlatSchema = new Schema(model.schema);

FlatSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model( model.name, FlatSchema);

class Model {

  constructor( address, price, lat, lng ) {

  	this.address = address;
  	this.price = price;
  	this.lat = lat;
  	this.lng = lng;

  }

}


//module.exports = Model;