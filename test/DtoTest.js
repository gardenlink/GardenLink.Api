var should = require('should');
var assert = require('assert');
var request = require('supertest');
var winston = require('winston');

//MAS INFORMACION SOBRE SHOULD:
// http://www.phloxblog.in/node-js-uni-testing-js/#.V28ET7jhCCh


/* Mis variables */

var logger = new winston.Logger({});
var RelayModel = require('../lib/dto/Relay.js');
var relayModel;


describe('****** Models test (dtoTest) *********', function() {


  // within before() you can run all the operations that are needed to setup your tests. In this case
  // I want to create a connection with the database, and when I'm done, I call done().
  before(function(done) {
    // In our tests we use the test db
    relayModel = new RelayModel();
    done();




  });
  // use describe to give a title to your test suite, in this case the tile is "Account"
  // and then specify a function in which we are going to declare all the tests
  // we want to run. Each test starts with the function it() and as a first argument
  // we have to provide a meaningful title for it, whereas as the second argument we
  // specify a function that takes a single parameter, "done", that we will use
  // to specify when our test is completed, and that's what makes easy
  // to perform async test!


   describe('#RelayModel-Create', function() {

		 it('should create a Relay Object based on parameters', function(done) {
			   	 var payLoad = {
             "IdRelay" : 9,
             "IdDispositivo" : "001",
             "Descripcion" : "Test",
             "MarcaModelo" : "test marca",
             "Tipo": 1,
             "Pin" : 1,
             "EsPinAnalogo" : "true",
             "Habilitado" : true,
             "Activo" : "false",
             "EsInverso" : "test"
           };

           relayModel.CrearObjeto(payLoad);
           console.dir(relayModel.Objeto());
			   	 should.exist(relayModel.IdRelay);
           relayModel.Objeto().IdRelay.should.equal(9);
			   	 done();
		});




  }); //End TEST RELAYMODEL





}); //END
