/*
 * DBSYNC
 * Sincroniza bases desde Nedb a Mongo
 *
 */


var method = DBSync.prototype;
var later = require('later'); // gestion de tareas
var async = require('async');
var _logger;
var _mailer;

var DispositivoDTO = require('../dto/Dispositivo.js');


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
function DBSync(mainDataProvider, config, logger, callback) {

	 //Preparar configuraciones datasource
	 var DataProviderMaster = require('../dao/DataProvider.js');
	 var dataProviderMaster;
	 var DataProviderSlave = require('../dao/DataProvider.js');
	 var dataProviderSlave;

	 //Reviso quien es el datasource master y confguro el slave
	 if (config.datasource.NEDB.Habilitado == "true") {
		 console.log("El dataprovider master es NEDB");
		 dataProviderMaster = mainDataProvider;
		 //Preparo el slave
		 config.datasource.MONGO.Habilitado = "true";
		 config.datasource.NEDB.Habilitado = "false";
		 dataProviderSlave = new DataProviderSlave(logger, config, null);
	 }
	 else
	 {
		 //Reviso quien es el datasource master y confguro el slave
		 if (config.datasource.MONGO.Habilitado == "true") {
			 console.log("El dataprovider master es MONGO");
			 dataProviderMaster = mainDataProvider;

			 //Preparo el slave
			 config.datasource.MONGO.Habilitado = "false";
			 config.datasource.NEDB.Habilitado = "true";
			 dataProviderSlave = new DataProviderSlave(logger, config, null);
		 }
 	 }


	//SincronizarBases(dataProviderMongo, dataProviderNed, logger);
	 //Temporizador
	 var _configCheckUpdates = later.parse.recur().every(1).minute();
	 //tMonitoreo = later.setInterval(function() { SincronizarBases(dataProviderMaster,dataProviderSlave, logger); }, _configCheckUpdates);

	 if (callback)
	 	return callback(null, "Ok");
}

function SincronizarBases(dataProviderMaster, dataProviderSlave,logger) {

	//Configurar entidades
	//Dispositivos
	dataProviderMaster.Device().GetAll(function(err, data) {
		 if (data && data.length > 0) {

			 async.each(data, function(item, callback){
			    // Call an asynchronous function
					var dispositivoDto = new DispositivoDTO();
					dispositivoDto.CrearObjeto(item);
					console.dir(dispositivoDto.Objeto());
					dataProviderSlave.Device().SaveObject(dispositivoDto.Objeto(), function (error, data) {
						if (error)
							console.log("ERROR : " + error);
						else
						{
							console.log("Finalizado.. item detalle: ");
							//console.dir(dispositivoDto.Objeto());

						}
						// Async call is done, alert via callback
				    //callback();
					});

			  },
			  // 3rd param is the function to call when everything's done
			  function(err){
			    // All tasks are done now
					if (err) {
						console.log("ERROR : " + err);
					}
					else {
							console.log("DBSYNC.Device : Sincronizacion Completada");
					}

			  });
		 }
		 else
		 {
			 console.log("DBSYNC.Device : No existen datos para sincronizar");
		 }
	 });
 }

module.exports = DBSync;
