import { getSession } from "next-auth/react";
import { Tweeter } from "../../components/Tweeter/Tweeter";
import { useState } from "react";
import Head from "next/head";

const AppHome = () => {
  const [tweets, setTweets] = useState([""]);

  return (
    <>
      <Head>
        <title>AssistantAI</title>
      </Head>
      <Tweeter tweets={tweets} setTweets={setTweets} />
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        source: "/app",
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default AppHome;
