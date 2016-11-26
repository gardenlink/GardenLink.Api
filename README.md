# GardenLink.Api
API REST para controlador de riego. Explicacion general en https://gardenlink.github.io

### Instalar:

git clone https://github.com/gardenlink/GardenLink.Api.git

cd GardenLink.Api

npm install

### Iniciar:

node ApiServer.js debug

### Configuracion:

#### Configuraciones del API Server

Hostname y puerto de escucha, en caso de estar publicado y asociado a un DNS colocarlo aca
app_host: nombre / ip / dns del server
app_port: puerto por defecto 9000


#### Configuraciones del servidor MQTT

Configrar para apuntar al broker mqtt (Gardenlink.MQTTServer)

"mqtt" : {
    	"mqtt_server" : "localhost",  //ubicacion del servidor mqtt 
    	"mqtt_port": "1883",          //puerto por defecto
    	"http_server" : "localhost",  //ubicacion del servidor http del broker
    	"http_port" : "3000"          //puerto por defecto
    },

#### Configuraciones de base de datos

Existen 3 alternativas (MONGODB, NEDB (habilitado por defecto), DWEETIO), solo una de ellas puede estar activa mediante el parametro "Habilitado".

Ejemplo:

"datasource" : {
  "NEDB"  : { "Habilitado" : "true",        //solo un tipo de base puede estar habiltada
              "Sincronizacion" : "true",    //no usado por el momento 
              "Debug" : "true",             //loguea en modo debug
            }

}

Para NEDB la base de datos queda en /db

#### sync

Si tengo instalado este servidor en diferentes host, ejemplo: raspberry y heroku, con esto puedo sincronizar las bases de datos para mantener la misma info. Por defecto, cada api tiene un endpoint llamado /sync que es usado para recibir los datos que se van a sincronizar (ver API Docs)

"sync" : {
      "Habilitado" : "false",
      "Debug" : "true",
      "Intervalo" : "1",  //cada cuantos minutos se replican los datos
      "Entidades" : {  //que entidades me interesa mantener replicadas
        "Dispositivos" : "true",
        "Relays" : "true",
        "Sensores" : "true",
        "Mediciones" : "true"
      },
      "TargetHost" : "targetserver",   //donde esta el servidor de destino en donde quiero replicar
      "TargetPort" : "80",
      "BaseURL" : "/api/v1/"
 }
 
 #### Mailer
 
 Configuracion para envio de correos de alerta
 
  "mail_enabled" : "false",
  "mailer_service" : "GMAIL",
  "mailer_user" : "xxxx@domain.com",
  "mailer_pass" : "xxxx",
  "mailer_destinatario" : "destinatario@domain.com",
  "mailer_remitente" : "gardenlink@domain.com",
  
  #### Twitter
  
  Para enviar tweets y autenticar (todavia no lo uso)
  
  "twitter_enabled" : "false",
  "twitter_consumer_secret" :"xxx",
  "twitter_consumer_key":"xxx",
  "twitter_access_token":"xxx",
  "twitter_access_token_secret":"xxxx",
  "twitter_callback_url" : "http://localhost:9000/auth/twitter/callback",
  "twitter_autenticacion" : "false",
  
 
 #### Monitoreo
 
  "monitor_habilitado" : "false",  
  "monitor_intervalo" : "1",      // cada cuantos minutos se ejecuta el codigo de monitoreo
  "monitor_datasource" : "",      // no usado aun
  "temporizador_habilitado" : "false",  //activo / desactivo las tareas programadas

#### Seguridad

Se aseguran las apis mediante JWT, de estar habilitado, primero se debe obtener un token desde /auth/login (ver api docs)

 "seguridad" : {
    	"habilitado" : "false",
    	"jwt" : {
    		"TOKEN_SECRET" : "secreto"    //secret para la API, se usa para generar el JWT
    	}
    }

### Api docs

https://cdn.rawgit.com/gardenlink/GardenLink.Api/master/docs/index.html

