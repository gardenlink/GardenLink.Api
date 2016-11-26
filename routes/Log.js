module.exports = function(app, auxiliares, logger, tareas,fs, dirname, middleware) {

var middleware = middleware;


 /**
 * @api {get} /v1/logs Obtiene los logs del dia de hoy
 * @apiGroup Logs 
 * @apiSuccess {json} Listado de Logs
 * @apiVersion 0.0.1
 * @apiName Obtener Logs
 * @apiDescription Devuelve los logs del dia de hoy
 */
app.get('/api/v1/logs/:id', middleware.EnsureAuthenticated, function (request, response) {
    var idLog = request.params.id;
    try {
      
            var contents = fs.readFileSync(dirname +'/logs/log_file.log.' + auxiliares.DateParse_yyyy_mm_dd(new Date()), {encoding: 'utf8'}).toString();

            response.json(contents);


    } catch (exception) {
      console.log(exception);
      logger.error("En servicio log: Archivo no existe, creando... ");
      //response.sendStatus(404);
    }
    
});

};