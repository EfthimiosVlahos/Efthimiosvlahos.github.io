import Link from 'next/link';
// import Illustration from '../components/Illustration';
import Image from "next/image";
import styles from '../styles/HomePage.module.css';

export default function HomePage() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.background}>
          <h1>AI</h1>
          <h1>Research</h1>
        </div>
        <div className={styles.foreground}>
          <div className={styles.content}>
            <h1 className={styles.name}>Efthimios Vlahos</h1>
            <h6 className={styles.bio}>Machine Learning Engineer</h6>
            <div className={styles.cardContainer}>
              <div className={styles.card}>
                <div className={styles.content}>
                  <h4>Skill Set</h4>
                  <div className={styles.tags}>
                    <span key='Python' className='Python'>
                      Python
                    </span>
                    <span key='SQL' className='SQL'>
                      SQL
                    </span>
                    <span key='Tensorflow' className='PyTorch'>
                      Tensorflow
                    </span>
                    <span key='PyTorch' className='PyTorch'>
                      PyTorch
                    </span>
                    <span key='MLOps' className='MLOps'>
                      MLOps
                    </span>
                    <span key='MLflow' className='MLOps'>
                      MLflow
                    </span>
                    <span key='DevOps' className='MLOps'>
                      DevOps
                    </span>
                    <span key='Data-Pipelines' className='Data-Pipelines'>
                      Data-Pipelines
                    </span>
                    <span key='AWS' className='AWS'>
                      AWS
                    </span>
                    <span key='Kubernetes' className='AWS'>
                      Kubernetes
                    </span>
                    <span key='Docker' className='AWS'>
                      Docker
                    </span>
                    <span key='Computer-Vision' className='Deep-Learning'>
                      Computer-Vision
                    </span>
                    <span key='Deep-Learning' className='Deep-Learning'>
                      Deep Learning
                    </span>
                    <span key='NLP' className='Deep-Learning'>
                      NLP
                    </span>
                    <span key='Time Series Analysis' className='Deep-Learning'>
                    Time Series Analysis
                    </span>
                    <span key='Software-Design' className='Software-Design'>
                      Software-Design
                    </span>
                    <span key='Data Visualization' className='Data Visualization'>
                    Data Visualization
                    </span>
                    <span key='APIs' className='APIs'>
                      APIs
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/about">
              <button className={styles.button}>About Me</button>
            </Link>
            {/* <Link href="/projects">
              <button className={styles.button}>View Projects</button>
            </Link> */}
            <Link href="/contact">
              <button className={styles.outlined}>Contact</button>
            </Link>
          </div>
          {/* <Illustration className={styles.illustration} /> */}
          <div className={styles.right}>
            <div className={styles.picture_boader}>
              <Image
                className={styles.picture}
                src="/Profile_pic_linkedIn.jpg"
                width={300}
                height={290}
                alt="Efthimios' Picture"
              />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: { title: 'Home' },
  };
}
