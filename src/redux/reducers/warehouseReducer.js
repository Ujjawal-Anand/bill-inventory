const initState = { warehouse: [] };
const itemReducer = (state = initState, action) => {
    switch (action.type) {
        case 'LOAD_WAREHOUSE':
            return { items: action.payload };
        case 'CREATE_WAREHOUSE':
            return { warehouse: [...state.warehouse, action.payload] };
        case 'EDIT_WAREHOUSE':
            return {
                warehouse: state.warehouse.map(item => (
                    item.id === action.payload.warehouseId ?
                        { ...item, ...action.payload.newDetails } : item
                ))
            };
        case 'CREATE_WAREHOUSE_ERROR':
            return state;
        case 'DELETE_WAREHOUSE':
            return { warehouse: state.warehouse.filter((item) => item.id !== action.payload) };
        default:
            return state;
    }
};
export default itemReducer;
