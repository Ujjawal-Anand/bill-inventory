const initState = {};
const itemReducer = (state = initState, action) => {
    switch (action.type) {
        case 'CREATE_ITEM':
            return state;
        case 'CREATE_ITEM_ERROR':
            return state;
        case 'DELETE_ITEM':
            return state;
        default:
            return state;
    }
};
export default itemReducer;
