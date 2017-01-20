//  extends Controller
export default class Flat {

  constructor() {
    super();
  }

  showMap( req, res ){
    return res.json({
      flats: [{
        address: 'Av. Libertador 350',
        price: 5000
      }]
    });
  }

};