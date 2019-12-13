let map;
let markers = [];

function initMap(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiMnRvYXN0aWU0dSIsImEiOiJjazM5NDduNXowMDJjM25yMGRiYWNiMG1uIn0.4zDYD_eRMXHsQyfN0ohSzQ';
        let map = new mapboxgl.Map({
        container: 'mapElement',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 2,
        center: [-99.9981, 40.3544]
        // center: [-42.46826171875, -16.951799392700195]
         
    });
}

function addMarkers(results){
    for(let poi of results)
    {
        markers.push(createThreatMarker(poi));
    }
}

function removeAllMarkers(){
    markers.forEach(m => m.remove());
    markers = [];
}

function createThreatMarker(poi){
    // make a marker for each feature and add to the map
    return new mapboxgl.Marker()
    .setLngLat([poi.longitude, poi.latitude])
    .addTo(map);
}

export {initMap, addMarkers, removeAllMarkers};