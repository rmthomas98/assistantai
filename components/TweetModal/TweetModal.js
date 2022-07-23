import styles from "./TweetModal.module.css";
import {
  Modal,
  Text,
  User,
  Card,
  useTheme,
  Button,
  Loading,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export const TweetModal = ({
  isActive,
  setIsActive,
  filteredTweets,
  tweetError,
  setTweets,
  setIndex,
}) => {
  const { data: session } = useSession();
  const { isDark } = useTheme();

  const [isLoading, setIsLoading] = useState(false);

  const toastStyle = {
    background: isDark ? "#ECEDEE" : "#16181A",
    color: isDark ? "#16181A" : "#ECEDEE",
    textAlign: "center",
    fontSize: 14,
    fontWeight: 500,
  };

  const handleTweet = async () => {
    const id = session.id;
    setIsLoading(true);
    const response = await axios.post("/api/tweet", {
      tweets: filteredTweets,
      id,
    });
    if (response.data === "success") {
      setIsLoading(false);
      setIsActive(false);
      setIndex(0);
      setTweets([""]);
      toast.success("Tweeted!", { style: toastStyle });
    } else {
      setIsLoading(false);
      setIsActive(false);
      toast.error("Error Tweeting!", { style: toastStyle });
    }
  };

  return (
    <Modal
      open={isActive}
      onClose={() => setIsActive(false)}
      css={{ py: "$8" }}
    >
      <Modal.Header>
        <Text h3>Tweet Preview</Text>
      </Modal.Header>
      <Modal.Body css={{ p: "$8" }}>
        {filteredTweets.map((tweet, i) => {
          return (
            <Card key={i} variant={isDark ? "bordered" : "flat"}>
              <Card.Header css={{ p: "$8", justifyContent: "space-between" }}>
                <User
                  css={{ pl: "$0" }}
                  src={session?.user?.image}
                  name={session?.user?.name}
                />
              </Card.Header>
              <Card.Body css={{ p: "$8", pt: "$0" }}>
                {tweet?.split("\n").map((line, i) => {
                  return (
                    <Text size={12.76} weight="medium" key={i}>
                      {line ? line : <br />}
                    </Text>
                  );
                })}
              </Card.Body>
            </Card>
          );
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button color="error" flat auto onClick={() => setIsActive(false)}>
          Cancel
        </Button>
        <Button
          shadow
          auto
          disabled={tweetError || isLoading}
          onClick={handleTweet}
        >
          {isLoading ? <Loading size="xs" /> : "Tweet now"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
