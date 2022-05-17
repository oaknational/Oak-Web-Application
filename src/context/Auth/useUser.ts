import useAuth from "./useAuth";

const useUser = () => {
  const { user } = useAuth();
  return user;
};

export default useUser;
