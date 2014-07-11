function TerraceCtrl($scope, $http, $geo){

    $scope.get_data = function(radius){

        $geo.position(function(position){

            $http.get(u('api/terraces?lat=' + position.coords.latitude + '&lng=' + position.coords.longitude + '&radius=' + radius))
            .error(function(response){
                console.error(response);
            })
            .then(function(response){
                $scope.DATA = response.data.data.terraces;
                $scope.FORECAST = response.data.data.forecast;
                // console.log($scope.DATA);
                if($scope.DATA.length > 0){
                    $scope.set_terrace($scope.DATA[0]);
                }

                /*
                $http.get(u('api/forecast?lat=' + position.coords.latitude + '&lng=' + position.coords.longitude))
                .error(function(response){
                    console.error(response);
                })
                .then(function(response){
                    $scope.FORECAST = response.data.data;
                    console.log($scope.FORECAST);
                });
                */

            });

        });

    };

    $scope.reload_data = function(){
        var radius = document.getElementById('distance').value;
        $scope.get_data(radius);
    };

    $scope.slide_get = function(){

        $('.scrollable').pullToRefresh({
            callback: function () {

                setTimeout(function () {

                    alert('coucou');
                    
                }, 2000);

            }
        });

    };

    $scope.set_terrace = function(terrace){
        $scope.current_terrace = {
            name:terrace.name,
            address:terrace.address.number + ', ' + terrace.address.street + ' ' + terrace.address.zip,
            sun:(terrace.sun_start && terrace.sun_end) ? terrace.sun_start + ' - ' + terrace.sun_end : null,
            sits:(terrace.sits) ? terrace.sits : null,
        };
    };

    $scope.map_marker = function(terrace){
        console.log('click');
        $scope.set_terrace(terrace);
        $scope.codeAddress([terrace.address.number, terrace.address.street, terrace.address.zip].join(' '));
    };

    $scope.initialize = function() {
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(-34.397, 150.644);
        var myOptions = {
          zoom: 8,
          center: latlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        $('#map_canvas').css('height', window.innerHeight).css('width', window.innerWidth);
        $scope.codeAddress('bruxelles');
    }

    $scope.codeAddress = function(address) {
        console.log('requesting');
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': address
        }, function(results, status) {
            console.log(results[0]);
            if (status == google.maps.GeocoderStatus.OK) {
                var myOptions = {
                    zoom: 14,
                    center: results[0].geometry.location,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
                map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            }
        });
    }

    $scope.init = function(){
        var geocoder, map;

        $scope.get_data(100000);
        $scope.initialize();
    };
    $scope.init();
}