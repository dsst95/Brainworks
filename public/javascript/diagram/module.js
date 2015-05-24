/**
 * New node file
 */
angular.module('brainworks.diagram', ['ui.bootstrap'])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('profile.diagrams', {
      url: '/diagrams',
      templateUrl: '/diagram/diagrams',
      controller: 'diagramCtrl',
      resolve: {
        diagrams: ['localStorageService', 'diagramsFactory', function(localStorageService, diagramsFactory) {
          return diagramsFactory.get(localStorageService.get('userId'));
        }]
      }
    })
    .state('diagram', {
      url: '/diagram/{id}',
      templateUrl: '/diagram/designer',
      controller: 'designerCtrl'
    })
    .state('diagramInformation', {
      url: '/diagramInformation/{id}',
      templateUrl: '/diagram/diagramInformation',
      controller: 'diagramInformationCtrl',
      resolve: {
        diagram: ['$stateParams', 'diagramInformationFactory', function($stateParams, diagramInformationFactory) {
          return diagramInformationFactory.get($stateParams.id);
        }]
      }
    })
    .state('addDiagram', {
      url: '/addDiagram',
      templateUrl: '/diagram/diagramInformation',
      controller: 'diagramInformationCtrl',
      resolve: {
        diagram: function() {
          return {
            diagram: {}
          };
        }
      }
    });
}])
.factory('diagramsFactory', ['$http', function($http) {
  return {
    get: function(userId) {
      return $http.get('/diagram/' + userId + '/diagrams').then(function(res) {
        return res.data;
      });
    },
    getPublicDiagrams: function(userId) {
      return $http.get('/diagram/publicDiagrams').then(function(res) {
        return res.data;
      });
    }
  };
}])
.controller('diagramCtrl', ['$scope', 'diagrams', function($scope, diagrams) {
  $scope.diagrams = diagrams;
  $scope.currentPage = 1;
  $scope.numPerPage = 5;
  $scope.maxSize = 5;
}])
.filter('startFrom', function() {
  return function(input, start) {
    start = +start;
    return input.slice(start);
  };
});