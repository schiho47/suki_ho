import Image from 'next/image';
import Link from 'next/link';
import styles from './Card.module.scss';
interface CardProps {
  title: string;
  description: React.ReactNode;
  link: string;
  linkDescription: string;
  size: object;
  img?: string;
  date?: string | null;
}
const Card: React.FC<CardProps> = ({
  title,
  description,
  img,
  link,
  linkDescription,
  size,
  date,
}) => {
  const linkBlockClassName = img
    ? `${styles.linkBlock} ${styles.linkBlockWithImage}`
    : `${styles.linkBlock} ${styles.linkBlockNoImage}`;
  

  return (
    <div className={`card ${styles.card}`} style={size}>
      <div className='row g-0'>
        {img && (
          <div
            className={`col-md-6 img-fluid rounded-start ${styles.imageWrapper}`}
          >
            <Link href={link} target='_blank'>
              <Image
                src={img}
                alt={title}
                width={300}
                height={200}
                className={styles.cardImage}
                loading='eager'
                priority={true}
              />
            </Link>
          </div>
        )}
        <div className={`${img ? 'col-md-6' : 'col-md-12'}`}>
          <div className='card-body'>
            <div className='d-flex justify-content-between align-items-center'>
              <h3 className={`card-title mb-0 ${styles.cardTitle}`}>
                {title}
              </h3>
              {date && (
                <span className='text-muted small'>
                  {new Date(date).toLocaleDateString('zh-TW')}
                </span>
              )}
            </div>
            {
              description && (
                <p className='card-text'>{description}</p>
              )
            }
          </div>
        </div>
        <div className={linkBlockClassName}>
          <Link href={link} target='_blank'>
            {linkDescription}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
