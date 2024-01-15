import { pdfjs } from 'react-pdf';
import dynamic from 'next/dynamic';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
const myResume = '/Efthimos_Vlahos_Resume_Jan_2024_MLE_V6.pdf';

// Dynamically import the Document and Page components
const Document = dynamic(() => import('react-pdf').then((mod) => mod.Document), { ssr: false });
const Page = dynamic(() => import('react-pdf').then((mod) => mod.Page), { ssr: false });

const AboutPage = () => {
  return (
    <>
        <h3>About Me</h3><br/>
        <ul>
  <li>💻 Professional Path: Enhancing data-driven decision making as a Data Analyst at Microsoft.</li>
  <li>📖 Educational Journey: Master of Science in Applied Mathematics & Statistics from SUNY Stony Brook University.</li>
  <li>🎓 Research Focus: Dedicating time to research in Artificial Intelligence (AI) and MLops, exploring cutting-edge methodologies.</li>
  <li>💪 Fitness Devotee: Regularly hitting the gym to stay fit, valuing both physical and mental well-being: proudly have never skipped leg day 🦵.</li>
  <li>📚 Philosophy Enthusiast: Passionate about reading philosophical ideas and literature.</li>
</ul>



      <br></br>
      <center>
        <h3>Resume (<a href={myResume} download="Efthimos_Vlahos_Resume_Jan_2024_MLE_V6.pdf">Download</a>)</h3>
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

