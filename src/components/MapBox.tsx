/* eslint-disable */
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Threebox } from "threebox-plugin";
import "mapbox-gl/dist/mapbox-gl.css";

declare global {
  interface Window {
    tb: any; // Using any for Threebox since it doesn't have proper TypeScript definitions
  }
}

const coinsLocation = [
  { latitude: 13.7260001, longitude: 100.5590001 },
  { latitude: 13.7235005, longitude: 100.5575003 },
  { latitude: 13.7253008, longitude: 100.5568006 },
  { latitude: 13.7240002, longitude: 100.5602009 },
  { latitude: 13.7238009, longitude: 100.5586004 },
];

const MapBox: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userModelRef = useRef<any>(null);
  const locationWatchId = useRef<number | null>(null);

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

    if (navigator.geolocation) {
      locationWatchId.current = navigator.geolocation.watchPosition(function (
        position
      ) {
        console.log({ position });
      });
    }

    return () => {
      const { geolocation } = navigator;

      if (locationWatchId?.current && geolocation) {
        geolocation.clearWatch(locationWatchId.current);
      }

      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <div
      style={{ width: "100%", height: "100vh", border: "2px solid red" }}
      ref={mapContainerRef}
    />
  );
};

export default MapBox;
