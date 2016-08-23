var method = Medicion.prototype;

var objMedicion;

var Auxiliares = require('../util/Auxiliares.js');
var _ = require('underscore');
var hp = new Auxiliares();

var tipoActuador = {
	  SENSOR : "1",
	  RELAY :  "2",
	  MOTOR :  "3",
	  BOMBA :  "4"
	};

function Medicion()
{
 objMedicion = new Object({
    Id             : Number
  , IdTipoActuador : Number
  , IdActuador	   : Number
  , IdDispositivo  : String
  , TimeStamp      : { type: Date, default: Date.now }
  , Valor          : Number
});
}




method.CrearObjeto = function(obj) {

	//valido el objeto y aplico las conversiones para valores boleanos
	var mapped = _.mapObject(obj, function(val, key) {
			if (hp.isBoolean(val))
				return hp.toBoolean(val);
			else
				return val;
	});
	//extraigo las keys que estan definidas en el constructor
	//y las asigno al objeto final
	var keys = _.keys(objMedicion);
	_.extend(objMedicion, _.pick(mapped, keys));

	//Indicar los valores por defecto del objeto
	//usado para los atributos obligatorios
};



method.Crear = function(id,idTipoActuador, idActuador, idDispositivo, TimeStamp, Valor)
{
  objMedicion.Id = id;
  objMedicion.IdTipoActuador = idTipoActuador;
  objMedicion.IdActuador = idActuador;
  objMedicion.IdDispositivo = idDispositivo;
  objMedicion.TimeStamp = TimeStamp;
  objMedicion.Valor = Valor;

};

method.Objeto = function()
{
  return objMedicion;
};

method.TipoActuador = function()
{
	return tipoActuador;
}

method.GetTipoActuadorByName = function(tipo)
{
	return tipoActuador[tipo];
}

method.Validar = function(obj)
{
  var strError;

  if (!obj.IdActuador)
  {
  	strError = "dto.Medicion : La property IdActuador no puede ser null";
  	console.log(strError);
  	return false;
  }

  if (!obj.IdTipoActuador)
  {
  	strError = "dto.Medicion : La property IdTipoActuador no puede ser null";
    console.log(strError);
    return false;
  }

  return true;
}


module.exports = Medicion;
