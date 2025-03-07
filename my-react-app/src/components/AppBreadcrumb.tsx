
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react';
import routes from '../routes';
import { type IRoute } from '../types/routes';
import { type IBreadCrumb } from '../types/breadcrumb';

const AppBreadcrumb = () => {
  const location = useLocation();

  const getPathName = (pathname: string, routes: IRoute[]) => {
    const currentRoute = routes.find((route: IRoute) => {
      return route.path === pathname;
    });

    return currentRoute?.name || 'Unknown';
  };

  const breadcrumbs: IBreadCrumb[] = location.pathname.split('/').reduce((prev: IBreadCrumb[], _curr: string, index: number, array: string[]) => {
    const currentPathname = `/${array.slice(1, index + 1).join('/')}`;
    const routeName = getPathName(currentPathname, routes);
    prev.push({
      name: routeName,
      to: currentPathname,
    });
    return prev;
  }, []);

  const breadcrumbItems: IBreadCrumb[] = breadcrumbs.filter((item: IBreadCrumb) => item.name);

  return (
    <CBreadcrumb className="m-0 ms-2">
      <CBreadcrumbItem>
        <Link to="/">Home</Link>
      </CBreadcrumbItem>
      {breadcrumbItems.map((item, index) => (
        <CBreadcrumbItem key={index} active={index === breadcrumbItems.length - 1}>
          {item.to ? <Link to={item.to}>{item.name}</Link> : item.name}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  );
};

export default React.memo(AppBreadcrumb);
