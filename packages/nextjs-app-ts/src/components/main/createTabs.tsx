import { Menu } from 'antd';
import Link from 'next/link';
import React from 'react';
import { Route } from 'react-router-dom';
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
 * Helper function that creates pages with routes.  It also creates tabs (menu items) associated with those routes, so that you can click on them to navigate to the page.
 * @param pageList
 * @param route
 * @param setRoute
 * @returns
 */
export const createTabs = (
  pageList: TContractPageList,
  route: string,
  setRoute: (route: string) => void
): { tabMenu: JSX.Element } => {
  const getPath = (n: string): string => {
    return n.replaceAll(' ', '-');
  };

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
          href="/">
          {pageList.mainPage.name}
        </Link>
      </Menu.Item>
      {pageList.pages.map(({ name }) => (
        <Menu.Item key={name}>
          <Link
            onClick={(): void => {
              setRoute(getPath(name));
            }}
            href={name}>
            {name}
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  );

  return { tabMenu: tabMenu };
};
