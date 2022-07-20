import { getSession } from "next-auth/react";

const AppHome = () => {
  return <div></div>;
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
