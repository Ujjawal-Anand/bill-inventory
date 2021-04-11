import React from 'react';
//Vendor
import Header from '../../header/Header';
import { useSelector, useDispatch } from 'react-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import Divider from '@material-ui/core/Divider'

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
import ItemList from './ItemList';
import ItemListLoader from '../../loaders/dashboard/ItemListLoader';
import NoItem from '../../loaders/welcome/NoItem';
import AddItemDialog from '../../dialog/AddItemDialog'
import UpdateStockDialog from '../../dialog/UpdateStockDialog'

// Component
function Items() {
  const dispatch = useDispatch();
  const settings = useSelector(
    (state) => state.firebase.profile && state.firebase.profile.settings
  );
  const items = useSelector((state) => state.firestore.ordered.items);
  const warehouse = [...useSelector((state) => state.firestore.ordered.warehouse ?
    state.firestore.ordered.warehouse : [])];


  let tableListItems;

  if (isLoaded(items) && isLoaded(settings) && isEmpty(items))
    return (
      <>
        <Header title={'Items'} />
        <NoItem companyName={settings.companyName} />
      </>
    );
  if (isLoaded(settings)) {
    warehouse.push({
      name: settings.companyName,
      address: settings.companyAddress,
      mobile: settings.mobile
    })
  }


  if (isLoaded(items) && isLoaded(settings) && isLoaded(warehouse)) {
    tableListItems = items.map((item, index) => (
      <>
        <ItemList item={item} key={item.id} index={index} />
        <Divider />
      </>
    ));
  }
  if (!isLoaded(items) || !isLoaded(settings) || !isLoaded(warehouse)) {
    tableListItems = Array.from({ length: 10 }).map((item, index) => (
      <ItemListLoader key={index} />
    ));
  }
  return (
    <div>
      <Header title={'Items'} />
      <div style={{ padding: '1rem' }}>
        <ItemTable style={{ margin: '0 auto' }}>
          <TableHeading>
            <h2>Items List</h2>
            <Button onClick={() => dispatch(openAddItemDialog({ open: true }))}>Add Item</Button>
          </TableHeading>
          <ItemListHead>
            <p className="listHead number">Sr.No.</p>
            <p className="listHead name">Name</p>
            <p className="listHead displayName">Stock</p>
            <p className="listHead rate">Rate</p>
            <p className="listHead option"></p>
          </ItemListHead>
          {tableListItems}
        </ItemTable>
      </div>
      {settings && <AddItemDialog companyName={settings.companyName} />}
      {warehouse && <UpdateStockDialog warehouse={warehouse} />}
    </div>
  );
}

export default Items;
