var moment = require('moment'); 
var Service = require('../lib/util/seguridad/JwtService.js');



module.exports = function(app, config,passport,util,TwitterStrategy,auxiliares){

var service = new Service(config);

//Por defecto
app.get('/', ensureAuthenticated, function(req, res){
  res.render('index', { user: req.user });
});

app.post('/auth/login', function(req,res) {
	return res.status(200).send({token: service.CrearToken("demo")});
});


function ensureAuthenticated(req, res, next) {
  
  if(!req.headers.authorization) {
    return res
      .status(403)
      .send({message: "La peticion no tiene cabecera de autorizacion"});
  }
  
  var token = req.headers.authorization.split(" ")[1];
  var payload = service.DecodificarToken(token);
  
  if(payload.exp <= moment().unix()) {
     return res
         .status(401)
        .send({message: "El token ha expirado"});
  }
  
  req.user = payload.sub;
  next();
  
  
  }
  
  


};