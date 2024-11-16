/* eslint-disable */
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Threebox } from "threebox-plugin";
import "mapbox-gl/dist/mapbox-gl.css";

// Declare the tb property on window
declare global {
  interface Window {
    tb: any; // Using any for Threebox since it doesn't have proper TypeScript definitions
  }
}

// Type for the custom layer
interface CustomLayer extends mapboxgl.CustomLayerInterface {
  onAdd: (map: mapboxgl.Map, gl: WebGLRenderingContext) => void;
  render: () => void;
}

const MapBox: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default Bangkok coordinates
    const defaultLocation = {
      longitude: 100.5018,
      latitude: 13.7563,
    };

    // Define nearby locations for coins
    const coinLocations = [
      { longitude: 100.5689, latitude: 13.7251 },
      { longitude: 100.5702, latitude: 13.7244 },
      { longitude: 100.5698, latitude: 13.7239 },
      { longitude: 100.5675, latitude: 13.7246 },
      { longitude: 100.5683, latitude: 13.7254 },
    ];

    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2FqamFkMjE5OTAiLCJhIjoiY20zajd1aGVzMDBzajJrcXp4czR0d21vayJ9.RKqt54M4uBEVCkmk2ir3PA";

    // Initialize map with location
    const initializeMap = (coords: { longitude: number; latitude: number }) => {
      console.log({ coords });
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: "mapbox://styles/mapbox/light-v11",
        center: [coords.longitude, coords.latitude],
        // center: [defaultLocation.longitude, defaultLocation.latitude],
        zoom: 15.4,
        pitch: 64.9,
        bearing: 172.5,
        antialias: true,
      });

      // Add a marker
      new mapboxgl.Marker()
        .setLngLat([coords.longitude, coords.latitude])
        .addTo(mapRef.current);

      //   Continue with existing style.load setup
      mapRef.current.on("style.load", () => {
        if (!mapRef.current) return;

        const customLayer: CustomLayer = {
          id: "custom-threebox-model",
          type: "custom",
          renderingMode: "3d",

          onAdd: function (map: mapboxgl.Map, gl: WebGLRenderingContext) {
            window.tb = new Threebox(map, gl, { defaultLights: true });

            // Add coin models to each location
            coinLocations.forEach((location, index) => {
              const scale = 10;
              const options = {
                obj: "/assets/coin.glb", // Replace with a 3D coin model URL
                type: "gltf",
                scale: { x: scale, y: scale, z: scale },
                units: "meters",
              };

              window.tb.loadObj(options, (model: any) => {
                model.setCoords([location.longitude, location.latitude]);
                model.setRotation({ x: 90, y: 0, z: index * 45 }); // Rotate each coin for variety
                model.userData = { id: `coin-${index}`, location };

                window.tb.add(model);
                model.addEventListener("click", () => {
                  console.log(`Coin ${index + 1} clicked at`, location);
                  alert(`You clicked on coin ${index + 1}!`);
                });
              });
            });
          },

          render: function () {
            window.tb.update();
          },
        };

        // Handle map click to detect model clicks
        mapRef.current?.on("click", (event: mapboxgl.MapMouseEvent) => {
          if (!window.tb || !window.tb.objects) return;

          // Convert screen coordinates to Three.js coordinates
          const mouse = new window.tb.THREE.Vector2(
            (event.point.x / mapContainerRef.current!.offsetWidth) * 2 - 1,
            -(event.point.y / mapContainerRef.current!.offsetHeight) * 2 + 1
          );

          const raycaster = new window.tb.THREE.Raycaster();
          raycaster.setFromCamera(mouse, window.tb.camera);

          // Perform raycasting on all Threebox objects
          const intersects = raycaster.intersectObjects(
            window.tb.scene.children,
            true
          );
          if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            if (clickedObject.userData) {
              console.log("Clicked object:", clickedObject.userData);
              alert(`You clicked on ${clickedObject.userData.id}`);
            } else {
              console.log("Object clicked but no user data.");
            }
          } else {
            console.log("No objects intersected.");
          }
        });

        mapRef.current.addLayer(customLayer);
      });
    };

    // Try to get current location with a timeout
    const timeoutDuration = 5000; // 5 seconds timeout
    let locationTimeout: ReturnType<typeof setTimeout>;

    if ("geolocation" in navigator) {
      locationTimeout = setTimeout(() => {
        console.log("Geolocation timed out, using default location");
        initializeMap(defaultLocation);
      }, timeoutDuration);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(locationTimeout);
          initializeMap({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });
        },
        (error) => {
          clearTimeout(locationTimeout);
          console.warn("Geolocation error:", error);
          initializeMap(defaultLocation);
        },
        { timeout: timeoutDuration }
      );
    } else {
      console.log("Geolocation not supported, using default location");
      initializeMap(defaultLocation);
    }

    // Cleanup function
    return () => {
      clearTimeout(locationTimeout);
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <div
      style={{ width: "100%", height: "100%", border: "2px solid red" }}
      ref={mapContainerRef}
    />
  );
};

export default MapBox;
