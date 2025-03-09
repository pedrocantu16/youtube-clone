import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';
import { getVideos } from './utils/firebase/functions';

export default async function Home() {
  const videos = await getVideos();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
      {
        videos.map((video) => (
          // eslint-disable-next-line react/jsx-key
          <Link href={`/watch?v=${video.filename}`}>
            <Image src={'../public/thumbnail.png'} alt='video' width={120} height={80}
              className={styles.thumbnail}/>
          </Link>
        ))
      }
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}
