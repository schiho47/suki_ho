import React, { useState } from 'react';
import styles from './Navbar.module.scss';
import Link from 'next/link';
interface NavbarProp {
  path: string;
}

const Navbar: React.FC<NavbarProp> = ({ path }) => {
  const [showDropDown, setShowDropDown] = useState({ display: 'none' });

  const toggleLanguage = () => {
    setShowDropDown((prev) =>
      prev.display === 'block' ? { display: 'none' } : { display: 'block' }
    );
  };

  const content = [
    { path: 'home', name: 'Home', href: '/' },
    { path: 'projects', name: 'Projects', href: '/projects' },
    { path: 'blogs', name: 'Blogs', href: '/blogs' },
    // { path: "hobbies", name: "Hobbies", href: "/hobbies" },
  ];

  return (
    <nav
      className={`navbar navbar-expand-lg  position-fixed top-0 start-0  z-3  ${styles.container}`}
    >
      <div className='container-fluid'>
        <Link href='/'>
          <a className='navbar-brand text-white'>Suki Ho</a>
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNavAltMarkup'
          aria-controls='navbarNavAltMarkup'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarNavAltMarkup'>
          <div className='navbar-nav'>
            {content.map((item) => {
              return (
                <Link href={item.href}>
                  <a
                    className={`nav-link ${
                      path === item.path ? styles.active : null
                    }`}
                    aria-current='page'
                    style={{ color: 'white' }}
                  >
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
        {/* <div className={`${styles.dropdown}`}>
          <i className="bi bi-translate" onClick={toggleLanguage} />
          <ul style={showDropDown}>
            <li>中文</li>
            <li>English</li>
          </ul>
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;
