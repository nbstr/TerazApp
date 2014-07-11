function TerraceCtrl($scope, $http, $geo){

    $('.scrollable').scroll(function() {
        if ($(this).scrollTop() > 200) {
            $('.app-header').fadeOut(200);
        }
        else{
            $('.app-header').fadeIn(200);
        }
    });

    $scope.get_data = function(radius){

        $geo.position(function(position){

            $http.get(u('api/terraces?limit=' + 25 + '&lat=' + position.coords.latitude + '&lng=' + position.coords.longitude + '&radius=' + radius))
            .error(function(response){
                console.error(response);
            })
            .then(function(response){
                var elmnt;
                for (var e in response.data.data.terraces) {
                    elmnt = response.data.data.terraces[e];
                    if(elmnt.type != undefined){
                        if(typeof(elmnt.type) == 'string' && (elmnt.type[0] == 'r' || elmnt.type[0] == 'R')){
                            response.data.data.terraces[e].type = 'resto';
                        }
                        else if(typeof(elmnt.type) == 'string' && (elmnt.type[0] == 'b' || elmnt.type[0] == 'B')){
                            response.data.data.terraces[e].type = 'bar';
                        }
                        else if(typeof(elmnt.type) == 'string' && (elmnt.type[0] == 'p' || elmnt.type[0] == 'P')){
                            response.data.data.terraces[e].type = 'bench';
                        }
                        else{
                            response.data.data.terraces[e].type = 'unknwn';
                        }
                    }
                    else{
                        response.data.data.terraces[e].type = 'unknwn';
                    }
                }
                $scope.DATA = response.data.data.terraces;
                console.log({
                    data:response.data.data.terraces
                });
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

    $scope.return_number = function(str_var) {
        str_var = str_var.toString();
        var newstr_var = '';
        for(i=0;i<str_var.length;i++) {
            newstr_var += (isNaN(str_var.substr(i, 1)) || str_var[i] == ' ') ? '' : str_var.substr(i, 1);
        }
        return newstr_var
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