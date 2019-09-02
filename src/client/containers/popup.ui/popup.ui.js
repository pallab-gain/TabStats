import React from 'react';
import PropTypes from 'prop-types';
import PIEChart from '../pie.chart/pie.chart';

const PopupUI = ({ recordList = [] }) => (
  <div className={`row`}>
    Popup UI
  </div>
);

PopupUI.propTypes = {
  recordList: PropTypes.array
};

export default PopupUI;
