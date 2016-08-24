/*
 * DBSYNC
 * Sincroniza bases desde Nedb a Mongo
 *
 */
var method = DBSync.prototype;

var later = require('later'); // gestion de tareas
var async = require('async');
var req = require('restler');
var Auxiliares = require('./Auxiliares');
var _logger;
var _mailer;

var _DEBUG = false;

var DispositivoDTO = require('../dto/Dispositivo.js');
var RelayDTO = require('../dto/Relay.js');
var SensorDTO = require('../dto/Sensor.js');
var MedicionDTO = require('../dto/Medicion.js');

var hp = new Auxiliares();

/*
 * Temporizador
 * @constructor
 *
 * @description Inicializa y Configura el programador
 * @apiParam {Number} horarios durante un dia determinado
 * @apiParam {Number} duracion cantidad minutos que durará la tarea
 * @apiParam {Number} numeroDias cantidad de dias que se programará la tarea.
 *
 */
function DBSync(dataProvider, config, logger, callback) {

	 //Temporizador
	 if (config.sync && config.sync.Debug)
	 	_DEBUG = hp.toBoolean(config.sync.Debug);

	 if (config.sync && (config.sync.Habilitado == "true" || config.sync.Habilitado == true)) {

		 var tiempo = 5;
		 if (config.sync && config.sync.Intervalo) {
		 		tiempo = parseInt(config.sync.Intervalo);

				if (_DEBUG)
					console.log("DBSync.Setup() -> Intervalo de sincronizacion : " + tiempo);
		 }

		 var _configCheckUpdates = later.parse.recur().every(tiempo).minute();
		 tMonitoreo = later.setInterval(function() { SincronizarBases(dataProvider,config, logger); }, _configCheckUpdates);
 	 }
	 else
	 {
		 if (_DEBUG)
		 	console.log("DBSync.Setup() -> Sincronizacion deshabilitada..");
	 }
	 if (callback)
	 	return callback(null, "Ok");
}

