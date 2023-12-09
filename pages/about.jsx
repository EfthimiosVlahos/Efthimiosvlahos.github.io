import { pdfjs } from 'react-pdf';
import dynamic from 'next/dynamic';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
const myResume = '/Efthimos_Vlahos_Resume_Dec_2023_MLE_V3.pdf';

// Dynamically import the Document and Page components
const Document = dynamic(() => import('react-pdf').then((mod) => mod.Document), { ssr: false });
const Page = dynamic(() => import('react-pdf').then((mod) => mod.Page), { ssr: false });

const AboutPage = () => {
  return (
    <>
        <h3>About Me</h3><br/>
      <ul>
        <li><span role="img" aria-label="laptop">💻</span> Currently gaining work experience as a Data Analyst for Microsoft</li>
        <li><span role="img" aria-label="book">📖</span> MSc in Applied Mathematics & Statistics @ SUNY Stony Brook University</li>
        <li><span role="img" aria-label="graduate-hat">🎓</span> Conducting research on <b>AI</b> and <b>MLops</b> in my downtime</li>
        <li><span role="img" aria-label="bar-chart">📊</span> Experienced Data Scientist passionate about applying predictive modeling and big data insights to solve complex business problems</li>
        <li><span role="img" aria-label="sparkles">✨</span> Committed to lifelong learning and self-improvement, with a focus on applying data science techniques for positive global impact</li>
      </ul>
      <br></br>
      <center>
        <h3>Resume (<a href={myResume} download="Efthimos_Vlahos_Resume_Dec_2023_MLE_V3.pdf">Download</a>)</h3>
        <br />
        <Document 
          file={myResume} 
          onLoadError={(error) => console.error('PDF load error:', error)}
        >
          <Page pageIndex={0} renderMode="svg"/>
          {/* Only include this if your PDF has a second page */}
          {/* <Page pageIndex={1} renderMode="svg"/> */}
        </Document>
      </center>
      {/* ... */}
    </>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'About' },
  };
}

export default AboutPage;

