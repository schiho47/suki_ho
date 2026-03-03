'use client';

import { useEffect, useRef, useState } from 'react';
import { Collapse } from 'bootstrap';
import styles from './Navbar.module.scss';
import Link from 'next/link';
import Image from 'next/image';
interface NavbarProp {
  path: string;
}

const Navbar: React.FC<NavbarProp> = ({ path }) => {
  const [showDropDown, setShowDropDown] = useState({ display: 'none' });
  const [isOpen, setIsOpen] = useState(false);
  const collapseRef = useRef<HTMLDivElement>(null);
  const collapseInstance = useRef<Collapse | null>(null);

  const toggleLanguage = () => {
    setShowDropDown((prev) =>
      prev.display === 'block' ? { display: 'none' } : { display: 'block' }
    );
  };

  useEffect(() => {
    if (!collapseRef.current) return;
    collapseInstance.current = new Collapse(collapseRef.current, {
      toggle: false,
    });
    return () => {
      collapseInstance.current?.dispose();
      collapseInstance.current = null;
    };
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    collapseInstance.current?.toggle();
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
        <Link href='/' className='navbar-brand text-primary-color'>
        <Image src='/images/logo.png' alt='logo' width={80} height={80} />
          Suki Ho
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          aria-controls='navbarNavAltMarkup'
          aria-expanded={isOpen}
          aria-label='Toggle navigation'
          onClick={handleToggle}
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div
          className={`collapse navbar-collapse ${styles.menu}`}
          id='navbarNavAltMarkup'
          data-bs-parent='.navbar'
          ref={collapseRef}
        >
          <ul className='navbar-nav container-fluid'>
            {content.map((item) => {
              return (
                <li className='nav-item' key={item.path}>
                  <Link
                    href={item.href}
                    className={`nav-link ${
                      path === item.path ? styles.active : styles.inactive
                    }`}
                    aria-current='page'
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
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
