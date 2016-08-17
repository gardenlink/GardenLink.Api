
 /* DeviceService
 * https://github.com/GardenLink
 * 
 * 2016 Diego Navarro M
 *
 */


var method = DeviceService.prototype;


var _logger;
var debugMode = true;

var async = require("async");

var arduinoService; 

var ModelsDispositivo = require("../dto/Dispositivo.js");
var Models = require("../dto/Dispositivo.js");

var _DEBUG = true;

var lstDevices = [];


var dispositivos = [];
var relays = [];

var ANALOG_ON = 255;
var ANALOG_OFF = 0;

var DIGITAL_ON = 1;
var DIGITAL_OFF = 0;

var ACTIVAR = "Activar";
var DESACTIVAR = "Desactivar";
var CONSULTAR = "Consultar";

var Arduino = require("../util/Arduino.js");
var arduino = new Arduino();

var _dataProvider;


var _srv;



/*
 * DeviceService
 * @constructor
 *
 * @description Inicializa y Configura los servicios que activan y desactivan los Reles
 * @dataProvider proveedor de datos
 * @socket instancia de socket.io para comunicar con servidor de arduinos
 * @logger {object} objeto para registrar logs
 * @callback funcion de retorno
 *
 */
function DeviceService(dataProvider,srv,logger, callback) {
    _srv = srv;
   	this._logger = logger;
   	TraerDatos(dataProvider, callback);
   	_dataProvider = dataProvider;
}

function TraerDatos(dataProvider, cb) {
	dataProvider.Device().GetAll(function(error, data ) {
				dispositivos = data;
				cb(null,data);
			});
}


method.Activar = function(idDevice, idRelay, callback) {
 	LlamarServicio(idDevice, idRelay, ACTIVAR, callback);
};

method.Desactivar = function(idDevice, idRelay, callback) {
 	LlamarServicio(idDevice, idRelay, DESACTIVAR, callback);
};

method.Ip = function(idDevice, callback)
{
  	LlamarServicio(idDevice, "IP", callback);
};

function LlamarServicio(idDevice, accion, callback)
{
	TraerDatos(_dataProvider, function(error, data) {
		if (error) {
			return callback(new Error("DeviceService.LlamarServicio : Error en llamada a TraerDatos", null));
		}
		
		
		var deviceEncontrado = false;
	 
	 if (_DEBUG) 
		console.log("DeviceService.LlamarServicio -> Parametros [" + idDevice + "][" + accion + "]");
		
		
	  		async.each(dispositivos, function(result, callb) {

			  	if (result.Id == idDevice)
			  	{
			  		deviceEncontrado = true;
			  		if (result.Habilitado && (result.Habilitado == "true" || result.Habilitado == true)) {
			  			
			            				  
			  			var params;
			  			var pBoard = arduino.Dispositivos("Board");
			  			var topic = arduino.Dispositivos("Board") + result.Id + "/status";


						if (accion == "IP") {
							 
							_srv.Leer(topic, function(error, data) {
				  			 		if (error)
				  			 			return callback(error, null);
				  			 	

				  			 		var deviceModel = new Models();
						            deviceModel.Crear(result.Id,
						            				  result.Nombre,
						            				  result.Tipo,
						            				  data,
						            				  result.Puerto,
						            				  result.Habilitado,
						            				  result.Estado,
						            				  result.FrecuenciaMuestreo
						            				  );	


				  			 		_dataProvider.Device().Save(deviceModel.Objeto().Id,
				  			 			  deviceModel.Objeto().Nombre,
			            				  deviceModel.Objeto().Tipo,
			            				  deviceModel.Objeto().Ip,
			            				  deviceModel.Objeto().Puerto,
			            				  deviceModel.Objeto().Habilitado,
			            				  deviceModel.Objeto().Estado,
			            				  deviceModel.Objeto().FrecuenciaMuestreo);
				  			 		
				  			 		
				  			 		
				  			 		if (_DEBUG)
				  			 			console.dir("DeviceService.LlamarServicio -> Valor retornado por metodo Leer: " + data);
				  			 		
				  			 		return callback(null, deviceModel.Objeto());
				  			 	});
						}
			  			
			  			 	
			  			 	
					}
					else {
						console.log("DeviceService.LlamarServicio : Intento de trabajar con dispositivo deshabilitado");
						return callback(new Error("DeviceService.LlamarServicio : Intento de trabajar con dispositivo deshabilitado", null));
					}
			  	}
			  	
			  }, function(error) { if (error) { 
			  		console.log("DeviceService.LlamarServicio.LecturaAsyncRelays : error : " + error);
			  		return callback(error, null);
			  		}
			  		else
			  		{
			  			if (!deviceEncontrado)
					  	{
					  		console.log("DeviceService.LlamarServicio : Parametros idDispositivo no encontrados en BD");
					  		return callback("DeviceService.LlamarServicio : Parametros idDispositivo no encontrados en BD", null);
					  	}
			  		}	
			  	 });
	  		
			
	});
	 
	  
}


module.exports = DeviceService;