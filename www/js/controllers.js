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
    device_id = Number(attrs.id[attrs.id.length -1]);
    
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
    var time = new Date();
    var x = {
      data: range(1000*60, data.length*1000*60 , 1000*60),
      string: function(value){
        return pretty_time(value)+ ' ago';
      }};
    var y = {
      data: data,
      string: DEVICES[device_id].factor.string};
    x.data.reverse();
    console.log(pretty_time(time.getTime()));
    plot(element[0], x, y);
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
