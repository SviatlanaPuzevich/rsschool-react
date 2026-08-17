import styles from './about.page.module.css';
import img from '../../../assets/imgs/Gemini_Generated_About_Avatar.png';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About Creator',
  description: 'Statically generated about page',
};

const AboutPage = () => {

  return (
    <div className={styles.container}>
      <Image src={img} alt="Snorlax-programmer" className={styles.avatar} />
      <div className={styles.info}>
        <p>
          Sup. I’m Snorlax, but my git commit history calls me The Human
          Bottleneck.
        </p>
        <p>
          I specialize in <b>RESTful</b> APIs—mostly because rest is the only
          part of the documentation I actually follow. My coding style is best
          described as Efficiently Inert. Why write a 50-line function today
          when I can sleep for 18 hours and let Copilot hallucinate the solution
          for me?
        </p>
        <p>
          I’m a Senior Heavyweight Developer with a 100% success rate in
          crashing chairs and a 0% success rate in standing desks. My favorite
          framework is Hibernate (for obvious reasons), and I consider{' '}
          <b>Garbage Collection</b> a personal attack on my desk snacks.
        </p>
        <p>
          People ask me how I handle tight deadlines. Simple: I use a{' '}
          <strong>Body Slam</strong> approach to debugging—I just throw my
          entire weight at the keyboard until the tests pass or the hardware
          breaks. If you see me staring blankly at three monitors, I’m not{' '}
          <i>stuck</i> or <i>contemplating system architecture</i>. I’m just
          waiting for my coffee to compile.
        </p>

        <h2>Tech Stack:</h2>
        <dl>
          <dt>Languages:</dt>
          <dd>Python (it’s slow, like me), CSS (Can’t Stop Sleeping).</dd>

          <dt>Tools:</dt>
          <dd>Noise-canceling headphones to block out Jira notifications.</dd>

          <dt>Status:</dt>
          <dd>408 Request Timeout. Always.</dd>
        </dl>
        <p>
          If you want to collaborate, just open a PR or leave a trail of Poké
          Puffs leading to my workstation. Just don&#39t expect a reply until my
          next waking cycle in 2027. Zzz..
        </p>
      </div>
      <Link href="https://rs.school/" target="_blank" rel="noopener noreferrer" className={styles.link}>
        Go to RS school
      </Link>
    </div>
  );
};

export default AboutPage;
