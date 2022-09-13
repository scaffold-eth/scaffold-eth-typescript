import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { MainPage } from '~~/components/main/MainPage';
import { TPageProps } from '~~/models/TAppProps';

const Page: FC<TPageProps> = (props) => {
  // -----------------------------
  // 🔗 Get current url path
  // -----------------------------
  const router = useRouter();
  // remove starting '/' from path
  const slug = router.asPath;
  let urlPath = 'main';

  if (slug.length > 1 && slug.startsWith('/')) {
    urlPath = slug.substring(1);
  }

  return (
    <div className="App">
      <Head>
        <title>Scaffold-eth-typescript</title>
        <meta name="description" content="Generated from Scaffold-eth-typescript" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainPage pageName={urlPath} {...props}></MainPage>;
    </div>
  );
};

export default Page;
