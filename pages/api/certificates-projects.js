import data from './certificates-projects.json';

export const getCertificatesProjects = () => {
  return data;
};

export default (req, res) => {
  const projects = getCertificatesProjects();
  res.json(projects);
};
