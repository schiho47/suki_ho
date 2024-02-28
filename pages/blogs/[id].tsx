import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@components/Navbar/Navbar';
import styles from '@styles/BlogPage.module.scss';
import { BlogsType } from 'type/blogs';
import Custom404 from 'pages/404';
import Link from 'next/link';
import { link } from 'fs';
import Footer from '@components/Footer/Footer';

interface BlogPagesProps {}

const BlogPages: React.FC<BlogPagesProps> = () => {
  const router = useRouter();
  const pageId = +router.asPath.split('/')[2];
  const [data, setData] = useState<BlogsType | undefined>(undefined);

  const getBlogData = async () => {
    const res = await fetch('/api/blogs/[id]', { method: 'GET' });
    const result = res.json();
    if (result) {
      result.then((apiData) => setData(apiData[0]));
    }
  };

  useEffect(() => {
    getBlogData();
  }, []);

  return (
    <div>
      <Navbar path={'blogs'} />
      <div className={styles.container}>
        {data && Object.keys(data).length === 0 && <Custom404 />}
        {data && Object.keys(data).length > 0 && (
          <>
            <h1>{data.title}</h1>
            <div className={styles.content}>
              <div
                className={styles.html}
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
            </div>
          </>
        )}
        <div className={styles.reference}>
          <h3>Reference</h3>
          <ol>
            {data &&
              data.reference.map((ref) => {
                return (
                  <li key={ref.id}>
                    <Link href={ref.link}>
                      <a target='_blank'>{ref.title}</a>
                    </Link>
                  </li>
                );
              })}
          </ol>
        </div>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default BlogPages;
