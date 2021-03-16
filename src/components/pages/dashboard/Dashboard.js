import React from 'react';
//Vendor
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';
// Custom
import Header from '../../header/Header';
import FulfilledInvoice from './widgets/FulfilledInvoice';
import PendingInvoice from './widgets/PendingInvoice';
import RecentInvoices from './widgets/RecentInvoices';
import Welcome from '../../loaders/welcome/Welcome';
import TodaySales from './widgets/TodaySales';
import ItemSold from './widgets/ItemSoldList';

// Component
function Dashboard() {
  const invoices = useSelector((state) => state.firestore.ordered.invoices);

  if (isLoaded(invoices) && isEmpty(invoices))
    return (
      <>
        <Header title={'Dashboard'} />
        <Welcome />
      </>
    );

  return (
    <div>
      <Header title={'Dashboard'} />
      <Grid container justify="center" align-items="center">
        <Grid item xs={12} sm={4} md={4}>
          <TodaySales invoices={invoices} />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <FulfilledInvoice invoices={invoices} />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <PendingInvoice invoices={invoices} />
        </Grid>
      </Grid>

      <Grid
        container
        justify="center"
        align-items="center"
        style={{ marginTop: '3rem', width: '100%' }}
      >
        <Grid item xs={12} md={12} lg={9}>
          <RecentInvoices invoices={invoices} />
        </Grid>

        <Grid item md={3} lg={3}>
          <ItemSold invoices={invoices} />
        </Grid>

      </Grid>
    </div>
  );
}

export default Dashboard;
