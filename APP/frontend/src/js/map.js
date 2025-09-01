/**
 * Google Maps Integration for Barbershop Dashboard
 * Location: Barranquilla, Colombia
 * File: js/map.js
 */

// Global variables
let map;
let markers = [];
let userLocationMarker;
let placesService;
let infoWindows = [];

// Barranquilla, Colombia coordinates and bounds
const BARRANQUILLA_CENTER = { lat: 10.9639, lng: -74.7964 };
const BARRANQUILLA_BOUNDS = {
  north: 11.1500,
  south: 10.7500,
  east: -74.6000,
  west: -75.0000
};

/**
 * Initialize Google Maps
 * Called by Google Maps API callback
 */
function initMap() {
  try {
    // Hide loading indicator
    document.getElementById('mapLoading').classList.add('hidden');
    
    // Create map centered in Barranquilla
    map = new google.maps.Map(document.getElementById("googleMap"), {
      zoom: 12,
      center: BARRANQUILLA_CENTER,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      restriction: {
        latLngBounds: BARRANQUILLA_BOUNDS,
        strictBounds: false
      },
      styles: [
        {
          featureType: "poi.business",
          stylers: [{ visibility: "on" }]
        },
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "simplified" }]
        }
      ]
    });

    // Initialize Places service
    placesService = new google.maps.places.PlacesService(map);

    // Setup search functionality
    setupSearchBox();

    // Add predefined barbershops
    addPredefinedBarbershops();

    // Search for nearby barbershops automatically
    searchNearbyBarbershops();

    // Setup barbershop click listeners
    setupBarbershopClickListeners();

    console.log("Google Maps initialized successfully");
    
  } catch (error) {
    console.error("Error initializing Google Maps:", error);
    document.getElementById('mapLoading').textContent = "Error loading map";
  }
}

/**
 * Setup search box functionality for barbershops
 */
function setupSearchBox() {
  const input = document.getElementById('searchInput');
  
  // Create SearchBox for barbershops in Barranquilla area
  const searchBox = new google.maps.places.SearchBox(input, {
    bounds: new google.maps.LatLngBounds(
      new google.maps.LatLng(BARRANQUILLA_BOUNDS.south, BARRANQUILLA_BOUNDS.west),
      new google.maps.LatLng(BARRANQUILLA_BOUNDS.north, BARRANQUILLA_BOUNDS.east)
    )
  });

  // Bias search results towards Barranquilla
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  // Listen for search changes
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }

    // Clear previous search markers
    clearSearchMarkers();

    // Process each place found
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      // Only show places within Barranquilla bounds
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      
      if (isWithinBarranquillaBounds(lat, lng)) {
        createSearchMarker(place);
        
        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      }
    });
    
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds);
    }
  });
}

/**
 * Check if coordinates are within Barranquilla bounds
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} - True if within bounds
 */
function isWithinBarranquillaBounds(lat, lng) {
  return lat >= BARRANQUILLA_BOUNDS.south && 
         lat <= BARRANQUILLA_BOUNDS.north && 
         lng >= BARRANQUILLA_BOUNDS.west && 
         lng <= BARRANQUILLA_BOUNDS.east;
}

/**
 * Create marker for search results
 * @param {google.maps.places.PlaceResult} place - Place object from search
 */
function createSearchMarker(place) {
  const marker = new google.maps.Marker({
    map: map,
    title: place.name,
    position: place.geometry.location,
    icon: {
      url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
      scaledSize: new google.maps.Size(32, 32)
    }
  });

  const infoWindow = new google.maps.InfoWindow({
    content: createInfoWindowContent(place.name, place.formatted_address, place.rating, 'search')
  });

  marker.addListener('click', () => {
    closeAllInfoWindows();
    infoWindow.open(map, marker);
  });

  markers.push(marker);
  infoWindows.push(infoWindow);
}

/**
 * Add predefined barbershops with Barranquilla coordinates
 */
