import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Route, Redirect, Switch, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NProgress from 'nprogress';
import qs from 'query-string';
import { Layout, Menu, Breadcrumb, Spin } from '@arco-design/web-react';
import {
  IconImage,
  IconFolder,
  IconFile,
  IconMenuUnfold,
  IconMenuFold,
} from '@arco-design/web-react/icon';

import lazyload from './utils/lazyload';
import Navbar from './components/NavBar';
import getUrlParams from './utils/getUrlParams';
import { IRoute } from './router';
import { GlobalState } from './store';
import useLocale from './utils/useLocale';
import useRoute from './router';
import './styles/layout.css';

export type IWindow = Window &
  typeof globalThis & { microApp: Record<string, any> };

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

const Sider = Layout.Sider;
const Content = Layout.Content;

const getIconFromKey = (key: string) => {
  switch (key) {
    case 'notepad':
      return <IconFile className={`icon`} />;
    case 'photoCollection':
      return <IconImage className={`icon`} />;
    case 'storage':
      return <IconFolder className={`icon`} />;
    default:
      return <div className={'icon-empty'} />;
  }
};

const getFlattenRoutes = (routes: IRoute[]) => {
  const res: IRoute[] = [];
  function travel(_routes: IRoute[]) {
    _routes.forEach((route) => {
      const visibleChildren = (route.children || []).filter(
        (child) => !child.ignore,
      );
      if (route.key && (!route.children || !visibleChildren.length)) {
        try {
          route.component = lazyload(() => import(`./pages/${route.key}`));
          res.push(route);
        } catch (e) {
          console.error(e);
        }
      }
      if (route.children && route.children.length) {
        travel(route.children);
      }
    });
  }
  travel(routes);
  return res;
};

