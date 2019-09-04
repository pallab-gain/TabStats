import React from 'react';
import PropTypes from 'prop-types';
import styles from './card.css';

import { toHumanReadableDuration } from '../../../utils/utils';
const getTimeSpent = (record = undefined) => {
  if (!record) {
    return '';
  }
  return toHumanReadableDuration(record.totalTimeInSec);
};

const getSiteTitle = (record = undefined) => {
  if (!record) {
    return '';
  }
  return record.title;
};
const Card = ({ record }) => (
  <div className={`card ${styles.card_main}`}>
    <img className={`card-img-top ${styles.card_img}`}
      data-src="holder.js/100px180/?text=Image cap" alt="Image cap [100%x180]"
      src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_16cf3c91d22%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_16cf3c91d22%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2299.421875%22%20y%3D%2296.6%22%3EImage%20cap%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
      data-holder-rendered="true"/>
    <div className="card-body">
      {/* eslint-disable-next-line react/jsx-no-target-blank */}
      <a className={`card-text ${styles.site_details}`} href={`https://${getSiteTitle(record)}`} target="_blank"> {getSiteTitle(record)} </a>
      <p className={`card-text ${styles.spend_details}`}> {getTimeSpent(record)} </p>
    </div>
  </div>
);

Card.propTypes = {
  record: PropTypes.object
};
export default Card;
