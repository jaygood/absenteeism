'use strict';
angular.module('absenteeismApp')
  .controller('MainCtrl', ['$scope', '$http', 'Schedule', 'User', function ($scope, $http, Schedule, User){
    $scope.user = User;
    Schedule.getEvents();
    $scope.events = Schedule.data;

    // controls modal event input box
    $scope.modalShown = false;
    var toggleModal = function() {
      $scope.modalShown = !$scope.modalShown;
    };

    // click event on input form
    $scope.processEvent = function(event, user) {
      Schedule.processEvent(event, user)
      toggleModal();
    };

    // remove event on input form
    $scope.remove = function(event) {
      if(event.id){ Schedule.remove(event.id); }
      toggleModal();
    };

    // Calendar configuration
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'title',
          center: 'month agendaWeek',
          right: 'today prev,next'
        },
        weekends: false,
        dayClick: function(date, allDay, jsEvent, view) {
          $scope.event = {
            month:  date.getMonth() + 1,
            day:    date.getDate(),
            year:   date.getFullYear(),
            status: 'Present',
            ampm:   'am'
          }
          toggleModal();
        },
        eventClick:  function( event, allDay, jsEvent, view ){
          $scope.event = event;
          toggleModal();
        },
        eventDrop:   function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
          Schedule.updateOnDrop(event);
          var overlap = Schedule.checkOverlap(event)
          if(overlap.length){ alert('Overlap with ' + overlap[0].title)}
        }
      }
    };
  }])
