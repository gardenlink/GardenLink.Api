var moment = require('moment'); 
var Service = require('../lib/util/seguridad/JwtService.js');



module.exports = function(app, config,passport,util,auxiliares){

var service = new Service(config);

//Por defecto
app.get('/', ensureAuthenticated, function(req, res){
  res.render('index', { user: req.user });
});

/**
 * @api {post} /v1/auth/login Login
 * @apiGroup Autenticacion 
 * @apiSuccess {json} token JWT
 * @apiVersion 0.0.1
 * @apiName Login
 * @apiDescription Login para obtener un token
 * @apiParam usuario {String}
 * @apiParam password {String}
 * @apiExample {curl} Example usage:
 *     curl --data "usuario=juanperez&password=jp123" http://gardenlink.cl:9000/api/v1/auth/login
 */
app.post('/api/v1/auth/login', function(req,res) {
  if (req.body.usuario == "juanperez" && req.body.password == "jp123") {
	return res.status(200).send({token: service.CrearToken("demo")});
  }
  else
  {
   res.status(401).send({message: "No autorizado"}); 
  }
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