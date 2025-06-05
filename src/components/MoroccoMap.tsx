import React, { useEffect, useState, useRef } from 'react';
import { stades } from '@/data/stades';
import { hotels } from '@/data/hotels';
import { restaurants } from '@/data/restaurants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
//import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent } from '@/components/ui/card';
import { Hotel, Utensils, MapPin } from 'lucide-react';

type PlaceType = 'hotels' | 'restaurants';
type PlaceData = typeof hotels[0] | typeof restaurants[0];

const MoroccoMap: React.FC = () => {
  const [selectedStade, setSelectedStade] = useState<string>('');
  const [selectedPlaceType, setSelectedPlaceType] = useState<PlaceType | ''>('');
  const [selectedPlace, setSelectedPlace] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  //const { t } = useLanguage();
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const placeMarker = useRef<any>(null);
  const stadeInfoRef = useRef<HTMLDivElement>(null);

  const initialCenter: [number, number] = [-7.0926, 31.7917];
  const initialZoom = 5.5;
  const mapboxToken = 'pk.eyJ1IjoibWFyb3Vhbml0bzIwMDYiLCJhIjoiY204ZW55eDZ5MDNsNzJpc2IzdXB1OGJxZiJ9.7TriYqaCTzdWNS7GDwK8Mg';

  const compareIds = (id1: string | number, id2: string | number): boolean => {
    return String(id1) === String(id2);
  };

  useEffect(() => {
    let isMounted = true;
    
    const initMap = async () => {
      try {
        const mapboxgl = (window as any).mapboxgl;
        if (!mapboxgl) return;
        
        if (map.current) return;
        
        if (!mapContainer.current) return;

        mapboxgl.accessToken = mapboxToken;
        
        const mapInstance = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: initialCenter,
          zoom: initialZoom,
          maxBounds: [
            [-17, 21],
            [3, 37]
          ]
        });

        mapInstance.on('load', () => {
          if (!isMounted) return;
          
          const newMarkers: any[] = [];
          
          stades.forEach(stade => {
            // Création d'un élément conteneur pour le marqueur du stade
            const markerElement = document.createElement('div');
            markerElement.className = 'stadium-marker-container';
            
            // Création de l'icône principale
            const iconElement = document.createElement('div');
            iconElement.className = 'stadium-marker';
            
            // Effet d'animation en anneau
            const pulseElement = document.createElement('div');
            pulseElement.className = 'stadium-marker-pulse';
            
            markerElement.appendChild(pulseElement);
            markerElement.appendChild(iconElement);
            
            const popup = new mapboxgl.Popup({ 
              offset: 25, 
              closeButton: false,
              className: 'stadium-popup'
            }).setHTML(`
              <div class="stadium-popup-content">
                <div class="stadium-popup-image" style="background-image: url(${stade.image})"></div>
                <h3 class="stadium-popup-title">${stade.nom}</h3>
                <p class="stadium-popup-subtitle">${stade.ville}</p>
                <p class="stadium-popup-info">${stade.capacite.toLocaleString()} ${('spectateurs')}</p>
                <div class="stadium-popup-button">Voir détails</div>
              </div>
            `);
            
            const marker = new mapboxgl.Marker({
              element: markerElement,
              anchor: 'center'
            })
            .setLngLat([stade.coordonnees.lng, stade.coordonnees.lat])
            .setPopup(popup)
            .addTo(mapInstance);
            
            markerElement.addEventListener('click', () => {
              setSelectedStade(stade.id);
              setSelectedPlaceType('');
              setSelectedPlace('');
              if (placeMarker.current) {
                placeMarker.current.remove();
                placeMarker.current = null;
              }
              
              mapInstance.flyTo({
                center: [stade.coordonnees.lng, stade.coordonnees.lat],
                zoom: 15,
                duration: 1000,
                essential: true
              });
            });
            
            newMarkers.push(marker);
          });
          
          // Add map controls with custom styling
          mapInstance.addControl(new mapboxgl.NavigationControl({
            showCompass: true,
            visualizePitch: true
          }), 'bottom-right');
          
          if (isMounted) {
            map.current = mapInstance;
            markers.current = newMarkers;
            setMapLoaded(true);
          }
        });
      } catch (error) {
        console.error("Erreur lors de l'initialisation de la carte:", error);
      }
    };

    if (!(window as any).mapboxgl) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
      document.head.appendChild(link);
      
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
    
    return () => {
      isMounted = false;
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [navigate, mapboxToken]);

  const handleStadeSelection = (stadeId: string) => {
    setSelectedStade(stadeId);
    setSelectedPlaceType('');
    setSelectedPlace('');
    
    if (stadeId && map.current) {
      const stade = stades.find(s => s.id === stadeId);
      
      if (stade) {
        if (placeMarker.current) {
          placeMarker.current.remove();
          placeMarker.current = null;
        }
        
        map.current.flyTo({
          center: [stade.coordonnees.lng, stade.coordonnees.lat],
          zoom: 15,
          duration: 1000,
          essential: true
        });
        
        const marker = markers.current.find(
          (m: any) => {
            const lngLat = m.getLngLat();
            return lngLat.lng === stade.coordonnees.lng && lngLat.lat === stade.coordonnees.lat;
          }
        );
        
        if (marker) {
          setTimeout(() => {
            marker.togglePopup();
          }, 1000);
        }
      }
    }
  };

  const handlePlaceTypeSelection = (type: PlaceType) => {
    setSelectedPlaceType(type);
    setSelectedPlace('');
    
    if (placeMarker.current) {
      placeMarker.current.remove();
      placeMarker.current = null;
    }
  };

  const handlePlaceSelection = (placeId: string) => {
    setSelectedPlace(placeId);
    
    if (!map.current) return;
    
    const stade = stades.find(s => s.id === selectedStade);
    if (!stade) return;
    
    let selectedPlaceData: any = null;
    
    if (selectedPlaceType === 'hotels') {
      selectedPlaceData = hotels.find(h => compareIds(h.id, placeId));
    } else if (selectedPlaceType === 'restaurants') {
      selectedPlaceData = restaurants.find(r => compareIds(r.id, placeId));
    }
    
    if (!selectedPlaceData) return;
    
    const placeCoords = getRandomCoordinatesNearby(stade.coordonnees, 0.005);
    
    if (placeMarker.current) {
      placeMarker.current.remove();
    }
    
    // Création d'un élément conteneur pour le marqueur de lieu
    const markerElement = document.createElement('div');
    markerElement.className = 'place-marker-container';
    
    // Création de l'icône principale
    const iconElement = document.createElement('div');
    iconElement.className = `place-marker ${selectedPlaceType === 'hotels' ? 'hotel-marker' : 'restaurant-marker'}`;
    
    // Icône à l'intérieur du marqueur
    const iconInnerElement = document.createElement('div');
    iconInnerElement.className = 'place-marker-icon';
    iconInnerElement.innerHTML = selectedPlaceType === 'hotels' 
      ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v11m0-11a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11m0-7H3m18 7H3m18 0a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16ZM7 16v-3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3"></path></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11v3m0-3V6c0-1.105.891-2 1.996-2H5c1.105 0 2 .895 2 2v5m-4 0h4m14-3v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4m16-4a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v1h10v-1Z"></path></svg>';
    
    iconElement.appendChild(iconInnerElement);
    
    // Effet d'animation en anneau
    const pulseElement = document.createElement('div');
    pulseElement.className = `place-marker-pulse ${selectedPlaceType === 'hotels' ? 'hotel-pulse' : 'restaurant-pulse'}`;
    
    markerElement.appendChild(pulseElement);
    markerElement.appendChild(iconElement);
    
    const placePopup = new (window as any).mapboxgl.Popup({ 
      offset: 25,
      closeButton: false,
      className: 'place-popup'
    }).setHTML(`
      <div class="place-popup-content">
        <div class="place-popup-image" style="background-image: url(${selectedPlaceData.image})"></div>
        <h3 class="place-popup-title">${selectedPlaceData.nom}</h3>
        ${selectedPlaceType === 'hotels' ? 
          `<div class="place-popup-stars">${"★".repeat(selectedPlaceData.etoiles)}</div>` : 
          `<p class="place-popup-cuisine">${selectedPlaceData.cuisine}</p>`}
        <p class="place-popup-distance">
          <span class="place-popup-label">Distance:</span> ${selectedPlaceData.distance} du stade
        </p>
        <div class="place-popup-button">Voir détails</div>
      </div>
    `);
    
    placeMarker.current = new (window as any).mapboxgl.Marker({
      element: markerElement,
      anchor: 'bottom'
    })
      .setLngLat(placeCoords)
      .setPopup(placePopup)
      .addTo(map.current);
    
    // Auto-open the popup
    placeMarker.current.togglePopup();
    
    // Zoom to show both the stadium and the place
    const bounds = new (window as any).mapboxgl.LngLatBounds()
      .extend([stade.coordonnees.lng, stade.coordonnees.lat])
      .extend(placeCoords);
    
    map.current.fitBounds(bounds, {
      padding: 120,
      maxZoom: 16,
      duration: 1000
    });
  };

  const getRandomCoordinatesNearby = (
    center: { lat: number; lng: number }, 
    maxDistance: number
  ): [number, number] => {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * maxDistance;
    
    const lat = center.lat + distance * Math.sin(angle);
    const lng = center.lng + distance * Math.cos(angle);
    
    return [lng, lat];
  };

  const getPlacesForSelectedStade = (placeType: PlaceType) => {
    if (!selectedStade) return [];
    
    switch (placeType) {
      case 'hotels':
        return hotels.filter(hotel => hotel.stadeId === selectedStade);
      case 'restaurants':
        return restaurants.filter(restaurant => restaurant.stadeId === selectedStade);
      default:
        return [];
    }
  };

  const selectedStadeInfo = stades.find(s => s.id === selectedStade);
  const currentPlaces = selectedPlaceType ? getPlacesForSelectedStade(selectedPlaceType) : [];

  return (
    <div className="relative">
      {/* Controls section with improved design and z-index */}
      <div className="z-50 flex flex-wrap gap-2 p-4 border border-gray-200 shadow-xl top-4 left-4 right-4 backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 rounded-xl dark:border-gray-700">
        <div className="flex flex-wrap flex-1 gap-3">
          <Select value={selectedStade} onValueChange={handleStadeSelection}>
            <SelectTrigger className="w-full bg-white border-gray-300 shadow-sm md:w-64 dark:bg-gray-800 dark:border-gray-600">
              <SelectValue placeholder={('Sélectionner un stade')} />
            </SelectTrigger>
            <SelectContent className="z-50 bg-white dark:bg-gray-800">
              {stades.map(stade => (
                <SelectItem key={stade.id} value={stade.id}>
                  {stade.nom} - {stade.ville}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedStade && (
            <Select value={selectedPlaceType} onValueChange={(value) => handlePlaceTypeSelection(value as PlaceType)}>
              <SelectTrigger className="w-full bg-white border-gray-300 shadow-sm md:w-48 dark:bg-gray-800 dark:border-gray-600">
                <SelectValue placeholder={('Type de lieu')} />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white dark:bg-gray-800">
                <SelectItem value="hotels">
                  <div className="flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-indigo-500" />
                    <span>{('Hôtels')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="restaurants">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-red-500" />
                    <span>{('Restaurants')}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          )}
          
          {selectedStade && selectedPlaceType && (
            <Select value={selectedPlace} onValueChange={handlePlaceSelection}>
              <SelectTrigger className="w-full bg-white border-gray-300 shadow-sm md:w-64 dark:bg-gray-800 dark:border-gray-600">
                <SelectValue placeholder={`Choisir ${
                  selectedPlaceType === 'hotels' ? 'un hôtel' : 'un restaurant'}`}
                />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white dark:bg-gray-800">
                {currentPlaces.map((place: any) => (
                  <SelectItem key={place.id} value={place.id}>
                    {place.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 mt-20 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div 
            ref={mapContainer} 
            className="w-full h-[450px] rounded-xl overflow-hidden shadow-xl"
            style={{ 
              border: '3px solid rgba(0, 0, 0, 0.1)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          />
        </div>
        
        <div className="lg:col-span-1" ref={stadeInfoRef}>
          {selectedStadeInfo ? (
            <Card className="h-full overflow-hidden transition-all duration-300 bg-white border-0 shadow-lg hover:shadow-xl dark:bg-gray-800">
              <CardContent className="p-0">
                <div className="relative overflow-hidden aspect-video">
                  <img 
                    src={selectedStadeInfo.image}
                    alt={selectedStadeInfo.nom}
                    className="object-cover w-full h-full transition-all duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute text-white bottom-4 left-4 right-4">
                    <h2 className="mb-1 text-2xl font-bold">{selectedStadeInfo.nom}</h2>
                    <div className="flex items-center text-sm text-gray-200">
                      <MapPin size={14} className="mr-1" />
                      <span>{selectedStadeInfo.ville}</span>
                    </div>
                  </div>
                  <div className="absolute px-3 py-1 text-xs font-bold rounded-full shadow-md top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                    <div className="flex items-center space-x-1">
                      <span>{selectedStadeInfo.capacite.toLocaleString()} spectateurs</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    {selectedStadeInfo.description}
                  </p>
                  
                  {selectedPlace && (
                    <div className="p-4 mt-4 border border-gray-100 shadow-inner bg-gray-50 dark:bg-gray-800/90 rounded-xl dark:border-gray-700">
                      <h4 className="flex items-center mb-2 font-medium">
                        {selectedPlaceType === 'hotels' && (
                          <div className="flex items-center">
                            <div className="flex items-center justify-center w-6 h-6 mr-2 bg-indigo-500 rounded-full shadow-sm">
                              <Hotel size={14} className="text-white" />
                            </div>
                            <span>Hôtel sélectionné</span>
                          </div>
                        )}
                        {selectedPlaceType === 'restaurants' && (
                          <div className="flex items-center">
                            <div className="flex items-center justify-center w-6 h-6 mr-2 bg-red-500 rounded-full shadow-sm">
                              <Utensils size={14} className="text-white" />
                            </div>
                            <span>Restaurant sélectionné</span>
                          </div>
                        )}
                      </h4>
                      
                      {currentPlaces.filter(p => compareIds(p.id, selectedPlace)).map((place: any) => (
                        <div key={place.id} className="mt-2">
                          <div className="text-base font-semibold">{place.nom}</div>
                          {selectedPlaceType === 'hotels' && (
                            <div className="flex flex-col gap-1 mt-2">
                              <div className="flex items-center">
                                <span className="mr-2 text-amber-400">{"★".repeat(place.etoiles)}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-300">({place.etoiles} étoiles)</span>
                              </div>
                              <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300">
                                <MapPin size={14} className="mr-1" />
                                <span>{place.distance} du stade</span>
                              </div>
                              {place.prix && (
                                <div className="mt-1 text-sm">
                                  <span className="font-medium">Prix moyen:</span> {place.prix}
                                </div>
                              )}
                            </div>
                          )}
                          {selectedPlaceType === 'restaurants' && (
                            <div className="flex flex-col gap-1 mt-2">
                              <div className="text-sm py-0.5 px-2 bg-gray-100 dark:bg-gray-700 rounded-full w-fit">
                                {place.cuisine}
                              </div>
                              <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300">
                                <MapPin size={14} className="mr-1" />
                                <span>{place.distance} du stade</span>
                              </div>
                              {place.prixMoyen && (
                                <div className="mt-1 text-sm">
                                  <span className="font-medium">Prix moyen:</span> {place.prixMoyen}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full p-6 text-center border border-gray-100 shadow-lg bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl dark:border-gray-700">
              <div>
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full bg-red-500/20 dark:bg-red-600/20 animate-ping"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-red-500 dark:text-red-400" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-medium text-gray-800 dark:text-gray-200">
                  Sélectionnez un stade
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  Découvrez les stades de la CAN 2025 et explorez les hôtels et restaurants à proximité.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        /* Styles améliorés pour les popups */
        .mapboxgl-popup-content {
          padding: 0;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(8px);
          max-width: 300px;
        }
        
        .dark .mapboxgl-popup-content {
          background-color: rgba(31, 41, 55, 0.95);
          color: white;
          border: 1px solid rgba(255,255,255,0.1);
        }
        
        .mapboxgl-popup {
          z-index: 30 !important;
        }

        .mapboxgl-popup-close-button {
          font-size: 16px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          background: rgba(0,0,0,0.3);
          border-radius: 50%;
          margin: 8px;
          z-index: 1;
        }
        
        .dark .mapboxgl-popup-close-button {
          background: rgba(255,255,255,0.2);
        }
        
        .mapboxgl-popup-close-button:hover {
          background: rgba(0,0,0,0.5);
          color: white;
        }

        /* Styles pour les marqueurs de stade */
        .stadium-marker-container {
          position: relative;
          width: 40px;
          height: 40px;
          cursor: pointer;
        }
        
        .stadium-marker {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 32px;
          height: 32px;
          background-color: #035C28;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          border: 3px solid white;
          z-index: 2;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
        }
        
        .stadium-marker::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          background-image: url('/images/stadium-icon.png');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        
        .stadium-marker-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background-color: rgba(3, 92, 40, 0.4);
          border-radius: 50%;
          z-index: 1;
          animation: stadiumPulse 3s infinite;
        }
        
        @keyframes stadiumPulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          70% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
          }
        }
        
        .stadium-marker:hover {
          transform: translate(-50%, -50%) scale(1.2);
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }
        
        /* Styles pour les popups de stade */
        .stadium-popup .mapboxgl-popup-content {
          padding: 0;
          width: 250px;
        }
        
        .stadium-popup-content {
          display: flex;
          flex-direction: column;
        }
        
        .stadium-popup-image {
          height: 120px;
          background-size: cover;
          background-position: center;
          position: relative;
        }
        
        .stadium-popup-image::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%);
        }
        
        .stadium-popup-title {
          font-size: 16px;
          font-weight: 600;
          padding: 12px 15px 4px;
          color: #111827;
        }
        
        .dark .stadium-popup-title {
          color: #f3f4f6;
        }
        
        .stadium-popup-subtitle {
          font-size: 14px;
          color: #4b5563;
          padding: 0 15px;
        }
        
        .dark .stadium-popup-subtitle {
          color: #9ca3af;
        }
        
        .stadium-popup-info {
          font-size: 13px;
          padding: 4px 15px 12px;
          color: #4b5563;
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        
        .dark .stadium-popup-info {
          color: #9ca3af;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .stadium-popup-button {
          font-size: 14px;
          font-weight: 500;
          padding: 10px 15px;
          color: #035C28;
          text-align: center;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .dark .stadium-popup-button {
          color: #10b981;
        }
        
        .stadium-popup-button:hover {
          background-color: rgba(3, 92, 40, 0.1);
        }
        
        .dark .stadium-popup-button:hover {
          background-color: rgba(16, 185, 129, 0.1);
        }
        
        /* Styles pour les marqueurs de lieux */
        .place-marker-container {
          position: relative;
          width: 40px;
          height: 40px;
          cursor: pointer;
        }
        
        .place-marker {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          border: 3px solid white;
          z-index: 2;
          color: white;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hotel-marker {
          background-color: #6366F1;
        }
        
        .restaurant-marker {
          background-color: #EF4444;
        }
        
        .place-marker-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .place-marker-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          border-radius: 50%;
          z-index: 1;
          animation: placePulse 2s infinite;
        }
        
        .hotel-pulse {
          background-color: rgba(99, 102, 241, 0.4);
        }
        
        .restaurant-pulse {
          background-color: rgba(239, 68, 68, 0.4);
        }
        
        @keyframes placePulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          70% {
            transform: translate(-50%, -50%) scale(1.8);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
          }
        }
        
        .place-marker:hover {
          transform: translate(-50%, -50%) scale(1.2);
        }
        
        /* Styles pour les popups de lieux */
        .place-popup .mapboxgl-popup-content {
          padding: 0;
          width: 250px;
        }
        
        .place-popup-content {
          display: flex;
          flex-direction: column;
        }
        
        .place-popup-image {
          height: 120px;
          background-size: cover;
          background-position: center;
          position: relative;
        }
        
        .place-popup-image::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%);
        }
        
        .place-popup-title {
          font-size: 16px;
          font-weight: 600;
          padding: 12px 15px 4px;
          color: #111827;
        }
        
        .dark .place-popup-title {
          color: #f3f4f6;
        }
        
        .place-popup-stars {
          font-size: 14px;
          color: #F59E0B;
          padding: 0 15px 4px;
        }
        
        .place-popup-cuisine {
          font-size: 14px;
          color: #4b5563;
          padding: 0 15px 4px;
        }
        
        .dark .place-popup-cuisine {
          color: #9ca3af;
        }
        
        .place-popup-distance {
          font-size: 13px;
          padding: 4px 15px 12px;
          color: #4b5563;
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        
        .dark .place-popup-distance {
          color: #9ca3af;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .place-popup-label {
          font-weight: 500;
        }
        
        .place-popup-button {
          font-size: 14px;
          font-weight: 500;
          padding: 10px 15px;
          color: #6366F1;
          text-align: center;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .restaurant-marker + .mapboxgl-popup .place-popup-button {
          color: #EF4444;
        }
        
        .dark .place-popup-button {
          color: #818cf8;
        }
        
        .dark .restaurant-marker + .mapboxgl-popup .place-popup-button {
          color: #f87171;
        }
        
        .place-popup-button:hover {
          background-color: rgba(99, 102, 241, 0.1);
        }
        
        .restaurant-marker + .mapboxgl-popup .place-popup-button:hover {
          background-color: rgba(239, 68, 68, 0.1);
        }
        
        .dark .place-popup-button:hover {
          background-color: rgba(129, 140, 248, 0.1);
        }
        
        .dark .restaurant-marker + .mapboxgl-popup .place-popup-button:hover {
          background-color: rgba(248, 113, 113, 0.1);
        }
        
        /* Contrôles de la carte */
        .mapboxgl-ctrl-group {
          border-radius: 8px !important;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
        }
        
        .mapboxgl-ctrl button {
          width: 36px !important;
          height: 36px !important;
        }
        
        .mapboxgl-ctrl-zoom-in,
        .mapboxgl-ctrl-zoom-out,
        .mapboxgl-ctrl-compass {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        .custom-popup .mapboxgl-popup-content {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MoroccoMap;
