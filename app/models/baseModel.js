import mongoose from 'mongoose';

export default class {

  constructor( model ) {

	var Schema = mongoose.Schema;
	var FlatSchema = new Schema(model.schema);

	FlatSchema.virtual('date')
	  .get(function(){
	    return this._id.getTimestamp();
	  });

	mongoose.model( model.name, FlatSchema);

  }

}