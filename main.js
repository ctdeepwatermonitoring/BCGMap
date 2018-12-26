// initialize the map
var lat= 41.55;
var lng= -72.65;
var zoom= 9;

var map = L.map('map', {
    zoomControl: true,
    attributionControl: false
});

map.setView([lat, lng], zoom);
map.createPane('top');
map.getPane('top').style.zIndex=650;

// load a tile layer base map
L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.control.attribution({position: 'bottomright'}).addTo(map);

//in pixels, top left icon is drawn on lat,long
var FishIcon = L.Icon.extend({
    options: {
        iconSize:     [7, 14],
        iconAnchor:   [7, 7],
        popupAnchor:  [-7, -7]
    }
});

var BugIcon = L.Icon.extend({
    options: {
        iconSize:     [7, 14],
        iconAnchor:   [0, 7],
        popupAnchor:  [7, -1]
    }
});

var siteIcon = L.icon({
    iconUrl: 'sitecircle.png',
    iconSize:   [14,14]
});

//iconAnchor [downward_pixels, rightward_pixels]
//left  rect/circle is positioned: iconAnchor: [-0.5*icon_height,-0.5*icon_width]
//right rect/circle is positioned: iconAnchor: [-0.5*icon_height,-icon_width]

var redfishIcon = new FishIcon({iconUrl: 'redfishcircle.png'}),
    bluefishIcon = new FishIcon({iconUrl: 'bluefishcircle.png'}),
    purplefishIcon = new FishIcon({iconUrl: 'purplefishcircle.png'});


var redbugIcon = new BugIcon({iconUrl: 'redbugcircle.png'}),
    bluebugIcon = new BugIcon({iconUrl: 'bluebugcircle.png'}),
    purplebugIcon = new BugIcon({iconUrl: 'purplebugcircle.png'});

/*function getIcon(feature){
    var icon;
    if(feature.properties.AvgBCG <= 2 && feature.properties.SAMPLE == 'FISH') icon = bluefishIcon;
    else if (feature.properties.AvgBCG <= 4 && feature.properties.SAMPLE == 'FISH') icon = purplefishIcon;
    else if (feature.properties.AvgBCG <= 6 && feature.properties.SAMPLE == 'FISH') icon = redfishIcon;
    else if (feature.properties.AvgBCG <= 2 && feature.properties.SAMPLE == 'BUG') icon = bluebugIcon;
    else if (feature.properties.AvgBCG <= 4 && feature.properties.SAMPLE == 'BUG') icon = purplebugIcon;
    else icon = redbugIcon;
    return icon;
}*/


function getFishIcon(feature){
    var fishicon;
    if(feature.properties.AvgBCG <= 2) fishicon = bluefishIcon;
    else if (feature.properties.AvgBCG <= 4) fishicon = purplefishIcon;
    else fishicon = redfishIcon;
    return fishicon;
}

function getBugIcon(feature){
    var bugicon;
    if(feature.properties.AvgBCG <= 2) bugicon = bluebugIcon;
    else if (feature.properties.AvgBCG <= 4) bugicon = purplebugIcon;
    else bugicon = redbugIcon;
    return bugicon;
}

var controlLayers = L.control.layers().addTo(map);

$.getJSON("data/FishBCGsites.geojson",function(fishdata){
    var fishmarker = L.geoJson(fishdata ,{
        pointToLayer: function(feature,latlng){
            return L.marker (latlng,{icon: getFishIcon(feature),opacity: 0.9})
        },
    }).addTo(map);
    controlLayers.addOverlay(fishmarker,'Fish');
});


$.getJSON("data/BugBCGsites.geojson",function(bugdata){
    var bugmarker = L.geoJson(bugdata ,{
        pointToLayer: function(feature,latlng){
            return L.marker (latlng,{icon: getBugIcon(feature),opacity: 0.9})
        },
    }).addTo(map);
    controlLayers.addOverlay(bugmarker,'Bug');
});

$.getJSON("data/FBBCGsites.geojson",function(data) {
    var marker = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {pane: 'top', icon: siteIcon, opacity: 1})
        },
        onEachFeature: function (feature,marker) {
            marker.bindPopup('<b>Stream: </b>' + feature.properties.Station_Name + '</br>' +
                "<b>SID: </b>" + feature.properties.STA_SEQ + '</br>' +
                "<b>Bug BCG: </b>" + feature.properties.BugBCG + '</br>' +
                "<b>Fish BCG: </b>" + feature.properties.FishBCG + '</br>');
        }
    }).addTo(map);
});

//add legend
var legend = L.control({position: 'bottomright'});

// Function that runs when legend is added to map
legend.onAdd = function (map) {

    // Create Div Element and Populate it with HTML
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<i class="halfCircleRight" style="background: black"></i>' +
        '<p>Macroinvertebrate Data</p>';
    div.innerHTML += '<i class="halfCircleLeft" style="background: black"></i>' +
        '<p> Fish Data</p>';
    div.innerHTML += '<h3>BCG Value</h3>';
    div.innerHTML += '<i class = "p" style="background: blue"></i>  <p>1 or 2</p>';
    div.innerHTML += '<i style="background: purple"></i>  <p>3 or 4 </p>';
    div.innerHTML += '<i style="background: red"></i>  <p>5 or 6</p>';

    // Return the Legend div containing the HTML content
    return div;
};

// Add Legend to Map
legend.addTo(map);
