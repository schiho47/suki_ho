'use client';

import Card from '@components/Card/Card';
import Footer from '@components/Footer/Footer';
import Navbar from '@components/Navbar/Navbar';
import styles from '@styles/Projects.module.scss';
import { apiFetcher } from '@lib/apiFetcher';
import useSWR, { useSWRConfig } from 'swr';
import { useEffect, useState } from 'react';

import { ProjectTypes } from 'type/projects';

export default function Projects() {
  const [lang, setLang] = useState<'zh' | 'en' | null>(null);

  const currentLang = lang ?? 'zh';
  const { cache } = useSWRConfig();
  const key = lang ? `/api/projects?lang=${lang}` : null;
  const fallbackData = key ? cache.get(key) : undefined;
  const {
    data: projectData,
    error,
    isLoading,
  } = useSWR(key, apiFetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    fallbackData,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem('lang');
    const nextLang = saved === 'en' || saved === 'zh' ? saved : 'zh';
    setLang(nextLang);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !lang) return;
    window.localStorage.setItem('lang', lang);
  }, [lang]);
  
  return (
    <div>
      <Navbar path={'projects'} />
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h1>Projects</h1>
          {/* <button
            type='button'
            className='btn btn-outline-secondary btn-sm'
            onClick={() =>
              setLang((prev) => (prev === 'zh' ? 'en' : 'zh'))
            }
          >
            {currentLang === 'zh' ? 'EN' : 'TW'}
          </button> */}
        </div>
        <hr />
        {error && <div>failed to load</div>}
        {isLoading && (
          <div className='d-flex justify-content-center py-5'>
            <div className='spinner-border text-primary' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          </div>
        )}
        {projectData && projectData.length > 0 && (
          <div className={styles.projects}>
            {projectData.map((data: ProjectTypes) => {
              return (
                <Card
                  key={data.link}
                  title={data.title}
                  description={data.description}
                  img={data.img}
                  link={data.link}
                  size={{ maxWidth: '600px', minHeight: '200px' }}
                  linkDescription='查看'
                  linkTarget='_blank'
                  secondaryLink={data.internalLink}
                  secondaryLinkDescription={
                    currentLang === 'zh' ? '前往 Blogs' : 'Go to Blogs'
                  }
                  secondaryLinkTarget='_self'
                />
              );
            })}
          </div>
        )}
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

