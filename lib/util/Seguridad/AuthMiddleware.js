var method = AuthMiddleware.prototype;

var jwt = require('jwt-simple');
var Service = require('./JwtService.js');   
var moment = require('moment');  
var Helper = require('../Auxiliares.js');
var helper = new Helper();

var _config;
var service;
var habilitado

function AuthMiddleware(config) {
	_config = config;
	habilitado = helper.toBoolean(_config.seguridad.habilitado);
	if (habilitado == false) {
		console.log("Servicio de seguridad de api deshabilitado");
	}
	service = new Service(_config);
}

method.EnsureAuthenticated = function(req, res, next){

  if (habilitado == true) {
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
  }
  
  next();

};



module.exports = AuthMiddleware;