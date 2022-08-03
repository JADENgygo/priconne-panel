import type { NextPage } from 'next'
import { useRef, useState, useEffect } from 'react';

const Home: NextPage = () => {
  const [faced, setFaced] = useState(true);

  const [image, setImage] = useState((null as unknown) as HTMLImageElement);
  useEffect(() => {
    const img = document.createElement('img')
    img.src = "/panel.png";
    setImage(img);
  }, []);

  const [cameraStream, setCameraStream] = useState((null as unknown) as MediaStream);
  const changeCamera = () => {
    if (cameraStream !== null) {
      cameraStream.getVideoTracks().forEach(e => e.stop());
    }
    setFaced(!faced);
  }

  const callback = (streamWidth: number, streamHeight: number) => {
    const video = document.getElementById('video') as HTMLVideoElement;
    if (!video) {
      return;
    }
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    // const img = document.createElement('img');
    // img.src = "/panel.png";

    if (faced) {
      context.scale(-1, 1);
      context.translate(-canvas.width, 0);
    }
    context.drawImage(video, canvas.width / 2 - streamWidth / 2, canvas.height / 2 - streamHeight / 2);

    if (faced) {
      context.scale(-1, 1);
      context.translate(-canvas.width, 0);
    }
    // context.drawImage(image, 0, 0);
  };

  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);


  // debug
  const [t, sett] = useState(0);

  useEffect(() => {
    const video = document.getElementById('video') as HTMLVideoElement;
    if (!video) {
      return;
    }

    let intervalId: number;
    const config = { video: { facingMode: faced ? "user" : {exact: 'environment'} }, audio: false };
    navigator.mediaDevices.getUserMedia(config).then(stream => {
      console.log("tracks: " + stream.getVideoTracks().length)
      sett(stream.getVideoTracks().length)

      video.srcObject = stream;
      setCameraStream(_ => stream);
      const streamWidth = stream.getVideoTracks()[0].getSettings().width;
      const streamHeight = stream.getVideoTracks()[0].getSettings().height;
      if (!streamWidth) {
        return;
      }
      if (!streamHeight) {
        return;
      }
      intervalId = window.setInterval(() => callbackRef.current(streamWidth, streamHeight), 33);
    }).catch(err => console.log('error: ' + err));
    return () => clearInterval(intervalId);
  }, [faced]);

  const width = 727;
  const height = 637;

  const saveImage = () => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) {
      return;
    }
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png', 1);
    a.download = 'panel.png';
    a.click();
  };

  return (
    <div className="container pt-3">
      <div className="text-center">
        <p className="fs-1">プリコネパネル</p>
        <p>カメラの使用を許可すると顔出しパネルで画像を作成できます</p>
        <p>元ネタ: <a href="https://cystore.com/products/4573478717023">エリザベスパークの特大顔出しパネル</a></p>
        <canvas id="canvas" width={width} height={height} />
        <div>
          <video id="video" width={1} height={1} playsInline autoPlay muted loop style={{"transform": faced ? "scaleX(1)" : "scaleX(1)"}} />
        </div>
        <div className="mb-3">
          <button onClick={changeCamera} className="btn btn-dark me-3">カメラ切替</button>
          <button onClick={saveImage} className="btn btn-dark">画像を保存</button>
        </div>
        <div>{t}</div>
        <div className="alert alert-info" role="alert">
          保存ボタンが動作しない場合は、画像部分を直接保存してください
        </div>
      </div>
    </div>
  )
}

export default Home
