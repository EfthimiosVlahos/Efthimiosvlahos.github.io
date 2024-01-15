import data from './devops-projects.json';

export const getdevopsProjects = () => {
  return data;
};

export default (req, res) => {
  const projects = getdevopsProjects();
  res.json(projects);
};
