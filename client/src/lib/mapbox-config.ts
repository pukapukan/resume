// MapBox configuration

interface LocationMarker {
  city: string;
  coordinates: [number, number]; // [longitude, latitude]
  color: string;
  company: string;
}

// Define the work experience locations with coordinates
export const WORK_LOCATIONS: LocationMarker[] = [
  { 
    city: 'Seattle',
    coordinates: [-122.3321, 47.6062], 
    color: '#FF9900', // Amazon orange
    company: 'Amazon'
  },
  { 
    city: 'San Francisco',
    coordinates: [-122.4194, 37.7749], 
    color: '#635BFF', // Stripe purple
    company: 'Stripe'
  },
  { 
    city: 'New York',
    coordinates: [-74.0060, 40.7128], 
    color: '#4285F4', // Blue
    company: 'Fintech Startup'
  },
  { 
    city: 'Seoul',
    coordinates: [126.9780, 37.5665], 
    color: '#34A853', // Green
    company: 'Freelance'
  },
  { 
    city: 'Singapore',
    coordinates: [103.8198, 1.3521], 
    color: '#EA4335', // Red
    company: 'LateRooms.com'
  },
  { 
    city: 'London',
    coordinates: [-0.1278, 51.5074], 
    color: '#FF9900', // Amazon orange
    company: 'Amazon'
  }
];

// MapBox styles
export const MAP_STYLES = {
  dark: 'mapbox://styles/mapbox/dark-v11',
  light: 'mapbox://styles/mapbox/light-v11',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  navigation: 'mapbox://styles/mapbox/navigation-night-v1'
};

export const DEFAULT_MAP_STYLE = MAP_STYLES.dark;

// Initial map view state
export const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 30,
  zoom: 1.5,
  bearing: 0,
  pitch: 0
};

// Hard-coded MapBox access token for demo purposes
export const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoianNwYXJrMDAiLCJhIjoiY2x1ZXUzNGppMDV2djJrcGJzOW9saHpsaCJ9.Z5JXgqZNzGrQUGJMLkXM_w';

// Find a location by company name
export function findLocationByCompany(companyName: string): LocationMarker | undefined {
  return WORK_LOCATIONS.find(loc => 
    companyName.includes(loc.company) || loc.company.includes(companyName)
  );
}