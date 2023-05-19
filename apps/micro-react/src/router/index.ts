import auth, { AuthParams, UserPermission } from '../utils/authentication';
import { useEffect, useMemo, useState } from 'react';

export type IRoute = AuthParams & {
  name: string;
  key: string;
  // 当前页是否展示面包屑
  breadcrumb?: boolean;
  children?: IRoute[];
  // 当前路由是否渲染菜单项，为 true 的话不会在菜单中显示，但可通过路由地址访问。
  ignore?: boolean;
  component?: any;
  path?: string;
};

export type INewRoute = IRoute & {
  children: INewRoute[];
};

export const routes: IRoute[] = [
  {
    name: 'menu.notepad',
    key: 'notepad',
    children: [
      {
        name: 'menu.notepad.plan',
        key: 'notepad/plan',
      },
    ],
  },
  {
    name: 'menu.photoCollection',
    key: 'photoCollection',
    children: [
      {
        name: 'menu.photoCollection.scenery',
        key: 'photoCollection/scenery',
      },
    ],
  },
  {
    name: 'menu.storage',
    key: 'storage',
    children: [
      {
        name: 'menu.storage.file',
        key: 'storage/importantFile',
      },
    ],
  },
];

// 根据路由路径获取对应路由name
export const getName = (path: string, routes: IRoute[]): any => {
  return routes.find((item) => {
    const itemPath = `/${item.key}`;
    if (path === itemPath) {
      return item.name;
    } else if (item.children) {
      return getName(path, item.children);
    }
  });
};

//根据角色对对应路由赋值权限 result: {'menu.photoCollection.ugly': ['read']}
export const generatePermission = (role: string) => {
  const actions = role === 'admin' ? ['*'] : ['read'];
  const result: UserPermission = {};
  routes.forEach((item) => {
    if (item.children) {
      item.children.forEach((child) => {
        result[child.name] = actions;
      });
    }
  });
  return result;
};

const useRoute = (userPermission: UserPermission): [IRoute[], string] => {
  const filterRoute = (
    routes: IRoute[],
    arr: Array<INewRoute | IRoute> = [],
  ): IRoute[] => {
    if (!routes.length) {
      return [];
    }
    for (const route of routes) {
      const { requiredPermissions, oneOfPerm } = route;
      let visible = true;
      if (requiredPermissions) {
        visible = auth({ requiredPermissions, oneOfPerm }, userPermission);
      }

      if (!visible) {
        continue;
      }
      if (route.children && route.children.length) {
        const newRoute: INewRoute = { ...route, children: [] };
        filterRoute(route.children, newRoute.children);
        if (newRoute.children.length) {
          arr.push(newRoute);
        }
      } else {
        arr.push({ ...route });
      }
    }

    return arr;
  };

  const [permissionRoute, setPermissionRoute] = useState(routes);

  useEffect(() => {
    const newRoutes = filterRoute(routes);
    setPermissionRoute(newRoutes);
  }, [JSON.stringify(userPermission)]);

  const defaultRoute = useMemo(() => {
    const first = permissionRoute[0];
    if (first) {
      const firstRoute = first?.children?.[0]?.key || first.key;
      return firstRoute;
    }
    return '';
  }, [permissionRoute]);

  return [permissionRoute, defaultRoute];
};

export default useRoute;
