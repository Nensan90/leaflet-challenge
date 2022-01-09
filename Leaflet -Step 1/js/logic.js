const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url).then(function(data) {
    console.log(data);
    createMarkers(data);
});
function createMarkers(response) {
    var features = response.features;
    var quakeMarkers = [];

for (let i=0; i<features.length; i++) {
        var quakeID = features[i].id;
        var place = features[i].properties.place;
        var location = [features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]];
        var depth = features[i].geometry.coordinates[2];
        var mag = features[i].properties.mag;
        var time = Date(features[i].properties.time);
        var fillColor;
        if (depth < 12) {fillColor = "#9FFF33";}
        else if (depth >= 20 && depth < 40) {fillColor = "#FF7A33"}
        else if (depth >= 40 && depth < 60) {fillColor = "#FFE333"}
        else if (depth >= 50 && depth < 80) {fillColor = "#FFAC33"}
        else if (depth >= 80 && depth < 100) {fillColor = "#CEFF33"}
        else {fillColor = "#FF3333"}

        radius = mag * 2.0;
        var geojsonMarkerOptions = {
            radius: radius,
            fillColor: fillColor,
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 1.0
        };
        marker = L.circleMarker(location, geojsonMarkerOptions).bindPopup(
            `<h3>ID: ${quakeID}</h3>
            <h4>${place}</h4>
            <hr>
            <p>${time}</p>
            <hr>
            <p>Coordinates: ${location}</p>
            <p>Depth: ${depth}</p>
            <p>Magnitude: ${mag}</p>`
        );
        quakeMarkers.push(marker);
    }
    
    var earthquakes = L.layerGroup(quakeMarkers);
    quakeMapGen(response, earthquakes);
}

function quakeMapGen(data, earthquakes) {
    var bBox = data.bbox;
    var centerLng = (bBox[0] + bBox[3]) / 2;
    var centerLat = (bBox[1] + bBox[4]) / 2;
    var center = [centerLat, centerLng];
    console.log(center);

    var streetview = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var topographic = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    var base = {
      "Street Map": streetview,
      "Topographic Map": topographic
    };
  
    var overlay = {
      Earthquakes: earthquakes
    };
  
    var newmap = L.map("map", {
      center: center,
      zoom: 3,
      layers: [streetview, earthquakes]
    });
  
    L.control.layers(base, overlay, {
      collapsed: false
    }).addTo(newmap)
  
}
