import ProjectCard from '../components/ProjectCard';
import { getMLProjects } from './api/ml-projects';
import { getBotsProjects } from './api/bots-projects';
import { getPyPiProjects } from './api/pypi-projects';
import { getMiscProjects } from './api/misc-projects';
import styles from '../styles/ProjectsPage.module.css';

const ProjectsPage = ({ ml_projects }) => {
  return (
    <>
      <br/>
      <center><h4>Machine Learning</h4></center>
      <hr/>
      <div className={styles.container}>
        {ml_projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
};

export async function getStaticProps() {
  const ml_projects = getMLProjects();

  return {
    props: { title: 'Projects', ml_projects },
  };
}

export default ProjectsPage;
