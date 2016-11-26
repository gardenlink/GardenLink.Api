module.exports = function(app, dataProvider, logger, middleware) {

/* INICIO API REST */

/**
 * @api {get} /v1/tipoactuadores Obtener los tipos de actuadores configurados
 * @apiGroup TipoActuadores
 * @apiSuccess {json} ok
 * @apiVersion 0.0.1
 * @apiName Obtener TipoActuador
 * @apiDescription Listado de tipos de actuadores existentes
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
 * @api {get} /v1/tipoactuadores/:id Obtener un tipo de actuador
 * @apiGroup TipoActuadores
 * @apiSuccess {json} ok
 * @apiVersion 0.0.1
 * @apiName Obtener un TipoActuador
 * @apiDescription Obtiene un tipo segun su ID
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