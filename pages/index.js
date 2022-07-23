import styles from "../styles/Home.module.css";
import Head from "next/head";
import { Button, Text, Loading } from "@nextui-org/react";
import { BsTwitter } from "react-icons/bs";
import { getSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    setIsLoading(true);
    signIn("twitter");
  };

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Log in</title>
      </Head>
      <Text h1 weight="bold" className={styles.header}>
        <Text
          span
          css={{
            textGradient: "45deg, $purple600 -20%, $pink600 100%",
          }}
          weight="extrabold"
        >
          AI{" "}
        </Text>
        Tweet Assistant.
      </Text>
      <Text
        css={{ mb: "$10", color: "$accents8", textAlign: "center" }}
        weight="medium"
      >
        Save more time, write better tweets.
      </Text>
      <Button
        size="md"
        color="gradient"
        shadow
        icon={isLoading ? null : <BsTwitter />}
        onClick={handleSignIn}
        disabled={isLoading}
      >
        {isLoading ? <Loading size="xs" /> : "Log in with Twitter"}
      </Button>
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (session) {
    return {
      redirect: {
        source: "/",
        destination: "/app",
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default Home;
