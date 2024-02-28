import Navbar from "@components/Navbar/Navbar";
import type { NextPage } from "next";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import Info from "@components/Info/Info";
import Footer from "@components/Footer/Footer";

const Home: NextPage = () => {
  return (
    <>
      <Navbar path="home" />

      <div className={styles.container}>
        <main>
          <div className={styles.main}>
            <div>
              <Image
                src={"/images/me.png"}
                width={350}
                height={600}
                objectFit="fill"
                style={{
                  objectFit: "contain",
                  transform: "rotate3d(1, 1, .5, -5deg)",
                }}
              />
            </div>
            <div className={styles.hello}>
              <h1>Hi! I'm Suki Ho</h1>
              <h2>A Frontend Developer</h2>
              <h3>based in Taipei</h3>
            </div>
          </div>
          <Info />
        </main>
      </div>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default Home;
