import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps,
}: AppProps<{ session?: Session | null }>) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
