import Navbar from "@components/Navbar/Navbar";
import type { NextPage } from "next";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import Info from "@components/Info/Info";
import Footer from "@components/Footer/Footer";
// import "bootstrap/dist/js/bootstrap";
const Home: NextPage = () => {
  return (
    <>


      <Navbar path="home" />

      <div className={styles.container}>
        <main >
          <div className={styles.main}>
            <div className={styles.hello}>
              <h1>Hi! I'm Suki Ho</h1>
              <h2>A Frontend Developer</h2>
              <h3>based in Taipei</h3>
            </div>
            {/* <div className={styles.code}>
              <Image 
                  src="/images/code.png"
                  alt="code"
                  height={100}
                  width={150}
              />
            </div>
            <div className={styles.baseball}>
              <Image 
                  src="/images/baseball.png"
                  alt="code"
                  height={100}
                  width={100}
              />
            </div> */}
            {/* <div className={styles.image}> */}
              {/* <div className={styles.back}></div> */}
              {/* <Image
                src="/images/me.png"
                alt="Hi! I'm Suki Ho"
                height={450}
                width={225}
              /> */}
            {/* </div> */}
          </div>
        <Info />
        </main>

      </div>
      <footer>
        <Footer/>
      </footer>
    </>
  );
};

export default Home;
