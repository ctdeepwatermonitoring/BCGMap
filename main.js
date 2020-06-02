// initial Leaflet map options
const options = {
    zoomSnap: .1,
    zoomControl: false
};

// create Leaflet map and apply options
const map = L.map('map',options);
new L.control.zoom({position:"bottomright"}).addTo(map)

// set global variables for map layer,
// mapped attribute, attribute already normalized (percent)
let attributeValue = "BugBCG";

// create object to hold legend titles
const labels = {
    "BugBCG": "Macroinvertebrate BCG",
    "FishBCG": "Fish BCG"
};

var Basin = $.getJSON("data/majorbasin.geojson", function (basin) {
    // jQuery method uses AJAX request for the GeoJSON data
    const mbasin = L.geoJson(basin,{
        style:function style(feature) {
            return {
                fillColor: 'white',
                weight: 1,
                opacity: 1,
                color: 'white',
                //dashArray: '4',
                fillOpacity: 0.7
            };
        }
    }).addTo(map);

    // fit the map's bounds and zoom level using the counties extent
    map.fitBounds(mbasin.getBounds(), {
        padding: [18, 18] // add padding around counties
    });
});

var Sites = $.when(Basin).done(function () {
    $.getJSON("data/FBBCGsites.geojson", function (data) {
        // jQuery method uses AJAX request for the GeoJSON data
        console.log(data);
        // call draw map and send data as parameter
        drawMap(data);
    })
});





function drawMap(data) {
    // create Leaflet data layer and add to map
    const sites = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng,);
        },
        style: function style(feature){
            return{
                radius: 8,
                fillColor: "#ffffff",
                color: "#000",
                weight: 1,
                opacity: 0.5,
                fillOpacity: 0.7
            };
        },
        // add hover/touch functionality to each feature layer
        onEachFeature: function (feature, layer) {

            // when mousing over a layer
            layer.on('mouseover', function () {

                // change the stroke color and bring that element to the front
                layer.setStyle({
                    color: '#ff6e00'
                }).bringToFront();
            });

            // on mousing off layer
            layer.on('mouseout', function () {

                // reset the layer style to its original stroke color
                layer.setStyle({
                    color: '#20282e'
                });
            });
        }
    }).addTo(map);



    updateMap(sites); // draw the map
    addUi(sites);
    addLegend();

}

function updateMap(sites) {
    // logging sites to console here to
    // verify the Leaflet layers object is not accessible
    // and scoped within this function
    console.log(sites);

    // loop through each county layer to update the color and tooltip info
    sites.eachLayer(function (layer) {

        const props = layer.feature.properties;
        console.log(attributeValue);

        const BugLab = getLab(props["BugBCG"]);
        const FishLab = getLab(props["FishBCG"]);

            layer.setStyle({
                fillColor: getColor(props[attributeValue])
            });



        // assemble string sequence of info for tooltip (end line break with + operator)
        let tooltipInfo = `<b>${props["Station_Name"]}</b></br>
            Bug BCG Value: ${(BugLab).toLocaleString()}<br>
            Fish BCG Value: ${(FishLab).toLocaleString()}`;

        // bind a tooltip to layer with county-specific information
        layer.bindTooltip(tooltipInfo, {
            // sticky property so tooltip follows the mouse
            sticky: true,
            className: 'customTooltip'
        })
    });

}


function getLab(j) {
    if (j ==0) {
        return 'No data'
    } else {
        return j
    }
}

// Get color of parameter
function getColor(d) {
    // function accepts a single normalized data attribute value
    // and uses a series of conditional statements to determine which
    // which color value to return to return to the function caller
        if (d >= 1 && d <= 2) {
            return '#225ea8';
        } else if (d > 2 && d <= 4) {
            return '#41b6c4';
        } else if (d >4 && d <= 6) {
            return '#a1dab4';
        } else {
            return '#f0f0f0'
        }

}


// Add legend to map
function addLegend() {

    // create a new Leaflet control object, and position it top left
    const legendControl = L.control({ position: 'topleft' });

    // when the legend is added to the map
    legendControl.onAdd = function() {

        // select a div element with an id attribute of legend
        const legend = L.DomUtil.get('legend');

        // disable scroll and click/touch on map when on legend
        L.DomEvent.disableScrollPropagation(legend);
        L.DomEvent.disableClickPropagation(legend);

        // return the selection to the method
        return legend;

    };

    // add the empty legend div to the map
    legendControl.addTo(map);

    const legend = $('#legend').html(`<h5>BCG Value</h5>`);
    legend.append(
        `<span style="background:#225ea8"></span>
      <label>1 to 2 (Low Stress)</label><br>`);
    legend.append(
        `<span style="background:#41b6c4"></span>
      <label>3 to 4 (Moderate Stress)</label><br>`);
    legend.append(
        `<span style="background:#a1dab4"></span>
      <label>5 to 6 (High Stress)</label><br>`);
    legend.append(
        `<span style="background:#f0f0f0"></span>
      <label>No data for selected taxa</label><br>`);
}


function addUi(sites) {
    // create the select control
    var selectControl = L.control({ position: "topright" });

    // when control is added
    selectControl.onAdd = function() {
        // get the element with id attribute of ui-controls
        return L.DomUtil.get("ui");
    };
    // add the control to the map
    selectControl.addTo(map);

    $('input:radio[name=BCG]').change(function() {
        // change event for currently selected value
        attributeValue = this.value;

        updateMap(sites);
    });

}



