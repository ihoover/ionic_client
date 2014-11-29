angular.module('starter.controllers', [])

.controller('SettingsCtrl', function($scope) {
})

.controller('OverviewCtrl', function($scope, Factors) {
  $scope.factors = Factors.all();
})

.controller('FactorCtrl', function($scope, $stateParams, Factors){
  $scope.factor = Factors.get($stateParams.factorId);
  $scope.override = override;
})

.directive('plotDirective', function(){
  return function(scope, element, attrs){
    var id = attrs.id;
    var data = attrs.data;
    
    //turn data into array of numbers
    data = data.split(',');
    for (var i = 0; i < data.length; i++)
      data[i] = Number(data[i].replace(/[\[\]]/,''));
    
    var height = attrs.height;
    var width = attrs.width;
    var ctx = element[0].getContext("2d");
    ctx.lineWidth = 3;
    
    var x_scale = width/data.length;
    
    // test plot function
    var x = {
      data: range(data.length),
      string: function(value){
        return Math.round(value*100)/100;
      }};
    var y = {
      data: data,
      string: temp_to_string};
    
    plot(element[0], x, y);
    ctx.beginPath();
    for (var i = 0; i < data.length; i ++)
    {
      ctx.lineTo(x_scale*i,data[i]*10 - data[0]*8);
      ctx.moveTo(x_scale*i, data[i]*10 - data[0]*8);
    }
    //ctx.stroke();
  }
})

.directive('overrideDirective', function(){
  var dir =  function(scope, element, attrs){
    var warning = element[0];
    
    // exctract the ID of the device this corresponds to
    device_id = Number(attrs.id[attrs.id.length -1]);
    var duration = document.getElementById('override-duration-'+device_id);
    
    // check if this device is being overriden
    if (DEVICES[device_id].is_override()){
      // make the warning visible
      warning.style.visibility = "visible";
      
      //update the duration
      if (duration != null){
        duration.innerHTML = pretty_time(DEVICES[device_id].override_left());
      }  
    }
    
    else {
      warning.style.visibility = "hidden";
    }
    setTimeout(function(){dir(scope, element, attrs)}, 500);
  }
 
 return dir;
});
