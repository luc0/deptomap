import mongoose from 'mongoose';
import baseModel from './baseModel';

export default class Model extends baseModel{

  constructor() {

	var model = {
		name: 'Flat',
		schema: {	
			address: String,
			price: Number
		}
	}

  	super( model );

	var Flat = mongoose.model('Flat');

	return Flat;

  }

  sayHello() {

    return "Hello ";

  }

}
