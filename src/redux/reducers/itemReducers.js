const initState = { items: [] };
const itemReducer = (state = initState, action) => {
    switch (action.type) {
        case 'LOAD_ITEMS':
            return { items: action.payload };
        case 'CREATE_ITEM':
            return { items: [...state.items, action.payload] };;
        case 'CREATE_ITEM_ERROR':
            return state;
        case 'DELETE_ITEM':
            return { items: state.items.filter((item) => item.id !== action.payload) };
        default:
            return state;
    }
};
export default itemReducer;
