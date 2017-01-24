const mongoose = require('mongoose');

class Model {

  constructor( model ) {

	let Schema = mongoose.Schema;
	let FlatSchema = new Schema(model.schema);

	FlatSchema.virtual('date')
	  .get(function(){
	    return this._id.getTimestamp();
	  });

	mongoose.model( model.name, FlatSchema);

  }

}

module.exports = Model;