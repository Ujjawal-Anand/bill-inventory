import React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';

// Pages Components
import Dashboard from './components/pages/dashboard/Dashboard';
// import NewInvoice from './components/pages/create/NewInvoice';
import Invoice from './components/pages/create/invoice/Invoice';
import NewItem from './components/pages/create/NewItem';
// import Items from './components/pages/items/Items';
import AntdItems from './components/pages/items/AntdItems';
// import Invoices from './components/pages/invoices/Invoices';
import AntdInvoices from './components/pages/invoices/AntdInvoices';
import Settings from './components/pages/settings/Settings';
import InvoiceDetails from './components/pages/view/InvoiceDetails';
import EditSettings from './components/pages/settings/EditSettings';
import NotFound from './components/loaders/404/NotFound';
import Warehouse from './components/pages/warehouse/Warehouse';


function AllAppRoutes() {
  return (
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route exact path="/create" component={Invoice} />
      <Route exact path="/item/create" component={NewItem} />
      <Route exact path="/warehouse" component={Warehouse} />
      <Route exact path="/items" component={AntdItems} />
      <Route exact path="/invoices" component={AntdInvoices} />
      <Route exact path="/settings" component={Settings} />
      <Route exact path="/settings/edit" component={EditSettings} />
      <Route exact path="/invoice/:id" component={InvoiceDetails} />
      {/* <Route exact path="/register" render={() => <Redirect to="/" />} /> */}
      <Route exact path="/login" render={() => <Redirect to="/" />} />
      <Route exact path="/login" render={() => <Redirect to="/" />} />

      <Route component={NotFound} />
    </Switch>
  );
}

export default AllAppRoutes;
