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

	 SyncDispositivos(dataProvider,baseURL,config,logger);
	 //SyncRelays();

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

					 if (data.length < 100);

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
		dataProvider.Relays().GetAll(function(err, data) {
			 if (data && data.length > 0) {


				 endpoint = baseURL + "dispositivos";
				 if (_DEBUG)
					console.log("DBSYNC.Device.endpoint :" + endpoint);

				 async.each(data, function(item, callback){
						// Call an asynchronous function

						if (data.length < 100);

						var relayDto = new RelayDTO();
						relayDto.CrearObjeto(item);
						console.dir(relayDto.Objeto());

						CallService(endpoint, relayDto.Objeto(), callback);

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
				callback(null, data);
		 }
	 }).on('error', function(error, response) {
		 console.log("DBSync.CallService : " + error);
		 return callback(error, null);
	 });

 }

module.exports = DBSync;
