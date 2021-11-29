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

        radius = mag * 2.5;

        marker = L.circleMarker(location, features).bindPopup(
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

    Features.forEach(function (feature) {
        var size = "";
        if(feature.properties.mag  <2 ) {
          size = 8000}
        else size = ((feature.properties.mag * 100)**2)
        var color = "";
        if(feature.geometry.coordinates[2] <35) {
          color = "#FFE333"}
        else if(feature.geometry.coordinates[2] < 80) {
          color = "#FF4040"}
        else if(feature.geometry.coordinates[2] < 200) {
          color = "#CD3333"}
        else if(feature.geometry.coordinates[2] < 300) {
          color = "FFAC33"}
        else if (feature.geometry.coordinates[2] > 300) {
          color = "black"
        };

        L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],{radius: size, color: "black",fillColor: color, fillOpacity: 1, weight: .5})
        .bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p> <p>Magnitude:  ${feature.properties.mag} <br> Depth:  ${feature.geometry.coordinates[2]} </p>`).addTo(map);
});
};

var legend = L.control({position: 'bottomright'})
legend.onAdd= function() {
  var div = L.DomUtil.create("div", "info legend");
  var grades = ["<35","35 - 80", "80 - 200", "200 - 300", ">300" ]
    colors = ["#FFE333", "#FF4040","#CD3333","FFAC33","black" ]

    var legendInfo = "<h3>Earthquake Depth (km)</h3>" 
  div.innerHTML = legendInfo;
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      "<ul>" + '<i style="background:' + colors[i] + '"></i> ' +
        labels[i] +" " + grades[i] + "</ul>"}
  return div;

};