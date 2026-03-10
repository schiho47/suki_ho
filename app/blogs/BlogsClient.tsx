'use client';

import Card from '@components/Card/Card';
import Footer from '@components/Footer/Footer';
import Navbar from '@components/Navbar/Navbar';
import styles from '@styles/Blogs.module.scss';
import { BlogsType } from 'type/blogs';
import useSWR, { useSWRConfig } from 'swr';
import { apiFetcher } from '@lib/apiFetcher';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function BlogsContent({
  lang,
  currentLang,
  activeTag,
  setActiveTag,
  initialTag,
}: {
  lang: 'zh' | 'en';
  currentLang: 'zh' | 'en';
  activeTag: string;
  setActiveTag: React.Dispatch<React.SetStateAction<string>>;
  initialTag: string | null;
}) {
  const { cache } = useSWRConfig();
  const key = `/api/blogs?lang=${lang}`;
  const fallbackData = cache.get(key);
  const { data } = useSWR(key, apiFetcher, {
    suspense: true,
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    fallbackData,
  });

  const tags = useMemo(() => {
    if (!Array.isArray(data)) return ['All'];
    const tagSet = new Set<string>();
    data.forEach((blog: BlogsType) => {
      if (Array.isArray(blog.tags)) {
        blog.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return ['All', ...Array.from(tagSet)];
  }, [data]);
  useEffect(() => {
    if (!initialTag) return;
    const lower = initialTag.toLowerCase();
    const matched = tags.find((tag) => tag.toLowerCase() === lower);
    if (matched && matched !== activeTag) {
      setActiveTag(matched);
    }
  }, [activeTag, initialTag, setActiveTag, tags]);

  const filteredBlogs = useMemo(() => {
    if (!Array.isArray(data)) return [];
    if (activeTag === 'All') return data;
    return data.filter((blog: BlogsType) =>
      Array.isArray(blog.tags) ? blog.tags.includes(activeTag) : false
    );
  }, [activeTag, data]);

  const renderDescription = (blog: BlogsType, tags: string[]) => {
    if (!blog.blocks || blog.blocks.length === 0) return '';
    if (tags.includes('NeetCode')) {
      const neetCodeLink = blog.blocks?.[1]?.content;
      return (
        <>
          {blog.blocks?.[0]?.content === 'Easy' && (
            <span className='badge text-bg-success mt-2'>Easy</span>
          )}
          {blog.blocks?.[0]?.content === 'Medium' && (
            <span className='badge text-bg-warning mt-2'>Medium</span>
          )}
          {blog.blocks?.[0]?.content === 'Hard' && (
            <span className='badge text-bg-danger mt-2'>Hard</span>
          )}

          {neetCodeLink && (
            <div className='mt-2 p-2'>
              <Link href={neetCodeLink} target='_blank'>
                {'NeetCode Link'}
              </Link>
            </div>
          )}
        </>
      );
    }
    return <p className='mt-3 '>{blog.blocks?.[2]?.content}</p>;
  };

  return (
    <>
      <ul className={`nav nav-tabs mb-4 ${styles.tagsRow}`}>
        {tags.map((tag) => (
          <li key={tag} className='nav-item'>
            <button
              type='button'
              className={`nav-link ${activeTag === tag ? 'active' : ''}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          </li>
        ))}
      </ul>
      <hr />
      <div className={styles.blogsContainer}>
        {filteredBlogs.length > 0 &&
          filteredBlogs.map((blog: BlogsType) => {
            return (
              <Card
                key={blog.id}
                title={blog.title}
                description={renderDescription(blog, blog.tags || [])}
                date={blog.date}
                link={`/blogs/${blog._id ?? blog.id}?lang=${currentLang}`}
                linkDescription={currentLang === 'zh' ? '看更多' : 'Read More'}
                size={{ minHeight: '160px' }}
              />
            );
          })}
      </div>
    </>
  );
}

export default function BlogsClient() {
  const [lang, setLang] = useState<'zh' | 'en' | null>(null);
  const searchParams = useSearchParams();
  const initialTag = searchParams.get('tag');
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const qp = searchParams.get('lang');
    const saved = window.localStorage.getItem('lang');
    const nextLang =
      qp === 'en' || qp === 'zh'
        ? qp
        : saved === 'en' || saved === 'zh'
          ? saved
          : 'zh';
    setLang(nextLang);
  }, [searchParams]);
  useEffect(() => {
    if (typeof window === 'undefined' || !lang) return;
    window.localStorage.setItem('lang', lang);
  }, [lang]);
  const currentLang = lang ?? 'zh';
  const [activeTag, setActiveTag] = useState<string>('All');
  return (
    <div>
      <Navbar path={'blogs'} />
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h1>Blogs</h1>
        </div>
        {lang && (
          <ErrorBoundary fallback={<div>failed to load</div>}>
            <Suspense
              fallback={
                <div className='d-flex justify-content-center py-5'>
                  <div className='spinner-border text-primary' role='status'>
                    <span className='visually-hidden'>Loading...</span>
                  </div>
                </div>
              }
            >
              <BlogsContent
                lang={lang}
                currentLang={currentLang}
                activeTag={activeTag}
                setActiveTag={setActiveTag}
                initialTag={initialTag}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
