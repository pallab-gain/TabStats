'use strict';

const HighChartEntry = (scope, totalTimeInSec, percentage) => {
  return {
    name: scope,
    totalTimeInSec,
    y: percentage
  };
};

module.exports = HighChartEntry;
