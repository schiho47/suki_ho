import styles from './Info.module.scss';

const Info = () => {
    return ( 
        <div className={styles.container}>
            <h1>About Me</h1>
            <hr/>
            <ul>
                <li>
                    <div className={styles.block}>
                        <h3>WORK EXPERIENCE</h3>
                        <p>- Frontend Developer since October,2021</p>
                        <p>- Github：https://github.com/schiho47</p>
                    </div>
                </li>
                <li>
                    <div className={styles.block}>
                        <h3>EDUCATION</h3>
                        <p>- Tibame Frontend Developer Training Course
                        Jan 2021 – Aug 2021</p>
                        <p>- MA Postcolonial Culture & Global Policy
                            Goldsmiths, University of London
                            Sep 2017 – Aug 2018</p>
                        <p>- BA History National Taiwan University
                        Sep 2014 – Jun 2017</p>
                    </div>
                </li>
                <li>
                <div className={styles.block}>
                    <h3>SKILLS</h3>
                    <p>- HTML,CSS,SASS,JavaScript,RWD,React.js,Next.js,git</p>
               
                    </div>
                </li>
                <li>
                    <div className={styles.block}>
                    <h3>CONTACT</h3>
                    <p>- s.chiho47@gmail.com</p>
               
                    </div>
                </li>
              
            </ul>
          
           

           
          
        </div>
     );
}
 
export default Info;