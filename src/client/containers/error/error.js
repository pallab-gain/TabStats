import React from 'react';
import PropTypes from 'prop-types';

const Error = ({ error }) => (
  <div className={`row`}>
    {error.message}
  </div>
);

Error.propTypes = {
  error: PropTypes.object.isRequired
};

export default Error;
