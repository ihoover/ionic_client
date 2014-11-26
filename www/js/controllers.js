angular.module('starter.controllers', [])


.controller('SettingsCtrl', function($scope) {
})

.controller('OverviewCtrl', function($scope, Factors) {
  $scope.factors = Factors.all();
})

.controller('FactorCtrl', function($scope, $stateParams, Factors, Plot){
  $scope.factor = Factors.get($stateParams.factorId);
  $scope.Plot = Plot;
});

