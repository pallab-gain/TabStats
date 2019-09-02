import React from 'react';
import PropTypes from 'prop-types';

import styles from './option.css';

const OptionText = ({ text, selected, onSelectionChange }) => (
  <span className={`nav-item ${styles.text} ${styles.cursor}`} onClick={ () => onSelectionChange(text)}>
    <a className={`nav-link ${selected && styles.selected}`}>{text} </a>
  </span>
);

OptionText.propTypes = {
  text: PropTypes.string,
  selected: PropTypes.boolean,
  onSelectionChange: PropTypes.func.isRequired
};

export default OptionText;
