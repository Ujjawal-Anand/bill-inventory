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
import ItemList from './ItemList';
import ItemListLoader from '../../loaders/dashboard/ItemListLoader';
import NoItem from '../../loaders/welcome/NoItem';
import AddItemDialog from '../../dialog/AddItemDialog'

// Component
function Items() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.firestore.ordered.items);
  let tableListItems;

  if (isLoaded(items) && isEmpty(items))
    return (
      <>
        <Header title={'Items'} />
        <NoItem />
      </>
    );

  if (isLoaded(items)) {
    tableListItems = items.map((item, index) => (
      <ItemList item={item} key={item.id} index={index} />
    ));
  }
  if (!isLoaded(items)) {
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
            <p className="listHead displayName">Display Name</p>
            <p className="listHead rate">Rate</p>
            <p className="listHead option"></p>
          </ItemListHead>
          {tableListItems}
        </ItemTable>
      </div>
      <AddItemDialog />
    </div>
  );
}

export default Items;
