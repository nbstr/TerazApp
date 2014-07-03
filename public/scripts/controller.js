function TerraceCtrl($scope, $http){

    $scope.get_terraces = function(){
        $http.get('api/terraces')
        .error(function(response){
            console.error(response);
        })
        .then(function(response){
            console.log(response);
            $scope.DATA = response.data;
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
        $scope.get_terraces();
    };
    $scope.init();
}