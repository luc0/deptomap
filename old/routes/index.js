var express = require('express');
var router = express.Router();

import { FlatCtrl } from "../controllers/FlatController";

/* GET home page. */

router.get('/', FlatCtrl.showMap );

/*
function(req, res) {
  res.render('index', { title: 'Express' });
}
*/
module.exports = router;
