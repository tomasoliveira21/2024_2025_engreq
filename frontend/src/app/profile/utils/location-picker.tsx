import React, { useState } from 'react';
import { LoadScript, GoogleMap, Marker, StandaloneSearchBox } from '@react-google-maps/api';

interface Location {
    id?: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
}

interface LocationPickerProps {
    onLocationSelect: (location: Location) => void;
    initialLocation?: Location;
}

const libraries: ["places"] = ["places"];
const mapContainerStyle = {
    width: '100%',
    height: '400px'
};

const defaultCenter = {
    lat: 40.416775, // Default to Madrid, Spain
    lng: -3.703790
};

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
    const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
    const [marker, setMarker] = useState(initialLocation ? {
        lat: initialLocation.latitude,
        lng: initialLocation.longitude
    } : defaultCenter);

    const handlePlacesChanged = () => {
        if (searchBox) {
            const places = searchBox.getPlaces();
            if (places && places.length > 0) {
                const place = places[0];
                const location = place.geometry?.location;

                if (location) {
                    setMarker({
                        lat: location.lat(),
                        lng: location.lng()
                    });

                    // Get address components
                    let streetNumber = '', route = '', city = '', country = '', postalCode = '';
                    place.address_components?.forEach(component => {
                        const types = component.types;
                        if (types.includes('street_number')) {
                            streetNumber = component.long_name;
                        } else if (types.includes('route')) {
                            route = component.long_name;
                        } else if (types.includes('locality')) {
                            city = component.long_name;
                        } else if (types.includes('country')) {
                            country = component.long_name;
                        } else if (types.includes('postal_code')) {
                            postalCode = component.long_name;
                        }
                    });

                    const newLocation: Location = {
                        address: `${streetNumber} ${route}`.trim(),
                        city,
                        country,
                        postalCode,
                        latitude: location.lat(),
                        longitude: location.lng(),
                    };

                    onLocationSelect(newLocation);
                }
            }
        }
    };

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        const lat = event.latLng?.lat();
        const lng = event.latLng?.lng();

        if (lat && lng) {
            setMarker({ lat, lng });

            // Reverse geocode the coordinates
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode(
                { location: { lat, lng } },
                (results, status) => {
                    if (status === 'OK' && results?.[0]) {
                        const place = results[0];

                        let streetNumber = '', route = '', city = '', country = '', postalCode = '';
                        place.address_components?.forEach(component => {
                            const types = component.types;
                            if (types.includes('street_number')) {
                                streetNumber = component.long_name;
                            } else if (types.includes('route')) {
                                route = component.long_name;
                            } else if (types.includes('locality')) {
                                city = component.long_name;
                            } else if (types.includes('country')) {
                                country = component.long_name;
                            } else if (types.includes('postal_code')) {
                                postalCode = component.long_name;
                            }
                        });

                        const newLocation: Location = {
                            address: `${streetNumber} ${route}`.trim(),
                            city,
                            country,
                            postalCode,
                            latitude: lat,
                            longitude: lng,
                        };

                        onLocationSelect(newLocation);
                    }
                }
            );
        }
    };

    return (
        <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            libraries={libraries}
        >
            <div className="space-y-4">
                <StandaloneSearchBox
                    onLoad={ref => setSearchBox(ref)}
                    onPlacesChanged={handlePlacesChanged}
                >
                    <input
                        type="text"
                        placeholder="Search for a location"
                        className="w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700"
                    />
                </StandaloneSearchBox>

                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={13}
                    center={marker}
                    onClick={handleMapClick}
                    options={{
                        styles: [{ elementType: "geometry", stylers: [{ color: "#242f3e" }] }],
                        streetViewControl: false,
                    }}
                >
                    <Marker position={marker} />
                </GoogleMap>
            </div>
        </LoadScript>
    );
}