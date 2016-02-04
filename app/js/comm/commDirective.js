(function () {
  angular.module("elo.comm.directive", [])

      .directive("eloFooter", function () {
        return {
          restrict: 'ACE',
          replace: true,
          templateUrl: 'tpls/comm/eloFooterDirective.html',
          scope: {
            companyName: "@",
            footerClass: "@",
            url: "@"
          }
        }
      })

      .directive('showConfirm', function ($log, confirmDialog) {
        return {
          restrict: 'AE',
          replace: true,
          scope: {
            okcallback: '&'
          },
          link: function (scope, element, attrs) {
            element.bind('click', function () {
              var options = scope.$eval(attrs.showConfirm);
              confirmDialog.open(options, scope.okcallback);
            });
          }
        }
      })

      .directive('alertDirective', function () {
        return {
          restrict: "AE",
          replace: true,
          templateUrl: "tpls/comm/alertTemplate.html"
        }
      })

      .directive('mySpinner', function () {
        return {
          restrict: "E",
          replace: true,
          scope: true,
          templateUrl: "tpls/comm/mySpinner.html",
          link: function (scope, element, attrs) {

            scope.$on('us-spinner:spin', function (event, key) {
              if (key === scope.key) {
                scope.showMask = true;
              }
            });

            scope.$on('us-spinner:stop', function (event, key) {
              if (key === scope.key) {
                scope.showMask = false;
              }
            });
          }
        }
      })

  ;

})();