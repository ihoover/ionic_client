angular.module('starter.services', [])

/**
 * A service that returns the current environmental factors being measured and 
 * their current values
 */
 
.factory('Factors', function() {

  return {
    all: function() {
      //return factors;
      return FACTORS;
    },
    get: function(factorId) {
      // Simple index lookup
      return FACTORS[factorId];
    }
  }
})


