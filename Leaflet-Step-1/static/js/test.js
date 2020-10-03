//Creating map object
var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 8
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

//API url of all earthquake eventsfor the past day (updated every minute)
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
  
//Making sure the data was obtained
console.log(geoData);

//Grabbing geojson data
d3.json(geoData, function(data) {
 
//Styling the markers so their color will be  based on magnitude of earthquake
function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.geometry.coordinates[2]),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}
// Using get Color function to determine the color of the marker based on earthquake magnitude.
function getColor(depth) {
  switch (true) {
  case depth > 90:
    return "#EA2C2C";
  case depth > 70:
    return "#EA822C";
  case depth > 50:
    return "#EE9C00";
  case depth > 30:
    return "#EECC00";
  case depth > 10:
    return "#D4EE00";
  default:
    return "#98EE00";
  }
}
// Using get radius function to determine the radius of the markers based on earthquake magnitude and making sure that earthquakes with magnitude= 0 return 1 instead for correct radius 
function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }
  return magnitude * 4;
}
// Adding GeoJSON layer to the map once file is loaded.
L.geoJson(data, {
  
    // Returning each feature into a circleMarker on the map.
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng);
  },
  // Setting a style for each circleMarker using our styleInfo function.
  style: styleInfo,
  // Creating a popup for each marker to display the magnitude and location of earthquake 
  onEachFeature: function(feature, layer) {
    layer.bindPopup(
      "Magnitude: "
        + feature.properties.mag
        + "<br>Depth: "
        + feature.geometry.coordinates[2]
        + "<br>Location: "
        + feature.properties.place
    );
  }
 
}).addTo(myMap);

//Creating a legend control object.
var legend = L.control({
  position: "bottomright"
});
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var grades = [-10, 10, 30, 50, 70, 90];
  var colors = [
    "#98EE00",
    "#D4EE00",
    "#EECC00",
    "#EE9C00",
    "#EA822C",
    "#EA2C2C"];
  // Looping through the intervals and generating a label with a colored square for each interval.
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML += "<i style='background: "
      + colors[i]
      + "'></i> "
      + grades[i]
      + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }
  return div;
};
// Adding legend to map.
legend.addTo(myMap);

});