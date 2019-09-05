const toStr = (num) => {
  return (num < 10 ? '0' : '') + parseInt(num, 10);
};

/* convert millisecond to hh:mm:ss */
export const toHMS = (durationInSecond = 0) => {
  let minutes = Math.floor((1.0 * durationInSecond) / 60);
  durationInSecond = durationInSecond % 60;
  const hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  return {
    hh: hours,
    mm: minutes,
    ss: durationInSecond
  };
};

export const toHumanReadableDuration = (durationInSecond = 0) => {
  const { hh, mm, ss } = toHMS(durationInSecond);
  let sb = '';
  if (hh > 0) {
    sb += `${toStr(hh)} hours `;
  }
  if (mm > 0) {
    sb += `${toStr(mm)} minutes `;
  }
  sb += `${toStr(ss)} seconds `;
  return sb;
};

export const toShortDuration = (durationInSecond = 0) => {
  const { hh, mm, ss } = toHMS(durationInSecond);
  if (hh > 0) {
    return `${toStr(hh)}:${toStr(mm)}`;
  } else {
    return `${toStr(mm)}:${toStr(ss)}`;
  }
};

export const toMinutes = (durationInSecond = 0) => {
  const minutes = Math.round((1.0 * durationInSecond) / 60);
  return minutes;
};
