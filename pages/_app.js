import "../styles/globals.css";
import { createTheme, NextUIProvider, globalCss } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { Nav } from "../components/Nav/Nav";
import Head from "next/head";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

const globalStyles = globalCss({
  html: {
    padding: 0,
    margin: 0,
    boxSizing: "border-box",
  },
  ".nextui-collapse-title": {
    fontSize: 16,
    fontWeight: "$semibold",
  },
});

const fonts = {
  sans: "Gilroy, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

export const lightTheme = createTheme({
  type: "light",
  theme: {
    fonts: fonts,
  },
});

export const darkTheme = createTheme({
  type: "dark",
  theme: {
    fonts: fonts,
  },
});

const MyApp = ({ Component, pageProps: { session, ...pageProps } }) => {
  globalStyles();
  const router = useRouter();

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <Script
        id="my-script"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=G-1V03N0TB1Q`}
      ></Script>
      <Script strategy="lazyOnload" id="my-script-2">
        {`window.dataLayer = window.dataLayer || [];
            function gtag() {dataLayer.push(arguments);}
            gtag("js", new Date());
            gtag("config", "G-1V03N0TB1Q");`}
      </Script>
      <SessionProvider session={session}>
        <NextThemesProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="light"
          value={{ light: lightTheme.className, dark: darkTheme.className }}
        >
          <NextUIProvider>
            {router.pathname.endsWith("/") ? (
              <Component {...pageProps} />
            ) : (
              <>
                <Toaster />
                <Nav />
                <div className="app-wrapper">
                  <div className="app-container">
                    <Component {...pageProps} />
                  </div>
                </div>
              </>
            )}
          </NextUIProvider>
        </NextThemesProvider>
      </SessionProvider>
    </>
  );
};

export default MyApp;
