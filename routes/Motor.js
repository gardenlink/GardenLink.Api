module.exports = function(app, moment, dataProvider, serviceProvider, logger, middleware) {


var _ = require('underscore');

var req = require('restler');
var async = require('async');


var Medicion = require("../lib/dto/Medicion.js");
var objMedicion = new Medicion();

/* INICIO API REST */

var TipoDispositivo = "MOTOR";


/**
 * @api {get} /v1/motores Obtiene la lista de motores existente
 * @apiGroup Motores 
 * @apiSuccess {json} Listado de motores
 * @apiVersion 0.0.1
 * @apiName Obtener Motores
 * @apiDescription Devuelve el listado de motores configurados
 */
app.get('/api/v1/motores', middleware.EnsureAuthenticated, function(request, response){
	 dataProvider.Motor().GetAll(function(err, data) { 
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
 * @api {get} /v1/motores/:id Obtiene un motor
 * @apiGroup Motores 
 * @apiSuccess {json} Objeto motor
 * @apiVersion 0.0.1
 * @apiName Obtener Motor
 * @apiDescription Devuelve un motor basado en su ID
 */
app.get('/api/v1/motores/:id', middleware.EnsureAuthenticated, function (request, response) {
    var idMotor = request.params.id;

     var filter = {IdMotor : String};
    filter.IdMotor = idMotor;
    dataProvider.Motor().Find(filter, function(err, data) { 
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
 * @api {post} /v1/motores Crear un motor
 * @apiGroup Motores 
 * @apiSuccess {json} Objeto motor
 * @apiVersion 0.0.1
 * @apiName Crear Motor
 * @apiDescription Crear un motor
 */
app.post('/api/v1/motores',middleware.EnsureAuthenticated, function(request, response) {

    dataProvider.Motor().Save(request.body.IdMotor, 
    						   request.body.IdDispositivo,
    						   request.body.Descripcion,
    						   request.body.MarcaModelo,
    						   request.body.Tipo,
    						   request.body.Pin,
    						   request.body.EsPinAnalogo,
    						   request.body.Habilitado,
    						   request.body.Posicion,
    						   request.body.Accion,
    						   request.body.Estado
    						   );
    						   
    response.json("ok");

	
});

/**
 * @api {put} /v1/motores/:id Modificar un motor
 * @apiGroup Motores 
 * @apiSuccess {json} Objeto motor
 * @apiVersion 0.0.1
 * @apiName Modificar Motor
 * @apiDescription Modificar un motor (objeto completo)
 */
app.put('/api/v1/motores/:id', middleware.EnsureAuthenticated, function(request, response) {
	
	 dataProvider.Motor().Save(request.params.id, 
    						   request.body.IdDispositivo,
    						   request.body.Descripcion,
    						   request.body.MarcaModelo,
    						   request.body.Tipo,
    						   request.body.Pin,
    						   request.body.EsPinAnalogo,
    						   request.body.Habilitado,
    						   request.body.Posicion,
    						   request.body.Accion,
    						   request.body.Estado
    						   );
    						   
    response.json("ok");
});

/**
 * @api {delete} /v1/motores/:id Eliminar un motor
 * @apiGroup Motores 
 * @apiSuccess {json} Objeto motor
 * @apiVersion 0.0.1
 * @apiName Eliminar Motor
 * @apiDescription Eliminar un motor
 */
app.delete('/api/v1/motores/:id', middleware.EnsureAuthenticated, function(request, response){
	dataProvider.Motor().Delete(request.params.id);
	response.json("ok");
});


/*
* Desde POSTMAN enviar sin comillas
* path = Accion
* valor = AVANZAR, RETROCEDER, DETENER, ESTADO, POSICION
*/

/**
 * @api {patch} /v1/motores/:id Accionar Motores
 * @apiGroup Motores 
 * @apiSuccess {json} array
 * @apiVersion 0.0.1
 * @apiName AccionarMotor
 * @apiDescription Accionar motores (AVANZAR, DETENER)
 * @apiParam path=Action {String}
 * @apiParam value {String="AVANZAR", "RETROCEDER", "DETENER", "ESTADO", "POSICION"}
 * @apiExample {curl} Example usage:
 *     curl --request PATCH --data "path=Accion&value=AVANZAR" http://gardenlink.cl:9000/api/v1/motores/1
 */
app.patch('/api/v1/motores/:id', middleware.EnsureAuthenticated, function(request, response,next) {
	var idMotor = request.params.id;
    var op = request.body.op; //solamente replace por ahora 
    var path = request.body.path; //debe venir sin comillas
    var valor = request.body.value;
    
	
    
    dataProvider.Cache(true, function(error, data ) {
    
    		if (error) { 
    			return;
    		}
    			
			var result = _.find(data.Motores, function (item) {
				return item.IdMotor == idMotor;
			});
		
			if (result) {
				
			data[path] = valor;
      		//Si el cambio es para activar o desactivar el RElay, llamo al servicio de Arduino
	      	if (path == "Accion") {
	      		//var activo = helper.toBoolean(valor);
	      		
	      		
	      		if (_DEBUG)
	      			console.log("ServicioController: valor de variable Accion : " + valor);
	      		
	      		switch (valor)
	      		{
	      			case "AVANZAR":
	      				console.log("llegacontroller");
			      		serviceProvider.Motor().Avanzar(result.IdDispositivo, result.IdMotor, function (error, doc) {
			      				if (error) {
			      					console.log("[PATCH] /api/v1/relays/Error all lamar a servicio Arduino para Relays -> error :  ", error);
			      					return;
			      				}
			      				else {
									return response.json(doc);
			            		}
			      			}); 
			      		
			      		break;
			      		
			      	case "RETROCEDER":
			      		serviceProvider.Motor().Retroceder(result.IdDispositivo, result.IdMotor, function (error, doc) {
			      				if (error) {
			      					console.log("[PATCH] /api/v1/relays/Error all lamar a servicio Arduino para Relays -> error :  ", error);
			      					return;
			      				}
			      				else {
									return response.json(doc);
			            		}
			      			}); 
			      		
			      		break;
			      		
			      	case "DETENER":
			      		serviceProvider.Motor().Detener(result.IdDispositivo, result.IdMotor, function (error, doc) {
			      				if (error) {
			      					console.log("[PATCH] /api/v1/relays/Error all lamar a servicio Arduino para Relays -> error :  ", error);
			      					return;
			      				}
			      				else {
									return response.json(doc);
			            		}
			      			}); 
			      		
			      		break;
			      		
			      	case "ESTADO":
			      		serviceProvider.Motor().Estado(result.IdDispositivo, result.IdMotor, function (error, doc) {
			      				if (error) {
			      					console.log("[PATCH] /api/v1/relays/Error all lamar a servicio Arduino para Relays -> error :  ", error);
			      					return;
			      				}
			      				else {
									return response.json(doc);
			            		}
			      			}); 
			      		
			      		break;
			      		
			      	case "POSICION":
			      		serviceProvider.Motor().Posicion(result.IdDispositivo, result.IdMotor, function (error, doc) {
			      				if (error) {
			      					console.log("[PATCH] /api/v1/relays/Error all lamar a servicio Arduino para Relays -> error :  ", error);
			      					return;
			      				}
			      				else {
									return response.json(doc);
			            		}
			      			}); 
			      		
			      		break;
			      		
			      	default:
						console.log("El valor del atributo Accion no es valido");
						return response.json("El valor del atributo Accion no es valido");
						break;

	      		}
	      		
			}
			else
			{
				console.log("El path no es accion");
				return response.json("El path no es accion");
			}
		}
		else
		{
			console.log("No llega resultado desde bd");
			return response.json("No llega resultado desde bd");
		}
	});

});

/*
app.get('/api/v1/servicio/motores', middleware.EnsureAuthenticated, function(request, response, next){

		dataProvider.Cache(true, function(error, data ) {
				var result = data["Motores"];
				response.json(result);
			});
});

app.get('/api/v1/servicio/motores/:id', middleware.EnsureAuthenticated, function(request, response, next){
		var id = request.params.id;
		dataProvider.Cache(true, function(error, data ) {
				var result = _.find(data.Motores, function(element) {
					return element.IdMotor == id;
				}); 
				response.json(result);
			});
});

*/

// Llamada para obtener el ultimo registro
// http://localhost:9000/api/v1/motores/1/mediciones?last=true&sorttype=_id&sortdirection=desc
// criteria can be asc, desc, ascending, descending, 1, or -1

/**
 * @api {get} /v1/motores/:id/mediciones Obtener mediciones
 * @apiGroup Motores 
 * @apiSuccess {json} ok
 * @apiVersion 0.0.1
 * @apiName Motor Mediciones
 * @apiDescription Obtener ultimas mediciones asociadas al motor
 * @apiExample {curl} Example usage:
 	   curl -i http://localhost:9000/api/v1/motores/1/mediciones?last=true&sorttype=_id&sortdirection=desc
 */

app.get('/api/v1/motores/:id/mediciones', middleware.EnsureAuthenticated, function(request, response){

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








};