function SincronizarBases(dataProvider, config,logger) {

	 var baseURL = config.sync.TargetHost + ":" + config.sync.TargetPort + config.sync.BaseURL;

	 if (config.sync && (config.sync.Entidades.Dispositivos == "true" || config.sync.Entidades.Dispositivos == true))
	 	SyncDispositivos(dataProvider,baseURL,config,logger);

	 if (config.sync && (config.sync.Entidades.Relays == "true" || config.sync.Entidades.Relays == true))
	 	SyncRelays(dataProvider, baseURL, config, logger);

	 if (config.sync && (config.sync.Entidades.Sensores == "true" || config.sync.Entidades.Sensores == true))
	 	SyncSensores(dataProvider, baseURL, config, logger);

	 if (config.sync && (config.sync.Entidades.Mediciones == "true" || config.sync.Entidades.Mediciones == true))
	 	SyncMediciones(dataProvider, baseURL, config, logger);
}




 function SyncDispositivos(dataProvider, baseURL, config, logger) {

	 //Configurar entidades
	 //Dispositivos
	 var endpoint;
	 dataProvider.Device().GetAll(function(err, data) {
			if (data && data.length > 0) {


				endpoint = baseURL + "dispositivos";

				if (_DEBUG)
				 	console.log("DBSYNC.Device.endpoint :" + endpoint);

				async.each(data, function(item, callback){
					 // Call an asynchronous function

					 var dispositivoDto = new DispositivoDTO();
					 dispositivoDto.CrearObjeto(item);

					 CallService(endpoint, dispositivoDto.Objeto(), callback);

				 },
				 // 3rd param is the function to call when everything's done
				 function(err){
					 // All tasks are done now
					 if (err) {
						 	console.log("ERROR : " + err);
					 }
					 else {
							 console.log("DBSYNC.Device.Dispositivos : Sincronizacion Completada");
					 }

				 });
			}
			else
			{
				console.log("DBSYNC.Device : No existen datos para sincronizar");
			}
		});
	}

	function SyncRelays(dataProvider, baseURL, config, logger) {

		//Configurar entidades
		//Dispositivos
		var endpoint;
		dataProvider.Relay().GetAll(function(err, data) {
			 if (data && data.length > 0) {

				 endpoint = baseURL + "relays";
				 if (_DEBUG)
					console.log("DBSYNC.Relay.endpoint :" + endpoint);

				 async.each(data, function(item, callback){
						// Call an asynchronous function

						var relayDto = new RelayDTO();
						relayDto.CrearObjeto(item);

						CallService(endpoint, relayDto.Objeto(), callback);

					},
					// 3rd param is the function to call when everything's done
					function(err){
						// All tasks are done now
						if (err) {
							console.log("DBSYNC.SyncRelays -> ERROR : " + err);
						}
						else {
								console.log("DBSYNC.SyncRelays : Sincronizacion Completada");
						}

					});
			 }
			 else
			 {
				 console.log("DBSYNC.SyncRelays : No existen datos para sincronizar");
			 }
		 });
	 }



	 function SyncSensores(dataProvider, baseURL, config, logger) {

 		//Configurar entidades
 		//Dispositivos
 		var endpoint;
 		dataProvider.Sensor().GetAll(function(err, data) {
 			 if (data && data.length > 0) {

 				 endpoint = baseURL + "sensores";
 				 if (_DEBUG)
 					console.log("DBSYNC.Sensor.endpoint :" + endpoint);

 				 async.each(data, function(item, callback){
 						// Call an asynchronous function

 						var sensorDto = new SensorDTO();
 						sensorDto.CrearObjeto(item);

 						CallService(endpoint, sensorDto.Objeto(), callback);

 					},
 					// 3rd param is the function to call when everything's done
 					function(err){
 						// All tasks are done now
 						if (err) {
 							console.log("DBSYNC.SyncSensores -> ERROR : " + err);
 						}
 						else {
 								console.log("DBSYNC.SyncSensores : Sincronizacion Completada");
 						}

 					});
 			 }
 			 else
 			 {
 				 console.log("DBSYNC.SyncSensores : No existen datos para sincronizar");
 			 }
 		 });
 	 }


	 function SyncMediciones(dataProvider, baseURL, config, logger) {

			//Configurar entidades
			//Dispositivos
			var endpoint;
			var sortObject = {};
			var stype = "TimeStamp";
			var sdir = "-1";
			sortObject[stype] = sdir;
			var filter = {};
			filter.sortObject = sortObject;

			dataProvider.Medicion().GetLastN(filter, 20, function(err, data) {
				 if (data && data.length > 0) {

					 var largoDataset = data.length;
						if (_DEBUG)
							console.log("DBSYNC.Medicion largo dataset :" + largoDataset);


					 async.each(data, function(item, callback){
							// Call an asynchronous function
							if (item && (item.IdTipoActuador == 1 || item.IdTipoActuador == "1"))
								endpoint = baseURL + "sensores/mediciones/sync";

							else if (item && (item.IdTipoActuador == 2 || item.IdTipoActuador == "1"))
								endpoint = baseURL + "relays/mediciones/sync";
							else {
								endpoint = "error";
							}



							if (endpoint != "error") {
								var medicionDto = new MedicionDTO();
								medicionDto.CrearObjeto(item);
								//if (_DEBUG)
			  					//console.log("DBSYNC.Mediciones.endpoint :" + endpoint);
								CallService(endpoint, medicionDto.Objeto(), callback);
							}

						},
						// 3rd param is the function to call when everything's done
						function(err){
							// All tasks are done now
							if (err) {
								console.log("DBSYNC.SyncMediciones -> ERROR : " + err);
								return;
							}
							else {
									console.log("DBSYNC.SyncMediciones : Sincronizacion Completada");
							}

						});
				 }
				 else
				 {
					 console.log("DBSYNC.SyncMediciones : No existen datos para sincronizar");
				 }
			 });
		 }


 function CallService(url, data, callback) {


	 req.post(url, { data : data }
	 ).on('complete', function(data) {
		 if (data instanceof Error) {
			 if (_DEBUG)
				 console.log("DBSync.CallService : Error al grabar registro, Error : " + data);

			 return callback(data, null);
		 }
		 else
		 {
				return callback(null, data);
		 }
	 }).on('error', function(error, response) {
		 console.log("DBSync.CallService : " + error);
		 return callback(error, null);
	 });

 }

module.exports = DBSync;