function addPredefinedBarbershops() {
  const barbershops = [
    { name: "BARBERSHOP NAME", lat: 10.963889, lng: -74.796387 },
    { name: "BARBERSHOP NAME 2", lat: 10.988056, lng: -74.791667 },
    { name: "BARBERSHOP NAME 3", lat: 11.004722, lng: -74.807222 },
    { name: "BARBERSHOP NAME 4", lat: 10.975000, lng: -74.802778 }
  ];

  barbershops.forEach(barbershop => {
    const marker = new google.maps.Marker({
      position: { lat: barbershop.lat, lng: barbershop.lng },
      map: map,
      title: barbershop.name,
      icon: {
        url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        scaledSize: new google.maps.Size(32, 32)
      }
    });

    const infoWindow = new google.maps.InfoWindow({
      content: createInfoWindowContent(barbershop.name, "Registered Barbershop", null, 'predefined')
    });

    marker.addListener('click', () => {
      closeAllInfoWindows();
      infoWindow.open(map, marker);
    });

    infoWindows.push(infoWindow);
  });
}

/**
 * Search for nearby barbershops in Barranquilla area
 */
function searchNearbyBarbershops() {
  const request = {
    location: BARRANQUILLA_CENTER,
    radius: 15000, // 15km radius to cover Barranquilla metropolitan area
    type: ['hair_care'],
    keyword: 'barbershop barber barbería peluquería'
  };

  placesService.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      results.forEach(place => {
        // Filter to only show places within Barranquilla bounds
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        if (isWithinBarranquillaBounds(lat, lng)) {
          createNearbyMarker(place);
        }
      });
      console.log(`Found ${results.length} barbershops in Barranquilla area`);
    } else {
      console.log("Places search failed or no results found:", status);
    }
  });
}

/**
 * Create marker for nearby search results
 * @param {google.maps.places.PlaceResult} place - Place object from nearby search
 */
function createNearbyMarker(place) {
  const marker = new google.maps.Marker({
    position: place.geometry.location,
    map: map,
    title: place.name,
    icon: {
      url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
      scaledSize: new google.maps.Size(24, 24)
    }
  });

  const infoWindow = new google.maps.InfoWindow({
    content: createInfoWindowContent(
      place.name, 
      place.vicinity || 'Address not available',
      place.rating,
      'nearby'
    )
  });

  marker.addListener('click', () => {
    closeAllInfoWindows();
    infoWindow.open(map, marker);
  });

  infoWindows.push(infoWindow);
}

/**
 * Create info window content HTML
 * @param {string} name - Barbershop name
 * @param {string} address - Barbershop address
 * @param {number} rating - Rating (optional)
 * @param {string} type - Marker type (predefined, search, nearby)
 * @returns {string} - HTML content for info window
 */
function createInfoWindowContent(name, address, rating, type) {
  const ratingDisplay = rating ? `${rating} ⭐` : 'No rating available';
  const buttonText = type === 'predefined' ? 'Book Appointment' : 'View Details';
  
  return `
    <div style="max-width: 200px;">
      <h3 style="margin: 0 0 8px 0; color: #333;">${name}</h3>
      <p style="margin: 4px 0; color: #666; font-size: 12px;">${address}</p>
      <p style="margin: 4px 0; color: #666; font-size: 12px;">Rating: ${ratingDisplay}</p>
      <button onclick="handleBarberAction('${name.replace(/'/g, "\\'")}', '${type}')" 
              style="background: #007bff; color: white; border: none; padding: 6px 12px; 
                     border-radius: 4px; cursor: pointer; font-size: 12px; margin-top: 8px;">
        ${buttonText}
      </button>
    </div>
  `;
}

/**
 * Handle barber action (book appointment or view details)
 * @param {string} barbershopName - Name of the barbershop
 * @param {string} type - Type of action (predefined, search, nearby)
 */
function handleBarberAction(barbershopName, type) {
  if (type === 'predefined') {
    bookAppointment(barbershopName);
  } else {
    viewBarbershopDetails(barbershopName);
  }
}

/**
 * Book appointment function - Connect to your FastAPI backend
 * @param {string} barbershopName - Name of the barbershop
 */
function bookAppointment(barbershopName) {
  console.log(`Booking appointment for: ${barbershopName}`);
  alert(`Appointment booking for ${barbershopName} - Connect to your FastAPI backend`);
  
  // TODO: Integrate with your FastAPI backend
  /*
  fetch('/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      barbershop: barbershopName,
      user_id: getCurrentUserId(),
      date: new Date().toISOString()
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Appointment booked successfully!');
    }
  })
  .catch(error => console.error('Error:', error));
  */
}

