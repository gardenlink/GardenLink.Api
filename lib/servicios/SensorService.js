/*
 * SensorService
 * https://github.com/Botanicbot/App/lib/servicios/SensorService.js
 *
 * 2015 Diego Navarro M
 *
 */


var method = SensorService.prototype;

var _logger;
var _DEBUG = true;

var async = require("async");
var _ = require("underscore");

var arduinoService;

var Models = require("../dto/Sensor.js");
var ModelsDispositivo = require("../dto/Dispositivo.js");

var Arduino = require("../util/Arduino.js");
var arduino = new Arduino();

var Auxiliares = require('../util/Auxiliares.js');
var hp = new Auxiliares();



var lstSensores = [];
var lstDevices = [];


var dispositivos = [];
var sensores = [];

var _srv;
var _dataProvider; //No me gusta tener esto duplicado

var ACTIVAR = "Activar";
var DESACTIVAR = "Desactivar";
var CONSULTAR = "Consultar";
var LLAMADA_NORMAL = "Normal";
var LLAMADA_CONFIGURACION = "Configuracion";



/*
 * SensorService
 * @constructor
 *
 * @description Inicializa y Configura los servicios que manejan los sensores
 * @dispositivos url configurado para webduino
 * @logger {object} objeto para registrar logs
 *
 */

function SensorService(dataProvider,srv,logger, callback) {
  	_srv = srv;
  	_dataProvider = dataProvider;
  	_logger = logger;
	TraerDatos(dataProvider, function(error, data) {
		if (error) return callback(error, null);
		logger.info("SensorService.Constructor : Finaliza Inicializacion de datos de SensorService");
		callback(null, data);
	});

}

function TraerDatos(dataProvider, cb) {

	dataProvider.Cache(false, function(error, data ) {
				dispositivos = data["Dispositivos"];
				sensores = data["Sensores"];
				cb(null,data);
			});
}



method.BoardInfo = function (idDevice){

	  async.each(dispositivos, function(doc, cb) {

	  	if (idDevice == doc.Id) {
		  	doc.Servicio.boardInfo(doc.Id,  function(err, result){
		  		_logger.info(result);
		  	});
	  	}
	  }, function(error) { _logger.error("SensorService.BoardInfo : error : " + error) });
};

method.Configurar = function(dp, idDevice, idSensor, tipo, callback) {
  TraerDatos(dp, function(error, data) {
      LlamarServicio(idDevice, LLAMADA_CONFIGURACION, idSensor, tipo, callback);
  });
}

method.Leer = function(idDevice, idSensor, tipo, callback) {
 	LlamarServicio(idDevice, LLAMADA_NORMAL, idSensor, tipo, callback);
}


