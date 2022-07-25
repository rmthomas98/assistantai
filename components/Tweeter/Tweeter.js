import { TweetWriter } from "../TweetWriter/TweetWriter";

export const Tweeter = ({ tweets, setTweets }) => {
  return (
    <>
      <TweetWriter tweets={tweets} setTweets={setTweets} />
    </>
  );
};
