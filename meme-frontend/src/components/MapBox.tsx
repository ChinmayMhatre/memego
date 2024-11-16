/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Threebox } from "threebox-plugin";
import "mapbox-gl/dist/mapbox-gl.css";
import { calculateDistance } from "../utils/calculateDistance";
import React from "react";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    tb: any; // Using any for Threebox since it doesn't have proper TypeScript definitions
  }
}

const coinsLocation = [
  { latitude: 13.72422723058762, longitude: 100.5697524465102 },
  { latitude: 13.72468766448428, longitude: 100.56903491809813 },
  { latitude: 13.72458532725041, longitude: 100.56852505583701 },
  { latitude: 13.724641925017927, longitude: 100.56824539763845 },
  { latitude: 13.724853056318187, longitude: 100.56899776075737 },
  { latitude: 13.724616395890703, longitude: 100.56975040754529 },
  { latitude: 13.724689722402964, longitude: 100.56893066241489 },
  { latitude: 13.724655859899556, longitude: 100.56836950156654 },
  { latitude: 13.72431484938172, longitude: 100.56875286942949 },
  { latitude: 13.725334647038743, longitude: 100.56882652931839 },
];

const MapBox: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userModelRef = useRef<any>(null);
  const locationWatchId = useRef<number | null>(null);
  const navigate = useNavigate();

  const [nearestCoin, setNearestCoin] = useState<{
    distance: number;
    index: number;
  } | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const checkNearestCoin = (latitude: number, longitude: number) => {
    let minDistance = 10;
    let nearestIndex = -1;

    coinsLocation.forEach((coin, index) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        coin.latitude,
        coin.longitude
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    setNearestCoin({
      distance: minDistance,
      index: nearestIndex,
    });
  };

  const requestPermission1 = () => {
    if (
      window.DeviceOrientationEvent &&
      typeof window.DeviceOrientationEvent.requestPermission === "function"
    ) {
      window.DeviceOrientationEvent.requestPermission()
        .then((permissionState: any) => {
          if (permissionState === "granted") {
            window.addEventListener("deviceorientation", handleDeviceMotion);
          }
        })
        .catch(console.error);
    } else {
      // Handle regular non iOS 13+ devices
      window.addEventListener("deviceorientation", handleDeviceMotion);
    }
  };

  const handleDeviceMotion = (event: any) => {
    const tiltLR = event.gamma;
    const tiltFB = event.beta;

    // Update map bearing and pitch
    mapRef.current?.setBearing(tiltLR);
    mapRef.current?.setPitch(tiltFB);
  };

  const requestPermission2 = () => {
    if (typeof DeviceMotionEvent?.requestPermission === "function") {
      DeviceMotionEvent.requestPermission()
        .then((permissionState: any) => {
          if (permissionState === "granted") {
            window.addEventListener("devicemotion", () => {});
          }
        })
        .catch(console.error);
    } else {
      // handle devices that don't need permission and those without a gyroscope
      window.addEventListener("devicemotion", () => {});
    }
  };

  useEffect(() => {
    requestPermission1();
    requestPermission2();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2FqamFkMjE5OTAiLCJhIjoiY20zajd1aGVzMDBzajJrcXp4czR0d21vayJ9.RKqt54M4uBEVCkmk2ir3PA";

    const initializeMap = (coords: { longitude: number; latitude: number }) => {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: "mapbox://styles/mapbox/light-v11",
        center: [coords.longitude, coords.latitude],
        zoom: 18,
        pitch: 64.9,
        bearing: 172.5,
        antialias: true,
      });

      mapRef.current.on("style.load", () => {
        if (!mapRef.current) return;

        // Add the Threebox layer
        const tbLayer: any = {
          id: "threebox-layer",
          type: "custom",
          renderingMode: "3d",
          onAdd: (map: mapboxgl.Map, gl: WebGLRenderingContext) => {
            window.tb = new Threebox(map, gl, { defaultLights: true });

            // Load the user's 3D model
            const scale = 14; // Adjust the scale of the model
            const options = {
              obj: "/assets/scene.gltf", // Replace with your car or human model
              type: "gltf",
              scale: { x: scale, y: scale, z: scale },
              units: "meters",
              rotation: { x: 90, y: -90, z: 0 },
            };

            window.tb.loadObj(options, (model: any) => {
              model.setCoords([coords.longitude, coords.latitude]);
              model.setRotation({ x: 0, y: 0, z: 241 }); // Default rotation
              window.tb.add(model);
              userModelRef.current = model;
            });

            // coinsLocation.forEach((location, index) => {
            //   const scale = 10;
            //   const options = {
            //     obj: "/assets/coin.glb", // Replace with a 3D coin model URL
            //     type: "gltf",
            //     scale: { x: scale, y: scale, z: scale },
            //     units: "meters",
            //   };

            //   window.tb.loadObj(options, (model: any) => {
            //     model.setCoords([location.longitude, location.latitude]);
            //     model.setRotation({ x: 90, y: 0, z: index * 45 }); // Rotate each coin for variety
            //     model.userData = { id: `coin-${index}`, location };

            //     window.tb.add(model);
            //     model.addEventListener("click", () => {
            //       console.log(`Coin ${index + 1} clicked at`, location);
            //       alert(`You clicked on coin ${index + 1}!`);
            //     });
            //   });
            // });

            coinsLocation.forEach((location, index) => {
              const el = document.createElement("div");
              const width = 40; // Customize marker size
              const height = 40;
              el.className = "marker";
              el.style.backgroundImage = `url(https://picsum.photos/seed/coin-${index}/40/40)`; // Replace with your coin icon URL
              el.style.width = `${width}px`;
              el.style.height = `${height}px`;
              el.style.backgroundSize = "100%";
              el.style.border = "none";
              el.style.borderRadius = "50%";
              el.style.cursor = "pointer";

              el.addEventListener("click", () => {
                console.log(`Coin ${index + 1} clicked at`, location);
                alert(`You clicked on coin ${index + 1}!`);
              });

              new mapboxgl.Marker(el)
                .setLngLat([location.longitude, location.latitude])
                .addTo(mapRef.current);
            });
          },
          render: () => {
            window.tb.update();
          },
        };

        mapRef.current.addLayer(tbLayer);

        // random coins layer

        // Watch for user's movement
        navigator.geolocation.watchPosition(
          (position) => {
            const { longitude, latitude, heading } = position.coords;
            setCurrentPosition({ latitude, longitude });
            checkNearestCoin(latitude, longitude);
            // Update model position
            if (userModelRef.current) {
              userModelRef.current.setCoords([longitude, latitude]);

              // Update rotation if heading is available
              if (heading !== null) {
                userModelRef.current.setRotation({ x: 0, y: 0, z: -heading });
              }
            }

            // Center the map on the new position
            mapRef.current?.flyTo({
              center: [longitude, latitude],
              speed: 0.5,
            });
          },
          (error) => {
            console.warn("Error watching position:", error);
          },
          { enableHighAccuracy: true }
        );
      });
    };

    // Initialize with the current or default location
    const timeoutDuration = 5000; // 5 seconds timeout
    let locationTimeout: ReturnType<typeof setTimeout>;

    if ("geolocation" in navigator) {
      locationTimeout = setTimeout(() => {
        console.log("Geolocation timed out, using default location");
        initializeMap({ longitude: 100.5018, latitude: 13.7563 }); // Default Bangkok location
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
          initializeMap({ longitude: 100.5018, latitude: 13.7563 });
        },
        { timeout: timeoutDuration }
      );
    } else {
      console.log("Geolocation not supported, using default location");
      initializeMap({ longitude: 100.5018, latitude: 13.7563 });
    }

    return () => {
      clearTimeout(locationTimeout);
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const handleCollectCoin = () => {
    if (nearestCoin) {
      const coin = coinsLocation[nearestCoin.index];
      console.log({ coin, nearestCoin });
      navigate("/ar", {
        state: {
          coin: {
            index: nearestCoin.index,
            latitude: coin.latitude,
            longitude: coin.longitude,
          },
          userPosition: currentPosition,
          distance: nearestCoin.distance,
        },
      });
    }
  };

  return (
    <div style={{ width: "100%", height: "100vh" }} ref={mapContainerRef}>
      {nearestCoin?.index !== -1 && (
        <button
          onClick={handleCollectCoin}
          style={{
            position: "fixed",
            bottom: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            padding: "10px 20px",
            backgroundColor: "black",
            color: "white",
            borderRadius: "10px",
            fontSize: "16px",
          }}
        >
          Collect Coin
        </button>
      )}
    </div>
  );
};

export default MapBox;
