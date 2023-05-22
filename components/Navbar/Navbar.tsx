import React, { useState } from "react";
import styles from './Navbar.module.scss';
interface NavbarProp{
  path:string;
}

const Navbar:React.FC<NavbarProp>=({path})=>{
  const [showDropDown,setShowDropDown]=useState({display:'none'});
  
  const toggleLanguage=()=>{
    setShowDropDown((prev)=>prev.display==="block"?{display:'none'}:{display:'block'})
  };

    return (
      <nav className={`navbar navbar-expand-lg  position-fixed top-0 start-0  z-3  ${styles.container}`}>
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="/">
           Suki Ho
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <a className={`nav-link ${path==="home"?styles.active:null}`} aria-current="page" href="/" style={{color:'white'}}>
                Home
              </a>
              <a className={`nav-link ${path==="projects"?styles.active:null}`} href="/projects"  style={{color:'white'}}>
               Projects
              </a>
              <a className={`nav-link  ${path==="blogs"?styles.active:null}`} href="/blogs" style={{color:'white'}}>
                Blogs
              </a>
            </div>   
            
          </div>
          <div className={`${styles.dropdown}`} >
            <i className="bi bi-translate" onClick={toggleLanguage}/>
              <ul style={showDropDown}>
                <li>中文</li>
                <li>English</li>
                {/* <li>日本語</li> */}
              </ul>
       </div>
       
        </div>
      </nav>
    );
}

export default Navbar;