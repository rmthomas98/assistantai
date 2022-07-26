import styles from "./Nav.module.css";
import {
  User,
  Text,
  useTheme,
  Dropdown,
  Spacer,
  Modal,
  Textarea,
  Button,
  Loading,
  Avatar,
  Switch,
} from "@nextui-org/react";
import { useSession, signOut } from "next-auth/react";
import { BsFillSunFill, BsFillMoonStarsFill } from "react-icons/bs";
import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BiChat, BiExit, BiMoon, BiSun, BiPencil } from "react-icons/bi";
import { useWindowWidth } from "@react-hook/window-size";
import { useRouter } from "next/router";
import Link from "next/link";
import { TbFeather, TbUsers } from "react-icons/tb";
import axios from "axios";
import toast from "react-hot-toast";

export const Nav = () => {
  const { data: session, status } = useSession();
  const { setTheme } = useNextTheme();
  const { isDark } = useTheme();
  const width = useWindowWidth();
  const router = useRouter();

  const [selectedKey, setSelectedKey] = useState();
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const toastStyle = {
    background: isDark ? "#ECEDEE" : "#16181A",
    color: isDark ? "#16181A" : "#ECEDEE",
    textAlign: "center",
    fontSize: 14,
    fontWeight: 500,
  };

  // Theme toggle
  useEffect(() => {
    if (isDark) {
      document.querySelector("body")?.classList.add("my-dark-app");
    } else {
      document.querySelector("body")?.classList.remove("my-dark-app");
    }
  }, [isDark]);

  // Dropdown user menu
  const handleDropDownAction = (key) => {
    if (key === "log-out") signOut();
    if (key === "feedback") setIsActive(true);
    if (key === "theme") isDark ? setTheme("light") : setTheme("dark");
  };

  // Dropdown navigation functions
  useEffect(() => {
    router.pathname.endsWith("/app") && setSelectedKey("tweet");
    router.pathname.endsWith("/engage") && setSelectedKey("engage");
    router.pathname.endsWith("/feedback") && setSelectedKey("feedback");

    return () => {
      setSelectedKey();
    };
  }, [router.pathname]);

  const handleDropdownNav = (key) => {
    switch (key) {
      case "tweet":
        router.push("/app");
        setSelectedKey("tweet");
        break;
      case "engage":
        router.push("/app/engage");
        setSelectedKey("engage");
        break;
    }
  };

  // Modal feedback
  const handleModalFeedback = async () => {
    if (message.length < 1)
      return toast.error("Please enter a message!", { style: toastStyle });
    setIsLoading(true);
    const response = await axios.post("/api/feedback", {
      message: message,
      name: session.user.name,
    });

    if (response.data === "success") {
      setIsActive(false);
      setIsLoading(false);
      setMessage("");
      toast.success("Message sent!", { style: toastStyle });
    } else {
      setIsLoading(false);
      toast.error("Error sending message!", { style: toastStyle });
    }
  };

  if (status === "loading" || !selectedKey) return <div></div>;

  return (
    <>
      <Modal
        open={isActive}
        onClose={() => setIsActive(false)}
        css={{ py: "$6" }}
      >
        <Modal.Header>
          <Text h3>Send us a message!</Text>
        </Modal.Header>
        <Modal.Body css={{ p: "$8" }}>
          <Textarea
            minRows={4}
            bordered
            color="primary"
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button color="error" flat auto onClick={() => setIsActive(false)}>
            Cancel
          </Button>
          <Button
            shadow
            auto
            onClick={handleModalFeedback}
            disabled={isLoading}
          >
            {isLoading ? <Loading size="xs" /> : "Send"}
          </Button>
        </Modal.Footer>
      </Modal>
      <div
        className={styles.wrapper}
        style={{
          background: isDark ? "#00000042" : "#ffffff42",
          borderBottom: isDark ? "1px solid #26292b" : "1px solid #ecedee",
        }}
      >
        <div className={styles.container}>
          <Link href="/app">
            <a>
              <Text h3 weight="semibold" css={{ m: "$0" }}>
                AssistantAI
              </Text>
            </a>
          </Link>
          <div className={styles.rightContainer}>
            <Switch
              iconOn={<BsFillMoonStarsFill />}
              iconOff={<BsFillSunFill />}
              shadow
              checked={isDark}
              onChange={() => setTheme(isDark ? "light" : "dark")}
            />
            <Spacer />
            <Dropdown placement="bottom-right">
              <Dropdown.Trigger>
                {width > 600 ? (
                  <User
                    as="button"
                    src={session.user.image}
                    squared
                    bordered
                    pointer
                    color="gradient"
                    name={session.user.name}
                  />
                ) : (
                  <Avatar
                    src={session.user.image}
                    pointer
                    alt="avatar"
                    color="gradient"
                    squared
                    bordered
                    as="button"
                  />
                )}
              </Dropdown.Trigger>
              <Dropdown.Menu
                onAction={handleDropDownAction}
                variant="shadow"
                aria-label="dropdown actions"
              >
                <Dropdown.Item
                  key="feedback"
                  icon={<BiChat />}
                  css={{ fontSize: 14, fontWeight: "$medium" }}
                >
                  Feedback
                </Dropdown.Item>
                <Dropdown.Item
                  key="theme"
                  icon={isDark ? <BiSun /> : <BiMoon />}
                  css={{ fontSize: 14, fontWeight: "$medium" }}
                >
                  {isDark ? "Light Mode" : "Dark Mode"}
                </Dropdown.Item>
                <Dropdown.Item
                  key="log-out"
                  color="error"
                  icon={<BiExit />}
                  css={{ fontSize: 14, fontWeight: "$medium" }}
                >
                  Log out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
};
