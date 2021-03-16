import history from '../../others/history';
import db from '../../db';


/* ******************* Create Item ******************* */

export const createItem = (itemDetails) => (
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
        .collection('items')
        .add({ ...itemDetails })
        .then((res) => {
            dispatch({ type: 'CREATE_ITEM', payload: itemDetails });

            // save item to algolia index
            const itemToAdd = {
                id: res.id,
                itemName: itemDetails.itemName,
                displayName: itemDetails.displayName,
                sellingPrice: itemDetails.sellingPrice,
                stockInShop: itemDetails.stockInShop
            }
            db.table('items').add(itemToAdd).then((id) => {
                dispatch({
                    type: 'CREATE_ITEM',
                    payload: itemToAdd,
                });
            }

            )
            // history.push(`/items`);
        })
        .catch((err) => {
            dispatch({ type: 'CREATE_ITEM_ERROR', err });
            dispatch({ type: 'WENTWRONG_BAR' });
        })
        .finally(() => dispatch({ type: 'CREATE_BUTTON', payload: false }));
};

/* ************* Load Items From IndexDB *************************** */
export const loadItems = () => {
    return (dispatch) => {
        db.table('items')
            .toArray()
            .then((items) => {
                dispatch({
                    type: 'LOAD_ITEMS',
                    payload: items,
                });
            });
    };
}

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
            // delete item from indexDb
            db.table('items')
                .delete(itemId)
                .then(() => {
                    dispatch({
                        type: 'DELETE_ITEM',
                        payload: itemId
                    });
                });
        })
        .catch((err) => dispatch({ type: 'WENTWRONG_BAR' }));
    if (history.location.pathname !== '/') {
        history.push('/items');
    }
};

export const editItem = (itemId, newItemDetails) => (
    dispatch, getState, { getFirebase }
) => {

    const uid = getState().firebase.auth.uid;

    const firestore = getFirebase().firestore();

    firestore
        .collection('users')
        .doc(uid)
        .collection('items')
        .doc(itemId)
        .update({ ...newItemDetails })
        .then(() => {
            // index.partialUpdateObject({ objectID: itemId, ...newItemDetails })
            dispatch({ type: 'CREATE_ITEM', payload: newItemDetails });

        })
        .catch((err) => dispatch({ type: 'WENTWRONG_BAR' }));
    if (history.location.pathname !== '/') {
        history.push('/items');
    }
};