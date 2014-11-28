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
    
    var canvas = document.getElementById(id);
    var height = attrs.height;
    var width = attrs.width;
    var ctx = element[0].getContext("2d");
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
});
