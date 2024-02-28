import React from "react";
import Navbar from "@components/Navbar/Navbar";
import Footer from "@components/Footer/Footer";
import MapChart from "@components/MapChart/MapChart";
import styles from "@styles/Hobbies.module.scss";
const Hobbies = () => {
  return (
    <div>
      <Navbar path={"hobbies"} />
      <div className={styles.container}>
        <div>
          <h1>Travel</h1>
          <MapChart />
        </div>
        <div>
          <h1>Baseball</h1>
          {/* <MapChart /> */}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Hobbies;
