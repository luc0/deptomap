const mongoose = require('mongoose');

let model = {
	name: 'Flat',
	schema: {	
		address: String,
		price: String,
		lat: Number,
    lng: Number,
    m2: String,
    m2total: String,
    rooms: String,
		bathrooms: String
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