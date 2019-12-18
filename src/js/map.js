let map;
let markers = [];

function initMap(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiMnRvYXN0aWU0dSIsImEiOiJjazM5NDduNXowMDJjM25yMGRiYWNiMG1uIn0.4zDYD_eRMXHsQyfN0ohSzQ';
        map = new mapboxgl.Map({
        container: 'mapElement',
        style: 'mapbox://styles/2toastie4u/ck44idp8610kw1cqo7plhmi0r',
        zoom: 3,
        center: [-99.9981, 40.3544]         
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
    .addTo(map)
}

function showCountry(country)
{
    
}

export {initMap, addMarkers, removeAllMarkers};