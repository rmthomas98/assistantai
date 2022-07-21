import styles from "./TweetWriter.module.css";
import {
  Textarea,
  Button,
  Card,
  User,
  Text,
  Progress,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { TbFeather } from "react-icons/tb";

export const TweetWriter = ({ tweets, setTweets }) => {
  const { data: session, status: currentStatus } = useSession();
  console.log(tweets);

  const [index, setIndex] = useState(0);

  if (currentStatus === "loading") return <div></div>;

  return (
    <div className={styles.container}>
      <div className={styles.tweeterContainer}>
        <div className={styles.tweeterInputContainer}>
          <Textarea
            placeholder="Start writing a tweet..."
            size="md"
            minRows={10}
            maxRows={10}
            css={{ width: "100%" }}
            aria-label="tweet"
            value={tweets[index]}
            onChange={(e) =>
              e.target.value === ""
                ? setTweets([(tweets[index] = "")])
                : e.target.value.length >= 281
                ? null
                : setTweets([
                    (tweets[index] = e.target.value),
                    ...tweets.splice(index, 1),
                  ])
            }
          />
          <div className={styles.progressContainer}>
            <Progress
              size="xs"
              css={{ mt: "$6", ml: "$2", mb: "$8", width: "80%" }}
              shadow
              max={280}
              value={tweets[index].length}
              color={tweets[index].length > 260 ? "error" : "success"}
              status={tweets[index].length > 260 ? "error" : "success"}
            />
            <Text span small css={{ ml: "$6" }}>
              {tweets[index].length}
            </Text>
          </div>
          <div className={styles.actionContainer}>
            <Button auto size="sm" shadow icon={<TbFeather />}>
              Tweet
            </Button>
          </div>
        </div>
        <div className={styles.tweetsContainer}>
          {tweets.map((tweet, index) => {
            return (
              <Card
                key={index}
                css={{ width: "100%", mb: "$8" }}
                isHoverable
                isPressable
                onClick={() => setIndex(index)}
              >
                <Card.Header css={{ p: "$8", justifyContent: "space-between" }}>
                  <User
                    css={{ pl: "$0" }}
                    src={session.user.image}
                    bordered
                    color="gradient"
                    squared
                    name={session.user.name}
                  />
                  <Text span small>
                    {tweets[index].length}
                  </Text>
                </Card.Header>
                <Card.Divider />
                <Card.Body css={{ p: "$8" }}>
                  <Text size={12.76} weight="medium">
                    {tweet}
                  </Text>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
