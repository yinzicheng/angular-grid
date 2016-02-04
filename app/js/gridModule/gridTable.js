(function () {
  angular.module('elo.grid.table', [])
    .service('eloTables', function (appConfig) {
      var modelType = appConfig.colModelType;

      this.tables = [
        {
          tableName: "AuditTrail",
          title: "AuditTrail",
          //active: true,
          columns: [
            {
              name: 'ID',
              field: 'id',
              width: 60,
              enableColumnResizing: false
            }, {
              name: 'Activity Code',
              field: 'activityCode',
              cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.activityCode(grid, row)}}</div>',
              model: {
                type: modelType.option,
                options: [],
                selectedOption: {},
                dbColMap: {label: 'value', value: 'id'} //map for option in FormModal, db column on the right
              },
              filter: true, // if in the filter form (search)
              modal: {       // if in the modal form (update/new)
                edit: {display: true, readonly: false},
                add: {display: true, readonly: false}
              }

            }, {
              name: 'Description',
              field: 'description',
              model: {type: modelType.text},
              filter: true,
              modal: {
                edit: {display: true, readonly: false},
                add: {display: true, readonly: false}
              }
            }, {
              name: 'Old Value',
              field: 'oldValue',
              model: {type: modelType.text},
              filter: true,
              modal: {
                edit: {display: true, readonly: false},
                add: {display: true, readonly: false}
              }
            }, {
              name: 'New Value',
              field: 'newValue',
              model: {type: modelType.text},
              filter: true,
              modal: {
                edit: {display: true, readonly: false},
                add: {display: true, readonly: false}
              }
            }, {
              name: 'Added DateTime',
              field: 'addedDateTime',
              cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.addedDateTime(grid, row)}}</div>',
              model: {
                type: modelType.date,
                value: ''//new Date() // default value
              },
              filter: true,
              modal: {
                edit: {display: false, readonly: true},
                add: {display: true, readonly: false}
              }
            }
          ]
        },
        {
          tableName: "BCS",
          title: "RM BCS",
          //active: false,
          columns: [
            {
              name: 'ID',
              field: 'id',
              width: 60,
              enableColumnResizing: false
            }, {
              name: 'BCS Level1',
              field: 'bcsLevel1',
              width: 200,
              model: {type: modelType.text},
              filter: true,
              modal: {
                edit: {display: true, readonly: false},
                add: {display: true, readonly: false}
              }
            }, {
              name: 'BCS Level2',
              field: 'bcsLevel2',
              width: 200,
              model: {type: modelType.text},
              filter: true,
              modal: {
                edit: {display: true, readonly: false},
                add: {display: true, readonly: false}
              }
            }

          ]
        }
      ];

    })

    .service('customCell', function ($filter) {

      this.setCustomCells = function (scope) {

        scope.activityCode = function (grid, row) {
          return row.entity.activityCode ? row.entity.activityCode.value : "";
        };

        scope.addedDateTime = function (grid, row) {
          return $filter('date')(row.entity.addedDateTime, "yyyy-MM-dd");
        };

      }

    })

})();