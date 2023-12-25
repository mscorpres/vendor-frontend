import axios from "axios";
// const link = "https://ims.mscapi.live/";
const link = "https://dev.mscorpres.net/";
const socketLink = "https://socket.mscapi.live:3005";

// comment the above two links and decomment below two links for production

// const link = "https://api.mscorpres.net:3001/";
// let socketLink = "https://socket.mscorpres.net:3005";
export { socketLink, link };
axios.defaults.baseURL = link;
export default axios.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("loggedInUserVendor"));
  if (user) {
    config.headers["x-csrf-token"] = user?.token;
    config.headers["Company-Branch"] = "BRMSC012";
  }
  return config;
});
//