/**
 * View barbershop details
 * @param {string} barbershopName - Name of the barbershop
 */
function viewBarbershopDetails(barbershopName) {
  console.log(`Viewing details for: ${barbershopName}`);
  alert(`Viewing details for ${barbershopName} - Implement details view`);
}

/**
 * Setup click listeners for barbershop items in left panel
 */
function setupBarbershopClickListeners() {
  const barberItems = document.querySelectorAll('.barber-item');
  
  barberItems.forEach(item => {
    item.addEventListener('click', () => {
      const lat = parseFloat(item.dataset.lat);
      const lng = parseFloat(item.dataset.lng);
      
      if (lat && lng && isWithinBarranquillaBounds(lat, lng)) {
        const location = { lat: lat, lng: lng };
        map.setCenter(location);
        map.setZoom(16);
      }
    });
  });
}

/**
 * Clear all search markers from map
 */
function clearSearchMarkers() {
  markers.forEach(marker => {
    marker.setMap(null);
  });
  markers = [];
}

/**
 * Close all open info windows
 */
function closeAllInfoWindows() {
  infoWindows.forEach(infoWindow => {
    infoWindow.close();
  });
}

/**
 * Handle map loading errors
 */
function handleMapError() {
  console.error("Error loading Google Maps");
  document.getElementById('mapLoading').textContent = "Error loading Google Maps. Please check your internet connection.";
}

/**
 * Event Listeners
 */

// Ensure map loads even if there are issues
window.addEventListener('load', () => {
  // Fallback if initMap doesn't execute within 10 seconds
  setTimeout(() => {
    if (!map) {
      console.warn("Map not initialized, attempting fallback");
      const mapElement = document.getElementById('googleMap');
      if (mapElement && mapElement.offsetHeight === 0) {
        document.getElementById('mapLoading').textContent = "Map loading timeout. Please refresh the page.";
      }
    }
  }, 10000);
});

// Handle page visibility change to refresh map if needed
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && map) {
    // Trigger resize event to refresh map display
    setTimeout(() => {
      google.maps.event.trigger(map, 'resize');
      map.setCenter(BARRANQUILLA_CENTER);
    }, 100);
  }
});

/**
 * Utility Functions for FastAPI Integration
 */

/**
 * Get current user ID (implement based on your authentication system)
 * @returns {string|null} - Current user ID
 */
function getCurrentUserId() {
  // TODO: Implement based on your authentication system
  // Example implementations:
  
  // From localStorage
  // return localStorage.getItem('userId');
  
  // From session storage
  // return sessionStorage.getItem('userId');
  
  // From JWT token
  // const token = localStorage.getItem('authToken');
  // if (token) {
  //   const payload = JSON.parse(atob(token.split('.')[1]));
  //   return payload.user_id;
  // }
  
  // Placeholder return
  return null;
}

/**
 * Make authenticated request to FastAPI backend
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise} - Fetch promise
 */
async function authenticatedFetch(url, options = {}) {
  const token = localStorage.getItem('authToken'); // Adjust based on your auth system
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };
  
  return fetch(url, defaultOptions);
}

/**
 * Example FastAPI integration functions
 */

/**
 * Fetch barbershops from FastAPI backend
 */
async function fetchBarbershopsFromAPI() {
  try {
    const response = await authenticatedFetch('/api/barbershops');
    const data = await response.json();
    
    if (response.ok) {
      return data.barbershops || [];
    } else {
      console.error('Error fetching barbershops:', data.detail);
      return [];
    }
  } catch (error) {
    console.error('Network error fetching barbershops:', error);
    return [];
  }
}

/**
 * Create appointment via FastAPI backend
 * @param {Object} appointmentData - Appointment details
 */
async function createAppointmentAPI(appointmentData) {
  try {
    const response = await authenticatedFetch('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Appointment created successfully:', data);
      return { success: true, data };
    } else {
      console.error('Error creating appointment:', data.detail);
      return { success: false, error: data.detail };
    }
  } catch (error) {
    console.error('Network error creating appointment:', error);
    return { success: false, error: 'Network error' };
  }
}