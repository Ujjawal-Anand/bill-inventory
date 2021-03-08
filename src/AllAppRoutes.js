import React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';

// Pages Components
import Dashboard from './components/pages/dashboard/Dashboard';
import NewInvoice from './components/pages/create/NewInvoice';
import NewItem from './components/pages/create/NewItem';
import Invoices from './components/pages/items/Items';
import Items from './components/pages/invoices/Invoices';
import Settings from './components/pages/settings/Settings';
import InvoiceDetails from './components/pages/view/InvoiceDetails';
import EditSettings from './components/pages/settings/EditSettings';
import NotFound from './components/loaders/404/NotFound';

function AllAppRoutes() {
  return (
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route exact path="/create" component={NewInvoice} />
      <Route exact path="/item/create" component={NewItem} />
      <Route exact path="/items" component={Invoices} />
      <Route exact path="/invoices" component={Items} />
      <Route exact path="/settings" component={Settings} />
      <Route exact path="/settings/edit" component={EditSettings} />
      <Route exact path="/invoice/:id" component={InvoiceDetails} />
      <Route exact path="/register" render={() => <Redirect to="/" />} />
      <Route exact path="/login" render={() => <Redirect to="/" />} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default AllAppRoutes;
