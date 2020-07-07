var map;
var marker;
var userMarkers = [];

function initMap() {
  var helsinki = new google.maps.LatLng(60.169, 24.938);

  var map = new google.maps.Map(document.getElementById("map"), {
    center: helsinki,
    zoom: 12,
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById("search-input");
  var searchBox = new google.maps.places.SearchBox(input);
  //   map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", function () {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", function () {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location,
        })
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

  // Add place on map
  map.addListener("click", function (e) {
    const marker = placeMarkerAndPanTo(e.latLng, map);
    marker.addListener("click", function () {
      infowindow.setContent(
        "<div><strong>" +
          "New place" +
          "</strong><br>" +
          "<button onclick='testAlert()' id=''>Edit</button>" +
          "</div>"
      );
      infowindow.open(map, marker);
    });
  });

  var infowindow = new google.maps.InfoWindow();

  // Get place details

  var request = {
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    fields: ["name", "formatted_address", "place_id", "geometry"],
  };

  var service = new google.maps.places.PlacesService(map);

  service.getDetails(request, function (place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
      });
      google.maps.event.addListener(marker, "click", function () {
        infowindow.setContent(
          "<div><strong>" +
            place.name +
            "</strong><br>" +
            "Place ID: " +
            place.place_id +
            "<br>" +
            place.formatted_address +
            "</div>"
        );
        infowindow.open(map, this);
      });
    }
  });
}

function placeMarkerAndPanTo(latLng, map) {
  marker = new google.maps.Marker({
    position: latLng,
    map: map,
    title: "New place",
  });
  //   map.panTo(latLng);
  //   marker.setMap(map);
  return marker;
}

function testAlert() {
  alert("test");
  marker.setMap(null);
}
