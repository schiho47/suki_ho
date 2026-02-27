import Navbar from '@components/Navbar/Navbar';
import styles from '../styles/Home.module.scss';
import Info from '@components/Info/Info';
import Footer from '@components/Footer/Footer';
import HomeHero from '@components/Home/HomeHero';

export default function Home() {
  return (
    <>
      <Navbar path='home' />

      <div className={styles.container}>
        <main>
          <div className={styles.main}>
          <HomeHero />
          </div>
          <Info />
        </main>
      </div>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

