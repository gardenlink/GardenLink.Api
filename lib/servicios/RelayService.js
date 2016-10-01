
 /* RelayService
 * https://github.com/GardenLink
 *
 * 2015 Diego Navarro M
 *
 */


var method = RelayService.prototype;


var _logger;
var debugMode = true;

var async = require("async");

var arduinoService;

var ModelsDispositivo = require("../dto/Dispositivo.js");
var Models = require("../dto/Relay.js");

var _DEBUG = true;


var lstRelays = [];
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
var LLAMADA_NORMAL = "Normal";
var LLAMADA_CONFIGURACION = "Configuracion";

var Arduino = require("../util/Arduino.js");
var arduino = new Arduino();

var _dataProvider;


var _srv;



/*
 * RelayService
 * @constructor
 *
 * @description Inicializa y Configura los servicios que activan y desactivan los Reles
 * @dataProvider proveedor de datos
 * @socket instancia de socket.io para comunicar con servidor de arduinos
 * @logger {object} objeto para registrar logs
 * @callback funcion de retorno
 *
 */
function RelayService(dataProvider,srv,logger, callback) {
    _srv = srv;
   	_logger = logger;
   	_dataProvider = dataProvider;
   	TraerDatos(dataProvider, callback);
}

function TraerDatos(dataProvider, cb) {

	dataProvider.Cache(true, function(error, data ) {
				dispositivos = data["Dispositivos"];
				relays = data["Relays"];
				cb(null,data);
			});



}

method.Refrescar = function(dataProvider, callback) {
	TraerDatos(dataProvider, callback);
};

method.Activar = function(idDevice, idRelay, callback) {
 	LlamarServicio(idDevice, LLAMADA_NORMAL, idRelay, ACTIVAR, callback);
};

method.Desactivar = function(idDevice, idRelay, callback) {
 	LlamarServicio(idDevice, LLAMADA_NORMAL, idRelay, DESACTIVAR, callback);
};

method.Estado = function(idDevice, idRelay, callback)
{
  	LlamarServicio(idDevice, LLAMADA_NORMAL, idRelay, CONSULTAR, callback);
};

method.Configurar = function(dp, idDevice, idRelay, callback) {
  TraerDatos(dp, function(error, data) {
      LlamarServicio(idDevice, LLAMADA_CONFIGURACION, idRelay, CONSULTAR, callback);
  });
}

