(function () {

  angular.module("disposalReports", ['ui.grid', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.pagination', 'angularSpinner',
    'ngAnimate', 'ui.bootstrap', 'ui.router',
    'appConfig', 'elo.comm.directive', 'elo.comm.crud', 'elo.comm.uiService',
    'elo.grid.directive', 'elo.grid.tableService', 'elo.grid.tableValidation', 'elo.grid.table', 'elo.grid.dbService', 'elo.grid.controller'
  ])

    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('tableDetail', {
          url: "/:tableName",
          templateUrl: "partials/gridTable.html",
          controller: function ($stateParams, $log, gridTableService) {
            if ($stateParams.tableName) {
              gridTableService.setActiveTable($stateParams.tableName);
            } else if (gridTableService.tables.length > 0 && gridTableService.tables[0].tableName) {
              gridTableService.setActiveTable(gridTableService.tables[0].tableName);
            }
          }
        });
      // For any unmatched url, redirect to /
      $urlRouterProvider.otherwise("/");
    })

    .run(['$templateCache', function ($templateCache) {
      $templateCache.put('ui-grid/selectionRowHeaderButtons',
        "<div class=\"glyphicon glyphicon-edit\" ng-class=\"{'ui-grid-row-selected': row.isSelected}\" ng-click=\"selectButtonClick(row, $event)\"></div>"
      );
    }]);

})();