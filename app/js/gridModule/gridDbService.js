(function () {

  angular.module('elo.grid.dbService', [])
    .config(function (crudServiceProvider, appConfig) {
      crudServiceProvider.restUrlBase = appConfig.restUrlBase;
      //crudServiceProvider.restUrlId = appConfig.id;
    })

    .service('gridDbService', function (crudService, $log, gridColumnService, tableConfig, $uibModal, $filter, alertService, spinnerService) {
      var modelType = tableConfig.colModelType;

      //store search records from db
      var _dbData = null;

      var gridDbService = this;
      /**
       * @param action  edit/add/delete
       */
      this.openFormModal = function (record, table, modalColumns) {

        var action = record ? "edit" : "add";
        angular.forEach(modalColumns, function (modalColumn) {
          modalColumn.modal['delete'] = modalColumn.modal['delete'] || modalColumn.modal['edit'];
        });

        gridDbService.modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'tpls/formModal.html',
          controller: function ($scope, $modalInstance) { //isolated $scope for formModal

            $scope.modalColumns = modalColumns;
            $scope.table = table;
            $scope.title = action.toUpperCase() + " " + table.tableName;

            //create a new record object for editing/add form
            record = record || {};
            var editedRecord = $scope.record = angular.copy(record);

            $scope.save = function () {
              //check form validation first
              $scope.$broadcast('show-errors-check-validity');
              if ($scope.modalForm.$invalid) {
                return;
              }
              //-Todo server side validation

              $modalInstance.close(editedRecord);
            };

            $scope.delete = function () {
              action = 'delete';
              //$log.info("will delete record=" + angular.toJson(editedRecord));
              $modalInstance.close(editedRecord);
            };

            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };

            $scope.isReadOnlyField = function (column) {
              return column.modal[action].readonly;
            };
            $scope.isDisplayableField = function (column) {
              return column.modal[action].display;
            };

          },
          // 'static' - modal window is not closed when clicking outside of the modal window;
          //  default 'true' - close window
          backdrop: 'static',
          size: 'md',  //'lg'/'sm'/'md'
          resolve: { // get model value before controller init
            items: function () {
              return ['item1', 'item2', 'item3'];
            }
          }
        });

        gridDbService.modalInstance.result.then(function (editedRecord) {// when click OK button
          // Todo save record
          angular.copy(editedRecord, record);
          $log.info("editedRecord=" + angular.toJson(editedRecord));

          if (action === 'edit') {
            _update(record);
          } else if (action === 'add') {
            _add(record);
          } else if (action === 'delete') {
            _delete(record);
          }

        }, function () { // when click Cancel button
          //$log.info('Modal dismissed at: ' + new Date());
        });

        function _update(record) {
          crudService.update(record.id, record, function (response) {
            $log.info("Updated record: " + angular.toJson(response));
            alertService.add('success', 'Record was updated.');

          }, function (error) {
            $log.error("Error updating record: " + angular.toJson(error));
            alertService.add('danger', "Error updating record: " + angular.toJson(error));

          });
        }

        function _add(record) {
          _formatData(record, table);
          crudService.create(record, function (newRecord) {
            $log.info("Created record: " + angular.toJson(newRecord));
            alertService.add('success', 'Record was added.');
            //put new record into first position
            _dbData.unshift(newRecord);

          }, function (error) {
            $log.error("Error creating record: " + angular.toJson(error));
            alertService.add('danger', "Error adding record: " + angular.toJson(error));

          });
        }

        function _delete(record) {
          $log.info("Deleting record: " + angular.toJson(record));
          crudService.deleteById(record.id, function (response) {
            $log.info("Deleted record: " + angular.toJson(response));
            alertService.add('success', 'Record was deleted.');

            //remove record from data list
            var records = angular.copy(_dbData);
            angular.forEach(records, function (item, index) {
              if (item.id === record.id) {
                _dbData.splice(index, 1);
              }
            });

          }, function (error) {
            $log.error("Error deleting record: " + angular.toJson(error));
            alertService.add('danger', "Error deleting record: " + angular.toJson(error));

          });
        }


        function _formatData(record, table) {
          angular.forEach(table.columns, function (column) {
            if (column.model && column.model.type === modelType.date) { // format date
              record[column.field] = $filter('date')(record[column.field], "yyyy-MM-dd'T'HH:mm:ss.sss");
            }
          });
        }

      };


      this.setTable = function (tableName) {
        crudService.restUrlTable = tableName;
        crudService.init();
      };

      function _getAllRecords(options, gridOptions) {
        options = {
          params: {
            filetype: "General File",
            disposalStatus: "Destroyed"
          }
        };

        crudService.getDataByUrl('/findDisposalInfo', options, function (response) {
          var respObj = response.data;
          gridOptions.totalItems = respObj.totalCount;//get total count
          _dbData = gridOptions.data = respObj.data;// get data array
        }, function (error) {
          $log.error(error.status + ": " + error.data);
        })
      }


      this.getPageByFilter = function (paginationOptions, gridOptions) {
        spinnerService.start();
        var options = angular.copy(paginationOptions);
        if (options.sort && options.direction) {
          options.sort = options.sort + "," + options.direction;
        }
        delete options.direction;

        var filterColumns = options.filterColumns;
        delete options.filterColumns;

        filterColumns.forEach(function (filterColumn) {
          if (filterColumn.model.type == modelType.option) {
            var obj = gridColumnService.getColumnModelValue(filterColumn);
            for (var key in obj) {
              if (obj[key]) {
                options[filterColumn.field + "." + key] = obj[key];
              }
            }
          } else {
            options[filterColumn.field] = gridColumnService.getColumnModelValue(filterColumn);
          }
        });

        _getAllRecords(options, gridOptions);

        spinnerService.stop();
      };

      this.getAllPages = function (paginationOptions, gridOptions) {
        var options = angular.copy(paginationOptions);
        delete options.filterColumns;
        _getAllRecords(options, gridOptions);
      };

    });

})();