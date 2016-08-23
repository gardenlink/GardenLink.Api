var method = Sensor.prototype;


var Auxiliares = require('../util/Auxiliares.js');
var _ = require('underscore');
var hp = new Auxiliares();

var objSensor;
var valoresDefault;

function Sensor()
{
 objSensor = new Object({
   IdSensor : Number
  , IdDispositivo : String
  , Descripcion : String
  , MarcaModelo : String
  , Tipo : String
  , Pin : Number
  , EsPinAnalogo : Boolean
  , Habilitado : Boolean
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
	var keys = _.keys(objSensor);
	_.extend(objSensor, _.pick(mapped, keys));

	//Indicar los valores por defecto del objeto
	//usado para los atributos obligatorios
};



method.Crear = function(IdSensor,IdDispositivo, Descripcion, MarcaModelo, Tipo,Pin,EsPinAnalogo, Habilitado)
{

  objSensor.IdSensor = parseInt(IdSensor);
  objSensor.IdDispositivo = IdDispositivo;
  objSensor.Descripcion = Descripcion;
  objSensor.MarcaModelo = MarcaModelo;
  objSensor.Tipo = Tipo;
  objSensor.Pin = Pin;
  objSensor.EsPinAnalogo = hp.toBoolean(EsPinAnalogo);
  objSensor.Habilitado = hp.toBoolean(Habilitado);
};

method.Objeto = function()
{
  return objSensor;
};

method.Modificar = function(IdSensor,IdDispositivo, Descripcion, MarcaModelo, Tipo,Pin,EsPinAnalogo,Habilitado)
{
  //objSensor.IdSensor = IdSensor;
  objSensor.IdDispositivo = IdDispositivo;
  objSensor.Descripcion = Descripcion;
  objSensor.MarcaModelo = MarcaModelo;
  objSensor.Tipo = Tipo;
  objSensor.Pin = Pin;
  objSensor.EsPinAnalogo = hp.toBoolean(EsPinAnalogo);
  objSensor.Habilitado = hp.toBoolean(Habilitado);
};


method.Validar = function(obj)
{
  if (!obj.IdSensor)
  {
    console.log("dto.Sensor : La property IdSensor no puede ser null");
    return false;
  }
  return true;

}

module.exports = Sensor;
