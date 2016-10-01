/*
 * Temporizador
 * https://github.com/Botanicbot/App/Temporizador.js
 *
 * 2015 Diego Navarro M
 *
 */


var method = Temporizador.prototype;
var later = require('later'); // gestion de tareas
var _logger;
var _mailer;

var _dataProvider;
var _serviceProvider;
var _temporizadores;

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
function Temporizador(config, logger, mailer, dataProvider, serviceProvider, callback) {

	 this._logger = logger;
	 this._mailer = mailer;
   this._dataProvider= dataProvider;
   this._serviceProvider = serviceProvider;

	 if (config.temporizador_habilitado == "true" || config.temporizador_habilitado == true) {
		 var _configCheckUpdates = later.parse.recur().every(1).minute();
		 ActualizarTemporizadores(dataProvider, logger, mailer, serviceProvider, callback);
		 tMonitoreo = later.setInterval(function() { ActualizarTemporizadores(dataProvider, logger, mailer, serviceProvider,callback); }, _configCheckUpdates);
 	 }
}

function ActualizarTemporizadores(dataProvider, logger, mailer, serviceProvider, callback) {

 dataProvider.TipoActuador().Find({IdTipoActuador : 2}, function (err, data){
	 var filter = {};

	 if (err)
	 	return callback("Temporizador.ActualizarTemporizadores().TipoActuador() : Detalle Error: " + err, null);

	 if (data)
	 {
		 filter.IdTipoActuador = data.IdTipoActuador;
		 dataProvider.Temporizador().GetCollection(filter, function(err, data) {
			 if (err)
			 	return callback("Temporizador.ActualizarTemporizadores().Temporizador() : Detalle Error: " + err, null);

				if (data && data.length > 0) {
					 logger.info("Temporizador.ActualizarTemporizadores() : Datos de Temporizador Actualizados..");
					 Iniciar(data, dataProvider, serviceProvider, logger, mailer);
					 return callback(err, data);
			 	}
				else {
						return callback("No se encontraron datos para programar temporizadores: ", err);
				}


		 });
	 }
	 else {
		 return callback("No se encontraron datos para programar temporizadores", null);
	 }
 });



}



method.ListarEncendidasProgramadas = function() {
	return _prendidas;
};

method.ListarApagadasProgramadas = function() {
	return this._apagadas;
};

function Iniciar(temporizadores, dataProvider, serviceProvider, logger, mailer) {

	 later.date.localTime();
   for(var p in temporizadores) {
      var actuador = temporizadores[p];

			/* Comienza Configuracion de Tiempos*/
      logger.info("**Configurando temporizador <" + temporizadores[p].IdTemporizador + ">");
      logger.info("Dispositivo asociado : " + temporizadores[p].IdDispositivo);
      logger.info("Actuador asociado    : " + temporizadores[p].IdActuador);
      logger.info("Habilitado           : " + temporizadores[p].Habilitado);
      logger.info("Duracion encendido   : " + temporizadores[p].DuracionMinutos);
      logger.info("Numero ciclos(dias)  : " + temporizadores[p].NumeroDias);
      logger.info("Horas Activacion     : " + temporizadores[p].HorasActivacion);
      var horarios = temporizadores[p].HorasActivacion.split(";");

			//Genero configuraciones de tiempos de encendidos y apagados
			var mySchedEncendido = [];
			var mySchedApagado = [];
			for (i =0; i<horarios.length; i++) {
				mySchedEncendido.push({
					h: [parseInt(horarios[i].split(":")[0])],
					m: [parseInt(horarios[i].split(":")[1])]
				});

				mySchedApagado.push({
					h: [parseInt(horarios[i].split(":")[0])],
					m: [parseInt(horarios[i].split(":")[1]) + parseInt(temporizadores[p].DuracionMinutos)]
				});

			}

			temporizadores[p]["configEncendido"] = {schedules: mySchedEncendido};
			temporizadores[p]["configApagado"] = {schedules: mySchedApagado};

			/*
			temporizadores[p]["configEncendido"] = {schedules: [
      {h: [parseInt(horarios[0].split(":")[0])], m: [parseInt(horarios[0].split(":")[1])]},
      {h: [parseInt(horarios[1].split(":")[0])], m: [parseInt(horarios[1].split(":")[1])]},
      {h: [parseInt(horarios[2].split(":")[0])], m: [parseInt(horarios[2].split(":")[1])]}
      ]};

      temporizadores[p]["configApagado"] = {schedules: [
      {h: [parseInt(horarios[0].split(":")[0])], m: [parseInt(horarios[0].split(":")[1]) + parseInt(temporizadores[p].DuracionMinutos)]},
      {h: [parseInt(horarios[1].split(":")[0])], m: [parseInt(horarios[1].split(":")[1]) + parseInt(temporizadores[p].DuracionMinutos)]},
      {h: [parseInt(horarios[2].split(":")[0])], m: [parseInt(horarios[2].split(":")[1]) + parseInt(temporizadores[p].DuracionMinutos)]}
      ]};
			*/
			/*Termina configuracion de tiempos*/

			//Convierto la configuracion de tiempos a una tarea de later
      //var confEncendido = later.schedule(temporizadores[p].configEncendido).next(temporizadores[p].NumeroDias*horarios.length);
  		//var confApagado = later.schedule(temporizadores[p].configApagado).next(temporizadores[p].NumeroDias)


		  var x = later.setInterval(function() { Activar(actuador,dataProvider,serviceProvider,logger,mailer); }, temporizadores[p].configEncendido);
			var y = later.setInterval(function() { Desactivar(actuador, dataProvider,serviceProvider,logger,mailer); }, temporizadores[p].configApagado)

			//la envío al metodo de inicializacion
			logger.info("Temporizador.Iniciar() : Temporizador iniciado..");

   }
  }


	function Activar(actuador, dataProvider, serviceProvider, logger,mailer)
	{
		logger.info("Temporizador.Activar(): Encendiendo Actuador.." + actuador.IdActuador);

    serviceProvider.Relay().Activar(actuador.IdDispositivo, actuador.IdActuador, function(error, data) {
        if (error) {
					logger.error("Temporizador.Activar(): Error al Activar Actuador " + actuador.IdActuador + ", detalle: " + error);
				}
				else {
					logger.info("Temporizador.Activar(): Actuador " + actuador.IdActuador + " Activado");
				}
    });

	}

	function Desactivar(actuador, dataProvider, serviceProvider, logger,mailer)
	{
		logger.info("Temporizador.Desactivar(): Apagando Actuador.." + actuador.IdActuador);

		serviceProvider.Relay().Desactivar(actuador.IdDispositivo, actuador.IdActuador, function(error, data) {
				if (error) {
					logger.error("Temporizador.Desactivar(): Error al Desactivar Actuador " + actuador.IdActuador + ", detalle: " + error);
				}
				else {
					logger.info("Temporizador.Desactivar(): Actuador " + actuador.IdActuador + " Desactivado");
				}

		});

	}

module.exports = Temporizador;
