function initMap() {
		var positionMarker = {lat: 59.938777, lng: 30.323161};
        var uluru = {lat: 59.939154, lng: 30.321206};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 17,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: positionMarker,
          map: map,
          icon: 'img/map-marker.png'
        });
      }