import React from 'react';

import styles from 'styles/app.module.scss';
import Header from 'components/header/Header';
//import BackgroundVideo from 'components/basic/BackgroundVideo';
//import ThemeToggle from 'components/basic/ThemeToggle';
import LeftSide from 'components/pageBody/LeftSide';
import MainContainer from 'components/pageBody/MainContainer';

export default function App() {
  return (
    <main>
      <div className={styles.app}>
        <div className={styles.header}>
          <Header />
        </div>
        <div className={styles.wrapper}>
          <LeftSide />
          <MainContainer />
        </div>
        <div className={styles['overlay-app']}></div>
      </div>
    </main>
  );
}
