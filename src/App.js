import React from 'react';
import Loadable from 'react-loadable';
// Vendor
import { Redirect, Switch, Route } from 'react-router-dom';
// Styled Components
import { BodyContainer } from './components/styledComponents/layout/BodyContainer';
import SideBar from './components/sidebar/SideBar';

// Firestore
import { useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { useSelector, useDispatch } from 'react-redux';
// import SignUp from './components/pages/auth/SignUp';
import Login from './components/pages/auth/Login';
import BottomNavigation from './components/bottomNavigation/BottomNavigation';
import AlertDialog from './components/dialog/Dialog';
import ForgotPassword from './components/pages/auth/ForgotPassword';
import AlertSnackbar from './components/snackbar/SnackBar';
import AppLoader from './components/loaders/app/AppLoader';
import { loadItems } from "./redux/actions/itemActions";
import { resetDatabase } from './models/db';

const LazyApp = Loadable({
  loader: () => import('./AllAppRoutes'),
  loading: AppLoader
});

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.firebase.auth);

  useFirestoreConnect([
    {
      collection: 'users',
      doc: auth.uid || ' ',
      subcollections: [
        { collection: 'invoices', orderBy: ['invoiceDate', 'desc'] }
      ],
      storeAs: 'invoices'
    },
    {
      collection: 'users',
      doc: auth.uid || ' ',
      subcollections: [
        { collection: 'items', orderBy: ['createdAt', 'desc'] }
      ],
      storeAs: 'items'
    },
    {
      collection: 'users',
      doc: auth.uid || ' ',
      subcollections: [
        { collection: 'warehouse', orderBy: ['createdAt', 'asc'] }
      ],
      storeAs: 'warehouse'
    }
  ]);

  const items = useSelector((state) => state.firestore.ordered.items);


  if (!isLoaded(auth) || !isLoaded(items)) {
    return <AppLoader />;
  }

  if (isLoaded(items) && !isEmpty(items)) {
    resetDatabase(items);
  }
  dispatch(loadItems());


  if (isEmpty(auth))
    return (
      <Switch>
        {/* <Route exact path="/register" component={SignUp} /> */}
        <Route exact path="/login" component={Login} />
        <Route exact path="/forgot" component={ForgotPassword} />
        <Route render={() => <Redirect to="/login" />} />
      </Switch>
    );

  return (
    <BodyContainer>
      <SideBar />
      <div>
        <LazyApp />
      </div>
      <BottomNavigation />
      <AlertDialog />
      <AlertSnackbar />
    </BodyContainer>
  );
}

export default App;
