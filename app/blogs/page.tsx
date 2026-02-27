'use client';

import Card from '@components/Card/Card';
import Footer from '@components/Footer/Footer';
import Navbar from '@components/Navbar/Navbar';
import styles from '@styles/Blogs.module.scss';
import { BlogsType } from 'type/blogs';
import useSWR from 'swr';
import { apiFetcher } from '@lib/apiFetcher';
import { useMemo, useState } from 'react';
import Link from 'next/link';

export default function Blogs() {
  const { data, error, isLoading } = useSWR('/api/blogs', apiFetcher);
  const [activeTag, setActiveTag] = useState<string>('All');

  const getPreviewText = (blog: BlogsType) => {
    if (!blog.blocks || blog.blocks.length === 0) return '';
    return blog.blocks
      .filter((block) => block.type === 'text' || block.type === 'heading')
      .map((block) => block.content)
      .join(' ')
      .trim();
  };

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

  const filteredBlogs = useMemo(() => {
    if (!Array.isArray(data)) return [];
    if (activeTag === 'All') return data;
    return data.filter((blog: BlogsType) =>
      Array.isArray(blog.tags) ? blog.tags.includes(activeTag) : false
    );
  }, [activeTag, data]);

  const renderDescription = (blog: BlogsType,tags:string[]) => {
    if (!blog.blocks || blog.blocks.length === 0) return '';
    if(tags.includes('NeetCode')){
      return <>
      {blog.blocks?.[0]?.content==="Easy"&&<span className="badge text-bg-success mt-2">Easy</span>}
      {blog.blocks?.[0]?.content==="Medium"&&<span className="badge text-bg-warning mt-2">Medium</span>}
      {blog.blocks?.[0]?.content==="Hard"&&<span className="badge text-bg-danger mt-2">Hard</span>}
      
      <div className='mt-2 p-2'><Link href={blog.blocks[1]?.content} target='_blank'>{'NeetCode Link'}</Link></div>
    
      </>
    }
    return <p className='mt-3 '>{blog.blocks?.[2]?.content}</p>
  };
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  return (
    <div>
      <Navbar path={'blogs'} />
      <div className={styles.container}>
        <h1>Blogs</h1>
        <ul className='nav nav-tabs mb-4'>
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
                description={renderDescription(blog,blog.tags||[])}
                date={blog.date}
                link={`/blogs/${blog._id}`}
                linkDescription='看更多'
                size={{ height:'160px'}}
              />
            );
          })}
       </div>    
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

