'use client';

import Card from '@components/Card/Card';
import Footer from '@components/Footer/Footer';
import Navbar from '@components/Navbar/Navbar';
import styles from '@styles/Projects.module.scss';
import { apiFetcher } from '@lib/apiFetcher';
import useSWR from 'swr';

import { ProjectTypes } from 'type/projects';

export default function Projects() {
  const {
    data: projectData,
    error,
    isLoading,
  } = useSWR('/api/projects', apiFetcher);

 
  return (
    <div>
      <Navbar path={'projects'} />
      <div className={styles.container}>
        <h1>Projects</h1>
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

