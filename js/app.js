var app = angular.module('app', ['mongolabResourceHttp']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/faceback/:facebackId', {templateUrl: 'faceback.html', controller: 'FeedbackCtrl' }).
      when('/facebacks', {templateUrl: 'facebacks.html', controller: 'ListFacebacksCtrl', resolve: {
        faceback: function(Faceback) {
          return new Faceback();
        }
      }}).
      otherwise({redirectTo: '/facebacks'});
  }])
  // Allow unsafe links like file://
  // See http://stackoverflow.com/questions/15637133/unsafe-link-in-angular
  .config(['$compileProvider', function($compileProvider) {
    $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file):/);
  }]);

app.constant('MONGOLAB_CONFIG',{API_KEY:'8cRXIvIo3n5CmuL4ErRO0Ihlxrgo3Z1d', DB_NAME:'trovit-talks'});

app.factory('Faceback', function ($mongolabResourceHttp) {
  return $mongolabResourceHttp('faceback');
});

app.controller('ListFacebacksCtrl', function($scope, Faceback, faceback) {
  $scope.bootstrap = function() {
    Faceback.all().then(function(facebacks) {
      $scope.facebacks = facebacks;
    });
  }

  $scope.faceback = faceback;
  $scope.save = function() {
    $scope.faceback.happyCount = 0;
    $scope.faceback.pseCount = 0;
    $scope.faceback.sadCount = 0;
    $scope.faceback.$save(function(newFaceback) {
      $scope.facebacks.push(newFaceback);
    });
  }

});

app.controller('FeedbackCtrl', function($scope, $routeParams, Faceback) {
  $scope.bootstrap = function() {
    $(".faceback .btn").css("height", $(window).height());
  }

  $scope.feedback = function (status) {
    Faceback.getById($routeParams.facebackId).then(function(f) {
      f[status + "Count"]++;
      f.$saveOrUpdate(function() {
        console.log("saved!")
      })

    });
  }
});