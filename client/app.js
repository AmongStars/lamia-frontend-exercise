var map;
var marker;
var userMarkers = {};

function initMap() {
  var helsinki = new google.maps.LatLng(60.169, 24.938);

  var map = new google.maps.Map(document.getElementById("map"), {
    center: helsinki,
    zoom: 12,
  });

  Object.values(userMarkers).forEach((marker) => {
    marker.setMap(map);
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
    const markerIndex = Object.keys(userMarkers).length;
    marker.addListener("click", function () {
      infowindow.setContent(
        "<div>" +
          "<div id='editableMarker'><strong>New place</strong></div>" +
          "<div id='btn-add'><button onclick='addToFav()' class='button-add'>+</button></div>" +
          "<div id='btn-delete'><button id='marker-" +
          markerIndex +
          "' onclick='deleteMarker(event)' class='button-delete'>-</button></div>" +
          "<div id='btn-edit'><button onclick='editMarker()' class='button-edit'>Edit</button></div>" +
          "<div id='btn-save'><button onclick='saveMarker()' class='button-save'>Save</button></div>" +
          "</div>"
      );
      infowindow.open(map, marker);
    });
  });

  var infowindow = new google.maps.InfoWindow();
}

function placeMarkerAndPanTo(latLng, map) {
  if (marker !== undefined && !Object.values(userMarkers).includes(marker)) {
    marker.setMap(null);
    marker = undefined;
  }
  marker = new google.maps.Marker({
    position: latLng,
    map: map,
    title: "New place",
  });

  return marker;
}

function deleteMarker(e) {
  console.log(e.target.id);
  let { id } = e.target;
  const markerIdStart = id.indexOf("-") + 1;
  id = id.substring(markerIdStart, id.length);

  userMarkers[id].setMap(null);
  delete userMarkers[id];
}

function addToFav() {
  if (!Object.values(userMarkers).includes(marker)) {
    userMarkers[Object.keys(userMarkers).length] = marker;
    const node = document.getElementById("places");
    const childNode = document.createElement("li");
    const textNode = document.createTextNode(marker.title);
    childNode.appendChild(textNode);
    node.appendChild(childNode);
  }
}

function editMarker() {
  var btnToggle = document.getElementById("btn-edit");
  if (btnToggle.style.display !== "none") {
    btnToggle.style.display = "none";
    btnToggle = document.getElementById("btn-save");
    btnToggle.style.display = "block";
    document.getElementById("editableMarker").contentEditable = "true";
  } else {
    btnToggle.style.display = "block";
  }
}

function saveMarker() {
  var btnToggle = document.getElementById("btn-save");
  if (btnToggle.style.display !== "none") {
    btnToggle.style.display = "none";
    btnToggle = document.getElementById("btn-edit");
    btnToggle.style.display = "block";
    document.getElementById("editableMarker").contentEditable = "false";
  } else {
    btnToggle.style.display = "block";
  }
}
