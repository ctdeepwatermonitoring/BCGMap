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
L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18,
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, ' +
        'Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, ' +
        'Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
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

/*$.getJSON("data/BCGsites.geojson",function(data){
    L.geoJson(data ,{
        pointToLayer: function(feature,latlng){
            var marker = L.marker(latlng,{icon: fishicon});
            marker.bindPopup(feature.properties.Station_Name);
            return marker;
        }
    }).addTo(map);
});*/

/*$.getJSON("data/BCGsites.geojson",function(data){
    var marker = L.geoJson(data ,{
        pointToLayer: function(feature,latlng){
        return L.marker (latlng,{icon: getIcon(feature),opacity: 0.6})
        },
        onEachFeature: function (feature,marker) {
            marker.bindPopup('<b>Stream: </b>' + feature.properties.Station_Name + '</br>' +
                "<b>SID: </b>" + feature.properties.STA_SEQ + '</br>' +
                "<b>SAMPLE:</b>"+feature.properties.SAMPLE+'</br>'+
                "<b>BCG: </b>" +
                feature.properties.AvgBCG);
        }
    }).addTo(map);
});*/

var controlLayers = L.control.layers().addTo(map);

$.getJSON("data/FishBCGsites.geojson",function(fishdata){
    var fishmarker = L.geoJson(fishdata ,{
        pointToLayer: function(feature,latlng){
            return L.marker (latlng,{icon: getFishIcon(feature),opacity: 0.8})
        },
        onEachFeature: function (feature,marker) {
            marker.bindPopup('<b>Stream: </b>' + feature.properties.Station_Name + '</br>' +
                "<b>SID: </b>" + feature.properties.STA_SEQ + '</br>' +
                "<b>SAMPLE: </b>Fish"+'</br>'+
                "<b>BCG: </b>" +
                feature.properties.AvgBCG);
        }
    }).addTo(map);
    controlLayers.addOverlay(fishmarker,'Fish');
});


$.getJSON("data/BugBCGsites.geojson",function(bugdata){
    var bugmarker = L.geoJson(bugdata ,{
        pointToLayer: function(feature,latlng){
            return L.marker (latlng,{icon: getBugIcon(feature),opacity: 0.8})
        },
        onEachFeature: function (feature,marker) {
            marker.bindPopup('<b>Stream: </b>' + feature.properties.Station_Name + '</br>' +
                "<b>SID: </b>" + feature.properties.STA_SEQ + '</br>' +
                "<b>SAMPLE: </b>Bug"+'</br>'+
                "<b>BCG: </b>" +
                feature.properties.AvgBCG);
        }
    }).addTo(map);
    controlLayers.addOverlay(bugmarker,'Bug');
});

$.getJSON("data/BCGsites.geojson",function(data) {
    var marker = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: siteIcon, opacity: 1})
        }
    }).addTo(map);
});
/*var omsOptions = {nearbyDistance:1};
var oms = new OverlappingMarkerSpiderfier(map,omsOptions);


$.getJSON("data/BCGsites.geojson",function(data) {
    L.geoJson(data  ,{
        pointToLayer: function(feature,latlng){
            return L.marker(latlng);
        },
        onEachFeature: function (feature, latlng) {
            oms.addMarker(latlng);
        }
    }  ).addTo(map);
});

var popup = new L.Popup();
oms.addListener('click', function(marker) {
    popup.setContent('<b>Stream: </b>'+marker.feature.properties.Station_Name+'</br>'+
        "<b>SID: </b>"+marker.feature.properties.STA_SEQ+'</br>'+
        "<b>SAMPLE TYPE: </b>"+marker.feature.properties.SAMPLE+'</br>'+
        "<b>BCG: </b>"+
        marker.feature.properties.AvgBCG);
    popup.setLatLng(marker.getLatLng());
    map.openPopup(popup);
});*/

// for (var i = 0; i < window.mapData.length; i ++) {
//     var datum = window.mapData[i];
//     var loc = new L.LatLng(datum.lat, datum.lon);
//     var marker = new L.Marker(loc);
//     marker.desc = datum.d;
//     map.addLayer(marker);
//     oms.addMarker(marker);  // <-- here
// }

// load GeoJSON from an external file and display circle markers
/*$.getJSON("BugBCGsites.geojson",function(data){
    var marker = L.geoJson(data, {
        pointToLayer: function(feature,latlng){
            var markerStyle = {
                fillColor:'#cccccc',
                radius: 5,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.9,
                pane: 'top'
            };
            return L.circleMarker(latlng, markerStyle);
        },
        onEachFeature: function (feature,marker) {
            marker.bindPopup('<b>Stream: </b>'+feature.properties.Station_Name+'</br>'+
                "<b>SID: </b>"+feature.properties.STA_SEQ+'</br>'+
                "<b>BCG: </b>"+
                feature.properties.AvgBCG);
        }
    }).addTo(map);
});*/

