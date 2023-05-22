import Image from "next/image";
import Link from "next/link";

interface CardProps{
    title:string;
    description:string;
    img:string;
    link:string;
    size:object;
}
const Card:React.FC<CardProps> = ({title,description,img,link,size}) => {
    return ( 
        <div className="card mb-3" style={size}>
            <div className="row g-0">
            <div className="col-md-6 img-fluid rounded-start" style={{marginTop:'1rem'}}>
                <Image src={img} alt={title} width={500} height={400} objectFit="fill" />
            </div>
            <div className="col-md-6">
                <div className="card-body">
                <h3 className="card-title" style={{color:'#aa978e'}}>{title}</h3>
                <p className="card-text">{description}</p>
                <Link href={link}><a className="card-text"style={{textDecoration:'none'}}>{link}</a></Link>
                </div>
            </div>
            </div>
        </div>
     );
}
 
export default Card;