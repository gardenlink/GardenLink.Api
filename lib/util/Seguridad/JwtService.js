var method = JwtService.prototype;

var jwt = require('jwt-simple');  
var moment = require('moment');  
var _config;

function JwtService(config) {
	_config = config;
}


method.CrearToken = function(user) {
	var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, "days").unix(),
  };
  
  return jwt.encode(payload, _config.seguridad.jwt.TOKEN_SECRET);
};

method.DecodificarToken = function(token) {
	
	return jwt.decode(token, _config.seguridad.jwt.TOKEN_SECRET);

};



module.exports = JwtService;