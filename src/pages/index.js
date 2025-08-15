import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [inviteCode, setInviteCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle invite code submission
    console.log('Invite code:', inviteCode);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Invite X Twitter</title>
        <meta name="description" content="Enter your invite code to access X Twitter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="#">Invite X Twitter</a>
        </h1>

        <p className={styles.description}>
          Enter your invite code to get started
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="inviteCode" className={styles.label}>
              Invite Code
            </label>
            <input
              id="inviteCode"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Enter your invite code"
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Войти
          </button>
        </form>
      </main>
    </div>
  );
}
