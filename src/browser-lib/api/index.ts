import { apiAuthConfirmNewUser } from "./auth-confirm-new-user";

const api = {
  post: {
    "/auth/confirm-new-user": apiAuthConfirmNewUser,
  },
};

export default api;
