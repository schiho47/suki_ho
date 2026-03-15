'use client';

import Card from '@components/Card/Card';
import Footer from '@components/Footer/Footer';
import Navbar from '@components/Navbar/Navbar';
import styles from '@styles/Blogs.module.scss';
import { BlogsType } from 'type/blogs';
import useSWR, { useSWRConfig } from 'swr';
import { apiFetcher } from '@lib/apiFetcher';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
const desiredOrder = ['NeetCode', 'MuayLang', 'Reading', 'Dissertation'];
const pageSize = 5;

export default function BlogsClient() {
  const [lang, setLang] = useState<'zh' | 'en' | null>(null);
  const [activeTag, setActiveTag] = useState<string>('All');
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const initialTag = searchParams.get('tag');
  const currentLang = lang ?? 'zh';
  const { cache } = useSWRConfig();
  const tagParam = activeTag !== 'All' ? `&tag=${encodeURIComponent(activeTag)}` : '';
  const key = lang
    ? `/api/blogs?lang=${lang}&page=${page}&limit=${pageSize}${tagParam}`
    : null;
  const fallbackData = key ? cache.get(key) : undefined;
  const {
    data,
    error,
    isLoading,
  } = useSWR(key, apiFetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    fallbackData,
  });
  

  const items = Array.isArray(data?.items) ? data.items : [];
  const allTags = Array.isArray(data?.tags) ? data.tags : [];
  const total = typeof data?.total === 'number' ? data.total : 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const tags = useMemo(() => {
    if (!Array.isArray(allTags) || allTags.length === 0) return ['All'];

    const present = new Set(allTags);
    const ordered = desiredOrder.filter((tag) => present.has(tag));
    const rest = allTags.filter((tag) => !desiredOrder.includes(tag));
    return ['All', ...ordered, ...rest];
  }, [allTags]);
  

  const filteredBlogs = useMemo(() => {
    if (!Array.isArray(items)) return [];
    if (activeTag === 'All') return items;
    return items.filter((blog: BlogsType) =>
      Array.isArray(blog.tags) ? blog.tags.includes(activeTag) : false
    );
  }, [activeTag, items]);

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

  useEffect(() => {
    if (!initialTag) return;
    const lower = initialTag.toLowerCase();
    const matched = tags.find((tag) => tag.toLowerCase() === lower);
    if (matched && matched !== activeTag) {
      setActiveTag(matched);
      setPage(1);
    }
  }, [activeTag, initialTag, setActiveTag, tags]);

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
  
  return (
    <div>
      <Navbar path={'blogs'} />
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h1>Blogs</h1>
        </div>
        {!lang && (
          <div className='d-flex justify-content-center py-5'>
            <div className='spinner-border text-primary' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          </div>
        )}
        {lang && error && <div>failed to load</div>}
        {lang && isLoading && (
          <div className='d-flex justify-content-center py-5'>
            <div className='spinner-border text-primary' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          </div>
        )}
        {lang && Array.isArray(items) && (
          <>
            <ul className={`nav nav-tabs mb-4 ${styles.tagsRow}`}>
              {tags.map((tag) => (
                <li key={tag} className='nav-item'>
                  <button
                    type='button'
                    className={`nav-link ${activeTag === tag ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTag(tag);
                      setPage(1);
                    }}
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
                      linkDescription={
                        currentLang === 'zh' ? '看更多' : 'Read More'
                      }
                      size={{ minHeight: '160px' }}
                    />
                  );
                })}
            </div>
            {totalPages > 1 && (
              <nav
                className='d-flex justify-content-center my-4'
                aria-label='Blog pagination'
              >
                <ul className='pagination'>
                  <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button
                      type='button'
                      className='page-link border-0'
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      aria-label='Previous'
                    >
                      <span aria-hidden='true'>&laquo;</span>
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                    (pageNum) => (
                      <li
                        key={pageNum}
                        className={`page-item ${
                          pageNum === page ? 'active' : ''
                        }`}
                      >
                        <button
                          type='button'
                          className='page-link'
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    )
                  )}
                  <li
                    className={`page-item ${
                      page === totalPages ? 'disabled' : ''
                    }`}
                  >
                    <button
                      type='button'
                      className='page-link border-0'
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      aria-label='Next'
                    >
                      <span aria-hidden='true'>&raquo;</span>
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
