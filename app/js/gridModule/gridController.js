(function () {

  angular.module('elo.grid.controller', [])

      .controller('appController', function ($scope, $log, gridTableService, alertService) {

        $scope.alerts = alertService.get();

        var tables = $scope.tables = gridTableService.tables;

        $scope.changeTable = function (tableName) {
          var activeTableName = gridTableService.getActiveTableName();
          if (activeTableName != tableName) {
            activeTableName = tableName;
            gridTableService.setActiveTable(activeTableName);
          }
        };

      })

      .controller('gridController', function ($scope, gridTableService, gridDbService, $stateParams, $state) {


        $scope.getPageByFilter = function () {
          gridDbService.getPageByFilter($scope.paginationOptions, $scope.gridOptions);
        };

        $scope.reset = function () {
          $state.reload(); //reload current (ui-view's) controller
        };

        $scope.addItem = function () {
          var modalColumns = gridTableService.getModalColumns($scope.columns);
          gridDbService.openFormModal(null, $scope.table, modalColumns);
        };

        var tableName = $stateParams.tableName || gridTableService.tables[0].tableName;
        gridTableService.initGridTable(tableName, $scope);

      });

})();


