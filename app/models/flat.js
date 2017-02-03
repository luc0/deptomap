const mongoose = require('mongoose');

let model = {
	name: 'Flat',
	schema: {	
		address: String,
    price: Number,
		includedExpenses: Boolean,
    position:{
		  lat: Number,
      lng: Number
    },
    m2: Number,
    m2total: Number,
    rooms: Number,
    bathrooms: Number,
		activeDays: Number,
    isOpen: Boolean
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