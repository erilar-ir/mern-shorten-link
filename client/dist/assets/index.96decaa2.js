var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
import { a as axios, c as createAsyncThunk, b as createSlice, d as configureStore, r as react, M, R as React, L as Link, u as useDispatch, e as useHistory, f as useSelector, g as useParams, N as NavLink, C as Chart, h as CategoryScale, i as LinearScale, B as BarElement, p as plugin_title, j as plugin_tooltip, k as plugin_legend, A as ArcElement, D as Doughnut, l as randomColor, P as PointElement, m as LineElement, T as TimeScale, n as TimeSeriesScale, o as Bar, q as DateTime, s as useLocation, S as Switch, t as Route, v as Redirect, w as BrowserRouter, x as ReactDOM, y as Provider } from "./vendor.5185aa7f.js";
const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
var index = "";
const storageName$2 = "userData";
const $api = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*"
  }
});
$api.interceptors.request.use((config) => {
  const localStore = JSON.parse(localStorage.getItem(storageName$2));
  config.headers.Authorization = `Bearer ${localStore == null ? void 0 : localStore.accessToken}`;
  return config;
});
$api.interceptors.response.use((config) => {
  return config;
}, async (error) => {
  const originalRequest = error.config;
  if (error.response && error.response.status === 401 && error.config && !error.config._isRetry) {
    originalRequest._isRetry = true;
    try {
      const response = await axios.get("/api/auth/refresh", { withCredentials: true });
      const userData = { accessToken: response.data.accessToken };
      localStorage.setItem(storageName$2, JSON.stringify(userData));
      return await $api.request(originalRequest);
    } catch (e) {
      const error2 = e.response.data;
      error2.status = e.response.status;
      error2.message = "Session expired. Please login again.";
      console.error("Response interceptor error", error2);
      return Promise.reject(error2);
    }
  }
  const err = error.response.data;
  err.status = error.response.status;
  return Promise.reject(err);
});
const storageName$1 = "userData";
const logoutRoutine = (state) => {
  state.isAuthenticated = false;
  localStorage.removeItem(storageName$1);
  state.status = "success";
  state.ready = true;
  state.authError = null;
  state.userForm = null;
};
const loginRoutine = (state, action) => {
  const userData = {
    accessToken: action.payload.accessToken
  };
  localStorage.setItem(storageName$1, JSON.stringify(userData));
  state.isAuthenticated = true;
  state.status = "success";
  state.ready = true;
  state.authError = null;
  state.userForm = null;
};
const loadingRoutine = (state) => {
  state.status = "loading";
  state.ready = false;
};
const rejectRoutine = (state, action) => {
  state.isAuthenticated = false;
  state.ready = true;
  state.status = "failed";
  state.authError = { message: action.payload.message, status: action.payload.status, errors: action.payload.errors ? action.payload.errors : [] };
};
const resetPasswordRequest = createAsyncThunk("auth/resetPasswordRequest", async ({ email }, thunkAPI) => {
  try {
    const response = await $api.post("/api/auth/requestReset", { email });
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});
const resetPassword = createAsyncThunk("auth/resetPassword", async ({ userId, token, password }, thunkAPI) => {
  try {
    const response = await $api.post("/api/auth/resetPassword", { userId, token, password });
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});
const login = createAsyncThunk("auth/login", async ({ email, password }, thunkAPI) => {
  try {
    const response = await $api.post("/api/auth/login", { email, password });
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});
const register = createAsyncThunk("auth/register", async ({ email, password }, thunkAPI) => {
  try {
    const response = await $api.post("/api/auth/register", { email, password });
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});
const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const response = await $api.post("/api/auth/logout");
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});
const checkAuth = createAsyncThunk("auth/check", async (_, thunkAPI) => {
  try {
    const response = await axios.get("/api/auth/refresh", { withCredentials: true });
    return response.data;
  } catch (e) {
    const error = e.response.data;
    error.status = e.response.status;
    error.message = "Session expired. Please login again.";
    return thunkAPI.rejectWithValue(error);
  }
});
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!localStorage.getItem("userData"),
    authError: null,
    status: "idle",
    ready: true,
    userForm: null
  },
  reducers: {
    clearError(state) {
      state.authError = null;
    },
    setReady(state, action) {
      state.ready = action.payload;
    },
    setAuthError(state, action) {
      state.error = action.payload;
    },
    setUserForm(state, action) {
      state.userForm = action.payload;
    }
  },
  extraReducers(builder) {
    builder.addCase(register.pending, (state) => {
      loadingRoutine(state);
    }).addCase(register.fulfilled, (state, action) => {
      loginRoutine(state, action);
    }).addCase(register.rejected, (state, action) => {
      rejectRoutine(state, action);
    }).addCase(login.pending, (state) => {
      loadingRoutine(state);
    }).addCase(login.fulfilled, (state, action) => {
      loginRoutine(state, action);
    }).addCase(login.rejected, (state, action) => {
      rejectRoutine(state, action);
    }).addCase(logout.pending, (state) => {
      loadingRoutine(state);
    }).addCase(logout.fulfilled, (state) => {
      logoutRoutine(state);
    }).addCase(logout.rejected, (state, action) => {
      state.authError = { message: action.payload.message, status: action.payload.status };
    }).addCase(checkAuth.pending, (state) => {
      loadingRoutine(state);
    }).addCase(checkAuth.fulfilled, (state, action) => {
      loginRoutine(state, action);
    }).addCase(checkAuth.rejected, (state, action) => {
      state.authError = { message: action.payload.message, status: action.payload.status };
      logoutRoutine(state);
    }).addCase(resetPasswordRequest.pending, (state) => {
      loadingRoutine(state);
    }).addCase(resetPasswordRequest.fulfilled, (state, action) => {
      state.status = "idle";
      state.ready = true;
    }).addCase(resetPasswordRequest.rejected, (state, action) => {
      rejectRoutine(state, action);
    }).addCase(resetPassword.pending, (state) => {
      loadingRoutine(state);
    }).addCase(resetPassword.fulfilled, (state, action) => {
      state.status = "idle";
      state.ready = true;
    }).addCase(resetPassword.rejected, (state, action) => {
      rejectRoutine(state, action);
    });
  }
});
const { clearError, setAuthError, setUserForm } = authSlice.actions;
var authReducer = authSlice.reducer;
const selectUserForm = (state) => state.auth.userForm;
const selectAuthStatus = (state) => state.auth.status;
const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
const selectAuthReady = (state) => state.auth.ready;
const selectAuthError = (state) => state.auth.authError;
const processRejectedRequest$1 = async (e, thunkAPI) => {
  if (e.status === 401) {
    await thunkAPI.dispatch(logout());
    return thunkAPI.rejectWithValue(e);
  } else {
    return thunkAPI.rejectWithValue(e);
  }
};
const getLinks = createAsyncThunk("links/fetchLinks", async (_, thunkAPI) => {
  try {
    const response = await $api("/api/link");
    return response.data;
  } catch (e) {
    return processRejectedRequest$1(e, thunkAPI);
  }
});
const addLink = createAsyncThunk("links/addLink", async ({ link, title }, thunkAPI) => {
  try {
    const response = await $api.post("/api/link/generate", { from: link, title });
    return response.data;
  } catch (e) {
    return processRejectedRequest$1(e, thunkAPI);
  }
});
const editLink = createAsyncThunk("links/editLink", async ({ linkId, from, title }, thunkAPI) => {
  try {
    const response = await $api.patch(`/api/link/${linkId}`, { from, title });
    return response.data;
  } catch (e) {
    return processRejectedRequest$1(e, thunkAPI);
  }
});
const deleteLink = createAsyncThunk("links/deleteLink", async (id, thunkAPI) => {
  try {
    const response = await $api.post(`/api/link/remove/${id}`);
    return response.data;
  } catch (e) {
    return processRejectedRequest$1(e, thunkAPI);
  }
});
const getDetailedClicks = createAsyncThunk("links/getDetailedClicks", async (id, thunkAPI) => {
  try {
    const response = await $api.get(`/api/link/clicks/${id}`);
    return response.data;
  } catch (e) {
    return processRejectedRequest$1(e, thunkAPI);
  }
});
const getManyLinksDetailedClicks = createAsyncThunk("links/getManyLinksDetailedClicks", async ({ period = 13 }, thunkAPI) => {
  try {
    const response = await $api.post(`/api/link/many-clicks`, { period });
    return response.data;
  } catch (e) {
    return processRejectedRequest$1(e, thunkAPI);
  }
});
const initialState$1 = {
  links: [],
  status: "idle",
  error: null,
  addingLinkStatus: false,
  statistics: null,
  statisticsStatus: "idle",
  linkStatisticsStatus: "idle",
  statisticsError: null
};
const linkSlice = createSlice({
  name: "links",
  initialState: initialState$1,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getLinks.pending, (state) => {
      state.status = "loading";
    }).addCase(getLinks.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.links = action.payload;
    }).addCase(getLinks.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    }).addCase(addLink.pending, (state, action) => {
      state.addingLinkStatus = true;
    }).addCase(addLink.fulfilled, (state, action) => {
      const existingLink = state.links.find((link) => link._id === action.payload.link._id);
      if (!existingLink) {
        state.links.push(action.payload.link);
      }
      state.addingLinkStatus = false;
    }).addCase(addLink.rejected, (state, action) => {
      state.error = action.payload;
      state.addingLinkStatus = false;
    }).addCase(deleteLink.fulfilled, (state, action) => {
      const linkId = action.payload.id;
      state.links = state.links.filter((link) => link._id !== linkId);
    }).addCase(editLink.fulfilled, (state, action) => {
      const { link } = action.payload;
      const existingLink = state.links.find((link2) => link2._id === action.payload.link._id);
      existingLink.from = link.from;
      existingLink.title = link.title;
    }).addCase(editLink.rejected, (state, action) => {
      state.error = action.payload;
    }).addCase(getDetailedClicks.pending, (state) => {
      state.linkStatisticsStatus = "loading";
    }).addCase(getDetailedClicks.fulfilled, (state, action) => {
      const link = state.links.find((link2) => link2._id === action.payload._id);
      if (!link) {
        state.statisticsStatus = "error";
        state.statisticsError = "Link not found";
      } else {
        link.clicksCollection = action.payload.clicksCollection;
        link.clicks = action.payload.clicks;
      }
      state.linkStatisticsStatus = "success";
    }).addCase(getDetailedClicks.rejected, (state, action) => {
      state.statisticsStatus = "error";
      state.linkStatisticsStatus = "error";
      state.statisticsError = action.payload;
    }).addCase(getManyLinksDetailedClicks.pending, (state) => {
      state.statisticsStatus = "loading";
    }).addCase(getManyLinksDetailedClicks.fulfilled, (state, action) => {
      state.statisticsStatus = "success";
      state.statistics = action.payload;
    }).addCase(getManyLinksDetailedClicks.rejected, (state, action) => {
      state.statisticsStatus = "error";
      state.statisticsError = action.payload;
    }).addCase("auth/logout/fulfilled", (state) => {
      state = initialState$1;
      return state;
    });
  }
});
var linksReducer = linkSlice.reducer;
const selectAllLinks = (state) => state.links.links;
const selectAllClickedLinks = (state) => state.links.links.filter((link) => link.clicks > 0);
const linksSliceStatus = (state) => state.links.status;
const addingLinkStatus = (state) => state.links.addingLinkStatus;
const selectStatsStatus = (state) => state.links.statisticsStatus;
const selectLinkStatisticsStatus = (state) => state.links.linkStatisticsStatus;
const selectDashBoardStats = (state) => state.links.statistics;
const selectLinkById = (state, linkId) => state.links.links.find((link) => link._id === linkId);
const processRejectedRequest = async (e, thunkAPI) => {
  if (e.status === 401) {
    await thunkAPI.dispatch(logout());
    return thunkAPI.rejectWithValue(e);
  } else {
    return thunkAPI.rejectWithValue(e);
  }
};
const getGroups = createAsyncThunk("groups/fetchGroups", async (_, thunkAPI) => {
  try {
    const response = await $api("/api/group");
    return response.data;
  } catch (e) {
    return processRejectedRequest(e, thunkAPI);
  }
});
const createGroup = createAsyncThunk("groups/createGroup", async ({ name, description }, thunkAPI) => {
  try {
    const response = await $api.post("/api/group/create", { name, description });
    return response.data;
  } catch (e) {
    return processRejectedRequest(e, thunkAPI);
  }
});
const editGroup = createAsyncThunk("groups/editGroup", async ({ id, name, description }, thunkAPI) => {
  try {
    const response = await $api.patch(`/api/group/edit/${id}`, { name, description });
    return response.data;
  } catch (e) {
    return processRejectedRequest(e, thunkAPI);
  }
});
const deleteGroup = createAsyncThunk("groups/deleteGroup", async (id, thunkAPI) => {
  try {
    const response = await $api.delete(`/api/group/remove/${id}`);
    return response.data;
  } catch (e) {
    return processRejectedRequest(e, thunkAPI);
  }
});
const assignLinkToGroup = createAsyncThunk("groups/assignLinkToGroup", async ({ groupId, linkId }, thunkAPI) => {
  try {
    const response = await $api.patch("/api/group/assign", { groupId, linkId });
    const data = response.data;
    return { data, linkId, groupId };
  } catch (e) {
    return processRejectedRequest(e, thunkAPI);
  }
});
const withdrawLinkFromGroup = createAsyncThunk("groups/withdrawLinkFromGroup", async ({ groupId, linkId }, thunkAPI) => {
  try {
    const response = await $api.patch("/api/group/withdraw", { groupId, linkId });
    const data = response.data;
    return { data, linkId, groupId };
  } catch (e) {
    return processRejectedRequest(e, thunkAPI);
  }
});
const initialState = {
  groups: [],
  status: "idle",
  error: null,
  lockAssignAndDeleteButtons: false
};
const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getGroups.pending, (state) => {
      state.status = "loading";
    }).addCase(getGroups.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.groups = action.payload;
    }).addCase(getGroups.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;
    }).addCase(createGroup.fulfilled, (state, action) => {
      state.groups.push(action.payload.group);
    }).addCase(deleteGroup.fulfilled, (state, action) => {
      state.groups = state.groups.filter((group) => group._id !== action.payload.id);
    }).addCase(assignLinkToGroup.pending, (state) => {
      state.lockAssignAndDeleteButtons = true;
    }).addCase(assignLinkToGroup.fulfilled, (state, action) => {
      state.lockAssignAndDeleteButtons = false;
      const group = state.groups.find((group2) => group2._id === action.payload.groupId);
      group.links.push(action.payload.linkId);
    }).addCase(withdrawLinkFromGroup.pending, (state) => {
      state.lockAssignAndDeleteButtons = true;
    }).addCase(withdrawLinkFromGroup.fulfilled, (state, action) => {
      state.lockAssignAndDeleteButtons = false;
      const group = state.groups.find((group2) => group2._id === action.payload.groupId);
      group.links = group.links.filter((link) => link !== action.payload.linkId);
    }).addCase(editGroup.fulfilled, (state, action) => {
      const { group } = action.payload;
      const existingGroup = state.groups.find((group2) => group2._id === action.payload.group._id);
      existingGroup.name = group.name;
      existingGroup.description = group.description;
    }).addCase(editGroup.rejected, (state, action) => {
      state.error = action.payload;
    }).addCase("auth/logout/fulfilled", (state) => {
      state = initialState;
      return state;
    });
  }
});
var groupReducer = groupSlice.reducer;
const selectGroups = (state) => state.groups.groups;
const selectGroupSliceStatus = (state) => state.groups.status;
const selectLockAssignAndDeleteButtons = (state) => state.groups.lockAssignAndDeleteButtons;
const errorSelector = (state) => state.groups.error;
const selectGroupById = (state, groupId) => state.groups.groups.find((group) => group._id === groupId);
const store = configureStore({
  reducer: {
    auth: authReducer,
    links: linksReducer,
    groups: groupReducer
  }
});
var materialize = "";
var app = "";
var welcomePage = "";
const WelcomePage = () => {
  const infoRef = react.exports.useRef();
  const openInfo = () => {
    const infoInstance = M.TapTarget.getInstance(infoRef.current);
    infoInstance.open();
  };
  react.exports.useEffect(() => {
    M.TapTarget.init(infoRef.current);
  }, []);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("main", null, /* @__PURE__ */ React.createElement("div", {
    className: "container"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: ""
  }, " Welcome "), /* @__PURE__ */ React.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ React.createElement("p", {
    className: "flow-text"
  }, "This is ", /* @__PURE__ */ React.createElement("span", {
    className: "brand-name"
  }, "ShrInk.tech"), ", my name is ", /* @__PURE__ */ React.createElement("a", {
    className: "teal-text",
    href: "https://github.com/erilar-ir",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Ivan Rudiuk"), "and it's my pet project."), /* @__PURE__ */ React.createElement("p", {
    className: "flow-text"
  }, "The purpose of this app is to create short links for web URLs, collect clicks statistics and provide some analytics to user about their short links (like popular ", /* @__PURE__ */ React.createElement("strong", null, "bit.ly"), " or ", /* @__PURE__ */ React.createElement("strong", null, "cutt.ly"), " services). It's quite useful for marketing purposes i think."), /* @__PURE__ */ React.createElement("p", {
    className: "flow-text"
  }, "This project was created for educational purposes with intention to learn MERN stack and have a fun with programming."), /* @__PURE__ */ React.createElement("p", {
    className: "flow-text"
  }, "It uses Node.js and Express.js to run everything on server side. Cloud MongoDB used as database. There is custom authorization logic with access and refresh tokens to keep user logged in safely. App uses email verification to activate user after sign up. User should confirm activation by link in email within 7 days after registration. After 7 days unactivated user account and all data (short links and clicks) generated by unactivated user will be automatically deleted from app."), /* @__PURE__ */ React.createElement("p", {
    className: "flow-text"
  }, "Client app created using React framework. Redux used for state management on client side here. For UI components there is Materialize framework used."), /* @__PURE__ */ React.createElement("p", {
    className: "flow-text"
  }, "For dashboards and chart components i use here Chart.js library with react-chartjs-2 components library. Most of charts data prepared on server side and transfer to client only clean data to visualize on charts."), /* @__PURE__ */ React.createElement("p", {
    className: "flow-text"
  }, "There is also custom Hooks with HOC created for modal views, allows me to easily use proper modal with needed component anywhere in app with a few lines of code."), /* @__PURE__ */ React.createElement("p", {
    className: "flow-text"
  }, "For the awesome bots thanks to ", /* @__PURE__ */ React.createElement("a", {
    className: "teal-text",
    href: "https://www.freepik.com/upklyak",
    rel: "noopener noreferrer"
  }, "upklyak from www.freepik.com")))), /* @__PURE__ */ React.createElement("div", {
    className: "fixed-action-btn direction-top active"
  }, /* @__PURE__ */ React.createElement("a", {
    id: "welcome-info",
    className: "waves-effect waves-light btn-large btn-floating pulse teal lighten-1",
    onClick: openInfo
  }, /* @__PURE__ */ React.createElement("i", {
    className: "material-icons"
  }, "info_outline"))), /* @__PURE__ */ React.createElement("div", {
    className: "tap-target teal lighten-1",
    ref: infoRef,
    "data-target": "welcome-info"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "tap-target-content white-text"
  }, /* @__PURE__ */ React.createElement("h5", {
    className: "hide-on-small-and-down show-on-medium-and-up"
  }, "Info Tip"), /* @__PURE__ */ React.createElement("p", null, "To use all features of this app please Sign In or Sign Up using top navigation, confirm activation email and have a useful marketing instrument for free.")))), /* @__PURE__ */ React.createElement("footer", {
    className: "page-footer teal lighten-1"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "footer-copyright"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "container"
  }, "Copyright \xA9 ", /* @__PURE__ */ React.createElement("a", {
    className: "grey-text text-lighten-4",
    href: "https://github.com/erilar-ir",
    rel: "noopener noreferrer"
  }, "erilar.ir")))));
};
var linksPage = "";
var loader = "";
const Loader = () => {
  return /* @__PURE__ */ React.createElement("div", {
    className: "loader"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "preloader-wrapper active"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "spinner-layer spinner-red-only"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "circle-clipper left"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "circle"
  })), /* @__PURE__ */ React.createElement("div", {
    className: "gap-patch"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "circle"
  })), /* @__PURE__ */ React.createElement("div", {
    className: "circle-clipper right"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "circle"
  })))));
};
var linksList = "";
const LinkItem = ({ link, index: index2 }) => {
  const { to, title, from, _id, clicks } = link;
  return /* @__PURE__ */ React.createElement("tr", {
    key: _id
  }, /* @__PURE__ */ React.createElement("td", null, index2 + 1), /* @__PURE__ */ React.createElement("td", null, title ? title : from), /* @__PURE__ */ React.createElement("td", null, to), /* @__PURE__ */ React.createElement("td", null, clicks), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(Link, {
    to: `/details/${_id}`
  }, /* @__PURE__ */ React.createElement("i", {
    className: "material-icons"
  }, "search"))));
};
const LinksList = ({ links }) => {
  if (links.length === 0) {
    return /* @__PURE__ */ React.createElement("div", {
      className: "links-list"
    }, /* @__PURE__ */ React.createElement("div", {
      className: "no-links"
    }, /* @__PURE__ */ React.createElement("p", null, " There is no links yet")));
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: "links-list"
  }, /* @__PURE__ */ React.createElement("table", {
    className: "responsive-table highlight "
  }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "#"), /* @__PURE__ */ React.createElement("th", null, "Title / Destination"), /* @__PURE__ */ React.createElement("th", null, "Short link"), /* @__PURE__ */ React.createElement("th", null, "Clicks"), /* @__PURE__ */ React.createElement("th", null, "Details"))), /* @__PURE__ */ React.createElement("tbody", null, links.map((link, index2) => {
    return /* @__PURE__ */ React.createElement(LinkItem, {
      key: link._id,
      link,
      index: index2
    });
  }))));
};
var message_hook = "";
const useMessage = () => {
  return react.exports.useCallback((text, type) => {
    if (M && text) {
      switch (type) {
        case "success":
          M.toast({ html: text, classes: "success-toast", displayLength: 2e3 });
          break;
        case "warn":
          M.toast({ html: text, classes: "warning-toast", displayLength: 2e3 });
          break;
        case "error":
          M.toast({ html: text, classes: "error-toast", displayLength: 2e3 });
          break;
        default:
          M.toast({ html: text });
      }
    }
  }, []);
};
var modal_hook = "";
var modal_hoc = "";
const withModal = (WrappedComponent, _a) => {
  var props = __objRest(_a, []);
  const modal = react.exports.useRef();
  const tooltip = react.exports.useRef();
  let focusedInput = props.focused ? react.exports.useRef() : null;
  react.exports.useEffect(() => {
    const options = {
      onOpenStart: () => {
      },
      onOpenEnd: () => {
        if (props.focused) {
          setTimeout(() => focusedInput.current.focus(), 50);
        }
        M.updateTextFields();
      },
      onCloseStart: () => {
        if (props.focusedInput) {
          setTimeout(() => props.focusedInput.current.blur(), 50);
        }
      },
      onCloseEnd: () => {
      },
      inDuration: 250,
      outDuration: 250,
      opacity: 0.5,
      dismissible: true,
      startingTop: "4%",
      endingTop: "10%"
    };
    M.Modal.init(modal.current, options);
    if (!props.noTooltip) {
      M.Tooltip.init(tooltip.current);
    }
  }, []);
  const { modalButton, modalHeader, modalButtonClass, modalContainerClass, tooltipText } = props;
  const modalClose = () => {
    const modalInstance = M.Modal.getInstance(modal.current);
    modalInstance.close();
  };
  const modalId = props.id ? `${modalContainerClass}-${props.id}` : modalButtonClass;
  let modalTriggerLinkClassnames = `waves-effect waves-light btn tooltipped modal-trigger modal-link ${modalButtonClass}`;
  if (props.flatModal) {
    modalTriggerLinkClassnames = `modal-trigger modal-link`;
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("a", {
    className: modalTriggerLinkClassnames,
    "data-target": modalId,
    "data-position": "top",
    "data-tooltip": tooltipText,
    ref: tooltip
  }, modalButton), /* @__PURE__ */ React.createElement("div", {
    ref: modal,
    id: modalId,
    className: `modal ${modalContainerClass} bottom-sheet`
  }, /* @__PURE__ */ React.createElement("div", {
    className: "modal-header"
  }, /* @__PURE__ */ React.createElement("h4", {
    className: "modal-title"
  }, modalHeader)), /* @__PURE__ */ React.createElement("div", {
    className: "modal-content"
  }, /* @__PURE__ */ React.createElement(WrappedComponent, __spreadValues({
    closeModal: modalClose,
    focusedInput
  }, props)))));
};
var confirm_hoc = "";
const withConfirm = (props) => {
  const { doubt = () => {
  }, closeModal = () => {
  } } = props;
  return /* @__PURE__ */ React.createElement("div", {
    className: "confirm-container"
  }, /* @__PURE__ */ React.createElement("button", {
    className: "waves-effect waves-light btn green lighten-1 confirm",
    onClick: doubt
  }, "Yes"), /* @__PURE__ */ React.createElement("button", {
    className: "waves-effect waves-light btn red lighten-1 decline",
    onClick: closeModal
  }, "No"));
};
var generateLinkForm = "";
const noop$2 = () => {
};
const GenerateLinkForm = ({ modalMode = false, closeModal = noop$2, id: groupId = null, focusedInput = null }) => {
  const dispatch = useDispatch();
  const message = useMessage();
  const history2 = useHistory();
  const selectAddingLinkStatus = useSelector(addingLinkStatus);
  const [form, setForm] = react.exports.useState({
    link: "",
    title: ""
  });
  const [formError, setFormError] = react.exports.useState(null);
  const formHandler = (event) => {
    setForm(__spreadProps(__spreadValues({}, form), { [event.target.name]: event.target.value }));
  };
  const generateLink = async () => {
    try {
      const { link, title } = form;
      const data = await dispatch(addLink({ link, title })).unwrap();
      setForm({ link: "", title: "" });
      if (groupId) {
        const linkId = data.link._id;
        const assigned = await dispatch(assignLinkToGroup({ groupId, linkId })).unwrap();
        message(`Short link for ${data.link.from} created and assigned to ${assigned.groupName} group`, "success");
      } else {
        message(`Short link created for ${data.link.from}`, "success");
      }
      if (!modalMode) {
        history2.push(`/details/${data.link._id}`);
      }
      if (modalMode) {
        closeModal();
      }
      setFormError(null);
    } catch (e) {
      setFormError(e.message);
      message(e.message, "warn");
    }
  };
  const enterPressHandler = async (event) => {
    if (event.key === "Enter") {
      await generateLink();
    }
  };
  react.exports.useEffect(() => {
    M.updateTextFields();
  }, [formError]);
  if (selectAddingLinkStatus) {
    return /* @__PURE__ */ React.createElement(Loader, null);
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: "generate-link-form"
  }, /* @__PURE__ */ React.createElement("form", {
    className: ""
  }, /* @__PURE__ */ React.createElement("div", {
    className: "input-field"
  }, /* @__PURE__ */ React.createElement("i", {
    className: `material-icons prefix ${formError && "red-text"}`
  }, "link"), /* @__PURE__ */ React.createElement("input", {
    ref: focusedInput ? focusedInput : null,
    type: "text",
    id: "link",
    name: "link",
    value: form.link,
    onChange: formHandler,
    onKeyPress: enterPressHandler,
    placeholder: "Enter long url like https://www.google.com",
    className: formError && "invalid"
  }), /* @__PURE__ */ React.createElement("label", {
    htmlFor: "{'link'}"
  }, "Url"), formError && /* @__PURE__ */ React.createElement("span", {
    className: "helper-text",
    "data-error": formError
  }, "Helper text")), /* @__PURE__ */ React.createElement("div", {
    className: "input-field"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "material-icons prefix"
  }, "title"), /* @__PURE__ */ React.createElement("input", {
    type: "text",
    name: "title",
    id: "title",
    value: form.title,
    onChange: formHandler,
    onKeyPress: enterPressHandler,
    placeholder: "Enter custom title"
  }), /* @__PURE__ */ React.createElement("label", {
    htmlFor: "{'title'}"
  }, "Title")), /* @__PURE__ */ React.createElement("div", {
    className: "buttons"
  }, /* @__PURE__ */ React.createElement("button", {
    className: "btn teal lighten-2",
    onClick: generateLink
  }, "Create Short Link"))));
};
var editLinkForm = "";
const noop$1 = () => {
};
const EditLinkForm = (props) => {
  const { id, modalMode = false, closeModal = noop$1, focusedInput = null } = props;
  const dispatch = useDispatch();
  const message = useMessage();
  const link = useSelector((state) => selectLinkById(state, id));
  const [form, setForm] = react.exports.useState({
    from: link.from,
    title: link.title || ""
  });
  const formHandler = (event) => {
    setForm(__spreadProps(__spreadValues({}, form), { [event.target.name]: event.target.value }));
  };
  const editLinkHandler = async () => {
    try {
      const editedLink = await dispatch(editLink({ linkId: id, from: form.from, title: form.title })).unwrap();
      message(editedLink.message, "success");
      if (modalMode) {
        closeModal();
      }
    } catch (e) {
      message(e.message, "error");
    }
  };
  const enterPressHandler = async (event) => {
    if (event.key === "Enter") {
      await editLinkHandler();
    }
  };
  react.exports.useEffect(() => {
    M.updateTextFields();
  }, []);
  return /* @__PURE__ */ React.createElement("div", {
    className: "edit-link-form"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "input-field"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "material-icons prefix"
  }, "link"), /* @__PURE__ */ React.createElement("input", {
    ref: focusedInput ? focusedInput : null,
    type: "text",
    id: "from",
    name: "from",
    value: form.from,
    onChange: formHandler,
    placeholder: "Enter long url",
    onKeyPress: enterPressHandler
  }), /* @__PURE__ */ React.createElement("label", {
    htmlFor: "{'link'}"
  }, "Url")), /* @__PURE__ */ React.createElement("div", {
    className: "input-field"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "material-icons prefix"
  }, "title"), /* @__PURE__ */ React.createElement("input", {
    type: "text",
    id: "title",
    name: "title",
    value: form.title,
    onChange: formHandler,
    placeholder: "Enter custom title",
    onKeyPress: enterPressHandler
  }), /* @__PURE__ */ React.createElement("label", {
    htmlFor: "{'title'}"
  }, "Title")), /* @__PURE__ */ React.createElement("div", {
    className: "buttons"
  }, /* @__PURE__ */ React.createElement("button", {
    className: "btn teal lighten-2",
    onClick: editLinkHandler
  }, "Save changes")));
};
var assignLinksCard = "";
const AssignLinkItem = ({ link }) => {
  const dispatch = useDispatch();
  const message = useMessage();
  const groupId = useParams().id;
  const locked = useSelector(selectLockAssignAndDeleteButtons);
  const editLinkModal = useModal("edit-link", { id: link._id });
  const assignLink = async (linkId) => {
    try {
      const assignedLink = await dispatch(assignLinkToGroup({ groupId, linkId })).unwrap();
      message(assignedLink.data.message, "success");
    } catch (e) {
      message(e.message, "warn");
    }
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    className: "assign-link"
  }, /* @__PURE__ */ React.createElement("button", {
    className: " waves-effect waves-light btn btn-small",
    onClick: () => assignLink(link._id),
    disabled: locked
  }, /* @__PURE__ */ React.createElement("i", {
    className: " material-icons"
  }, "library_add"))), /* @__PURE__ */ React.createElement("div", {
    className: "link-names"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "from"
  }, "Source: ", /* @__PURE__ */ React.createElement("span", null, link.title ? link.title : link.from)), /* @__PURE__ */ React.createElement("span", {
    className: "to teal lighten-4 text-accent-1"
  }, "Short link: ", /* @__PURE__ */ React.createElement("span", null, link.to))), /* @__PURE__ */ React.createElement("div", {
    className: "edit-link"
  }, editLinkModal));
};
const AssignLinksCard = ({ linksToAssign }) => {
  if (linksToAssign.length === 0) {
    return /* @__PURE__ */ React.createElement("div", {
      className: "links-card"
    }, /* @__PURE__ */ React.createElement("p", null, "No links left to assign"));
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: "links-card"
  }, /* @__PURE__ */ React.createElement("ul", {
    className: "links-list"
  }, linksToAssign.map((link) => {
    return /* @__PURE__ */ React.createElement("li", {
      className: "link-item card",
      key: link._id
    }, /* @__PURE__ */ React.createElement(AssignLinkItem, {
      link
    }));
  })));
};
const noop = () => {
};
const EditGroupForm = (props) => {
  const { id, modalMode = false, closeModal = noop, focusedInput = null } = props;
  const dispatch = useDispatch();
  const message = useMessage();
  const group = useSelector((state) => selectGroupById(state, id));
  const [form, setForm] = react.exports.useState({
    name: group.name,
    description: group.description || ""
  });
  const enterPressHandler = async (event) => {
    if (event.key === "Enter") {
      await editGroupHandler();
    }
  };
  const editGroupHandler = async () => {
    try {
      const { name, description } = form;
      const editedGroup = await dispatch(editGroup({ id, name, description })).unwrap();
      message(editedGroup.message, "success");
      if (modalMode) {
        closeModal();
      }
    } catch (e) {
      message(e.message, "warn");
      console.log(e);
    }
  };
  const formHandler = (event) => {
    setForm(__spreadProps(__spreadValues({}, form), { [event.target.name]: event.target.value }));
  };
  react.exports.useEffect(() => {
    M.updateTextFields();
  }, []);
  return /* @__PURE__ */ React.createElement("div", {
    className: "edit-group"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "input-field"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "material-icons prefix"
  }, "title"), /* @__PURE__ */ React.createElement("input", {
    ref: focusedInput ? focusedInput : null,
    type: "text",
    id: "groupName",
    name: "name",
    value: form.name,
    onChange: formHandler,
    onKeyPress: enterPressHandler,
    placeholder: "Enter group name"
  }), /* @__PURE__ */ React.createElement("label", {
    htmlFor: "{'groupName'}"
  }, "Name")), /* @__PURE__ */ React.createElement("div", {
    className: "input-field"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "material-icons prefix"
  }, "description"), /* @__PURE__ */ React.createElement("textarea", {
    className: "materialize-textarea",
    id: "groupDescription",
    name: "description",
    value: form.description,
    onChange: formHandler,
    onKeyPress: enterPressHandler,
    placeholder: "Enter group description"
  }), /* @__PURE__ */ React.createElement("label", {
    htmlFor: "{'groupName'}"
  }, "Description")), /* @__PURE__ */ React.createElement("div", {
    className: "buttons"
  }, /* @__PURE__ */ React.createElement("button", {
    className: "btn teal lighten-2",
    onClick: editGroupHandler
  }, "Save changes")));
};
const useModal = (type = "add", options = {}) => {
  let modalButton;
  let wrappedComponent;
  let modalHeader;
  let modalButtonClass;
  let tooltipText;
  let modalContainerClass;
  const modalMode = true;
  const modalButtonConstructor = (icon, text) => {
    return /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", {
      className: "material-icons"
    }, icon), options.hideButtonText ? null : /* @__PURE__ */ React.createElement("span", {
      className: "modal-button-text"
    }, text));
  };
  switch (type) {
    case "add":
      modalButton = modalButtonConstructor("add", "Add link");
      wrappedComponent = GenerateLinkForm;
      modalHeader = options.id ? "Create and assign link" : "Create Link";
      modalButtonClass = options.showOnLarge ? "add-link green  show-on-large hide-on-med-and-down" : "add-link green";
      tooltipText = options.id ? "Add new link and assign it to this group" : "Add Link";
      modalContainerClass = "add-link-c";
      break;
    case "edit-link":
      modalButton = modalButtonConstructor("edit", "Edit link");
      wrappedComponent = EditLinkForm;
      modalHeader = "Edit Link";
      modalButtonClass = "edit-link orange lighten-2";
      tooltipText = "Edit Link";
      modalContainerClass = "edit-link-c";
      break;
    case "assign-links":
      modalButton = modalButtonConstructor("playlist_add", "Assign links");
      wrappedComponent = AssignLinksCard;
      modalHeader = "Links to assign";
      modalButtonClass = "assign-link";
      tooltipText = "Assign links to this group";
      modalContainerClass = "assign-link-c";
      break;
    case "edit-group":
      modalButton = modalButtonConstructor("edit", "Edit group");
      wrappedComponent = EditGroupForm;
      modalHeader = "Edit group";
      modalButtonClass = "edit-group orange lighten-2";
      tooltipText = "Edit this group";
      modalContainerClass = "edit-group-c";
      break;
    case "confirm-delete":
      modalButton = modalButtonConstructor("delete", "Delete");
      wrappedComponent = withConfirm;
      modalHeader = options.tooltipName ? `Delete the ${options.name} ${options.tooltipName}, really?` : "Delete this item, really?";
      modalButtonClass = "confirm-delete red lighten-1";
      tooltipText = options.tooltipName ? `Remove ${options.tooltipName}` : "Remove item";
      modalContainerClass = "confirm-delete-c";
      break;
    default:
      modalButton = modalButtonConstructor("add", "Add link");
      wrappedComponent = GenerateLinkForm;
      modalHeader = options.id ? "Create and assign link" : "Create Link";
      modalButtonClass = options.showOnLarge ? "add-link green  show-on-large hide-on-med-and-down" : "add-link green";
      tooltipText = options.id ? "Add new link and assign it to this group" : "Add Link";
      modalContainerClass = "add-link-c";
      break;
  }
  const props = __spreadValues({ modalMode, modalButton, modalHeader, modalButtonClass, modalContainerClass, tooltipText }, options);
  return withModal(wrappedComponent, __spreadValues({}, props));
};
const LinksPage = () => {
  const dispatch = useDispatch();
  const reduxLinks = useSelector(selectAllLinks);
  const linksStatus = useSelector(linksSliceStatus);
  const linksError = useSelector((state) => state.links.error);
  const message = useMessage();
  react.exports.useEffect(async () => {
    if (linksStatus === "idle") {
      try {
        await dispatch(getLinks()).unwrap();
      } catch (e) {
        message(e.message, "error");
      }
    }
  }, []);
  let content;
  switch (linksStatus) {
    case "loading":
      content = /* @__PURE__ */ React.createElement(Loader, null);
      break;
    case "succeeded":
      content = /* @__PURE__ */ React.createElement(LinksList, {
        links: reduxLinks
      });
      break;
    case "failed":
      message(linksError.message);
      console.log(linksError.message);
      content = /* @__PURE__ */ React.createElement("p", null, "Something went wrong");
      break;
    default:
      content = /* @__PURE__ */ React.createElement(Loader, null);
      break;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: "links-page row section"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "links-col col s12 m12 l12"
  }, content));
};
var createPage = "";
const CreatePage = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  if (!isAuthenticated) {
    return history.push("/auth");
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: "create-page"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "col s8 offset-s2"
  }, /* @__PURE__ */ React.createElement(GenerateLinkForm, null))));
};
var detailsPage = "";
var botImg$1 = "/assets/bot-notfound.bb8d9daa.svg";
var noLink = "";
const NoLink = () => {
  return /* @__PURE__ */ React.createElement("div", {
    className: "container no-link"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "error-bot"
  }, /* @__PURE__ */ React.createElement("img", {
    className: "bot-img",
    src: botImg$1,
    alt: "bot-notfound"
  }), /* @__PURE__ */ React.createElement("h4", {
    className: "grey-text text-darken-1"
  }, "Link not Found")), /* @__PURE__ */ React.createElement("div", {
    className: "action-button"
  }, /* @__PURE__ */ React.createElement(NavLink, {
    to: "/links",
    className: "btn teal lighten-2"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "material-icons left"
  }, "arrow_back"), " Back to all links")));
};
var linkCard = "";
const LinkCard = ({ link, openInNewTab }) => {
  const { to, from, clicks, date, title } = link;
  const linkId = useParams().id;
  const dispatch = useDispatch();
  const history2 = useHistory();
  const message = useMessage();
  const modalEdit = useModal("edit-link", { id: linkId, focused: true });
  const removeLink = async () => {
    const data = await dispatch(deleteLink(linkId)).unwrap();
    history2.push("/links");
    message(data.message, "success");
  };
  const name = title ? title : to;
  const headerText = title ? `${title} details` : `Link details`;
  const deleteWithConfirmation = useModal("confirm-delete", { doubt: removeLink, tooltipName: "link", name });
  return /* @__PURE__ */ React.createElement("div", {
    className: "link-card"
  }, /* @__PURE__ */ React.createElement("h3", null, headerText), /* @__PURE__ */ React.createElement("p", null, "Short link: ", /* @__PURE__ */ React.createElement("span", {
    className: "blue-text text-darken-2 span-link short",
    onClick: () => openInNewTab(to)
  }, to)), /* @__PURE__ */ React.createElement("p", null, "Destination link: ", /* @__PURE__ */ React.createElement("a", {
    className: "blue-text text-darken-2 span-link",
    href: from,
    target: "_blank",
    rel: "noopener noreferrer"
  }, from)), /* @__PURE__ */ React.createElement("p", null, "Link clicks: ", /* @__PURE__ */ React.createElement("strong", null, clicks)), /* @__PURE__ */ React.createElement("p", null, "Create date: ", /* @__PURE__ */ React.createElement("strong", null, new Date(+date).toLocaleDateString())), /* @__PURE__ */ React.createElement("div", {
    className: "details-buttons"
  }, modalEdit, deleteWithConfirmation));
};
var errorView = "";
var botImg = "/assets/bot-thinking.9dd9132e.svg";
const ErrorView = ({ err }) => {
  return /* @__PURE__ */ React.createElement("div", {
    className: "container error-view"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "error-bot"
  }, /* @__PURE__ */ React.createElement("img", {
    className: "bot-img",
    src: botImg,
    alt: "bot-thinking"
  })), /* @__PURE__ */ React.createElement("h5", {
    className: "grey-text text-darken-1"
  }, "Something went wrong."), /* @__PURE__ */ React.createElement("div", {
    className: "action-button"
  }, "Try to reload page"));
};
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null, hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.log("catch in boundary", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }
  render() {
    const { error, errorInfo, hasError } = this.state;
    if (hasError) {
      return /* @__PURE__ */ React.createElement(ErrorView, {
        err: { error, errorInfo }
      });
    }
    return this.props.children;
  }
}
const DetailsPage = () => {
  const dispatch = useDispatch();
  const linkId = useParams().id;
  const link = useSelector((state) => selectLinkById(state, linkId));
  const openInNewTab = async (url) => {
    const newWindow = window.open(url, "_blank", "noopener noreferrer");
    if (newWindow)
      newWindow.opener = null;
    setTimeout(async () => {
      await dispatch(getDetailedClicks(linkId)).unwrap();
    }, 1e3);
  };
  let content;
  if (!link) {
    content = /* @__PURE__ */ React.createElement(NoLink, null);
  } else {
    content = /* @__PURE__ */ React.createElement(LinkCard, {
      openInNewTab,
      link
    });
  }
  return /* @__PURE__ */ React.createElement(ErrorBoundary, null, content);
};
var authPage = "";
const AuthPage = () => {
  const dispatch = useDispatch();
  const ready = useSelector(selectAuthReady);
  const userForm = useSelector(selectUserForm);
  const authError = useSelector(selectAuthError);
  let emailErrorMessage, passwordErrorMessage = null;
  if (authError) {
    if (authError.message.toLowerCase().includes("user")) {
      emailErrorMessage = authError.message;
    }
    if (authError.message.toLowerCase().includes("password")) {
      passwordErrorMessage = authError.message;
    }
    if (authError.errors.length > 0) {
      authError.errors.forEach((err) => {
        if (err.toLowerCase().includes("email")) {
          emailErrorMessage = emailErrorMessage ? `${emailErrorMessage}, ${err}` : err;
        }
        if (err.toLowerCase().includes("password")) {
          passwordErrorMessage = passwordErrorMessage ? `${passwordErrorMessage}, ${err}` : err;
        }
      });
    }
  }
  const [form, setForm] = react.exports.useState({
    email: userForm ? userForm.email : "",
    password: userForm ? userForm.password : ""
  });
  const message = useMessage();
  const formHandler = (event) => {
    setForm(__spreadProps(__spreadValues({}, form), { [event.target.name]: event.target.value }));
  };
  const registerHandler = async () => {
    try {
      const { email, password } = form;
      dispatch(setUserForm(form));
      await dispatch(register({ email, password })).unwrap();
      message(`User created successfully. Activation link sent to ${form.email}.`, "success");
    } catch (e) {
      message(e.message, "warn");
    }
  };
  const loginHandler = async () => {
    try {
      const { email, password } = form;
      dispatch(setUserForm(form));
      await dispatch(login({ email, password })).unwrap();
    } catch (e) {
      message(e.message, "warn");
    }
  };
  react.exports.useEffect(() => {
    M.updateTextFields();
  }, []);
  const disableOnEmptyInputs = !(form.email.length === 0 || form.password.length === 0);
  return /* @__PURE__ */ React.createElement("div", {
    className: "auth-page"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "col s12 m10 l6 offset-l3 offset-m1"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "card grey lighten-5"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "card-content black-text"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "card-title"
  }, "Authorization"), /* @__PURE__ */ React.createElement("div", {
    className: "auth-form-fields"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "input-field"
  }, /* @__PURE__ */ React.createElement("input", {
    type: "text",
    id: "user_email",
    name: "email",
    onChange: formHandler,
    value: form.email,
    className: emailErrorMessage ? "invalid" : void 0
  }), /* @__PURE__ */ React.createElement("label", {
    htmlFor: "user_email"
  }, "Email"), emailErrorMessage && /* @__PURE__ */ React.createElement("span", {
    className: "helper-text",
    "data-error": emailErrorMessage
  }, "Helper text")), /* @__PURE__ */ React.createElement("div", {
    className: "input-field"
  }, /* @__PURE__ */ React.createElement("input", {
    type: "password",
    id: "user_password",
    name: "password",
    onChange: formHandler,
    value: form.password,
    className: passwordErrorMessage ? "invalid" : void 0
  }), /* @__PURE__ */ React.createElement("label", {
    htmlFor: "user_password"
  }, "Password"), passwordErrorMessage && /* @__PURE__ */ React.createElement("span", {
    className: "helper-text",
    "data-error": passwordErrorMessage
  }, "Helper text")))), /* @__PURE__ */ React.createElement("div", {
    className: "card-action buttons"
  }, /* @__PURE__ */ React.createElement("button", {
    className: "btn orange darken-1",
    onClick: loginHandler,
    disabled: !ready || !disableOnEmptyInputs
  }, "Sign In"), /* @__PURE__ */ React.createElement("button", {
    className: "btn teal lighten-1 ",
    onClick: registerHandler,
    disabled: !ready || !disableOnEmptyInputs
  }, "Sign Up"), /* @__PURE__ */ React.createElement(NavLink, {
    className: "orange-text forgot",
    to: "/forgotten"
  }, "Forgot your password?"))))));
};
var groupsManagement = "";
const CreateGroup = () => {
  const dispatch = useDispatch();
  const [form, setForm] = react.exports.useState({
    name: "",
    description: ""
  });
  const message = useMessage();
  const enterPressHandler = async (event) => {
    if (event.key === "Enter") {
      await addGroup();
    }
  };
  const addGroup = async () => {
    try {
      const { name, description } = form;
      const data = await dispatch(createGroup({ name, description })).unwrap();
      message(data.message, "success");
      setForm({
        name: "",
        description: ""
      });
      window.M.updateTextFields();
    } catch (e) {
      message(e.message, "warn");
      console.log(e);
    }
  };
  const formHandler = (event) => {
    setForm(__spreadProps(__spreadValues({}, form), { [event.target.name]: event.target.value }));
  };
  react.exports.useEffect(() => {
    M.updateTextFields();
  }, []);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", null, "Create new Group"), /* @__PURE__ */ React.createElement("div", {
    className: "input-field"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "material-icons prefix"
  }, "title"), /* @__PURE__ */ React.createElement("input", {
    type: "text",
    id: "groupName",
    name: "name",
    value: form.name,
    onChange: formHandler,
    onKeyPress: enterPressHandler,
    placeholder: "Enter group name"
  }), /* @__PURE__ */ React.createElement("label", {
    htmlFor: "{'groupName'}"
  }, "Name")), /* @__PURE__ */ React.createElement("div", {
    className: "input-field"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "material-icons prefix"
  }, "description"), /* @__PURE__ */ React.createElement("textarea", {
    className: "materialize-textarea",
    id: "groupDescription",
    name: "description",
    value: form.description,
    onChange: formHandler,
    onKeyPress: enterPressHandler,
    placeholder: "Enter group description"
  }), /* @__PURE__ */ React.createElement("label", {
    htmlFor: "{'groupName'}"
  }, "Description")), /* @__PURE__ */ React.createElement("div", {
    className: "buttons"
  }, /* @__PURE__ */ React.createElement("button", {
    className: "btn teal lighten-2",
    onClick: addGroup
  }, "Add Group")));
};
const GroupItem = ({ group }) => {
  const message = useMessage();
  const history2 = useHistory();
  const dispatch = useDispatch();
  const tooltip = react.exports.useRef();
  const openDetails = async () => {
    history2.push(`/groups/${group._id}`);
  };
  const removeGroup = async () => {
    try {
      console.log(`delete ${group._id}`);
      const deleted = await dispatch(deleteGroup(group._id)).unwrap();
      message(deleted.message, "success");
    } catch (e) {
      message(e.message, "error");
    }
  };
  const deleteWithConfirmation = useModal("confirm-delete", { doubt: removeGroup, tooltipName: "group", id: group._id, name: group.name, hideButtonText: true });
  react.exports.useEffect(() => {
    M.Tooltip.init(tooltip.current);
  }, []);
  return /* @__PURE__ */ React.createElement("div", {
    className: "group-item"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "group-name col l6 m8 s8"
  }, group.name), /* @__PURE__ */ React.createElement("div", {
    className: "group-tools col l4 m4 s4"
  }, /* @__PURE__ */ React.createElement("button", {
    ref: tooltip,
    onClick: openDetails,
    className: "btn teal lighten-1 tooltipped",
    "data-tooltip": "Open group details",
    "data-position": "top"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "material-icons"
  }, "details")), deleteWithConfirmation));
};
const GroupList = () => {
  const groups = useSelector(selectGroups);
  if (groups.length === 0) {
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, "User Groups"), /* @__PURE__ */ React.createElement("p", null, "You have no groups yet"));
  } else {
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", null, "User Groups"), /* @__PURE__ */ React.createElement("ul", {
      className: "group-list"
    }, groups.map((group) => {
      return /* @__PURE__ */ React.createElement("li", {
        key: group._id,
        className: "group-item row"
      }, /* @__PURE__ */ React.createElement(ErrorBoundary, null, /* @__PURE__ */ React.createElement(GroupItem, {
        group
      })));
    })));
  }
};
const GroupsManagement = () => {
  const dispatch = useDispatch();
  const groupsStatus = useSelector(selectGroupSliceStatus);
  const groupsError = useSelector(errorSelector);
  const message = useMessage();
  react.exports.useEffect(() => {
    if (groupsStatus === "idle") {
      dispatch(getGroups());
    }
  }, []);
  let groupsContent;
  switch (groupsStatus) {
    case "loading":
      groupsContent = /* @__PURE__ */ React.createElement(Loader, null);
      break;
    case "succeeded":
      groupsContent = /* @__PURE__ */ React.createElement(GroupList, null);
      break;
    case "failed":
      message(groupsError.message);
      groupsContent = /* @__PURE__ */ React.createElement("p", null, "Something went wrong");
      break;
    default:
      groupsContent = /* @__PURE__ */ React.createElement(Loader, null);
      break;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: "groups-manage"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "col s12 m6"
  }, groupsContent), /* @__PURE__ */ React.createElement("div", {
    className: "col s12 m6"
  }, /* @__PURE__ */ React.createElement(ErrorBoundary, null, /* @__PURE__ */ React.createElement(CreateGroup, null)))));
};
var groupCard = "";
const GroupCardLinkItem = ({ link }) => {
  const dispatch = useDispatch();
  const message = useMessage();
  const groupId = useParams().id;
  const locked = useSelector(selectLockAssignAndDeleteButtons);
  const tooltip = react.exports.useRef();
  const withdrawLink = async (linkId) => {
    try {
      const withdrawnLink = await dispatch(withdrawLinkFromGroup({ groupId, linkId })).unwrap();
      message(withdrawnLink.data.message, "success");
    } catch (e) {
      message(e.message, "warn");
      console.log(e);
    }
  };
  react.exports.useEffect(() => {
    M.Tooltip.init(tooltip.current);
  }, []);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    className: "withdraw-link"
  }, /* @__PURE__ */ React.createElement("button", {
    className: "btn orange lighten-1 btn-small tooltipped",
    onClick: () => withdrawLink(link._id),
    disabled: locked,
    ref: tooltip,
    "data-tooltip": "Withdraw link from group",
    "data-position": "top"
  }, /* @__PURE__ */ React.createElement("i", {
    className: " material-icons"
  }, "clear"))), /* @__PURE__ */ React.createElement("div", {
    className: "link-names"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "from"
  }, "Source: ", /* @__PURE__ */ React.createElement("span", null, link.title ? link.title : link.from)), /* @__PURE__ */ React.createElement("span", {
    className: "to orange lighten-4 text-accent-1"
  }, "Short link: ", /* @__PURE__ */ React.createElement("span", null, link.to))));
};
const GroupCard = ({ assignedLinks, group }) => {
  const renderGroupLinks = () => {
    if (assignedLinks.length === 0) {
      return /* @__PURE__ */ React.createElement("p", null, "No links assigned to group");
    }
    return /* @__PURE__ */ React.createElement("ul", {
      className: "group-links"
    }, assignedLinks.map((link) => {
      return /* @__PURE__ */ React.createElement("li", {
        className: "group-link card",
        key: link._id
      }, /* @__PURE__ */ React.createElement(GroupCardLinkItem, {
        link
      }));
    }));
  };
  const groupLinks = renderGroupLinks();
  const groupDescription = group.description ? /* @__PURE__ */ React.createElement("p", null, group.description) : null;
  return /* @__PURE__ */ React.createElement("div", {
    className: "group-card"
  }, /* @__PURE__ */ React.createElement("h2", null, group == null ? void 0 : group.name), group && groupDescription, group && groupLinks);
};
var groupDetails = "";
var groupStatistics = "";
const color = randomColor;
Chart.register(CategoryScale, LinearScale, BarElement, plugin_title, plugin_tooltip, plugin_legend, ArcElement);
const GroupStatistics = ({ assignedLinks }) => {
  const links = assignedLinks;
  if (links.length === 0) {
    return /* @__PURE__ */ React.createElement("div", {
      className: "group-stat empty"
    }, /* @__PURE__ */ React.createElement("i", {
      className: "medium material-icons grey-text"
    }, "pie_chart"), /* @__PURE__ */ React.createElement("p", {
      className: ""
    }, "Add some links to this group to see statistics"));
  }
  const labels = links.map((link) => link.title ? link.title : link.to);
  const dataSets = [{
    label: "All links set",
    data: links.map((link) => +link.clicks),
    backgroundColor: labels.map(() => color({ hue: "orange", format: "rgb" })),
    hoverOffset: 7,
    weight: 1
  }];
  const data = {
    labels,
    datasets: dataSets
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top"
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart"
      }
    },
    layout: {
      padding: 10
    }
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: "group-stat"
  }, /* @__PURE__ */ React.createElement(Doughnut, {
    type: "doughnut",
    data,
    options
  }));
};
const GroupDetails = () => {
  const groupId = useParams().id;
  const dispatch = useDispatch();
  const history2 = useHistory();
  const message = useMessage();
  const allLinks = useSelector(selectAllLinks);
  const group = useSelector((state) => selectGroupById(state, groupId));
  const removeGroup = async () => {
    try {
      history2.push("/management");
      const deleted = await dispatch(deleteGroup(groupId)).unwrap();
      message(deleted.message, "success");
    } catch (e) {
      history2.push("/management");
      message(e.message, "error");
    }
  };
  if (!group) {
    return /* @__PURE__ */ React.createElement(Loader, null);
  }
  const linksToAssign = allLinks.filter((link) => !group.links.includes(link._id));
  const assignedLinks = allLinks.filter((link) => group.links.includes(link._id));
  const assignLinksModal = useModal("assign-links", { linksToAssign, hideButtonText: true });
  const editGroupModal = useModal("edit-group", { id: groupId, hideButtonText: true, focused: true });
  const deleteWithConfirmation = useModal("confirm-delete", { doubt: removeGroup, tooltipName: "group", id: `delete-${groupId}`, name: group.name, hideButtonText: true });
  const addLinkModal = useModal("add", { id: groupId, hideButtonText: true, focused: true });
  const groupLinks = group ? /* @__PURE__ */ React.createElement(GroupCard, {
    group,
    assignedLinks
  }) : /* @__PURE__ */ React.createElement(Loader, null);
  return /* @__PURE__ */ React.createElement("div", {
    className: "group-details"
  }, /* @__PURE__ */ React.createElement(Link, {
    className: "back-to-console",
    to: "/management"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "material-icons"
  }, "arrow_back"), /* @__PURE__ */ React.createElement("p", null, " Back to Group list")), /* @__PURE__ */ React.createElement("div", {
    className: "row group-row"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "col s12 m12 l6"
  }, groupLinks, /* @__PURE__ */ React.createElement("div", {
    className: "button-group"
  }, deleteWithConfirmation, assignLinksModal, editGroupModal, addLinkModal)), /* @__PURE__ */ React.createElement("div", {
    className: "col s12 m12 l6"
  }, /* @__PURE__ */ React.createElement(GroupStatistics, {
    assignedLinks
  }))));
};
var dashboardPage = "";
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, TimeScale, TimeSeriesScale, plugin_title, plugin_tooltip, plugin_legend);
const GlobalChart = ({ data = null, chartMax = 1e3 }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: true
    },
    stacked: true,
    plugins: {
      title: {
        display: false,
        text: "Last two weeks statistics"
      }
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        startFromZero: true,
        stacked: true,
        min: 0,
        suggestedMax: chartMax,
        ticks: {
          stepSize: 10
        }
      },
      x: {
        display: "auto",
        stacked: true
      }
    }
  };
  if (!data) {
    return /* @__PURE__ */ React.createElement(Loader, null);
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: "two-weeks-stat show-on-large hide-on-small-and-down"
  }, /* @__PURE__ */ React.createElement(Bar, {
    data,
    type: "bar",
    options
  }));
};
var topPerformers = "";
const TopPerformers = ({ topPerformersData }) => {
  const { topCity, topCountry, totalClicks } = topPerformersData;
  return /* @__PURE__ */ React.createElement("div", {
    className: "top-performers row"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "total col m4 s12 l12"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "medium material-icons"
  }, "insert_chart"), /* @__PURE__ */ React.createElement("p", {
    className: "top-content"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "top-data"
  }, totalClicks), /* @__PURE__ */ React.createElement("span", {
    className: "top-header grey-text"
  }, "Total clicks"))), /* @__PURE__ */ React.createElement("div", {
    className: "top-country col m4 s12 l12"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "medium material-icons "
  }, "location_on"), /* @__PURE__ */ React.createElement("p", {
    className: "top-content"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "top-data"
  }, topCountry), /* @__PURE__ */ React.createElement("span", {
    className: "top-header grey-text"
  }, "Top Country "))), /* @__PURE__ */ React.createElement("div", {
    className: "top-city col m4 s12 l12"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "medium material-icons"
  }, "location_city"), /* @__PURE__ */ React.createElement("p", {
    className: "top-content"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "top-data"
  }, topCity), /* @__PURE__ */ React.createElement("span", {
    className: "top-header grey-text"
  }, "Top City"))));
};
var oneLinkStats = "";
var linkStat = "";
Chart.register(CategoryScale, LinearScale, BarElement, plugin_title, plugin_tooltip, plugin_legend, ArcElement);
const LinkStats = ({ link }) => {
  const { title, to, from, clicks, date, clicksCollection } = link;
  const luxonDate = DateTime.fromMillis(+date);
  const prepareCityData = () => {
    let cityList = [];
    clicksCollection.clicks.forEach(({ city }) => {
      const existingCity = cityList.find((cityItem) => cityItem.name === city);
      if (!existingCity) {
        cityList.push({ name: city, count: 1 });
      } else {
        existingCity.count++;
      }
    });
    const labels = cityList.map((cityItem) => cityItem.name);
    const data = cityList.map((cityItem) => cityItem.count);
    return {
      labels,
      data
    };
  };
  const prepareCountryData = () => {
    let countryList = [];
    clicksCollection.clicks.forEach(({ country }) => {
      const existingCountry = countryList.find((countryItem) => countryItem.name === country);
      if (!existingCountry) {
        countryList.push({ name: country, count: 1 });
      } else {
        existingCountry.count++;
      }
    });
    const labels = countryList.map((countryItem) => countryItem.name);
    const data = countryList.map((countryItem) => countryItem.count);
    return {
      labels,
      data
    };
  };
  const cities = prepareCityData();
  const countries = prepareCountryData();
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom"
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart"
      }
    },
    layout: {
      padding: 10
    }
  };
  const cityData = {
    labels: cities.labels,
    datasets: [{
      label: "Cities",
      data: cities.data,
      backgroundColor: cities.labels.map((_) => randomColor({ hue: "orange", format: "rgb" })),
      cutout: 80,
      circumference: 180,
      rotation: 270
    }],
    hoverOffset: 7
  };
  const countryData = {
    labels: countries.labels,
    datasets: [{
      label: "Countries",
      data: countries.data,
      backgroundColor: countries.labels.map((_) => randomColor({ hue: "orange", format: "rgb" })),
      cutout: 80,
      circumference: 180,
      rotation: 270
    }],
    hoverOffset: 7
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: "link-stats"
  }, /* @__PURE__ */ React.createElement("p", {
    className: "created grey-text"
  }, " created ", luxonDate.toISODate()), /* @__PURE__ */ React.createElement("h4", {
    className: "link-title"
  }, title ? title : from), /* @__PURE__ */ React.createElement("p", {
    className: "teal-text text-darken-1 link-short"
  }, to), /* @__PURE__ */ React.createElement("p", {
    className: "clicks"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "grey-text"
  }, "Total Clicks: "), " ", clicks), /* @__PURE__ */ React.createElement("div", {
    className: "divider"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "link-stats-charts"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "countries-chart col l6 m6 s12"
  }, /* @__PURE__ */ React.createElement("h5", null, "Countries"), /* @__PURE__ */ React.createElement(Doughnut, {
    type: "doughnut",
    data: countryData,
    options
  })), /* @__PURE__ */ React.createElement("div", {
    className: "cities-chart col l6 m6 s12"
  }, /* @__PURE__ */ React.createElement("h5", null, "Cities"), /* @__PURE__ */ React.createElement(Doughnut, {
    type: "doughnut",
    data: cityData,
    options
  })))));
};
const OneLinkStats = ({ linkList }) => {
  const message = useMessage();
  const linkStatisticsStatus = useSelector(selectLinkStatisticsStatus);
  const dispatch = useDispatch();
  const startLink = linkList[0]._id;
  const [activeLinkId, setActiveLinkId] = react.exports.useState(startLink);
  const getDetails = async () => {
    try {
      await dispatch(getDetailedClicks(activeLinkId)).unwrap();
    } catch (e) {
      message(e.message, "warn");
    }
  };
  const link = useSelector((state) => selectLinkById(state, activeLinkId));
  react.exports.useEffect(async () => {
    await getDetails();
  }, [activeLinkId]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "row one-link-stats"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "col s12 m4 l2"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "link-selector"
  }, /* @__PURE__ */ React.createElement("ul", {
    className: "collection"
  }, linkList.map(({ title, _id, to }) => {
    const cardClasses = activeLinkId === _id ? "collection-item active" : "collection-item";
    return /* @__PURE__ */ React.createElement("li", {
      key: _id,
      id: _id,
      className: cardClasses
    }, /* @__PURE__ */ React.createElement("button", {
      className: "btn btn-flat link-stat-btn",
      onClick: () => setActiveLinkId(_id),
      disabled: linkStatisticsStatus === "loading"
    }, title ? title : to));
  })))), /* @__PURE__ */ React.createElement("div", {
    className: "col s12 m8 l10"
  }, link.clicksCollection.clicks ? /* @__PURE__ */ React.createElement(LinkStats, {
    link
  }) : /* @__PURE__ */ React.createElement(Loader, null)));
};
const DashboardPage = () => {
  const message = useMessage();
  const dispatch = useDispatch();
  const groupsStatus = useSelector(selectGroupSliceStatus);
  const linksStatus = useSelector(linksSliceStatus);
  const linkList = useSelector(selectAllClickedLinks);
  const statisticsStatus = useSelector(selectStatsStatus);
  const statisticsData = useSelector(selectDashBoardStats);
  const [xPeriod, setXPeriod] = react.exports.useState(13);
  if (linksStatus !== "succeeded" || groupsStatus !== "succeeded") {
    return /* @__PURE__ */ React.createElement(Loader, null);
  }
  if (linkList.length === 0) {
    return /* @__PURE__ */ React.createElement("div", {
      className: "dashboard-page empty"
    }, /* @__PURE__ */ React.createElement("div", {
      className: "container center-align"
    }, /* @__PURE__ */ React.createElement("i", {
      className: "medium material-icons grey-text"
    }, "insert_chart"), /* @__PURE__ */ React.createElement("p", {
      className: ""
    }, "To view dashboard and statistics make some links with clicks")));
  }
  const getDashboardData = async () => {
    try {
      if (linksStatus === "succeeded" && groupsStatus === "succeeded") {
        await dispatch(getManyLinksDetailedClicks({ period: xPeriod })).unwrap();
      }
    } catch (e) {
      console.log(e);
      message(e.message, "warn");
    }
  };
  react.exports.useLayoutEffect(() => {
    getDashboardData();
  }, [xPeriod]);
  if (!statisticsData) {
    return /* @__PURE__ */ React.createElement(Loader, null);
  }
  const { dashBoardChartData, topPerformersData } = statisticsData;
  const data = {
    labels: dashBoardChartData.labels,
    datasets: dashBoardChartData.datasets
  };
  const selectDashboardPeriod = (event) => {
    setXPeriod(event.target.value);
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: "dashboard-page"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "row dashboard-heading "
  }, /* @__PURE__ */ React.createElement("h4", null, "Statistics for"), /* @__PURE__ */ React.createElement("div", {
    className: "period-selector"
  }, /* @__PURE__ */ React.createElement("select", {
    className: "browser-default select-wrapper",
    onChange: selectDashboardPeriod,
    value: xPeriod,
    disabled: statisticsStatus === "loading"
  }, /* @__PURE__ */ React.createElement("option", {
    value: "6"
  }, "Week"), /* @__PURE__ */ React.createElement("option", {
    value: "13"
  }, "Two Weeks"), /* @__PURE__ */ React.createElement("option", {
    value: "30"
  }, "Month")))), /* @__PURE__ */ React.createElement("div", {
    className: "row section dashboard-stats"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "col s12 m12 l2"
  }, /* @__PURE__ */ React.createElement(ErrorBoundary, null, statisticsStatus === "loading" ? /* @__PURE__ */ React.createElement(Loader, null) : /* @__PURE__ */ React.createElement(TopPerformers, {
    topPerformersData
  }))), /* @__PURE__ */ React.createElement("div", {
    className: "col s12 m12 l10"
  }, /* @__PURE__ */ React.createElement(ErrorBoundary, null, statisticsStatus === "loading" ? /* @__PURE__ */ React.createElement(Loader, null) : /* @__PURE__ */ React.createElement(GlobalChart, {
    data,
    chartMax: dashBoardChartData.chartMax
  })))), /* @__PURE__ */ React.createElement("div", {
    className: "divider"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "row section individual-stats"
  }, /* @__PURE__ */ React.createElement(ErrorBoundary, null, linkList && /* @__PURE__ */ React.createElement(OneLinkStats, {
    linkList
  }))));
};
var passwordReset = "";
const PasswordReset = () => {
  const { search } = useLocation();
  const query = React.useMemo(() => new URLSearchParams(search), [search]);
  const [form, setForm] = react.exports.useState({
    password: "",
    passwordConfirm: ""
  });
  const [error, setError] = react.exports.useState(null);
  const [passwordError, setPasswordError] = react.exports.useState(null);
  const message = useMessage();
  const history2 = useHistory();
  const formHandler = (event) => {
    setForm(__spreadProps(__spreadValues({}, form), { [event.target.name]: event.target.value }));
  };
  const setNewPasswordHandler = async () => {
    try {
      const { password, passwordConfirm } = form;
      if (password !== passwordConfirm) {
        return message("Passwords in both fields should be equal", "warn");
      }
      const token = query.get("token");
      const userId = query.get("id");
      const renewedPassword = await $api.post("/api/auth/resetPassword", { userId, token, password });
      message(renewedPassword.data.message, "success");
      history2.push("/auth");
    } catch (e) {
      setError(e);
      message(e.message, "warn");
    }
  };
  const disableOnEmptyInputs = !(form.passwordConfirm.length === 0 || form.password.length === 0);
  react.exports.useEffect(() => {
    if (error && error.errors.length > 0) {
      let errorArray = null;
      error.errors.forEach((error2) => {
        errorArray = errorArray ? `${errorArray}, ${error2}` : error2;
      });
      setPasswordError(errorArray);
    }
    M.updateTextFields();
  }, [error]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "password-reset"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "col s12 m10 l4 offset-l4 offset-m1"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "card grey lighten-5"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "card-content black-text  "
  }, /* @__PURE__ */ React.createElement("h4", {
    className: "card-title "
  }, "Set new password"), /* @__PURE__ */ React.createElement("div", {
    className: "forgot-password-form-fields"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "input-field"
  }, /* @__PURE__ */ React.createElement("input", {
    type: "password",
    id: "password",
    name: "password",
    onChange: formHandler,
    value: form.password,
    className: passwordError ? "invalid" : void 0
  }), /* @__PURE__ */ React.createElement("label", {
    htmlFor: "password"
  }, "Password"), passwordError && /* @__PURE__ */ React.createElement("span", {
    className: "helper-text",
    "data-error": passwordError
  }, "Helper text")), /* @__PURE__ */ React.createElement("div", {
    className: "input-field"
  }, /* @__PURE__ */ React.createElement("input", {
    type: "password",
    id: "passwordConfirm",
    name: "passwordConfirm",
    onChange: formHandler,
    value: form.passwordConfirm
  }), /* @__PURE__ */ React.createElement("label", {
    htmlFor: "passwordConfirm"
  }, "Confirm password")))), /* @__PURE__ */ React.createElement("div", {
    className: "card-action buttons"
  }, /* @__PURE__ */ React.createElement("button", {
    className: "btn darken-1 full-width",
    onClick: setNewPasswordHandler,
    disabled: !disableOnEmptyInputs
  }, "Reset Password"))))));
};
var forgotPassword = "";
const ForgotPassword = () => {
  const [email, setEmail] = react.exports.useState("");
  const disableOnEmptyInputs = !(email.length === 0);
  const dispatch = useDispatch();
  const message = useMessage();
  const authError = useSelector(selectAuthError);
  const emailErrorMessage = authError ? authError.message : null;
  const formHandler = (event) => {
    event.preventDefault();
    setEmail(event.target.value);
  };
  const resetHandler = async () => {
    try {
      const resetRequest = await dispatch(resetPasswordRequest({ email })).unwrap();
      message(resetRequest.message, "success");
    } catch (e) {
      message(e, "warn");
      console.log(e);
    }
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: "forgot-password"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "col s12 m10 l4 offset-l4 offset-m1"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "card grey lighten-5"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "card-content black-text center-align "
  }, /* @__PURE__ */ React.createElement("div", {
    className: "card-image forgot-bot"
  }, /* @__PURE__ */ React.createElement("img", {
    className: "bot-img",
    src: botImg,
    alt: "bot-thinking"
  })), /* @__PURE__ */ React.createElement("h4", {
    className: "card-title orange-text forgot-title"
  }, "Forgot your password?"), /* @__PURE__ */ React.createElement("span", {
    className: "card-content grey-text text-darken-1"
  }, "It could happen to everyone. Enter your email to request password reset link."), /* @__PURE__ */ React.createElement("div", {
    className: "forgot-password-form-fields"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "input-field"
  }, /* @__PURE__ */ React.createElement("input", {
    type: "text",
    id: "user_email",
    name: "email",
    onChange: formHandler,
    value: email,
    className: emailErrorMessage ? "invalid" : void 0
  }), /* @__PURE__ */ React.createElement("label", {
    htmlFor: "user_email"
  }, "Email"), emailErrorMessage && /* @__PURE__ */ React.createElement("span", {
    className: "helper-text",
    "data-error": emailErrorMessage
  }, "Helper text")))), /* @__PURE__ */ React.createElement("div", {
    className: "card-action buttons"
  }, /* @__PURE__ */ React.createElement("button", {
    className: "btn orange darken-1 full-width",
    onClick: resetHandler,
    disabled: !disableOnEmptyInputs
  }, "Reset Password"))))));
};
const Routes = (isAuthenticated) => {
  if (!isAuthenticated) {
    return /* @__PURE__ */ React.createElement(Switch, null, /* @__PURE__ */ React.createElement(Route, {
      path: "/",
      exact: true
    }, /* @__PURE__ */ React.createElement(WelcomePage, null)), /* @__PURE__ */ React.createElement(Route, {
      path: "/auth",
      exact: true
    }, /* @__PURE__ */ React.createElement(AuthPage, null)), /* @__PURE__ */ React.createElement(Route, {
      path: "/forgotten",
      exact: true
    }, /* @__PURE__ */ React.createElement(ForgotPassword, null)), /* @__PURE__ */ React.createElement(Route, {
      path: "/resetPassword",
      exact: true
    }, /* @__PURE__ */ React.createElement(PasswordReset, null)), /* @__PURE__ */ React.createElement(Redirect, {
      to: "/"
    }));
  }
  return /* @__PURE__ */ React.createElement(Switch, null, /* @__PURE__ */ React.createElement(Route, {
    path: "/",
    exact: true
  }, /* @__PURE__ */ React.createElement(DashboardPage, null)), /* @__PURE__ */ React.createElement(Route, {
    path: "/links",
    exact: true
  }, /* @__PURE__ */ React.createElement("div", {
    className: "container"
  }, /* @__PURE__ */ React.createElement(LinksPage, null))), /* @__PURE__ */ React.createElement(Route, {
    path: "/create",
    exact: true
  }, /* @__PURE__ */ React.createElement("div", {
    className: "container"
  }, /* @__PURE__ */ React.createElement(CreatePage, null))), /* @__PURE__ */ React.createElement(Route, {
    path: "/details/:id"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "container"
  }, /* @__PURE__ */ React.createElement(DetailsPage, null))), /* @__PURE__ */ React.createElement(Route, {
    path: "/groups/:id"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "container"
  }, /* @__PURE__ */ React.createElement(GroupDetails, null))), /* @__PURE__ */ React.createElement(Route, {
    path: "/management"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "container"
  }, /* @__PURE__ */ React.createElement(GroupsManagement, null))), /* @__PURE__ */ React.createElement(Redirect, {
    to: "/"
  }));
};
var header = "";
const Header = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const history2 = useHistory();
  const message = useMessage();
  const addModal = useModal("add", { flatModal: true, noTooltip: true, focused: true });
  const logoutHandler = async (event) => {
    event.preventDefault();
    dispatch(logout());
    history2.push("/auth");
    message("Logged Out", "success");
  };
  const { pathname } = useLocation();
  const split = pathname.split("/");
  react.exports.useEffect(() => {
    const sideBarElement = document.querySelectorAll(".sidenav");
    if (sideBarElement.length !== 0) {
      M.Sidenav.init(sideBarElement, { draggable: true });
    }
    const dropdownTrigger = document.querySelectorAll(".dropdown-trigger");
    if (dropdownTrigger.length !== 0) {
      M.Dropdown.init(dropdownTrigger, { coverTrigger: false, constrainWidth: false });
    }
  }, []);
  if (!isAuthenticated) {
    return /* @__PURE__ */ React.createElement("div", {
      className: "header"
    }, /* @__PURE__ */ React.createElement("nav", null, /* @__PURE__ */ React.createElement("div", {
      className: "nav-wrapper header teal lighten-1"
    }, /* @__PURE__ */ React.createElement("span", {
      className: `brand-logo ${split[1] === "" ? "active" : ""}`
    }, /* @__PURE__ */ React.createElement(NavLink, {
      to: "/"
    }, "ShrInk.tech")), /* @__PURE__ */ React.createElement("a", {
      href: "#",
      "data-target": "mobile-menu",
      className: "sidenav-trigger"
    }, /* @__PURE__ */ React.createElement("i", {
      className: "material-icons"
    }, "menu")), /* @__PURE__ */ React.createElement("ul", {
      id: "nav-mobile",
      className: "right hide-on-med-and-down"
    }, /* @__PURE__ */ React.createElement("li", {
      className: split[1] === "auth" ? "active" : ""
    }, /* @__PURE__ */ React.createElement(NavLink, {
      to: "/auth"
    }, /* @__PURE__ */ React.createElement("i", {
      className: "material-icons left"
    }, "account_circle"), "Sign In | Sign Up"))))), /* @__PURE__ */ React.createElement("ul", {
      className: "sidenav",
      id: "mobile-menu"
    }, /* @__PURE__ */ React.createElement("li", {
      className: split[1] === "auth" ? "active" : ""
    }, /* @__PURE__ */ React.createElement(NavLink, {
      to: "/auth",
      className: "sidenav-close"
    }, /* @__PURE__ */ React.createElement("i", {
      className: "material-icons"
    }, "account_circle"), "Login / Register"))));
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: "header"
  }, /* @__PURE__ */ React.createElement("ul", {
    id: "account-dropdown",
    className: "dropdown-content"
  }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", {
    href: "/",
    onClick: logoutHandler
  }, /* @__PURE__ */ React.createElement("i", {
    className: "material-icons left"
  }, "exit_to_app"), "Logout"))), /* @__PURE__ */ React.createElement("nav", null, /* @__PURE__ */ React.createElement("div", {
    className: "nav-wrapper teal lighten-1"
  }, /* @__PURE__ */ React.createElement("span", {
    className: `brand-logo ${split[1] === "" ? "active" : ""}`
  }, /* @__PURE__ */ React.createElement(NavLink, {
    to: "/"
  }, "ShrInk.tech")), /* @__PURE__ */ React.createElement("a", {
    href: "#",
    "data-target": "mobile-menu",
    className: "sidenav-trigger"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "material-icons"
  }, "menu")), /* @__PURE__ */ React.createElement("ul", {
    id: "nav-mobile",
    className: "right hide-on-med-and-down"
  }, /* @__PURE__ */ React.createElement("li", null, addModal), /* @__PURE__ */ React.createElement("li", {
    className: split[1] === "links" ? "active" : ""
  }, /* @__PURE__ */ React.createElement(NavLink, {
    to: "/links"
  }, "Links")), /* @__PURE__ */ React.createElement("li", {
    className: split[1] === "management" ? "active" : ""
  }, /* @__PURE__ */ React.createElement(NavLink, {
    to: "/management"
  }, "Groups")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", {
    className: "dropdown-trigger",
    "data-target": "account-dropdown"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "material-icons"
  }, "account_circle")))))), /* @__PURE__ */ React.createElement("ul", {
    className: "sidenav",
    id: "mobile-menu"
  }, /* @__PURE__ */ React.createElement("li", {
    className: split[1] === "create" ? "active" : ""
  }, /* @__PURE__ */ React.createElement(NavLink, {
    className: "sidenav-close",
    to: "/create"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "material-icons left"
  }, "add"), " Create")), /* @__PURE__ */ React.createElement("li", {
    className: split[1] === "links" ? "active" : ""
  }, /* @__PURE__ */ React.createElement(NavLink, {
    className: "sidenav-close",
    to: "/links"
  }, "Links")), /* @__PURE__ */ React.createElement("li", {
    className: split[1] === "management" ? "active" : ""
  }, /* @__PURE__ */ React.createElement(NavLink, {
    className: "sidenav-close",
    to: "/management"
  }, "Groups")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", {
    className: "sidenav-close",
    href: "/",
    onClick: logoutHandler
  }, /* @__PURE__ */ React.createElement("i", {
    className: "material-icons"
  }, "account_circle"), "Logout"))));
};
const storageName = "userData";
function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const ready = useSelector(selectAuthReady);
  const groupsStatus = useSelector(selectGroupSliceStatus);
  const linksStatus = useSelector(linksSliceStatus);
  const authStatus = useSelector(selectAuthStatus);
  const routes = Routes(isAuthenticated);
  const dispatch = useDispatch();
  const message = useMessage();
  react.exports.useLayoutEffect(() => {
    const authCheck = async () => {
      if (localStorage.getItem(storageName)) {
        try {
          await dispatch(checkAuth()).unwrap();
        } catch (e) {
          message(e.message, "warn");
          return dispatch(clearError);
        }
      }
    };
    authCheck();
  }, []);
  react.exports.useEffect(() => {
    const fetchData = async () => {
      if (linksStatus === "idle" && authStatus === "success" && isAuthenticated) {
        try {
          await dispatch(getLinks()).unwrap();
        } catch (e) {
          message(e.message, "error");
        }
      }
      if (groupsStatus === "idle" && authStatus === "success" && isAuthenticated) {
        try {
          await dispatch(getGroups()).unwrap();
        } catch (e) {
          message(e.message, "error");
        }
      }
    };
    fetchData();
  }, [authStatus]);
  if (!ready || linksStatus === "loading" || groupsStatus === "loading") {
    return /* @__PURE__ */ React.createElement(Loader, null);
  }
  return /* @__PURE__ */ React.createElement(BrowserRouter, null, /* @__PURE__ */ React.createElement(Header, null), /* @__PURE__ */ React.createElement(ErrorBoundary, null, routes));
}
ReactDOM.render(/* @__PURE__ */ React.createElement(React.StrictMode, null, /* @__PURE__ */ React.createElement(Provider, {
  store
}, /* @__PURE__ */ React.createElement(App, null))), document.getElementById("root"));
