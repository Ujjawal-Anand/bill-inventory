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
        .then((res) => {
            dispatch({ type: 'CREATE_WAREHOUSE', payload: warehouseDetails });
        })
        .catch((err) => {
            dispatch({ type: 'CREATE_WAREHOUSE_ERROR', err });
            dispatch({ type: 'WENTWRONG_BAR' });
        })
        .finally(() => dispatch({ type: 'CREATE_BUTTON', payload: false }));
};

/* ******************* Delete Warehouse ******************* */

export const deleteWarehouse = (warehouseId) => (
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
        .doc(warehouseId)
        .delete()
        .then(() => {
            dispatch({
                type: 'DELETE_WAREHOUSE',
                payload: warehouseId
            });
        })
        .then(() => {
            dispatch({ type: 'DELETE_SUCCESS_BAR' });
        })
        .catch((err) => dispatch({ type: 'WENTWRONG_BAR' }));
    if (history.location.pathname !== '/') {
        history.push('/warehouse');
    }
};

/***********************Edit Warehouse ******************* */
export const editWarehouse = (warehouseId, newDetails) => (
    dispatch, getState, { getFirebase }
) => {

    const uid = getState().firebase.auth.uid;

    const firestore = getFirebase().firestore();

    firestore
        .collection('users')
        .doc(uid)
        .collection('warehouse')
        .doc(warehouseId)
        .update({ ...newDetails })
        .then(() => {
            // index.partialUpdateObject({ objectID: itemId, ...newItemDetails })
            dispatch({ type: 'EDIT_WAREHOUSE', payload: { warehouseId, newDetails } });

        })
        .catch((err) => dispatch({ type: 'WENTWRONG_BAR' }));
    // if (history.location.pathname !== '/') {
    //     history.push('/items');
    // }
};

/************************* Update Stock *********************/
export const update = (warehouseId, stockData) => (
    dispatch, getState, { getFirebase }
) => {

    const uid = getState().firebase.auth.uid;

    const firestore = getFirebase().firestore();

    firestore
        .collection('users')
        .doc(uid)
        .collection('warehouse')
        .doc(warehouseId)
        .update({ ...stockData })
        .then(() => {
            // index.partialUpdateObject({ objectID: itemId, ...newItemDetails })
            dispatch({ type: 'EDIT_WAREHOUSE', payload: { warehouseId, stockData } });

        })
        .catch((err) => dispatch({ type: 'WENTWRONG_BAR' }));
    // if (history.location.pathname !== '/') {
    //     history.push('/items');
    // }
};



