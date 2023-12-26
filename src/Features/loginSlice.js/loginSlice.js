import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import showToast from "../../Components/MyToast";
let fav =
  typeof JSON.parse(localStorage.getItem("loggedInUserVendor"))?.favPages ==
  "string"
    ? JSON.parse(
        JSON.parse(localStorage.getItem("loggedInUserVendor"))?.favPages
      )
    : JSON.parse(localStorage.getItem("loggedInUserVendor"))?.favPages;

const initialState = {
  user: JSON.parse(localStorage.getItem("loggedInUserVendor"))
    ? {
        ...JSON.parse(localStorage.getItem("loggedInUserVendor")),
        favPages: fav,
      }
    : null,
  testPages: JSON.parse(localStorage.getItem("loggedInUserVendor"))?.testPages,
  locations: [],
  notifications: JSON.parse(localStorage.getItem("userNotifications")) ?? [],
  currentLinks: JSON.parse(localStorage.getItem("currentLinks")),
  mobileConfirmed: JSON.parse(localStorage.getItem("loggedInUserVendor"))
    ?.mobileConfirmed,
  emailConfirmed: JSON.parse(localStorage.getItem("loggedInUserVendor"))
    ?.emailConfirmed,
  loading: false,
  token: null,
  message: "",
};
export const loginAuth = createAsyncThunk(
  "auth/login",
  async (user, thunkAPI) => {
    try {
      const { data } = await axios.post("/auth/vendor_signin", {
        username: user.username,
        password: user.password,
      });
      if (data.code === 200) {
        localStorage.setItem(
          "loggedInUserVendor",
          JSON.stringify({
            userName: data.data.username,
            token: data.data.token,
            phone: data.data.crn_mobile,
            email: data.data.crn_email,
            id: data.data.crn_id,
            favPages: data.data.fav_pages,
            type: data.data.crn_type,
            mobileConfirmed: data.data.mobileConfirmed,
            emailConfirmed: data.data.emailConfirmed,
          })
        );

        return await data.data;
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (err) {
      const { message } = err.response.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const loginSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state, action) => {
      // toast.info("User Logged Out!");
      state.user = null;

      state.message = "User Logged Out!";
      localStorage.removeItem("loggedInUserVendor");
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (not) => not.conversationId !== action.payload.conversationId
      );
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setFavourites: (state, action) => {
      state.user = { ...state.user, favPages: action.payload };
      console.log(
        JSON.stringify({
          ...state.user,
          favPages: action.payload,
        })
      );
      localStorage.setItem(
        "loggedInUserVendor",
        JSON.stringify({
          ...state.user,
          favPages: action.payload,
        })
      );
    },
    setTestPages: (state, action) => {
      console.log(action.payload);
      state.user = { ...state.user, testPages: action.payload };

      localStorage.setItem(
        "loggedInUserVendor",
        JSON.stringify({
          ...state.user,
          testPages: action.payload,
        })
      );
    },
    setLocations: (state, action) => {
      console.log(action.payload);
      state.locations = action.payload;

      localStorage.setItem(
        "loggedInUserVendor",
        JSON.stringify({
          ...state.user,
          testPages: action.payload,
        })
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAuth.pending, (state) => {
        state.user = null;
        state.token = null;
        state.loading = true;
      })
      .addCase(loginAuth.fulfilled, (state, action) => {
        state.user = {
          email: action.payload.crn_email,
          phone: action.payload.crn_mobile,
          userName: action.payload.username,
          token: action.payload.token,
          favPages: {},
          type: action.payload.crn_type,
          mobileConfirmed: action.payload.mobileConfirmed,
          emailConfirmed: action.payload.emailConfirmed,
          // testPages: action.payload.testPages,
          id: action.payload.crn_id,
        };
        state.loading = false;
        state.message = "User Logged in";
      })
      .addCase(loginAuth.rejected, (state, action) => {
        // toast.error(action.payload);
        toast.error(action.payload);
        state.message = action.payload;
        state.loading = false;
      });
  },
});

export const {
  logout,
  removeNotification,
  setNotifications,
  setFavourites,
  setTestPages,
  setLocations,
} = loginSlice.actions;
export default loginSlice.reducer;
