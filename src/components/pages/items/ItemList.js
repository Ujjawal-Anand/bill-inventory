import React, { useState } from 'react';
//Vendor
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useDispatch } from 'react-redux';
// Custom
import { ItemList as ItemListTable } from '../../styledComponents/items/itemTables';
import {
    deleteItem
} from '../../../redux/actions/itemActions';
import {
    confirmDeleteAction
} from '../../../redux/actions/alertDialogActions';
import {
    openAddItemDialog, openUpdateStockDialog
} from '../../../redux/actions/alertDialogActions';

// Component
function ItemList(props) {
    const { item, index } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch();
    const open = Boolean(anchorEl);
    let stock = '';

    for (let [key, value] of Object.entries(item.stock)) {
        stock += `${key} : ${value}, `
    }

    const currencySign = item.currency === 'usd' ? '$' : '₹';

    const handleOptionOpen = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleOptionClose = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setAnchorEl(null);
    };

    const handleDeleteItem = (e) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch(confirmDeleteAction(deleteItem(item.id)));
        setAnchorEl(null);
    };

    const handleEditItem = (e) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch(openAddItemDialog({ open: true, item }));
        setAnchorEl(null);
    }

    const handleUpdateStock = (e) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch(openUpdateStockDialog({ openUpdateStock: true, item }));
        setAnchorEl(null);
    }

    return (

        <ItemListTable>
            <p className="number">{index + 1}</p>

            <p className="name">{item.itemName}<br />{item.displayName ? item.displayName : ''}</p>
            <p className="displayName">{stock}</p>


            <p className="rate">
                {currencySign +
                    item.sellingPrice.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
            </p>

            <p className="option">
                <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleOptionOpen}
                    tabIndex={1}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left'
                    }}
                    keepMounted
                    open={open}
                    onClose={handleOptionClose}
                >
                    <MenuItem onClick={handleDeleteItem}>
                        <p>Delete Item</p>
                    </MenuItem>
                    <MenuItem onClick={handleEditItem}>
                        <p>Edit Item</p>
                    </MenuItem>
                    <MenuItem onClick={handleUpdateStock}>
                        <p>Update Stock</p>
                    </MenuItem>

                </Menu>
            </p>
        </ItemListTable>

    );
}

export default ItemList;
