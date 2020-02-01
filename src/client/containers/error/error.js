import React from 'react';
import styles from './error.css';

const Error = () => (
  <div className={'row'}>
    <div className={'col-sm-12 p-0 m-0 text-center'}>
      <button className={`bg-danger text-white ${styles.error_text}`} type="button" disabled>
        <span>{'Error loading analytics data ...'}</span>
      </button>

    </div>
  </div>
);

Error.propTypes = {
};

export default Error;
