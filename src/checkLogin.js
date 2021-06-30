import axiosInstance from "axiosInstance";
const loggedIn = async () => {
  try {
    const response = await axiosInstance.get("/users/jwt-info");
    console.log("JWT info:", response);
    if (response.status < 200 || response.status > 299)
      return { success: false };

    return { success: true, name: response.data.user.lastName };
  } catch (failedResponse) {
    console.log(failedResponse);
    return { success: false };
  }
};

export default { loggedIn };
