(function () {
  angular.module('appConfig', [])

    .constant('appConfig', {
      appName: "Disposal Report",
      appVer: "1.0",
      restUrlBase: 'http://localhost:8888',
      restUrlId: 'id'
    });

})();