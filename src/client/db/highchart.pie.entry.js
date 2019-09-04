'use strict';

const HighChartPieEntry = (scope, totalTimeInSec, percentage) => {
  return {
    name: scope,
    totalTimeInSec,
    y: percentage
  };
};

module.exports = HighChartPieEntry;
