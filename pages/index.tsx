import type { NextPage } from 'next'
import { useState, useEffect } from 'react';

const Home: NextPage = () => {
  const [faced, setFaced] = useState(true);
  let cameraStream: MediaStream | null = null;
  const changeCamera = () => {
    if (cameraStream !== null) {
      cameraStream.getVideoTracks().forEach(e => e.stop());
    }
    setFaced(!faced);
  }
  useEffect(() => {
    const video = document.getElementById('video') as HTMLVideoElement;
    if (!video) {
      return;
    }
    const config = { video: { facingMode: faced ? "user" : {exact: 'environment'} }, audio: false };
    navigator.mediaDevices.getUserMedia(config).then(stream => {
      video.srcObject = stream;
      cameraStream = stream;

      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      if (!canvas) {
        return;
      }
      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }

      const img = document.createElement('img');
      img.src = "/panel.png";

      setInterval(() => {
        // if (faced) {
        //   context.scale(-1, 1);
        //   context.translate(-canvas.width, 0);
        // }

        context.drawImage(video, 0, 0);

        // if (faced) {
        //   context.scale(-1, 1);
        //   context.translate(-canvas.width, 0);
        // }

        //context.drawImage(img, 0, 0);
      }, 33);
    }).catch(err => console.log('error: ' + err));
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
          <video id="video" width={1} height={1} playsInline autoPlay muted loop style={{"transform": faced ? "scaleX(-1)" : "scaleX(1)"}} />
        </div>
        <div className="mb-3">
          <button onClick={changeCamera} className="btn btn-dark me-3">カメラ切替</button>
          <button onClick={saveImage} className="btn btn-dark">画像を保存</button>
        </div>
        <div className="alert alert-info" role="alert">
          保存ボタンが動作しない場合は、画像部分を直接保存してください
        </div>
      </div>
    </div>
  )
}

export default Home
