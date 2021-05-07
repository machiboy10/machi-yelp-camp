

mapboxgl.accessToken = mapToken;
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v10', // style URLhttps://docs.mapbox.com/api/maps/styles/
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

new mapboxgl.Marker({color: '#FF0000'})
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({
            offset: 25,
            
            
        })
        .setHTML(
            `<h3 style="color: #0000ff ">${campground.title}</h3><p>${campground.location}</p>`
        )
    )
    .addTo(map)