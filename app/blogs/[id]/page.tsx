'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@components/Navbar/Navbar';
import styles from '@styles/BlogPage.module.scss';
import { BlogsType } from 'type/blogs';
import Footer from '@components/Footer/Footer';
import { apiFetcher } from '@lib/apiFetcher';
import useSWR from 'swr';
import NotFound from '../../not-found';
import CodeBlog from '@components/BlogDetail/CodeBlog';
import ReadingBlog from '@components/BlogDetail/ReadingBlog';

export default function BlogPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, error, isLoading } = useSWR(`/api/blogs/${id}`, apiFetcher);

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return;
    const rawTitle = (data[0] as BlogsType)?.title || 'Blog';
    const maxLength = 40;
    const truncatedTitle =
      rawTitle.length > maxLength
        ? `${rawTitle.slice(0, maxLength)}...`
        : rawTitle;
    document.title = truncatedTitle;
  }, [data]);

  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <div className='d-flex justify-content-center py-5'>
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <NotFound />;
  }

  const blog = data[0] as BlogsType;
  const isCodeBlog = blog.tags?.includes('NeetCode');

  return (
    <div>
      <Navbar path={'blogs'} />
      <div className={styles.container}>
        <div className={styles.blogContainer}>
        {data && Object.keys(data).length > 0 && (
          <>
            <div className={styles.headerRow}>
              <h1>{blog.title}</h1>
              {blog.date && <h6 className={styles.dateTag}>{blog.date}</h6>}
            </div>
            <div className={styles.content}>
              {isCodeBlog ? <CodeBlog blog={blog} /> : <ReadingBlog blog={blog} />}
            </div>
            </>
          )}
        </div>
        {/* {data && data[0]?.reference && (
          <div className={styles.reference}>
            <h3>Reference</h3>
            <ol>
              {data[0].reference.map((ref: BlogsType) => {
                if (!ref.link) {
                  return null;
                }
                return (
                  <li key={ref.id}>
                    <Link href={ref.link}>{ref.title}</Link>
                  </li>
                );
              })}
            </ol>
          </div>
        )} */}
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

