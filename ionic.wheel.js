angular.module('ionic.wheel', [])
  .directive('ionWheel', function($ionicGesture) {

    return {
      restrict: 'E',
      template: '<div id="ionic-wheel" ng-transclude></div>',
      transclude: true,
      link: function($scope, $element, $attr) {

        /**
         * Get elements
         */
        var circle = $element[0],
            circles = document.getElementsByClassName('circle'),
            circleDimensions = circle.getBoundingClientRect(),
            transcludeDiv = document.getElementById('ionic-wheel'),
            centerCircle = document.getElementById('activate');

        /**
         * Position circles around parent circle
         */

        var theta = [];

        var n = circles.length;

        var r = (window.getComputedStyle(transcludeDiv).height.slice(0, -2) / 2) - (window.getComputedStyle(circles[0]).height.slice(0, -2) / 2);

        var frags = 360 / n;
        for (var i = 0; i <= n; i++) {
            theta.push((frags / 180) * i * Math.PI);
        }

        var mainHeight = parseInt(window.getComputedStyle(transcludeDiv).height.slice(0, -2)) / 1.2;

        var circleArray = [];

        for (var i = 0; i < circles.length; i++) {
          circles[i].posx = Math.round(r * (Math.cos(theta[i]))) + 'px';
          circles[i].posy = Math.round(r * (Math.sin(theta[i]))) + 'px';
          circles[i].style.top = ((mainHeight / 2) - parseInt(circles[i].posy.slice(0, -2))) + 'px';
          circles[i].style.left = ((mainHeight/ 2 ) + parseInt(circles[i].posx.slice(0, -2))) + 'px';
        }

        /**
         * Rotate circle on drag
         */

        var center = {
          x: circleDimensions.left + circleDimensions.width / 2,
          y: circleDimensions.top + circleDimensions.height / 2
        };

        var getAngle = function(x, y){
          var deltaX = x - center.x,
              deltaY = y - center.y,
              angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

          if(angle < 0) {
            angle = angle + 360;
          }

          return angle;
        };

        var updatedAngle = 0,
            originalAngle = 0,
            currentAngle = 0;

        $ionicGesture.on('dragstart', function(e){
          var pageX = e.gesture.touches[0].pageX;
          var pageY = e.gesture.touches[0].pageY;
          updatedAngle = getAngle(pageX, pageY);
        }, angular.element(circle));

        $ionicGesture.on('drag', function(e){

          e.gesture.srcEvent.preventDefault();

          var pageX = e.gesture.touches[0].pageX;
          var pageY = e.gesture.touches[0].pageY;

          currentAngle = getAngle(pageX, pageY) - updatedAngle + originalAngle;

          circle.style.transform = circle.style.webkitTransform  = 'rotate(' + currentAngle + 'deg)';

          for (var i = 0; i < circles.length; i++) {
            circles[i].style.transform = circles[i].style.webkitTransform = 'rotate(' + -currentAngle + 'deg)';
          }

        }, angular.element(circle));

        $ionicGesture.on('dragend', function(e){
          originalAngle = currentAngle;
        }, angular.element(circle));

      }
    }

  });