function PageLayout() {
  const urlParams = getUrlParams();
  const history = useHistory();
  const pathname = history.location.pathname;
  const currentComponent = qs.parseUrl(pathname).url.slice(1);
  const [, translate] = useLocale();
  const { settings, userLoading, userInfo } = useSelector(
    (state: GlobalState) => state,
  );

  const [routes, defaultRoute] = useRoute(
    userInfo?.permissions as Record<string, string[]>,
  );
  const defaultSelectedKeys = [currentComponent || defaultRoute];
  const paths = (currentComponent || defaultRoute).split('/');
  const defaultOpenKeys = paths.slice(0, paths.length - 1);

  const [breadcrumb, setBreadCrumb] = useState<React.ReactNode[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] =
    useState<string[]>(defaultSelectedKeys);
  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys);

  const routeMap = useRef<Map<string, React.ReactNode[]>>(new Map());
  const menuMap = useRef<
    Map<string, { menuItem?: boolean; subMenu?: boolean }>
  >(new Map());

  const navbarHeight = 60;
  const menuWidth = collapsed ? 48 : settings!.menuWidth;

  const showNavbar = settings!.navbar && urlParams.navbar !== false;
  const showMenu = settings!.menu && urlParams.menu !== false;

  const flattenRoutes = useMemo(() => getFlattenRoutes(routes) || [], [routes]);

  function renderRoutes(translate: (key: string) => string) {
    routeMap.current.clear();
    return function travel(
      _routes: IRoute[],
      level: number,
      parentNode: string[] = [],
    ) {
      return _routes.map((route) => {
        const { breadcrumb = true, ignore } = route;
        const iconDom = getIconFromKey(route.key);
        const titleDom = (
          <>
            {iconDom} {translate(route.name) || route.name}
          </>
        );

        routeMap.current.set(
          `/${route.key}`,
          breadcrumb ? [...parentNode, route.name] : [],
        );

        const visibleChildren = (route.children || []).filter((child) => {
          const { ignore, breadcrumb = true } = child;
          if (ignore || route.ignore) {
            routeMap.current.set(
              `/${child.key}`,
              breadcrumb ? [...parentNode, route.name, child.name] : [],
            );
          }

          return !ignore;
        });

        if (ignore) {
          return '';
        }
        if (visibleChildren.length) {
          menuMap.current.set(route.key, { subMenu: true });
          return (
            <SubMenu key={route.key} title={titleDom}>
              {travel(visibleChildren, level + 1, [...parentNode, route.name])}
            </SubMenu>
          );
        }
        menuMap.current.set(route.key, { menuItem: true });
        return <MenuItem key={route.key}>{titleDom}</MenuItem>;
      });
    };
  }

  function onClickMenuItem(key: string) {
    const currentRoute = flattenRoutes.find((r) => r.key === key) as IRoute;
    const component = currentRoute.component;
    const preload = component.preload();
    NProgress.start();
    preload.then(() => {
      history.push(currentRoute.path ? currentRoute.path : `/${key}`);
      NProgress.done();
    });
  }

  function toggleCollapse() {
    setCollapsed((collapsed) => !collapsed);
  }

  const paddingLeft = showMenu ? { paddingLeft: menuWidth } : {};
  const paddingTop = showNavbar ? { paddingTop: navbarHeight } : {};
  const paddingStyle = { ...paddingLeft, ...paddingTop };

  function updateMenuStatus() {
    const pathKeys = pathname.split('/');
    const newSelectedKeys: string[] = [];
    const newOpenKeys: string[] = [...openKeys];
    while (pathKeys.length > 0) {
      const currentRouteKey = pathKeys.join('/');
      const menuKey = currentRouteKey.replace(/^\//, '');
      const menuType = menuMap.current.get(menuKey);
      if (menuType && menuType.menuItem) {
        newSelectedKeys.push(menuKey);
      }
      if (menuType && menuType.subMenu && !openKeys.includes(menuKey)) {
        newOpenKeys.push(menuKey);
      }
      pathKeys.pop();
    }
    setSelectedKeys(newSelectedKeys);
    setOpenKeys(newOpenKeys);
  }

  useEffect(() => {
    const routeConfig = routeMap.current.get(pathname);
    setBreadCrumb(routeConfig || []);
    updateMenuStatus();
  }, [pathname]);

  return (
    <Layout className={`layout`}>
      <div
        className={`layout-navbar ${!showNavbar ? 'layout-navbar-hidden' : ''}`}
      >
        <Navbar show={showNavbar} />
      </div>
      {userLoading ? (
        <Spin className={'spin'} />
      ) : (
        <Layout>
          {showMenu && (
            <Sider
              className={'layout-sider'}
              width={menuWidth}
              collapsed={collapsed}
              onCollapse={setCollapsed}
              trigger={null}
              collapsible
              breakpoint="xl"
              style={paddingTop}
            >
              <div className={'menu-wrapper'}>
                <Menu
                  collapse={collapsed}
                  onClickMenuItem={onClickMenuItem}
                  selectedKeys={selectedKeys}
                  openKeys={openKeys}
                  onClickSubMenu={(_: any, openKeys: string[]) =>
                    setOpenKeys(openKeys)
                  }
                >
                  {renderRoutes(translate)(routes, 1)}
                </Menu>
              </div>
              <div className={'collapse-btn'} onClick={toggleCollapse}>
                {collapsed ? <IconMenuUnfold /> : <IconMenuFold />}
              </div>
            </Sider>
          )}
          <Layout className={'layout-content'} style={paddingStyle}>
            <div className={'layout-content-wrapper'}>
              {!!breadcrumb.length && (
                <div className={'layout-breadcrumb'}>
                  <Breadcrumb>
                    {breadcrumb.map((node, index) => (
                      <Breadcrumb.Item key={index}>
                        {typeof node === 'string'
                          ? translate(node) || node
                          : node}
                      </Breadcrumb.Item>
                    ))}
                  </Breadcrumb>
                </div>
              )}
              <Content>
                <Switch>
                  {flattenRoutes.map((route, index) => {
                    return (
                      <Route
                        key={index}
                        path={`/${route.key}`}
                        component={route.component}
                      />
                    );
                  })}
                  <Route exact path="/">
                    <Redirect to={`/${defaultRoute}`} />
                  </Route>
                </Switch>
              </Content>
            </div>
          </Layout>
        </Layout>
      )}
    </Layout>
  );
}

export default PageLayout;