function LlamarServicio(idDevice, modoLlamada, idRelay, accion, callback)
{
	 var relayEncontrado = false;
	  		async.each(relays, function(result, callb) {
			  	if (result.IdDispositivo == idDevice && result.IdRelay == idRelay)
			  	{
			  		relayEncontrado = true;
			  		if (result.Habilitado) {

			  			var relayModel = new Models();
			            relayModel.Crear(result.IdRelay,
		            				  result.IdDispositivo,
		            				  result.Descripcion,
		            				  result.MarcaModelo,
		            				  result.Tipo,
		            				  result.Pin,
		            				  result.EsPinAnalogo,
		            				  result.Habilitado,
		            				  result.Activo,
		            				  result.EsInverso);

			  			var params;
			  			var pRelay = arduino.Dispositivos("Relay");
			  			var topic = arduino.Dispositivos("Board") + result.IdDispositivo + "/" + arduino.Dispositivos("Relay") + idRelay;
			  			var activo;
			  			switch(accion)
			  			{
			  				case ACTIVAR:
                  if (result.EsInverso) {
			  					  params = pRelay+ arduino.ModoLlamada(modoLlamada)  +  arduino.Operaciones("Relay").Apagar + idRelay + result.Pin + arduino.cmd_escape();
                    _logger.info("Relay Inverso En Encender -> mando Apagar:");
                  }
                  else
                    params = pRelay+arduino.ModoLlamada(modoLlamada)  + arduino.Operaciones("Relay").Encender + idRelay + result.Pin + arduino.cmd_escape();
			  					activo = "true";
			  					break;

			  				case DESACTIVAR:
                  if (result.EsInverso) {
			  					  params = pRelay+arduino.ModoLlamada(modoLlamada)  + arduino.Operaciones("Relay").Encender + idRelay + result.Pin + arduino.cmd_escape();
                    _logger.info("Relay Inverso En Apagar -> mando encender:");
                  }
                  else
                    params = pRelay+arduino.ModoLlamada(modoLlamada)  + arduino.Operaciones("Relay").Apagar + idRelay + result.Pin + arduino.cmd_escape();
			  					activo = "false";
			  					break;

			  				case CONSULTAR:
			  					topic = arduino.Dispositivos("Board") + result.IdDispositivo + "/" + arduino.Dispositivos("Relay") + idRelay + "/" +arduino.Operaciones("Relay").Consultar;
			  					params = pRelay+arduino.ModoLlamada(modoLlamada)  + arduino.Operaciones("Relay").Consultar + idRelay + result.Pin + arduino.cmd_escape();
			  					break;
			  			}


			  			if (_DEBUG)
	 						_logger.info("RelayService.LlamarServicio - Params: " + params);


			  			 	if (accion == CONSULTAR) {
				  			 	_srv.Leer(topic, function(error, data) {
				  			 		if (error)
				  			 			return callback(error, null);

				  			 		if (_DEBUG)
				  			 			_logger.info("RelayService.LlamarServicio -> Valor retornado por metodo Leer: " + data);
				  			 		return callback(null, relayModel.Objeto());
				  			 	});
			  			 	}
			  			 	else
			  			 	{
			  			 		_srv.Publicar(topic, params, function(error, data) {
				  			 		if (error)
				  			 			return callback(error, null);

				  			 		if (_DEBUG)
				  			 			_logger.info("RelayService.LlamarServicio -> Valor retornado por metodo Publicar: " + data);


				  			 		/************ GUARDAR INFORMACION EN BD solo si estamos sincronizados con Arduino ***************/
				  			 		var status = data.substring(13,14);

				  			 		if (status == "Y") {
				  			 			if (_DEBUG)
				  			 				_logger.info("GUARDO EN BD !! ");


				  			 			//aplico accion si es que voy a modificar
				  			 			relayModel.Modificar(relayModel.Objeto().IdRelay,
						            				  relayModel.Objeto().IdDispositivo,
						            				  relayModel.Objeto().Descripcion,
						            				  relayModel.Objeto().MarcaModelo,
						            				  relayModel.Objeto().Tipo,
						            				  relayModel.Objeto().Pin,
						            				  relayModel.Objeto().EsPinAnalogo,
						            				  relayModel.Objeto().Habilitado,
						            				  activo,
						            				  relayModel.Objeto().EsInverso);

					  			 		_dataProvider.Relay().Save(
				            				  relayModel.Objeto().IdRelay,
				            				  relayModel.Objeto().IdDispositivo,
				            				  relayModel.Objeto().Descripcion,
				            				  relayModel.Objeto().MarcaModelo,
				            				  relayModel.Objeto().Tipo,
				            				  relayModel.Objeto().Pin,
				            				  relayModel.Objeto().EsPinAnalogo,
				            				  relayModel.Objeto().Habilitado,
				            				  relayModel.Objeto().Activo,
				            				  relayModel.Objeto().EsInverso);

				            			_dataProvider.Medicion().Save(arduino.TipoActuador("Relay"), relayModel.Objeto().IdRelay, relayModel.Objeto().IdDispositivo, relayModel.Objeto().Activo);
			            		   }
				  			 		return callback(null, relayModel.Objeto());
				  			 	});
			  			 	}

					}
					else {
						_logger.info("RelayService.LlamarServicio : Intento de trabajar con relay deshabilitado");
						return callback(new Error("RelayService.LlamarServicio : Intento de trabajar con relay deshabilitado", null));
					}
			  	}

			  }, function(error) { if (error) {
			  		_logger.error("RelayService.LlamarServicio.LecturaAsyncRelays : error : " + error);
			  		return callback(error, null);
			  		}
			  	 });

	  			//Reviso si se encontro el relay luego del loop
			  	if (!relayEncontrado)
			  	{
			  		_logger.info("RelayService.LlamarServicio : Parametros idDispositivo o idRelay no encontrados en BD");
			  		return callback("RelayService.LlamarServicio : Parametros idDispositivo o idRelay no encontrados en BD", null);
			  	}

}





module.exports = RelayService;
