/**
 * Prop Odds API
 *  The Prop Odds API allows you to query player and game prop odds from different bookies. 
 *
 * The version of the OpenAPI document: 0.9
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', process.cwd()+'/src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require(process.cwd()+'/src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.PropOddsApi);
  }
}(this, function(expect, PropOddsApi) {
  'use strict';

  var instance;

  beforeEach(function() {
    instance = new PropOddsApi.FantasyBooks();
  });

  var getProperty = function(object, getter, property) {
    // Use getter method if present; otherwise, get the property directly.
    if (typeof object[getter] === 'function')
      return object[getter]();
    else
      return object[property];
  }

  var setProperty = function(object, setter, property, value) {
    // Use setter method if present; otherwise, set the property directly.
    if (typeof object[setter] === 'function')
      object[setter](value);
    else
      object[property] = value;
  }

  describe('FantasyBooks', function() {
    it('should create an instance of FantasyBooks', function() {
      // uncomment below and update the code to test FantasyBooks
      //var instance = new PropOddsApi.FantasyBooks();
      //expect(instance).to.be.a(PropOddsApi.FantasyBooks);
    });

    it('should have the property gameId (base name: "game_id")', function() {
      // uncomment below and update the code to test the property gameId
      //var instance = new PropOddsApi.FantasyBooks();
      //expect(instance).to.be();
    });

    it('should have the property fantasyBooks (base name: "fantasy_books")', function() {
      // uncomment below and update the code to test the property fantasyBooks
      //var instance = new PropOddsApi.FantasyBooks();
      //expect(instance).to.be();
    });

  });

}));