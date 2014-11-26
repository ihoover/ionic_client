angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})

/**
 * A service that returns the current environmental factors being measured and 
 * their current (ave. ?) value
 */
 
.factory('Factors', function() {
  
  var factors = [
    { id: 0, name: "Temperature", value: [58,58,57,56,58,57,59,60,61,62,63,63,62,62]},
    { id: 1, name: "Humidity", value: [33, 33,33,32,32,31,31,32,32,33,33,34,34,34,32]},
    { id: 2, name: "Soil Moisture", value: [73]},
    { id: 3, name: "Lights", value: ['on']}
  ];

  
  return {
    all: function() {
      return factors;
    },
    get: function(factorId) {
      // Simple index lookup
      return factors[factorId];
    }
  }
  
})


/**
 * plot data.  just for prototype.  please use acutal pretty plotting library.
 */
.factory('Plot', function(){
  
  plotter = function(data){  
    var canvas = document.getElementById("factor_history");
    var height = canvas.height;
    var width = canvas.width;
    var ctx = canvas.getContext("2d");
    ctx.lineWidth = 3;
    
    var x_scale = width/data.length;
    ctx.beginPath();
    for (var i = 0; i < data.length; i ++)
    {
      ctx.lineTo(x_scale*i,data[i]*10 - data[0]*8);
      ctx.stroke();
      ctx.moveTo(x_scale*i, data[i]*10 - data[0]*8);
    }
  }
  
  return plotter;
});
