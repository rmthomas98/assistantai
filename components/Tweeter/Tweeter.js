import styles from "./Tweeter.module.css";
import { TweetWriter } from "../TweetWriter/TweetWriter";
import { Text } from "@nextui-org/react";

export const Tweeter = ({ tweets, setTweets }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* <Text
          h5
          weight="semibold"
          css={{
            // textGradient: "45deg, $blue600 -20%, $pink600 50%",
            mb: "$2",
          }}
        >
          Write your tweets here
        </Text> */}
        <TweetWriter tweets={tweets} setTweets={setTweets} />
      </div>
    </div>
  );
};
