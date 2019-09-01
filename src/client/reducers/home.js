const INITIAL_STATE = {};

// sample actions
export const sampleHomeAction = () => {
  return {
    type: 'sampleType',
    data: 'sample-data'
  };
};

// action handler
const home = (state = INITIAL_STATE, action) => {
  return state;
};
export default home;
