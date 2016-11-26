
/*
 * GARDENLINK.CONTROLADOR 0.1
 * Sistema para monitoreo y control de riego automatizado
 * utilizando Raspberry + Arduino
 * Autor: GardenLink
 * Fecha: 15-01-2015
 */

var express = require('express');
var app = express();
var os=require('os');
var ifaces=os.networkInterfaces();
var req = require('restler');
var winston     = require ('winston');
var path        = require ('path'); //para utilizar rutas
var fs = require('fs'); //leer desde el filesystem



/*************************** CONFIG *******************************/

// Configuracion de Winston (logging) para crear archivo de log diario
// ej. log_file.log.2015-13-02
// uso: logger.info("Registro de log", {extraData: 'texto logueado'});
var transports  = [];
transports.push(new winston.transports.DailyRotateFile({
  name: 'common-log',
  //datePattern: '.yyyy-MM-ddTHH',
  filename: path.join(__dirname, "logs", "log_file.log")
}));

transports.push(new winston.transports.Console({
  name: 'console-log',
  colorize : true
}));

//Logger base
var logger = new winston.Logger({transports: transports});
var _dirname = __dirname;

//Fin config Winston


// Modo de inicio de aplicacion:
// 1.- Configuracion desde config.json. Requiere iniciar server con comando:
//     NODE_ENV=production node app.js
// 2.- Configuracion como argumentos al iniciar aplicacion
//     node SwitchControl.js release
//      Opciones: release / debug
var environment = process.argv[2] || process.env.NODE_ENV || 'debug'

//Revisar que las carpetas iniciales existan.. si no estan, las crea.
logger.log("Verificando carpetas de sistema..");
var pathLog = __dirname + "/logs";
try {
  fs.mkdirSync(pathLog);
} catch(e) {
  if ( e.code != 'EEXIST' ) throw e;
}
logger.log("Carpetas de sistema ok..");


logger.info("Leyendo Configuracion...");

if (environment != 'release' && environment != 'debug')
{

  logger.info("Ambiente especificado invalido.. se usara configuracion por defecto");
  environment = 'debug';
}

logger.info("Ambiente : " + environment);
var Configuracion = require("./lib/util/Configuracion.js");
var configuracion = new Configuracion(environment);
var config = configuracion.LeerConfiguracion();

//IP configuration del host Node.js
var appHost = 0;
var appPort = 0;
var found = false;
for (var dev in ifaces) {
  ifaces[dev].forEach(function(details){
    if (details.family=='IPv4') {
      if (details.address!="127.0.0.1" && found == false) {
          found = true;
          IPAddress=details.address;
          logger.info("Deteccion de IP del host GardenLink: " + IPAddress);
        }
    }
  });
}

logger.log("Lectura archivo de configuracion config.json...");
appHost = config.app_host;
appPort = config.app_port;

//Autenticacion
logger.log("Configurando Autenticacion ...");
var passport = require('passport');
var util = require('util');
//var TwitterStrategy = require('passport-twitter').Strategy;
var MiddleWare = require('./lib/util/seguridad/AuthMiddleware.js');
var middleware = new MiddleWare(config);


//Base de datos
logger.info("Configurando Base de Datos");

var DataProvider = require('./lib/dao/DataProvider.js');
var dataProvider = new DataProvider(logger, config, null);

//Servicios
var SS = require('./lib/servicios/ServiceProvider.js');
var serviceProvider = new SS(dataProvider, config, logger, function(err, data){ });


logger.info("GardenLink Host: " + appHost);
logger.info("GardenLink Port:" + appPort);


logger.log("Configurando Libreria Auxiliares...");

var Auxiliares = require("./lib/util/Auxiliares.js");
var auxiliares = new Auxiliares();
logger.info("Fin Configuracion Libreria Auxiliares...");


/* Libreria Moment para registro de tiempo */
var moment = require('moment')
moment.locale('es');
/* FIN REGISTRO DE TIEMPO */


/* MAILER  */
logger.info("Configurando Libreria Mailer...");
logger.info("Aviso por Correo : " + config.mail_enabled);
var Mailer = require("./lib/util/Mailer.js");
var mailer = new Mailer(config, logger);

/* twitter */
logger.info("Configurando Libreria twitter...");
var Tweet = require("./lib/util/Tweet.js");
var tweet = new Tweet(config, logger);
logger.info("Publicacion Twitter : " + config.twitter_enabled);
logger.info("Autenticacion Twitter : " + config.twitter_autenticacion);


/* TEMPORIZADOR */
logger.info("Configurando Temporizador...")
var Temporizador = require("./lib/Temporizador.js");
var tareas = new Temporizador(config, logger, mailer,dataProvider,serviceProvider,function(error, data) {
  if (error)
    logger.log("ApiServer.Temporizador: Error al inicializar constructor.. detalle : " + error);
  else {
      log.log("Temporizador: Inicializacion Terminada");
  }
});

logger.info("Fin Configuracion Temporizador...");



/* Monitoreo de Salud (Lectura Sensores) */
logger.info("Configurando Modulo de Monitorizacion de Salud...")
var MonitorSalud = require("./lib/MonitorSalud.js");
var monitor = new MonitorSalud(config, logger, mailer,moment,tweet, dataProvider, serviceProvider);
monitor.Iniciar();
logger.info("Fin Configuracion Modulo Monitorizacion de Salud...");

logger.log("Configurando Express..");




logger.info("Configurando CORS..");


app.configure(function() {

  //app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static('docs')); //documentation
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
   app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
  });
  app.use(app.router);

});




//Graficos
logger.info("Configurando Libreria para graficos");
var Graficos = require("./lib/util/Graficos.js");
var graficos = new Graficos(config, logger);

//Rutas para api rest.
logger.info("Preparando Rutas de aplicacion..");

logger.info("./routes/Sensor");
require('./routes/Sensor.js')(app, moment, dataProvider, serviceProvider, logger,graficos, middleware);

logger.info("./routes/Relay");
require('./routes/Relay.js')(app, moment, dataProvider, serviceProvider, logger,middleware);

logger.info("./routes/Temporizador");
require('./routes/Temporizador.js')(app, moment, dataProvider, logger,middleware);

logger.info("./routes/Monitor");
require('./routes/Monitor.js')(app,moment,dataProvider,logger, graficos,middleware);


logger.info("./routes/Autenticacion");
require('./routes/Autenticacion.js')(app, config,passport,util,auxiliares);

logger.info("./routes/Log");
require('./routes/Log')(app, auxiliares, logger, tareas,fs, _dirname, middleware);


logger.info("./routes/Dispositivo");
require("./routes/Dispositivo")(app, moment, dataProvider, logger,middleware);

logger.info("./routes/TipoActuador");
require("./routes/TipoActuador")(app, dataProvider, logger,middleware);

logger.info("./routes/Motor");
require('./routes/Motor.js')(app, moment, dataProvider,serviceProvider, logger,middleware);

logger.info("./routes/Estados");
require('./routes/Estados.js')(app, logger,middleware);


logger.info("./routes/Servicio");
require('./routes/Servicio.js')(app, moment, dataProvider,serviceProvider,logger,middleware);


logger.info("Configuracion de Sincronizador de bases de datos..");
var DBSync = require("./lib/util/DBSync.js");

var dbSync = new DBSync(dataProvider, config, logger, function(error, info) {
  logger.info("Sincronizador configurado : " + info);
});


logger.info("Fin Configuracion ...");

/************************** END CONFIG ********************************/



app.listen(appPort);
logger.info('Servidor corriendo en: http://'+IPAddress+':'+appPort+'/');
