import { createContext, useContext } from "react";
import { User } from "@/lib/api";

export const AuthContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}>({
  user: null,
  setUser: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);
