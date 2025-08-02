import '../styles/globals.css'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import '../components/App.css'
import 'bootstrap/dist/css/bootstrap.min.css';  
import 'bootstrap-icons/font/bootstrap-icons.css';




export default function App({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  )
}

