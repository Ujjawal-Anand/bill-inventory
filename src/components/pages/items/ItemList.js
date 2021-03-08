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

// Component
function ItemList(props) {
    const { item, index } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch();
    const open = Boolean(anchorEl);

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

    return (
        
            <ItemListTable>
                <p className="number">{index+1}</p>
                
                <p className="name">{item.itemName}</p>
                <p className="displayName">{item.displayName ? item.displayName : item.itemName}</p>


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
                        
                    </Menu>
                </p>
            </ItemListTable>
       
    );
}

export default ItemList;
