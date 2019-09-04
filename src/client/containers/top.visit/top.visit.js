import React from 'react';
import PropTypes from 'prop-types';
import Card from './card/card';
import lo from 'lodash';

import styles from './top.visit.css';

const getTopRecords = (recordList = [], totalCount) => {
  const sortedList = recordList.sort((a, b) => {
    if (a.totalTimeInSec > b.totalTimeInSec) {
      return -1;
    } else if (a.totalTimeInSec < b.totalTimeInSec) {
      return 1;
    }
    return 0;
  });
  return lo.take(sortedList, totalCount);
};

const getDiv = (indx = 0) => {
  return indx < 3 ? 'col-sm-4' : 'col-sm-4 mb-2';
};

const TopVisit = ({ recordList, totalCount }) => (
  <div className={`row ${styles.top_visit}`}>
    {
      getTopRecords(recordList, totalCount).map((curRecord, indx) => (
        <div key={indx}
          className={`mt-1 ${getDiv(indx)}`}>
          <Card record={curRecord}/>
        </div>
      ))
    }
  </div>
);

TopVisit.propTypes = {
  recordList: PropTypes.array,
  totalCount: PropTypes.number
};

export default TopVisit;
