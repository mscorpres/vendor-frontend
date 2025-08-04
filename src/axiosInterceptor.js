import axios from "axios";
import { toast } from "react-toastify";
// const link = "https://ims.mscapi.live/";
// // const link = "https://dev.mscorpres.net/";
// const socketLink = "https://socket.mscapi.live:3005";

// comment the above two links and decomment below two links for production

// const link = "https://api.mscorpres.net:3001/";
// let socketLink = "https://socket.mscorpres.net:3005";
// export { socketLink, link };
// axios.defaults.baseURL = link;
// export default axios.interceptors.request.use((config) => {
//   const user = JSON.parse(localStorage.getItem("loggedInUserVendor"));
//   if (user) {
//     config.headers["x-csrf-token"] = user?.token;
//     config.headers["Company-Branch"] = "BRMSC012";
//   }
//   return config;
// });
// //

const link = process.env.REACT_APP_API_BASE_URL;
const socketLink = process.env.REACT_APP_SOCKET_BASE_URL;

const imsAxios = axios.create({
  baseURL: link,
  headers: {
    "x-csrf-token": JSON.parse(localStorage.getItem("loggedInUserVendor"))
      ?.token,
  },
});

imsAxios.interceptors.response.use(
  (response) => {
    if (response.data?.success !== undefined) {
      console.log("this is the response from axios interceptor", response.data);
      return response.data;
    }
    return response;
  },
  (error) => {
    console.log("this is the error response", error.response);
    // if (error.response.status === 404) {
    //   toast.error("Some Internal error occured");
    // } else {
    toast.error(error.response.data);
    if (error.response.data.message) {
      toast.error(error.response.data.message.msg);
    }
    // }
    return error.response;
  }
);

let branch =
  JSON.parse(localStorage.getItem("otherData"))?.company_branch ?? "BRMSC012";
let session = JSON.parse(localStorage.getItem("otherData"))?.session ?? "25-26";

imsAxios.defaults.headers["Company-Branch"] = branch;
imsAxios.defaults.headers["Session"] = session;

export { imsAxios, socketLink };
