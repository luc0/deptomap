const mongoose = require('mongoose');

let model = {
	name: 'Flat',
	schema: {	
		address: String,
    price: String,
		includedExpenses: Boolean,
		lat: Number,
    lng: Number,
    m2: String,
    m2total: String,
    rooms: String,
    bathrooms: String,
		activeDays: String
	}
}

let Schema = mongoose.Schema;
let FlatSchema = new Schema(model.schema);

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