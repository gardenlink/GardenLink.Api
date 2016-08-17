var method = Relay.prototype;

var Auxiliares = require('../util/Auxiliares.js');
var _ = require('underscore');
var hp = new Auxiliares();

var objRelay;
var valoresDefault;


function Relay()
{
	 objRelay = new Object({
	   IdRelay : Number
	  , IdDispositivo : String
	  , Descripcion : String
	  , MarcaModelo : String
	  , Tipo : String
	  , Pin : Number
	  , EsPinAnalogo : Boolean
	  , Habilitado : Boolean
	  , Activo : Boolean
	  , EsInverso : Boolean
	});

	valoresDefault = new Object({
		IdRelay : -1,
		IdDispositivo : "999",
		Descripcion : "Default",
		Tipo : "4 Relay Shield",
		Pin : -1,
		EsPinAnalogo: false,
		Habilitado: false,
		Activo : false,
		EsInverso : false
	});

	//Indicar los valores por defecto del objeto
	//usado para los atributos obligatorios
	/*
	_.defaults(objRelay,
			{
				IdRelay : -1,
				IdDispositivo : "999",
				Descripcion : "Default",
				Tipo : "4 Relay Shield",
				Pin : -1,
				EsPinAnalogo: false,
				Habilitado: false,
				Activo : false,
				EsInverso : false
			}); */
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
	var keys = _.keys(objRelay);
	_.extend(objRelay, _.pick(mapped, keys));

	//Indicar los valores por defecto del objeto
	//usado para los atributos obligatorios


	_.defaults(objRelay,valoresDefault);

/* //mejor usar map
	var keys = _.keys(objRelay);
	_.extend(objRelay, _.pick(obj, keys));

	_.each(objRelay, function (val, prop) {
			if (hp.isBoolean(val)) {
				objRelay[prop] = hp.toBoolean(val);
			}
			else {
				objRelay[prop] = val;
			}
	});

	*/
};


method.Crear = function(IdRelay,IdDispositivo, Descripcion, MarcaModelo, Tipo,Pin,EsPinAnalogo, Habilitado, Activo, EsInverso)
{

  objRelay.IdRelay = parseInt(IdRelay);
  objRelay.IdDispositivo = IdDispositivo;
  objRelay.Descripcion = Descripcion;
  objRelay.MarcaModelo = MarcaModelo;
  objRelay.Tipo = Tipo;
  objRelay.Pin = Pin;
  objRelay.EsPinAnalogo = hp.toBoolean(EsPinAnalogo);
  objRelay.Habilitado = hp.toBoolean(Habilitado);
  objRelay.Activo = hp.toBoolean(Activo);
  objRelay.EsInverso = hp.toBoolean(EsInverso);
};

method.Objeto = function()
{
  return objRelay;
};

method.Modificar = function(IdRelay,IdDispositivo, Descripcion, MarcaModelo, Tipo,Pin,EsPinAnalogo,Habilitado,Activo,EsInverso)
{
  objRelay.IdRelay = IdRelay;
  objRelay.IdDispositivo = IdDispositivo;
  objRelay.Descripcion = Descripcion;
  objRelay.MarcaModelo = MarcaModelo;
  objRelay.Tipo = Tipo;
  objRelay.Pin = Pin;
  objRelay.EsPinAnalogo = hp.toBoolean(EsPinAnalogo);
  objRelay.Habilitado = hp.toBoolean(Habilitado);
  objRelay.Activo = hp.toBoolean(Activo);
  objRelay.EsInverso = hp.toBoolean(EsInverso);
};

function Reparar() {

}

method.Validar = function(obj)
{


  if (!obj.IdRelay)
	  {
	  	var str = "dto.Relay : La property IdRelay no puede ser null";

	    console.log(str);
	    return false;
	  }

  return true;

}

module.exports = Relay;
