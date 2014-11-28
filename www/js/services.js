angular.module('starter.services', [])

/**
 * A service that returns the current environmental factors being measured and 
 * their current (ave. ?) value
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


/**
 * plot data.  just for prototype.  please use acutal pretty plotting library.
 */
.factory('Plot', function(){
  
  plotter = function(device){
    var id = "value_plot_" + device.id;
    var data = device.values;
    var canvas = document.getElementById(id);
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
