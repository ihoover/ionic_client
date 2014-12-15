function temp_to_string(temp){
  temp = Math.round(temp*1)/1;
  return String(temp) + "\u2109";
}

function hum_to_string(humidity){
  return String(Math.round(humidity)) + '%';
}

function identity(value){
  return value;
}

function average_latest(){
  return this.string(this.latest_value());
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
  
  // data about this environmental factor
  this.values = factor_descriptor.values;
  
  //update values
  this.update = function(service) {
    
    /*
     *  This AJAX call should get the latest value for this factor
     *
     */

    YQI = escape("select * from yahoo.finance.quotes where symbol in ('AAPL','GOOG','MSFT')");
    callback="requestComplete";
    URL = "http://query.yahooapis.com/v1/public/yql?q=" + YQI +      "&format=json&env=http://datatables.org/alltables.env&callback=" + callback;
    service.get(URL)
    .success(function(data, status, headers, config) {console.log("response", data.query)});
    
    // update the values with the latest
    this.values.push(60);

  }
  
  // get most recent value
  this.latest_value = function() {
    return this.values.slice(-1)[0];
  }
}

var factor_descriptors = [
    { id: 0, 
      name: 'Temperature',
      string: temp_to_string,
      summary: average_latest,
      values: [66,63,67,66,68,67,69,70,71,72,73,73,72,72]},
    { id: 1,
      name: 'Humidity',
      summary: average_latest,
      string: hum_to_string,
      values:  [20,19,18,18,19,18,20,21,22,23,21,24,23,24,25,23,25,26,25,27,29,28,30,31,30,30,31,32,33,33,33,32,32,31,31,32,32,33,33,34,34,34,32]},
    { id: 2,
      name: 'Soil Moisture',
      summary: average_latest,
      string: hum_to_string,
      values: [33,32,34,35,34,37,39,38,41,43,44,44,47,46,48,52,56, 55]},
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
