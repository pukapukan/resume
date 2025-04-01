import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useSectionStore } from '../lib/stores/useSectionStore';
import 'mapbox-gl/dist/mapbox-gl.css';

import {
  WORK_LOCATIONS,
  MAPBOX_ACCESS_TOKEN,
  INITIAL_VIEW_STATE,
  DEFAULT_MAP_STYLE,
  findLocationByCompany
} from '../lib/mapbox-config';

interface PopupInfo {
  longitude: number;
  latitude: number;
  company: string;
  city: string;
}

// Main MapGlobe component
export default function MapGlobe() {
  const [activeCompany, setActiveCompany] = useState('');
  const [currentExperience, setCurrentExperience] = useState<number | null>(null);
  const { activeSection } = useSectionStore();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{[key: string]: mapboxgl.Marker}>({});
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  
  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Set access token
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: DEFAULT_MAP_STYLE,
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
      projection: { name: 'globe' },
      attributionControl: false,
      interactive: false
    });
    
    map.on('load', () => {
      console.log('MapBox GL loaded successfully');
      
      // Add markers
      WORK_LOCATIONS.forEach(location => {
        // Create marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'w-4 h-4 rounded-full border-2 bg-opacity-40 transition-all duration-300';
        markerEl.style.backgroundColor = location.color;
        markerEl.style.borderColor = location.color;
        
        // Create marker
        const marker = new mapboxgl.Marker({
          element: markerEl
        })
          .setLngLat(location.coordinates)
          .addTo(map);
        
        // Store marker reference
        markersRef.current[location.company] = marker;
      });
    });
    
    // Save map reference
    mapRef.current = map;
    
    // Clean up on unmount
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);
  
  // Monitor the scroll position to determine which experience is currently in view
  useEffect(() => {
    const handleScroll = () => {
      if (activeSection !== 'experience') return;
      
      const experienceItems = document.querySelectorAll('.experience-item');
      if (!experienceItems.length) return;
      
      let currentIndex = null;
      
      experienceItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3) {
          currentIndex = index;
        }
      });
      
      setCurrentExperience(currentIndex);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);
  
  // Update active company when current experience changes
  useEffect(() => {
    if (currentExperience === null || !mapRef.current) return;
    
    const experienceItems = document.querySelectorAll('.experience-item');
    if (!experienceItems.length) return;
    
    const companyElement = experienceItems[currentExperience].querySelector('.company-name');
    if (companyElement) {
      const company = companyElement.textContent || '';
      
      // Find the matching location
      const location = findLocationByCompany(company);
      
      // Reset all markers to default state
      Object.keys(markersRef.current).forEach(key => {
        const markerEl = markersRef.current[key].getElement();
        markerEl.className = 'w-4 h-4 rounded-full border-2 bg-opacity-40 transition-all duration-300';
        markerEl.style.backgroundColor = WORK_LOCATIONS.find(loc => loc.company === key)?.color || '#ccc';
        markerEl.style.borderColor = WORK_LOCATIONS.find(loc => loc.company === key)?.color || '#ccc';
        markerEl.style.boxShadow = 'none';
        markerEl.style.transform = 'scale(1)';
      });
      
      // Remove existing popup
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
      
      if (location) {
        setActiveCompany(location.company);
        
        // Highlight active marker
        const activeMarker = markersRef.current[location.company];
        if (activeMarker) {
          const markerEl = activeMarker.getElement();
          markerEl.className = 'w-6 h-6 rounded-full border-2 bg-opacity-70 transition-all duration-300';
          markerEl.style.borderColor = '#ffffff';
          markerEl.style.boxShadow = `0 0 12px ${location.color}`;
          markerEl.style.transform = 'scale(1.5)';
        }
        
        // Add popup
        const popup = new mapboxgl.Popup({
          closeButton: false,
          className: 'map-popup',
          maxWidth: '200px',
          anchor: 'top'
        })
          .setLngLat(location.coordinates)
          .setHTML(`<div class="p-2">
                      <h3 class="font-bold text-sm">${location.company}</h3>
                      <p class="text-xs">${location.city}</p>
                    </div>`)
          .addTo(mapRef.current);
        
        popupRef.current = popup;
        
        // Fly to location
        mapRef.current.flyTo({
          center: location.coordinates,
          zoom: 3,
          duration: 2000,
          essential: true
        });
      } else {
        setActiveCompany('');
      }
    }
  }, [currentExperience]);
  
  return (
    <div className={`fixed inset-0 z-0 transition-opacity duration-1000 pointer-events-none ${
      activeSection === 'experience' ? 'opacity-60' : 'opacity-0'
    }`}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}