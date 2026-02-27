import BlogCodeBlock from '@components/BlogCodeBlock/BlogCodeBlock';
import { BlogsType } from 'type/blogs';

interface CodeBlogProps {
  blog: BlogsType;
}
const blockContentColor = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'danger',
};

const 
CodeBlog = ({ blog }: CodeBlogProps) => {
  if (!blog.blocks || blog.blocks.length === 0) return null;

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
                code={block.content}
                language={block.language}
              />
            );
          case 'text':
            if (index === 0) {
              return (
                <>
                <span key={`text-${index}-tag`} className={`badge text-bg-dark me-2`}>{blog?.tags?.length && blog?.tags?.length > 0 ? blog?.tags[0] : 'NeetCode'}</span>
                <span
                  key={`text-${index}-badge`}
                  className={`badge text-bg-${blockContentColor[block.content as keyof typeof blockContentColor]}`}
                >
                  {block.content}
                </span>
                </>
              );
            }
            if (index === 1) {
              return null;
            }
            return <p key={`text-${index}`}>{block.content}</p>;
          default:
            return null;
        }
      })}
    </>
  );
};

export default CodeBlog;
