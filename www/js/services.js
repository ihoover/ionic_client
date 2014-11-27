function temp_to_string(temp){
  return String(temp) + "\u2109";
}

function hum_to_string(humidity){
  return String(humidity) + '%';
}

function identity(value){
  return value;
}

function prepare(factor){
  var states = ['off', 'on'];
  var prepared = {
            id: factor.id,
            states: states,
            state: factor.state,
            name: factor.name,
            overview: factor.string(factor.value.slice(-1)[0]),
            value: factor.value,
            device: factor.device
          };
  return prepared
}

function override(){
    var state_word = document.getElementById("current-state-word");
    var current_state = state_word.innerHTML;
    var not_state_word = document.getElementById("current-not-state-word");
    state_word.innerHTML = not_state_word.innerHTML;
    not_state_word.innerHTML = current_state;
    
    var warning = document.getElementById("override-warning");
    if (warning.style.visibility == 'visible')
    {
      warning.style.visibility = 'hidden';
    }
    else
    {
      warning.style.visibility = 'visible';
    }
}

angular.module('starter.services', [])

/**
 * A service that returns the current environmental factors being measured and 
 * their current (ave. ?) value
 */
 
.factory('Factors', function() {
  var factors = [
    { id: 0, 
      name: 'Temperature',
      state: 1,
      value: [58,58,57,56,58,57,59,60,61,62,63,63,62,62],
      device: 'heater',
      string: temp_to_string},
    { id: 1,
      name: 'Humidity',
      value: [33,33,33,32,32,31,31,32,32,33,33,34,34,34,32],
      state: 0,
      device: 'fan',
      string: hum_to_string},
    { id: 2,
      name: 'Soil Moisture',
      value: [73],
      state: 1,
      device: 'irrigation',
      string: hum_to_string},
    { id: 3,
      name: 'Lights',
      value: ['on'],
      state: 1,
      device: 'lights',
      string: identity}
  ];

  return {
    all: function() {
      //return factors;
      var overview = [];
      for (var i = 0; i < factors.length; i++){
        overview.push(prepare(factors[i]));
      }
      return overview;
    },
    get: function(factorId) {
      // Simple index lookup
      return prepare(factors[factorId]);
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
