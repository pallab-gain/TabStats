import React from 'react';
import styles from './loading.css';

const Loading = () => (
  <div className={`row`}>
    <div className={`col-sm-12 p-0 m-0`}>
      <button className={`btn ${styles.loading_btn}`} type="button" disabled>
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span className={styles.button_text}> preparing analytics </span>
      </button>
    </div>
  </div>
);

export default Loading;
