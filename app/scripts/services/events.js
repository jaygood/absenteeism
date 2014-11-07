'use strict';
angular.module('absenteeismApp')
  .factory('Schedule', ['External', function(External){
    var date  = new Date(),
        // variable to add id to new events
        newId = -1;

    return  {
      d: date.getDate(),
      m: date.getMonth(),
      y: date.getFullYear(),
      data: [{
        //color: '#0066CC',
        //textColor: 'white',
        events:[]
      }],

      updateOnDrop: function(event){
        var date = event.start;
        event.month = date.getMonth() + 1;
        event.day   = date.getDate();
        event.year  = date.getFullYear();
        console.log('EXAMPLE SERVER UPDATE REQUEST ', event);
      },

      checkOverlap: function(event){
        if(event.status !== 'Present'){
          return this.data[0].events.filter(function(ev){
            if(ev.start){
              return ev.status !== 'Present' &&
                  +ev.day === +event.day &&
                  +ev.month === +event.month &&
                  +ev.year === +event.year &&
                  ev.ampm === event.ampm &&
                  +ev.id !== +event.id;
            }else{
              return false;
            }
          });
        } else{
          return [];
        }
      },

      // will update or add events
      processEvent: function(event, user){
        event.title = user.name + ' ' + event.status;
        if(event.ampm === 'am'){
          event.hourStart = 8;
          event.hourEnd = 12;
        }else{
          event.hourStart = 13;
          event.hourEnd = 17;
        }
        event.start = new Date(event.year, event.month - 1, event.day, event.hourStart, 0);
        event.end = new Date(event.year, event.month - 1, event.day, event.hourEnd, 0)
        event.allDay = false;
        if(event.id){
          this.data[0].events[event.id] = event;
        }else{
          event.id = newId--;
          var overlap = this.checkOverlap(event)
          if(overlap.length){ alert('Overlap with ' + overlap[0].title)}
          this.data[0].events.push(event)
        }
        console.log('EXAMPLE SERVER UPDATE REQUEST ', event);
      },
      remove: function(id){
        var removedEvent;
        this.data[0].events.forEach(function(event, index, array){
          if(event.id === id){ removedEvent = array.splice(index, 1); }
        });
        console.log('EXAMPLE SERVER UPDATE REQUEST ', removedEvent);
      },
      getEvents: function(){
        var that = this;
        External.then(function(data){
          data.forEach(function(obj){
            that.data[0].events.push(obj);
          })
        })
        console.log('EXAMPLE SERVER UPDATE REQUEST: All events');
      }
    }
  }]);
