(function () {

  angular.module('elo.grid.tableService', [])

      .service('gridColumnService', function (crudService, $log, $filter) {

        var _getRMCode = function (obj, field, column, successFn) {
          var params = {params: {obj: obj, field: field}};
          crudService.getDataByUrl("/rmcode", params, successFn, function (error) {
            $log(error.statusText + ": " + error.data);
          });
        };

        var _getAuditTrailActivityCodes = function (column) {

          _getRMCode("AuditTrail", "activityCode", column, function (response) {
            angular.forEach(response.data, function (activityCode) {
              //var option = {};
              //option.name = item.code;
              //option.value = item.id;
              //todo
              column.model.options.push(activityCode);
            });
          });
        };


        this.initColumnsModel = function (columns) {
          angular.forEach(columns, function (column) {

            if (column.field == "activityCode" && column.model.options) {
              _getAuditTrailActivityCodes(column);
            }

          });
        };


        this.resetColumnsModel = function (columns) {
          columns.forEach(function (column) {
            if (column.model && ['Text', 'Date'].indexOf(column.model.type) != -1) {
              column.model.value = "";
            } else if (column.model && column.model.type == 'Option') {
              column.model.options = [];
              //column.model.selectedOption = {name: '', value: ''};
              column.model.selectedOption = {};
            }
          });
        };

        this.getColumnModelValue = function (column) {
          var value;
          if (column.model.type == 'Text') {
            value = column.model.value;

          } else if (column.model.type == 'Option') {
            value = column.model.selectedOption;
            //value = this.optionToObj(column);

          } else if (column.model.type == 'Date') {
            var date = $filter('date')(column.model.value, "yyyy-MM-dd'T'HH:mm:ss.sss");
            value = date;
          }
          return value;
        };

      })


      .service('gridTableService', function (gridColumnService, eloTables, $log, gridDbService, customCell) {
        var _this = this;

        var tables = this.tables = eloTables.tables;

        this.getTableByName = function (tableName) {
          var _table;
          tables.forEach(function (table) {
            if (table.tableName.toLowerCase() == tableName.toLowerCase()) {
              _table = table;
            }
          });
          return _table;
        };

        this.getColumns = function (tableName) {
          var table = this.getTableByName(tableName);
          var columns = table.columns;

          //set common attribute for columns
          columns.forEach(function (column) {
            column.enableHiding = false;
          });
          return columns;
        };

        var _getFilterColumns = function (columns) {
          var filterCols = [];
          columns.forEach(function (column) {
            if (column.filter && column.model.type) {
              filterCols.push(column);
            }
          });
          return filterCols;
        };

        this.getModalColumns = function (columns) {
          var modalCols = [];
          columns.forEach(function (column) {
            if (column.modal && column.model.type) {
              modalCols.push(column);
            }
          });
          return modalCols;
        };

        this.setActiveTable = function (tableName) {
          tables.forEach(function (table) {
            if (table.tableName.toLowerCase() == tableName.toLowerCase()) {
              table.active = true;
            } else {
              table.active = false;
            }
          });
        };

        this.getActiveTableName = function () {
          for (var i = 0; i < tables.length; i++) {
            if (tables[i].active == true) {
              return tables[i].name;
            }
          }
        };

        var _paginationOptions = {
          page: 1,
          size: 25,
          sort: '',
          direction: '',
          filterColumns: []
        };

        this.initGridTable = function (tableName, scope) {
          var thisTable = scope.table = this.getTableByName(tableName);
          this.setGridOptions(thisTable.tableName, scope);
          gridDbService.getAllPages(scope.paginationOptions, scope.gridOptions);
        };


        var _gridOptions = null;
        this.getGridOptions = function () {
          return _gridOptions;
        };

        this.setGridOptions = function (tableName, scope) {

          gridDbService.setTable(tableName);
          var paginationOptions = scope.paginationOptions = angular.copy(_paginationOptions);

          scope.columns = this.getColumns(tableName);
          scope.filterColumns = _getFilterColumns(scope.columns);
          gridColumnService.resetColumnsModel(scope.filterColumns);
          //init data for filters (options, etc)
          gridColumnService.initColumnsModel(scope.filterColumns);

          scope.paginationOptions.filterColumns = scope.filterColumns;

          var gridOptions = {
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            useExternalPagination: true,
            useExternalSorting: true,

            columnDefs: scope.columns,
            enableSorting: true,
            suppressRemoveSort: true,

            enableRowSelection: true,
            enableSelectAll: false,
            multiSelect: false,

            onRegisterApi: function (gridApi) {
              scope.gridApi = gridApi;

              gridApi.selection.on.rowSelectionChanged(scope, function (row) {
                var msg = 'row selected ' + row.isSelected + ", entity = " + angular.toJson(row.entity);
                $log.info(msg);
                //todo - open form dialog here
                var modalColumns = _this.getModalColumns(scope.columns);
                gridDbService.openFormModal(row.entity, scope.table, modalColumns);
              });

              gridApi.core.on.sortChanged(scope, function (grid, sortColumns) {
                if (sortColumns.length == 0) {
                  paginationOptions.sort = '';
                  paginationOptions.direction = '';
                } else {
                  paginationOptions.sort = sortColumns[0].colDef.field;
                  paginationOptions.direction = sortColumns[0].sort.direction;
                }
                scope.getPageByFilter(paginationOptions, gridOptions);
              });

              gridApi.pagination.on.paginationChanged(scope, function (newPage, pageSize) {
                paginationOptions.page = newPage;
                paginationOptions.size = pageSize;
                scope.getPageByFilter(paginationOptions, gridOptions);
              });
            }

          };
          customCell.setCustomCells(scope);
          _gridOptions = scope.gridOptions = gridOptions;

        };

      })

})();
