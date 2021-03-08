import history from '../../others/history';
import {index} from '../../others/algoliaClient';

/* ******************* Create Item ******************* */

export const createItem = (itemDetails) => (
    dispatch,
    getState,
    { getFirebase }
) => {
    dispatch({ type: 'CREATE_BUTTON', payload: true });
    const uid = getState().firebase.auth.uid;
    const currItem = getState().firebase.profile.currentItem;
    const firestore = getFirebase().firestore();

    
    // eslint-disable-next-line no-unused-vars
    let path = '';
    firestore
        .collection('users')
        .doc(uid)
        .collection('items')
        .add({ ...itemDetails })
        .then((res) => {
            path = res.id;
            firestore
                .collection('users')
                .doc(uid)
                .update({ currentItem: currItem + 1 });
        })
        .then((res) => {
            dispatch({ type: 'CREATE_ITEM', payload: itemDetails });
            // save item to algolia index
            index
                .saveObject({objectID: uid, 
                            itemName: itemDetails.itemName, 
                            displayName: itemDetails.displayName,
                            sellingPrice: itemDetails.sellingPrice
                        }, { autoGenerateObjectIDIfNotExist: true })
                .then(({ objectID }) => {
                    console.log(objectID);
                });
            history.push(`/items`);
        })
        .catch((err) => {
            dispatch({ type: 'CREATE_ITEM_ERROR', err });
            dispatch({ type: 'WENTWRONG_BAR' });
        })
        .finally(() => dispatch({ type: 'CREATE_BUTTON', payload: false }));
};

/* ******************* Delete Item ******************* */

export const deleteItem = (itemId) => (
    dispatch,
    getState,
    { getFirebase }
) => {
    const uid = getState().firebase.auth.uid;
    const firestore = getFirebase().firestore();
    firestore
        .collection('users')
        .doc(uid)
        .collection('items')
        .doc(itemId)
        .delete()
        .then(() => {
            dispatch({ type: 'DELETE_SUCCESS_BAR' });
        })
        .catch((err) => dispatch({ type: 'WENTWRONG_BAR' }));
    if (history.location.pathname !== '/') {
        history.push('/items');
    }
};

/* **************** Change Payment Status *************** */

export const updatePaymentStatus = (itemId, status) => (
    dispatch,
    getState,
    { getFirebase }
) => {
    const uid = getState().firebase.auth.uid;
    const firestore = getFirebase().firestore();
    firestore
        .collection('users')
        .doc(uid)
        .collection('items')
        .doc(itemId)
        .update({ paidStatus: status })
        .then(() => {
            dispatch({ type: 'UPDATE_PAYMENT_STATUS' });
        })
        .catch((err) => dispatch({ type: 'WENTWRONG_BAR' }));
};

/* ************* Send Email Item Reminder ************ */

export const sendItemMail = (id) => (
    dispatch,
    getState,
    { getFirebase }
) => {
    dispatch({ type: 'EMAILSEND_BUTTON', payload: true });

    const lastReminder = getState()
        .firestore.data.items[id].remindedAt.toDate()
        .setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);

    const diff = Math.floor(Math.abs(today - lastReminder) / 1000 / 60 / 60 / 24);

    // Stop Function if Reminded on same Day
    if (diff === 0) {
        dispatch({ type: 'EMAILSEND_BUTTON', payload: false });
        return dispatch({ type: 'EMAILMAXLIMIT_BAR' });
    }

    var itemRemindMail = getFirebase()
        .functions()
        .httpsCallable('itemRemindMail');
    itemRemindMail(id)
        .then((res) => {
            const firestore = getFirebase().firestore();
            const uid = getState().firebase.auth.uid;
            firestore
                .collection('users')
                .doc(uid)
                .collection('items')
                .doc(id)
                .update({ remindedAt: new Date() });
        })
        .then(() => {
            dispatch({ type: 'EMAIL_SUCCESS_BAR' });
            dispatch({ type: 'EMAILSEND_BUTTON', payload: false });
        })
        .catch((err) => dispatch({ type: 'WENTWRONG_BAR' }));
};
