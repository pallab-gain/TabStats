import React from 'react';
import styles from './loading.css';

import loadingImg from './ripple.gif';

const Loading = () => (
  <div className={'col-sm-12 p-0 m-0'}>
    <button className={`btn ${styles.loading_btn}`} type="button" disabled>
      <img src={loadingImg} className={`${styles.loading_img}`}/>
      <span className={styles.button_text}> preparing analytics </span>
    </button>
  </div>
);
export default Loading;
