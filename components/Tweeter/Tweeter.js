import styles from "./Tweeter.module.css";
import { TweetWriter } from "../TweetWriter/TweetWriter";
import { Text } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";

export const Tweeter = ({ tweets, setTweets }) => {
  return (
    <>
      <Toaster />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <TweetWriter tweets={tweets} setTweets={setTweets} />
        </div>
      </div>
    </>
  );
};
