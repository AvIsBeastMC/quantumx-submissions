import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import { NextUIProvider } from "@nextui-org/react";

import { Shadows_Into_Light as Shadows_Into_LightFont } from 'next/font/google';
import { Inter as InterFont } from "next/font/google";
import { Manrope as ManropeFont } from "next/font/google";
import Head from "next/head";

export const ShadowsIntoLight = Shadows_Into_LightFont({
  subsets: ['latin'],
  weight: '400'
});

export const Manrope = ManropeFont({
  subsets: ['latin'],
  weight: '400'
});

export const Inter = InterFont({
  subsets: ['latin']
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>QUANTUMX Portal</title>
      </Head>
      <NextUIProvider>
        <div className={GeistSans.className}>
          <Component {...pageProps} />
        </div>
      </NextUIProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
