'use strict';

const HighChartStackEntry = (scope, visitListByHourInMinute = []) => {
  return {
    name: scope,
    data: visitListByHourInMinute
  };
};

module.exports = HighChartStackEntry;
