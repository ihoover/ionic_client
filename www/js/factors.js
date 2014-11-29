function temp_to_string(temp){
  temp = Math.round(temp*1)/1;
  return String(temp) + "\u2109";
}

function hum_to_string(humidity){
  return String(humidity) + '%';
}

function identity(value){
  return value;
}

function average_latest(){
  var latest = [];
  for(var i = 0; i < this.devices().length; i++){
    latest.push(this.devices()[i].latest_value());
  }
  
  sum = 0;
  for(var i = 0; i < latest.length; i ++){
    sum += latest[i];
  }
  
  return this.string(sum/latest.length);
}

function average_state(){
  var states = ['all off', 'some on', 'all on'];
  var state_sum = 0;
  for(var i = 0; i < this.devices().length; i++){
    state_sum += this.devices()[i].state;
  }
  
  if (state_sum == 0)
    return states[0];
  else if (state_sum < this.devices().length)
    return states[1];
  else
    return states[2];
}

// one of the environmental factors, humidity, heat etc.
function Factor(factor_descriptor){
  
  // e.g. 'humidity' or 'temperature'
  this.name = factor_descriptor.name;
  
  // unique etc.
  this.id = factor_descriptor.id;
  
  // function for appending the right symbol for the units
  this.string = factor_descriptor.string;
  
  // return a list of all the Device objects that effect this factor
  this._devices = [];
  this.devices = function() {
    if(this._devices.length == 0){
      for(var i = 0; i < DEVICES.length; i++){
        if (DEVICES[i].factor == this)
          this._devices.push(DEVICES[i]);
      }
    }
    return this._devices;
  }
  
  // return the summary of the state of this factor
  this.summary = factor_descriptor.summary;
  
  // summary of device states
  this.device_summary = average_state;
}

var factor_descriptors = [
    { id: 0, 
      name: 'Temperature',
      string: temp_to_string,
      summary: average_latest},
    { id: 1,
      name: 'Humidity',
      summary: average_latest,
      string: hum_to_string},
    { id: 2,
      name: 'Soil Moisture',
      summary: average_latest,
      string: hum_to_string},
    { id: 3,
      name: 'Lights',
      summary: average_state,
      string: identity}
  ];

// create global array of the factor aobjects
var FACTORS = [
  new Factor(factor_descriptors[0]),
  new Factor(factor_descriptors[1]),
  new Factor(factor_descriptors[2]),
  new Factor(factor_descriptors[3])
]
