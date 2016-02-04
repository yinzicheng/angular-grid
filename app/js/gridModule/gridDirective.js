(function () {

  angular.module('elo.grid.directive', [])
    .directive('gridFilter', function () {

      return {
        restrict: "AE",
        replace: true,
        templateUrl: 'tpls/eloGridFilterDirective.html',
        scope: {
          filterColumns: "=",
          table: "=",
          filterFn: "&",
          resetFn: "&",
          addFn: "&"
        }
      }
    })

    .directive("datePicker", function ($filter, $compile) {

      return {
        restrict: "AE",
        replace: true,
        templateUrl: "tpls/eloDatePickerDirective.html",
        scope: {
          date: "=",
          readonlyField: "&",
          name: "@" //input attr name
        },
        link: function (scope, element, attrs) {
          //scope.date = $filter('date')(scope.date, "yyyy-MM-dd'T'HH:mm:ss.sssZ");
          var formEle = element.parents('div.form-group');
          var inputEle = formEle.find('input');

          var ngValids = ['ng-required', 'ng-minlength'];
          angular.forEach(ngValids, function (ngValid) {
            var attrValue = element.attr(ngValid);
            if (attrValue) {
              inputEle.attr(ngValid, attrValue);
              $compile(inputEle)(scope);
            }
          });

          scope.status = {
            opened: false
          };

          scope.minDate = new Date(1970, 1, 1);
          scope.maxDate = new Date(2020, 5, 22);

          scope.open = function ($event) {
            scope.status.opened = true;
          };

          scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
          };

        }

      }

    })


    .directive('showErrors', function ($compile, $log, eloTablesValidation) {
      return {
        restrict: 'AE',
        require: '^form',
        link: function (scope, element, attrs, formCtrl) {
          var options = scope.$eval(attrs.showErrors);
          var showSuccess = options.showSuccess;

          var formEle = element.parents('div.form-group');
          var inputEle = formEle.find('input');
          var inputName = scope.column.field;

          var addErrorMessages = function () {
            //$log.info("attrs=" + angular.toJson(attrs));
            var errMsgObj = eloTablesValidation.tablesValidMessages[scope.table.tableName][scope.column.field];
            if (!errMsgObj) {
              $log.debug('No error message defined for field: ' + inputName);
              return;
            }
            for (var key in errMsgObj) {
              errMsgObj[key] = errMsgObj[key].replace("{{name}}", "'" + scope.column.name + "'");
            }
            var errorEles = [];
            if (angular.isDefined(attrs.ngRequired) && errMsgObj.required) {
              errorEles.push(angular.element("<span class='help-block' ng-show='modalForm[column.field].$error.required'>" + errMsgObj.required + "</span>"));
            }
            if (attrs.ngMinlength && errMsgObj.minlength) {
              var errMsg = errMsgObj.minlength.replace("%", attrs.ngMinlength);
              errorEles.push(angular.element("<span class='help-block' ng-show='modalForm[column.field].$error.minlength'>" + errMsg + "</span>"));
            }
            //todo :add other validation type

            angular.forEach(errorEles, function (errorEle) {
              $compile(errorEle)(scope);
            });
            element.parent().append(errorEles);
          };
          addErrorMessages();

          // only apply the has-error class after the user leaves the text box
          var blurred = false;

          function onInputBlur() {
            blurred = true;
            formEle.toggleClass('has-error', formCtrl[inputName].$invalid);

            if (showSuccess) {
              return formEle.toggleClass('has-success', formCtrl[inputName].$valid);
            }
          }

          element.bind('blur', onInputBlur);
          inputEle.bind('blur', onInputBlur);

          scope.$watch(function () {
            return formCtrl[inputName].$valid;
          }, function (valid) {
            // we only want to toggle the has-error class after the blur event, or if the control becomes valid
            if (valid) {
              formEle.removeClass('has-error');
            }
          });
          //receive custom event when use click 'save' button
          scope.$on('show-errors-check-validity', function () {
            formEle.toggleClass('has-error', formCtrl[inputName].$invalid);
          });

        }
      }
    });


})();

