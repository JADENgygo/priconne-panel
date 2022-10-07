import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import '../styles/globals.scss';
import type { AppProps } from 'next/app'
import Head from "next/head"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="content">
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>プリコネパネル</title>
      </Head>
      <Component {...pageProps} />
      <footer>
        <div className="text-center pt-3 pb-3" >
          <div>
            <a href="https://twitter.com/@JADENgygo" className="me-3" >
              <i className="bi bi-twitter"></i>
            </a>
            <a href="https://priconne-portfolio.vercel.app" className="link" >
              闇プリン開発室
            </a>
          </div>
          <div>画像 &copy; Cygames, Inc.</div>
        </div>
      </footer>
    </div>
  )
}

export default MyApp
