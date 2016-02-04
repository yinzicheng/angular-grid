(function () {
  angular.module("elo.comm.Utils", ['ngResource'])
    .value('eloConfig', {
      eloProxyUrl: 'http://localhost:8080/eloWebProxy/elo/eloService/as/'
    })
    .factory('eloUtils', ['$http', '$log', '$resource', 'eloConfig', '$filter',
      function ($http, $log, $resource, eloConfig, $filter) {

        function _getELOAs(params) {
          //connect as directly
          //asUrlBase: "http://192.168.25.154:9090/as-elo",
          var asUrlBase = "http://" + params.asHost + ":" + params.asPort + "/" + params.asServName;
          var asUrl = asUrlBase + "?cmd=get&name=" + params.funcName +
            "&param3=" + JSON.stringify(params.paramObj);
          return _resourceGet(asUrl);
        }

        function _getELOAsFromProxy(params) {
          //connect as via proxy
          var asUrl = eloConfig.eloProxyUrl + JSON.stringify(params);
          return _resourceGet(asUrl);
        }


        function _httpGet(asUrl) {
          $log.log('asUrl = ' + asUrl);
          var promise = $http.get(asUrl)
            .success(function (data, status) {
              $log.log("getELOas success: data:" + $filter('json')(data) + ', status:' + status);
              return data;
            })
            .error(function (data, status) {
              $log.log("getELOas failed error:" + data + ', status:' + status);
              return data;
            });
          return promise;
        }


        function _resourceGet(asUrl) {
          $log.log('asUrl = ' + asUrl);
          return $resource(asUrl);
        }

        return {
          getELOAsFromProxy: _getELOAsFromProxy,
          getELOAs: _getELOAs
        }
      }])

})();