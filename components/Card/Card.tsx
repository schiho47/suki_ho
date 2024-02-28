import Image from "next/image";
import Link from "next/link";

interface CardProps {
  title: string;
  description: string;
  link: string;
  linkDescription: string;
  size: object;
  img?: string;
}
const Card: React.FC<CardProps> = ({
  title,
  description,
  img,
  link,
  linkDescription,
  size,
}) => {
  const linkBlockStyle = img
    ? { height: "30px", margin: "-1rem 10px 10px 0" }
    : { width: "95%", marginBottom: "10px" };

  const linkOpenType = img ? "_blank" : "_self";

  return (
    <div className="card mb-3" style={size}>
      <div className="row g-0">
        {img && (
          <div
            className="col-md-6 img-fluid rounded-start"
            style={{ marginTop: "1.5rem" }}
          >
            <Link href={link}>
              <a target={linkOpenType}>
                <Image
                  src={img}
                  alt={title}
                  width={500}
                  height={400}
                  objectFit="fill"
                />
              </a>
            </Link>
          </div>
        )}
        <div className={`${img ? "col-md-6" : "col-md-12"}`}>
          <div className="card-body">
            <h3 className="card-title" style={{ color: "#33006E" }}>
              <Link href={link}>
                <a
                  target={linkOpenType}
                  style={{ color: "#33006E", textDecoration: "none" }}
                >
                  {title}
                </a>
              </Link>
            </h3>
            <p className="card-text">{description}</p>
          </div>
        </div>
        <div
          style={{
            textAlign: "right",
            width: "97%",
            ...linkBlockStyle,
          }}
        >
          <Link href={link}>
            <a
              className="card-text"
              style={{ textDecoration: "none" }}
              target={linkOpenType}
            >
              {linkDescription}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
