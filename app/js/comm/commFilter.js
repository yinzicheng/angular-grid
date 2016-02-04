(function () {
  angular.module('elo.comm.filter', [])
    .filter('toBlank', [function () {
      return function (input) {
        if ((angular.isArray(input) && input.length == 0) ||
          (angular.isNumber(input) && input == 0)) {
          return "";
        }
        return input;
      }
    }]);

})();