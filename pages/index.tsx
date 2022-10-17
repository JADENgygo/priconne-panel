import type { NextPage } from 'next'
import { useRef, useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { parseCookies, setCookie } from "nookies";
import { GetServerSideProps } from "next";

const Home: NextPage = () => {
  const router = useRouter();
  const [faced, setFaced] = useState(true);
  const [image, setImage] = useState((null as unknown) as HTMLImageElement);
  const [theme, setTheme] = useState<"" | "light" | "dark">("");

  useEffect(() => {
    const img = document.createElement('img')
    img.src = "/panel_all_transparent.webp";
    setImage(img);
  }, []);

  useEffect(() => {
    const cookie = parseCookies();
    setTheme(cookie.theme === "dark" ? "dark" : "light");
  }, []);

  const changeTheme = () => {
    const cookie = parseCookies();
    setCookie(null, "theme", cookie.theme === "dark" ? "light" : "dark", {
      maxAge: 60 * 60 * 24 * 30 * 12 * 1,
      path: "/"
    });
    router.reload();
  };

  const [cameraStream, setCameraStream] = useState((null as unknown) as MediaStream);
  const changeCamera = () => {
    if (cameraStream !== null) {
      cameraStream.getVideoTracks().forEach(e => e.stop());
    }
    setFaced(!faced);
  }

  const callback = (streamWidth: number, streamHeight: number) => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    let width: number;
    let height: number;
    switch (window.orientation) { // pcはundefined
      case 0:
      case 180:
        width = streamHeight;
        height = streamWidth;
        break;
      default:
        width = streamWidth;
        height = streamHeight;
        break;
    }
    const video = document.getElementById('video') as HTMLVideoElement;
    if (!video) {
      return;
    }
    if (faced) {
      context.scale(-1, 1);
      context.translate(-canvas.width, 0);
    }
    context.drawImage(video, canvas.width / 2 - width / 2, canvas.height / 2 - height / 2);

    if (faced) {
      context.scale(-1, 1);
      context.translate(-canvas.width, 0);
    }
    context.drawImage(image, 0, 0);
  };

  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const video = document.getElementById('video') as HTMLVideoElement;
    if (!video) {
      return;
    }

    let intervalId: number;
    const config = { video: { width: 728, height: 639, facingMode: faced ? "user" : {exact: 'environment'} }, audio: false };
    navigator.mediaDevices.getUserMedia(config).then(stream => {
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      if (!canvas) {
        return;
      }

      video.srcObject = stream;
      setCameraStream(_ => stream);
      const streamWidth = stream.getVideoTracks()[0].getSettings().width;
      const streamHeight = stream.getVideoTracks()[0].getSettings().height;
      if (!streamWidth || !streamHeight) {
        return;
      }
      intervalId = window.setInterval(() => callbackRef.current(streamWidth, streamHeight), 33);
    }).catch(err => console.log('error: ' + err));
    return () => clearInterval(intervalId);
  }, [faced]);

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
    <div className="container pt-1">
      <div className={`text-end mb-3 ${theme === "" ? "invisible" : "visible"}`}>
        <span className="link" onClick={changeTheme}>ダークモード: { theme === "light" ? "オフ" : "オン" }</span>
      </div>
      <div className="text-center">
        <p className="fs-1">プリコネパネル</p>
        <p>カメラの使用を許可すると顔出しパネルで画像を作成できます</p>
        <p>元ネタ: <a className="link" href="https://cystore.com/products/4573478717023">エリザベスパークの特大顔出しパネル</a></p>
        <canvas id="canvas" width={728} height={639} />
        <div>
          <video id="video" width={1} height={1} playsInline autoPlay muted loop style={{"transform": faced ? "scaleX(1)" : "scaleX(1)"}} />
        </div>
        <div className="mb-3">
          <button onClick={changeCamera} className="btn btn-primary me-3">カメラ切替</button>
          <button onClick={saveImage} className="btn btn-primary">画像を保存</button>
        </div>
        <div className="alert alert-info keep" role="alert">
          保存ボタンが動作しない場合は、画像部分を直接保存してください
        </div>
      </div>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  return { props: {}};
}
