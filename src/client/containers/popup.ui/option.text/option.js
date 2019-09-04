import React from 'react';
import PropTypes from 'prop-types';

import styles from './option.css';

const OptionText = ({ text, isSelected, onSelectionChange }) => (
  <span className={`nav-item ${styles.text} ${styles.cursor}`} onClick={ () => onSelectionChange(text)}>
    <a className={`nav-link ${isSelected && styles.selected}`}>{text} </a>
  </span>
);

OptionText.propTypes = {
  text: PropTypes.string,
  isSelected: PropTypes.bool,
  onSelectionChange: PropTypes.func.isRequired
};

export default OptionText;
