import privateClient from "../client/private.client"
import publicClient from "../client/public.client"

const userEndpoints = {
  signin: "user/signin",
  signup: "user/signup",
  getInfo: "user/info",
  updatePassword: "user/update-password",
  updateProfile: "user/profile",
  getDashboard: "user/dashboard",
  addToWatchHistory: "user/watch-history",
  clearWatchHistory: "user/watch-history",
  markFirstLoginComplete: "user/mark-first-login-complete",
  checkNewEpisodes: "user/check-new-episodes",
  markEpisodeNotificationSeen: "user/mark-episode-notification-seen"
};

const userApi = {
  signin: async ({ username, password }) => {
    try {
      const response = await publicClient.post(userEndpoints.signin, { username, password });

      return { response };
    } catch (err) { return { err }; }
  },
  signup: async ({ username, password, confirmPassword, displayName }) => {
    try {
      const response = await publicClient.post(userEndpoints.signup, { username, password, confirmPassword, displayName });

      return { response };
    } catch (err) { return { err }; }
  },

  getInfo: async () => {
    try {
      const response = await privateClient.get(userEndpoints.getInfo);

      return { response };
    } catch (err) { return { err }; }
  },
  updatePassword: async ({ password, newPassword, confirmNewPassword }) => {
    try {
      const response = await privateClient.put(userEndpoints.updatePassword, { password, newPassword, confirmNewPassword });

      return { response };
    } catch (err) { return { err }; }
  },
  updateProfile: async ({ displayName, profileImage, profileImagePath }) => {
    try {
      const response = await privateClient.put(userEndpoints.updateProfile, { displayName, profileImage, profileImagePath });

      return { response };
    } catch (err) { return { err }; }
  },
  getDashboard: async () => {
    try {
      const response = await privateClient.get(userEndpoints.getDashboard);

      return { response };
    } catch (err) { return { err }; }
  },
  addToWatchHistory: async (watchData) => {
    try {
      const response = await privateClient.post(userEndpoints.addToWatchHistory, watchData);

      return { response };
    } catch (err) { return { err }; }
  },
  clearWatchHistory: async () => {
    try {
      const response = await privateClient.delete(userEndpoints.clearWatchHistory);

      return { response };
    } catch (err) { return { err }; }
  },
  markFirstLoginComplete: async () => {
    try {
      const response = await privateClient.put(userEndpoints.markFirstLoginComplete);

      return { response };
    } catch (err) { return { err }; }
  },
  checkNewEpisodes: async () => {
    try {
      const response = await privateClient.get(userEndpoints.checkNewEpisodes);

      return { response };
    } catch (err) { return { err }; }
  },
  markEpisodeNotificationSeen: async ({ mediaId }) => {
    try {
      const response = await privateClient.put(userEndpoints.markEpisodeNotificationSeen, { mediaId });

      return { response };
    } catch (err) { return { err }; }
  }
};

export default userApi