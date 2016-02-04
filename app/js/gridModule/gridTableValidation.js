(function () {
  angular.module('elo.grid.tableValidation', [])
    .service('eloTablesValidation', function () {

      this.tablesValidMessages = {
        AuditTrail: {
          activityCode: {
            required: "{{name}} is required"
          },
          description: {
            required: "{{name}} is required",
            minlength: "{{name}} has at least % characters"
          },
          addedDateTime: {
            required: "{{name}} is required"
          }
        }
      }

    })


})();