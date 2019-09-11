'use strict';

const HighChartWordCloudEntry = (scope, visitListByHourInSecond = 0) => {
  return {
    name: scope,
    weight: visitListByHourInSecond
  };
};

module.exports = HighChartWordCloudEntry;
