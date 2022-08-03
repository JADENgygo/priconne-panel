import type { NextPage } from 'next'

const Home: NextPage = () => {
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
        <canvas className="mb-3" id="canvas" width={width} height={height} />
        <div className="mb-3">
          <button onClick={saveImage} className="btn btn-dark">画像を保存</button>
        </div>
        <div className="alert alert-info" role="alert">
          保存ボタンが動作しない場合は、画像部分を直接保存してください
        </div>
      </div>
      <video id="video" width={width} height={height} autoPlay style={{"display": "block", "transform": "scaleX(-1)"}} />
      <script dangerouslySetInnerHTML={{__html: `
        const video = document.getElementById('video');
        const config = { video: true, audio: false };
        navigator.mediaDevices.getUserMedia(config).then(stream => {
          video.srcObject = stream;

          const canvas = document.getElementById('canvas');
          const context = canvas.getContext('2d');

          const img = document.createElement('img');
          img.src = "/panel.png";

          setInterval(() => {
            context.scale(-1, 1);
            context.translate(-canvas.width, 0);

            context.drawImage(video, 0, 0);

            context.scale(-1, 1);
            context.translate(-canvas.width, 0);

            context.drawImage(img, 0, 0);
          }, 33);
        }).catch(err => console.log('error: ' + err));
      `}} />
    </div>

  )
}

export default Home
