import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

import { AppSidebarNav } from './AppSidebarNav';
import { logo } from '@/assets/brand/logo';
import { sygnet } from '@/assets/brand/sygnet';
import navigation from '@/_nav';

// Define the type for the useSelector state
interface RootState {
  sidebarUnfoldable: boolean;
  sidebarShow: boolean;
  // Add other state properties if needed
}

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state: RootState) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state: RootState) => state.sidebarShow);

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
        <CSidebarBrand className='d-flex justify-content-center' to="/" component={Link}>
          <CIcon className="sidebar-brand-full" icon={logo} height={32} />
          <CIcon className="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
