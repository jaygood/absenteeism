
'use strict';
angular.module('absenteeismApp')
  .factory('External', ['$http', function($http){
    var url   = 'data/sampledata.csv';

    function csvParser(csv){
      var rows    = csv.split('\r\n'),
          headers = rows[0].split(','),
          result  = [],
          obj     = {},
          l       = rows.length,
          m       = headers.length,
          currentRow, i, j;

      for(i = 1; i < l; i++){
        obj = {};
        currentRow = rows[i].split(',');

        for(j = 0; j < m; j++){
          obj[headers[j]] = currentRow[j]
        }
        result.push(obj);
      }
      return result;
    }

    return $http.get(url).then(function(response){
      var data = csvParser(response.data),
          split;
      data.forEach(function(event){
        switch(event.value){
          case 'P':
            event.status = 'Present';
            break;
          case 'V':
            event.status = 'Vacation';
            break;
          case 'T':
            event.status = 'Training';
            break;
          case 'H':
            event.status = 'Public Holiday';
            break;
        }
        if(event.name){
          event.title = event.name + ' ' + event.status,
          event.allDay = false;
          if(event.unit === 'AM'){
            event.hourStart = 8;
            event.hourEnd = 12;
            event.ampm = 'am';
          }else {
            event.hourStart = 13;
            event.hourEnd = 17;
            event.ampm = 'pm';
          }
          split = event.date.split('/');
          event.year = split[2];
          event.month = split[1];
          event.day = split[0];
          event.start = new Date(event.year, event.month - 1, event.day, event.hourStart, 0);
          event.end = new Date(event.year, event.month - 1, event.day, event.hourEnd, 0)
        }
      });
      return data;
    });
  }]);
