import React from 'react';
import PropTypes from 'prop-types';
import Card from './card/card';
import lo from 'lodash';

import styles from './top.5.css';

const getTop5Records = (recordList = []) => {
  const sortedList = recordList.sort((a, b) => {
    if (a.totalTimeInSec > b.totalTimeInSec) {
      return -1;
    } else if (a.totalTimeInSec < b.totalTimeInSec) {
      return 1;
    }
    return 0;
  });
  return lo.take(sortedList, 5);
};

const getDiv = (indx = 0) => {
  return indx < 2 ? 'col-sm-6' : 'col-sm-4';
};

const TopFive = ({ recordList }) => (
  <div className={`row ${styles.top_five}`}>
    {
      getTop5Records(recordList).map((curRecord, indx) => (
        <div key={indx}
          className={`${getDiv(indx)}`}>
          <Card record={curRecord}/>
        </div>
      ))
    }
  </div>
);

TopFive.propTypes = {
  recordList: PropTypes.array
};

export default TopFive;
