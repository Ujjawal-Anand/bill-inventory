const initState = {
    displayName: '',
    itemName: '',
    sellingPrice: '',
    id: ''
};
const invoiceItemReducer = (state = initState, action) => {
    switch (action.type) {
        case 'ADD_INVOICE_ITEM':
            return action.payload ?
                {
                    ...action.payload,
                    id: action.payload.objectID
                } : initState;
        // case 'RESET_INVOICE_ITEM':

        default:
            return state;
    }
};
export default invoiceItemReducer;