function LlamarServicio(idDevice, modoLlamada, idSensor, accion, callback)
{
	 if (_DEBUG)
	 	_logger.info("SensorService.LlamarServicio -> PARAMS : IdDevice [" + idDevice + "] IdSensor [" + idSensor + "] Accion [" + accion + "]");


	 var sensorEncontrado = false;

	var params;
	 async.each(sensores, function(doc, cb) {
	  	if (doc.IdDispositivo == idDevice && doc.IdSensor == idSensor) {

	  		sensorEncontrado = true;
	  		if (doc.Habilitado) {


	  		var topic = arduino.Dispositivos("Board") + doc.IdDispositivo + "/" + arduino.Dispositivos("Sensor") + idSensor;
        params = "z";

  			switch(accion)
  			{
  				case "Temperatura":
  					params = params + arduino.Dispositivos("Sensor") + "z"
                   + arduino.ModoLlamada(modoLlamada) + "z"
                   + arduino.Operaciones("Sensor").Temperatura +"z"
                   + idSensor +"z";

  					break;

  				case "Humedad":
            params = params + arduino.Dispositivos("Sensor")+ "z"
                 + arduino.ModoLlamada(modoLlamada)+ "z"
                 + arduino.Operaciones("Sensor").Humedad+ "z"
                 + idSensor;+ "z";

  					break;

  				case "Lluvia":
          params = params + arduino.Dispositivos("Sensor")+ "z"
                 + arduino.ModoLlamada(modoLlamada)+ "z"
                 + arduino.Operaciones("Sensor").Lluvia+ "z"
                 + idSensor+ "z";
  					break;

  				case "PH":
          params = params + arduino.Dispositivos("Sensor")+ "z"
                 + arduino.ModoLlamada(modoLlamada)+ "z"
                 + arduino.Operaciones("Sensor").PH+ "z"
                 + idSensor+ "z";

  					break;

  				case "EC":
          params = params + arduino.Dispositivos("Sensor")+ "z"
                 + arduino.ModoLlamada(modoLlamada)+ "z"
                 + arduino.Operaciones("Sensor").EC+ "z"
                 + idSensor+ "z";

  					break;

  				case "HumedadTierra":
            params = params + arduino.Dispositivos("Sensor")+ "z"
                 + arduino.ModoLlamada(modoLlamada)+ "z"
                 + arduino.Operaciones("Sensor").HumedadTierra+ "z"
                 + idSensor+ "z";

  					break;

              case "FotoSensor":
                params = params + arduino.Dispositivos("Sensor")+ "z"
                     + arduino.ModoLlamada(modoLlamada)+ "z"
                     + arduino.Operaciones("Sensor").FotoSensor+ "z"
                     + idSensor+ "z";

      					break;

                case "CO2":
                  params = params + arduino.Dispositivos("Sensor")+ "z"
                       + arduino.ModoLlamada(modoLlamada)+ "z"
                       + arduino.Operaciones("Sensor").CO2+ "z"
                       + idSensor+ "z";

        					break;

                  case "Analogo":
                    params = params + arduino.Dispositivos("Sensor")+ "z"
                         + arduino.ModoLlamada(modoLlamada)+ "z"
                         + arduino.Operaciones("Sensor").Analogo+ "z"
                         + idSensor+ "z";

          					break;

                    case "Digital":
                      params = params + arduino.Dispositivos("Sensor")+ "z"
                           + arduino.ModoLlamada(modoLlamada)+ "z"
                           + arduino.Operaciones("Sensor").Digital+ "z"
                           + idSensor+ "z";

                      break;

  				default:
  					params = "NODEFINIDO";
  					break;
  			}

        // Finalizo el payload
        params = params + doc.Pin + "z"
        +hp.booleanToInt(doc.EsPinAnalogo) + "z"
        +doc.Pin2 + "z"
        +hp.booleanToInt(doc.EsPinAnalogo2) + "z"
        +doc.Pin3 + "z"
        +hp.booleanToInt(doc.EsPinAnalogo3) + "z"
        +arduino.cmd_escape();


			if (_DEBUG)
	  			_logger.info("SensorService.LlamarServicio() - Params: " + params);

        if (modoLlamada == LLAMADA_CONFIGURACION) {

          _srv.Publicar(topic, params, function(error, data) {
    			 		if (error)
    			 			return callback(error, null);

    			 		if (_DEBUG)
    			 			_logger.info("SensorService.LlamarServicio -> Valor retornado por metodo Publicar: " + data);


    			 		return callback(null, data);
    			 	});

        }
        else
        {

	  		_srv.Leer(topic, function(error, data) {
  			 		if (error)
  			 			return callback(error, null);

  			 		if (_DEBUG)
  			 			_logger.info("SensorService.LlamarServicio -> Valor retornado por metodo Leer: " + data);

  			 			//Guardo informacion en BD de mediciones
  			 			_dataProvider.Medicion().Save(arduino.TipoActuador("Sensor"),
  			 										  doc.IdSensor,
  			 										  doc.IdDispositivo,
  			 										  data);

  			 		return callback(null, data);
  			 	});
        }



			}
			else {
				_logger.info("SensorService.LlamarServicio : Intento de trabajar con sensor deshabilitado");
				return callback(new Error("SensorService.LlamarServicio : Intento de trabajar con sensor deshabilitado", null));
			}
	  	}

	  }, function(error) { if (error) {
	  			_logger.error("SensorService.LlamarServicio.LecturaAsyncSensores : error : " + error);
	  			return callback(error, null);
	  		}
	  		else
	  		{
	  			if (!sensorEncontrado)
					  	{
					  		_logger.info("SensorService.LlamarServicio : Parametros idSensor / idDispositivo no encontrados en BD");
					  		return callback("SensorService.LlamarServicio : Parametros idSensor / idDispositivo no encontrados en BD", null);
					  	}
	  		}


	  	 });

}

module.exports = SensorService;
