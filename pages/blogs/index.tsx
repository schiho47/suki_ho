import Footer from '@components/Footer/Footer';
import Navbar from '@components/Navbar/Navbar';
import styles from '@styles/Blogs.module.scss';

const Blogs = () => {
    return ( 
    <div>
            <Navbar path={'blogs'} />
            <div className={styles.container}>
                <h1>Blogs</h1>
                <hr />
            </div>
            <div>
                <Footer/>
            </div>
    </div>
     );
}
 
export default Blogs;