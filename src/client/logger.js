import { createLogger } from 'redux-logger';

const reduxActionsLogger = createLogger({
  collapsed: true,
  logErrors: true,
  duration: false,
  timestamp: true
});

export default reduxActionsLogger;
