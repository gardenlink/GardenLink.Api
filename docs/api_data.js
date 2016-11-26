define({ "api": [
  {
    "type": "post",
    "url": "/v1/auth/login",
    "title": "Login",
    "group": "Autenticacion",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "token",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Login",
    "description": "<p>Login para obtener un token</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "usuario",
            "description": "<p>{String}</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "password",
            "description": "<p>{String}</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl --data \"usuario=juanperez&password=jp123\" http://gardenlink.cl:9000/api/v1/auth/login",
        "type": "curl"
      }
    ],
    "filename": "routes/Autenticacion.js",
    "groupTitle": "Autenticacion"
  },
  {
    "type": "post",
    "url": "/v1/dispositivos",
    "title": "Crea un dispositivo",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "ok",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Crear_Dispositivo",
    "group": "Dispositivos",
    "description": "<p>Crea un dispositivo</p>",
    "filename": "routes/Dispositivo.js",
    "groupTitle": "Dispositivos"
  },
  {
    "type": "delete",
    "url": "/v1/dispositivos/:id",
    "title": "Elimina un dispositivo",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "ok",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.1",
    "group": "Dispositivos",
    "name": "Eliminar_Dispositivo",
    "description": "<p>elimina un dispositivo</p>",
    "filename": "routes/Dispositivo.js",
    "groupTitle": "Dispositivos"
  },
  {
    "type": "put",
    "url": "/v1/dispositivos/:id/ping",
    "title": "Ping al dispositivo",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "ok",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Hacer_ping_al_dispositivo",
    "group": "Dispositivos",
    "description": "<p>Realiza un ping al dispositivo</p>",
    "filename": "routes/Dispositivo.js",
    "groupTitle": "Dispositivos"
  },
  {
    "type": "put",
    "url": "/v1/dispositivos/:id",
    "title": "Modifica un dispositivo",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "ok",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Modificar_Dispositivo",
    "group": "Dispositivos",
    "description": "<p>modifica un dispositivo</p>",
    "filename": "routes/Dispositivo.js",
    "groupTitle": "Dispositivos"
  },
  {
    "type": "get",
    "url": "/v1/dispositivos/:id",
    "title": "Obtener informacion de un dispositivo determinado",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "id",
            "optional": false,
            "field": "id",
            "description": "<p>Dispositivo (unico)</p>"
          }
        ]
      }
    },
    "group": "Dispositivos",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Listado",
            "description": "<p>de dispositivos</p>"
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "ObtenerDispositivo",
    "description": "<p>Obtiene un objeto dispositivo basado en su ID</p>",
    "filename": "routes/Dispositivo.js",
    "groupTitle": "Dispositivos"
  },
  {
    "type": "get",
    "url": "/v1/dispositivos/:id/motores",
    "title": "Obtener motores asociados",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Listado",
            "description": "<p>de motores asociados a este dispositivo</p>"
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "ObtenerMotorAsociado",
    "description": "<p>Obtener detalle de motores asociados al dispositivo consultado</p>",
    "group": "Dispositivos",
    "filename": "routes/Dispositivo.js",
    "groupTitle": "Dispositivos"
  },
  {
    "type": "get",
    "url": "/v1/dispositivos/:id/relays",
    "title": "Obtener relays asociados",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Listado",
            "description": "<p>de relays asociados a este dispositivo</p>"
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "ObtenerRelayAsociado",
    "description": "<p>Obtener detalle de relays asociados al dispositivo consultado</p>",
    "group": "Dispositivos",
    "filename": "routes/Dispositivo.js",
    "groupTitle": "Dispositivos"
  },
  {
    "type": "get",
    "url": "/v1/dispositivos/:id/sensores",
    "title": "Obtener sensores asociados",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Listado",
            "description": "<p>de sensores asociados a este dispositivo</p>"
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "ObtenerSensorAsociado",
    "description": "<p>Obtener detalle de sensores asociados al dispositivo consultado</p>",
    "group": "Dispositivos",
    "filename": "routes/Dispositivo.js",
    "groupTitle": "Dispositivos"
  },
  {
    "type": "get",
    "url": "/v1/dispositivos",
    "title": "Listar dispositivos",
    "version": "0.0.1",
    "name": "Obtener_Dispositivos",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "array",
            "optional": false,
            "field": "El",
            "description": "<p>arreglo de objetos solicitado</p>"
          }
        ]
      }
    },
    "description": "<p>Obtener el listado de dispositivos</p>",
    "group": "Dispositivos",
    "filename": "routes/Dispositivo.js",
    "groupTitle": "Dispositivos"
  },
  {
    "type": "put",
    "url": "/v1/dispositivos/:id/ip",
    "title": "Modifica la property ip",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "ok",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Subscribir_Dispositivo",
    "group": "Dispositivos",
    "description": "<p>Modificar la ip de un dispositivo</p>",
    "filename": "routes/Dispositivo.js",
    "groupTitle": "Dispositivos"
  },
  {
    "type": "get",
    "url": "/v1/logs",
    "title": "Obtiene los logs del dia de hoy",
    "group": "Logs",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Listado",
            "description": "<p>de Logs</p>"
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Obtener_Logs",
    "description": "<p>Devuelve los logs del dia de hoy</p>",
    "filename": "routes/Log.js",
    "groupTitle": "Logs"
  },
  {
    "type": "patch",
    "url": "/v1/motores/:id",
    "title": "Accionar Motores",
    "group": "Motores",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "array",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "AccionarMotor",
    "description": "<p>Accionar motores (AVANZAR, DETENER)</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "path",
            "defaultValue": "Action",
            "description": "<p>{String}</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "value",
            "description": "<p>{String=&quot;AVANZAR&quot;, &quot;RETROCEDER&quot;, &quot;DETENER&quot;, &quot;ESTADO&quot;, &quot;POSICION&quot;}</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl --request PATCH --data \"path=Accion&value=AVANZAR\" http://gardenlink.cl:9000/api/v1/motores/1",
        "type": "curl"
      }
    ],
    "filename": "routes/Motor.js",
    "groupTitle": "Motores"
  },
  {
    "type": "post",
    "url": "/v1/motores",
    "title": "Crear un motor",
    "group": "Motores",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Objeto",
            "description": "<p>motor</p>"
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Crear_Motor",
    "description": "<p>Crear un motor</p>",
    "filename": "routes/Motor.js",
    "groupTitle": "Motores"
  },
  {
    "type": "delete",
    "url": "/v1/motores/:id",
    "title": "Eliminar un motor",
    "group": "Motores",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Objeto",
            "description": "<p>motor</p>"
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Eliminar_Motor",
    "description": "<p>Eliminar un motor</p>",
    "filename": "routes/Motor.js",
    "groupTitle": "Motores"
  },
  {
    "type": "put",
    "url": "/v1/motores/:id",
    "title": "Modificar un motor",
    "group": "Motores",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Objeto",
            "description": "<p>motor</p>"
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Modificar_Motor",
    "description": "<p>Modificar un motor (objeto completo)</p>",
    "filename": "routes/Motor.js",
    "groupTitle": "Motores"
  },
  {
    "type": "get",
    "url": "/v1/motores/:id/mediciones",
    "title": "Obtener mediciones",
    "group": "Motores",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "ok",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Motor_Mediciones",
    "description": "<p>Obtener ultimas mediciones asociadas al motor</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:9000/api/v1/motores/1/mediciones?last=true&sorttype=_id&sortdirection=desc",
        "type": "curl"
      }
    ],
    "filename": "routes/Motor.js",
    "groupTitle": "Motores"
  },
  {
    "type": "get",
    "url": "/v1/motores/:id",
    "title": "Obtiene un motor",
    "group": "Motores",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Objeto",
            "description": "<p>motor</p>"
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Obtener_Motor",
    "description": "<p>Devuelve un motor basado en su ID</p>",
    "filename": "routes/Motor.js",
    "groupTitle": "Motores"
  },
  {
    "type": "get",
    "url": "/v1/motores",
    "title": "Obtiene la lista de motores existente",
    "group": "Motores",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Listado",
            "description": "<p>de motores</p>"
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Obtener_Motores",
    "description": "<p>Devuelve el listado de motores configurados</p>",
    "filename": "routes/Motor.js",
    "groupTitle": "Motores"
  },
  {
    "type": "patch",
    "url": "/v1/relays/:id",
    "title": "Activar/Desactivar Relay",
    "group": "Relays",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "array",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Activar_Relay",
    "description": "<p>Activar o desactivar un relay</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "path",
            "defaultValue": "Activo",
            "description": "<p>{String}</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "value",
            "description": "<p>{Boolean=&quot;true&quot;,&quot;false&quot;}</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl --request PATCH --data \"path=Activo&value=true\" http://gardenlink.cl:9000/api/v1/relays/1",
        "type": "curl"
      }
    ],
    "filename": "routes/Relay.js",
    "groupTitle": "Relays"
  },
  {
    "type": "post",
    "url": "/v1/relays",
    "title": "Crear un relay",
    "group": "Relays",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "array",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Crear_un_relay",
    "description": "<p>Crear un relay</p>",
    "filename": "routes/Relay.js",
    "groupTitle": "Relays"
  },
  {
    "type": "delete",
    "url": "/v1/relays/:id",
    "title": "Eliminar un relay",
    "group": "Relays",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "array",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Eliminar_un_relay",
    "description": "<p>Eliminar un relay</p>",
    "filename": "routes/Relay.js",
    "groupTitle": "Relays"
  },
  {
    "type": "put",
    "url": "/v1/relays/:id",
    "title": "Modificar un relay",
    "group": "Relays",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "array",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Modificar_un_relay",
    "description": "<p>Modificar un relay</p>",
    "filename": "routes/Relay.js",
    "groupTitle": "Relays"
  },
  {
    "type": "get",
    "url": "/v1/relays",
    "title": "Obtiene la lista de relays existente",
    "group": "Relays",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Listado",
            "description": "<p>de relays</p>"
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Obtener_Relays",
    "description": "<p>Devuelve los logs del dia de hoy</p>",
    "filename": "routes/Relay.js",
    "groupTitle": "Relays"
  },
  {
    "type": "get",
    "url": "/v1/relays",
    "title": "Obtiene un relay",
    "group": "Relays",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "array",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Obtener_un_Relay",
    "description": "<p>Obtiene un relay basado en su ID</p>",
    "filename": "routes/Relay.js",
    "groupTitle": "Relays"
  },
  {
    "type": "get",
    "url": "/v1/relays/:id/mediciones",
    "title": "Obtener mediciones",
    "group": "Relays",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "ok",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Relay_Mediciones",
    "description": "<p>Obtener ultimas mediciones asociadas al relay</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:9000/api/v1/relays/1/mediciones?last=true&sorttype=_id&sortdirection=desc",
        "type": "curl"
      }
    ],
    "filename": "routes/Relay.js",
    "groupTitle": "Relays"
  },
  {
    "type": "post",
    "url": "/v1/relays/mediciones/sync",
    "title": "Sincronizar mediciones",
    "group": "Relays",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "ok",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "sincronizar_relays",
    "description": "<p>Servicio usado para sincromizar entre servidores</p>",
    "filename": "routes/Relay.js",
    "groupTitle": "Relays"
  },
  {
    "type": "get",
    "url": "/v1/sensores/:id/mediciones/grafico",
    "title": "Generar Grafico de mediciones",
    "group": "Sensores",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "ok",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Graficar_Sensor",
    "description": "<p>Genera un grafico con las ultimas mediciones definidas en el parametro limit</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "limit",
            "defaultValue": "50",
            "description": "<p>{number}</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://gardenlink.cl:9000/api/v1/sensores/1/mediciones?limit=100",
        "type": "curl"
      }
    ],
    "filename": "routes/Sensor.js",
    "groupTitle": "Sensores"
  },
  {
    "type": "get",
    "url": "/v1/sensores",
    "title": "Obtener todos los sensores",
    "group": "Sensores",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Listado",
            "description": "<p>de sensores</p>"
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Obtener_Sensores",
    "description": "<p>Devuelve el listado completo de sensores independiente del dispositivo al que esten asociados</p>",
    "filename": "routes/Sensor.js",
    "groupTitle": "Sensores"
  },
  {
    "type": "get",
    "url": "/v1/sensores/:id/mediciones",
    "title": "Obtener Mediciones",
    "group": "Sensores",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Listado",
            "description": "<p>de sensores</p>"
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Obtener_mediciones",
    "description": "<p>Obtener las mediciones del sensor</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": true,
            "field": "last",
            "description": "<p>{boolean}</p>"
          },
          {
            "group": "Parameter",
            "optional": true,
            "field": "limit",
            "description": "<p>{number}</p>"
          },
          {
            "group": "Parameter",
            "optional": true,
            "field": "sorttype",
            "description": "<p>{string=&quot;TimeStamp&quot;}</p>"
          },
          {
            "group": "Parameter",
            "optional": true,
            "field": "sortdirection",
            "description": "<p>{string=&quot;asc&quot;,&quot;desc&quot;}</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://gardenlink.cl:9000/api/v1/sensores/1/mediciones?last=true&sorttype=TimeStamp&sortdirection=asc",
        "type": "curl"
      }
    ],
    "filename": "routes/Sensor.js",
    "groupTitle": "Sensores"
  },
  {
    "type": "get",
    "url": "/v1/sensores/:id",
    "title": "Obtener un sensor",
    "group": "Sensores",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Listado",
            "description": "<p>de sensores</p>"
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Obtener_un_Sensor",
    "description": "<p>Devuelve un sensor basado en su ID</p>",
    "filename": "routes/Sensor.js",
    "groupTitle": "Sensores"
  },
  {
    "type": "post",
    "url": "/v1/sensores",
    "title": "Crear un sensor",
    "group": "Sensores",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Listado",
            "description": "<p>de sensores</p>"
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "crear_Sensor",
    "description": "<p>Crear un sensor</p>",
    "filename": "routes/Sensor.js",
    "groupTitle": "Sensores"
  },
  {
    "type": "post",
    "url": "/v1/sensores/mediciones",
    "title": "Crear Medicion",
    "group": "Sensores",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "ok",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "crear_medicion",
    "description": "<p>Graba una medicion desde los sensores</p>",
    "filename": "routes/Sensor.js",
    "groupTitle": "Sensores"
  },
  {
    "type": "delete",
    "url": "/v1/sensores/:id",
    "title": "Elimina un sensor",
    "group": "Sensores",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Listado",
            "description": "<p>de sensores</p>"
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "eliminar_Sensor",
    "description": "<p>Elimina un sensor basado en su ID</p>",
    "filename": "routes/Sensor.js",
    "groupTitle": "Sensores"
  },
  {
    "type": "put",
    "url": "/v1/sensores/:id",
    "title": "Modificar un sensor",
    "group": "Sensores",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Listado",
            "description": "<p>de sensores</p>"
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "modificar_Sensor",
    "description": "<p>Modifica un sensor (objeto completo)</p>",
    "filename": "routes/Sensor.js",
    "groupTitle": "Sensores"
  },
  {
    "type": "post",
    "url": "/v1/sensores/mediciones/sync",
    "title": "Sincronizar mediciones",
    "group": "Sensores",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "ok",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "sincronizar_mediciones",
    "description": "<p>Servicio usado para sincromizar entre servicdores</p>",
    "filename": "routes/Sensor.js",
    "groupTitle": "Sensores"
  },
  {
    "type": "get",
    "url": "/v1/tipoactuadores",
    "title": "Obtener los tipos de actuadores configurados",
    "group": "TipoActuadores",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "ok",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Obtener_TipoActuador",
    "description": "<p>Listado de tipos de actuadores existentes</p>",
    "filename": "routes/TipoActuador.js",
    "groupTitle": "TipoActuadores"
  },
  {
    "type": "get",
    "url": "/v1/tipoactuadores/:id",
    "title": "Obtener un tipo de actuador",
    "group": "TipoActuadores",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "ok",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.1",
    "name": "Obtener_un_TipoActuador",
    "description": "<p>Obtiene un tipo segun su ID</p>",
    "filename": "routes/TipoActuador.js",
    "groupTitle": "TipoActuadores"
  }
] });
