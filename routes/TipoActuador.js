module.exports = function(app, dataProvider, logger, middleware) {

/* INICIO API REST */

/**
 * @api {get} /api/v1/tipoactuadores Obtiene la lista de actuadores
 * @apiName tipoactuadores
 * @apiGroup TipoActuador
 */
app.get('/api/v1/tipoactuadores', middleware.EnsureAuthenticated, function(request, response){
	 dataProvider.TipoActuador().GetAll(function(err, data) { 
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
 * @api {get} /api/v1/tipoactuadores/:id Obtiene el tipo de actuador
 * @apiName tipoactuadores
 * @apiGroup TipoActuador
 *
 * @apiParam {Number} id TipoActuador unique ID.
 *
 */
app.get('/api/v1/tipoactuadores/:id', middleware.EnsureAuthenticated, function (request, response) {
     var idTipoActuador = request.params.id;

     var filter = {};
    filter.IdTipoActuador = idTipoActuador;
    dataProvider.TipoActuador().Find(filter, function(err, data) { 
      if (data) {
        response.json(data);
      }
      else
      {
      	response.json("");
      }
    });
});



};