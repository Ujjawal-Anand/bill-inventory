const initState = { items: [] };
const itemReducer = (state = initState, action) => {
    switch (action.type) {
        case 'LOAD_ITEMS':
            return { items: action.payload };
        case 'CREATE_ITEM':
            return { items: [...state.items, action.payload] };
        case 'EDIT_ITEM':
            return {
                items: state.items.map(item => (
                    item.id === action.payload.itemId ?
                        { ...item, ...action.payload.newItemDetails } : item
                ))
            };
        case 'UPDATE_ITEM_STOCK':
            return {
                items: state.items.map(item => (
                    item.id === action.payload.itemId ?
                        { ...item, stock: { ...action.payload.stock } } : item
                ))
            };

        case 'CREATE_ITEM_ERROR':
            return state;
        case 'DELETE_ITEM':
            return { items: state.items.filter((item) => item.id !== action.payload) };
        default:
            return state;
    }
};
export default itemReducer;
