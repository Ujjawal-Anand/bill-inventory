import React from 'react';
//Vendor
import Header from '../../header/Header';
import { useSelector, useDispatch } from 'react-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';
// Custom
import {
    ItemTable,
    ItemListHead,
    TableHeading
} from '../../styledComponents/items/itemTables';
import {
    openAddItemDialog
} from '../../../redux/actions/alertDialogActions';
import { Button } from '../../styledComponents/shared/Button'
import WarehouseList from './WarehouseList';
import ItemListLoader from '../../loaders/dashboard/ItemListLoader';
import NoItem from '../../loaders/welcome/NoItem';
import AddWarehouseDialog from '../../dialog/AddWarehouseDialog.js'

// Component
function Warehouse() {
    const dispatch = useDispatch();
    const settings = useSelector(
        (state) => state.firebase.profile && state.firebase.profile.settings
    );

    const items = [...useSelector((state) => state.firestore.ordered.warehouse ?
        state.firestore.ordered.warehouse : [])];

    if (isLoaded(settings)) {
        items.push({
            name: settings.companyName,
            address: settings.companyAddress,
            mobile: settings.mobile
        })
    }


    let tableListItems;

    if (isEmpty(items))
        return (
            <>
                <Header title={'Items'} />
                <NoItem />
            </>
        );

    if (!isEmpty(items)) {
        tableListItems = items.map((item, index) => (
            <WarehouseList warehouse={item} key={item.id} index={index} />
        ));
    }
    if (!isLoaded(settings) && !isLoaded(items)) {
        tableListItems = Array.from({ length: 10 }).map((item, index) => (
            <ItemListLoader key={index} />
        ));
    }
    return (
        <div>
            <Header title={'Warehouse'} />
            <div style={{ padding: '1rem' }}>
                <ItemTable style={{ margin: '0 auto' }}>
                    <TableHeading>
                        <h2>Warehouse List</h2>
                        <Button onClick={() => dispatch(openAddItemDialog({ open: true }))}>Add Warehouse</Button>
                    </TableHeading>
                    <ItemListHead>
                        <p className="listHead number">Sr.No.</p>
                        <p className="listHead name">Name</p>
                        <p className="listHead displayName">Address</p>
                        <p className="listHead rate">Mobile</p>
                        <p className="listHead option"></p>
                    </ItemListHead>
                    {tableListItems}
                </ItemTable>
            </div>
            <AddWarehouseDialog />
        </div>
    );
}

export default Warehouse;
