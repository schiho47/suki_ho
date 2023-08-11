import Card from "@components/Card/Card";
import Footer from "@components/Footer/Footer";
import Navbar from "@components/Navbar/Navbar";
import styles from "@styles/Projects.module.scss";
import { useEffect, useState } from "react";
import { ProjectTypes } from "type/projects";
const Projects = () => {
  const [projectData, setProjectData] = useState<ProjectTypes[]>([]);
  const getProjectData = async () => {
    const res = await fetch("/api/projects", { method: "GET" });
    const result = res.json();
    if (result) {
      result.then((data) => setProjectData(data));
    }
  };

  useEffect(() => {
    getProjectData();
  }, []);

  return (
    <div>
      <Navbar path={"projects"} />
      <div className={styles.container}>
        <h1>Projects</h1>
        <hr />
        <div className={styles.projects}>
          {projectData.length > 0 &&
            projectData.map((data) => {
              return (
                <Card
                  key={data.link}
                  title={data.title}
                  description={data.description}
                  img={data.img}
                  link={data.link}
                  size={{ maxWidth: "600px", minHeight: "200px" }}
                  linkDescription="查看"
                />
              );
            })}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Projects;
