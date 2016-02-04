(function () {

  angular.module('elo.comm.uiService', [])
      .factory('alertService', [function () {

        var alerts = [];

        var add = function (type, msg) {
          return alerts.push({
            type: type,
            msg: msg,
            close: function () {
              return closeAlert(this);
            }
          });
        };

        var closeAlert = function (alert) {
          return closeAlertIdx(alerts.indexOf(alert));
        };

        var closeAlertIdx = function (index) {
          return alerts.splice(index, 1);
        };

        var clear = function () {
          alerts = [];
        };

        var get = function () {
          return alerts;
        };

        return {
          add: add,
          closeAlert: closeAlert,
          closeAlertIdx: closeAlertIdx,
          clear: clear,
          get: get
        }
      }])

      .factory('confirmDialog', ['$log', '$uibModal', function ($log, $uibModal) {

        var open = function (options, okCallBackFn, cancelCallBackFn) {

          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'tpls/comm/confirmDialog.html',
            controller: function ($scope, $modalInstance) { //isolated $scope for formModal
              $scope.title = options.title;
              $scope.message = options.message;

              $scope.ok = function () {
                $modalInstance.close(true);
              };

              $scope.cancel = function () {
                $modalInstance.dismiss(false);
              };

            },
            // 'static' - modal window is not closed when clicking outside of the modal window;
            //  default 'true' - close window
            backdrop: 'static',
            size: 'sm'  //'lg'/'sm'/'md'
          });

          modalInstance.result.then(function (result) {// when click OK button
            $log.info('Confirm Dialog close result: ' + result);
            if (okCallBackFn) {
              okCallBackFn.apply();
            }
          }, function (reason) { // when click Cancel button
            $log.info('Confirm Dialog dismissed reason: ' + reason);
            if (cancelCallBackFn) {
              cancelCallBackFn.apply();
            }
          });
        };

        return {
          open: open
        }

      }])

      .factory('spinnerService', ['usSpinnerService', '$timeout', function (usSpinnerService, $timeout) {

        function start() {
          usSpinnerService.spin("spinner-1");
        }

        function stop() {
          $timeout(function () {
            usSpinnerService.stop("spinner-1");
          }, 300)
        }

        return {
          start: start,
          stop: stop
        }

      }])

  ;

})();