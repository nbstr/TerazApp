function TerraceCtrl($scope, $http, $geo){

    $scope.get_terraces = function(){

        $geo.position(function(position){

            $http.get(u('api/terraces?lat=' + position.coords.latitude + '&lng=' + position.coords.longitude + '&radius=' + $scope.radius))
            .error(function(response){
                console.error(response);
            })
            .then(function(response){
                console.log(response);
                $scope.DATA = response.data;
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

        $scope.radius = 1000;

        $scope.get_terraces();
    };
    $scope.init();
}