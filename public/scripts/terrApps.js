angular.module('app',[])

.factory('$geo', function($rootScope){

    return {
        position:function (success){
            // check whether browser supports geolocation api
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(success, this.position_error, { enableHighAccuracy: true });
            }
            else{
                console.error("Your browser does not support geolocation. We advise you to update it.");
            }
        },
        position_error:function(error){

            var errors = {
                1: "Permission denied.",
                2: "Position unavailable.",
                3: "Connection timeout."
            };

            console.error("Error:" + errors[error.code]);
        },
        distance:function (p1, p2){
            var point1 = new google.maps.LatLng(p1.lat, p1.lng);
            var point2 = new google.maps.LatLng(p2.lat, p2.lng);
            return parseInt(google.maps.geometry.spherical.computeDistanceBetween(point1, point2));
        }
    }
})
.filter('distance', function () {
return function (input) {
    if (input >= 1000) {
        return (input/1000).toFixed(2);
    } else {
        return input;
    }
}
})
