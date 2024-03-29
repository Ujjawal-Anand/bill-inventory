import history from '../../others/history';


/* ******************* Create Invoice ******************* */

export const createInvoice = (invoiceDetails) => (
  dispatch,
  getState,
  { getFirebase }
) => {
  dispatch({ type: 'CREATE_BUTTON', payload: true });
  const uid = getState().firebase.auth.uid;
  const currInvoice = getState().firebase.profile.currentInvoice;
  const firestore = getFirebase().firestore();
  let path = '';
  firestore
    .collection('users')
    .doc(uid)
    .collection('invoices')
    .add({
      timeline: getFirebase().firestore.FieldValue.arrayUnion({
        event: "Invoice Created", eventId: "",
        time: new Date(), info: ""
      }), ...invoiceDetails
    })
    .then((res) => {
      path = res.id;
      firestore
        .collection('users')
        .doc(uid)
        .update({ currentInvoice: currInvoice + 1 });
    })
    .then((res) => {
      dispatch({ type: 'CREATE_INVOICE', payload: invoiceDetails });
      history.push(`/invoice/${path}`);
    })
    .catch((err) => {
      dispatch({ type: 'CREATE_INVOICE_ERROR', err });
      dispatch({ type: 'WENTWRONG_BAR' });
    })
    .finally(() => dispatch({ type: 'CREATE_BUTTON', payload: false }));
};

/* ******************* Delete Invoice ******************* */

export const deleteInovice = (invoiceId) => (
  dispatch,
  getState,
  { getFirebase }
) => {
  const uid = getState().firebase.auth.uid;
  const firestore = getFirebase().firestore();
  firestore
    .collection('users')
    .doc(uid)
    .collection('invoices')
    .doc(invoiceId)
    .delete()
    .then(() => {
      dispatch({ type: 'DELETE_SUCCESS_BAR' });
    })
    .catch((err) => dispatch({ type: 'WENTWRONG_BAR' }));
  if (history.location.pathname !== '/') {
    history.push('/invoices');
  }
};

/* **************** Change Payment Status *************** */

export const updatePaymentStatus = ({ invoiceId, status = 'unpaid', amountPaid = 0, paymentHistory = {} }) => (
  dispatch,
  getState,
  { getFirebase }
) => {
  const uid = getState().firebase.auth.uid;
  const firestore = getFirebase().firestore();

  console.log("id", invoiceId);
  firestore
    .collection('users')
    .doc(uid)
    .collection('invoices')
    .doc(invoiceId)
    .update({
      paidStatus: status, amountPaid,
      paymentHistory: getFirebase().firestore.FieldValue.arrayUnion(paymentHistory),
      timeline: getFirebase().firestore.FieldValue.arrayUnion({
        event: "Payment Made", time: new Date(), eventId: paymentHistory.id,
        info: `Amount ${paymentHistory.amount}`
      }),
    })
    .then(() => {
      dispatch({ type: 'UPDATE_PAYMENT_STATUS' });
    })
    .catch((err) => dispatch({ type: 'WENTWRONG_BAR' }));
};

/* ************* Add Gatepass to invoice *************** */
export const addGatepass = (invoiceId, data, orders) => (
  dispatch,
  getState,
  { getFirebase }
) => {
  const uid = getState().firebase.auth.uid;
  const firestore = getFirebase().firestore();
  console.log("id", invoiceId);
  firestore
    .collection('users')
    .doc(uid)
    .collection('invoices')
    .doc(invoiceId)
    .update({
      gatepasses: getFirebase().firestore.FieldValue.arrayUnion(data),
      orders,
      timeline: getFirebase().firestore.FieldValue.arrayUnion({
        event: "Gatepass Created", time: new Date(), eventId: data.id,
        info: `Warehouse  -${data.warehouseName}\n Items: ${data.items.length} `
      }),
    })
    .then(() => {
      dispatch({ type: 'UPDATE_PAYMENT_STATUS' });
    })
    .catch((err) => dispatch({ type: 'WENTWRONG_BAR' }));
};

/* ************* Send Email Invoice Reminder ************ */

export const sendInvoiceMail = (id) => (
  dispatch,
  getState,
  { getFirebase }
) => {
  dispatch({ type: 'EMAILSEND_BUTTON', payload: true });

  const lastReminder = getState()
    .firestore.data.invoices[id].remindedAt.toDate()
    .setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);

  const diff = Math.floor(Math.abs(today - lastReminder) / 1000 / 60 / 60 / 24);

  // Stop Function if Reminded on same Day
  if (diff === 0) {
    dispatch({ type: 'EMAILSEND_BUTTON', payload: false });
    return dispatch({ type: 'EMAILMAXLIMIT_BAR' });
  }

  var invoiceRemindMail = getFirebase()
    .functions()
    .httpsCallable('invoiceRemindMail');
  invoiceRemindMail(id)
    .then((res) => {
      const firestore = getFirebase().firestore();
      const uid = getState().firebase.auth.uid;
      firestore
        .collection('users')
        .doc(uid)
        .collection('invoices')
        .doc(id)
        .update({ remindedAt: new Date() });
    })
    .then(() => {
      dispatch({ type: 'EMAIL_SUCCESS_BAR' });
      dispatch({ type: 'EMAILSEND_BUTTON', payload: false });
    })
    .catch((err) => dispatch({ type: 'WENTWRONG_BAR' }));
};
