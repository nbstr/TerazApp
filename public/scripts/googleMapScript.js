				var map;
				var bounds;
				var geocoder;
				var center;
				function initialize() {
					var mapOptions = {
						center: new google.maps.LatLng(-34.397, 150.644),
						zoom: 1,
						maxZoom: 14,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					map = new google.maps.Map(document.getElementById("map_canvas"),
						mapOptions);
					geocoder = new google.maps.Geocoder();
					bounds = new google.maps.LatLngBounds();
				}
				
				function addMarkerToMap(location){
					var marker = new google.maps.Marker({map: map, position: location});
					bounds.extend(location);
					map.fitBounds(bounds);
				}
			

			
				initialize();

				$("address").each(function(){
					var $address = $(this);
					geocoder.geocode({address: $address.text()}, function(results, status){
						if(status == google.maps.GeocoderStatus.OK) addMarkerToMap(results[0].geometry.location);
					});
				});

				google.maps.event.addDomListener(map, "idle", function(){
					center = map.getCenter();
				});

				$(window).resize(function(){
					map.setCenter(center);
				});
