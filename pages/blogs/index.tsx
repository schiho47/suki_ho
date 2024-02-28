import { useEffect, useState } from 'react';
import Card from '@components/Card/Card';
import Footer from '@components/Footer/Footer';
import Navbar from '@components/Navbar/Navbar';
import styles from '@styles/Blogs.module.scss';
import { BlogsType } from 'type/blogs';

const Blogs = () => {
  const [data, setData] = useState<BlogsType[]>([]);

  const getBlogData = async () => {
    const res = await fetch('/api/blogs', { method: 'GET' });
    const result = res.json();
    if (result) {
      result.then((apiData) => setData(apiData));
    }
  };

  useEffect(() => {
    getBlogData();
  }, []);

  return (
    <div>
      <Navbar path={'blogs'} />
      <div className={styles.container}>
        <h1>Blogs</h1>
        <hr />
        {data.length > 0 &&
          data.map((blog) => {
            return (
              <Card
                key={blog.id}
                title={blog.title}
                description={blog.paragraph}
                link={`/blogs/${blog.id}`}
                linkDescription=' 看更多'
                size={{ height: '160px' }}
              />
            );
          })}
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Blogs;
