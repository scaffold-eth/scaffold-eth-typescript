import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { MainPage } from '~~/components/main/MainPage';

const Page: FC = () => {
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

  return <MainPage pageName={urlPath}></MainPage>;
};

export default Page;
