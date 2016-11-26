module.exports = function(app, moment, dataProvider, logger,middleware){

var ArestLibrary = require("../lib/servicios/Arest.js");
var NetworkingLibrary = require("../lib/util/Net.js");
var arduinoService;

var req = require('restler');
var async = require('async');
var _ = require('underscore');



/**
 * @api {get} /v1/dispositivos/:id Obtener informacion de un dispositivo determinado
 * @apiParam {id} id Dispositivo (unico)
 * @apiGroup Dispositivos 
 * @apiSuccess {json} Listado de dispositivos
 * @apiVersion 0.0.1
 * @apiName ObtenerDispositivo
 * @apiDescription Obtiene un objeto dispositivo basado en su ID
 */
app.get('/api/v1/dispositivos/:id', middleware.EnsureAuthenticated, function (request, response) {
    var dispositivo = request.params.id;

     var filter = {Id : String};
    filter.Id = dispositivo;
    dataProvider.Device().Find(filter, function(err, data) {
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
* @api {get} /v1/dispositivos/:id/sensores Obtener sensores asociados
* @apiSuccess {json} Listado de sensores asociados a este dispositivo
* @apiVersion 0.0.1
* @apiName ObtenerSensorAsociado
* @apiDescription Obtener detalle de sensores asociados al dispositivo consultado
* @apiGroup Dispositivos 
*/
app.get('/api/v1/dispositivos/:id/sensores', middleware.EnsureAuthenticated,function (request, response) {
    var dispositivo = request.params.id;

     var filter = {IdDispositivo : String};
    filter.IdDispositivo = dispositivo;
    dataProvider.Sensor().GetCollection(filter, function(err, data) {
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
* @api {get} /v1/dispositivos/:id/relays Obtener relays asociados
* @apiSuccess {json} Listado de relays asociados a este dispositivo
* @apiVersion 0.0.1
* @apiName ObtenerRelayAsociado
* @apiDescription Obtener detalle de relays asociados al dispositivo consultado
* @apiGroup Dispositivos 
*/
app.get('/api/v1/dispositivos/:id/relays', middleware.EnsureAuthenticated,function (request, response) {
    var dispositivo = request.params.id;

     var filter = {IdDispositivo : String};
    filter.IdDispositivo = dispositivo;
    dataProvider.Relay().GetCollection(filter, function(err, data) {
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
* @api {get} /v1/dispositivos/:id/motores Obtener motores asociados
* @apiSuccess {json} Listado de motores asociados a este dispositivo
* @apiVersion 0.0.1
* @apiName ObtenerMotorAsociado
* @apiDescription Obtener detalle de motores asociados al dispositivo consultado
* @apiGroup Dispositivos 
*/
app.get('/api/v1/dispositivos/:id/motores', middleware.EnsureAuthenticated,function (request, response) {
    var dispositivo = request.params.id;

     var filter = {IdDispositivo : String};
    filter.IdDispositivo = dispositivo;
    dataProvider.Motor().GetCollection(filter, function(err, data) {
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
 * @api {get} /v1/dispositivos Listar dispositivos
 * @apiVersion 0.0.1
 * @apiName Obtener Dispositivos
 * @apiSuccess {Object[]} dispositivos arreglo de objetos solicitado
 * @apiDescription Obtener el listado de dispositivos
 * @apiGroup Dispositivos 
 */
app.get('/api/v1/dispositivos', middleware.EnsureAuthenticated,function(request, response){
	 dataProvider.Device().GetAll(function(err, data) {
      if (data && data.length > 0) {
        response.json(data);
      }
      else
      {
      	response.json("");
      }
    });
});

/**
 * @api {post} /v1/dispositivos Crea un dispositivo
 * @apiSuccess {json} ok
 * @apiVersion 0.0.1
 * @apiName Crear Dispositivo
 * @apiGroup Dispositivos 
 * @apiDescription Crea un dispositivo
 */
app.post('/api/v1/dispositivos',middleware.EnsureAuthenticated,function(request, response) {

	var id = request.body.Id;
    var nombre = request.body.Nombre;
    var tipo = request.body.Tipo;
    var ip = request.body.Ip;
    var puerto = request.body.Puerto;
    var habilitado = request.body.Habilitado;
    var estado = request.body.Estado;
    var ip = request.body.Ip;
    var frecuencia = request.body.FrecuenciaMuestreo;

    dataProvider.Device().Save(id, nombre, tipo, ip,puerto,habilitado,estado,frecuencia);

    response.json("ok");


});

/**
 * @api {put} /v1/dispositivos/:id Modifica un dispositivo
 * @apiSuccess {json} ok
 * @apiVersion 0.0.1
 * @apiName Modificar Dispositivo
 * @apiGroup Dispositivos 
 * @apiDescription modifica un dispositivo
 */
app.put('/api/v1/dispositivos/:id', middleware.EnsureAuthenticated,function(request, response) {

   	var id = request.params.id;
    var nombre = request.body.Nombre;
    var tipo = request.body.Tipo;
    var ip = request.body.Ip;
    var puerto = request.body.Puerto;
    var habilitado = request.body.Habilitado;
    var estado = request.body.Estado;
    var ip = request.body.Ip;
    var frecuencia = request.body.FrecuenciaMuestreo;

    dataProvider.Device().Save(id, nombre, tipo, ip,puerto,habilitado,estado,frecuencia);

    response.json("ok");

});

/**
 * @api {delete} /v1/dispositivos/:id Elimina un dispositivo
 * @apiSuccess {json} ok
 * @apiVersion 0.0.1
 * @apiGroup Dispositivos 
 * @apiName Eliminar Dispositivo
 * @apiDescription elimina un dispositivo
 */
app.delete('/api/v1/dispositivos/:id', middleware.EnsureAuthenticated,function(request, response){
	dataProvider.Device().Delete(request.params.id);
	response.json("ok");
});

/**
 * @api {put} /v1/dispositivos/:id/ip Modifica la property ip
 * @apiSuccess {json} frecuenciaMuestreo
 * @apiVersion 0.0.1
 * @apiName Subscribir Dispositivo
 * @apiGroup Dispositivos 
 * @apiDescription Modificar la ip de un dispositivo
 */
app.put('/api/v1/dispositivos/:id/subscripcion', middleware.EnsureAuthenticated, function(request, response) {
	var id = request.params.id;
    var ip = request.body.ip;
    var estado = true;

	var filter = {Id : String};
    filter.Id = id;

    dataProvider.Device().Find(filter, function(err, data) {
      if (err){
      	console.log("/api/v1/dispositivos/:id/subscripcion --> Error: " + err);
      }

      if (data) {
      	console.log("Llega peticion -> valor: " + data.FrecuenciaMuestreo);
        dataProvider.Device().Save(data.Id, data.Nombre, data.Tipo, ip,data.Puerto,data.Habilitado,estado, data.FrecuenciaMuestreo);
        var payload = data.FrecuenciaMuestreo + "-" + data.FrecuenciaMuestreo;
        response.json(data.FrecuenciaMuestreo);
      }
      else{
        response.json("-1");
      }
    });
});


/**
 * @api {put} /v1/dispositivos/:id/ping Ping al dispositivo
 * @apiSuccess {json} PingResult
 * @apiVersion 0.0.1
 * @apiName Hacer ping al dispositivo
 * @apiGroup Dispositivos 
 * @apiDescription Realiza un ping al dispositivo
 */
app.get('/api/v1/dispositivos/:id/ping', middleware.EnsureAuthenticated, function(request, response) {

	 var dispositivo = request.params.id;

     var filter = {Id : String};
    filter.Id = dispositivo;
    dataProvider.Device().Find(filter, function(err, data) {
      if (data) {
        var net = new NetworkingLibrary();
			net.Ping(data.Ip, function(error, datos) {
				if (error) {
					response.send("");
				}
				else
				{
					response.send(datos);
				}
		});
      }
      else
      {
      	response.send("");
      }
    });



});



};
