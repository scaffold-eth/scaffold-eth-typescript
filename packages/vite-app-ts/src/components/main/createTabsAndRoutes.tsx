import { Menu } from 'antd';
import React, { ReactElement } from 'react';
import { Link, Route } from 'react-router-dom';
/**
 * A name and element that represents a page
 */
type TContractPage = {
  name: string;
  content: JSX.Element;
};

export type TContractPageList = {
  /**
   * the default page to load on route '/'
   */
  mainPage: TContractPage;
  /**
   * an array of all the other pages
   */
  pages: TContractPage[];
};

/**
 * Returns a user-friendly path.
 * @param n
 */
const getPath = (n: string): string => {
  return n.replaceAll(' ', '-').toLowerCase();
};

/**
 * Helper function that creates pages with routes.  It also creates tabs (menu items) associated with those routes, so that you can click on them to navigate to the page.
 * @param pageList
 * @param route
 * @param setRoute
 * @returns
 */
export const createTabsAndRoutes = (
  pageList: TContractPageList,
  route: string,
  setRoute: (route: string) => void
): { tabMenu: ReactElement; routeContent: ReactElement } => {
  const tabMenu = (
    <Menu
      style={{
        textAlign: 'center',
      }}
      selectedKeys={[route]}
      mode="horizontal">
      <Menu.Item key="/">
        <Link
          onClick={(): void => {
            setRoute('/');
          }}
          to="/">
          {pageList.mainPage.name}
        </Link>
      </Menu.Item>
      {pageList.pages.map(({ name }) => (
        <Menu.Item key={name}>
          <Link
            onClick={(): void => {
              setRoute(getPath(name));
            }}
            to={getPath(name)}>
            {name}
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  );

  const routeContent = (
    <>
      <Route key={'main'} exact path={'/'}>
        {pageList.mainPage.content}
      </Route>
      {pageList.pages.map(({ name, content }) => (
        <Route key={name} path={'/' + getPath(name)}>
          {content}
        </Route>
      ))}
    </>
  );

  return { tabMenu: tabMenu, routeContent };
};
