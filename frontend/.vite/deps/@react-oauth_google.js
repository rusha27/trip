<<<<<<< HEAD:Frontend/.vite/deps/@react-oauth_google.js
"use client";
import {
  require_react
} from "./chunk-YLDSBLSF.js";
import {
  __toESM
} from "./chunk-DC5AMYBS.js";

// node_modules/@react-oauth/google/dist/index.esm.js
var import_react = __toESM(require_react());
function useLoadGsiScript(options = {}) {
  const { nonce, onScriptLoadSuccess, onScriptLoadError } = options;
  const [scriptLoadedSuccessfully, setScriptLoadedSuccessfully] = (0, import_react.useState)(false);
  const onScriptLoadSuccessRef = (0, import_react.useRef)(onScriptLoadSuccess);
  onScriptLoadSuccessRef.current = onScriptLoadSuccess;
  const onScriptLoadErrorRef = (0, import_react.useRef)(onScriptLoadError);
  onScriptLoadErrorRef.current = onScriptLoadError;
  (0, import_react.useEffect)(() => {
    const scriptTag = document.createElement("script");
    scriptTag.src = "https://accounts.google.com/gsi/client";
    scriptTag.async = true;
    scriptTag.defer = true;
    scriptTag.nonce = nonce;
    scriptTag.onload = () => {
      var _a;
      setScriptLoadedSuccessfully(true);
      (_a = onScriptLoadSuccessRef.current) === null || _a === void 0 ? void 0 : _a.call(onScriptLoadSuccessRef);
    };
    scriptTag.onerror = () => {
      var _a;
      setScriptLoadedSuccessfully(false);
      (_a = onScriptLoadErrorRef.current) === null || _a === void 0 ? void 0 : _a.call(onScriptLoadErrorRef);
    };
    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, [nonce]);
  return scriptLoadedSuccessfully;
}
var GoogleOAuthContext = (0, import_react.createContext)(null);
function GoogleOAuthProvider({ clientId, nonce, onScriptLoadSuccess, onScriptLoadError, children }) {
  const scriptLoadedSuccessfully = useLoadGsiScript({
    nonce,
    onScriptLoadSuccess,
    onScriptLoadError
  });
  const contextValue = (0, import_react.useMemo)(() => ({
    clientId,
    scriptLoadedSuccessfully
  }), [clientId, scriptLoadedSuccessfully]);
  return import_react.default.createElement(GoogleOAuthContext.Provider, { value: contextValue }, children);
}
function useGoogleOAuth() {
  const context = (0, import_react.useContext)(GoogleOAuthContext);
  if (!context) {
    throw new Error("Google OAuth components must be used within GoogleOAuthProvider");
  }
  return context;
}
function extractClientId(credentialResponse) {
  var _a;
  const clientId = (_a = credentialResponse === null || credentialResponse === void 0 ? void 0 : credentialResponse.clientId) !== null && _a !== void 0 ? _a : credentialResponse === null || credentialResponse === void 0 ? void 0 : credentialResponse.client_id;
  return clientId;
}
var containerHeightMap = { large: 40, medium: 32, small: 20 };
function GoogleLogin({ onSuccess, onError, useOneTap, promptMomentNotification, type = "standard", theme = "outline", size = "large", text, shape, logo_alignment, width, locale, click_listener, containerProps, ...props }) {
  const btnContainerRef = (0, import_react.useRef)(null);
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();
  const onSuccessRef = (0, import_react.useRef)(onSuccess);
  onSuccessRef.current = onSuccess;
  const onErrorRef = (0, import_react.useRef)(onError);
  onErrorRef.current = onError;
  const promptMomentNotificationRef = (0, import_react.useRef)(promptMomentNotification);
  promptMomentNotificationRef.current = promptMomentNotification;
  (0, import_react.useEffect)(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (!scriptLoadedSuccessfully)
      return;
    (_c = (_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.initialize({
      client_id: clientId,
      callback: (credentialResponse) => {
        var _a2;
        if (!(credentialResponse === null || credentialResponse === void 0 ? void 0 : credentialResponse.credential)) {
          return (_a2 = onErrorRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(onErrorRef);
        }
        const { credential, select_by } = credentialResponse;
        onSuccessRef.current({
          credential,
          clientId: extractClientId(credentialResponse),
          select_by
        });
      },
      ...props
    });
    (_f = (_e = (_d = window === null || window === void 0 ? void 0 : window.google) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e.id) === null || _f === void 0 ? void 0 : _f.renderButton(btnContainerRef.current, {
      type,
      theme,
      size,
      text,
      shape,
      logo_alignment,
      width,
      locale,
      click_listener
    });
    if (useOneTap)
      (_j = (_h = (_g = window === null || window === void 0 ? void 0 : window.google) === null || _g === void 0 ? void 0 : _g.accounts) === null || _h === void 0 ? void 0 : _h.id) === null || _j === void 0 ? void 0 : _j.prompt(promptMomentNotificationRef.current);
    return () => {
      var _a2, _b2, _c2;
      if (useOneTap)
        (_c2 = (_b2 = (_a2 = window === null || window === void 0 ? void 0 : window.google) === null || _a2 === void 0 ? void 0 : _a2.accounts) === null || _b2 === void 0 ? void 0 : _b2.id) === null || _c2 === void 0 ? void 0 : _c2.cancel();
    };
  }, [
    clientId,
    scriptLoadedSuccessfully,
    useOneTap,
    type,
    theme,
    size,
    text,
    shape,
    logo_alignment,
    width,
    locale
  ]);
  return import_react.default.createElement("div", { ...containerProps, ref: btnContainerRef, style: { height: containerHeightMap[size], ...containerProps === null || containerProps === void 0 ? void 0 : containerProps.style } });
}
function googleLogout() {
  var _a, _b, _c;
  (_c = (_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.disableAutoSelect();
}
function useGoogleLogin({ flow = "implicit", scope = "", onSuccess, onError, onNonOAuthError, overrideScope, state, ...props }) {
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();
  const clientRef = (0, import_react.useRef)();
  const onSuccessRef = (0, import_react.useRef)(onSuccess);
  onSuccessRef.current = onSuccess;
  const onErrorRef = (0, import_react.useRef)(onError);
  onErrorRef.current = onError;
  const onNonOAuthErrorRef = (0, import_react.useRef)(onNonOAuthError);
  onNonOAuthErrorRef.current = onNonOAuthError;
  (0, import_react.useEffect)(() => {
    var _a, _b;
    if (!scriptLoadedSuccessfully)
      return;
    const clientMethod = flow === "implicit" ? "initTokenClient" : "initCodeClient";
    const client = (_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b.oauth2[clientMethod]({
      client_id: clientId,
      scope: overrideScope ? scope : `openid profile email ${scope}`,
      callback: (response) => {
        var _a2, _b2;
        if (response.error)
          return (_a2 = onErrorRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(onErrorRef, response);
        (_b2 = onSuccessRef.current) === null || _b2 === void 0 ? void 0 : _b2.call(onSuccessRef, response);
      },
      error_callback: (nonOAuthError) => {
        var _a2;
        (_a2 = onNonOAuthErrorRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(onNonOAuthErrorRef, nonOAuthError);
      },
      state,
      ...props
    });
    clientRef.current = client;
  }, [clientId, scriptLoadedSuccessfully, flow, scope, state]);
  const loginImplicitFlow = (0, import_react.useCallback)((overrideConfig) => {
    var _a;
    return (_a = clientRef.current) === null || _a === void 0 ? void 0 : _a.requestAccessToken(overrideConfig);
  }, []);
  const loginAuthCodeFlow = (0, import_react.useCallback)(() => {
    var _a;
    return (_a = clientRef.current) === null || _a === void 0 ? void 0 : _a.requestCode();
  }, []);
  return flow === "implicit" ? loginImplicitFlow : loginAuthCodeFlow;
}
function useGoogleOneTapLogin({ onSuccess, onError, promptMomentNotification, cancel_on_tap_outside, prompt_parent_id, state_cookie_domain, hosted_domain, use_fedcm_for_prompt = false, disabled, auto_select }) {
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();
  const onSuccessRef = (0, import_react.useRef)(onSuccess);
  onSuccessRef.current = onSuccess;
  const onErrorRef = (0, import_react.useRef)(onError);
  onErrorRef.current = onError;
  const promptMomentNotificationRef = (0, import_react.useRef)(promptMomentNotification);
  promptMomentNotificationRef.current = promptMomentNotification;
  (0, import_react.useEffect)(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (!scriptLoadedSuccessfully)
      return;
    if (disabled) {
      (_c = (_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.cancel();
      return;
    }
    (_f = (_e = (_d = window === null || window === void 0 ? void 0 : window.google) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e.id) === null || _f === void 0 ? void 0 : _f.initialize({
      client_id: clientId,
      callback: (credentialResponse) => {
        var _a2;
        if (!(credentialResponse === null || credentialResponse === void 0 ? void 0 : credentialResponse.credential)) {
          return (_a2 = onErrorRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(onErrorRef);
        }
        const { credential, select_by } = credentialResponse;
        onSuccessRef.current({
          credential,
          clientId: extractClientId(credentialResponse),
          select_by
        });
      },
      hosted_domain,
      cancel_on_tap_outside,
      prompt_parent_id,
      state_cookie_domain,
      use_fedcm_for_prompt,
      auto_select
    });
    (_j = (_h = (_g = window === null || window === void 0 ? void 0 : window.google) === null || _g === void 0 ? void 0 : _g.accounts) === null || _h === void 0 ? void 0 : _h.id) === null || _j === void 0 ? void 0 : _j.prompt(promptMomentNotificationRef.current);
    return () => {
      var _a2, _b2, _c2;
      (_c2 = (_b2 = (_a2 = window === null || window === void 0 ? void 0 : window.google) === null || _a2 === void 0 ? void 0 : _a2.accounts) === null || _b2 === void 0 ? void 0 : _b2.id) === null || _c2 === void 0 ? void 0 : _c2.cancel();
    };
  }, [
    clientId,
    scriptLoadedSuccessfully,
    cancel_on_tap_outside,
    prompt_parent_id,
    state_cookie_domain,
    hosted_domain,
    use_fedcm_for_prompt,
    disabled,
    auto_select
  ]);
}
function hasGrantedAllScopesGoogle(tokenResponse, firstScope, ...restScopes) {
  var _a, _b, _c;
  if (!(window === null || window === void 0 ? void 0 : window.google))
    return false;
  return ((_c = (_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b.oauth2) === null || _c === void 0 ? void 0 : _c.hasGrantedAllScopes(tokenResponse, firstScope, ...restScopes)) || false;
}
function hasGrantedAnyScopeGoogle(tokenResponse, firstScope, ...restScopes) {
  var _a, _b, _c;
  if (!(window === null || window === void 0 ? void 0 : window.google))
    return false;
  return ((_c = (_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b.oauth2) === null || _c === void 0 ? void 0 : _c.hasGrantedAnyScope(tokenResponse, firstScope, ...restScopes)) || false;
}
export {
  GoogleLogin,
  GoogleOAuthProvider,
  googleLogout,
  hasGrantedAllScopesGoogle,
  hasGrantedAnyScopeGoogle,
  useGoogleLogin,
  useGoogleOAuth,
  useGoogleOneTapLogin
};
//# sourceMappingURL=@react-oauth_google.js.map
=======
"use client";
import {
  require_react
} from "./chunk-YLDSBLSF.js";
import {
  __toESM
} from "./chunk-DC5AMYBS.js";

// node_modules/@react-oauth/google/dist/index.esm.js
var import_react = __toESM(require_react());
function useLoadGsiScript(options = {}) {
  const { nonce, onScriptLoadSuccess, onScriptLoadError } = options;
  const [scriptLoadedSuccessfully, setScriptLoadedSuccessfully] = (0, import_react.useState)(false);
  const onScriptLoadSuccessRef = (0, import_react.useRef)(onScriptLoadSuccess);
  onScriptLoadSuccessRef.current = onScriptLoadSuccess;
  const onScriptLoadErrorRef = (0, import_react.useRef)(onScriptLoadError);
  onScriptLoadErrorRef.current = onScriptLoadError;
  (0, import_react.useEffect)(() => {
    const scriptTag = document.createElement("script");
    scriptTag.src = "https://accounts.google.com/gsi/client";
    scriptTag.async = true;
    scriptTag.defer = true;
    scriptTag.nonce = nonce;
    scriptTag.onload = () => {
      var _a;
      setScriptLoadedSuccessfully(true);
      (_a = onScriptLoadSuccessRef.current) === null || _a === void 0 ? void 0 : _a.call(onScriptLoadSuccessRef);
    };
    scriptTag.onerror = () => {
      var _a;
      setScriptLoadedSuccessfully(false);
      (_a = onScriptLoadErrorRef.current) === null || _a === void 0 ? void 0 : _a.call(onScriptLoadErrorRef);
    };
    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, [nonce]);
  return scriptLoadedSuccessfully;
}
var GoogleOAuthContext = (0, import_react.createContext)(null);
function GoogleOAuthProvider({ clientId, nonce, onScriptLoadSuccess, onScriptLoadError, children }) {
  const scriptLoadedSuccessfully = useLoadGsiScript({
    nonce,
    onScriptLoadSuccess,
    onScriptLoadError
  });
  const contextValue = (0, import_react.useMemo)(() => ({
    clientId,
    scriptLoadedSuccessfully
  }), [clientId, scriptLoadedSuccessfully]);
  return import_react.default.createElement(GoogleOAuthContext.Provider, { value: contextValue }, children);
}
function useGoogleOAuth() {
  const context = (0, import_react.useContext)(GoogleOAuthContext);
  if (!context) {
    throw new Error("Google OAuth components must be used within GoogleOAuthProvider");
  }
  return context;
}
function extractClientId(credentialResponse) {
  var _a;
  const clientId = (_a = credentialResponse === null || credentialResponse === void 0 ? void 0 : credentialResponse.clientId) !== null && _a !== void 0 ? _a : credentialResponse === null || credentialResponse === void 0 ? void 0 : credentialResponse.client_id;
  return clientId;
}
var containerHeightMap = { large: 40, medium: 32, small: 20 };
function GoogleLogin({ onSuccess, onError, useOneTap, promptMomentNotification, type = "standard", theme = "outline", size = "large", text, shape, logo_alignment, width, locale, click_listener, containerProps, ...props }) {
  const btnContainerRef = (0, import_react.useRef)(null);
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();
  const onSuccessRef = (0, import_react.useRef)(onSuccess);
  onSuccessRef.current = onSuccess;
  const onErrorRef = (0, import_react.useRef)(onError);
  onErrorRef.current = onError;
  const promptMomentNotificationRef = (0, import_react.useRef)(promptMomentNotification);
  promptMomentNotificationRef.current = promptMomentNotification;
  (0, import_react.useEffect)(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (!scriptLoadedSuccessfully)
      return;
    (_c = (_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.initialize({
      client_id: clientId,
      callback: (credentialResponse) => {
        var _a2;
        if (!(credentialResponse === null || credentialResponse === void 0 ? void 0 : credentialResponse.credential)) {
          return (_a2 = onErrorRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(onErrorRef);
        }
        const { credential, select_by } = credentialResponse;
        onSuccessRef.current({
          credential,
          clientId: extractClientId(credentialResponse),
          select_by
        });
      },
      ...props
    });
    (_f = (_e = (_d = window === null || window === void 0 ? void 0 : window.google) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e.id) === null || _f === void 0 ? void 0 : _f.renderButton(btnContainerRef.current, {
      type,
      theme,
      size,
      text,
      shape,
      logo_alignment,
      width,
      locale,
      click_listener
    });
    if (useOneTap)
      (_j = (_h = (_g = window === null || window === void 0 ? void 0 : window.google) === null || _g === void 0 ? void 0 : _g.accounts) === null || _h === void 0 ? void 0 : _h.id) === null || _j === void 0 ? void 0 : _j.prompt(promptMomentNotificationRef.current);
    return () => {
      var _a2, _b2, _c2;
      if (useOneTap)
        (_c2 = (_b2 = (_a2 = window === null || window === void 0 ? void 0 : window.google) === null || _a2 === void 0 ? void 0 : _a2.accounts) === null || _b2 === void 0 ? void 0 : _b2.id) === null || _c2 === void 0 ? void 0 : _c2.cancel();
    };
  }, [
    clientId,
    scriptLoadedSuccessfully,
    useOneTap,
    type,
    theme,
    size,
    text,
    shape,
    logo_alignment,
    width,
    locale
  ]);
  return import_react.default.createElement("div", { ...containerProps, ref: btnContainerRef, style: { height: containerHeightMap[size], ...containerProps === null || containerProps === void 0 ? void 0 : containerProps.style } });
}
function googleLogout() {
  var _a, _b, _c;
  (_c = (_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.disableAutoSelect();
}
function useGoogleLogin({ flow = "implicit", scope = "", onSuccess, onError, onNonOAuthError, overrideScope, state, ...props }) {
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();
  const clientRef = (0, import_react.useRef)();
  const onSuccessRef = (0, import_react.useRef)(onSuccess);
  onSuccessRef.current = onSuccess;
  const onErrorRef = (0, import_react.useRef)(onError);
  onErrorRef.current = onError;
  const onNonOAuthErrorRef = (0, import_react.useRef)(onNonOAuthError);
  onNonOAuthErrorRef.current = onNonOAuthError;
  (0, import_react.useEffect)(() => {
    var _a, _b;
    if (!scriptLoadedSuccessfully)
      return;
    const clientMethod = flow === "implicit" ? "initTokenClient" : "initCodeClient";
    const client = (_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b.oauth2[clientMethod]({
      client_id: clientId,
      scope: overrideScope ? scope : `openid profile email ${scope}`,
      callback: (response) => {
        var _a2, _b2;
        if (response.error)
          return (_a2 = onErrorRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(onErrorRef, response);
        (_b2 = onSuccessRef.current) === null || _b2 === void 0 ? void 0 : _b2.call(onSuccessRef, response);
      },
      error_callback: (nonOAuthError) => {
        var _a2;
        (_a2 = onNonOAuthErrorRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(onNonOAuthErrorRef, nonOAuthError);
      },
      state,
      ...props
    });
    clientRef.current = client;
  }, [clientId, scriptLoadedSuccessfully, flow, scope, state]);
  const loginImplicitFlow = (0, import_react.useCallback)((overrideConfig) => {
    var _a;
    return (_a = clientRef.current) === null || _a === void 0 ? void 0 : _a.requestAccessToken(overrideConfig);
  }, []);
  const loginAuthCodeFlow = (0, import_react.useCallback)(() => {
    var _a;
    return (_a = clientRef.current) === null || _a === void 0 ? void 0 : _a.requestCode();
  }, []);
  return flow === "implicit" ? loginImplicitFlow : loginAuthCodeFlow;
}
function useGoogleOneTapLogin({ onSuccess, onError, promptMomentNotification, cancel_on_tap_outside, prompt_parent_id, state_cookie_domain, hosted_domain, use_fedcm_for_prompt = false, disabled, auto_select }) {
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();
  const onSuccessRef = (0, import_react.useRef)(onSuccess);
  onSuccessRef.current = onSuccess;
  const onErrorRef = (0, import_react.useRef)(onError);
  onErrorRef.current = onError;
  const promptMomentNotificationRef = (0, import_react.useRef)(promptMomentNotification);
  promptMomentNotificationRef.current = promptMomentNotification;
  (0, import_react.useEffect)(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (!scriptLoadedSuccessfully)
      return;
    if (disabled) {
      (_c = (_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.cancel();
      return;
    }
    (_f = (_e = (_d = window === null || window === void 0 ? void 0 : window.google) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e.id) === null || _f === void 0 ? void 0 : _f.initialize({
      client_id: clientId,
      callback: (credentialResponse) => {
        var _a2;
        if (!(credentialResponse === null || credentialResponse === void 0 ? void 0 : credentialResponse.credential)) {
          return (_a2 = onErrorRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(onErrorRef);
        }
        const { credential, select_by } = credentialResponse;
        onSuccessRef.current({
          credential,
          clientId: extractClientId(credentialResponse),
          select_by
        });
      },
      hosted_domain,
      cancel_on_tap_outside,
      prompt_parent_id,
      state_cookie_domain,
      use_fedcm_for_prompt,
      auto_select
    });
    (_j = (_h = (_g = window === null || window === void 0 ? void 0 : window.google) === null || _g === void 0 ? void 0 : _g.accounts) === null || _h === void 0 ? void 0 : _h.id) === null || _j === void 0 ? void 0 : _j.prompt(promptMomentNotificationRef.current);
    return () => {
      var _a2, _b2, _c2;
      (_c2 = (_b2 = (_a2 = window === null || window === void 0 ? void 0 : window.google) === null || _a2 === void 0 ? void 0 : _a2.accounts) === null || _b2 === void 0 ? void 0 : _b2.id) === null || _c2 === void 0 ? void 0 : _c2.cancel();
    };
  }, [
    clientId,
    scriptLoadedSuccessfully,
    cancel_on_tap_outside,
    prompt_parent_id,
    state_cookie_domain,
    hosted_domain,
    use_fedcm_for_prompt,
    disabled,
    auto_select
  ]);
}
function hasGrantedAllScopesGoogle(tokenResponse, firstScope, ...restScopes) {
  var _a, _b, _c;
  if (!(window === null || window === void 0 ? void 0 : window.google))
    return false;
  return ((_c = (_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b.oauth2) === null || _c === void 0 ? void 0 : _c.hasGrantedAllScopes(tokenResponse, firstScope, ...restScopes)) || false;
}
function hasGrantedAnyScopeGoogle(tokenResponse, firstScope, ...restScopes) {
  var _a, _b, _c;
  if (!(window === null || window === void 0 ? void 0 : window.google))
    return false;
  return ((_c = (_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b.oauth2) === null || _c === void 0 ? void 0 : _c.hasGrantedAnyScope(tokenResponse, firstScope, ...restScopes)) || false;
}
export {
  GoogleLogin,
  GoogleOAuthProvider,
  googleLogout,
  hasGrantedAllScopesGoogle,
  hasGrantedAnyScopeGoogle,
  useGoogleLogin,
  useGoogleOAuth,
  useGoogleOneTapLogin
};
//# sourceMappingURL=@react-oauth_google.js.map
>>>>>>> f59948b22d6d9f6eea37dcfccc009c962c9a9495:frontend/.vite/deps/@react-oauth_google.js
