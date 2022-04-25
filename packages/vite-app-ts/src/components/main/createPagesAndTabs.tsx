import { Menu } from 'antd';
import React from 'react';
import { Link, Route } from 'react-router-dom';
/**
 * A name and element that represents a page
 */
type TContractPage = {
  name: string;
  element: JSX.Element;
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
 * Helper function that creates pages with routes.  It also creates tabs (menu items) associated with those routes, so that you can click on them to navigate to the page.
 * @param pageList
 * @param route
 * @param setRoute
 * @returns
 */
export const createPagesAndTabs = (
  pageList: TContractPageList,
  route: string,
  setRoute: (route: string) => void
): { menuElement: JSX.Element; pageElements: JSX.Element } => {
  const getPath = (n: string): string => {
    return n.replaceAll(' ', '-');
  };

  const menuElement = (
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
      {pageList.pages.map(({ name, element }) => (
        <Menu.Item key={name}>
          <Link
            onClick={(): void => {
              setRoute(getPath(name));
            }}
            to={name}>
            {name}
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  );

  const pageElements = (
    <>
      <Route key={'main'} exact path={'/'}>
        {pageList.mainPage.element}
      </Route>
      {pageList.pages.map(({ name, element }) => (
        <Route key={name} path={'/' + getPath(name)}>
          {element}
        </Route>
      ))}
    </>
  );

  return { menuElement, pageElements };
};
