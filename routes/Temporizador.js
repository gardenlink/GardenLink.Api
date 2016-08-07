module.exports = function(app, moment, dataProvider, logger,middleware) {

/* INICIO API REST */


app.get('/api/v1/temporizadores', middleware.EnsureAuthenticated, function(request, response){
	 dataProvider.Temporizador().GetAll(function(err, data) { 
      if (data.length > 0) {
        response.json(data);
      }
      else
      {
      	response.json("");
      }
    });
});


app.get('/api/v1/temporizadores/:id', middleware.EnsureAuthenticated, function (request, response) {
    var idTemporizador = request.params.id;

     var filter = {};
    filter.IdTemporizador = idTemporizador;
    dataProvider.Temporizador().Find(filter, function(err, data) { 
      if (data) {
        response.send(data);
      }
      else
      {
      	response.send("");
      }
    });
});



app.post('/api/v1/temporizadores',middleware.EnsureAuthenticated, function(request, response) {


    dataProvider.Temporizador().Save(request.body.IdTemporizador, 
	    						   request.body.IdDispositivo,
	    						   request.body.IdTipoActuador,
	    						   request.body.IdActuador,
	    						   request.body.Descripcion,
	    						   request.body.DuracionMinutos,
	    						   request.body.NumeroDias,
	    						   request.body.HorasActivacion,
	    						   request.body.Habilitado
    						   );
    response.json("ok");

	
});

app.put('/api/v1/temporizadores/:id', middleware.EnsureAuthenticated, function(request, response) {
	
	 dataProvider.Temporizador().Save(request.params.id, 
    						   request.body.IdDispositivo,
    						   request.body.IdTipoActuador,
    						   request.body.IdActuador,
    						   request.body.Descripcion,
    						   request.body.DuracionMinutos,
    						   request.body.NumeroDias,
    						   request.body.HorasActivacion,
    						   request.body.Habilitado
    						   );
    						   
    response.json("ok");
});

app.delete('/api/v1/temporizadores/:id', middleware.EnsureAuthenticated, function(request, response){
	dataProvider.Temporizador().Delete(request.params.id);
	response.json("ok");
});




};