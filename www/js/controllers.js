angular.module('starter.controllers', [])

.controller('SettingsCtrl', function($scope) {
})

.controller('OverviewCtrl', function($scope, Factors) {
  $scope.factors = Factors.all();
})

.controller('FactorCtrl', function($scope, $stateParams, Factors, $http){
  $scope.factor = Factors.get($stateParams.factorId);
  $scope.factor.service = $http;
  $scope.override = override;
})

.directive('plotDirective', function($http){
  var plotter = function(scope, element, attrs, chain_id){
    var id = attrs.id;
    if (chain_id == null){
      chain_id = 0;
    }
    
    var factor_id = Number(attrs.id[attrs.id.length -1]);
    var factor = FACTORS[factor_id];
    var data = factor.values;
    
    // only proceed if this chain hasn't been started already
    
      
    // test plot function
    var time = new Date();
    
    var x = {
      data: [],
      string: function(value){
        return pretty_time(value)+ ' ago';
      }};
    var y = {
      data: [],
      string: FACTORS[factor_id].string};
    
    for (var i = 0; i < data.length; i++){
      x.data.push(time.getTime() - data[i][0]);
      y.data.push(data[i][1]);
    }
    
    // on calls not triggered by setTimeout, element[0] is what we need to use
    // otherwise we want to get a new element via document.getElementById
    var canvas = document.getElementById(attrs.id);
    if (canvas != null){
      plot(canvas, x, y);
    }
    else{
      plot(element[0], x,y);
    }
    
    // this means that the recursive calling will only be triggered once
    if (chain_id == factor.chain) {
      factor.chain = time.getTime();
      // update values
      FACTORS[factor_id].update($http);
  
      //replot
      setTimeout(function(){plotter(scope, element, attrs, factor.chain)}, 5000);
    }
  }
  return plotter;
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
