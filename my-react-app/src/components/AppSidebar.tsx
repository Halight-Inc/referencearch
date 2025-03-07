import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
  CNavItem,
  CNavTitle
} from '@coreui/react';
import CIcon from '@coreui/icons-react';

import { AppSidebarNav } from './AppSidebarNav';
import { logo } from '@/assets/brand/logo';
import { sygnet } from '@/assets/brand/sygnet';
import navigation from '@/_nav';
import { INavGroup, INavLink } from './AppSidebarNav';

// Define the type for the useSelector state
interface RootState {
  sidebarUnfoldable: boolean;
  sidebarShow: boolean;
  // Add other state properties if needed
}

// Helper function to adjust the navigation component
const adjustNavComponent = (nav: (INavGroup | INavLink)[]): (INavGroup | INavLink)[] => {
  return nav.map((item) => {
    if ((item as INavGroup).items) {
      return {
        ...item,
        component: CNavItem,
        items: adjustNavComponent((item as INavGroup).items!)
      } as INavGroup
    }

    if ((item as INavLink).name && !(item as INavLink).to) {
      return {
        ...item,
        component: CNavTitle
      } as INavLink
    }
     return {
       ...item,
      component: CNavItem,
    } as INavLink
  });
};

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state: RootState) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state: RootState) => state.sidebarShow);
    const adjustedNavigation = adjustNavComponent(navigation as (INavGroup | INavLink)[]);

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible });
      }}
    >
      <CSidebarHeader className="border-bottom">
             <CSidebarBrand>
                 <CIcon className="sidebar-brand-full" icon={logo} height={32} />
                 <CIcon className="sidebar-brand-narrow" icon={sygnet} height={32} />
             </CSidebarBrand>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={adjustedNavigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
