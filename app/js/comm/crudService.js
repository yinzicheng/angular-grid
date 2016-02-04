(function () {
  angular.module('elo.comm.crud', ['ngResource'])
      .provider('crudService', [function () {

        this.restUrlBase = "";
        this.restUrlTable = "";
        this.restUrlId = "";

        this.$get = ['$resource', '$http', '$log', function ($resource, $http, $log) {

          // define resource Object
          var Entry;

          function init() {
            Entry = $resource(this.restUrlBase + "/" + this.restUrlTable + "/:" + this.restUrlId, {id: '@id'}, {
              update: {method: 'PUT'}  //added a update method
            });
          }


          function _setHandlers(responseHandler, errorHandler) {
            responseHandler = responseHandler || function () {
                };
            responseHandler = errorHandler || function () {
                };
          }

          //var paginationOptions = {pageNumber: 1, pageSize: 25, orderby: 'id', direction: 'asc'};
          function _getAll(paginationOptions, responseHandler, errorHandler) {
            _setHandlers(responseHandler, errorHandler);
            Entry.query(paginationOptions, responseHandler, responseHandler);
          }

          function _getById(id, responseHandler, errorHandler) {
            _setHandlers(responseHandler, errorHandler);
            Entry.get({id: id}, responseHandler, responseHandler);
          }

          function _update(id, newObj, responseHandler, errorHandler) {
            _setHandlers(responseHandler, errorHandler);

            var obj = Entry.get({id: id}, function () {
              $log.info("obj=" + JSON.stringify(obj));
              //update object fields
              if (angular.isObject(newObj)) {
                for (var key in newObj) {
                  if (obj.hasOwnProperty(key) && newObj.hasOwnProperty(key) && newObj[key]) {
                    obj[key] = newObj[key];
                  }
                }
                obj.$update({id: id}, responseHandler, errorHandler);
              }
            }, errorHandler);

          }

          function _create(newObj, responseHandler, errorHandler) {
            _setHandlers(responseHandler, errorHandler);

            Entry.save(newObj, responseHandler, errorHandler);
          }

          function _deleteById(id, responseHandler, errorHandler) {
            _setHandlers(responseHandler, errorHandler);

            Entry.delete({id: id}, responseHandler, errorHandler)
          }

          //use $http service
          function _getDataByUrl(url, params, responseHandler, errorHandler) {
            $http.get(this.restUrlBase + url, params)
                .then(responseHandler, errorHandler);
          }

          return {
            restUrlBase: this.restUrlBase,
            restUrlId: this.restUrlId,
            restUrlTable: this.restUrlTable,
            init: init,

            getAll: _getAll,
            getById: _getById,
            update: _update,
            create: _create,
            deleteById: _deleteById,

            getDataByUrl: _getDataByUrl
          }

        }];

      }])

    // register the interceptor as a service
      .factory('myHttpInterceptor', function ($q, $log) {
        return {
          // optional method
          'request': function (config) {
            // do something on success
            $log.info("[myHttpInterceptor] request on success");
            return config;
          },

          // optional method
          'requestError': function (rejection) {
            // do something on error
//          if (canRecover(rejection)) {
//            return responseOrNewPromise
//          }
            $log.info("[myHttpInterceptor] request on error");
            return $q.reject(rejection);
          },


          // optional method
          'response': function (response) {
            // do something on success
            $log.info("[myHttpInterceptor] response on success");
            return response;
          },

          // optional method
          'responseError': function (rejection) {
            // do something on error
//          if (canRecover(rejection)) {
//            return responseOrNewPromise
//          }
            $log.info("[myHttpInterceptor] response on error");
            return $q.reject(rejection);
          }
        };
      });

})();