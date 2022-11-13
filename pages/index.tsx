import Head from "next/head";
import styles from "../styles/Home.module.css";
import Reservation from "../components/Reservation/Reservation";
import { useHasHydrated } from "../hooks/useHasHydrated";

export default function Home() {
  const hasHydrated = useHasHydrated();
  return (
    <div className={styles.container}>
      <Head>
        <title>Car Reservation</title>
        <meta
          name="description"
          content="This is a applicatin to provide reservation system"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
      {hasHydrated && <Reservation />}
      </main>
    </div>
  );
}
