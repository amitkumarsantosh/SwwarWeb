function initMap() {
    const location = {
        lat: 25.620605,
        lng: 85.139475
    };

    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: location
    });

    new google.maps.Marker({
        position: location,
        map: map
    });
}

window.onload = initMap;
