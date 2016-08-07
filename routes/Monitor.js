module.exports = function(app, moment, dataProvider, logger, graficos,middleware){

var ArestLibrary = require("../lib/servicios/Arest.js");
var arduinoService; 


app.put('/api/v1/monitor/GrabarMedicion/:id', middleware.EnsureAuthenticated,function (request, response) {
    var sensor = request.params.id;
    var dispositivo = "001"; //request.params.idDispositivo;
    var valor = request.body.valor;
    console.log("llega solicitud de grabacion para grabar sensor: " + sensor + " con valor : " + valor);
    dataProvider.Sensor().Save(dispositivo,sensor, sensor, valor);
    response.json("OK");
});



app.get('/api/v1/monitor/ListarMediciones/:id', middleware.EnsureAuthenticated, function (request, response) {

   var  today = moment();
    yesterday = moment(today).add(-12, 'hours');

    //console.log(today.toDate());
    //console.log(yesterday.toDate());

  var filter =  {TimeStamp: {
      $gte: yesterday.toDate(),
      $lt: today.toDate()},
      Id : request.params.id
    };


    dataProvider.Sensor().GetCollection(filter, function(error,docs){
        response.json(docs);
        });

      });

app.get('/api/v1/monitor/Graficar/:id', middleware.EnsureAuthenticated, function(request,response) {

   var  today = moment();
    yesterday = moment(today).add(-12, 'hours');

   var filter =  {TimeStamp: {
      $gte: yesterday.toDate(),
      $lt: today.toDate()},
      Id : request.params.id
    };


  dataProvider.Sensor().GetCollection(filter,function(error,docs){
        graficos.Graficar(docs, function(error, url){ 
              response.json(url);
          });
        });
});   

};