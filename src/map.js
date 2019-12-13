function initMap(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiMnRvYXN0aWU0dSIsImEiOiJjazM5NDduNXowMDJjM25yMGRiYWNiMG1uIn0.4zDYD_eRMXHsQyfN0ohSzQ';
        let map = new mapboxgl.Map({
        container: 'mapElement',
        style: 'mapbox://styles/mapbox/streets-v11'
    });
}

export {initMap};