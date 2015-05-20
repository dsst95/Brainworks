/**
 * New node file
 */
angular.module('brainworks.user')
.factory('userSettingsFactory', ['$http', function($http){
  return {
    loadUserData: function(userId) {
      return $http.get('/user/'+userId);
    },
    updateUser: function(userId, user) {
      return $http.put('/user/'+user, user);
    },
    changePassword: function(userId, newPassword) {
      return $http.post('/user/changePassword/'+userId, {password: newPassword});
    },
    deleteAccount: function(userId) {
      return $http.delete('/user/'+userId);
    }
  };
}])
.controller('settingsCtrl', ['$scope', '$rootScope', '$state', 'userSettingsFactory', 'localStorageService', function($scope, $rootScope, $state, userSettingsFactory, localStorageService) {
  $scope.user = {};
  $scope.currentPw = '';
  $scope.newPw = '';
  $scope.newPwConfirmation = '';
  userSettingsFactory.loadUserData(localStorageService.get('userId')).success(function(response) {
    $scope.user = response;
  });
  $scope.createHash = function(value) {
    var val = angular.copy(value);
    var hash = '';
    if(angular.isDefined(val)) {
      var shaObj = new jsSHA(val, "TEXT");
      hash = shaObj.getHash("SHA-512", "HEX");
    }
    return hash;
  };
  $scope.updateUser = function(user) {
    userSettingsFactory.updateUser(user._id, user);
  };
  $scope.changePassword = function(userId, newPw) {
    userSettingsFactory.changePassword(userId, newPw);
  };
  $scope.deleteAccount = function(userId) {
    userSettingsFactory.deleteAccount(userId).success(function(response) {
      if(response.success) {
        $rootScope.isAuthentificated = false;
        localStorageService.remove('token');
        localStorageService.remove('userId');
        $state.go('signIn');
      }
    });
  };
}]);