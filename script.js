
mapboxgl.accessToken = 'pk.eyJ1IjoidGxkdWhhbWVsIiwiYSI6ImNrcjVwdmd5MjM3dW4yem1mbTFoYjQ0a3YifQ.RT0qAXc6rt56N58X1wBE5g';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [175.598355, -36.739488],
    zoom: 16
});

const linzBasemap = {
    'type': 'raster',
    'tiles': [
    'https://basemaps.linz.govt.nz/v1/tiles/aerial/EPSG:3857/{z}/{x}/{y}.webp?api=c01ffbgpbsc3mjjw48jm3c7chhe'
    ]
};

// Wait until the map has finished loading.
map.on('load', () => {

    //Add LINZ Aerial Basemap
    map.addSource('linz-basemap-source', linzBasemap);
    map.addLayer(
        {
        'id': 'linz-basemap-layer',
        'type': 'raster',
        'source': 'linz-basemap-source',
        'paint': {}
        }
        // ,
        // 'aeroway-line' // Adds a street overlay over the 
    );

    // Add contours
    map.addSource('contours', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-terrain-v2'
        });
    map.addLayer({
        'id': 'contours',
        'type': 'line',
        'source': 'contours',
        'source-layer': 'contour',
        'layout': {
        // Make the layer visible by default.
        'visibility': 'visible',
        'line-join': 'round',
        'line-cap': 'round'
        },
        'paint': {
        'line-color': '#877b59',
        'line-width': 1
        }
    });

    // Add 3D DEM

    map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
        });
        // add the DEM source as a terrain layer
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1 });
        
        // add a sky layer that will show when the map is highly pitched
        map.addLayer({
            'id': 'sky',
            'type': 'sky',
            'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
        }
    });
});

// After the last frame rendered before the map enters an "idle" state.
map.on('idle', () => {
    // If these two layers were not added to the map, abort
    if (!map.getLayer('contours') || !map.getLayer('linz-basemap-layer')) {
        return;
    }
     
    // Enumerate ids of the layers.
    const toggleableLayerIds = ['contours', 'linz-basemap-layer'];
     
    // Set up the corresponding toggle button for each layer.
    for (const id of toggleableLayerIds) {
        // Skip layers that already have a button set up.
        if (document.getElementById(id)) {
            continue;
        }
        
        // Create a link.
        const link = document.createElement('a');
        link.id = id;
        link.href = '#';
        link.textContent = id;
        link.className = 'active';
        
        // Show or hide layer when the toggle is clicked.
        link.onclick = function (e) {
            const clickedLayer = this.textContent;
            e.preventDefault();
            e.stopPropagation();
            
            const visibility = map.getLayoutProperty(
                clickedLayer,
                'visibility'
                );
            
            // Toggle layer visibility by changing the layout object's visibility property.
            if (visibility === 'visible') {
                map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                this.className = '';
            } else {
                this.className = 'active';
                map.setLayoutProperty(
                clickedLayer,
                'visibility',
                'visible'
                );
            }
        };
        
        const layers = document.getElementById('menu');
        layers.appendChild(link);
    }
});