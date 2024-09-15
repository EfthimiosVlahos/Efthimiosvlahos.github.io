import { pdfjs } from 'react-pdf';
import dynamic from 'next/dynamic';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
const myResume = 'Efthimos_Vlahos_Resume_Sep_2024_MLE_V2.pdf';

// Dynamically import the Document and Page components
const Document = dynamic(() => import('react-pdf').then((mod) => mod.Document), { ssr: false });
const Page = dynamic(() => import('react-pdf').then((mod) => mod.Page), { ssr: false });

const AboutPage = () => {
  return (
    <>
<h3>About Me</h3><br/>
<ul>
  <li>💻 Currently driving business intelligence initiatives as a Machine Learning Engineer at Cornerstone Building Brands, specializing in predictive model development and data pipeline architecture.</li>
  <li>📖 Master of Science in Applied Mathematics & Statistics from SUNY Stony Brook University, with a strong focus on data science, machine learning, and business analytics.</li>
  <li>🎓 Research Focus: Actively engaged in research on AI, MLOps, and cloud infrastructure, developing scalable solutions for real-world business problems.</li>
  <li>💪 Fitness Devotee: Regularly hitting the gym to stay fit, valuing both physical and mental well-being: proudly have never skipped leg day 🦵.</li>
  <li>📚 Philosophy Enthusiast: Passionate about reading and discussing philosophical ideas and literature.</li>
</ul>



      <br></br>
      <center>
        <h3>Resume (<a href={myResume} download='Efthimos_Vlahos_Resume_Sep_2024_MLE_V2.pdf'>Download</a>)</h3>
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


// import { pdfjs } from 'react-pdf';
// import dynamic from 'next/dynamic';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// const myResume = '/Efthimos_Vlahos_Resume_March_2024_MLE_V6.pdf';

// // Dynamically import the Document and Page components
// const Document = dynamic(() => import('react-pdf').then((mod) => mod.Document), { ssr: false });
// const Page = dynamic(() => import('react-pdf').then((mod) => mod.Page), { ssr: false });

// const AboutPage = () => {
//   return (
//     <>
//         <h3>About Me</h3><br/>
//         <p>Greetings! I'm Efthimos Vlahos. At the core of my professional identity is a profound dedication to leveraging data science and machine learning to solve real-world challenges. My journey into this field wasn't straightforward; it evolved from a strong foundation in mathematics and physics, cultivated during my undergraduate and graduate studies, into a passionate career in Machine Learning Engineering.</p>

// <p>Transitioning from theoretical physics and mathematics to machine learning, I quickly recognized the power of AI to transform industries and impact lives positively. This realization propelled me to delve deeply into data science, earning several certifications from DeepLearning.AI, including Deep Learning, NLP, MLops, and TensorFlow. These accomplishments have been pivotal in my development as a professional in this field.</p>

// <p>My role at Microsoft, centered around developing and deploying NLP and LLM models, has been instrumental in enhancing AI-driven content analysis and chatbot interactions. It's a role that continuously challenges and excites me as I work to improve client service metrics and strengthen Microsoft's reputation in AI solutions. My work doesn’t just stop at development; it extends to ensuring the robustness and scalability of these solutions through MLOps practices.</p>

// <p>What I bring to the table is not just my technical expertise but also a unique blend of analytical thinking honed in physics and mathematics. This background allows me to approach problems from first principles, driving innovation and creativity in my solutions. I’m particularly proud of how my work contributes to making AI technologies more accessible and understandable, thereby demystifying AI for a broader audience.</p>

// <p>Outside of the professional sphere, I maintain a balance through physical fitness and delve into philosophy, seeking understanding and perspective that inform my approach to challenges and learning. My journey from a student of the universe in physics to an architect of solutions in machine learning has been both challenging and rewarding. As I continue to grow in this field, I remain committed to lifelong learning and to contributing to the exciting and ever-evolving landscape of AI and machine learning.</p>

//       <br></br>
//       <center>
//         <h3>Resume (<a href={myResume} download='/Efthimos_Vlahos_Resume_March_2024_MLE_V6.pdf'>Download</a>)</h3>
//         <br />
//         <Document 
//           file={myResume} 
//           onLoadError={(error) => console.error('PDF load error:', error)}
//         >
//           <Page pageIndex={0} renderMode="svg"/>
//           {/* Only include this if your PDF has a second page */}
//           {/* <Page pageIndex={1} renderMode="svg"/> */}
//         </Document>
//       </center>
//       {/* ... */}
//     </>
//   );
// };

// export async function getStaticProps() {
//   return {
//     props: { title: 'About' },
//   };
// }

// export default AboutPage;
