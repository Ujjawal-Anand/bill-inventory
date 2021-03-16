import history from '../../others/history';

/* ******************* Create Item ******************* */

export const createWarehouse = (warehouseDetails) => (
    dispatch,
    getState,
    { getFirebase }
) => {
    dispatch({ type: 'CREATE_BUTTON', payload: true });
    const uid = getState().firebase.auth.uid;
    const firestore = getFirebase().firestore();
    firestore
        .collection('users')
        .doc(uid)
        .collection('warehouse')
        .add({ ...warehouseDetails })
        .catch((err) => {
            dispatch({ type: 'CREATE_ITEM_ERROR', err });
            dispatch({ type: 'WENTWRONG_BAR' });
        })
        .finally(() => dispatch({ type: 'CREATE_BUTTON', payload: false }));
};

/* ******************* Delete Warehouse ******************* */

export const deleteWarehouse = (itemId) => (
    dispatch,
    getState,
    { getFirebase }
) => {
    const uid = getState().firebase.auth.uid;
    const firestore = getFirebase().firestore();
    firestore
        .collection('users')
        .doc(uid)
        .collection('warehouse')
        .doc(itemId)
        .delete()
        .then(() => {
            dispatch({ type: 'DELETE_SUCCESS_BAR' });
        })
        .catch((err) => dispatch({ type: 'WENTWRONG_BAR' }));
    if (history.location.pathname !== '/') {
        history.push('/warehouse');
    }
};



