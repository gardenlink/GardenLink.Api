module.exports = function(app, moment, dataProvider, serviceProvider, logger, graficos, middleware) {

var Medicion = require("../lib/dto/Medicion.js");
var objMedicion = new Medicion();

var TipoDispositivo = "SENSOR";

var req = require('restler');
var async = require('async');
var _ = require('underscore');


var sensorService = serviceProvider.Sensor();

/* INICIO API REST */


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

app.delete('/api/v1/sensores/:id', middleware.EnsureAuthenticated, function(request, response){
	dataProvider.Sensor().Delete(request.params.id);
	response.json("ok");
});


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



app.post('/api/v1/sensores/mediciones',middleware.EnsureAuthenticated, function(request, response) {

    dataProvider.Medicion().Save(objMedicion.GetTipoActuadorByName(TipoDispositivo),
    						   request.body.IdActuador,
    						   request.body.IdDispositivo,
    						   request.body.Valor
    						   );
    response.json("ok");

});


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