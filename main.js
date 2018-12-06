// initialize the map
var lat= 41.55;
var lng= -72.65;
var zoom= 9;

var map = L.map('map', {
    zoomControl: false,
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

var FishIcon = L.Icon.extend({
    options: {
        iconSize:     [30, 20],
        iconAnchor:   [20, 15],
        popupAnchor:  [-3, -10]
    }
});

var redfishIcon = new FishIcon({iconUrl: 'redfish.png'}),
    bluefishIcon = new FishIcon({iconUrl: 'bluefish.png'}),
    yellowfishIcon = new FishIcon({iconUrl: 'yellowfish.png'});

function getIcon(feature){
    var icon;
    if(feature.properties.AvgBCG <= 2) icon = bluefishIcon;
    else if (feature.properties.AvgBCG <= 4) icon = yellowfishIcon;
    else icon = redfishIcon;
    return icon;
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

$.getJSON("data/BCGsites.geojson",function(data){
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

