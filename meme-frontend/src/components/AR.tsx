/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unescaped-entities */
import React, { useRef, useState } from "react";
import { Entity, Scene } from "aframe-react";
import { useLocation } from "react-router-dom";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "../../firebase";

const AR = () => {
  const { coin, userPosition, distance } = useLocation();
  const [clicking, setClicking] = useState<boolean>(false);

  const [clickedImage, setClickedImage] = useState({
    visible: false,
    url: null,
  });
  const [uploading, setUploading] = useState<boolean>(false);

  console.log({ coin, userPosition, distance });

  const arContainerRef = useRef(null);

  const resizeCanvas = (origCanvas, width, height) => {
    let resizedCanvas = document.createElement("canvas");
    let resizedContext = resizedCanvas.getContext("2d");

    resizedCanvas.height = height;
    resizedCanvas.width = width;

    resizedContext.drawImage(origCanvas, 0, 0, width, height);
    return resizedCanvas.toDataURL();
  };

  const captureVideoFrame = (video, format, width, height) => {
    if (typeof video === "string") {
      const videoList = document.querySelectorAll("video");
      video = videoList[videoList?.length - 1];
    }

    format = format || "jpeg";

    if (!video || (format !== "png" && format !== "jpeg")) {
      return false;
    }

    var canvas = document.createElement("CANVAS");

    canvas.width = width || video.videoWidth;
    canvas.height = height || video.videoHeight;

    canvas.getContext("2d").drawImage(video, 0, 0);
    var dataUri = canvas.toDataURL("image/" + format);
    var data = dataUri.split(",")[1];
    var mimeType = dataUri.split(";")[0].slice(5);

    var bytes = window.atob(data);
    var buf = new ArrayBuffer(bytes.length);
    var arr = new Uint8Array(buf);

    for (var i = 0; i < bytes.length; i++) {
      arr[i] = bytes.charCodeAt(i);
    }

    var blob = new Blob([arr], { type: mimeType });
    return {
      blob: blob,
      dataUri: dataUri,
      format: format,
      width: canvas.width,
      height: canvas.height,
    };
  };

  const captureImage = async () => {
    try {
      const videoList = document.querySelectorAll("video");
      const video = videoList[videoList?.length - 1];
      video?.pause();

      let aScene = document
        .querySelector("a-scene")
        .components.screenshot.getCanvas("perspective");

      let frame = captureVideoFrame("video", "png");

      aScene = resizeCanvas(aScene, frame.width, frame.height);

      frame = frame.dataUri;

      mergeImages([frame, aScene]).then((b64) => {
        setClickedImage({ visible: true, url: b64 });
        setClicking(false);
        console.log({ b64 });
      });

      video?.removeAttribute("src"); // empty source
      video?.load();
      video?.remove();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleRetake = () => {
    setClickedImage({ visible: false, url: null });
  };

  const handleUpload = async () => {
    try {
      setUploading(true);
      const url = `uploads/${coin}.png`;
      const storageRef = ref(storage, url);

      const uploadData = await uploadString(
        storageRef,
        clickedImage.url,
        "data_url"
      );
      const uploadedUrl = await getDownloadURL(uploadData.ref);
      console.log({ uploadedUrl });

      // const payload = {
      //   teamId: teamData?.id,
      //   sessionId: sessionData?.sessionName,
      //   playerName: playerData?.name,
      //   gameType: gameData?.levelType,
      //   score: gameData?.uploadPoints ?? 0,
      //   skipped: false,
      //   uploadUrl: uploadedUrl,
      //   mediaType: "image/png",
      //   gameIndex: gameData?.arIndex,
      //   gameName: gameData?.levelName,
      //   sessionType:
      //     sessionData?.loginScreenData?.sessionType ?? "normal_team_session",
      //   isARGame: true,
      // };

      // const response = await fetch(`${clientUrl}/score`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(payload),
      // });
      // const result = await response.json();

      // if (response.status !== 201) {
      //   throw new Error(result.message);
      // }

      alert("Uploaded Successfully");
      setUploading(false);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#ccc",
        paddingTop: "50px",
      }}
    >
      <div
        className="ar-outer-container"
        ref={arContainerRef}
        style={{ width: "80%", height: "100%", margin: "auto" }}
      >
        <div
          ref={arContainerRef}
          className="ar-container"
          style={{
            border: "2px solid blue",
            width: "100%",
            height: "400px",
            overflow: "hidden",
            position: "relative",
            borderRadius: "15px",
          }}
        >
          {!clickedImage.visible ? (
            <Scene
              vr-mode-ui="enabled: false"
              arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false;"
              embedded
            >
              <Entity primitive="a-assets">
                <img
                  id="logo1"
                  src={
                    "https://cdn-icons-png.flaticon.com/512/4964/4964814.png"
                  }
                  preload="auto"
                  crossOrigin="anonymous"
                />
              </Entity>
              <Entity primitive="a-camera" rotation-reader></Entity>
              <Entity
                primitive="a-image"
                src="#logo1"
                width={10}
                height={10}
                position={`${-2} ${-10} ${-20}`}
                visible={`true`}
              ></Entity>
            </Scene>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <img
                src={clickedImage.url}
                alt="clicked image"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  margin: "auto",
                  // objectFit: "cover",
                }}
              />
            </div>
          )}
        </div>
        <div
          className="ar-button-container"
          style={{
            width: "100%",
            margin: "auto",
            paddingTop: "20px",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {!clickedImage.visible ? (
            <button
              style={{ backgroundColor: "red", padding: "5px 20px" }}
              onClick={captureImage}
            >
              Capture
            </button>
          ) : (
            <>
              <button
                style={{ backgroundColor: "red", padding: "5px 20px" }}
                onClick={handleRetake}
              >
                Discard
              </button>
              <button
                style={{ backgroundColor: "red", padding: "5px 20px" }}
                onClick={handleUpload}
              >
                Get The Coin
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AR;
