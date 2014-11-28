// a device
function Device(device_descriptor){
  
  this.id = device_descriptor.id;
  
  this.states = ['off', 'on'];
  
  // 0 or 1
  this.state = device_descriptor.state;
  
  // e.g. 'heater' or 'fan' etc
  this.name = device_descriptor.name
  
  // factor object
  // the envoronmental fector controlled by this device  (temperature, humidity etc.)
  this.factor = device_descriptor.factor;
  
  // the sensor measurements associated with this device
  // probably list of tuples of the form (timestamp, value)
  this.values = device_descriptor.values;
  
  // get most recent value
  this.latest_value = function() {
    return this.values.slice(-1)[0];
  }
  
  //
  this.toggle_state = function() {
    this.state = 1 - this.state;
  }
  
  this.string = function() {
    return this.factor.string(this.latest_value());
  }
}

var device_descriptors = [
    { id: 0, 
      state: 1,
      name: 'heater',
      factor: FACTORS[0],
      values: [58,58,57,56,58,57,59,60,61,62,63,63,62,62]},
    { id: 1,
      state: 0,
      name: 'fan',
      factor: FACTORS[1],
      values: [33,33,33,32,32,31,31,32,32,33,33,34,34,34,32]},
    { id: 2,
      name: 'irrigator',
      factor: FACTORS[2],
      values: [33,32,34,35,34,37,39,38,41,43,44,44,47,46,48,52,56],
      state: 1},
    { id: 3,
      name: 'lights',
      factor: FACTORS[3],
      values: ['off', 'on'],
      state: 1},
    { id: 4, 
      state: 0,
      name: 'heater 2',
      factor: FACTORS[0],
      values: [66,63,67,66,68,67,69,70,71,72,73,73,72,72]}
  ];

// instantiate the device ocjects
var DEVICES = [];
for (var i = 0; i < device_descriptors.length; i++){
  DEVICES.push(new Device(device_descriptors[i]));
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

function override(id){
    var state_word = document.getElementById("current-state-word-"+id);
    var current_state = state_word.innerHTML;
    var not_state_word = document.getElementById("current-not-state-word-"+id);
    state_word.innerHTML = not_state_word.innerHTML;
    not_state_word.innerHTML = current_state;
    
    // show warning
    var warning = document.getElementById("override-warning-"+id);
    if (warning.style.visibility == 'visible')
    {
      warning.style.visibility = 'hidden';
    }
    else
    {
      warning.style.visibility = 'visible';
    }
    
    // actually toggle state
    DEVICES[id].toggle_state();
}