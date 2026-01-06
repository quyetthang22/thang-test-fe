import { AppRoutes } from "./routes";
import { useEffect } from "react";
import { useAuthSelector } from "./store/useAuthStore";
import { useUserStore } from "./store/useUserStore";

const App = () => {
  const authUser = useAuthSelector((s) => s.user);
  const setProfile = useUserStore((s) => s.setProfile);

  useEffect(() => {
    if (authUser) setProfile(authUser);
  }, [authUser]);

  return <AppRoutes />;
};

export default App;
