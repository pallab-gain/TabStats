'use strict';

const HighChartEntry = (title, totalTimeInSec, percentage) => {
  return {
    name: title,
    totalTimeInSec,
    y: percentage
  };
};

module.exports = HighChartEntry;
