import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config/constants";

export type UserSession =
  | {
      loading: true;
    }
  | {
      loading: false;
      authenticated: false;
    }
  | {
      loading: false;
      authenticated: true;
      user: {
        name: string;
        email: string;
        picture: string;
      };
    };

export function useSession() {
  const [session, setSession] = useState<UserSession>({
    loading: true,
  });
  const updateSession = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/auth/session`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setSession({
          loading: false,
          authenticated: true,
          user: {
            name: "temp name",
            email: "temp email",
            picture: "temp picture",
          },
        });
      } else {
        setSession({
          loading: false,
          authenticated: false,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setSession({
        loading: false,
        authenticated: false,
      });
    }
  };

  useEffect(() => {
    updateSession();
  }, []);

  return { session, updateSession };
}
