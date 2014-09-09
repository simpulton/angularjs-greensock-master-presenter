var app = angular.module('slideshow', ['ngAnimate', 'firebase']);

app.constant('ENDPOINT_URI', 'https://angular-slideshow.firebaseio.com/');

app.controller('MainCtrl', function ($scope, $location, RemoteSlide) {
    var LEFT_ARROW = 37,
        RIGHT_ARROW = 39;

    function isCurrentSlideIndex(index) {
        return $scope.remoteSlide.currentIndex === index;
    }

    function prevSlide() {
        $scope.remoteSlide.direction = 'left';
        $scope.remoteSlide.currentIndex = ($scope.remoteSlide.currentIndex > 0)
            ? --$scope.remoteSlide.currentIndex : $scope.slides.length - 1;
    }

    function nextSlide() {
        $scope.remoteSlide.direction = 'right';
        $scope.remoteSlide.currentIndex = ($scope.remoteSlide.currentIndex < $scope.slides.length - 1)
            ? ++$scope.remoteSlide.currentIndex : 0;
    }

    function onKeyUp(keyCode) {
        if(!$scope.isPresenter) return; // Only allow presenter to navigate

        if (keyCode === LEFT_ARROW) {
            prevSlide();
        } else if (keyCode === RIGHT_ARROW) {
            nextSlide();
        }
    }

    function getDirection() {
        return $scope.remoteSlide.direction;
    }

    $scope.slides = [
        {id: 'slide00', title: 'Slide One', subtitle: 'With a supporting point!'},
        {id: 'slide01', title: 'Slide Two', subtitle: 'With a supporting point!'},
        {id: 'slide02', title: 'Slide Three', subtitle: 'With a supporting point!'},
        {id: 'slide03', title: 'Slide Four', subtitle: 'With a supporting point!'},
        {id: 'slide04', title: 'Slide Five', subtitle: 'With a supporting point!'}
    ];

    $scope.remoteSlide = {
        currentIndex: 0,
        direction: 'left'
    };

    $scope.isPresenter = ($location.search()).presenter;
    $scope.onKeyUp = onKeyUp;
    $scope.isCurrentSlideIndex = isCurrentSlideIndex;
    $scope.getDirection = getDirection;

    RemoteSlide().$bindTo($scope, 'remoteSlide');
});

app.factory('RemoteSlide', function($firebase, ENDPOINT_URI) {
    return function() {
        // create a reference to the current slide index
        var ref = new Firebase(ENDPOINT_URI);

        // return it as a synchronized object
        return $firebase(ref).$asObject();
    }
});

app.animation('.slide-animation', function ($window) {
    return {
        enter: function (element, done) {
            var scope = element.scope();

            var startPoint = $window.innerWidth;
            if(scope.getDirection() !== 'right') {
                startPoint = -startPoint;
            }
            TweenMax.fromTo(element, 0.5, {left: startPoint}, {left:0, onComplete: done });
        },

        leave: function (element, done) {
            var scope = element.scope();

            var endPoint = $window.innerWidth;
            if(scope.getDirection() === 'right') {
                endPoint = -endPoint;
            }

            TweenMax.to(element, 0.5, { left: endPoint, onComplete: done });
        }
    };
});