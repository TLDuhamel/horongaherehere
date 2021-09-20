
mapboxgl.accessToken = 'pk.eyJ1IjoidGxkdWhhbWVsIiwiYSI6ImNrcjVwdmd5MjM3dW4yem1mbTFoYjQ0a3YifQ.RT0qAXc6rt56N58X1wBE5g';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [175.598355, -36.739488],
    zoom: 16,
    pitch: 40
});

var minZoom = 12; // min zoom at which features will be hidden

// Define external tile sevices
const linzAerialBasemap = {
    'type': 'raster',
    'tiles': [
    'https://basemaps.linz.govt.nz/v1/tiles/aerial/EPSG:3857/{z}/{x}/{y}.webp?api=c01ffbgpbsc3mjjw48jm3c7chhe'
    ]
};

const linzTopoBasemap = {
    'type': 'raster',
    'tiles': [
    'http://tiles-a.data-cdn.linz.govt.nz/services;key=780af066229e4b63a8f9408cc13c31e8/tiles/v4/layer=52343/EPSG:3857/{z}/{x}/{y}.png'
    ]
};

const nav = new mapboxgl.NavigationControl({
    visualizePitch: true
});
map.addControl(nav, 'top-left');

// Wait until the map has finished loading.
map.on('load', () => {

    //Add LINZ Aerial Basemap
    map.addSource('linz-basemap-source', linzAerialBasemap);
    map.addLayer(
        {
        'id': 'linz-basemap-layer',
        'type': 'raster',
        'source': 'linz-basemap-source',
        'paint': {}
        }
        // ,
        // 'aeroway-line' // Adds a street overlay over the aerial
    );

    map.addSource('linz-topo-source', linzTopoBasemap);
    map.addLayer(
        {
        'id': 'linz-topo-layer',
        'type': 'raster',
        'source': 'linz-topo-source',
        'paint': {},
        'layout': {
            // Make the layer hidden by default.
            'visibility': 'none'
        },
        }
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
        // Make the layer hidden by default.
        'visibility': 'none',
        'line-join': 'round',
        'line-cap': 'round'
        },
        'paint': {
        'line-color': '#877b59',
        'line-width': 1
        }
    });

    //Add Rivers
    map.addSource('rivers', {
        type: 'geojson',
        // Use a URL for the value for the `data` property.
        data: './geojson/rivers.geojson'
    });
    map.addLayer({
        'id': 'rivers-layer',
        'type': 'line',
        'minzoom': minZoom,
        'source': 'rivers',
        'paint': {
            'line-width': 10,
            'line-color': 'lightblue'
        }
    });
    map.addLayer({ // labels
        'id': 'river-labels',
        'type': 'symbol',
        'minzoom': minZoom,
        'source': 'rivers',
        'paint': {
            'text-color': 'lightblue',
            'text-halo-blur': 2,
            'text-halo-color': '#4a5c52',
            'text-halo-width': 3
        },
        'layout': {
        'symbol-placement': 'line',
        'text-max-angle': 45,
        'text-pitch-alignment': 'map',
        // 'text-offset': [0,-1],
        'text-field': [
            'format',
            ['get', 'name'],
            { 'font-scale': 1.1 }
        ],
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold']
        }
        });

    // Add Data
    //Add Parcels
    map.addSource('parcels', {
        type: 'geojson',
        // Use a URL for the value for the `data` property.
        data: './geojson/parcels.geojson'
    });
    map.addLayer({
        'id': 'parcels-layer',
        'type': 'line',
        'minzoom': minZoom,
        'source': 'parcels',
        'paint': {
            'line-width': 1,
            'line-color': 'red'
        }
    });
    map.addLayer({ // parcel labels
        'id': 'parcel-labels',
        'type': 'symbol',
        'minzoom': minZoom,
        'source': 'parcels',
        'paint': {
            'text-color': 'red'
        },
        'layout': {
        'symbol-placement': 'line',
        'text-max-angle': 38,
        'text-pitch-alignment': 'map',
        'text-offset': [0,0.7],
        'text-field': [
            'format',
            ['get', 'owners'],
            { 'font-scale': 0.5 }
            // ,
            // '\n',
            // {},
            // ['downcase', ['get', 'Description']],
            // { 'font-scale': 0.6 }
        ],
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold']
        }
    });

    //Add Tracks
    map.addSource('tracks', {
        type: 'geojson',
        // Use a URL for the value for the `data` property.
        data: './geojson/tracks.geojson'
    });
    map.addLayer({
        'id': 'tracks-layer',
        'type': 'line',
        'source': 'tracks',
        'minzoom': minZoom,
        'paint': {
            'line-width': 2,
            'line-color': 'yellow',
            'line-dasharray': [2,1]
        }
    });
    map.addLayer({ // labels
        'id': 'track-labels',
        'type': 'symbol',
        'source': 'tracks',
        'minzoom': minZoom,
        'paint': {
            'text-color': 'yellow',
            'text-halo-blur': 2,
            'text-halo-color': '#4a5c52',
            'text-halo-width': 3
        },
        'layout': {
        'symbol-placement': 'line-center',
        'text-max-angle': 38,
        'text-pitch-alignment': 'viewport',
        // 'text-offset': [0,-1],
        'text-field': [
            'format',
            ['get', 'Name'],
            { 'font-scale': 0.8 }
            // ,
            // '\n',
            // {},
            // ['downcase', ['get', 'Description']],
            // { 'font-scale': 0.6 }
        ],
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold']
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

    // Add client-side Hillshade
    map.addLayer(
    {
        'id': 'hillshading',
        'source': 'mapbox-dem',
        'type': 'hillshade'
        }
    );

    //Set distance fog
    // map.setFog({
    //     "range": [1.0, 12.0],
    //     "color": 'white',
    //     "horizon-blend": 0.1
    // });
    
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
    const toggleableLayerIds = ['contours', 'linz-basemap-layer', 'linz-topo-layer'];
     
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