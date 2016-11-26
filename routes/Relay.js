module.exports = function(app, moment, dataProvider, serviceProvider, logger,middleware) {

var Auxiliares = require('../lib/util/Auxiliares.js');
var helper = new Auxiliares();

var throwjs = require('throw.js');

var _DEBUG = true;

var Medicion = require("../lib/dto/Medicion.js");
var objMedicion = new Medicion();

var req = require('restler');
var async = require('async');
var _ = require('underscore');

var TipoDispositivo = "RELAY";

/* INICIO API REST */


/**
 * @api {get} /v1/relays Obtiene la lista de relays existente
 * @apiGroup Relays 
 * @apiSuccess {json} Listado de relays
 * @apiVersion 0.0.1
 * @apiName Obtener Relays
 * @apiDescription Devuelve los logs del dia de hoy
 */
app.get('/api/v1/relays', middleware.EnsureAuthenticated, function(request, response){
	 dataProvider.Relay().GetAll(function(err, data) {
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
 * @api {get} /v1/relays Obtiene un relay
 * @apiGroup Relays 
 * @apiSuccess {json} array
 * @apiVersion 0.0.1
 * @apiName Obtener un Relay
 * @apiDescription Obtiene un relay basado en su ID
 */
app.get('/api/v1/relays/:id', middleware.EnsureAuthenticated, function (request, response) {
    var idRelay = request.params.id;

     var filter = {IdRelay : String};
    filter.IdRelay = idRelay;
    dataProvider.Relay().Find(filter, function(err, data) {
      if (data) {
        response.send(data);
      }
      else
      {
      	response.send("");
      }
    });
});


/**
 * @api {post} /v1/relays Crear un relay
 * @apiGroup Relays 
 * @apiSuccess {json} array
 * @apiVersion 0.0.1
 * @apiName Crear un relay
 * @apiDescription Crear un relay
 */
app.post('/api/v1/relays',middleware.EnsureAuthenticated ,function(request, response) {

    dataProvider.Relay().Save(request.body.IdRelay,
    						   request.body.IdDispositivo,
    						   request.body.Descripcion,
    						   request.body.MarcaModelo,
    						   request.body.Tipo,
    						   request.body.Pin,
    						   request.body.EsPinAnalogo,
    						   request.body.Habilitado,
    						   request.body.Activo,
    						   request.body.EsInverso
    						   );
    response.json("ok");


});

/**
 * @api {put} /v1/relays/:id Modificar un relay
 * @apiGroup Relays 
 * @apiSuccess {json} array
 * @apiVersion 0.0.1
 * @apiName Modificar un relay
 * @apiDescription Modificar un relay
 */
app.put('/api/v1/relays/:id', middleware.EnsureAuthenticated, function(request, response) {

	 dataProvider.Relay().Save(request.params.id,
    						   request.body.IdDispositivo,
    						   request.body.Descripcion,
    						   request.body.MarcaModelo,
    						   request.body.Tipo,
    						   request.body.Pin,
    						   request.body.EsPinAnalogo,
    						   request.body.Habilitado,
    						   request.body.Activo,
    						   request.body.EsInverso
    						   );

    response.json("ok");
});

/**
 * @api {delete} /v1/relays/:id Eliminar un relay
 * @apiGroup Relays 
 * @apiSuccess {json} array
 * @apiVersion 0.0.1
 * @apiName Eliminar un relay
 * @apiDescription Eliminar un relay
 */
app.delete('/api/v1/relays/:id', middleware.EnsureAuthenticated, function(request, response){
	dataProvider.Relay().Delete(request.params.id);
	response.json("ok");
});


/**
 * @api {patch} /v1/relays/:id Activar/Desactivar Relay
 * @apiGroup Relays 
 * @apiSuccess {json} array
 * @apiVersion 0.0.1
 * @apiName Activar Relay
 * @apiDescription Activar o desactivar un relay
 * @apiParam path=Activo {String}
 * @apiParam value {Boolean="true","false"}
 * @apiExample {curl} Example usage:
 *     curl --request PATCH --data "path=Activo&value=true" http://gardenlink.cl:9000/api/v1/relays/1
 */
app.patch('/api/v1/relays/:id', middleware.EnsureAuthenticated, function(request, response,next) {
	var idRelay = request.params.id;
    var op = request.body.op; //solamente replace por ahora
    var path = request.body.path; //debe venir sin comillas
    var valor = request.body.value;



    dataProvider.Cache(false, function(error, data ) {

    		if (error) {
    			return;
    		}

			var result = _.find(data.Relays, function (item) {
				return item.IdRelay == idRelay;
			});

			if (result) {

				data[path] = valor;
      		//Si el cambio es para activar o desactivar el RElay, llamo al servicio de Arduino
	      	if (path == "Activo") {
	      		var activo = helper.toBoolean(valor);


	      		if (_DEBUG)
	      			console.log("ServicioController: valor de variable Activo : " + activo);

	      		if (activo == true) {
	      			serviceProvider.Relay().Activar(result.IdDispositivo, result.IdRelay, function (error, doc) {
	      				if (error) {
	      					console.log("[PATCH] /api/v1/relays/Error all lamar a servicio Arduino para Relays -> error :  ", error);
	      					return;
	      				}
	      				else {
							return response.json(doc);
	            		}
	      			});
	      		}
	      		else if (activo == false)
	      		{

	      			serviceProvider.Relay().Desactivar(result.IdDispositivo, result.IdRelay, function (error, doc) {
	      				if (error) {
	      					console.log("[PATCH] /api/v1/relays/Error all lamar a servicio Arduino para Relays -> error :  ", error);
	      					return;
	      				}
	      				else {

								 return response.json(doc);
	            		}
	      			});

	      		}
	      		else {
	      			console.log("El valor del atributo Activo no es valido");
					return;
	      		}
			}
			else
			{
				console.log("hit 4");
				return;
			}
		}
		else
		{
			console.log("hit 5");
			return;
		}
	});

});

/*
app.get('/api/v1/servicio/relays', middleware.EnsureAuthenticated, function(request, response, next){

		dataProvider.Cache(false, function(error, data ) {
				var result = data["Relays"];
				response.json(result);
			});
});

app.get('/api/v1/servicio/relays/:id', middleware.EnsureAuthenticated, function(request, response, next){
		var id = request.params.id;


		dataProvider.Cache(true, function(error, data ) {
				var result = _.find(data.Relays, function(element) {
					 if (element.IdRelay == id)
					 	return element.IdRelay;
				});

				serviceProvider.Relay().Estado(result.IdDispositivo, result.IdRelay, function (error, doc) {
	      				if (error) {
	      					console.log("[GET] /api/v1/relays/Error all lamar a servicio Arduino para consultar por el estado de Relays -> error :  ", error);
	      					return;
	      				}
	      				else {
							return response.json(doc);
	            		}
	      			});

			});


});

*/

// Llamada para obtener el ultimo registro
// http://localhost:9000/api/v1/relays/1/mediciones?last=true&sorttype=_id&sortdirection=desc
// criteria can be asc, desc, ascending, descending, 1, or -1

/**
 * @api {get} /v1/relays/:id/mediciones Obtener mediciones
 * @apiGroup Relays 
 * @apiSuccess {json} ok
 * @apiVersion 0.0.1
 * @apiName Relay Mediciones
 * @apiDescription Obtener ultimas mediciones asociadas al relay
 * @apiExample {curl} Example usage:
 	   curl -i http://localhost:9000/api/v1/relays/1/mediciones?last=true&sorttype=_id&sortdirection=desc
 */
app.get('/api/v1/relays/:id/mediciones', middleware.EnsureAuthenticated, function(request, response){

	var  today = moment();
    yesterday = moment(today).add(-12, 'hours');

    var returnLast = false;
    var sortObject= null;

    if (request.query.last == true || request.query.last == "true"){
    	console.log("LAST");
     	returnLast = request.query.last;

     	sortObject = {};
		var stype = request.query.sorttype;
		var sdir = request.query.sortdirection;
		sortObject[stype] = sdir;
    }

	 var filter = {
	 			   IdTipoActuador : Number,
	 			   IdActuador : Number
	 			  };


	 filter.IdTipoActuador = objMedicion.GetTipoActuadorByName(TipoDispositivo);
	 filter.IdActuador = request.params.id;


	 if (returnLast)
	 {
	 	filter.sortObject = sortObject ? sortObject : null;

	 	dataProvider.Medicion().GetLast(filter, function(err, data) {
	      if (err){
	      	response.json(err);
	      }
	      else
	      {
	      	console.log(data);
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
 * @api {post} /v1/relays/mediciones/sync Sincronizar mediciones
 * @apiGroup Relays 
 * @apiSuccess {json} ok
 * @apiVersion 0.0.1
 * @apiName sincronizar relays
 * @apiDescription Servicio usado para sincromizar entre servidores
 */
app.post('/api/v1/relays/mediciones/sync',middleware.EnsureAuthenticated, function(request, response) {

		dataProvider.Medicion().SaveSync(request.body.Id,
									 request.body.IdTipoActuador,
									 request.body.IdActuador,
    						   request.body.IdDispositivo,
									 request.body.TimeStamp,
    						   request.body.Valor
    						   );

    response.json("ok");

});







};
