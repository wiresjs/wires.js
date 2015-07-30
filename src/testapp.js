domain.service("controllers.Base", function() {
   return ['base.html', function() {

   }]
})


domain.service("$calendarDays", function() {
   return function() {
      var currentWeek = week = moment().week();
      var currentMonth = month = moment().month();
      var currentWeekDay = moment().weekday();
      var currentYear = year = moment().year();
      var monthLabel = moment().year(year).week(week).weekday(0).format('MMMM');
      function getFirstStringDay(year, week, day) {
         return moment().year(year).week(week).weekday(day).format('dd').charAt(0).toUpperCase()
      }
      function getDayOnly(year, week, day) {
         return moment().year(year).week(week).weekday(day).format('D');
      }
      var calendarDays = [];
      for (var i = 0; i < 8; i++) {
         var title = getFirstStringDay(year, week, i);
         var day = getDayOnly(year, week, i);
         calendarDays.push({
            title: title,
            day: day
         })
      }
      return calendarDays;
   }
})
domain.service("controllers.Calendar", function($calendarDays) {
   return ['calendar.html', function() {
      var self = this;
      var pxAmount = 20;

      var convertSlotToTime = function(slot) {
         var hour = (24 * slot) / 96;
         var minute = (hour - Math.floor(hour)) * 60;
         if (minute == 0) minute = '00';
         return Math.floor(hour) + ":" + minute
      };

      var WeekDay = function(title, day) {
         this.title = title;
         this.day = day;
         this.available = [];
         this.addAvailableTime = function(av) {
            //slotStart.position slotEnds.position
            this.available.push(av);
         }
      }
      var AvailableTime = function(sPosition, ePosition) {
         var self = this;
         this.start = sPosition;

         this.end = ePosition;

         this.height = (this.end - this.start) * pxAmount;
         this.top = this.start * pxAmount;

         // updating the time label ***********************
         this.setTime = function(s, e) {
            var startTime = convertSlotToTime(this.start - (e ? e : 0) );
            var endTime = convertSlotToTime(this.end + (s ? s : 0));
            this.time = startTime + " - " + endTime;
         }
         this.setTime();
         var slotShifted = 0;
         var topShifted = 0;

         // Happens on drag *******************************
         var shiftHeight = function(a){
            self.height = (self.end - self.start + a) * pxAmount;
         }
         this.addHeight = function(amount) {
            slotShifted = amount;
            this.setTime(amount);
            shiftHeight(amount)
         }
         this.changeTop = function(amount){
            shiftHeight(amount);
            this.top = ( this.start - amount)* pxAmount
               topShifted = amount;
            this.setTime(0, amount);
         }

         // Commiting available time change ***************
         this.commit = function() {
            if (slotShifted) {
               this.end = this.end + slotShifted;
               this.height = (this.end - this.start) * pxAmount
               slotShifted = 0;
            }
            if ( topShifted){
               this.start = (this.start - topShifted)
               this.setTime();
               topShifted = 0;
            }
         }
      }

      var Slot = function(position) {
         this.position = position;
         this.type = "slot"
      }

      //Dragging
      var targetAvailableTime;
      var direction;
      self.onDrag = function(event) {

         if (event.type === "start") {
            if (event.target.av) {
               direction = $(event.element).hasClass("week-calendar-edit-booking-end") ? 0 : 1;
               targetAvailableTime = event.target.av
            }
         }
         if (event.type === "move") {
            if (targetAvailableTime) {
               if ( direction === 0 ){
                  // moving down
                  var position = Math.floor(event.coords.y / pxAmount)
                  targetAvailableTime.addHeight((position * -1) - 1)
               } else {
                  var position = Math.floor(event.coords.y / pxAmount)
                  targetAvailableTime.changeTop(position)
               }
            }
         }
         if (event.type === "stop") {
            if (targetAvailableTime) {

               targetAvailableTime.commit();
            }
            targetAvailableTime = undefined;
         }
      }

      self.weekdays = [];
      _.each($calendarDays(), function(item){
         self.weekdays.push(new WeekDay(item.title, item.day))
      })


      // Adding available time
      var tuesday = self.weekdays[1]
      tuesday.addAvailableTime(new AvailableTime(8, 12))



      self.slots = [];
      var totalSlots = 4 * 24;
      for (var i = 0; i < totalSlots; i++) {
         self.slots.push(new Slot(i))
      }

      // Hours (just for a display)
      self.hours = []
      for (var i = 1; i < 25; i++) {
         self.hours.push({
            hour: i
         })
      }



      self.lang = "fi"
      self.setLanguage = function() {
         moment.locale(self.lang, {
            week: {
               dow: 1,
               doy: 4
            }
         });
      }
      self.setLanguage();



   }]
})



domain.service("controllers.Test", function() {
   return ['test.html', function() {

   }]
})
$(function() {
   domain.require(function($router) {


      $router.add('/:ctrl?/:action?/:id?', 'Base', [
         $router.state('/calendar', 'Calendar'),
         $router.state('/test', 'Test')
      ])


      $router.start();
   })
})
