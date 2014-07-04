function TerraceCtrl($scope, $http, $geo){

    $scope.get_data = function(){

        $geo.position(function(position){

            $http.get(u('api/terraces?lat=' + position.coords.latitude + '&lng=' + position.coords.longitude + '&radius=' + $scope.radius))
            .error(function(response){
                console.error(response);
            })
            .then(function(response){
                $scope.DATA = response.data;
                console.log($scope.DATA);
            });

            $http.get(u('api/forecast?lat=' + position.coords.latitude + '&lng=' + position.coords.longitude))
            .error(function(response){
                console.error(response);
            })
            .then(function(response){
                $scope.FORECAST = response.data.data;
                console.log($scope.FORECAST);
            });

        });

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

    $scope.init = function(){

        $scope.radius = 100000;

        $scope.get_data();
    };
    $scope.init();
}