/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Entity, Scene } from "aframe-react";

const AR = () => {
  return (
    <div style={{ width: "100%", height: "100%", border: "2px solid blue" }}>
      <Scene
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false;"
        embedded
      >
        <Entity primitive="a-assets">
          <img
            id="logo1"
            src={"https://cdn-icons-png.flaticon.com/512/4964/4964814.png"}
            preload="auto"
            crossOrigin="anonymous"
          />
        </Entity>
        <Entity primitive="a-camera" rotation-reader></Entity>
        <Entity
          primitive="a-image"
          src="#logo1"
          width={20}
          height={20}
          position={`${-2} ${-10} ${-20}`}
          visible={`true`}
        ></Entity>
      </Scene>
    </div>
  );
};

export default AR;
