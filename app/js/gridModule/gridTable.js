(function () {
  angular.module('elo.grid.table', [])

    .constant('tableConfig', {
      colModelType: {
        text: "Text",
        option: "Option",
        date: "Date"
      }
    })
    .service('eloTables', function (tableConfig) {
      var modelType = tableConfig.colModelType;

      this.tables = [
        {
          tableName: "RMFiles",
          title: "RM Files",
          //active: true,
          columns: [
            {
              name: 'ObjId',
              field: 'objId',
              width: 65,
              enableColumnResizing: false
            }, {
              name: 'Short Name',
              field: 'shortName'
            }, {
              name: 'File Num',
              field: 'FILENUM'
            }, {
              name: 'File Part Num',
              field: 'FILEPARTNUM'
            }, {
              name: 'BCS Level 1',
              field: 'BCSLEVEL1'
            }, {
              name: 'BCS Level 2',
              field: 'BCSLEVEL2'
            }, {
              name: 'BCS Level 3',
              field: 'BCSLEVEL3'
            }, {
              name: 'BCS Level 4',
              field: 'BCSLEVEL4'
            }, {
              name: 'BCS Level 5',
              field: 'BCSLEVEL5'
            }, {
              name: 'BCS Level 6',
              field: 'BCSLEVEL6'
            }, {
              name: 'File Title',
              field: 'FILETITLE'
            }, {
              name: 'Home Location',
              field: 'FILEHOMELOC'
            }, {
              name: 'Current Location',
              field: 'FILECURRLOC'
            }, {
              name: 'Closed Date',
              field: 'FILECLOSEDATE'
            }, {
              name: 'Disposal Date',
              field: 'FILEDISPOSALDATE'
            }, {
              name: 'Disposal Status',
              field: 'FILEDISPSTATUS'
            }, {
              name: 'Disposal Actioned Date',
              field: 'FILEDISPACTIONDATE'
            }, {
              name: 'Disposal Code',
              field: 'FILEDACODE'
            }, {
              name: 'Disposal Trigger Type',
              field: 'FILEDTTYPE'
            }, {
              name: 'Disposal Action',
              field: 'FILEDISACTION'
            }, {
              name: 'Disposal Classification',
              field: 'FILEDISCLASS'
            }, {
              name: 'Retention Review Date',
              field: 'FILERETENTIONREVDATE'
            }
          ]
        }
      ];

      this.setDefaultColumnProp = function (propName, propValue) {
        this.tables.forEach(function (table) {
          if (table.columns && table.columns.length > 0) {
            table.columns.forEach(function (column) {
              if (!column[propName]) {
                column[propName] = propValue;
              }
            });
          }
        });
      };

      this.setDefaultColumnProp('width', '100');

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