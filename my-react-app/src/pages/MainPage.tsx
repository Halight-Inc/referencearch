import React, { Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom'; // Removed BrowserRouter, changed to Route and Routes
import { useSelector } from 'react-redux';
import { CSpinner, useColorModes } from '@coreui/react';
import '../scss/style.scss';
import '../scss/examples.scss';
import "../App.css";

// Containers
const DefaultLayout = React.lazy(() => import('../layout/DefaultLayout.js'));

// Pages
const Login = React.lazy(() => import('../views/pages/login/Login.js'));
const Register = React.lazy(() => import('../views/pages/register/Register.js'));
const Page404 = React.lazy(() => import('../views/pages/page404/Page404.js'));
const Page500 = React.lazy(() => import('../views/pages/page500/Page500.js'));

const MainPage: React.FC = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const storedTheme = useSelector((state: any) => state.theme);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
    const theme = urlParams.get('theme') && urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)?.[0];
    if (theme) {
      setColorMode(theme);
    }

    if (isColorModeSet()) {
      return;
    }

    setColorMode(storedTheme);
  }, [setColorMode, isColorModeSet, storedTheme]);

  return (
    <Suspense
      fallback={
        <div className="pt-3 text-center">
          <CSpinner color="primary" variant="grow" />
        </div>
      }
    >
      <Routes> {/* No more BrowserRouter here */}
        <Route path="/login" element={<Login />} /> {/* These are child routes of /dashboard */}
        <Route path="/register" element={<Register />} />
        <Route path="/404" element={<Page404 />} />
        <Route path="/500" element={<Page500 />} />
        <Route path="*" element={<DefaultLayout />} /> {/* Default child route*/}
      </Routes>
    </Suspense>
  );
};

export default MainPage;
