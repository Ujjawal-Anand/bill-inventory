import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

import authReducer from './authReducer';
import invoiceReducer from './invoiceReducer';
import loadingStateReducer from './loadingStateReducer';
import alertReducer from './alertReducer';
import snackbarReducer from './snackbarReducer';
import itemReducer from './itemReducers';
import invoiceItemReducer from './invoiceItemReducer';

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  auth: authReducer,
  invoice: invoiceReducer,
  loadingState: loadingStateReducer,
  alertState: alertReducer,
  snackbar: snackbarReducer,
  item: itemReducer,
  invoiceItem: invoiceItemReducer
});

export default rootReducer;
