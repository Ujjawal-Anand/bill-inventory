import React, { memo } from 'react';
//Vendor
import { Link } from 'react-router-dom';
import { SidePanel } from '../styledComponents/layout/sidebar/SidePanel';
// Custom
import NavLinks from './NavLinks';
import BillyLogo from '../../images/Billy-Logo.png';

// Component
function SideBar() {
  return (
    <SidePanel>
      <Link to="/">
        <img src={BillyLogo} alt="Billy Logo" />
      </Link>
      <NavLinks
        icon={'tio-dashboard_vs'}
        name={'Dashboard'}
        color={'#2E5BFF'}
        routeTo="/"
      />
      <NavLinks
        icon={'tio-add_circle'}
        name={'Create New'}
        color={'#6772E5'}
        routeTo="/create"
      />

      <NavLinks
        icon={'tio-add_circle'}
        name={'Items'}
        color={'#FDA734'}
        routeTo="/items"
      />
      <NavLinks
        icon={'tio-receipt'}
        name={'Invoices'}
        color={'#FD5665'}
        routeTo="/invoices"
      />
      <NavLinks
        icon={'tio-add_circle'}
        name={'Warehouse'}
        color={'#FDA734'}
        routeTo="/warehouse"
      />
      <NavLinks
        icon={' tio-settings_vs'}
        name={'Settings'}
        color={'#FDA734'}
        routeTo="/settings"
      />
    </SidePanel>
  );
}

export default memo(SideBar);
