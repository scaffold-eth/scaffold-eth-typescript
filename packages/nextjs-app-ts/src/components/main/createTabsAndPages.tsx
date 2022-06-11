import { Menu } from 'antd';
import Link from 'next/link';
import React, { ReactElement } from 'react';

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
export const createTabsAndPages = (
  pageList: TContractPageList
): { tabMenu: ReactElement; pages: Record<string, ReactElement> } => {
  const tabMenu = (
    <Menu
      style={{
        textAlign: 'center',
      }}
      mode="horizontal">
      <Menu.Item key="/">
        <Link href="/">{pageList.mainPage.name}</Link>
      </Menu.Item>
      {pageList.pages.map(({ name }) => (
        <Menu.Item key={name}>
          <Link href={'/' + name}>{name}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );

  const pages: Record<string, ReactElement> = {};
  pageList.pages.map(({ name, content }) => (pages[name] = content));
  pages['main'] = pageList.mainPage.content;

  return { tabMenu, pages };
};
