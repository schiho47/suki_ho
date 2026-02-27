import BlogCodeBlock from '@components/BlogCodeBlock/BlogCodeBlock';
import { BlogsType } from 'type/blogs';

interface ReadingBlogProps {
  blog: BlogsType;
}

const ReadingBlog = ({ blog }: ReadingBlogProps) => {
  if (!blog.blocks || blog.blocks.length === 0) return null;

const getPointTitle=(str:string)=>{
    const regex = /^（[一二三四五六七八九十百千]+）/
    const match = str.match(regex);
  return match ? match[0] : null;
};

  return (
    <>
      {blog.blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return <h2 key={`heading-${index}`}>{block.content}</h2>;
          case 'code':
            return (
              <BlogCodeBlock
                key={`code-${index}`}
                code={block.content ?? ''}
                language={block.language}
              />
            );
          case 'text':
            return <p key={`text-${index}`} className={getPointTitle(block.content ?? '') ? 'fw-bold' : ''}>{block.content ?? ''}</p>;
          case 'image':
            if (!block.url) return null;
            return (
              <img
                key={`image-${index}`}
                src={block.url}
                alt={block.caption || 'blog image'}
                width={400}
                height={'auto'}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};

export default ReadingBlog;
