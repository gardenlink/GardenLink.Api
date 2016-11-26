module.exports = function(app, moment, dataProvider, serviceProvider, logger, graficos, middleware) {

var Medicion = require("../lib/dto/Medicion.js");
var objMedicion = new Medicion();

var TipoDispositivo = "SENSOR";

var req = require('restler');
var async = require('async');
var _ = require('underscore');


var sensorService = serviceProvider.Sensor();

/* INICIO API REST */

/**
 * @api {get} /v1/sensores Obtener todos los sensores
 * @apiGroup Sensores 
 * @apiSuccess {object[]} sensores Listado de sensores
 * @apiVersion 0.0.1
 * @apiName Obtener Sensores
 * @apiDescription Devuelve el listado completo de sensores independiente del dispositivo al que esten asociados
 */
app.get('/api/v1/sensores', middleware.EnsureAuthenticated, function(request, response){
	 dataProvider.Sensor().GetAll(function(err, data) {
      if (data.length > 0) {
        response.json(data);
      }
      else
      {
      	response.json("");
      }
    });
});


/**
 * @api {get} /v1/sensores/:id Obtener un sensor
 * @apiGroup Sensores 
 * @apiSuccess {object} sensor Objeto sensor
 * @apiVersion 0.0.1
 * @apiName Obtener un Sensor
 * @apiDescription Devuelve un sensor basado en su ID
 */
app.get('/api/v1/sensores/:id', middleware.EnsureAuthenticated, function (request, response) {
    var idSensor = request.params.id;

     var filter = {IdSensor : String};
    filter.IdSensor = idSensor;
    dataProvider.Sensor().Find(filter, function(err, data) {
      if (err) {
      	response.send(err);
      }
      else if (data) {

        response.send(data);
      }
      else
      {
      	response.send("");
      }
    });
});


/**
 * @api {post} /v1/sensores Crear un sensor
 * @apiGroup Sensores 
 * @apiSuccess {json} Listado de sensores
 * @apiVersion 0.0.1
 * @apiName crear Sensor
 * @apiDescription Crear un sensor
 */
app.post('/api/v1/sensores',middleware.EnsureAuthenticated, function(request, response) {

    dataProvider.Sensor().Save(request.body.IdSensor,
    						   request.body.IdDispositivo,
    						   request.body.Descripcion,
    						   request.body.MarcaModelo,
    						   request.body.Tipo,
    						   request.body.Pin,
    						   request.body.EsPinAnalogo,
									 request.body.Pin2,
    						   request.body.EsPinAnalogo2,
									 request.body.Pin3,
    						   request.body.EsPinAnalogo3,
    						   request.body.Habilitado
    						   );
    response.json("ok");


});

/**
 * @api {put} /v1/sensores/:id Modificar un sensor
 * @apiGroup Sensores 
 * @apiSuccess {json} Listado de sensores
 * @apiVersion 0.0.1
 * @apiName modificar Sensor
 * @apiDescription Modifica un sensor (objeto completo)
 */
app.put('/api/v1/sensores/:id', middleware.EnsureAuthenticated, function(request, response) {

	 dataProvider.Sensor().Save(request.params.id,
    						   request.body.IdDispositivo,
    						   request.body.Descripcion,
    						   request.body.MarcaModelo,
    						   request.body.Tipo,
    						   request.body.Pin,
    						   request.body.EsPinAnalogo,
									 request.body.Pin2,
    						   request.body.EsPinAnalogo2,
									 request.body.Pin3,
    						   request.body.EsPinAnalogo3,
    						   request.body.Habilitado
    						   );

    response.json("ok");
});

/**
 * @api {delete} /v1/sensores/:id Elimina un sensor
 * @apiGroup Sensores 
 * @apiSuccess {json} Listado de sensores
 * @apiVersion 0.0.1
 * @apiName eliminar Sensor
 * @apiDescription Elimina un sensor basado en su ID
 */
app.delete('/api/v1/sensores/:id', middleware.EnsureAuthenticated, function(request, response){
	dataProvider.Sensor().Delete(request.params.id);
	response.json("ok");
});



/**
 * @api {get} /v1/sensores/:id/mediciones Obtener Mediciones
 * @apiGroup Sensores 
 * @apiSuccess {json} Listado de sensores
 * @apiVersion 0.0.1
 * @apiName Obtener mediciones
 * @apiDescription Obtener las mediciones del sensor
 * @apiParam [last] {boolean}
 * @apiParam [limit] {number}
 * @apiParam [sorttype] {string="TimeStamp"}
 * @apiParam [sortdirection] {string="asc","desc"}
 * @apiExample {curl} Example usage:
 *     curl -i http://gardenlink.cl:9000/api/v1/sensores/1/mediciones?last=true&sorttype=TimeStamp&sortdirection=asc
 */

// Llamada para obtener el ultimo registro
// http://localhost:9000/api/v1/sensores/1/mediciones?last=true
// http://localhost:9000/api/v1/sensores/1/mediciones?limit=100
// criteria can be asc, desc, ascending, descending, 1, or -1

app.get('/api/v1/sensores/:id/mediciones', middleware.EnsureAuthenticated, function(request, response,next){

	var  today = moment();
    yesterday = moment(today).add(-12, 'hours');

    var returnLast = false;
    var sortObject= null;
    var returnLimit = true;

     // FILTROS QUERY
     var filter = {
	 			   IdTipoActuador : Number,
	 			   IdActuador : Number
	 			  };


	 filter.IdTipoActuador = objMedicion.GetTipoActuadorByName(TipoDispositivo);
	 filter.IdActuador = request.params.id;


	//Modos de consulta: Devolver el ultimo registro
    if (request.query.last == true || request.query.last == "true"){
     	returnLast = true;
     	sortObject = {};
		var stype = request.query.sorttype;
		var sdir = request.query.sortdirection;
		sortObject[stype] = sdir;
		filter.sortObject = sortObject ? sortObject : null;
    }

    if (request.query.limit) {
    	sortObject = {};
    	returnLast = false;
    	var stype = "TimeStamp";
		var sdir = "-1";
		sortObject[stype] = sdir;
		filter.sortObject = sortObject ? sortObject : null;
		filter.limit = request.query.limit;
    }


    
	 if (returnLast)
	 {
	 	

	 	dataProvider.Medicion().GetLast(filter, function(err, data) {
	      if (err){
	      	response.json(err);
	      }
	      else
	      {
		    response.json(data);
		  }
     	});
	 }
	 else
	 {
	 	dataProvider.Medicion().GetCollection(filter, function(err, data) {
	      if (err){
	      	response.json(err);
	      }
	      else
	      {
		    response.json(data);
		  }
     	});
	 }
	




});


/**
 * @api {post} /v1/sensores/mediciones Crear Medicion
 * @apiGroup Sensores 
 * @apiSuccess {json} ok
 * @apiVersion 0.0.1
 * @apiName crear medicion
 * @apiDescription Graba una medicion desde los sensores
 */
app.post('/api/v1/sensores/mediciones',middleware.EnsureAuthenticated, function(request, response) {

    dataProvider.Medicion().Save(objMedicion.GetTipoActuadorByName(TipoDispositivo),
    						   request.body.IdActuador,
    						   request.body.IdDispositivo,
    						   request.body.Valor
    						   );
    response.json("ok");

});


/**
 * @api {post} /v1/sensores/mediciones/sync Sincronizar mediciones
 * @apiGroup Sensores 
 * @apiSuccess {json} ok
 * @apiVersion 0.0.1
 * @apiName sincronizar mediciones
 * @apiDescription Servicio usado para sincromizar entre servicdores
 */
app.post('/api/v1/sensores/mediciones/sync',middleware.EnsureAuthenticated, function(request, response) {

	dataProvider.Medicion().SaveSync(request.body.Id,
								 request.body.IdTipoActuador,
								 request.body.IdActuador,
								 request.body.IdDispositivo,
								 request.body.TimeStamp,
								 request.body.Valor
								 );

	response.json("ok");

});





/**
 * @api {get} /v1/sensores/:id/mediciones/grafico Generar Grafico de mediciones
 * @apiGroup Sensores 
 * @apiSuccess {json} ok
 * @apiVersion 0.0.1
 * @apiName Graficar Sensor
 * @apiDescription Genera un grafico con las ultimas mediciones definidas en el parametro limit
 * @apiParam limit=50 {number}
 * @apiExample {curl} Example usage:
 *     curl -i http://gardenlink.cl:9000/api/v1/sensores/1/mediciones?limit=100
 */
app.get('/api/v1/sensores/:id/mediciones/grafico', middleware.EnsureAuthenticated, function(request, response,next){

	var  today = moment();
    yesterday = moment(today).add(-12, 'hours');

    
    var sortObject= null;

     // FILTROS QUERY
     var filter = {
	 			   IdTipoActuador : Number,
	 			   IdActuador : Number
	 			  };


	 filter.IdTipoActuador = objMedicion.GetTipoActuadorByName(TipoDispositivo);
	 filter.IdActuador = request.params.id;


	
	sortObject = {};
	var stype = "TimeStamp";
	var sdir = "-1";
	sortObject[stype] = sdir;
	filter.sortObject = sortObject ? sortObject : null;
	if (request.query.limit)
		filter.limit = request.query.limit;
	else
		filter.limit = "50";



    dataProvider.Medicion().GetCollection(filter, function(err, data) {
	      if (err){
	      	response.json(err);
	      }
	      else
	      {
		    	graficos.Graficar(data, function(error, url){ 
              response.json(url);
          	});
		  }
     	});


});


};