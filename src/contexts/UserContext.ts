import { createContext } from "react";

interface User {
  id?: string;
  name?: string;
  email?: string;
  profile_image?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  fetchUserData: () => Promise<void>;
  handleFacebookLogin: () => Promise<void>;
  handleFacebookCallback: (
    accessToken: string,
    refreshToken: string
  ) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
