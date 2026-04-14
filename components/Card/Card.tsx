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
  linkTarget?: '_blank' | '_self';
  secondaryLink?: string;
  secondaryLinkDescription?: string;
  secondaryLinkTarget?: '_blank' | '_self';
}
const Card: React.FC<CardProps> = ({
  title,
  description,
  img,
  link,
  linkDescription,
  size,
  date,
  linkTarget = '_blank',
  secondaryLink,
  secondaryLinkDescription,
  secondaryLinkTarget = '_self',
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
            <Link href={link} target={linkTarget}>
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
          <div className={`card-body ${!img ? styles.bodyWithFooter : ''}`}>
            <div className={`d-flex justify-content-between align-items-center ${styles.headerRow}`}>
              <h3 className={`card-title mb-0 ${styles.cardTitle}`}>
                {title}
              </h3>
              {date && (
                <span className={`text-muted small ${styles.dateText}`}>
                  {new Date(date).toLocaleDateString('en-CA')}
                </span>
              )}
            </div>
            {description && (
              <div
                className={`card-text ${styles.cardText} ${
                  img ? styles.cardTextWithImage : ''
                }`}
              >
                {description}
              </div>
            )}
          </div>
        </div>
        <div className={linkBlockClassName}>
          {secondaryLink && secondaryLinkDescription && (
            <Link href={secondaryLink} target={secondaryLinkTarget}>
              <span>
                {`${secondaryLinkDescription} »`}
              </span>
            </Link>
          )}
          {secondaryLink && secondaryLinkDescription && (
            <span className={styles.linkSeparator}>｜</span>
          )}
          <Link href={link} target={linkTarget}>
            <span >
              {`${linkDescription} » `}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
