import React from 'react';
// Custom
import { SideNavLink } from '../styledComponents/layout/sidebar/SideNavLink';

// Component
function NavLinks(props) {
  const { icon, name, color, routeTo } = props;
  return (
    <SideNavLink exact  color={color} to={routeTo}>
      <span>
        <i className={icon}></i>
      </span>{' '}
      <p>{name}</p>
    </SideNavLink>
  );
}

export default NavLinks;
