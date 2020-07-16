var map;
var currentMarker;
var userMarkers = {};
var infowindow;

function initMap() {
	var helsinki = new google.maps.LatLng(60.169, 24.938);

	map = new google.maps.Map(document.getElementById("map"), {
		center: helsinki,
		zoom: 12,
	});

	Object.values(userMarkers).forEach((markerItem) => {
		markerItem.setMap(map);
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
		markers.forEach(function (markerItem) {
			markerItem.setMap(null);
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
		infowindow.close();
		var localCurrentMarker = updateCurrentMarker(e.latLng, map);
		currentMarker = localCurrentMarker;
		var markerIndex = Object.keys(userMarkers).length;
		localCurrentMarker.addListener("click", function () {
			infowindow.setContent(
				"<div>" +
					"<div id='editableMarker'><strong><p id='place-title'>" +
					localCurrentMarker.title +
					"</p></strong><br>" +
					"<p id='place-desc'>" +
					localCurrentMarker.description +
					"</p>" +
					"<p id='map-coord'>" +
					localCurrentMarker.position +
					"</p>" +
					"<p id='open-hours'>" +
					localCurrentMarker.openingHours +
					"</p>" +
					"</div>" +
					"<div id='btn-add'><button id='marker-" +
					markerIndex +
					"' onclick='addToFav(event)' class='button-add'>+</button></div>" +
					"<div id='btn-delete'><button id='marker-" +
					markerIndex +
					"' onclick='deleteMarker(event)' class='button-delete'>-</button></div>" +
					"<div id='btn-edit'><button onclick='editMarker()' class='button-edit'>Edit</button></div>" +
					"<div id='btn-save'><button id='marker-" +
					markerIndex +
					"' onclick='saveMarker(event)' class='button-save'>Save</button></div>" +
					"</div>"
			);
			infowindow.open(map, localCurrentMarker);
		});
	});

	infowindow = new google.maps.InfoWindow();

	const theUrl = "http://127.0.0.1:5000/markers";
	getMarkerFromDB(theUrl, callback);
}

function updateCurrentMarker(latLng, map) {
	if (
		currentMarker !== undefined &&
		!Object.values(userMarkers).includes(currentMarker)
	) {
		currentMarker.setMap(null);
		currentMarker = undefined;
	}
	return new google.maps.Marker({
		position: latLng,
		map: map,
		title: "New place",
		description: "Description",
		openingHours: "Opening Hours",
	});
}

function deleteMarker(e) {
	let markerIndex = e.target.id;
	markerIndex = getIndexFromMarkerId(markerIndex);

	userMarkers[markerIndex].setMap(null);
	delete userMarkers[markerIndex];
	updateFav();
}

function getIndexFromMarkerId(id) {
	const markerIdStart = id.indexOf("-") + 1;
	return id.substring(markerIdStart, id.length);
}

function addToFav(e) {
	let markerIndex = e.target.id;
	markerIndex = getIndexFromMarkerId(markerIndex);

	if (
		!userMarkers[markerIndex] &&
		!Object.values(userMarkers).includes(currentMarker)
	) {
		addNewMarker(currentMarker);
		updateFav();
	}
}

function updateFav() {
	const node = document.getElementById("places");

	while (node.firstChild) {
		node.removeChild(node.firstChild);
	}

	Object.values(userMarkers).forEach((markerItem) => {
		const childNode = document.createElement("li");
		const textNode = document.createTextNode(markerItem.title);
		childNode.appendChild(textNode);
		node.appendChild(childNode);
	});
}

function editMarker() {
	var btnToggle = document.getElementById("btn-edit");

	if (btnToggle.style.display !== "none") {
		btnToggle.style.display = "none";
		btnToggle = document.getElementById("btn-save");
		btnToggle.style.display = "block";
		document.getElementById("editableMarker").contentEditable = true;
		document.addEventListener("keydown", logKey);
	} else {
		btnToggle.style.display = "block";
	}
}

function saveMarker(e) {
	let markerIndex = e.target.id; // marker-1
	const markerIdStart = markerIndex.indexOf("-") + 1; // 7
	markerIndex = markerIndex.substring(markerIdStart, markerIndex.length); // 1

	var btnToggle = document.getElementById("btn-save");
	var props = document.querySelectorAll(
		"#place-title, #place-desc, #map-coord, #open-hours"
	);

	if (btnToggle.style.display !== "none") {
		btnToggle.style.display = "none";
		btnToggle = document.getElementById("btn-edit");
		btnToggle.style.display = "block";
		document.getElementById("editableMarker").contentEditable = false;
		var markerRef = userMarkers[markerIndex] ?? currentMarker;

		for (var i = 0; i < props.length; i++) {
			var contentName = props[i].getAttribute("id");
			var content = props[i].innerHTML;

			switch (contentName) {
				case "place-title":
					markerRef.title = content;
					break;
				case "place-desc":
					markerRef.description = content;
					break;
				case "map-coord":
					markerRef.position = content;
					break;
				case "open-hours":
					markerRef.openingHours = content;
					break;
				default:
					break;
			}
		}
	} else {
		btnToggle.style.display = "block";
	}
	updateFav();
}

function addNewMarker(marker) {
	var markerIndex = Object.keys(userMarkers).length;
	userMarkers[markerIndex] = marker;

	userMarkers[markerIndex].addListener("click", function () {
		infowindow.close();

		infowindow.setContent(
			"<div>" +
				"<div id='editableMarker'><strong><p id='place-title'>" +
				marker.title +
				"</p></strong><br>" +
				"<p id='place-desc'>" +
				marker.description +
				"</p>" +
				"<p id='map-coord'>" +
				marker.position +
				"</p>" +
				"<p id='open-hours'>" +
				marker.openingHours +
				"</p>" +
				"</div>" +
				"<div id='btn-add'><button id='marker-" +
				markerIndex +
				"' onclick='addToFav(event)' class='button-add'>+</button></div>" +
				"<div id='btn-delete'><button id='marker-" +
				markerIndex +
				"' onclick='deleteMarker(event)' class='button-delete'>-</button></div>" +
				"<div id='btn-edit'><button onclick='editMarker()' class='button-edit'>Edit</button></div>" +
				"<div id='btn-save'><button id='marker-" +
				markerIndex +
				"' onclick='saveMarker(event)' class='button-save'>Save</button></div>" +
				"</div>"
		);

		infowindow.open(map, marker);
	});
	updateFav();
}

function showAllMarkers() {
	Object.keys(userMarkers).forEach((markerKey) => {
		userMarkers[markerKey].setMap(map);
	});
}

// Collapse Favourites in left panel

function collapsePlaces() {
	var btnToggle = document.getElementById("left-panel-places");
	if (btnToggle.style.display !== "none") {
		btnToggle.style.display = "none";
	} else {
		btnToggle.style.display = "block";
	}
}

// Prevent adding empty space for separate id

function logKey(e) {
	if (e.keyCode === 13) {
		document.execCommand("insertHTML", false, "<br/>");
		return true;
	}
}

// Get Request

function getMarkerFromDB(theUrl, callback, map) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(xmlHttp.responseText);
	};
	xmlHttp.open("GET", theUrl, true); // true for asynchronous
	xmlHttp.send(null);
}

function callback(response) {
	var data = JSON.parse(response);
	console.log(response);

	for (var i = 0; i < data.length; i++) {
		var latLng_buff = data[i].position.split(",");
		console.log(latLng_buff);

		var position_buff = new google.maps.LatLng(
			Number(latLng_buff[0].replace("(", "")),
			Number(latLng_buff[1].replace(")", ""))
		);

		console.log(Number(latLng_buff[1].replace(")", "")));

		var marker = new google.maps.Marker({
			position: position_buff,
			title: data[i].title,
			description: data[i].description,
			openingHours: data[i].openHours,
		});

		addNewMarker(marker);
	}
	showAllMarkers();
	console.log(userMarkers);
}
