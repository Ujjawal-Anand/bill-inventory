import React, { useState } from 'react';
//Vendor
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useDispatch } from 'react-redux';
// Custom
import { ItemList as WarehouseListTable } from '../../styledComponents/items/itemTables';
import {
    deleteWarehouse
} from '../../../redux/actions/warehouseActions';
import {
    confirmDeleteAction
} from '../../../redux/actions/alertDialogActions';

// Component
function WarehouseList(props) {
    const { warehouse, index } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch();
    const open = Boolean(anchorEl);

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

    const handleDeleteWarehouse = (e) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch(confirmDeleteAction(deleteWarehouse(warehouse.id)));
        setAnchorEl(null);
    };

    return (

        <WarehouseListTable>
            <p className="number">{index + 1}</p>

            <p className="name">{warehouse.name}</p>
            <p className="displayName">{warehouse.address}</p>


            <p className="rate">
                {warehouse.mobile}
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
                    <MenuItem onClick={handleDeleteWarehouse}>
                        <p>Delete Warehouse</p>
                    </MenuItem>

                </Menu>
            </p>
        </WarehouseListTable>

    );
}

export default WarehouseList;
