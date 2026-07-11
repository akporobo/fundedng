import { W as WriteStream, R as ReadStream, r as reactExports, f as functionalUpdate, a as arraysEqual, c as createLRUCache, i as isPromise, b as isRedirect, d as isNotFound, e as invariant, g as createControlledPromise, h as rootRouteId, j as isServer, k as compileDecodeCharMap, t as trimPath, l as rewriteBasepath, m as composeRewrites, p as processRouteTree, n as processRouteMasks, o as resolvePath, q as cleanPath, s as trimPathRight, u as parseHref, v as executeRewriteInput, w as isDangerousProtocol, x as redirect, y as findSingleMatch, z as deepEqual, D as DEFAULT_PROTOCOL_ALLOWLIST, A as interpolatePath, B as nullReplaceEqualDeep, C as replaceEqualDeep, E as last, F as decodePath, G as findFlatMatch, H as findRouteMatch, I as executeRewriteOutput, J as encodePathLikeUrl, K as trimPathLeft, L as joinPaths, M as useRouter, N as dummyMatchContext, O as matchContext, P as requireReactDom, Q as getDefaultExportFromCjs, S as exactPathTest, T as removeTrailingSlash, U as React2, V as jsxRuntimeExports, X as isModuleNotFoundError, Y as useHydrated, Z as escapeHtml, _ as getAssetCrossOrigin, $ as resolveManifestAssetLink, a0 as Outlet, a1 as getAugmentedNamespace } from "./worker-entry-DS7H0w4O.js";
import { c as createClient, o as objectType, s as stringType, e as enumType, a as coerce, b as supabaseAdmin } from "./client.server-B4evwzKW.js";
import { s as sendEventEmail } from "./email.server-Czm4Ciez.js";
import require$$0$2 from "crypto";
import require$$0$1 from "buffer";
import require$$3 from "stream";
import require$$5 from "util";
import require$$3$1 from "url";
import require$$1 from "https";
import require$$0$5 from "net";
import require$$1$1 from "tls";
import require$$2 from "assert";
import require$$0$3 from "os";
import require$$0$4 from "http";
const isatty = function() {
  return false;
};
const tty = {
  ReadStream,
  WriteStream,
  isatty
};
const tty$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ReadStream,
  WriteStream,
  default: tty,
  isatty
}, Symbol.toStringTag, { value: "Module" }));
var reactUse = reactExports.use;
function useForwardedRef(ref) {
  const innerRef = reactExports.useRef(null);
  reactExports.useImperativeHandle(ref, () => innerRef.current, []);
  return innerRef;
}
function encode(obj, stringify = String) {
  const result = new URLSearchParams();
  for (const key in obj) {
    const val = obj[key];
    if (val !== void 0) result.set(key, stringify(val));
  }
  return result.toString();
}
function toValue(str) {
  if (!str) return "";
  if (str === "false") return false;
  if (str === "true") return true;
  return +str * 0 === 0 && +str + "" === str ? +str : str;
}
function decode(str) {
  const searchParams = new URLSearchParams(str);
  const result = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of searchParams.entries()) {
    const previousValue = result[key];
    if (previousValue == null) result[key] = toValue(value);
    else if (Array.isArray(previousValue)) previousValue.push(toValue(value));
    else result[key] = [previousValue, toValue(value)];
  }
  return result;
}
var defaultParseSearch = parseSearchWith(JSON.parse);
var defaultStringifySearch = stringifySearchWith(JSON.stringify, JSON.parse);
function parseSearchWith(parser) {
  return (searchStr) => {
    if (searchStr[0] === "?") searchStr = searchStr.substring(1);
    const query = decode(searchStr);
    for (const key in query) {
      const value = query[key];
      if (typeof value === "string") try {
        query[key] = parser(value);
      } catch (_err) {
      }
    }
    return query;
  };
}
function stringifySearchWith(stringify, parser) {
  const hasParser = typeof parser === "function";
  function stringifyValue(val) {
    if (typeof val === "object" && val !== null) try {
      return stringify(val);
    } catch (_err) {
    }
    else if (hasParser && typeof val === "string") try {
      parser(val);
      return stringify(val);
    } catch (_err) {
    }
    return val;
  }
  return (search) => {
    const searchStr = encode(search, stringifyValue);
    return searchStr ? `?${searchStr}` : "";
  };
}
function createNonReactiveMutableStore(initialValue) {
  let value = initialValue;
  return {
    get() {
      return value;
    },
    set(nextOrUpdater) {
      value = functionalUpdate(nextOrUpdater, value);
    }
  };
}
function createNonReactiveReadonlyStore(read) {
  return { get() {
    return read();
  } };
}
function createRouterStores(initialState, config) {
  const { createMutableStore, createReadonlyStore, batch, init } = config;
  const matchStores = /* @__PURE__ */ new Map();
  const pendingMatchStores = /* @__PURE__ */ new Map();
  const cachedMatchStores = /* @__PURE__ */ new Map();
  const status = createMutableStore(initialState.status);
  const loadedAt = createMutableStore(initialState.loadedAt);
  const isLoading = createMutableStore(initialState.isLoading);
  const isTransitioning = createMutableStore(initialState.isTransitioning);
  const location = createMutableStore(initialState.location);
  const resolvedLocation = createMutableStore(initialState.resolvedLocation);
  const statusCode = createMutableStore(initialState.statusCode);
  const redirect2 = createMutableStore(initialState.redirect);
  const matchesId = createMutableStore([]);
  const pendingIds = createMutableStore([]);
  const cachedIds = createMutableStore([]);
  const matches = createReadonlyStore(() => readPoolMatches(matchStores, matchesId.get()));
  const pendingMatches = createReadonlyStore(() => readPoolMatches(pendingMatchStores, pendingIds.get()));
  const cachedMatches = createReadonlyStore(() => readPoolMatches(cachedMatchStores, cachedIds.get()));
  const firstId = createReadonlyStore(() => matchesId.get()[0]);
  const hasPending = createReadonlyStore(() => matchesId.get().some((matchId) => {
    return matchStores.get(matchId)?.get().status === "pending";
  }));
  const matchRouteDeps = createReadonlyStore(() => ({
    locationHref: location.get().href,
    resolvedLocationHref: resolvedLocation.get()?.href,
    status: status.get()
  }));
  const __store = createReadonlyStore(() => ({
    status: status.get(),
    loadedAt: loadedAt.get(),
    isLoading: isLoading.get(),
    isTransitioning: isTransitioning.get(),
    matches: matches.get(),
    location: location.get(),
    resolvedLocation: resolvedLocation.get(),
    statusCode: statusCode.get(),
    redirect: redirect2.get()
  }));
  const matchStoreByRouteIdCache = createLRUCache(64);
  function getRouteMatchStore(routeId) {
    let cached = matchStoreByRouteIdCache.get(routeId);
    if (!cached) {
      cached = createReadonlyStore(() => {
        const ids = matchesId.get();
        for (const id of ids) {
          const matchStore = matchStores.get(id);
          if (matchStore && matchStore.routeId === routeId) return matchStore.get();
        }
      });
      matchStoreByRouteIdCache.set(routeId, cached);
    }
    return cached;
  }
  const store = {
    status,
    loadedAt,
    isLoading,
    isTransitioning,
    location,
    resolvedLocation,
    statusCode,
    redirect: redirect2,
    matchesId,
    pendingIds,
    cachedIds,
    matches,
    pendingMatches,
    cachedMatches,
    firstId,
    hasPending,
    matchRouteDeps,
    matchStores,
    pendingMatchStores,
    cachedMatchStores,
    __store,
    getRouteMatchStore,
    setMatches,
    setPending,
    setCached
  };
  setMatches(initialState.matches);
  init?.(store);
  function setMatches(nextMatches) {
    reconcileMatchPool(nextMatches, matchStores, matchesId, createMutableStore, batch);
  }
  function setPending(nextMatches) {
    reconcileMatchPool(nextMatches, pendingMatchStores, pendingIds, createMutableStore, batch);
  }
  function setCached(nextMatches) {
    reconcileMatchPool(nextMatches, cachedMatchStores, cachedIds, createMutableStore, batch);
  }
  return store;
}
function readPoolMatches(pool, ids) {
  const matches = [];
  for (const id of ids) {
    const matchStore = pool.get(id);
    if (matchStore) matches.push(matchStore.get());
  }
  return matches;
}
function reconcileMatchPool(nextMatches, pool, idStore, createMutableStore, batch) {
  const nextIds = nextMatches.map((d) => d.id);
  const nextIdSet = new Set(nextIds);
  batch(() => {
    for (const id of pool.keys()) if (!nextIdSet.has(id)) pool.delete(id);
    for (const nextMatch of nextMatches) {
      const existing = pool.get(nextMatch.id);
      if (!existing) {
        const matchStore = createMutableStore(nextMatch);
        matchStore.routeId = nextMatch.routeId;
        pool.set(nextMatch.id, matchStore);
        continue;
      }
      existing.routeId = nextMatch.routeId;
      if (existing.get() !== nextMatch) existing.set(nextMatch);
    }
    if (!arraysEqual(idStore.get(), nextIds)) idStore.set(nextIds);
  });
}
var triggerOnReady = (inner) => {
  if (!inner.rendered) {
    inner.rendered = true;
    return inner.onReady?.();
  }
};
var resolvePreload = (inner, matchId) => {
  return !!(inner.preload && !inner.router.stores.matchStores.has(matchId));
};
var buildMatchContext = (inner, index, includeCurrentMatch = true) => {
  const context = { ...inner.router.options.context ?? {} };
  const end = includeCurrentMatch ? index : index - 1;
  for (let i = 0; i <= end; i++) {
    const innerMatch = inner.matches[i];
    if (!innerMatch) continue;
    const m = inner.router.getMatch(innerMatch.id);
    if (!m) continue;
    Object.assign(context, m.__routeContext, m.__beforeLoadContext);
  }
  return context;
};
var getNotFoundBoundaryIndex = (inner, err) => {
  if (!inner.matches.length) return;
  const requestedRouteId = err.routeId;
  const matchedRootIndex = inner.matches.findIndex((m) => m.routeId === inner.router.routeTree.id);
  const rootIndex = matchedRootIndex >= 0 ? matchedRootIndex : 0;
  let startIndex = requestedRouteId ? inner.matches.findIndex((match) => match.routeId === requestedRouteId) : inner.firstBadMatchIndex ?? inner.matches.length - 1;
  if (startIndex < 0) startIndex = rootIndex;
  for (let i = startIndex; i >= 0; i--) {
    const match = inner.matches[i];
    if (inner.router.looseRoutesById[match.routeId].options.notFoundComponent) return i;
  }
  return requestedRouteId ? startIndex : rootIndex;
};
var handleRedirectAndNotFound = (inner, match, err) => {
  if (!isRedirect(err) && !isNotFound(err)) return;
  if (isRedirect(err) && err.redirectHandled && !err.options.reloadDocument) throw err;
  if (match) {
    match._nonReactive.beforeLoadPromise?.resolve();
    match._nonReactive.loaderPromise?.resolve();
    match._nonReactive.beforeLoadPromise = void 0;
    match._nonReactive.loaderPromise = void 0;
    match._nonReactive.error = err;
    inner.updateMatch(match.id, (prev) => ({
      ...prev,
      status: isRedirect(err) ? "redirected" : isNotFound(err) ? "notFound" : prev.status === "pending" ? "success" : prev.status,
      context: buildMatchContext(inner, match.index),
      isFetching: false,
      error: err
    }));
    if (isNotFound(err) && !err.routeId) err.routeId = match.routeId;
    match._nonReactive.loadPromise?.resolve();
  }
  if (isRedirect(err)) {
    inner.rendered = true;
    err.options._fromLocation = inner.location;
    err.redirectHandled = true;
    err = inner.router.resolveRedirect(err);
  }
  throw err;
};
var shouldSkipLoader = (inner, matchId) => {
  const match = inner.router.getMatch(matchId);
  if (!match) return true;
  if (match.ssr === false) return true;
  return false;
};
var syncMatchContext = (inner, matchId, index) => {
  const nextContext = buildMatchContext(inner, index);
  inner.updateMatch(matchId, (prev) => {
    return {
      ...prev,
      context: nextContext
    };
  });
};
var handleSerialError = (inner, index, err, routerCode) => {
  const { id: matchId, routeId } = inner.matches[index];
  const route = inner.router.looseRoutesById[routeId];
  if (err instanceof Promise) throw err;
  err.routerCode = routerCode;
  inner.firstBadMatchIndex ??= index;
  handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), err);
  try {
    route.options.onError?.(err);
  } catch (errorHandlerErr) {
    err = errorHandlerErr;
    handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), err);
  }
  inner.updateMatch(matchId, (prev) => {
    prev._nonReactive.beforeLoadPromise?.resolve();
    prev._nonReactive.beforeLoadPromise = void 0;
    prev._nonReactive.loadPromise?.resolve();
    return {
      ...prev,
      error: err,
      status: "error",
      isFetching: false,
      updatedAt: Date.now(),
      abortController: new AbortController()
    };
  });
  if (!inner.preload && !isRedirect(err) && !isNotFound(err)) inner.serialError ??= err;
};
var isBeforeLoadSsr = (inner, matchId, index, route) => {
  const existingMatch = inner.router.getMatch(matchId);
  const parentMatchId = inner.matches[index - 1]?.id;
  const parentMatch = parentMatchId ? inner.router.getMatch(parentMatchId) : void 0;
  if (inner.router.isShell()) {
    existingMatch.ssr = route.id === rootRouteId;
    return;
  }
  if (parentMatch?.ssr === false) {
    existingMatch.ssr = false;
    return;
  }
  const parentOverride = (tempSsr2) => {
    if (tempSsr2 === true && parentMatch?.ssr === "data-only") return "data-only";
    return tempSsr2;
  };
  const defaultSsr = inner.router.options.defaultSsr ?? true;
  if (route.options.ssr === void 0) {
    existingMatch.ssr = parentOverride(defaultSsr);
    return;
  }
  if (typeof route.options.ssr !== "function") {
    existingMatch.ssr = parentOverride(route.options.ssr);
    return;
  }
  const { search, params } = existingMatch;
  const ssrFnContext = {
    search: makeMaybe(search, existingMatch.searchError),
    params: makeMaybe(params, existingMatch.paramsError),
    location: inner.location,
    matches: inner.matches.map((match) => ({
      index: match.index,
      pathname: match.pathname,
      fullPath: match.fullPath,
      staticData: match.staticData,
      id: match.id,
      routeId: match.routeId,
      search: makeMaybe(match.search, match.searchError),
      params: makeMaybe(match.params, match.paramsError),
      ssr: match.ssr
    }))
  };
  const tempSsr = route.options.ssr(ssrFnContext);
  if (isPromise(tempSsr)) return tempSsr.then((ssr) => {
    existingMatch.ssr = parentOverride(ssr ?? defaultSsr);
  });
  existingMatch.ssr = parentOverride(tempSsr ?? defaultSsr);
};
var setupPendingTimeout = (inner, matchId, route, match) => {
  if (match._nonReactive.pendingTimeout !== void 0) return;
  const pendingMs = route.options.pendingMs ?? inner.router.options.defaultPendingMs;
  if (!!(inner.onReady && false)) {
    const pendingTimeout = setTimeout(() => {
      triggerOnReady(inner);
    }, pendingMs);
    match._nonReactive.pendingTimeout = pendingTimeout;
  }
};
var preBeforeLoadSetup = (inner, matchId, route) => {
  const existingMatch = inner.router.getMatch(matchId);
  if (!existingMatch._nonReactive.beforeLoadPromise && !existingMatch._nonReactive.loaderPromise) return;
  setupPendingTimeout(inner, matchId, route, existingMatch);
  const then = () => {
    const match = inner.router.getMatch(matchId);
    if (match.preload && (match.status === "redirected" || match.status === "notFound")) handleRedirectAndNotFound(inner, match, match.error);
  };
  return existingMatch._nonReactive.beforeLoadPromise ? existingMatch._nonReactive.beforeLoadPromise.then(then) : then();
};
var executeBeforeLoad = (inner, matchId, index, route) => {
  const match = inner.router.getMatch(matchId);
  let prevLoadPromise = match._nonReactive.loadPromise;
  match._nonReactive.loadPromise = createControlledPromise(() => {
    prevLoadPromise?.resolve();
    prevLoadPromise = void 0;
  });
  const { paramsError, searchError } = match;
  if (paramsError) handleSerialError(inner, index, paramsError, "PARSE_PARAMS");
  if (searchError) handleSerialError(inner, index, searchError, "VALIDATE_SEARCH");
  setupPendingTimeout(inner, matchId, route, match);
  const abortController = new AbortController();
  let isPending = false;
  const pending = () => {
    if (isPending) return;
    isPending = true;
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: "beforeLoad",
      fetchCount: prev.fetchCount + 1,
      abortController
    }));
  };
  const resolve = () => {
    match._nonReactive.beforeLoadPromise?.resolve();
    match._nonReactive.beforeLoadPromise = void 0;
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: false
    }));
  };
  if (!route.options.beforeLoad) {
    inner.router.batch(() => {
      pending();
      resolve();
    });
    return;
  }
  match._nonReactive.beforeLoadPromise = createControlledPromise();
  const context = {
    ...buildMatchContext(inner, index, false),
    ...match.__routeContext
  };
  const { search, params, cause } = match;
  const preload = resolvePreload(inner, matchId);
  const beforeLoadFnContext = {
    search,
    abortController,
    params,
    preload,
    context,
    location: inner.location,
    navigate: (opts) => inner.router.navigate({
      ...opts,
      _fromLocation: inner.location
    }),
    buildLocation: inner.router.buildLocation,
    cause: preload ? "preload" : cause,
    matches: inner.matches,
    routeId: route.id,
    ...inner.router.options.additionalContext
  };
  const updateContext = (beforeLoadContext2) => {
    if (beforeLoadContext2 === void 0) {
      inner.router.batch(() => {
        pending();
        resolve();
      });
      return;
    }
    if (isRedirect(beforeLoadContext2) || isNotFound(beforeLoadContext2)) {
      pending();
      handleSerialError(inner, index, beforeLoadContext2, "BEFORE_LOAD");
    }
    inner.router.batch(() => {
      pending();
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        __beforeLoadContext: beforeLoadContext2
      }));
      resolve();
    });
  };
  let beforeLoadContext;
  try {
    beforeLoadContext = route.options.beforeLoad(beforeLoadFnContext);
    if (isPromise(beforeLoadContext)) {
      pending();
      return beforeLoadContext.catch((err) => {
        handleSerialError(inner, index, err, "BEFORE_LOAD");
      }).then(updateContext);
    }
  } catch (err) {
    pending();
    handleSerialError(inner, index, err, "BEFORE_LOAD");
  }
  updateContext(beforeLoadContext);
};
var handleBeforeLoad = (inner, index) => {
  const { id: matchId, routeId } = inner.matches[index];
  const route = inner.router.looseRoutesById[routeId];
  const serverSsr = () => {
    {
      const maybePromise = isBeforeLoadSsr(inner, matchId, index, route);
      if (isPromise(maybePromise)) return maybePromise.then(queueExecution);
    }
    return queueExecution();
  };
  const execute = () => executeBeforeLoad(inner, matchId, index, route);
  const queueExecution = () => {
    if (shouldSkipLoader(inner, matchId)) return;
    const result = preBeforeLoadSetup(inner, matchId, route);
    return isPromise(result) ? result.then(execute) : execute();
  };
  return serverSsr();
};
var executeHead = (inner, matchId, route) => {
  const match = inner.router.getMatch(matchId);
  if (!match) return;
  if (!route.options.head && !route.options.scripts && !route.options.headers) return;
  const assetContext = {
    ssr: inner.router.options.ssr,
    matches: inner.matches,
    match,
    params: match.params,
    loaderData: match.loaderData
  };
  return Promise.all([
    route.options.head?.(assetContext),
    route.options.scripts?.(assetContext),
    route.options.headers?.(assetContext)
  ]).then(([headFnContent, scripts, headers]) => {
    return {
      meta: headFnContent?.meta,
      links: headFnContent?.links,
      headScripts: headFnContent?.scripts,
      headers,
      scripts,
      styles: headFnContent?.styles
    };
  });
};
var getLoaderContext = (inner, matchPromises, matchId, index, route) => {
  const parentMatchPromise = matchPromises[index - 1];
  const { params, loaderDeps, abortController, cause } = inner.router.getMatch(matchId);
  const context = buildMatchContext(inner, index);
  const preload = resolvePreload(inner, matchId);
  return {
    params,
    deps: loaderDeps,
    preload: !!preload,
    parentMatchPromise,
    abortController,
    context,
    location: inner.location,
    navigate: (opts) => inner.router.navigate({
      ...opts,
      _fromLocation: inner.location
    }),
    cause: preload ? "preload" : cause,
    route,
    ...inner.router.options.additionalContext
  };
};
var runLoader = async (inner, matchPromises, matchId, index, route) => {
  try {
    const match = inner.router.getMatch(matchId);
    try {
      if (!(isServer ?? inner.router.isServer) || match.ssr === true) loadRouteChunk(route);
      const routeLoader = route.options.loader;
      const loader = typeof routeLoader === "function" ? routeLoader : routeLoader?.handler;
      const loaderResult = loader?.(getLoaderContext(inner, matchPromises, matchId, index, route));
      const loaderResultIsPromise = !!loader && isPromise(loaderResult);
      if (!!(loaderResultIsPromise || route._lazyPromise || route._componentsPromise || route.options.head || route.options.scripts || route.options.headers || match._nonReactive.minPendingPromise)) inner.updateMatch(matchId, (prev) => ({
        ...prev,
        isFetching: "loader"
      }));
      if (loader) {
        const loaderData = loaderResultIsPromise ? await loaderResult : loaderResult;
        handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), loaderData);
        if (loaderData !== void 0) inner.updateMatch(matchId, (prev) => ({
          ...prev,
          loaderData
        }));
      }
      if (route._lazyPromise) await route._lazyPromise;
      const pendingPromise = match._nonReactive.minPendingPromise;
      if (pendingPromise) await pendingPromise;
      if (route._componentsPromise) await route._componentsPromise;
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        error: void 0,
        context: buildMatchContext(inner, index),
        status: "success",
        isFetching: false,
        updatedAt: Date.now()
      }));
    } catch (e) {
      let error = e;
      if (error?.name === "AbortError") {
        if (match.abortController.signal.aborted) {
          match._nonReactive.loaderPromise?.resolve();
          match._nonReactive.loaderPromise = void 0;
          return;
        }
        inner.updateMatch(matchId, (prev) => ({
          ...prev,
          status: prev.status === "pending" ? "success" : prev.status,
          isFetching: false,
          context: buildMatchContext(inner, index)
        }));
        return;
      }
      const pendingPromise = match._nonReactive.minPendingPromise;
      if (pendingPromise) await pendingPromise;
      if (isNotFound(e)) await route.options.notFoundComponent?.preload?.();
      handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), e);
      try {
        route.options.onError?.(e);
      } catch (onErrorError) {
        error = onErrorError;
        handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), onErrorError);
      }
      if (!isRedirect(error) && !isNotFound(error)) await loadRouteChunk(route, ["errorComponent"]);
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        error,
        context: buildMatchContext(inner, index),
        status: "error",
        isFetching: false
      }));
    }
  } catch (err) {
    const match = inner.router.getMatch(matchId);
    if (match) match._nonReactive.loaderPromise = void 0;
    handleRedirectAndNotFound(inner, match, err);
  }
};
var loadRouteMatch = async (inner, matchPromises, index) => {
  async function handleLoader(preload, prevMatch, previousRouteMatchId, match2, route2) {
    const age = Date.now() - prevMatch.updatedAt;
    const staleAge = preload ? route2.options.preloadStaleTime ?? inner.router.options.defaultPreloadStaleTime ?? 3e4 : route2.options.staleTime ?? inner.router.options.defaultStaleTime ?? 0;
    const shouldReloadOption = route2.options.shouldReload;
    const shouldReload = typeof shouldReloadOption === "function" ? shouldReloadOption(getLoaderContext(inner, matchPromises, matchId, index, route2)) : shouldReloadOption;
    const { status, invalid } = match2;
    const staleMatchShouldReload = age >= staleAge && (!!inner.forceStaleReload || match2.cause === "enter" || previousRouteMatchId !== void 0 && previousRouteMatchId !== match2.id);
    loaderShouldRunAsync = status === "success" && (invalid || (shouldReload ?? staleMatchShouldReload));
    if (preload && route2.options.preload === false) ;
    else if (loaderShouldRunAsync && !inner.sync && shouldReloadInBackground) {
      loaderIsRunningAsync = true;
      (async () => {
        try {
          await runLoader(inner, matchPromises, matchId, index, route2);
          const match3 = inner.router.getMatch(matchId);
          match3._nonReactive.loaderPromise?.resolve();
          match3._nonReactive.loadPromise?.resolve();
          match3._nonReactive.loaderPromise = void 0;
          match3._nonReactive.loadPromise = void 0;
        } catch (err) {
          if (isRedirect(err)) await inner.router.navigate(err.options);
        }
      })();
    } else if (status !== "success" || loaderShouldRunAsync) await runLoader(inner, matchPromises, matchId, index, route2);
    else syncMatchContext(inner, matchId, index);
  }
  const { id: matchId, routeId } = inner.matches[index];
  let loaderShouldRunAsync = false;
  let loaderIsRunningAsync = false;
  const route = inner.router.looseRoutesById[routeId];
  const routeLoader = route.options.loader;
  const shouldReloadInBackground = ((typeof routeLoader === "function" ? void 0 : routeLoader?.staleReloadMode) ?? inner.router.options.defaultStaleReloadMode) !== "blocking";
  if (shouldSkipLoader(inner, matchId)) {
    if (!inner.router.getMatch(matchId)) return inner.matches[index];
    syncMatchContext(inner, matchId, index);
    return inner.router.getMatch(matchId);
  } else {
    const prevMatch = inner.router.getMatch(matchId);
    const activeIdAtIndex = inner.router.stores.matchesId.get()[index];
    const previousRouteMatchId = (activeIdAtIndex && inner.router.stores.matchStores.get(activeIdAtIndex) || null)?.routeId === routeId ? activeIdAtIndex : inner.router.stores.matches.get().find((d) => d.routeId === routeId)?.id;
    const preload = resolvePreload(inner, matchId);
    if (prevMatch._nonReactive.loaderPromise) {
      if (prevMatch.status === "success" && !inner.sync && !prevMatch.preload && shouldReloadInBackground) return prevMatch;
      await prevMatch._nonReactive.loaderPromise;
      const match2 = inner.router.getMatch(matchId);
      const error = match2._nonReactive.error || match2.error;
      if (error) handleRedirectAndNotFound(inner, match2, error);
      if (match2.status === "pending") await handleLoader(preload, prevMatch, previousRouteMatchId, match2, route);
    } else {
      const nextPreload = preload && !inner.router.stores.matchStores.has(matchId);
      const match2 = inner.router.getMatch(matchId);
      match2._nonReactive.loaderPromise = createControlledPromise();
      if (nextPreload !== match2.preload) inner.updateMatch(matchId, (prev) => ({
        ...prev,
        preload: nextPreload
      }));
      await handleLoader(preload, prevMatch, previousRouteMatchId, match2, route);
    }
  }
  const match = inner.router.getMatch(matchId);
  if (!loaderIsRunningAsync) {
    match._nonReactive.loaderPromise?.resolve();
    match._nonReactive.loadPromise?.resolve();
    match._nonReactive.loadPromise = void 0;
  }
  clearTimeout(match._nonReactive.pendingTimeout);
  match._nonReactive.pendingTimeout = void 0;
  if (!loaderIsRunningAsync) match._nonReactive.loaderPromise = void 0;
  match._nonReactive.dehydrated = void 0;
  const nextIsFetching = loaderIsRunningAsync ? match.isFetching : false;
  if (nextIsFetching !== match.isFetching || match.invalid !== false) {
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: nextIsFetching,
      invalid: false
    }));
    return inner.router.getMatch(matchId);
  } else return match;
};
async function loadMatches(arg) {
  const inner = arg;
  const matchPromises = [];
  let beforeLoadNotFound;
  for (let i = 0; i < inner.matches.length; i++) {
    try {
      const beforeLoad = handleBeforeLoad(inner, i);
      if (isPromise(beforeLoad)) await beforeLoad;
    } catch (err) {
      if (isRedirect(err)) throw err;
      if (isNotFound(err)) beforeLoadNotFound = err;
      else if (!inner.preload) throw err;
      break;
    }
    if (inner.serialError || inner.firstBadMatchIndex != null) break;
  }
  const baseMaxIndexExclusive = inner.firstBadMatchIndex ?? inner.matches.length;
  const boundaryIndex = beforeLoadNotFound && !inner.preload ? getNotFoundBoundaryIndex(inner, beforeLoadNotFound) : void 0;
  const maxIndexExclusive = beforeLoadNotFound && inner.preload ? 0 : boundaryIndex !== void 0 ? Math.min(boundaryIndex + 1, baseMaxIndexExclusive) : baseMaxIndexExclusive;
  let firstNotFound;
  let firstUnhandledRejection;
  for (let i = 0; i < maxIndexExclusive; i++) matchPromises.push(loadRouteMatch(inner, matchPromises, i));
  try {
    await Promise.all(matchPromises);
  } catch {
    const settled = await Promise.allSettled(matchPromises);
    for (const result of settled) {
      if (result.status !== "rejected") continue;
      const reason = result.reason;
      if (isRedirect(reason)) throw reason;
      if (isNotFound(reason)) firstNotFound ??= reason;
      else firstUnhandledRejection ??= reason;
    }
    if (firstUnhandledRejection !== void 0) throw firstUnhandledRejection;
  }
  const notFoundToThrow = firstNotFound ?? (beforeLoadNotFound && !inner.preload ? beforeLoadNotFound : void 0);
  let headMaxIndex = inner.firstBadMatchIndex !== void 0 ? inner.firstBadMatchIndex : inner.matches.length - 1;
  if (!notFoundToThrow && beforeLoadNotFound && inner.preload) return inner.matches;
  if (notFoundToThrow) {
    const renderedBoundaryIndex = getNotFoundBoundaryIndex(inner, notFoundToThrow);
    if (renderedBoundaryIndex === void 0) {
      invariant();
    }
    const boundaryMatch = inner.matches[renderedBoundaryIndex];
    const boundaryRoute = inner.router.looseRoutesById[boundaryMatch.routeId];
    const defaultNotFoundComponent = inner.router.options?.defaultNotFoundComponent;
    if (!boundaryRoute.options.notFoundComponent && defaultNotFoundComponent) boundaryRoute.options.notFoundComponent = defaultNotFoundComponent;
    notFoundToThrow.routeId = boundaryMatch.routeId;
    const boundaryIsRoot = boundaryMatch.routeId === inner.router.routeTree.id;
    inner.updateMatch(boundaryMatch.id, (prev) => ({
      ...prev,
      ...boundaryIsRoot ? {
        status: "success",
        globalNotFound: true,
        error: void 0
      } : {
        status: "notFound",
        error: notFoundToThrow
      },
      isFetching: false
    }));
    headMaxIndex = renderedBoundaryIndex;
    await loadRouteChunk(boundaryRoute, ["notFoundComponent"]);
  } else if (!inner.preload) {
    const rootMatch = inner.matches[0];
    if (!rootMatch.globalNotFound) {
      if (inner.router.getMatch(rootMatch.id)?.globalNotFound) inner.updateMatch(rootMatch.id, (prev) => ({
        ...prev,
        globalNotFound: false,
        error: void 0
      }));
    }
  }
  if (inner.serialError && inner.firstBadMatchIndex !== void 0) {
    const errorRoute = inner.router.looseRoutesById[inner.matches[inner.firstBadMatchIndex].routeId];
    await loadRouteChunk(errorRoute, ["errorComponent"]);
  }
  for (let i = 0; i <= headMaxIndex; i++) {
    const { id: matchId, routeId } = inner.matches[i];
    const route = inner.router.looseRoutesById[routeId];
    try {
      const headResult = executeHead(inner, matchId, route);
      if (headResult) {
        const head = await headResult;
        inner.updateMatch(matchId, (prev) => ({
          ...prev,
          ...head
        }));
      }
    } catch (err) {
      console.error(`Error executing head for route ${routeId}:`, err);
    }
  }
  const readyPromise = triggerOnReady(inner);
  if (isPromise(readyPromise)) await readyPromise;
  if (notFoundToThrow) throw notFoundToThrow;
  if (inner.serialError && !inner.preload && !inner.onReady) throw inner.serialError;
  return inner.matches;
}
function preloadRouteComponents(route, componentTypesToLoad) {
  const preloads = componentTypesToLoad.map((type) => route.options[type]?.preload?.()).filter(Boolean);
  if (preloads.length === 0) return void 0;
  return Promise.all(preloads);
}
function loadRouteChunk(route, componentTypesToLoad = componentTypes) {
  if (!route._lazyLoaded && route._lazyPromise === void 0) if (route.lazyFn) route._lazyPromise = route.lazyFn().then((lazyRoute) => {
    const { id: _id, ...options } = lazyRoute.options;
    Object.assign(route.options, options);
    route._lazyLoaded = true;
    route._lazyPromise = void 0;
  });
  else route._lazyLoaded = true;
  const runAfterLazy = () => route._componentsLoaded ? void 0 : componentTypesToLoad === componentTypes ? (() => {
    if (route._componentsPromise === void 0) {
      const componentsPromise = preloadRouteComponents(route, componentTypes);
      if (componentsPromise) route._componentsPromise = componentsPromise.then(() => {
        route._componentsLoaded = true;
        route._componentsPromise = void 0;
      });
      else route._componentsLoaded = true;
    }
    return route._componentsPromise;
  })() : preloadRouteComponents(route, componentTypesToLoad);
  return route._lazyPromise ? route._lazyPromise.then(runAfterLazy) : runAfterLazy();
}
function makeMaybe(value, error) {
  if (error) return {
    status: "error",
    error
  };
  return {
    status: "success",
    value
  };
}
function routeNeedsPreload(route) {
  for (const componentType of componentTypes) if (route.options[componentType]?.preload) return true;
  return false;
}
var componentTypes = [
  "component",
  "errorComponent",
  "pendingComponent",
  "notFoundComponent"
];
function getLocationChangeInfo(location, resolvedLocation) {
  const fromLocation = resolvedLocation;
  const toLocation = location;
  return {
    fromLocation,
    toLocation,
    pathChanged: fromLocation?.pathname !== toLocation.pathname,
    hrefChanged: fromLocation?.href !== toLocation.href,
    hashChanged: fromLocation?.hash !== toLocation.hash
  };
}
var RouterCore = class {
  /**
  * @deprecated Use the `createRouter` function instead
  */
  constructor(options, getStoreConfig) {
    this.tempLocationKey = `${Math.round(Math.random() * 1e7)}`;
    this.resetNextScroll = true;
    this.shouldViewTransition = void 0;
    this.isViewTransitionTypesSupported = void 0;
    this.subscribers = /* @__PURE__ */ new Set();
    this.isScrollRestoring = false;
    this.isScrollRestorationSetup = false;
    this.startTransition = (fn) => fn();
    this.update = (newOptions) => {
      const prevOptions = this.options;
      const prevBasepath = this.basepath ?? prevOptions?.basepath ?? "/";
      const basepathWasUnset = this.basepath === void 0;
      const prevRewriteOption = prevOptions?.rewrite;
      this.options = {
        ...prevOptions,
        ...newOptions
      };
      this.isServer = this.options.isServer ?? typeof document === "undefined";
      this.protocolAllowlist = new Set(this.options.protocolAllowlist);
      if (this.options.pathParamsAllowedCharacters) this.pathParamsDecoder = compileDecodeCharMap(this.options.pathParamsAllowedCharacters);
      if (!this.history || this.options.history && this.options.history !== this.history) if (!this.options.history) ;
      else this.history = this.options.history;
      this.origin = this.options.origin;
      if (!this.origin) this.origin = "http://localhost";
      if (this.history) this.updateLatestLocation();
      if (this.options.routeTree !== this.routeTree) {
        this.routeTree = this.options.routeTree;
        let processRouteTreeResult;
        if (globalThis.__TSR_CACHE__ && globalThis.__TSR_CACHE__.routeTree === this.routeTree) {
          const cached = globalThis.__TSR_CACHE__;
          this.resolvePathCache = cached.resolvePathCache;
          processRouteTreeResult = cached.processRouteTreeResult;
        } else {
          this.resolvePathCache = createLRUCache(1e3);
          processRouteTreeResult = this.buildRouteTree();
          if (globalThis.__TSR_CACHE__ === void 0) globalThis.__TSR_CACHE__ = {
            routeTree: this.routeTree,
            processRouteTreeResult,
            resolvePathCache: this.resolvePathCache
          };
        }
        this.setRoutes(processRouteTreeResult);
      }
      if (!this.stores && this.latestLocation) {
        const config = this.getStoreConfig(this);
        this.batch = config.batch;
        this.stores = createRouterStores(getInitialRouterState(this.latestLocation), config);
      }
      let needsLocationUpdate = false;
      const nextBasepath = this.options.basepath ?? "/";
      const nextRewriteOption = this.options.rewrite;
      if (basepathWasUnset || prevBasepath !== nextBasepath || prevRewriteOption !== nextRewriteOption) {
        this.basepath = nextBasepath;
        const rewrites = [];
        const trimmed = trimPath(nextBasepath);
        if (trimmed && trimmed !== "/") rewrites.push(rewriteBasepath({ basepath: nextBasepath }));
        if (nextRewriteOption) rewrites.push(nextRewriteOption);
        this.rewrite = rewrites.length === 0 ? void 0 : rewrites.length === 1 ? rewrites[0] : composeRewrites(rewrites);
        if (this.history) this.updateLatestLocation();
        needsLocationUpdate = true;
      }
      if (needsLocationUpdate && this.stores) this.stores.location.set(this.latestLocation);
      if (typeof window !== "undefined" && "CSS" in window && typeof window.CSS?.supports === "function") this.isViewTransitionTypesSupported = window.CSS.supports("selector(:active-view-transition-type(a)");
    };
    this.updateLatestLocation = () => {
      this.latestLocation = this.parseLocation(this.history.location, this.latestLocation);
    };
    this.buildRouteTree = () => {
      const result = processRouteTree(this.routeTree, this.options.caseSensitive, (route, i) => {
        route.init({ originalIndex: i });
      });
      if (this.options.routeMasks) processRouteMasks(this.options.routeMasks, result.processedTree);
      return result;
    };
    this.subscribe = (eventType, fn) => {
      const listener = {
        eventType,
        fn
      };
      this.subscribers.add(listener);
      return () => {
        this.subscribers.delete(listener);
      };
    };
    this.emit = (routerEvent) => {
      this.subscribers.forEach((listener) => {
        if (listener.eventType === routerEvent.type) listener.fn(routerEvent);
      });
    };
    this.parseLocation = (locationToParse, previousLocation) => {
      const parse = ({ pathname, search, hash, href, state }) => {
        if (!this.rewrite && !/[ \x00-\x1f\x7f\u0080-\uffff]/.test(pathname)) {
          const parsedSearch2 = this.options.parseSearch(search);
          const searchStr2 = this.options.stringifySearch(parsedSearch2);
          return {
            href: pathname + searchStr2 + hash,
            publicHref: pathname + searchStr2 + hash,
            pathname: decodePath(pathname).path,
            external: false,
            searchStr: searchStr2,
            search: nullReplaceEqualDeep(previousLocation?.search, parsedSearch2),
            hash: decodePath(hash.slice(1)).path,
            state: replaceEqualDeep(previousLocation?.state, state)
          };
        }
        const fullUrl = new URL(href, this.origin);
        const url = executeRewriteInput(this.rewrite, fullUrl);
        const parsedSearch = this.options.parseSearch(url.search);
        const searchStr = this.options.stringifySearch(parsedSearch);
        url.search = searchStr;
        return {
          href: url.href.replace(url.origin, ""),
          publicHref: href,
          pathname: decodePath(url.pathname).path,
          external: !!this.rewrite && url.origin !== this.origin,
          searchStr,
          search: nullReplaceEqualDeep(previousLocation?.search, parsedSearch),
          hash: decodePath(url.hash.slice(1)).path,
          state: replaceEqualDeep(previousLocation?.state, state)
        };
      };
      const location = parse(locationToParse);
      const { __tempLocation, __tempKey } = location.state;
      if (__tempLocation && (!__tempKey || __tempKey === this.tempLocationKey)) {
        const parsedTempLocation = parse(__tempLocation);
        parsedTempLocation.state.key = location.state.key;
        parsedTempLocation.state.__TSR_key = location.state.__TSR_key;
        delete parsedTempLocation.state.__tempLocation;
        return {
          ...parsedTempLocation,
          maskedLocation: location
        };
      }
      return location;
    };
    this.resolvePathWithBase = (from, path) => {
      return resolvePath({
        base: from,
        to: cleanPath(path),
        trailingSlash: this.options.trailingSlash,
        cache: this.resolvePathCache
      });
    };
    this.matchRoutes = (pathnameOrNext, locationSearchOrOpts, opts) => {
      if (typeof pathnameOrNext === "string") return this.matchRoutesInternal({
        pathname: pathnameOrNext,
        search: locationSearchOrOpts
      }, opts);
      return this.matchRoutesInternal(pathnameOrNext, locationSearchOrOpts);
    };
    this.getMatchedRoutes = (pathname) => {
      return getMatchedRoutes({
        pathname,
        routesById: this.routesById,
        processedTree: this.processedTree
      });
    };
    this.cancelMatch = (id) => {
      const match = this.getMatch(id);
      if (!match) return;
      match.abortController.abort();
      clearTimeout(match._nonReactive.pendingTimeout);
      match._nonReactive.pendingTimeout = void 0;
    };
    this.cancelMatches = () => {
      this.stores.pendingIds.get().forEach((matchId) => {
        this.cancelMatch(matchId);
      });
      this.stores.matchesId.get().forEach((matchId) => {
        if (this.stores.pendingMatchStores.has(matchId)) return;
        const match = this.stores.matchStores.get(matchId)?.get();
        if (!match) return;
        if (match.status === "pending" || match.isFetching === "loader") this.cancelMatch(matchId);
      });
    };
    this.buildLocation = (opts) => {
      const build = (dest = {}) => {
        const currentLocation = dest._fromLocation || this.pendingBuiltLocation || this.latestLocation;
        const lightweightResult = this.matchRoutesLightweight(currentLocation);
        if (dest.from && false) ;
        const defaultedFromPath = dest.unsafeRelative === "path" ? currentLocation.pathname : dest.from ?? lightweightResult.fullPath;
        const fromPath = this.resolvePathWithBase(defaultedFromPath, ".");
        const fromSearch = lightweightResult.search;
        const fromParams = Object.assign(/* @__PURE__ */ Object.create(null), lightweightResult.params);
        const nextTo = dest.to ? this.resolvePathWithBase(fromPath, `${dest.to}`) : this.resolvePathWithBase(fromPath, ".");
        const nextParams = dest.params === false || dest.params === null ? /* @__PURE__ */ Object.create(null) : (dest.params ?? true) === true ? fromParams : Object.assign(fromParams, functionalUpdate(dest.params, fromParams));
        const destMatchResult = this.getMatchedRoutes(nextTo);
        let destRoutes = destMatchResult.matchedRoutes;
        if ((!destMatchResult.foundRoute || destMatchResult.foundRoute.path !== "/" && destMatchResult.routeParams["**"]) && this.options.notFoundRoute) destRoutes = [...destRoutes, this.options.notFoundRoute];
        if (Object.keys(nextParams).length > 0) for (const route of destRoutes) {
          const fn = route.options.params?.stringify ?? route.options.stringifyParams;
          if (fn) try {
            Object.assign(nextParams, fn(nextParams));
          } catch {
          }
        }
        const nextPathname = opts.leaveParams ? nextTo : decodePath(interpolatePath({
          path: nextTo,
          params: nextParams,
          decoder: this.pathParamsDecoder,
          server: this.isServer
        }).interpolatedPath).path;
        let nextSearch = fromSearch;
        if (opts._includeValidateSearch && this.options.search?.strict) {
          const validatedSearch = {};
          destRoutes.forEach((route) => {
            if (route.options.validateSearch) try {
              Object.assign(validatedSearch, validateSearch(route.options.validateSearch, {
                ...validatedSearch,
                ...nextSearch
              }));
            } catch {
            }
          });
          nextSearch = validatedSearch;
        }
        nextSearch = applySearchMiddleware({
          search: nextSearch,
          dest,
          destRoutes,
          _includeValidateSearch: opts._includeValidateSearch
        });
        nextSearch = nullReplaceEqualDeep(fromSearch, nextSearch);
        const searchStr = this.options.stringifySearch(nextSearch);
        const hash = dest.hash === true ? currentLocation.hash : dest.hash ? functionalUpdate(dest.hash, currentLocation.hash) : void 0;
        const hashStr = hash ? `#${hash}` : "";
        let nextState = dest.state === true ? currentLocation.state : dest.state ? functionalUpdate(dest.state, currentLocation.state) : {};
        nextState = replaceEqualDeep(currentLocation.state, nextState);
        const fullPath = `${nextPathname}${searchStr}${hashStr}`;
        let href;
        let publicHref;
        let external = false;
        if (this.rewrite) {
          const url = new URL(fullPath, this.origin);
          const rewrittenUrl = executeRewriteOutput(this.rewrite, url);
          href = url.href.replace(url.origin, "");
          if (rewrittenUrl.origin !== this.origin) {
            publicHref = rewrittenUrl.href;
            external = true;
          } else publicHref = rewrittenUrl.pathname + rewrittenUrl.search + rewrittenUrl.hash;
        } else {
          href = encodePathLikeUrl(fullPath);
          publicHref = href;
        }
        return {
          publicHref,
          href,
          pathname: nextPathname,
          search: nextSearch,
          searchStr,
          state: nextState,
          hash: hash ?? "",
          external,
          unmaskOnReload: dest.unmaskOnReload
        };
      };
      const buildWithMatches = (dest = {}, maskedDest) => {
        const next = build(dest);
        let maskedNext = maskedDest ? build(maskedDest) : void 0;
        if (!maskedNext) {
          const params = /* @__PURE__ */ Object.create(null);
          if (this.options.routeMasks) {
            const match = findFlatMatch(next.pathname, this.processedTree);
            if (match) {
              Object.assign(params, match.rawParams);
              const { from: _from, params: maskParams, ...maskProps } = match.route;
              const nextParams = maskParams === false || maskParams === null ? /* @__PURE__ */ Object.create(null) : (maskParams ?? true) === true ? params : Object.assign(params, functionalUpdate(maskParams, params));
              maskedDest = {
                from: opts.from,
                ...maskProps,
                params: nextParams
              };
              maskedNext = build(maskedDest);
            }
          }
        }
        if (maskedNext) next.maskedLocation = maskedNext;
        return next;
      };
      if (opts.mask) return buildWithMatches(opts, {
        from: opts.from,
        ...opts.mask
      });
      return buildWithMatches(opts);
    };
    this.commitLocation = async ({ viewTransition, ignoreBlocker, ...next }) => {
      const isSameState = () => {
        const ignoredProps = [
          "key",
          "__TSR_key",
          "__TSR_index",
          "__hashScrollIntoViewOptions"
        ];
        ignoredProps.forEach((prop) => {
          next.state[prop] = this.latestLocation.state[prop];
        });
        const isEqual = deepEqual(next.state, this.latestLocation.state);
        ignoredProps.forEach((prop) => {
          delete next.state[prop];
        });
        return isEqual;
      };
      const isSameUrl = trimPathRight(this.latestLocation.href) === trimPathRight(next.href);
      let previousCommitPromise = this.commitLocationPromise;
      this.commitLocationPromise = createControlledPromise(() => {
        previousCommitPromise?.resolve();
        previousCommitPromise = void 0;
      });
      if (isSameUrl && isSameState()) this.load();
      else {
        let { maskedLocation, hashScrollIntoView, ...nextHistory } = next;
        if (maskedLocation) {
          nextHistory = {
            ...maskedLocation,
            state: {
              ...maskedLocation.state,
              __tempKey: void 0,
              __tempLocation: {
                ...nextHistory,
                search: nextHistory.searchStr,
                state: {
                  ...nextHistory.state,
                  __tempKey: void 0,
                  __tempLocation: void 0,
                  __TSR_key: void 0,
                  key: void 0
                }
              }
            }
          };
          if (nextHistory.unmaskOnReload ?? this.options.unmaskOnReload ?? false) nextHistory.state.__tempKey = this.tempLocationKey;
        }
        nextHistory.state.__hashScrollIntoViewOptions = hashScrollIntoView ?? this.options.defaultHashScrollIntoView ?? true;
        this.shouldViewTransition = viewTransition;
        this.history[next.replace ? "replace" : "push"](nextHistory.publicHref, nextHistory.state, { ignoreBlocker });
      }
      this.resetNextScroll = next.resetScroll ?? true;
      if (!this.history.subscribers.size) this.load();
      return this.commitLocationPromise;
    };
    this.buildAndCommitLocation = ({ replace, resetScroll, hashScrollIntoView, viewTransition, ignoreBlocker, href, ...rest } = {}) => {
      if (href) {
        const currentIndex = this.history.location.state.__TSR_index;
        const parsed = parseHref(href, { __TSR_index: replace ? currentIndex : currentIndex + 1 });
        const hrefUrl = new URL(parsed.pathname, this.origin);
        rest.to = executeRewriteInput(this.rewrite, hrefUrl).pathname;
        rest.search = this.options.parseSearch(parsed.search);
        rest.hash = parsed.hash.slice(1);
      }
      const location = this.buildLocation({
        ...rest,
        _includeValidateSearch: true
      });
      this.pendingBuiltLocation = location;
      const commitPromise = this.commitLocation({
        ...location,
        viewTransition,
        replace,
        resetScroll,
        hashScrollIntoView,
        ignoreBlocker
      });
      Promise.resolve().then(() => {
        if (this.pendingBuiltLocation === location) this.pendingBuiltLocation = void 0;
      });
      return commitPromise;
    };
    this.navigate = async ({ to, reloadDocument, href, publicHref, ...rest }) => {
      let hrefIsUrl = false;
      if (href) try {
        new URL(`${href}`);
        hrefIsUrl = true;
      } catch {
      }
      if (hrefIsUrl && !reloadDocument) reloadDocument = true;
      if (reloadDocument) {
        if (to !== void 0 || !href) {
          const location = this.buildLocation({
            to,
            ...rest
          });
          href = href ?? location.publicHref;
          publicHref = publicHref ?? location.publicHref;
        }
        const reloadHref = !hrefIsUrl && publicHref ? publicHref : href;
        if (isDangerousProtocol(reloadHref, this.protocolAllowlist)) {
          return Promise.resolve();
        }
        if (!rest.ignoreBlocker) {
          const blockers = this.history.getBlockers?.() ?? [];
          for (const blocker of blockers) if (blocker?.blockerFn) {
            if (await blocker.blockerFn({
              currentLocation: this.latestLocation,
              nextLocation: this.latestLocation,
              action: "PUSH"
            })) return Promise.resolve();
          }
        }
        if (rest.replace) window.location.replace(reloadHref);
        else window.location.href = reloadHref;
        return Promise.resolve();
      }
      return this.buildAndCommitLocation({
        ...rest,
        href,
        to,
        _isNavigate: true
      });
    };
    this.beforeLoad = () => {
      this.cancelMatches();
      this.updateLatestLocation();
      {
        const nextLocation = this.buildLocation({
          to: this.latestLocation.pathname,
          search: true,
          params: true,
          hash: true,
          state: true,
          _includeValidateSearch: true
        });
        if (this.latestLocation.publicHref !== nextLocation.publicHref) {
          const href = this.getParsedLocationHref(nextLocation);
          if (nextLocation.external) throw redirect({ href });
          else throw redirect({
            href,
            _builtLocation: nextLocation
          });
        }
      }
      const pendingMatches = this.matchRoutes(this.latestLocation);
      const nextCachedMatches = this.stores.cachedMatches.get().filter((d) => !pendingMatches.some((e) => e.id === d.id));
      this.batch(() => {
        this.stores.status.set("pending");
        this.stores.statusCode.set(200);
        this.stores.isLoading.set(true);
        this.stores.location.set(this.latestLocation);
        this.stores.setPending(pendingMatches);
        this.stores.setCached(nextCachedMatches);
      });
    };
    this.load = async (opts) => {
      let redirect2;
      let notFound;
      let loadPromise;
      const previousLocation = this.stores.resolvedLocation.get() ?? this.stores.location.get();
      loadPromise = new Promise((resolve) => {
        this.startTransition(async () => {
          try {
            this.beforeLoad();
            const next = this.latestLocation;
            const locationChangeInfo = getLocationChangeInfo(next, this.stores.resolvedLocation.get());
            if (!this.stores.redirect.get()) this.emit({
              type: "onBeforeNavigate",
              ...locationChangeInfo
            });
            this.emit({
              type: "onBeforeLoad",
              ...locationChangeInfo
            });
            await loadMatches({
              router: this,
              sync: opts?.sync,
              forceStaleReload: previousLocation.href === next.href,
              matches: this.stores.pendingMatches.get(),
              location: next,
              updateMatch: this.updateMatch,
              onReady: async () => {
                this.startTransition(() => {
                  this.startViewTransition(async () => {
                    let exitingMatches = null;
                    let hookExitingMatches = null;
                    let hookEnteringMatches = null;
                    let hookStayingMatches = null;
                    this.batch(() => {
                      const pendingMatches = this.stores.pendingMatches.get();
                      const mountPending = pendingMatches.length;
                      const currentMatches = this.stores.matches.get();
                      exitingMatches = mountPending ? currentMatches.filter((match) => !this.stores.pendingMatchStores.has(match.id)) : null;
                      const pendingRouteIds = /* @__PURE__ */ new Set();
                      for (const s of this.stores.pendingMatchStores.values()) if (s.routeId) pendingRouteIds.add(s.routeId);
                      const activeRouteIds = /* @__PURE__ */ new Set();
                      for (const s of this.stores.matchStores.values()) if (s.routeId) activeRouteIds.add(s.routeId);
                      hookExitingMatches = mountPending ? currentMatches.filter((match) => !pendingRouteIds.has(match.routeId)) : null;
                      hookEnteringMatches = mountPending ? pendingMatches.filter((match) => !activeRouteIds.has(match.routeId)) : null;
                      hookStayingMatches = mountPending ? pendingMatches.filter((match) => activeRouteIds.has(match.routeId)) : currentMatches;
                      this.stores.isLoading.set(false);
                      this.stores.loadedAt.set(Date.now());
                      if (mountPending) {
                        this.stores.setMatches(pendingMatches);
                        this.stores.setPending([]);
                        this.stores.setCached([...this.stores.cachedMatches.get(), ...exitingMatches.filter((d) => d.status !== "error" && d.status !== "notFound" && d.status !== "redirected")]);
                        this.clearExpiredCache();
                      }
                    });
                    for (const [matches, hook] of [
                      [hookExitingMatches, "onLeave"],
                      [hookEnteringMatches, "onEnter"],
                      [hookStayingMatches, "onStay"]
                    ]) {
                      if (!matches) continue;
                      for (const match of matches) this.looseRoutesById[match.routeId].options[hook]?.(match);
                    }
                  });
                });
              }
            });
          } catch (err) {
            if (isRedirect(err)) {
              redirect2 = err;
            } else if (isNotFound(err)) notFound = err;
            const nextStatusCode = redirect2 ? redirect2.status : notFound ? 404 : this.stores.matches.get().some((d) => d.status === "error") ? 500 : 200;
            this.batch(() => {
              this.stores.statusCode.set(nextStatusCode);
              this.stores.redirect.set(redirect2);
            });
          }
          if (this.latestLoadPromise === loadPromise) {
            this.commitLocationPromise?.resolve();
            this.latestLoadPromise = void 0;
            this.commitLocationPromise = void 0;
          }
          resolve();
        });
      });
      this.latestLoadPromise = loadPromise;
      await loadPromise;
      while (this.latestLoadPromise && loadPromise !== this.latestLoadPromise) await this.latestLoadPromise;
      let newStatusCode = void 0;
      if (this.hasNotFoundMatch()) newStatusCode = 404;
      else if (this.stores.matches.get().some((d) => d.status === "error")) newStatusCode = 500;
      if (newStatusCode !== void 0) this.stores.statusCode.set(newStatusCode);
    };
    this.startViewTransition = (fn) => {
      const shouldViewTransition = this.shouldViewTransition ?? this.options.defaultViewTransition;
      this.shouldViewTransition = void 0;
      if (shouldViewTransition && typeof document !== "undefined" && "startViewTransition" in document && typeof document.startViewTransition === "function") {
        let startViewTransitionParams;
        if (typeof shouldViewTransition === "object" && this.isViewTransitionTypesSupported) {
          const next = this.latestLocation;
          const prevLocation = this.stores.resolvedLocation.get();
          const resolvedViewTransitionTypes = typeof shouldViewTransition.types === "function" ? shouldViewTransition.types(getLocationChangeInfo(next, prevLocation)) : shouldViewTransition.types;
          if (resolvedViewTransitionTypes === false) {
            fn();
            return;
          }
          startViewTransitionParams = {
            update: fn,
            types: resolvedViewTransitionTypes
          };
        } else startViewTransitionParams = fn;
        document.startViewTransition(startViewTransitionParams);
      } else fn();
    };
    this.updateMatch = (id, updater) => {
      this.startTransition(() => {
        const pendingMatch = this.stores.pendingMatchStores.get(id);
        if (pendingMatch) {
          pendingMatch.set(updater);
          return;
        }
        const activeMatch = this.stores.matchStores.get(id);
        if (activeMatch) {
          activeMatch.set(updater);
          return;
        }
        const cachedMatch = this.stores.cachedMatchStores.get(id);
        if (cachedMatch) {
          const next = updater(cachedMatch.get());
          if (next.status === "redirected") {
            if (this.stores.cachedMatchStores.delete(id)) this.stores.cachedIds.set((prev) => prev.filter((matchId) => matchId !== id));
          } else cachedMatch.set(next);
        }
      });
    };
    this.getMatch = (matchId) => {
      return this.stores.cachedMatchStores.get(matchId)?.get() ?? this.stores.pendingMatchStores.get(matchId)?.get() ?? this.stores.matchStores.get(matchId)?.get();
    };
    this.invalidate = (opts) => {
      const invalidate = (d) => {
        if (opts?.filter?.(d) ?? true) return {
          ...d,
          invalid: true,
          ...opts?.forcePending || d.status === "error" || d.status === "notFound" ? {
            status: "pending",
            error: void 0
          } : void 0
        };
        return d;
      };
      this.batch(() => {
        this.stores.setMatches(this.stores.matches.get().map(invalidate));
        this.stores.setCached(this.stores.cachedMatches.get().map(invalidate));
        this.stores.setPending(this.stores.pendingMatches.get().map(invalidate));
      });
      this.shouldViewTransition = false;
      return this.load({ sync: opts?.sync });
    };
    this.getParsedLocationHref = (location) => {
      return location.publicHref || "/";
    };
    this.resolveRedirect = (redirect2) => {
      const locationHeader = redirect2.headers.get("Location");
      if (!redirect2.options.href || redirect2.options._builtLocation) {
        const location = redirect2.options._builtLocation ?? this.buildLocation(redirect2.options);
        const href = this.getParsedLocationHref(location);
        redirect2.options.href = href;
        redirect2.headers.set("Location", href);
      } else if (locationHeader) try {
        const url = new URL(locationHeader);
        if (this.origin && url.origin === this.origin) {
          const href = url.pathname + url.search + url.hash;
          redirect2.options.href = href;
          redirect2.headers.set("Location", href);
        }
      } catch {
      }
      if (redirect2.options.href && !redirect2.options._builtLocation && isDangerousProtocol(redirect2.options.href, this.protocolAllowlist)) throw new Error("Redirect blocked: unsafe protocol");
      if (!redirect2.headers.get("Location")) redirect2.headers.set("Location", redirect2.options.href);
      return redirect2;
    };
    this.clearCache = (opts) => {
      const filter = opts?.filter;
      if (filter !== void 0) this.stores.setCached(this.stores.cachedMatches.get().filter((m) => !filter(m)));
      else this.stores.setCached([]);
    };
    this.clearExpiredCache = () => {
      const now = Date.now();
      const filter = (d) => {
        const route = this.looseRoutesById[d.routeId];
        if (!route.options.loader) return true;
        const gcTime = (d.preload ? route.options.preloadGcTime ?? this.options.defaultPreloadGcTime : route.options.gcTime ?? this.options.defaultGcTime) ?? 300 * 1e3;
        if (d.status === "error") return true;
        return now - d.updatedAt >= gcTime;
      };
      this.clearCache({ filter });
    };
    this.loadRouteChunk = loadRouteChunk;
    this.preloadRoute = async (opts) => {
      const next = opts._builtLocation ?? this.buildLocation(opts);
      let matches = this.matchRoutes(next, {
        throwOnError: true,
        preload: true,
        dest: opts
      });
      const activeMatchIds = /* @__PURE__ */ new Set([...this.stores.matchesId.get(), ...this.stores.pendingIds.get()]);
      const loadedMatchIds = /* @__PURE__ */ new Set([...activeMatchIds, ...this.stores.cachedIds.get()]);
      const matchesToCache = matches.filter((match) => !loadedMatchIds.has(match.id));
      if (matchesToCache.length) {
        const cachedMatches = this.stores.cachedMatches.get();
        this.stores.setCached([...cachedMatches, ...matchesToCache]);
      }
      try {
        matches = await loadMatches({
          router: this,
          matches,
          location: next,
          preload: true,
          updateMatch: (id, updater) => {
            if (activeMatchIds.has(id)) matches = matches.map((d) => d.id === id ? updater(d) : d);
            else this.updateMatch(id, updater);
          }
        });
        return matches;
      } catch (err) {
        if (isRedirect(err)) {
          if (err.options.reloadDocument) return;
          return await this.preloadRoute({
            ...err.options,
            _fromLocation: next
          });
        }
        if (!isNotFound(err)) console.error(err);
        return;
      }
    };
    this.matchRoute = (location, opts) => {
      const matchLocation = {
        ...location,
        to: location.to ? this.resolvePathWithBase(location.from || "", location.to) : void 0,
        params: location.params || {},
        leaveParams: true
      };
      const next = this.buildLocation(matchLocation);
      if (opts?.pending && this.stores.status.get() !== "pending") return false;
      const baseLocation = (opts?.pending === void 0 ? !this.stores.isLoading.get() : opts.pending) ? this.latestLocation : this.stores.resolvedLocation.get() || this.stores.location.get();
      const match = findSingleMatch(next.pathname, opts?.caseSensitive ?? false, opts?.fuzzy ?? false, baseLocation.pathname, this.processedTree);
      if (!match) return false;
      if (location.params) {
        if (!deepEqual(match.rawParams, location.params, { partial: true })) return false;
      }
      if (opts?.includeSearch ?? true) return deepEqual(baseLocation.search, next.search, { partial: true }) ? match.rawParams : false;
      return match.rawParams;
    };
    this.hasNotFoundMatch = () => {
      return this.stores.matches.get().some((d) => d.status === "notFound" || d.globalNotFound);
    };
    this.getStoreConfig = getStoreConfig;
    this.update({
      defaultPreloadDelay: 50,
      defaultPendingMs: 1e3,
      defaultPendingMinMs: 500,
      context: void 0,
      ...options,
      caseSensitive: options.caseSensitive ?? false,
      notFoundMode: options.notFoundMode ?? "fuzzy",
      stringifySearch: options.stringifySearch ?? defaultStringifySearch,
      parseSearch: options.parseSearch ?? defaultParseSearch,
      protocolAllowlist: options.protocolAllowlist ?? DEFAULT_PROTOCOL_ALLOWLIST
    });
    if (typeof document !== "undefined") self.__TSR_ROUTER__ = this;
  }
  isShell() {
    return !!this.options.isShell;
  }
  isPrerendering() {
    return !!this.options.isPrerendering;
  }
  get state() {
    return this.stores.__store.get();
  }
  setRoutes({ routesById, routesByPath, processedTree }) {
    this.routesById = routesById;
    this.routesByPath = routesByPath;
    this.processedTree = processedTree;
    const notFoundRoute = this.options.notFoundRoute;
    if (notFoundRoute) {
      notFoundRoute.init({ originalIndex: 99999999999 });
      this.routesById[notFoundRoute.id] = notFoundRoute;
    }
  }
  get looseRoutesById() {
    return this.routesById;
  }
  getParentContext(parentMatch) {
    return !parentMatch?.id ? this.options.context ?? void 0 : parentMatch.context ?? this.options.context ?? void 0;
  }
  matchRoutesInternal(next, opts) {
    const matchedRoutesResult = this.getMatchedRoutes(next.pathname);
    const { foundRoute, routeParams, parsedParams } = matchedRoutesResult;
    let { matchedRoutes } = matchedRoutesResult;
    let isGlobalNotFound = false;
    if (foundRoute ? foundRoute.path !== "/" && routeParams["**"] : trimPathRight(next.pathname)) if (this.options.notFoundRoute) matchedRoutes = [...matchedRoutes, this.options.notFoundRoute];
    else isGlobalNotFound = true;
    const globalNotFoundRouteId = isGlobalNotFound ? findGlobalNotFoundRouteId(this.options.notFoundMode, matchedRoutes) : void 0;
    const matches = new Array(matchedRoutes.length);
    const previousActiveMatchesByRouteId = /* @__PURE__ */ new Map();
    for (const store of this.stores.matchStores.values()) if (store.routeId) previousActiveMatchesByRouteId.set(store.routeId, store.get());
    for (let index = 0; index < matchedRoutes.length; index++) {
      const route = matchedRoutes[index];
      const parentMatch = matches[index - 1];
      let preMatchSearch;
      let strictMatchSearch;
      let searchError;
      {
        const parentSearch = parentMatch?.search ?? next.search;
        const parentStrictSearch = parentMatch?._strictSearch ?? void 0;
        try {
          const strictSearch = validateSearch(route.options.validateSearch, { ...parentSearch }) ?? void 0;
          preMatchSearch = {
            ...parentSearch,
            ...strictSearch
          };
          strictMatchSearch = {
            ...parentStrictSearch,
            ...strictSearch
          };
          searchError = void 0;
        } catch (err) {
          let searchParamError = err;
          if (!(err instanceof SearchParamError)) searchParamError = new SearchParamError(err.message, { cause: err });
          if (opts?.throwOnError) throw searchParamError;
          preMatchSearch = parentSearch;
          strictMatchSearch = {};
          searchError = searchParamError;
        }
      }
      const loaderDeps = route.options.loaderDeps?.({ search: preMatchSearch }) ?? "";
      const loaderDepsHash = loaderDeps ? JSON.stringify(loaderDeps) : "";
      const { interpolatedPath, usedParams } = interpolatePath({
        path: route.fullPath,
        params: routeParams,
        decoder: this.pathParamsDecoder,
        server: this.isServer
      });
      const matchId = route.id + interpolatedPath + loaderDepsHash;
      const existingMatch = this.getMatch(matchId);
      const previousMatch = previousActiveMatchesByRouteId.get(route.id);
      const strictParams = existingMatch?._strictParams ?? usedParams;
      let paramsError = void 0;
      if (!existingMatch) try {
        extractStrictParams(route, usedParams, parsedParams, strictParams);
      } catch (err) {
        if (isNotFound(err) || isRedirect(err)) paramsError = err;
        else paramsError = new PathParamError(err.message, { cause: err });
        if (opts?.throwOnError) throw paramsError;
      }
      Object.assign(routeParams, strictParams);
      const cause = previousMatch ? "stay" : "enter";
      let match;
      if (existingMatch) match = {
        ...existingMatch,
        cause,
        params: previousMatch?.params ?? routeParams,
        _strictParams: strictParams,
        search: previousMatch ? nullReplaceEqualDeep(previousMatch.search, preMatchSearch) : nullReplaceEqualDeep(existingMatch.search, preMatchSearch),
        _strictSearch: strictMatchSearch
      };
      else {
        const status = route.options.loader || route.options.beforeLoad || route.lazyFn || routeNeedsPreload(route) ? "pending" : "success";
        match = {
          id: matchId,
          ssr: void 0,
          index,
          routeId: route.id,
          params: previousMatch?.params ?? routeParams,
          _strictParams: strictParams,
          pathname: interpolatedPath,
          updatedAt: Date.now(),
          search: previousMatch ? nullReplaceEqualDeep(previousMatch.search, preMatchSearch) : preMatchSearch,
          _strictSearch: strictMatchSearch,
          searchError: void 0,
          status,
          isFetching: false,
          error: void 0,
          paramsError,
          __routeContext: void 0,
          _nonReactive: { loadPromise: createControlledPromise() },
          __beforeLoadContext: void 0,
          context: {},
          abortController: new AbortController(),
          fetchCount: 0,
          cause,
          loaderDeps: previousMatch ? replaceEqualDeep(previousMatch.loaderDeps, loaderDeps) : loaderDeps,
          invalid: false,
          preload: false,
          links: void 0,
          scripts: void 0,
          headScripts: void 0,
          meta: void 0,
          staticData: route.options.staticData || {},
          fullPath: route.fullPath
        };
      }
      if (!opts?.preload) match.globalNotFound = globalNotFoundRouteId === route.id;
      match.searchError = searchError;
      const parentContext = this.getParentContext(parentMatch);
      match.context = {
        ...parentContext,
        ...match.__routeContext,
        ...match.__beforeLoadContext
      };
      matches[index] = match;
    }
    for (let index = 0; index < matches.length; index++) {
      const match = matches[index];
      const route = this.looseRoutesById[match.routeId];
      const existingMatch = this.getMatch(match.id);
      const previousMatch = previousActiveMatchesByRouteId.get(match.routeId);
      match.params = previousMatch ? nullReplaceEqualDeep(previousMatch.params, routeParams) : routeParams;
      if (!existingMatch) {
        const parentMatch = matches[index - 1];
        const parentContext = this.getParentContext(parentMatch);
        if (route.options.context) {
          const contextFnContext = {
            deps: match.loaderDeps,
            params: match.params,
            context: parentContext ?? {},
            location: next,
            navigate: (opts2) => this.navigate({
              ...opts2,
              _fromLocation: next
            }),
            buildLocation: this.buildLocation,
            cause: match.cause,
            abortController: match.abortController,
            preload: !!match.preload,
            matches,
            routeId: route.id
          };
          match.__routeContext = route.options.context(contextFnContext) ?? void 0;
        }
        match.context = {
          ...parentContext,
          ...match.__routeContext,
          ...match.__beforeLoadContext
        };
      }
    }
    return matches;
  }
  /**
  * Lightweight route matching for buildLocation.
  * Only computes fullPath, accumulated search, and params - skipping expensive
  * operations like AbortController, ControlledPromise, loaderDeps, and full match objects.
  */
  matchRoutesLightweight(location) {
    const { matchedRoutes, routeParams, parsedParams } = this.getMatchedRoutes(location.pathname);
    const lastRoute = last(matchedRoutes);
    const accumulatedSearch = { ...location.search };
    for (const route of matchedRoutes) try {
      Object.assign(accumulatedSearch, validateSearch(route.options.validateSearch, accumulatedSearch));
    } catch {
    }
    const lastStateMatchId = last(this.stores.matchesId.get());
    const lastStateMatch = lastStateMatchId && this.stores.matchStores.get(lastStateMatchId)?.get();
    const canReuseParams = lastStateMatch && lastStateMatch.routeId === lastRoute.id && lastStateMatch.pathname === location.pathname;
    let params;
    if (canReuseParams) params = lastStateMatch.params;
    else {
      const strictParams = Object.assign(/* @__PURE__ */ Object.create(null), routeParams);
      for (const route of matchedRoutes) try {
        extractStrictParams(route, routeParams, parsedParams ?? {}, strictParams);
      } catch {
      }
      params = strictParams;
    }
    return {
      matchedRoutes,
      fullPath: lastRoute.fullPath,
      search: accumulatedSearch,
      params
    };
  }
};
var SearchParamError = class extends Error {
};
var PathParamError = class extends Error {
};
function getInitialRouterState(location) {
  return {
    loadedAt: 0,
    isLoading: false,
    isTransitioning: false,
    status: "idle",
    resolvedLocation: void 0,
    location,
    matches: [],
    statusCode: 200
  };
}
function validateSearch(validateSearch2, input) {
  if (validateSearch2 == null) return {};
  if ("~standard" in validateSearch2) {
    const result = validateSearch2["~standard"].validate(input);
    if (result instanceof Promise) throw new SearchParamError("Async validation not supported");
    if (result.issues) throw new SearchParamError(JSON.stringify(result.issues, void 0, 2), { cause: result });
    return result.value;
  }
  if ("parse" in validateSearch2) return validateSearch2.parse(input);
  if (typeof validateSearch2 === "function") return validateSearch2(input);
  return {};
}
function getMatchedRoutes({ pathname, routesById, processedTree }) {
  const routeParams = /* @__PURE__ */ Object.create(null);
  const trimmedPath = trimPathRight(pathname);
  let foundRoute = void 0;
  let parsedParams = void 0;
  const match = findRouteMatch(trimmedPath, processedTree, true);
  if (match) {
    foundRoute = match.route;
    Object.assign(routeParams, match.rawParams);
    parsedParams = Object.assign(/* @__PURE__ */ Object.create(null), match.parsedParams);
  }
  return {
    matchedRoutes: match?.branch || [routesById["__root__"]],
    routeParams,
    foundRoute,
    parsedParams
  };
}
function applySearchMiddleware({ search, dest, destRoutes, _includeValidateSearch }) {
  return buildMiddlewareChain(destRoutes)(search, dest, _includeValidateSearch ?? false);
}
function buildMiddlewareChain(destRoutes) {
  const context = {
    dest: null,
    _includeValidateSearch: false,
    middlewares: []
  };
  for (const route of destRoutes) {
    if ("search" in route.options) {
      if (route.options.search?.middlewares) context.middlewares.push(...route.options.search.middlewares);
    } else if (route.options.preSearchFilters || route.options.postSearchFilters) {
      const legacyMiddleware = ({ search, next }) => {
        let nextSearch = search;
        if ("preSearchFilters" in route.options && route.options.preSearchFilters) nextSearch = route.options.preSearchFilters.reduce((prev, next2) => next2(prev), search);
        const result = next(nextSearch);
        if ("postSearchFilters" in route.options && route.options.postSearchFilters) return route.options.postSearchFilters.reduce((prev, next2) => next2(prev), result);
        return result;
      };
      context.middlewares.push(legacyMiddleware);
    }
    if (route.options.validateSearch) {
      const validate = ({ search, next }) => {
        const result = next(search);
        if (!context._includeValidateSearch) return result;
        try {
          return {
            ...result,
            ...validateSearch(route.options.validateSearch, result) ?? void 0
          };
        } catch {
          return result;
        }
      };
      context.middlewares.push(validate);
    }
  }
  const final = ({ search }) => {
    const dest = context.dest;
    if (!dest.search) return {};
    if (dest.search === true) return search;
    return functionalUpdate(dest.search, search);
  };
  context.middlewares.push(final);
  const applyNext = (index, currentSearch, middlewares) => {
    if (index >= middlewares.length) return currentSearch;
    const middleware = middlewares[index];
    const next = (newSearch) => {
      return applyNext(index + 1, newSearch, middlewares);
    };
    return middleware({
      search: currentSearch,
      next
    });
  };
  return function middleware(search, dest, _includeValidateSearch) {
    context.dest = dest;
    context._includeValidateSearch = _includeValidateSearch;
    return applyNext(0, search, context.middlewares);
  };
}
function findGlobalNotFoundRouteId(notFoundMode, routes) {
  if (notFoundMode !== "root") for (let i = routes.length - 1; i >= 0; i--) {
    const route = routes[i];
    if (route.children) return route.id;
  }
  return rootRouteId;
}
function extractStrictParams(route, referenceParams, parsedParams, accumulatedParams) {
  const parseParams = route.options.params?.parse ?? route.options.parseParams;
  if (parseParams) if (route.options.skipRouteOnParseError) {
    for (const key in referenceParams) if (key in parsedParams) accumulatedParams[key] = parsedParams[key];
  } else {
    const result = parseParams(accumulatedParams);
    Object.assign(accumulatedParams, result);
  }
}
var BaseRoute = class {
  get to() {
    return this._to;
  }
  get id() {
    return this._id;
  }
  get path() {
    return this._path;
  }
  get fullPath() {
    return this._fullPath;
  }
  constructor(options) {
    this.init = (opts) => {
      this.originalIndex = opts.originalIndex;
      const options2 = this.options;
      const isRoot = !options2?.path && !options2?.id;
      this.parentRoute = this.options.getParentRoute?.();
      if (isRoot) this._path = rootRouteId;
      else if (!this.parentRoute) {
        invariant();
      }
      let path = isRoot ? rootRouteId : options2?.path;
      if (path && path !== "/") path = trimPathLeft(path);
      const customId = options2?.id || path;
      let id = isRoot ? rootRouteId : joinPaths([this.parentRoute.id === "__root__" ? "" : this.parentRoute.id, customId]);
      if (path === "__root__") path = "/";
      if (id !== "__root__") id = joinPaths(["/", id]);
      const fullPath = id === "__root__" ? "/" : joinPaths([this.parentRoute.fullPath, path]);
      this._path = path;
      this._id = id;
      this._fullPath = fullPath;
      this._to = trimPathRight(fullPath);
    };
    this.addChildren = (children) => {
      return this._addFileChildren(children);
    };
    this._addFileChildren = (children) => {
      if (Array.isArray(children)) this.children = children;
      if (typeof children === "object" && children !== null) this.children = Object.values(children);
      return this;
    };
    this._addFileTypes = () => {
      return this;
    };
    this.updateLoader = (options2) => {
      Object.assign(this.options, options2);
      return this;
    };
    this.update = (options2) => {
      Object.assign(this.options, options2);
      return this;
    };
    this.lazy = (lazyFn) => {
      this.lazyFn = lazyFn;
      return this;
    };
    this.redirect = (opts) => redirect({
      from: this.fullPath,
      ...opts
    });
    this.options = options || {};
    this.isRoot = !options?.getParentRoute;
    if (options?.id && options?.path) throw new Error(`Route cannot have both an 'id' and a 'path' option.`);
  }
};
var BaseRootRoute = class extends BaseRoute {
  constructor(options) {
    super(options);
  }
};
function useMatch(opts) {
  const router2 = useRouter();
  const nearestMatchId = reactExports.useContext(opts.from ? dummyMatchContext : matchContext);
  const key = opts.from ?? nearestMatchId;
  const matchStore = key ? opts.from ? router2.stores.getRouteMatchStore(key) : router2.stores.matchStores.get(key) : void 0;
  {
    const match = matchStore?.get();
    if ((opts.shouldThrow ?? true) && !match) {
      invariant();
    }
    if (match === void 0) return;
    return opts.select ? opts.select(match) : match;
  }
}
function useLoaderData(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    structuralSharing: opts.structuralSharing,
    select: (s) => {
      return opts.select ? opts.select(s.loaderData) : s.loaderData;
    }
  });
}
function useLoaderDeps(opts) {
  const { select, ...rest } = opts;
  return useMatch({
    ...rest,
    select: (s) => {
      return select ? select(s.loaderDeps) : s.loaderDeps;
    }
  });
}
function useParams(opts) {
  return useMatch({
    from: opts.from,
    shouldThrow: opts.shouldThrow,
    structuralSharing: opts.structuralSharing,
    strict: opts.strict,
    select: (match) => {
      const params = opts.strict === false ? match.params : match._strictParams;
      return opts.select ? opts.select(params) : params;
    }
  });
}
function useSearch(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    shouldThrow: opts.shouldThrow,
    structuralSharing: opts.structuralSharing,
    select: (match) => {
      return opts.select ? opts.select(match.search) : match.search;
    }
  });
}
function useNavigate(_defaultOpts) {
  const router2 = useRouter();
  return reactExports.useCallback((options) => {
    return router2.navigate({
      ...options,
      from: options.from ?? _defaultOpts?.from
    });
  }, [_defaultOpts?.from, router2]);
}
function useRouteContext(opts) {
  return useMatch({
    ...opts,
    select: (match) => opts.select ? opts.select(match.context) : match.context
  });
}
var reactDomExports = requireReactDom();
const ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(reactDomExports);
function useLinkProps(options, forwardedRef) {
  const router2 = useRouter();
  const innerRef = useForwardedRef(forwardedRef);
  const { activeProps, inactiveProps, activeOptions, to, preload: userPreload, preloadDelay: userPreloadDelay, preloadIntentProximity: _preloadIntentProximity, hashScrollIntoView, replace, startTransition, resetScroll, viewTransition, children, target, disabled, style, className, onClick, onBlur, onFocus, onMouseEnter, onMouseLeave, onTouchStart, ignoreBlocker, params: _params, search: _search, hash: _hash, state: _state, mask: _mask, reloadDocument: _reloadDocument, unsafeRelative: _unsafeRelative, from: _from, _fromLocation, ...propsSafeToSpread } = options;
  {
    const safeInternal = isSafeInternal(to);
    if (typeof to === "string" && !safeInternal && to.indexOf(":") > -1) try {
      new URL(to);
      if (isDangerousProtocol(to, router2.protocolAllowlist)) {
        if (false) ;
        return {
          ...propsSafeToSpread,
          ref: innerRef,
          href: void 0,
          ...children && { children },
          ...target && { target },
          ...disabled && { disabled },
          ...style && { style },
          ...className && { className }
        };
      }
      return {
        ...propsSafeToSpread,
        ref: innerRef,
        href: to,
        ...children && { children },
        ...target && { target },
        ...disabled && { disabled },
        ...style && { style },
        ...className && { className }
      };
    } catch {
    }
    const next2 = router2.buildLocation({
      ...options,
      from: options.from
    });
    const hrefOption2 = getHrefOption(next2.maskedLocation ? next2.maskedLocation.publicHref : next2.publicHref, next2.maskedLocation ? next2.maskedLocation.external : next2.external, router2.history, disabled);
    const externalLink2 = (() => {
      if (hrefOption2?.external) {
        if (isDangerousProtocol(hrefOption2.href, router2.protocolAllowlist)) {
          return;
        }
        return hrefOption2.href;
      }
      if (safeInternal) return void 0;
      if (typeof to === "string" && to.indexOf(":") > -1) try {
        new URL(to);
        if (isDangerousProtocol(to, router2.protocolAllowlist)) {
          if (false) ;
          return;
        }
        return to;
      } catch {
      }
    })();
    const isActive2 = (() => {
      if (externalLink2) return false;
      const currentLocation2 = router2.stores.location.get();
      const exact = activeOptions?.exact ?? false;
      if (exact) {
        if (!exactPathTest(currentLocation2.pathname, next2.pathname, router2.basepath)) return false;
      } else {
        const currentPathSplit = removeTrailingSlash(currentLocation2.pathname, router2.basepath);
        const nextPathSplit = removeTrailingSlash(next2.pathname, router2.basepath);
        if (!(currentPathSplit.startsWith(nextPathSplit) && (currentPathSplit.length === nextPathSplit.length || currentPathSplit[nextPathSplit.length] === "/"))) return false;
      }
      if (activeOptions?.includeSearch ?? true) {
        if (currentLocation2.search !== next2.search) {
          const currentSearchEmpty = !currentLocation2.search || typeof currentLocation2.search === "object" && Object.keys(currentLocation2.search).length === 0;
          const nextSearchEmpty = !next2.search || typeof next2.search === "object" && Object.keys(next2.search).length === 0;
          if (!(currentSearchEmpty && nextSearchEmpty)) {
            if (!deepEqual(currentLocation2.search, next2.search, {
              partial: !exact,
              ignoreUndefined: !activeOptions?.explicitUndefined
            })) return false;
          }
        }
      }
      if (activeOptions?.includeHash) return false;
      return true;
    })();
    if (externalLink2) return {
      ...propsSafeToSpread,
      ref: innerRef,
      href: externalLink2,
      ...children && { children },
      ...target && { target },
      ...disabled && { disabled },
      ...style && { style },
      ...className && { className }
    };
    const resolvedActiveProps2 = isActive2 ? functionalUpdate(activeProps, {}) ?? STATIC_ACTIVE_OBJECT : STATIC_EMPTY_OBJECT;
    const resolvedInactiveProps2 = isActive2 ? STATIC_EMPTY_OBJECT : functionalUpdate(inactiveProps, {}) ?? STATIC_EMPTY_OBJECT;
    const resolvedStyle2 = (() => {
      const baseStyle = style;
      const activeStyle = resolvedActiveProps2.style;
      const inactiveStyle = resolvedInactiveProps2.style;
      if (!baseStyle && !activeStyle && !inactiveStyle) return;
      if (baseStyle && !activeStyle && !inactiveStyle) return baseStyle;
      if (!baseStyle && activeStyle && !inactiveStyle) return activeStyle;
      if (!baseStyle && !activeStyle && inactiveStyle) return inactiveStyle;
      return {
        ...baseStyle,
        ...activeStyle,
        ...inactiveStyle
      };
    })();
    const resolvedClassName2 = (() => {
      const baseClassName = className;
      const activeClassName = resolvedActiveProps2.className;
      const inactiveClassName = resolvedInactiveProps2.className;
      if (!baseClassName && !activeClassName && !inactiveClassName) return "";
      let out = "";
      if (baseClassName) out = baseClassName;
      if (activeClassName) out = out ? `${out} ${activeClassName}` : activeClassName;
      if (inactiveClassName) out = out ? `${out} ${inactiveClassName}` : inactiveClassName;
      return out;
    })();
    return {
      ...propsSafeToSpread,
      ...resolvedActiveProps2,
      ...resolvedInactiveProps2,
      href: hrefOption2?.href,
      ref: innerRef,
      disabled: !!disabled,
      target,
      ...resolvedStyle2 && { style: resolvedStyle2 },
      ...resolvedClassName2 && { className: resolvedClassName2 },
      ...disabled && STATIC_DISABLED_PROPS,
      ...isActive2 && STATIC_ACTIVE_PROPS
    };
  }
}
var STATIC_EMPTY_OBJECT = {};
var STATIC_ACTIVE_OBJECT = { className: "active" };
var STATIC_DISABLED_PROPS = {
  role: "link",
  "aria-disabled": true
};
var STATIC_ACTIVE_PROPS = {
  "data-status": "active",
  "aria-current": "page"
};
function getHrefOption(publicHref, external, history, disabled) {
  if (disabled) return void 0;
  if (external) return {
    href: publicHref,
    external: true
  };
  return {
    href: history.createHref(publicHref) || "/",
    external: false
  };
}
function isSafeInternal(to) {
  if (typeof to !== "string") return false;
  const zero = to.charCodeAt(0);
  if (zero === 47) return to.charCodeAt(1) !== 47;
  return zero === 46;
}
var Link = reactExports.forwardRef((props, ref) => {
  const { _asChild, ...rest } = props;
  const { type: _type, ...linkProps } = useLinkProps(rest, ref);
  const children = typeof rest.children === "function" ? rest.children({ isActive: linkProps["data-status"] === "active" }) : rest.children;
  if (!_asChild) {
    const { disabled: _, ...rest2 } = linkProps;
    return reactExports.createElement("a", rest2, children);
  }
  return reactExports.createElement(_asChild, linkProps, children);
});
var Route$U = class Route extends BaseRoute {
  /**
  * @deprecated Use the `createRoute` function instead.
  */
  constructor(options) {
    super(options);
    this.useMatch = (opts) => {
      return useMatch({
        select: opts?.select,
        from: this.id,
        structuralSharing: opts?.structuralSharing
      });
    };
    this.useRouteContext = (opts) => {
      return useRouteContext({
        ...opts,
        from: this.id
      });
    };
    this.useSearch = (opts) => {
      return useSearch({
        select: opts?.select,
        structuralSharing: opts?.structuralSharing,
        from: this.id
      });
    };
    this.useParams = (opts) => {
      return useParams({
        select: opts?.select,
        structuralSharing: opts?.structuralSharing,
        from: this.id
      });
    };
    this.useLoaderDeps = (opts) => {
      return useLoaderDeps({
        ...opts,
        from: this.id
      });
    };
    this.useLoaderData = (opts) => {
      return useLoaderData({
        ...opts,
        from: this.id
      });
    };
    this.useNavigate = () => {
      return useNavigate({ from: this.fullPath });
    };
    this.Link = React2.forwardRef((props, ref) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
        ref,
        from: this.fullPath,
        ...props
      });
    });
  }
};
function createRoute(options) {
  return new Route$U(options);
}
var RootRoute = class extends BaseRootRoute {
  /**
  * @deprecated `RootRoute` is now an internal implementation detail. Use `createRootRoute()` instead.
  */
  constructor(options) {
    super(options);
    this.useMatch = (opts) => {
      return useMatch({
        select: opts?.select,
        from: this.id,
        structuralSharing: opts?.structuralSharing
      });
    };
    this.useRouteContext = (opts) => {
      return useRouteContext({
        ...opts,
        from: this.id
      });
    };
    this.useSearch = (opts) => {
      return useSearch({
        select: opts?.select,
        structuralSharing: opts?.structuralSharing,
        from: this.id
      });
    };
    this.useParams = (opts) => {
      return useParams({
        select: opts?.select,
        structuralSharing: opts?.structuralSharing,
        from: this.id
      });
    };
    this.useLoaderDeps = (opts) => {
      return useLoaderDeps({
        ...opts,
        from: this.id
      });
    };
    this.useLoaderData = (opts) => {
      return useLoaderData({
        ...opts,
        from: this.id
      });
    };
    this.useNavigate = () => {
      return useNavigate({ from: this.fullPath });
    };
    this.Link = React2.forwardRef((props, ref) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
        ref,
        from: this.fullPath,
        ...props
      });
    });
  }
};
function createRootRoute(options) {
  return new RootRoute(options);
}
function createFileRoute(path) {
  return new FileRoute(path, { silent: true }).createRoute;
}
var FileRoute = class {
  constructor(path, _opts) {
    this.path = path;
    this.createRoute = (options) => {
      const route = createRoute(options);
      route.isRoot = false;
      return route;
    };
    this.silent = _opts?.silent;
  }
};
function lazyRouteComponent(importer, exportName) {
  let loadPromise;
  let comp;
  let error;
  let reload;
  const load = () => {
    if (!loadPromise) loadPromise = importer().then((res) => {
      loadPromise = void 0;
      comp = res[exportName];
    }).catch((err) => {
      error = err;
      if (isModuleNotFoundError(error)) {
        if (error instanceof Error && typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
          const storageKey = `tanstack_router_reload:${error.message}`;
          if (!sessionStorage.getItem(storageKey)) {
            sessionStorage.setItem(storageKey, "1");
            reload = true;
          }
        }
      }
    });
    return loadPromise;
  };
  const lazyComp = function Lazy(props) {
    if (reload) {
      window.location.reload();
      throw new Promise(() => {
      });
    }
    if (error) throw error;
    if (!comp) if (reactUse) reactUse(load());
    else throw load();
    return reactExports.createElement(comp, props);
  };
  lazyComp.preload = load;
  return lazyComp;
}
var getStoreFactory = (opts) => {
  return {
    createMutableStore: createNonReactiveMutableStore,
    createReadonlyStore: createNonReactiveReadonlyStore,
    batch: (fn) => fn()
  };
};
var createRouter = (options) => {
  return new Router(options);
};
var Router = class extends RouterCore {
  constructor(options) {
    super(options, getStoreFactory);
  }
};
function useLocation(opts) {
  const router2 = useRouter();
  {
    const location = router2.stores.location.get();
    return location;
  }
}
function Asset({ tag, attrs, children, nonce }) {
  switch (tag) {
    case "title":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("title", {
        ...attrs,
        suppressHydrationWarning: true,
        children
      });
    case "meta":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("meta", {
        ...attrs,
        suppressHydrationWarning: true
      });
    case "link":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("link", {
        ...attrs,
        nonce,
        suppressHydrationWarning: true
      });
    case "style":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("style", {
        ...attrs,
        dangerouslySetInnerHTML: { __html: children },
        nonce
      });
    case "script":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Script, {
        attrs,
        children
      });
    default:
      return null;
  }
}
function Script({ attrs, children }) {
  useRouter();
  useHydrated();
  const dataScript = typeof attrs?.type === "string" && attrs.type !== "" && attrs.type !== "text/javascript" && attrs.type !== "module";
  reactExports.useEffect(() => {
    if (dataScript) return;
    if (attrs?.src) {
      const normSrc = (() => {
        try {
          const base2 = document.baseURI || window.location.href;
          return new URL(attrs.src, base2).href;
        } catch {
          return attrs.src;
        }
      })();
      if (Array.from(document.querySelectorAll("script[src]")).find((el) => el.src === normSrc)) return;
      const script = document.createElement("script");
      for (const [key, value] of Object.entries(attrs)) if (key !== "suppressHydrationWarning" && value !== void 0 && value !== false) script.setAttribute(key, typeof value === "boolean" ? "" : String(value));
      document.head.appendChild(script);
      return () => {
        if (script.parentNode) script.parentNode.removeChild(script);
      };
    }
    if (typeof children === "string") {
      const typeAttr = typeof attrs?.type === "string" ? attrs.type : "text/javascript";
      const nonceAttr = typeof attrs?.nonce === "string" ? attrs.nonce : void 0;
      if (Array.from(document.querySelectorAll("script:not([src])")).find((el) => {
        if (!(el instanceof HTMLScriptElement)) return false;
        const sType = el.getAttribute("type") ?? "text/javascript";
        const sNonce = el.getAttribute("nonce") ?? void 0;
        return el.textContent === children && sType === typeAttr && sNonce === nonceAttr;
      })) return;
      const script = document.createElement("script");
      script.textContent = children;
      if (attrs) {
        for (const [key, value] of Object.entries(attrs)) if (key !== "suppressHydrationWarning" && value !== void 0 && value !== false) script.setAttribute(key, typeof value === "boolean" ? "" : String(value));
      }
      document.head.appendChild(script);
      return () => {
        if (script.parentNode) script.parentNode.removeChild(script);
      };
    }
  }, [
    attrs,
    children,
    dataScript
  ]);
  {
    if (attrs?.src) return /* @__PURE__ */ jsxRuntimeExports.jsx("script", {
      ...attrs,
      suppressHydrationWarning: true
    });
    if (typeof children === "string") return /* @__PURE__ */ jsxRuntimeExports.jsx("script", {
      ...attrs,
      dangerouslySetInnerHTML: { __html: children },
      suppressHydrationWarning: true
    });
    return null;
  }
}
function buildTagsFromMatches(router2, nonce, matches, assetCrossOrigin) {
  const routeMeta = matches.map((match) => match.meta).filter(Boolean);
  const resultMeta = [];
  const metaByAttribute = {};
  let title;
  for (let i = routeMeta.length - 1; i >= 0; i--) {
    const metas = routeMeta[i];
    for (let j = metas.length - 1; j >= 0; j--) {
      const m = metas[j];
      if (!m) continue;
      if (m.title) {
        if (!title) title = {
          tag: "title",
          children: m.title
        };
      } else if ("script:ld+json" in m) try {
        const json = JSON.stringify(m["script:ld+json"]);
        resultMeta.push({
          tag: "script",
          attrs: { type: "application/ld+json" },
          children: escapeHtml(json)
        });
      } catch {
      }
      else {
        const attribute = m.name ?? m.property;
        if (attribute) if (metaByAttribute[attribute]) continue;
        else metaByAttribute[attribute] = true;
        resultMeta.push({
          tag: "meta",
          attrs: {
            ...m,
            nonce
          }
        });
      }
    }
  }
  if (title) resultMeta.push(title);
  if (nonce) resultMeta.push({
    tag: "meta",
    attrs: {
      property: "csp-nonce",
      content: nonce
    }
  });
  resultMeta.reverse();
  const constructedLinks = matches.map((match) => match.links).filter(Boolean).flat(1).map((link) => ({
    tag: "link",
    attrs: {
      ...link,
      nonce
    }
  }));
  const manifest = router2.ssr?.manifest;
  const assetLinks = matches.map((match) => manifest?.routes[match.routeId]?.assets ?? []).filter(Boolean).flat(1).filter((asset) => asset.tag === "link").map((asset) => ({
    tag: "link",
    attrs: {
      ...asset.attrs,
      crossOrigin: getAssetCrossOrigin(assetCrossOrigin, "stylesheet") ?? asset.attrs?.crossOrigin,
      suppressHydrationWarning: true,
      nonce
    }
  }));
  const preloadLinks = [];
  matches.map((match) => router2.looseRoutesById[match.routeId]).forEach((route) => router2.ssr?.manifest?.routes[route.id]?.preloads?.filter(Boolean).forEach((preload) => {
    const preloadLink = resolveManifestAssetLink(preload);
    preloadLinks.push({
      tag: "link",
      attrs: {
        rel: "modulepreload",
        href: preloadLink.href,
        crossOrigin: getAssetCrossOrigin(assetCrossOrigin, "modulepreload") ?? preloadLink.crossOrigin,
        nonce
      }
    });
  }));
  const styles = matches.map((match) => match.styles).flat(1).filter(Boolean).map(({ children, ...attrs }) => ({
    tag: "style",
    attrs: {
      ...attrs,
      nonce
    },
    children
  }));
  const headScripts = matches.map((match) => match.headScripts).flat(1).filter(Boolean).map(({ children, ...script }) => ({
    tag: "script",
    attrs: {
      ...script,
      nonce
    },
    children
  }));
  return uniqBy([
    ...resultMeta,
    ...preloadLinks,
    ...constructedLinks,
    ...assetLinks,
    ...styles,
    ...headScripts
  ], (d) => JSON.stringify(d));
}
var useTags = (assetCrossOrigin) => {
  const router2 = useRouter();
  const nonce = router2.options.ssr?.nonce;
  return buildTagsFromMatches(router2, nonce, router2.stores.matches.get(), assetCrossOrigin);
};
function uniqBy(arr, fn) {
  const seen = /* @__PURE__ */ new Set();
  return arr.filter((item) => {
    const key = fn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function HeadContent(props) {
  const tags = useTags(props.assetCrossOrigin);
  const nonce = useRouter().options.ssr?.nonce;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: tags.map((tag) => /* @__PURE__ */ reactExports.createElement(Asset, {
    ...tag,
    key: `tsr-meta-${JSON.stringify(tag)}`,
    nonce
  })) });
}
var Scripts = () => {
  const router2 = useRouter();
  const nonce = router2.options.ssr?.nonce;
  const getAssetScripts = (matches) => {
    const assetScripts = [];
    const manifest = router2.ssr?.manifest;
    if (!manifest) return [];
    matches.map((match) => router2.looseRoutesById[match.routeId]).forEach((route) => manifest.routes[route.id]?.assets?.filter((d) => d.tag === "script").forEach((asset) => {
      assetScripts.push({
        tag: "script",
        attrs: {
          ...asset.attrs,
          nonce
        },
        children: asset.children
      });
    }));
    return assetScripts;
  };
  const getScripts = (matches) => matches.map((match) => match.scripts).flat(1).filter(Boolean).map(({ children, ...script }) => ({
    tag: "script",
    attrs: {
      ...script,
      suppressHydrationWarning: true,
      nonce
    },
    children
  }));
  {
    const activeMatches = router2.stores.matches.get();
    const assetScripts = getAssetScripts(activeMatches);
    return renderScripts(router2, getScripts(activeMatches), assetScripts);
  }
};
function renderScripts(router2, scripts, assetScripts) {
  let serverBufferedScript = void 0;
  if (router2.serverSsr) serverBufferedScript = router2.serverSsr.takeBufferedScripts();
  const allScripts = [...scripts, ...assetScripts];
  if (serverBufferedScript) allScripts.unshift(serverBufferedScript);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: allScripts.map((asset, i) => /* @__PURE__ */ reactExports.createElement(Asset, {
    ...asset,
    key: `tsr-scripts-${asset.tag}-${i}`
  })) });
}
function createSupabaseClient() {
  const SUPABASE_URL = "https://umjbaqpjfdumovtdgcmr.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_A-6fg7Iu8ZJ-UtNVfs2jfw_GCZ-zcrR";
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
const AuthContext = reactExports.createContext(void 0);
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(null);
  const [user, setUser] = reactExports.useState(null);
  const [profile, setProfile] = reactExports.useState(null);
  const [isAdmin, setIsAdmin] = reactExports.useState(false);
  const [isPartner, setIsPartner] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const loadProfile = async (uid) => {
    const [profileRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid)
    ]);
    setProfile(profileRes.data ?? null);
    const roleAdmin = !!rolesRes.data?.some((r) => r.role === "admin");
    const rolePartner = !!rolesRes.data?.some((r) => r.role === "partner");
    setIsAdmin(roleAdmin);
    setIsPartner(rolePartner);
  };
  const refresh = async () => {
    if (user?.id) await loadProfile(user.id);
  };
  reactExports.useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        setTimeout(() => loadProfile(newSession.user.id), 0);
      } else {
        setProfile(null);
        setIsAdmin(false);
        setIsPartner(false);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        loadProfile(data.session.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    setIsPartner(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AuthContext.Provider,
    {
      value: {
        isAuthenticated: !!session,
        isLoading,
        user,
        session,
        profile,
        isAdmin,
        isPartner,
        refresh,
        signOut
      },
      children
    }
  );
}
function useAuth() {
  const ctx = reactExports.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
function __insertCSS(code) {
  if (typeof document == "undefined") return;
  let head = document.head || document.getElementsByTagName("head")[0];
  let style = document.createElement("style");
  style.type = "text/css";
  head.appendChild(style);
  style.styleSheet ? style.styleSheet.cssText = code : style.appendChild(document.createTextNode(code));
}
const getAsset = (type) => {
  switch (type) {
    case "success":
      return SuccessIcon;
    case "info":
      return InfoIcon;
    case "warning":
      return WarningIcon;
    case "error":
      return ErrorIcon;
    default:
      return null;
  }
};
const bars = Array(12).fill(0);
const Loader = ({ visible, className }) => {
  return /* @__PURE__ */ React2.createElement("div", {
    className: [
      "sonner-loading-wrapper",
      className
    ].filter(Boolean).join(" "),
    "data-visible": visible
  }, /* @__PURE__ */ React2.createElement("div", {
    className: "sonner-spinner"
  }, bars.map((_, i) => /* @__PURE__ */ React2.createElement("div", {
    className: "sonner-loading-bar",
    key: `spinner-bar-${i}`
  }))));
};
const SuccessIcon = /* @__PURE__ */ React2.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
}, /* @__PURE__ */ React2.createElement("path", {
  fillRule: "evenodd",
  d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
  clipRule: "evenodd"
}));
const WarningIcon = /* @__PURE__ */ React2.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "currentColor",
  height: "20",
  width: "20"
}, /* @__PURE__ */ React2.createElement("path", {
  fillRule: "evenodd",
  d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
  clipRule: "evenodd"
}));
const InfoIcon = /* @__PURE__ */ React2.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
}, /* @__PURE__ */ React2.createElement("path", {
  fillRule: "evenodd",
  d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
  clipRule: "evenodd"
}));
const ErrorIcon = /* @__PURE__ */ React2.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
}, /* @__PURE__ */ React2.createElement("path", {
  fillRule: "evenodd",
  d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
  clipRule: "evenodd"
}));
const CloseIcon = /* @__PURE__ */ React2.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /* @__PURE__ */ React2.createElement("line", {
  x1: "18",
  y1: "6",
  x2: "6",
  y2: "18"
}), /* @__PURE__ */ React2.createElement("line", {
  x1: "6",
  y1: "6",
  x2: "18",
  y2: "18"
}));
const useIsDocumentHidden = () => {
  const [isDocumentHidden, setIsDocumentHidden] = React2.useState(document.hidden);
  React2.useEffect(() => {
    const callback = () => {
      setIsDocumentHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", callback);
    return () => window.removeEventListener("visibilitychange", callback);
  }, []);
  return isDocumentHidden;
};
let toastsCounter = 1;
class Observer {
  constructor() {
    this.subscribe = (subscriber) => {
      this.subscribers.push(subscriber);
      return () => {
        const index = this.subscribers.indexOf(subscriber);
        this.subscribers.splice(index, 1);
      };
    };
    this.publish = (data) => {
      this.subscribers.forEach((subscriber) => subscriber(data));
    };
    this.addToast = (data) => {
      this.publish(data);
      this.toasts = [
        ...this.toasts,
        data
      ];
    };
    this.create = (data) => {
      var _data_id;
      const { message, ...rest } = data;
      const id = typeof (data == null ? void 0 : data.id) === "number" || ((_data_id = data.id) == null ? void 0 : _data_id.length) > 0 ? data.id : toastsCounter++;
      const alreadyExists = this.toasts.find((toast2) => {
        return toast2.id === id;
      });
      const dismissible = data.dismissible === void 0 ? true : data.dismissible;
      if (this.dismissedToasts.has(id)) {
        this.dismissedToasts.delete(id);
      }
      if (alreadyExists) {
        this.toasts = this.toasts.map((toast2) => {
          if (toast2.id === id) {
            this.publish({
              ...toast2,
              ...data,
              id,
              title: message
            });
            return {
              ...toast2,
              ...data,
              id,
              dismissible,
              title: message
            };
          }
          return toast2;
        });
      } else {
        this.addToast({
          title: message,
          ...rest,
          dismissible,
          id
        });
      }
      return id;
    };
    this.dismiss = (id) => {
      if (id) {
        this.dismissedToasts.add(id);
        requestAnimationFrame(() => this.subscribers.forEach((subscriber) => subscriber({
          id,
          dismiss: true
        })));
      } else {
        this.toasts.forEach((toast2) => {
          this.subscribers.forEach((subscriber) => subscriber({
            id: toast2.id,
            dismiss: true
          }));
        });
      }
      return id;
    };
    this.message = (message, data) => {
      return this.create({
        ...data,
        message
      });
    };
    this.error = (message, data) => {
      return this.create({
        ...data,
        message,
        type: "error"
      });
    };
    this.success = (message, data) => {
      return this.create({
        ...data,
        type: "success",
        message
      });
    };
    this.info = (message, data) => {
      return this.create({
        ...data,
        type: "info",
        message
      });
    };
    this.warning = (message, data) => {
      return this.create({
        ...data,
        type: "warning",
        message
      });
    };
    this.loading = (message, data) => {
      return this.create({
        ...data,
        type: "loading",
        message
      });
    };
    this.promise = (promise, data) => {
      if (!data) {
        return;
      }
      let id = void 0;
      if (data.loading !== void 0) {
        id = this.create({
          ...data,
          promise,
          type: "loading",
          message: data.loading,
          description: typeof data.description !== "function" ? data.description : void 0
        });
      }
      const p = Promise.resolve(promise instanceof Function ? promise() : promise);
      let shouldDismiss = id !== void 0;
      let result;
      const originalPromise = p.then(async (response) => {
        result = [
          "resolve",
          response
        ];
        const isReactElementResponse = React2.isValidElement(response);
        if (isReactElementResponse) {
          shouldDismiss = false;
          this.create({
            id,
            type: "default",
            message: response
          });
        } else if (isHttpResponse(response) && !response.ok) {
          shouldDismiss = false;
          const promiseData = typeof data.error === "function" ? await data.error(`HTTP error! status: ${response.status}`) : data.error;
          const description = typeof data.description === "function" ? await data.description(`HTTP error! status: ${response.status}`) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !React2.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id,
            type: "error",
            description,
            ...toastSettings
          });
        } else if (response instanceof Error) {
          shouldDismiss = false;
          const promiseData = typeof data.error === "function" ? await data.error(response) : data.error;
          const description = typeof data.description === "function" ? await data.description(response) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !React2.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id,
            type: "error",
            description,
            ...toastSettings
          });
        } else if (data.success !== void 0) {
          shouldDismiss = false;
          const promiseData = typeof data.success === "function" ? await data.success(response) : data.success;
          const description = typeof data.description === "function" ? await data.description(response) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !React2.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id,
            type: "success",
            description,
            ...toastSettings
          });
        }
      }).catch(async (error) => {
        result = [
          "reject",
          error
        ];
        if (data.error !== void 0) {
          shouldDismiss = false;
          const promiseData = typeof data.error === "function" ? await data.error(error) : data.error;
          const description = typeof data.description === "function" ? await data.description(error) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !React2.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id,
            type: "error",
            description,
            ...toastSettings
          });
        }
      }).finally(() => {
        if (shouldDismiss) {
          this.dismiss(id);
          id = void 0;
        }
        data.finally == null ? void 0 : data.finally.call(data);
      });
      const unwrap = () => new Promise((resolve, reject) => originalPromise.then(() => result[0] === "reject" ? reject(result[1]) : resolve(result[1])).catch(reject));
      if (typeof id !== "string" && typeof id !== "number") {
        return {
          unwrap
        };
      } else {
        return Object.assign(id, {
          unwrap
        });
      }
    };
    this.custom = (jsx, data) => {
      const id = (data == null ? void 0 : data.id) || toastsCounter++;
      this.create({
        jsx: jsx(id),
        id,
        ...data
      });
      return id;
    };
    this.getActiveToasts = () => {
      return this.toasts.filter((toast2) => !this.dismissedToasts.has(toast2.id));
    };
    this.subscribers = [];
    this.toasts = [];
    this.dismissedToasts = /* @__PURE__ */ new Set();
  }
}
const ToastState = new Observer();
const toastFunction = (message, data) => {
  const id = (data == null ? void 0 : data.id) || toastsCounter++;
  ToastState.addToast({
    title: message,
    ...data,
    id
  });
  return id;
};
const isHttpResponse = (data) => {
  return data && typeof data === "object" && "ok" in data && typeof data.ok === "boolean" && "status" in data && typeof data.status === "number";
};
const basicToast = toastFunction;
const getHistory = () => ToastState.toasts;
const getToasts = () => ToastState.getActiveToasts();
const toast = Object.assign(basicToast, {
  success: ToastState.success,
  info: ToastState.info,
  warning: ToastState.warning,
  error: ToastState.error,
  custom: ToastState.custom,
  message: ToastState.message,
  promise: ToastState.promise,
  dismiss: ToastState.dismiss,
  loading: ToastState.loading
}, {
  getHistory,
  getToasts
});
__insertCSS("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");
function isAction(action) {
  return action.label !== void 0;
}
const VISIBLE_TOASTS_AMOUNT = 3;
const VIEWPORT_OFFSET = "24px";
const MOBILE_VIEWPORT_OFFSET = "16px";
const TOAST_LIFETIME = 4e3;
const TOAST_WIDTH = 356;
const GAP = 14;
const SWIPE_THRESHOLD = 45;
const TIME_BEFORE_UNMOUNT = 200;
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
function getDefaultSwipeDirections(position) {
  const [y, x] = position.split("-");
  const directions = [];
  if (y) {
    directions.push(y);
  }
  if (x) {
    directions.push(x);
  }
  return directions;
}
const Toast = (props) => {
  var _toast_classNames, _toast_classNames1, _toast_classNames2, _toast_classNames3, _toast_classNames4, _toast_classNames5, _toast_classNames6, _toast_classNames7, _toast_classNames8;
  const { invert: ToasterInvert, toast: toast2, unstyled, interacting, setHeights, visibleToasts, heights, index, toasts, expanded, removeToast, defaultRichColors, closeButton: closeButtonFromToaster, style, cancelButtonStyle, actionButtonStyle, className = "", descriptionClassName = "", duration: durationFromToaster, position, gap, expandByDefault, classNames, icons, closeButtonAriaLabel = "Close toast" } = props;
  const [swipeDirection, setSwipeDirection] = React2.useState(null);
  const [swipeOutDirection, setSwipeOutDirection] = React2.useState(null);
  const [mounted, setMounted] = React2.useState(false);
  const [removed, setRemoved] = React2.useState(false);
  const [swiping, setSwiping] = React2.useState(false);
  const [swipeOut, setSwipeOut] = React2.useState(false);
  const [isSwiped, setIsSwiped] = React2.useState(false);
  const [offsetBeforeRemove, setOffsetBeforeRemove] = React2.useState(0);
  const [initialHeight, setInitialHeight] = React2.useState(0);
  const remainingTime = React2.useRef(toast2.duration || durationFromToaster || TOAST_LIFETIME);
  const dragStartTime = React2.useRef(null);
  const toastRef = React2.useRef(null);
  const isFront = index === 0;
  const isVisible = index + 1 <= visibleToasts;
  const toastType = toast2.type;
  const dismissible = toast2.dismissible !== false;
  const toastClassname = toast2.className || "";
  const toastDescriptionClassname = toast2.descriptionClassName || "";
  const heightIndex = React2.useMemo(() => heights.findIndex((height) => height.toastId === toast2.id) || 0, [
    heights,
    toast2.id
  ]);
  const closeButton = React2.useMemo(() => {
    var _toast_closeButton;
    return (_toast_closeButton = toast2.closeButton) != null ? _toast_closeButton : closeButtonFromToaster;
  }, [
    toast2.closeButton,
    closeButtonFromToaster
  ]);
  const duration = React2.useMemo(() => toast2.duration || durationFromToaster || TOAST_LIFETIME, [
    toast2.duration,
    durationFromToaster
  ]);
  const closeTimerStartTimeRef = React2.useRef(0);
  const offset = React2.useRef(0);
  const lastCloseTimerStartTimeRef = React2.useRef(0);
  const pointerStartRef = React2.useRef(null);
  const [y, x] = position.split("-");
  const toastsHeightBefore = React2.useMemo(() => {
    return heights.reduce((prev, curr, reducerIndex) => {
      if (reducerIndex >= heightIndex) {
        return prev;
      }
      return prev + curr.height;
    }, 0);
  }, [
    heights,
    heightIndex
  ]);
  const isDocumentHidden = useIsDocumentHidden();
  const invert = toast2.invert || ToasterInvert;
  const disabled = toastType === "loading";
  offset.current = React2.useMemo(() => heightIndex * gap + toastsHeightBefore, [
    heightIndex,
    toastsHeightBefore
  ]);
  React2.useEffect(() => {
    remainingTime.current = duration;
  }, [
    duration
  ]);
  React2.useEffect(() => {
    setMounted(true);
  }, []);
  React2.useEffect(() => {
    const toastNode = toastRef.current;
    if (toastNode) {
      const height = toastNode.getBoundingClientRect().height;
      setInitialHeight(height);
      setHeights((h) => [
        {
          toastId: toast2.id,
          height,
          position: toast2.position
        },
        ...h
      ]);
      return () => setHeights((h) => h.filter((height2) => height2.toastId !== toast2.id));
    }
  }, [
    setHeights,
    toast2.id
  ]);
  React2.useLayoutEffect(() => {
    if (!mounted) return;
    const toastNode = toastRef.current;
    const originalHeight = toastNode.style.height;
    toastNode.style.height = "auto";
    const newHeight = toastNode.getBoundingClientRect().height;
    toastNode.style.height = originalHeight;
    setInitialHeight(newHeight);
    setHeights((heights2) => {
      const alreadyExists = heights2.find((height) => height.toastId === toast2.id);
      if (!alreadyExists) {
        return [
          {
            toastId: toast2.id,
            height: newHeight,
            position: toast2.position
          },
          ...heights2
        ];
      } else {
        return heights2.map((height) => height.toastId === toast2.id ? {
          ...height,
          height: newHeight
        } : height);
      }
    });
  }, [
    mounted,
    toast2.title,
    toast2.description,
    setHeights,
    toast2.id,
    toast2.jsx,
    toast2.action,
    toast2.cancel
  ]);
  const deleteToast = React2.useCallback(() => {
    setRemoved(true);
    setOffsetBeforeRemove(offset.current);
    setHeights((h) => h.filter((height) => height.toastId !== toast2.id));
    setTimeout(() => {
      removeToast(toast2);
    }, TIME_BEFORE_UNMOUNT);
  }, [
    toast2,
    removeToast,
    setHeights,
    offset
  ]);
  React2.useEffect(() => {
    if (toast2.promise && toastType === "loading" || toast2.duration === Infinity || toast2.type === "loading") return;
    let timeoutId;
    const pauseTimer = () => {
      if (lastCloseTimerStartTimeRef.current < closeTimerStartTimeRef.current) {
        const elapsedTime = (/* @__PURE__ */ new Date()).getTime() - closeTimerStartTimeRef.current;
        remainingTime.current = remainingTime.current - elapsedTime;
      }
      lastCloseTimerStartTimeRef.current = (/* @__PURE__ */ new Date()).getTime();
    };
    const startTimer = () => {
      if (remainingTime.current === Infinity) return;
      closeTimerStartTimeRef.current = (/* @__PURE__ */ new Date()).getTime();
      timeoutId = setTimeout(() => {
        toast2.onAutoClose == null ? void 0 : toast2.onAutoClose.call(toast2, toast2);
        deleteToast();
      }, remainingTime.current);
    };
    if (expanded || interacting || isDocumentHidden) {
      pauseTimer();
    } else {
      startTimer();
    }
    return () => clearTimeout(timeoutId);
  }, [
    expanded,
    interacting,
    toast2,
    toastType,
    isDocumentHidden,
    deleteToast
  ]);
  React2.useEffect(() => {
    if (toast2.delete) {
      deleteToast();
      toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
    }
  }, [
    deleteToast,
    toast2.delete
  ]);
  function getLoadingIcon() {
    var _toast_classNames9;
    if (icons == null ? void 0 : icons.loading) {
      var _toast_classNames12;
      return /* @__PURE__ */ React2.createElement("div", {
        className: cn(classNames == null ? void 0 : classNames.loader, toast2 == null ? void 0 : (_toast_classNames12 = toast2.classNames) == null ? void 0 : _toast_classNames12.loader, "sonner-loader"),
        "data-visible": toastType === "loading"
      }, icons.loading);
    }
    return /* @__PURE__ */ React2.createElement(Loader, {
      className: cn(classNames == null ? void 0 : classNames.loader, toast2 == null ? void 0 : (_toast_classNames9 = toast2.classNames) == null ? void 0 : _toast_classNames9.loader),
      visible: toastType === "loading"
    });
  }
  const icon = toast2.icon || (icons == null ? void 0 : icons[toastType]) || getAsset(toastType);
  var _toast_richColors, _icons_close;
  return /* @__PURE__ */ React2.createElement("li", {
    tabIndex: 0,
    ref: toastRef,
    className: cn(className, toastClassname, classNames == null ? void 0 : classNames.toast, toast2 == null ? void 0 : (_toast_classNames = toast2.classNames) == null ? void 0 : _toast_classNames.toast, classNames == null ? void 0 : classNames.default, classNames == null ? void 0 : classNames[toastType], toast2 == null ? void 0 : (_toast_classNames1 = toast2.classNames) == null ? void 0 : _toast_classNames1[toastType]),
    "data-sonner-toast": "",
    "data-rich-colors": (_toast_richColors = toast2.richColors) != null ? _toast_richColors : defaultRichColors,
    "data-styled": !Boolean(toast2.jsx || toast2.unstyled || unstyled),
    "data-mounted": mounted,
    "data-promise": Boolean(toast2.promise),
    "data-swiped": isSwiped,
    "data-removed": removed,
    "data-visible": isVisible,
    "data-y-position": y,
    "data-x-position": x,
    "data-index": index,
    "data-front": isFront,
    "data-swiping": swiping,
    "data-dismissible": dismissible,
    "data-type": toastType,
    "data-invert": invert,
    "data-swipe-out": swipeOut,
    "data-swipe-direction": swipeOutDirection,
    "data-expanded": Boolean(expanded || expandByDefault && mounted),
    "data-testid": toast2.testId,
    style: {
      "--index": index,
      "--toasts-before": index,
      "--z-index": toasts.length - index,
      "--offset": `${removed ? offsetBeforeRemove : offset.current}px`,
      "--initial-height": expandByDefault ? "auto" : `${initialHeight}px`,
      ...style,
      ...toast2.style
    },
    onDragEnd: () => {
      setSwiping(false);
      setSwipeDirection(null);
      pointerStartRef.current = null;
    },
    onPointerDown: (event) => {
      if (event.button === 2) return;
      if (disabled || !dismissible) return;
      dragStartTime.current = /* @__PURE__ */ new Date();
      setOffsetBeforeRemove(offset.current);
      event.target.setPointerCapture(event.pointerId);
      if (event.target.tagName === "BUTTON") return;
      setSwiping(true);
      pointerStartRef.current = {
        x: event.clientX,
        y: event.clientY
      };
    },
    onPointerUp: () => {
      var _toastRef_current, _toastRef_current1, _dragStartTime_current;
      if (swipeOut || !dismissible) return;
      pointerStartRef.current = null;
      const swipeAmountX = Number(((_toastRef_current = toastRef.current) == null ? void 0 : _toastRef_current.style.getPropertyValue("--swipe-amount-x").replace("px", "")) || 0);
      const swipeAmountY = Number(((_toastRef_current1 = toastRef.current) == null ? void 0 : _toastRef_current1.style.getPropertyValue("--swipe-amount-y").replace("px", "")) || 0);
      const timeTaken = (/* @__PURE__ */ new Date()).getTime() - ((_dragStartTime_current = dragStartTime.current) == null ? void 0 : _dragStartTime_current.getTime());
      const swipeAmount = swipeDirection === "x" ? swipeAmountX : swipeAmountY;
      const velocity = Math.abs(swipeAmount) / timeTaken;
      if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
        setOffsetBeforeRemove(offset.current);
        toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
        if (swipeDirection === "x") {
          setSwipeOutDirection(swipeAmountX > 0 ? "right" : "left");
        } else {
          setSwipeOutDirection(swipeAmountY > 0 ? "down" : "up");
        }
        deleteToast();
        setSwipeOut(true);
        return;
      } else {
        var _toastRef_current2, _toastRef_current3;
        (_toastRef_current2 = toastRef.current) == null ? void 0 : _toastRef_current2.style.setProperty("--swipe-amount-x", `0px`);
        (_toastRef_current3 = toastRef.current) == null ? void 0 : _toastRef_current3.style.setProperty("--swipe-amount-y", `0px`);
      }
      setIsSwiped(false);
      setSwiping(false);
      setSwipeDirection(null);
    },
    onPointerMove: (event) => {
      var _window_getSelection, _toastRef_current, _toastRef_current1;
      if (!pointerStartRef.current || !dismissible) return;
      const isHighlighted = ((_window_getSelection = window.getSelection()) == null ? void 0 : _window_getSelection.toString().length) > 0;
      if (isHighlighted) return;
      const yDelta = event.clientY - pointerStartRef.current.y;
      const xDelta = event.clientX - pointerStartRef.current.x;
      var _props_swipeDirections;
      const swipeDirections = (_props_swipeDirections = props.swipeDirections) != null ? _props_swipeDirections : getDefaultSwipeDirections(position);
      if (!swipeDirection && (Math.abs(xDelta) > 1 || Math.abs(yDelta) > 1)) {
        setSwipeDirection(Math.abs(xDelta) > Math.abs(yDelta) ? "x" : "y");
      }
      let swipeAmount = {
        x: 0,
        y: 0
      };
      const getDampening = (delta) => {
        const factor = Math.abs(delta) / 20;
        return 1 / (1.5 + factor);
      };
      if (swipeDirection === "y") {
        if (swipeDirections.includes("top") || swipeDirections.includes("bottom")) {
          if (swipeDirections.includes("top") && yDelta < 0 || swipeDirections.includes("bottom") && yDelta > 0) {
            swipeAmount.y = yDelta;
          } else {
            const dampenedDelta = yDelta * getDampening(yDelta);
            swipeAmount.y = Math.abs(dampenedDelta) < Math.abs(yDelta) ? dampenedDelta : yDelta;
          }
        }
      } else if (swipeDirection === "x") {
        if (swipeDirections.includes("left") || swipeDirections.includes("right")) {
          if (swipeDirections.includes("left") && xDelta < 0 || swipeDirections.includes("right") && xDelta > 0) {
            swipeAmount.x = xDelta;
          } else {
            const dampenedDelta = xDelta * getDampening(xDelta);
            swipeAmount.x = Math.abs(dampenedDelta) < Math.abs(xDelta) ? dampenedDelta : xDelta;
          }
        }
      }
      if (Math.abs(swipeAmount.x) > 0 || Math.abs(swipeAmount.y) > 0) {
        setIsSwiped(true);
      }
      (_toastRef_current = toastRef.current) == null ? void 0 : _toastRef_current.style.setProperty("--swipe-amount-x", `${swipeAmount.x}px`);
      (_toastRef_current1 = toastRef.current) == null ? void 0 : _toastRef_current1.style.setProperty("--swipe-amount-y", `${swipeAmount.y}px`);
    }
  }, closeButton && !toast2.jsx && toastType !== "loading" ? /* @__PURE__ */ React2.createElement("button", {
    "aria-label": closeButtonAriaLabel,
    "data-disabled": disabled,
    "data-close-button": true,
    onClick: disabled || !dismissible ? () => {
    } : () => {
      deleteToast();
      toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
    },
    className: cn(classNames == null ? void 0 : classNames.closeButton, toast2 == null ? void 0 : (_toast_classNames2 = toast2.classNames) == null ? void 0 : _toast_classNames2.closeButton)
  }, (_icons_close = icons == null ? void 0 : icons.close) != null ? _icons_close : CloseIcon) : null, (toastType || toast2.icon || toast2.promise) && toast2.icon !== null && ((icons == null ? void 0 : icons[toastType]) !== null || toast2.icon) ? /* @__PURE__ */ React2.createElement("div", {
    "data-icon": "",
    className: cn(classNames == null ? void 0 : classNames.icon, toast2 == null ? void 0 : (_toast_classNames3 = toast2.classNames) == null ? void 0 : _toast_classNames3.icon)
  }, toast2.promise || toast2.type === "loading" && !toast2.icon ? toast2.icon || getLoadingIcon() : null, toast2.type !== "loading" ? icon : null) : null, /* @__PURE__ */ React2.createElement("div", {
    "data-content": "",
    className: cn(classNames == null ? void 0 : classNames.content, toast2 == null ? void 0 : (_toast_classNames4 = toast2.classNames) == null ? void 0 : _toast_classNames4.content)
  }, /* @__PURE__ */ React2.createElement("div", {
    "data-title": "",
    className: cn(classNames == null ? void 0 : classNames.title, toast2 == null ? void 0 : (_toast_classNames5 = toast2.classNames) == null ? void 0 : _toast_classNames5.title)
  }, toast2.jsx ? toast2.jsx : typeof toast2.title === "function" ? toast2.title() : toast2.title), toast2.description ? /* @__PURE__ */ React2.createElement("div", {
    "data-description": "",
    className: cn(descriptionClassName, toastDescriptionClassname, classNames == null ? void 0 : classNames.description, toast2 == null ? void 0 : (_toast_classNames6 = toast2.classNames) == null ? void 0 : _toast_classNames6.description)
  }, typeof toast2.description === "function" ? toast2.description() : toast2.description) : null), /* @__PURE__ */ React2.isValidElement(toast2.cancel) ? toast2.cancel : toast2.cancel && isAction(toast2.cancel) ? /* @__PURE__ */ React2.createElement("button", {
    "data-button": true,
    "data-cancel": true,
    style: toast2.cancelButtonStyle || cancelButtonStyle,
    onClick: (event) => {
      if (!isAction(toast2.cancel)) return;
      if (!dismissible) return;
      toast2.cancel.onClick == null ? void 0 : toast2.cancel.onClick.call(toast2.cancel, event);
      deleteToast();
    },
    className: cn(classNames == null ? void 0 : classNames.cancelButton, toast2 == null ? void 0 : (_toast_classNames7 = toast2.classNames) == null ? void 0 : _toast_classNames7.cancelButton)
  }, toast2.cancel.label) : null, /* @__PURE__ */ React2.isValidElement(toast2.action) ? toast2.action : toast2.action && isAction(toast2.action) ? /* @__PURE__ */ React2.createElement("button", {
    "data-button": true,
    "data-action": true,
    style: toast2.actionButtonStyle || actionButtonStyle,
    onClick: (event) => {
      if (!isAction(toast2.action)) return;
      toast2.action.onClick == null ? void 0 : toast2.action.onClick.call(toast2.action, event);
      if (event.defaultPrevented) return;
      deleteToast();
    },
    className: cn(classNames == null ? void 0 : classNames.actionButton, toast2 == null ? void 0 : (_toast_classNames8 = toast2.classNames) == null ? void 0 : _toast_classNames8.actionButton)
  }, toast2.action.label) : null);
};
function getDocumentDirection() {
  if (typeof window === "undefined") return "ltr";
  if (typeof document === "undefined") return "ltr";
  const dirAttribute = document.documentElement.getAttribute("dir");
  if (dirAttribute === "auto" || !dirAttribute) {
    return window.getComputedStyle(document.documentElement).direction;
  }
  return dirAttribute;
}
function assignOffset(defaultOffset, mobileOffset) {
  const styles = {};
  [
    defaultOffset,
    mobileOffset
  ].forEach((offset, index) => {
    const isMobile = index === 1;
    const prefix = isMobile ? "--mobile-offset" : "--offset";
    const defaultValue = isMobile ? MOBILE_VIEWPORT_OFFSET : VIEWPORT_OFFSET;
    function assignAll(offset2) {
      [
        "top",
        "right",
        "bottom",
        "left"
      ].forEach((key) => {
        styles[`${prefix}-${key}`] = typeof offset2 === "number" ? `${offset2}px` : offset2;
      });
    }
    if (typeof offset === "number" || typeof offset === "string") {
      assignAll(offset);
    } else if (typeof offset === "object") {
      [
        "top",
        "right",
        "bottom",
        "left"
      ].forEach((key) => {
        if (offset[key] === void 0) {
          styles[`${prefix}-${key}`] = defaultValue;
        } else {
          styles[`${prefix}-${key}`] = typeof offset[key] === "number" ? `${offset[key]}px` : offset[key];
        }
      });
    } else {
      assignAll(defaultValue);
    }
  });
  return styles;
}
const Toaster$1 = /* @__PURE__ */ React2.forwardRef(function Toaster(props, ref) {
  const { id, invert, position = "bottom-right", hotkey = [
    "altKey",
    "KeyT"
  ], expand, closeButton, className, offset, mobileOffset, theme = "light", richColors, duration, style, visibleToasts = VISIBLE_TOASTS_AMOUNT, toastOptions, dir = getDocumentDirection(), gap = GAP, icons, containerAriaLabel = "Notifications" } = props;
  const [toasts, setToasts] = React2.useState([]);
  const filteredToasts = React2.useMemo(() => {
    if (id) {
      return toasts.filter((toast2) => toast2.toasterId === id);
    }
    return toasts.filter((toast2) => !toast2.toasterId);
  }, [
    toasts,
    id
  ]);
  const possiblePositions = React2.useMemo(() => {
    return Array.from(new Set([
      position
    ].concat(filteredToasts.filter((toast2) => toast2.position).map((toast2) => toast2.position))));
  }, [
    filteredToasts,
    position
  ]);
  const [heights, setHeights] = React2.useState([]);
  const [expanded, setExpanded] = React2.useState(false);
  const [interacting, setInteracting] = React2.useState(false);
  const [actualTheme, setActualTheme] = React2.useState(theme !== "system" ? theme : typeof window !== "undefined" ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : "light");
  const listRef = React2.useRef(null);
  const hotkeyLabel = hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
  const lastFocusedElementRef = React2.useRef(null);
  const isFocusWithinRef = React2.useRef(false);
  const removeToast = React2.useCallback((toastToRemove) => {
    setToasts((toasts2) => {
      var _toasts_find;
      if (!((_toasts_find = toasts2.find((toast2) => toast2.id === toastToRemove.id)) == null ? void 0 : _toasts_find.delete)) {
        ToastState.dismiss(toastToRemove.id);
      }
      return toasts2.filter(({ id: id2 }) => id2 !== toastToRemove.id);
    });
  }, []);
  React2.useEffect(() => {
    return ToastState.subscribe((toast2) => {
      if (toast2.dismiss) {
        requestAnimationFrame(() => {
          setToasts((toasts2) => toasts2.map((t) => t.id === toast2.id ? {
            ...t,
            delete: true
          } : t));
        });
        return;
      }
      setTimeout(() => {
        ReactDOM.flushSync(() => {
          setToasts((toasts2) => {
            const indexOfExistingToast = toasts2.findIndex((t) => t.id === toast2.id);
            if (indexOfExistingToast !== -1) {
              return [
                ...toasts2.slice(0, indexOfExistingToast),
                {
                  ...toasts2[indexOfExistingToast],
                  ...toast2
                },
                ...toasts2.slice(indexOfExistingToast + 1)
              ];
            }
            return [
              toast2,
              ...toasts2
            ];
          });
        });
      });
    });
  }, [
    toasts
  ]);
  React2.useEffect(() => {
    if (theme !== "system") {
      setActualTheme(theme);
      return;
    }
    if (theme === "system") {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setActualTheme("dark");
      } else {
        setActualTheme("light");
      }
    }
    if (typeof window === "undefined") return;
    const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    try {
      darkMediaQuery.addEventListener("change", ({ matches }) => {
        if (matches) {
          setActualTheme("dark");
        } else {
          setActualTheme("light");
        }
      });
    } catch (error) {
      darkMediaQuery.addListener(({ matches }) => {
        try {
          if (matches) {
            setActualTheme("dark");
          } else {
            setActualTheme("light");
          }
        } catch (e) {
          console.error(e);
        }
      });
    }
  }, [
    theme
  ]);
  React2.useEffect(() => {
    if (toasts.length <= 1) {
      setExpanded(false);
    }
  }, [
    toasts
  ]);
  React2.useEffect(() => {
    const handleKeyDown = (event) => {
      var _listRef_current;
      const isHotkeyPressed = hotkey.every((key) => event[key] || event.code === key);
      if (isHotkeyPressed) {
        var _listRef_current1;
        setExpanded(true);
        (_listRef_current1 = listRef.current) == null ? void 0 : _listRef_current1.focus();
      }
      if (event.code === "Escape" && (document.activeElement === listRef.current || ((_listRef_current = listRef.current) == null ? void 0 : _listRef_current.contains(document.activeElement)))) {
        setExpanded(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    hotkey
  ]);
  React2.useEffect(() => {
    if (listRef.current) {
      return () => {
        if (lastFocusedElementRef.current) {
          lastFocusedElementRef.current.focus({
            preventScroll: true
          });
          lastFocusedElementRef.current = null;
          isFocusWithinRef.current = false;
        }
      };
    }
  }, [
    listRef.current
  ]);
  return (
    // Remove item from normal navigation flow, only available via hotkey
    /* @__PURE__ */ React2.createElement("section", {
      ref,
      "aria-label": `${containerAriaLabel} ${hotkeyLabel}`,
      tabIndex: -1,
      "aria-live": "polite",
      "aria-relevant": "additions text",
      "aria-atomic": "false",
      suppressHydrationWarning: true
    }, possiblePositions.map((position2, index) => {
      var _heights_;
      const [y, x] = position2.split("-");
      if (!filteredToasts.length) return null;
      return /* @__PURE__ */ React2.createElement("ol", {
        key: position2,
        dir: dir === "auto" ? getDocumentDirection() : dir,
        tabIndex: -1,
        ref: listRef,
        className,
        "data-sonner-toaster": true,
        "data-sonner-theme": actualTheme,
        "data-y-position": y,
        "data-x-position": x,
        style: {
          "--front-toast-height": `${((_heights_ = heights[0]) == null ? void 0 : _heights_.height) || 0}px`,
          "--width": `${TOAST_WIDTH}px`,
          "--gap": `${gap}px`,
          ...style,
          ...assignOffset(offset, mobileOffset)
        },
        onBlur: (event) => {
          if (isFocusWithinRef.current && !event.currentTarget.contains(event.relatedTarget)) {
            isFocusWithinRef.current = false;
            if (lastFocusedElementRef.current) {
              lastFocusedElementRef.current.focus({
                preventScroll: true
              });
              lastFocusedElementRef.current = null;
            }
          }
        },
        onFocus: (event) => {
          const isNotDismissible = event.target instanceof HTMLElement && event.target.dataset.dismissible === "false";
          if (isNotDismissible) return;
          if (!isFocusWithinRef.current) {
            isFocusWithinRef.current = true;
            lastFocusedElementRef.current = event.relatedTarget;
          }
        },
        onMouseEnter: () => setExpanded(true),
        onMouseMove: () => setExpanded(true),
        onMouseLeave: () => {
          if (!interacting) {
            setExpanded(false);
          }
        },
        onDragEnd: () => setExpanded(false),
        onPointerDown: (event) => {
          const isNotDismissible = event.target instanceof HTMLElement && event.target.dataset.dismissible === "false";
          if (isNotDismissible) return;
          setInteracting(true);
        },
        onPointerUp: () => setInteracting(false)
      }, filteredToasts.filter((toast2) => !toast2.position && index === 0 || toast2.position === position2).map((toast2, index2) => {
        var _toastOptions_duration, _toastOptions_closeButton;
        return /* @__PURE__ */ React2.createElement(Toast, {
          key: toast2.id,
          icons,
          index: index2,
          toast: toast2,
          defaultRichColors: richColors,
          duration: (_toastOptions_duration = toastOptions == null ? void 0 : toastOptions.duration) != null ? _toastOptions_duration : duration,
          className: toastOptions == null ? void 0 : toastOptions.className,
          descriptionClassName: toastOptions == null ? void 0 : toastOptions.descriptionClassName,
          invert,
          visibleToasts,
          closeButton: (_toastOptions_closeButton = toastOptions == null ? void 0 : toastOptions.closeButton) != null ? _toastOptions_closeButton : closeButton,
          interacting,
          position: position2,
          style: toastOptions == null ? void 0 : toastOptions.style,
          unstyled: toastOptions == null ? void 0 : toastOptions.unstyled,
          classNames: toastOptions == null ? void 0 : toastOptions.classNames,
          cancelButtonStyle: toastOptions == null ? void 0 : toastOptions.cancelButtonStyle,
          actionButtonStyle: toastOptions == null ? void 0 : toastOptions.actionButtonStyle,
          closeButtonAriaLabel: toastOptions == null ? void 0 : toastOptions.closeButtonAriaLabel,
          removeToast,
          toasts: filteredToasts.filter((t) => t.position == toast2.position),
          heights: heights.filter((h) => h.position == toast2.position),
          setHeights,
          expandByDefault: expand,
          gap,
          expanded,
          swipeDirections: props.swipeDirections
        });
      }));
    }))
  );
});
const Ctx = reactExports.createContext(void 0);
const isBrowser = () => typeof window !== "undefined" && typeof Notification !== "undefined";
function showNativePush(title, body, tag) {
  if (!isBrowser()) return;
  if (Notification.permission !== "granted") return;
  if (typeof document !== "undefined" && document.visibilityState === "visible") {
    return;
  }
  try {
    const n = new Notification(title, {
      body,
      tag: tag ?? "fundedng",
      icon: "/favicon.ico"
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch {
  }
}
async function setBadge(count) {
  try {
    if ("setAppBadge" in navigator) {
      await navigator.setAppBadge(count);
    }
  } catch {
  }
}
async function clearBadge() {
  try {
    if ("clearAppBadge" in navigator) {
      await navigator.clearAppBadge();
    }
  } catch {
  }
}
async function syncBadge(userId) {
  const { count } = await supabase.from("notifications").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("is_read", false);
  if (count && count > 0) await setBadge(count);
  else await clearBadge();
}
function NotificationsProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [permission, setPermission] = reactExports.useState(
    isBrowser() ? Notification.permission : "unsupported"
  );
  const groupsRef = reactExports.useRef(/* @__PURE__ */ new Map());
  const authorsRef = reactExports.useRef(/* @__PURE__ */ new Map());
  const request = async () => {
    if (!isBrowser()) return;
    if (Notification.permission === "default") {
      const result = await Notification.requestPermission();
      setPermission(result);
    } else {
      setPermission(Notification.permission);
    }
  };
  reactExports.useEffect(() => {
    if (!user) return;
    const onShow = () => syncBadge(user.id);
    document.addEventListener("visibilitychange", onShow);
    return () => document.removeEventListener("visibilitychange", onShow);
  }, [user?.id]);
  reactExports.useEffect(() => {
    if (!isAuthenticated || !isBrowser()) return;
    if (Notification.permission === "default") {
      const t = window.setTimeout(() => {
        Notification.requestPermission().then(setPermission).catch(() => {
        });
      }, 1500);
      return () => window.clearTimeout(t);
    }
  }, [isAuthenticated]);
  reactExports.useEffect(() => {
    if (!user) return;
    syncBadge(user.id);
  }, [user?.id]);
  reactExports.useEffect(() => {
    if (!user) return;
    const channel = supabase.channel(`user-notifications:${user.id}`).on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
      (payload) => {
        const n = payload.new;
        const fn = n.type === "error" ? toast.error : n.type === "success" ? toast.success : toast;
        fn(n.title, { description: n.message });
        showNativePush(n.title, n.message, `notif:${n.id}`);
        syncBadge(user.id);
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);
  reactExports.useEffect(() => {
    if (!user) return;
    let cancelled = false;
    let channel = null;
    (async () => {
      const { data: memberships } = await supabase.from("group_members").select("group_id").eq("user_id", user.id);
      const groupIds = (memberships ?? []).map((m) => m.group_id);
      if (cancelled || groupIds.length === 0) return;
      const { data: groups } = await supabase.from("community_groups").select("id, name, slug").in("id", groupIds);
      const slugMap = /* @__PURE__ */ new Map();
      for (const g of groups ?? []) {
        groupsRef.current.set(g.id, g.name);
        slugMap.set(g.id, g.slug);
      }
      const groupSet = new Set(groupIds);
      channel = supabase.channel(`user-messages:${user.id}`).on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const m = payload.new;
          if (m.user_id === user.id) return;
          if (!groupSet.has(m.group_id)) return;
          const slug = slugMap.get(m.group_id);
          if (typeof window !== "undefined" && slug && window.location.pathname.startsWith(`/community/${slug}`)) {
            return;
          }
          let author = authorsRef.current.get(m.user_id);
          if (!author) {
            const { data: prof } = await supabase.from("profiles").select("full_name").eq("id", m.user_id).maybeSingle();
            author = prof?.full_name || "Trader";
            authorsRef.current.set(m.user_id, author);
          }
          const groupName = groupsRef.current.get(m.group_id) ?? "Group";
          const preview = m.body ? m.body.length > 120 ? m.body.slice(0, 117) + "…" : m.body : m.image_url ? "📷 Photo" : "New message";
          const title = `${author} · ${groupName}`;
          toast(title, { description: preview });
          showNativePush(title, preview, `msg:${m.group_id}`);
        }
      ).subscribe();
    })();
    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [user?.id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Ctx.Provider, { value: { permission, request }, children });
}
const Toaster2 = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const REF_KEY = "fng-ref";
const PARTNER_REF_KEY = "fng-partner-ref";
function ReferralCapture() {
  const { user } = useAuth();
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("ref");
      if (code && code.length >= 4) {
        const upper = code.toUpperCase();
        localStorage.setItem(REF_KEY, upper);
        localStorage.setItem(PARTNER_REF_KEY, upper);
        (async () => {
          try {
            await supabase.rpc("track_partner_click", {
              _code: upper,
              _ua: navigator.userAgent,
              _ref: document.referrer || void 0
            });
          } catch {
          }
        })();
      }
    } catch {
    }
  }, []);
  reactExports.useEffect(() => {
    if (!user) return;
    let code = null;
    let pcode = null;
    try {
      code = localStorage.getItem(REF_KEY);
      pcode = localStorage.getItem(PARTNER_REF_KEY);
    } catch {
    }
    if (code) {
      (async () => {
        try {
          const { data, error } = await supabase.rpc("attach_referral", { _code: code });
          if (!error && data) {
            try {
              localStorage.removeItem(REF_KEY);
            } catch {
            }
          }
        } catch {
        }
      })();
    }
    if (pcode) {
      (async () => {
        try {
          const { data, error } = await supabase.rpc("attach_partner_referral", { _code: pcode });
          if (!error && data) {
            try {
              localStorage.removeItem(PARTNER_REF_KEY);
            } catch {
            }
          }
        } catch {
        }
      })();
    }
  }, [user]);
  return null;
}
const PIXEL_ID = typeof window !== "undefined" ? "replace_with_your_pixel_id" : void 0;
function initTikTokPixel() {
  if (typeof window === "undefined" || !PIXEL_ID) return;
  if (window.ttq) return;
  const w = window;
  const ttq = w.ttq = w.ttq || [];
  ttq.methods = [
    "page",
    "track",
    "identify",
    "instances",
    "debug",
    "on",
    "off",
    "once",
    "ready",
    "alias",
    "group",
    "enableCookie",
    "disableCookie",
    "holdConsent",
    "revokeConsent",
    "grantConsent"
  ];
  ttq.setAndDefer = function(set, fn) {
    set[fn] = function() {
      set.push([fn].concat(Array.prototype.slice.call(arguments, 0)));
    };
  };
  for (let i = 0; i < ttq.methods.length; i++) {
    ttq.setAndDefer(ttq, ttq.methods[i]);
  }
  ttq.load = function(e, t) {
    const n = document.createElement("script");
    n.type = "text/javascript";
    n.async = true;
    n.src = "https://analytics.tiktok.com/i18n/pixel/static/identify_manager?v=4.0.2";
    const o = document.getElementsByTagName("script")[0];
    o?.parentNode?.insertBefore(n, o);
    ttq._t = +/* @__PURE__ */ new Date();
    ttq._p = t;
    ttq._v = "4.0.2";
    const i = "https://analytics.tiktok.com/i18n/pixel/events.js?v=4.0.2";
    ttq.load(i, t);
  };
  ttq.load("", PIXEL_ID);
}
function trackPageView(properties) {
  if (typeof window === "undefined" || !window.ttq) return;
  window.ttq.page();
  if (properties) {
    window.ttq.track("ViewContent", properties);
  }
}
function captureTtclid() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const ttclid = params.get("ttclid");
  if (ttclid) {
    try {
      localStorage.setItem("_ttclid", ttclid);
    } catch {
    }
  }
}
const appCss = "/assets/styles-Cah3U4d6.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-7xl font-bold text-primary text-glow", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 font-display text-xl font-semibold", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "This page doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
        children: "Go home"
      }
    )
  ] }) });
}
const Route$T = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FundedNG — Nigeria's Prop Trading Firm" },
      { name: "description", content: "Get funded up to ₦2,000,000. Three simple rules. Payouts within 24 hours. Trade on the FundedNG MT5 evaluation platform." },
      { property: "og:title", content: "FundedNG — Nigeria's Prop Trading Firm" },
      { property: "og:description", content: "Get funded up to ₦2,000,000. Three simple rules. Payouts within 24 hours. Trade on the FundedNG MT5 evaluation platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "FundedNG — Nigeria's Prop Trading Firm" },
      { name: "twitter:description", content: "Get funded up to ₦2,000,000. Three simple rules. Payouts within 24 hours. Trade on the FundedNG MT5 evaluation platform." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/c2a87901-c47d-47f6-b172-e1333c79d14d" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/c2a87901-c47d-47f6-b172-e1333c79d14d" }
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&family=Poppins:wght@300;400;500;600;700&family=Pinyon+Script&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("head", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "script",
        {
          dangerouslySetInnerHTML: {
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "script",
        {
          dangerouslySetInnerHTML: {
            __html: `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(t,e){var n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://analytics.tiktok.com/i18n/pixel/static/identify_manager?v=4.0.2";var o=document.getElementsByTagName("script")[0];o.parentNode.insertBefore(n,o);ttq._t=+new Date,ttq._p=e,ttq._v="4.0.2";var i="https://analytics.tiktok.com/i18n/pixel/events.js?v=4.0.2";ttq.load(i,e)};ttq.load("","${"replace_with_your_pixel_id"}");ttq.page()}(window,document,"ttq");`
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { className: "noise-overlay", children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "script",
        {
          dangerouslySetInnerHTML: {
            __html: `(function(){try{var inIframe=window.self!==window.top;var host=window.location.hostname;var isPreview=host.includes('id-preview--')||host.includes('lovableproject.com')||host.includes('lovable.dev');if((inIframe||isPreview)&&'serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister();});});}}catch(e){}})();`
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "script",
        {
          dangerouslySetInnerHTML: {
            __html: `if('serviceWorker'in navigator){navigator.serviceWorker.addEventListener('controllerchange',function(){window.location.reload()})}`
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function PageTracker() {
  const location = useLocation();
  reactExports.useEffect(() => {
    initTikTokPixel();
    captureTtclid();
    trackPageView({ content_name: location.pathname, content_type: "webpage" });
  }, [location.pathname]);
  return null;
}
function RootComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(NotificationsProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageTracker, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ReferralCapture, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster2, {})
  ] }) });
}
const $$splitComponentImporter$y = () => import("./rules-Cg5v4PA7.js");
const Route$S = createFileRoute("/rules")({
  head: () => ({
    meta: [{
      title: "Trading Rules — FundedNG"
    }, {
      name: "description",
      content: "Full breakdown of FundedNG's prop trading rules: 20% max drawdown (equity trailing), 3-minute minimum hold time with 4-warning grace, weekly activity requirement, profit targets, payouts, and what's allowed."
    }, {
      property: "og:title",
      content: "Trading Rules — FundedNG"
    }, {
      property: "og:description",
      content: "Just 3 main rules — 20% max drawdown (equity trailing), 3-minute minimum hold time with 4 warnings, and 3 days minimum trading. See the full rulebook here."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$y, "component")
});
const $$splitComponentImporter$x = () => import("./partner-apply-CP59sCdF.js");
const Route$R = createFileRoute("/partner-apply")({
  head: () => ({
    meta: [{
      charSet: "utf-8"
    }, {
      name: "viewport",
      content: "width=device-width, initial-scale=1"
    }, {
      title: "Partner Application — FundedNG"
    }, {
      name: "description",
      content: "Apply to become a FundedNG partner. Join Nigeria's fastest-growing prop trading community."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$x, "component")
});
const $$splitComponentImporter$w = () => import("./discord-BTU5dmpx.js");
const Route$Q = createFileRoute("/discord")({
  ssr: true,
  beforeLoad: () => {
    throw redirect({
      href: "https://discord.gg/FXXCGPZ6w3"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$w, "component")
});
const $$splitComponentImporter$v = () => import("./buy-BqufJ0yV.js");
const Route$P = createFileRoute("/buy")({
  validateSearch: objectType({
    challenge: stringType().optional(),
    currency: enumType(["NGN", "USD"]).optional(),
    type: enumType(["2step", "instant"]).optional(),
    size: stringType().optional()
  }),
  component: lazyRouteComponent($$splitComponentImporter$v, "component")
});
const $$splitComponentImporter$u = () => import("./agreement-VF0oD6WI.js");
const Route$O = createFileRoute("/agreement")({
  head: () => ({
    meta: [{
      title: "Trader Agreement & Risk Disclosure — FundedNG"
    }, {
      name: "description",
      content: "FundedNG terms of service, trader agreement, and risk disclosure for prop trading challenges."
    }, {
      property: "og:title",
      content: "Trader Agreement & Risk Disclosure — FundedNG"
    }, {
      property: "og:description",
      content: "Read the FundedNG terms, trader agreement, and risk disclosure before purchasing a challenge."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$u, "component")
});
const $$splitComponentImporter$t = () => import("./_authenticated-D3noNuQY.js");
const Route$N = createFileRoute("/_authenticated")({
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("./_admin-CRIMd32l.js");
const Route$M = createFileRoute("/_admin")({
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("./index-DSLK5v5-.js");
const Route$L = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("./payment.callback-BnTWjX0j.js");
const Route$K = createFileRoute("/payment/callback")({
  validateSearch: objectType({
    reference: stringType().optional(),
    trxref: stringType().optional(),
    challenge_id: stringType().optional(),
    dp: coerce.number().optional(),
    dc: stringType().optional(),
    pp: stringType().optional(),
    oa: coerce.number().optional()
  }),
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("./auth.reset-password-C9Et0K8G.js");
const Route$J = createFileRoute("/auth/reset-password")({
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./auth.register-BYgdUe62.js");
const Route$I = createFileRoute("/auth/register")({
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./auth.login-DKWn0VeU.js");
const Route$H = createFileRoute("/auth/login")({
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./auth.forgot-password-w_MTSJOT.js");
const Route$G = createFileRoute("/auth/forgot-password")({
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL;
async function sendAdminEmail(subject, bodyHtml) {
  if (!RESEND_API_KEY || !ADMIN_EMAIL) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: "FundedNG <support@fundedng.fun>",
        to: [ADMIN_EMAIL],
        subject: `[Admin] ${subject}`,
        html: bodyHtml
      })
    });
  } catch (e) {
    console.error("[account-pool] admin email failed", e);
  }
}
async function notifyAdmins(title, message) {
  const { data: adminUsers } = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "admin");
  if (!adminUsers?.length) return;
  await supabaseAdmin.from("notifications").insert(
    adminUsers.map((r) => ({
      user_id: r.user_id,
      title,
      message,
      type: "warning"
    }))
  );
}
const MAX_CLAIM_RETRIES = 10;
async function claimPoolAccount(args) {
  let lastError = "No accounts available for this size. Admin has been notified.";
  const isUsd = args.currency === "USD";
  const accountSize = isUsd ? args.accountSizeUsd : args.accountSizeNgn;
  const sizeKey = isUsd ? "account_size_usd" : "account_size_ngn";
  for (let attempt = 1; attempt <= MAX_CLAIM_RETRIES; attempt++) {
    const { data: poolRows, error: poolErr } = await supabaseAdmin.from("account_pool").select("*").eq("status", "available").eq("currency", args.currency).eq(sizeKey, accountSize).order("created_at", { ascending: true }).limit(1);
    if (poolErr) {
      console.error("[claimPoolAccount] query failed", poolErr);
      return { ok: false, error: "Pool lookup failed." };
    }
    const poolRow = poolRows?.[0];
    if (!poolRow) {
      if (attempt === 1) {
        const sizeLabel = isUsd ? `$${accountSize.toLocaleString("en-US")}` : `₦${accountSize.toLocaleString("en-NG")}`;
        const msg = `No ${sizeLabel} ${args.currency} account in pool for order ${args.orderId.slice(0, 8)}…`;
        await notifyAdmins("⚠️ Account Pool Empty", msg);
        await sendAdminEmail(
          "Account Pool Empty — Manual Delivery Needed",
          `<h2>Pool Empty</h2><p>${msg}</p><p><a href="${process.env.SITE ?? "https://fundedng.fun"}/admin">Go to Admin →</a></p>`
        );
      }
      return { ok: false, error: lastError };
    }
    const { data: updated, error: claimErr } = await supabaseAdmin.from("account_pool").update({
      status: "assigned",
      assigned_at: (/* @__PURE__ */ new Date()).toISOString(),
      assigned_order_id: args.orderId
    }).eq("id", poolRow.id).eq("status", "available").select();
    if (claimErr) {
      console.error("[claimPoolAccount] claim failed", claimErr);
      return { ok: false, error: "Failed to claim account." };
    }
    if (!updated || updated.length === 0) {
      console.warn("[claimPoolAccount] attempt %d/%d: race lost on %s, retrying…", attempt, MAX_CLAIM_RETRIES, poolRow.id);
      lastError = "Could not claim account due to high demand. Admin has been notified.";
      continue;
    }
    const { data: newAccount, error: insertErr } = await supabaseAdmin.from("trader_accounts").insert({
      user_id: args.userId,
      order_id: args.orderId,
      challenge_id: args.challengeId,
      mt5_login: poolRow.mt5_login,
      mt5_password: poolRow.mt5_password,
      investor_password: poolRow.investor_password,
      mt5_server: poolRow.mt5_server,
      provider: "pool",
      currency: args.currency,
      starting_balance: accountSize,
      current_equity: accountSize,
      current_phase: 1,
      status: "active"
    }).select("id").single();
    if (insertErr || !newAccount) {
      await supabaseAdmin.from("account_pool").update({
        status: "available",
        assigned_at: null,
        assigned_order_id: null
      }).eq("id", poolRow.id);
      console.error("[claimPoolAccount] trader_accounts insert failed", insertErr);
      return { ok: false, error: insertErr?.message ?? "Failed to create account." };
    }
    await supabaseAdmin.from("account_pool").update({ assigned_account_id: newAccount.id }).eq("id", poolRow.id);
    await supabaseAdmin.from("orders").update({ status: "delivered" }).eq("id", args.orderId);
    await supabaseAdmin.from("account_requests").upsert({
      order_id: args.orderId,
      user_id: args.userId,
      challenge_id: args.challengeId,
      status: "fulfilled",
      fulfilled_at: (/* @__PURE__ */ new Date()).toISOString(),
      claimed_by: "pool",
      provider_response: { login: poolRow.mt5_login, server: poolRow.mt5_server }
    }, {
      onConflict: "order_id",
      ignoreDuplicates: false
    }).then(({ error }) => {
      if (error) console.warn("[claimPoolAccount] account_requests upsert failed:", error.message);
    });
    await supabaseAdmin.from("notifications").insert({
      user_id: args.userId,
      title: "🎉 Your MT5 Account is Ready",
      message: `Your challenge account is active. Login: ${poolRow.mt5_login} · Server: ${poolRow.mt5_server}. Check your dashboard for the password.`,
      type: "welcome"
    });
    const { count: remaining } = await supabaseAdmin.from("account_pool").select("id", { count: "exact", head: true }).eq("status", "available").eq("currency", args.currency).eq(sizeKey, accountSize);
    if (remaining !== null && remaining <= 2) {
      const sizeLabel = isUsd ? `$${accountSize.toLocaleString("en-US")}` : `₦${accountSize.toLocaleString("en-NG")}`;
      const lowMsg = `Only ${remaining} account(s) left for size ${sizeLabel}.`;
      await notifyAdmins("⚠️ Account Pool Running Low", lowMsg);
      await sendAdminEmail(
        `Low Stock: ${sizeLabel} (${remaining} left)`,
        `<h2>Pool Low Stock</h2><p>${lowMsg}</p><p><a href="${process.env.SITE ?? "https://fundedng.fun"}/admin">Go to Admin →</a></p>`
      );
    }
    return {
      ok: true,
      accountId: newAccount.id,
      mt5Login: poolRow.mt5_login,
      mt5Password: poolRow.mt5_password,
      mt5Server: poolRow.mt5_server
    };
  }
  await notifyAdmins("⚠️ Account Pool Contention", `Exhausted retries claiming pool account for order ${args.orderId.slice(0, 8)}…`);
  return { ok: false, error: lastError };
}
const FALLBACK_RATE = 1550;
async function getUSDRate() {
  try {
    const { data: cached } = await supabaseAdmin.from("app_config").select("value").eq("key", "usd_exchange_rate").single();
    if (cached?.value) {
      return parseFloat(cached.value);
    }
    return FALLBACK_RATE;
  } catch {
    return FALLBACK_RATE;
  }
}
async function getCachedUSDRate() {
  const [{ data: cached }, { data: updatedAt }] = await Promise.all([
    supabaseAdmin.from("app_config").select("value").eq("key", "usd_exchange_rate").single(),
    supabaseAdmin.from("app_config").select("value").eq("key", "usd_rate_updated_at").single()
  ]);
  return {
    rate: cached?.value ? parseFloat(cached.value) : FALLBACK_RATE,
    updatedAt: updatedAt?.value ?? null
  };
}
async function setUSDRate(rate) {
  await supabaseAdmin.from("app_config").upsert({ key: "usd_exchange_rate", value: rate.toString() }, { onConflict: "key" });
  await supabaseAdmin.from("app_config").upsert({ key: "usd_rate_updated_at", value: (/* @__PURE__ */ new Date()).toISOString() }, { onConflict: "key" });
}
const Route$F = createFileRoute("/api/verify-payment")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get("authorization");
          const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : null;
          if (!token) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
          }
          const { data: userData, error: authErr } = await supabaseAdmin.auth.getUser(token);
          if (authErr || !userData?.user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
          }
          const userId = userData.user.id;
          const body = await request.json().catch(() => ({}));
          const reference = body.reference?.trim();
          const challengeId = body.challenge_id?.trim();
          if (!reference || !challengeId) {
            return Response.json(
              { error: "reference and challenge_id are required" },
              { status: 400 }
            );
          }
          const { data: existing } = await supabaseAdmin.from("orders").select("id, user_id").eq("paystack_reference", reference).maybeSingle();
          if (existing) {
            if (existing.user_id !== userId) {
              return Response.json(
                { error: "Payment reference already used" },
                { status: 409 }
              );
            }
            return Response.json({ ok: true, order_id: existing.id, already: true });
          }
          const squadSecret = process.env.SQUAD_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY;
          if (!squadSecret) {
            console.error("[verify-payment] SQUAD_SECRET_KEY missing");
            return Response.json(
              { error: "Payment verification is not configured" },
              { status: 500 }
            );
          }
          const squadRes = await fetch(
            `https://api-d.squadco.com/transaction/verify/${encodeURIComponent(reference)}`,
            { headers: { Authorization: `Bearer ${squadSecret}` } }
          );
          const squadJson = await squadRes.json().catch(() => ({}));
          if (!squadRes.ok || squadJson.status !== 200 || squadJson.data?.transaction_status?.toLowerCase() !== "success") {
            return Response.json(
              { error: squadJson.message ?? "Payment not successful" },
              { status: 400 }
            );
          }
          const { data: challenge, error: chErr } = await supabaseAdmin.from("challenges").select("id, name, price_naira, usd_price, currency, is_active, account_size").eq("id", challengeId).maybeSingle();
          if (chErr || !challenge) {
            return Response.json({ error: "Challenge not found" }, { status: 404 });
          }
          const orderCurrency = challenge.currency || "NGN";
          let effectivePriceNaira;
          if (orderCurrency === "USD") {
            const usdPrice = Number(challenge.usd_price || 0);
            const rate = await getUSDRate();
            effectivePriceNaira = Math.ceil(usdPrice * rate);
          } else {
            effectivePriceNaira = Number(challenge.price_naira);
          }
          const discountPercent = Math.max(0, Math.min(100, Number(body.discount_percent ?? 0) || 0));
          const discountCode = body.discount_code?.trim() || null;
          const partnerPromoCode = body.partner_promo_code?.trim() || null;
          const originalKobo = effectivePriceNaira * 100;
          const discountKobo = Math.floor(originalKobo * discountPercent / 100);
          const expectedKobo = Math.max(0, originalKobo - discountKobo);
          const paidKobo = Number(squadJson.data?.transaction_amount ?? 0);
          if (paidKobo !== expectedKobo) {
            return Response.json(
              {
                error: `Amount mismatch: expected ${expectedKobo} kobo, got ${paidKobo}`
              },
              { status: 400 }
            );
          }
          const { data: order, error: orderErr } = await supabaseAdmin.from("orders").insert({
            user_id: userId,
            challenge_id: challengeId,
            currency: orderCurrency,
            original_amount: originalKobo,
            discount_amount: discountKobo,
            discount_code: discountCode,
            discount_percent: discountPercent,
            partner_promo_code: partnerPromoCode,
            amount_paid: paidKobo,
            status: "paid",
            paystack_reference: reference
          }).select("id").single();
          if (orderErr || !order) {
            return Response.json(
              { error: orderErr?.message ?? "Order creation failed" },
              { status: 500 }
            );
          }
          if (discountCode) {
            await supabaseAdmin.rpc("increment_discount_redemption", { _code: discountCode });
          }
          const poolResult = await claimPoolAccount({
            orderId: order.id,
            accountSizeNgn: orderCurrency === "USD" ? 0 : challenge.account_size,
            accountSizeUsd: orderCurrency === "USD" ? challenge.account_size : void 0,
            currency: orderCurrency,
            challengeId: challenge.id,
            userId
          }).catch((e) => {
            console.error("[verify-payment] claimPoolAccount threw", e);
            return null;
          });
          const { data: prof } = await supabaseAdmin.from("profiles").select("full_name").eq("id", userId).maybeSingle();
          const traderName = prof?.full_name || "A trader";
          const chName = challenge.name;
          const chSize = challenge.account_size;
          if (poolResult?.ok) {
            const { data: verifyAccount } = await supabaseAdmin.from("trader_accounts").select("id").eq("order_id", order.id).maybeSingle();
            if (!verifyAccount) {
              console.error("[verify-payment] CRITICAL: pool returned ok but no trader_account found for order", order.id);
              try {
                await supabaseAdmin.rpc("send_telegram", {
                  p_message: `🚨 PROVISIONING FAILURE
Order: ${order.id}
Trader: ${traderName}
Pool returned ok but no account created. Manual delivery needed.`
                });
              } catch (_) {
              }
            } else {
              await sendEventEmail({
                type: "mt5_delivered",
                orderId: order.id,
                mt5Login: poolResult.mt5Login,
                mt5Password: poolResult.mt5Password,
                mt5Server: poolResult.mt5Server
              }).catch((e) => console.error("[verify-payment] delivery email failed", e));
              const currencySymbol2 = orderCurrency === "USD" ? "$" : "₦";
              try {
                await supabaseAdmin.rpc("send_telegram", {
                  p_message: `✅ <b>New Purchase — Auto-Delivered</b>
Trader: ${traderName}
Challenge: ${chName}
Size: ${currencySymbol2}${chSize?.toLocaleString("en-NG")}
Login: ${poolResult.mt5Login}
Server: ${poolResult.mt5Server}`
                });
              } catch (e) {
                console.error("[verify-payment] telegram send failed", e);
              }
            }
          } else {
            console.warn("[verify-payment] pool claim failed", poolResult?.error ?? "unexpected");
            try {
              await supabaseAdmin.rpc("send_telegram", {
                p_message: `⏳ <b>New Purchase — Manual Delivery Needed</b>
Trader: ${traderName}
Challenge: ${chName}
Size: ${currencySymbol}${chSize?.toLocaleString("en-NG")}
Reason: ${poolResult?.error ?? "Pool unavailable"}`
              });
            } catch (e) {
              console.error("[verify-payment] telegram send failed", e);
            }
          }
          await sendEventEmail({ type: "purchase_confirmed", orderId: order.id }).catch(
            (e) => console.error("[verify-payment] purchase email failed", e)
          );
          return Response.json({ ok: true, order_id: order.id, auto_delivered: poolResult?.ok ?? false });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Verification failed";
          console.error("[verify-payment] unexpected", msg);
          return Response.json({ error: msg }, { status: 500 });
        }
      }
    }
  }
});
const Route$E = createFileRoute("/api/verify-bank")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get("authorization");
          const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : null;
          if (!token) {
            return Response.json({ error: "Not authenticated" }, { status: 401 });
          }
          const { data: userData, error: authErr } = await supabaseAdmin.auth.getUser(token);
          if (authErr || !userData?.user) {
            return Response.json({ error: "Please sign in again" }, { status: 401 });
          }
          const userId = userData.user.id;
          const body = await request.json().catch(() => ({}));
          const bankCode = body.bank_code?.trim();
          const accountNumber = body.account_number?.replace(/\s+/g, "");
          const bankName = body.bank_name?.trim() ?? "";
          if (!bankCode || !accountNumber) {
            return Response.json({ error: "bank_code and account_number are required" }, { status: 400 });
          }
          if (!/^\d{10}$/.test(accountNumber)) {
            return Response.json({ error: "Account number must be 10 digits" }, { status: 400 });
          }
          const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
          if (!paystackSecret) {
            return Response.json({ error: "Bank verification is not configured" }, { status: 503 });
          }
          const lookupRes = await fetch("https://api.paystack.co/bank/resolve", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${paystackSecret}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ bank_code: bankCode, account_number: accountNumber })
          });
          const lookupJson = await lookupRes.json().catch(() => ({}));
          if (!lookupRes.ok || !lookupJson.status || !lookupJson.data?.account_name) {
            return Response.json({
              error: lookupJson.message || "Could not verify this account number with the bank"
            }, { status: 400 });
          }
          const returnedName = lookupJson.data.account_name;
          const { data: profile, error: profErr } = await supabaseAdmin.from("profiles").select("full_name").eq("id", userId).single();
          if (profErr || !profile?.full_name?.trim()) {
            return Response.json({ error: "No name on your account to match against" }, { status: 400 });
          }
          const registeredParts = profile.full_name.toUpperCase().trim().split(/\s+/).sort();
          const returnedParts = returnedName.toUpperCase().trim().split(/\s+/).sort();
          const isMatch = registeredParts.every(
            (part) => returnedParts.some((rp) => rp.includes(part) || part.includes(rp))
          );
          if (!isMatch) {
            return Response.json({
              error: `Name mismatch. Bank returned "${returnedName}" but your account name is "${profile.full_name}".`
            }, { status: 400 });
          }
          const { error: updErr } = await supabaseAdmin.from("profiles").update({
            kyc_verified: true,
            bank_account_number: accountNumber,
            bank_name: bankName,
            bank_account_name: returnedName
          }).eq("id", userId);
          if (updErr) {
            return Response.json({ error: updErr.message }, { status: 500 });
          }
          await supabaseAdmin.from("notifications").insert({
            user_id: userId,
            title: "✅ KYC Verified",
            message: "Your bank account was verified instantly. You can now request payouts.",
            type: "success"
          });
          await sendEventEmail({ type: "kyc_approved", userId }).catch(
            (e) => console.error("[verify-bank] email send failed", e)
          );
          return Response.json({ ok: true, account_name: returnedName });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Verification failed";
          console.error("[verify-bank] unexpected", msg);
          return Response.json({ error: msg }, { status: 500 });
        }
      }
    }
  }
});
const Route$D = createFileRoute("/api/squad-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const rawBody = await request.text();
          const payload = JSON.parse(rawBody);
          if (payload.Event !== "charge_successful" || payload.Body?.transaction_status?.toLowerCase() !== "success") {
            return Response.json({ ok: true });
          }
          const reference = payload.Body?.transaction_ref;
          if (!reference) {
            return Response.json({ ok: true });
          }
          let order = null;
          for (let attempt = 0; attempt < 5; attempt++) {
            const { data } = await supabaseAdmin.from("orders").select("id, user_id, challenge_id, status").eq("paystack_reference", reference).maybeSingle();
            if (data) {
              order = data;
              break;
            }
            await new Promise((r) => setTimeout(r, 2e3 * (attempt + 1)));
          }
          if (!order) {
            console.warn("[squad-webhook] No order found after retries for reference:", reference);
            await supabaseAdmin.rpc("send_telegram", {
              p_message: `⚠️ Webhook: no order found after retries
Ref: ${reference}
Email: ${payload.Body?.email}
Manual delivery needed.`
            }).catch(() => {
            });
            return Response.json({ ok: true });
          }
          const { data: existingAccount } = await supabaseAdmin.from("trader_accounts").select("id").eq("order_id", order.id).maybeSingle();
          if (existingAccount) {
            return Response.json({ ok: true });
          }
          const { data: challenge } = await supabaseAdmin.from("challenges").select("id, name, account_size").eq("id", order.challenge_id).maybeSingle();
          if (!challenge) {
            return Response.json({ ok: true });
          }
          const poolResult = await claimPoolAccount({
            orderId: order.id,
            accountSizeNgn: challenge.account_size,
            challengeId: challenge.id,
            userId: order.user_id
          }).catch((e) => {
            console.error("[squad-webhook] claimPoolAccount threw", e);
            return null;
          });
          const { data: prof } = await supabaseAdmin.from("profiles").select("full_name").eq("id", order.user_id).maybeSingle();
          const traderName = prof?.full_name || "A trader";
          if (poolResult?.ok) {
            await sendEventEmail({
              type: "mt5_delivered",
              orderId: order.id,
              mt5Login: poolResult.mt5Login,
              mt5Password: poolResult.mt5Password,
              mt5Server: poolResult.mt5Server
            }).catch(() => {
            });
            await supabaseAdmin.rpc("send_telegram", {
              p_message: `✅ <b>Webhook Delivery</b>
Trader: ${traderName}
Challenge: ${challenge.name}
Login: ${poolResult.mt5Login}
Server: ${poolResult.mt5Server}`
            }).catch(() => {
            });
          } else {
            await supabaseAdmin.rpc("send_telegram", {
              p_message: `⏳ <b>Webhook — Manual Delivery Needed</b>
Trader: ${traderName}
Challenge: ${challenge.name}
Order: ${order.id}
Reason: ${poolResult?.error ?? "Pool unavailable"}`
            }).catch(() => {
            });
          }
          return Response.json({ ok: true });
        } catch (e) {
          console.error("[squad-webhook] error", e);
          return Response.json({ error: "Internal error" }, { status: 500 });
        }
      }
    }
  }
});
const Route$C = createFileRoute("/api/send-email")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get("authorization");
          const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : null;
          if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
          const { data: userData, error: authErr } = await supabaseAdmin.auth.getUser(token);
          if (authErr || !userData?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
          const callerId = userData.user.id;
          const body = await request.json();
          const ev = body?.event;
          if (!ev || !ev.type) return Response.json({ error: "event required" }, { status: 400 });
          const isAdmin = async () => {
            const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", callerId);
            return !!roles?.some((r) => r.role === "admin");
          };
          switch (ev.type) {
            case "welcome":
            case "kyc_approved":
              if (ev.userId !== callerId && !await isAdmin()) {
                return Response.json({ error: "Forbidden" }, { status: 403 });
              }
              break;
            case "purchase_confirmed": {
              const { data: order } = await supabaseAdmin.from("orders").select("user_id").eq("id", ev.orderId).maybeSingle();
              if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
              if (order.user_id !== callerId && !await isAdmin()) {
                return Response.json({ error: "Forbidden" }, { status: 403 });
              }
              break;
            }
            case "payout_requested": {
              const { data: po } = await supabaseAdmin.from("payouts").select("user_id").eq("id", ev.payoutId).maybeSingle();
              if (!po) return Response.json({ error: "Payout not found" }, { status: 404 });
              if (po.user_id !== callerId && !await isAdmin()) {
                return Response.json({ error: "Forbidden" }, { status: 403 });
              }
              break;
            }
            default:
              if (!await isAdmin()) {
                return Response.json({ error: "Forbidden — admins only" }, { status: 403 });
              }
          }
          const result = await sendEventEmail(ev);
          return Response.json(result, { status: result.ok ? 200 : 500 });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "fail";
          console.error("[api.send-email] unexpected", msg);
          return Response.json({ error: msg }, { status: 500 });
        }
      }
    }
  }
});
const PROVISION_TIMEOUT_MS = 6e4;
const EQUITY_TIMEOUT_MS = 15e3;
function baseUrl() {
  const u = process.env.BOT_BASE_URL;
  if (!u) throw new Error("BOT_BASE_URL env var is not set");
  const trimmed = u.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}
function apiKey() {
  const k = process.env.BOT_API_KEY;
  if (!k) throw new Error("BOT_API_KEY env var is not set");
  return k;
}
async function withTimeout(p, ms2) {
  return await Promise.race([
    p,
    new Promise(
      (_, reject) => setTimeout(() => reject(new Error(`bot request timed out after ${ms2}ms`)), ms2)
    )
  ]);
}
async function botProvision(args) {
  const res = await withTimeout(
    fetch(`${baseUrl()}/provision`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey()}`
      },
      body: JSON.stringify({
        balanceNGN: args.balanceNGN,
        idempotencyKey: args.idempotencyKey,
        challengeName: args.challengeName
      })
    }),
    PROVISION_TIMEOUT_MS
  );
  const text = await res.text();
  if (!res.ok) throw new Error(`bot /provision ${res.status}: ${text.slice(0, 500)}`);
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`bot /provision returned non-JSON: ${text.slice(0, 200)}`);
  }
  if (!json?.login || !json?.password || !json?.server) {
    throw new Error(`bot /provision missing fields: ${text.slice(0, 200)}`);
  }
  return {
    login: String(json.login),
    password: String(json.password),
    server: String(json.server)
  };
}
async function botEquity(login) {
  const res = await withTimeout(
    fetch(`${baseUrl()}/equity/${encodeURIComponent(login)}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey()}` }
    }),
    EQUITY_TIMEOUT_MS
  );
  const text = await res.text();
  if (!res.ok) throw new Error(`bot /equity ${res.status}: ${text.slice(0, 300)}`);
  const json = JSON.parse(text);
  return {
    equity: Number(json.equity) || 0,
    balance: Number(json.balance) || 0,
    profit: Number(json.profit) || 0
  };
}
var asn1 = {};
var bn$1 = { exports: {} };
var bn = bn$1.exports;
var hasRequiredBn;
function requireBn() {
  if (hasRequiredBn) return bn$1.exports;
  hasRequiredBn = 1;
  (function(module) {
    (function(module2, exports$1) {
      function assert(val, msg) {
        if (!val) throw new Error(msg || "Assertion failed");
      }
      function inherits2(ctor, superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {
        };
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }
      function BN(number, base2, endian) {
        if (BN.isBN(number)) {
          return number;
        }
        this.negative = 0;
        this.words = null;
        this.length = 0;
        this.red = null;
        if (number !== null) {
          if (base2 === "le" || base2 === "be") {
            endian = base2;
            base2 = 10;
          }
          this._init(number || 0, base2 || 10, endian || "be");
        }
      }
      if (typeof module2 === "object") {
        module2.exports = BN;
      } else {
        exports$1.BN = BN;
      }
      BN.BN = BN;
      BN.wordSize = 26;
      var Buffer2;
      try {
        if (typeof window !== "undefined" && typeof window.Buffer !== "undefined") {
          Buffer2 = window.Buffer;
        } else {
          Buffer2 = require("buffer").Buffer;
        }
      } catch (e) {
      }
      BN.isBN = function isBN(num) {
        if (num instanceof BN) {
          return true;
        }
        return num !== null && typeof num === "object" && num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
      };
      BN.max = function max(left, right) {
        if (left.cmp(right) > 0) return left;
        return right;
      };
      BN.min = function min(left, right) {
        if (left.cmp(right) < 0) return left;
        return right;
      };
      BN.prototype._init = function init(number, base2, endian) {
        if (typeof number === "number") {
          return this._initNumber(number, base2, endian);
        }
        if (typeof number === "object") {
          return this._initArray(number, base2, endian);
        }
        if (base2 === "hex") {
          base2 = 16;
        }
        assert(base2 === (base2 | 0) && base2 >= 2 && base2 <= 36);
        number = number.toString().replace(/\s+/g, "");
        var start = 0;
        if (number[0] === "-") {
          start++;
          this.negative = 1;
        }
        if (start < number.length) {
          if (base2 === 16) {
            this._parseHex(number, start, endian);
          } else {
            this._parseBase(number, base2, start);
            if (endian === "le") {
              this._initArray(this.toArray(), base2, endian);
            }
          }
        }
      };
      BN.prototype._initNumber = function _initNumber(number, base2, endian) {
        if (number < 0) {
          this.negative = 1;
          number = -number;
        }
        if (number < 67108864) {
          this.words = [number & 67108863];
          this.length = 1;
        } else if (number < 4503599627370496) {
          this.words = [
            number & 67108863,
            number / 67108864 & 67108863
          ];
          this.length = 2;
        } else {
          assert(number < 9007199254740992);
          this.words = [
            number & 67108863,
            number / 67108864 & 67108863,
            1
          ];
          this.length = 3;
        }
        if (endian !== "le") return;
        this._initArray(this.toArray(), base2, endian);
      };
      BN.prototype._initArray = function _initArray(number, base2, endian) {
        assert(typeof number.length === "number");
        if (number.length <= 0) {
          this.words = [0];
          this.length = 1;
          return this;
        }
        this.length = Math.ceil(number.length / 3);
        this.words = new Array(this.length);
        for (var i = 0; i < this.length; i++) {
          this.words[i] = 0;
        }
        var j, w;
        var off = 0;
        if (endian === "be") {
          for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
            w = number[i] | number[i - 1] << 8 | number[i - 2] << 16;
            this.words[j] |= w << off & 67108863;
            this.words[j + 1] = w >>> 26 - off & 67108863;
            off += 24;
            if (off >= 26) {
              off -= 26;
              j++;
            }
          }
        } else if (endian === "le") {
          for (i = 0, j = 0; i < number.length; i += 3) {
            w = number[i] | number[i + 1] << 8 | number[i + 2] << 16;
            this.words[j] |= w << off & 67108863;
            this.words[j + 1] = w >>> 26 - off & 67108863;
            off += 24;
            if (off >= 26) {
              off -= 26;
              j++;
            }
          }
        }
        return this.strip();
      };
      function parseHex4Bits(string, index) {
        var c = string.charCodeAt(index);
        if (c >= 65 && c <= 70) {
          return c - 55;
        } else if (c >= 97 && c <= 102) {
          return c - 87;
        } else {
          return c - 48 & 15;
        }
      }
      function parseHexByte(string, lowerBound, index) {
        var r = parseHex4Bits(string, index);
        if (index - 1 >= lowerBound) {
          r |= parseHex4Bits(string, index - 1) << 4;
        }
        return r;
      }
      BN.prototype._parseHex = function _parseHex(number, start, endian) {
        this.length = Math.ceil((number.length - start) / 6);
        this.words = new Array(this.length);
        for (var i = 0; i < this.length; i++) {
          this.words[i] = 0;
        }
        var off = 0;
        var j = 0;
        var w;
        if (endian === "be") {
          for (i = number.length - 1; i >= start; i -= 2) {
            w = parseHexByte(number, start, i) << off;
            this.words[j] |= w & 67108863;
            if (off >= 18) {
              off -= 18;
              j += 1;
              this.words[j] |= w >>> 26;
            } else {
              off += 8;
            }
          }
        } else {
          var parseLength = number.length - start;
          for (i = parseLength % 2 === 0 ? start + 1 : start; i < number.length; i += 2) {
            w = parseHexByte(number, start, i) << off;
            this.words[j] |= w & 67108863;
            if (off >= 18) {
              off -= 18;
              j += 1;
              this.words[j] |= w >>> 26;
            } else {
              off += 8;
            }
          }
        }
        this.strip();
      };
      function parseBase(str, start, end, mul) {
        var r = 0;
        var len = Math.min(str.length, end);
        for (var i = start; i < len; i++) {
          var c = str.charCodeAt(i) - 48;
          r *= mul;
          if (c >= 49) {
            r += c - 49 + 10;
          } else if (c >= 17) {
            r += c - 17 + 10;
          } else {
            r += c;
          }
        }
        return r;
      }
      BN.prototype._parseBase = function _parseBase(number, base2, start) {
        this.words = [0];
        this.length = 1;
        for (var limbLen = 0, limbPow = 1; limbPow <= 67108863; limbPow *= base2) {
          limbLen++;
        }
        limbLen--;
        limbPow = limbPow / base2 | 0;
        var total = number.length - start;
        var mod = total % limbLen;
        var end = Math.min(total, total - mod) + start;
        var word = 0;
        for (var i = start; i < end; i += limbLen) {
          word = parseBase(number, i, i + limbLen, base2);
          this.imuln(limbPow);
          if (this.words[0] + word < 67108864) {
            this.words[0] += word;
          } else {
            this._iaddn(word);
          }
        }
        if (mod !== 0) {
          var pow = 1;
          word = parseBase(number, i, number.length, base2);
          for (i = 0; i < mod; i++) {
            pow *= base2;
          }
          this.imuln(pow);
          if (this.words[0] + word < 67108864) {
            this.words[0] += word;
          } else {
            this._iaddn(word);
          }
        }
        this.strip();
      };
      BN.prototype.copy = function copy(dest) {
        dest.words = new Array(this.length);
        for (var i = 0; i < this.length; i++) {
          dest.words[i] = this.words[i];
        }
        dest.length = this.length;
        dest.negative = this.negative;
        dest.red = this.red;
      };
      BN.prototype.clone = function clone() {
        var r = new BN(null);
        this.copy(r);
        return r;
      };
      BN.prototype._expand = function _expand(size) {
        while (this.length < size) {
          this.words[this.length++] = 0;
        }
        return this;
      };
      BN.prototype.strip = function strip() {
        while (this.length > 1 && this.words[this.length - 1] === 0) {
          this.length--;
        }
        return this._normSign();
      };
      BN.prototype._normSign = function _normSign() {
        if (this.length === 1 && this.words[0] === 0) {
          this.negative = 0;
        }
        return this;
      };
      BN.prototype.inspect = function inspect() {
        return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
      };
      var zeros = [
        "",
        "0",
        "00",
        "000",
        "0000",
        "00000",
        "000000",
        "0000000",
        "00000000",
        "000000000",
        "0000000000",
        "00000000000",
        "000000000000",
        "0000000000000",
        "00000000000000",
        "000000000000000",
        "0000000000000000",
        "00000000000000000",
        "000000000000000000",
        "0000000000000000000",
        "00000000000000000000",
        "000000000000000000000",
        "0000000000000000000000",
        "00000000000000000000000",
        "000000000000000000000000",
        "0000000000000000000000000"
      ];
      var groupSizes = [
        0,
        0,
        25,
        16,
        12,
        11,
        10,
        9,
        8,
        8,
        7,
        7,
        7,
        7,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5
      ];
      var groupBases = [
        0,
        0,
        33554432,
        43046721,
        16777216,
        48828125,
        60466176,
        40353607,
        16777216,
        43046721,
        1e7,
        19487171,
        35831808,
        62748517,
        7529536,
        11390625,
        16777216,
        24137569,
        34012224,
        47045881,
        64e6,
        4084101,
        5153632,
        6436343,
        7962624,
        9765625,
        11881376,
        14348907,
        17210368,
        20511149,
        243e5,
        28629151,
        33554432,
        39135393,
        45435424,
        52521875,
        60466176
      ];
      BN.prototype.toString = function toString(base2, padding) {
        base2 = base2 || 10;
        padding = padding | 0 || 1;
        var out;
        if (base2 === 16 || base2 === "hex") {
          out = "";
          var off = 0;
          var carry = 0;
          for (var i = 0; i < this.length; i++) {
            var w = this.words[i];
            var word = ((w << off | carry) & 16777215).toString(16);
            carry = w >>> 24 - off & 16777215;
            off += 2;
            if (off >= 26) {
              off -= 26;
              i--;
            }
            if (carry !== 0 || i !== this.length - 1) {
              out = zeros[6 - word.length] + word + out;
            } else {
              out = word + out;
            }
          }
          if (carry !== 0) {
            out = carry.toString(16) + out;
          }
          while (out.length % padding !== 0) {
            out = "0" + out;
          }
          if (this.negative !== 0) {
            out = "-" + out;
          }
          return out;
        }
        if (base2 === (base2 | 0) && base2 >= 2 && base2 <= 36) {
          var groupSize = groupSizes[base2];
          var groupBase = groupBases[base2];
          out = "";
          var c = this.clone();
          c.negative = 0;
          while (!c.isZero()) {
            var r = c.modn(groupBase).toString(base2);
            c = c.idivn(groupBase);
            if (!c.isZero()) {
              out = zeros[groupSize - r.length] + r + out;
            } else {
              out = r + out;
            }
          }
          if (this.isZero()) {
            out = "0" + out;
          }
          while (out.length % padding !== 0) {
            out = "0" + out;
          }
          if (this.negative !== 0) {
            out = "-" + out;
          }
          return out;
        }
        assert(false, "Base should be between 2 and 36");
      };
      BN.prototype.toNumber = function toNumber() {
        var ret = this.words[0];
        if (this.length === 2) {
          ret += this.words[1] * 67108864;
        } else if (this.length === 3 && this.words[2] === 1) {
          ret += 4503599627370496 + this.words[1] * 67108864;
        } else if (this.length > 2) {
          assert(false, "Number can only safely store up to 53 bits");
        }
        return this.negative !== 0 ? -ret : ret;
      };
      BN.prototype.toJSON = function toJSON() {
        return this.toString(16);
      };
      BN.prototype.toBuffer = function toBuffer(endian, length) {
        assert(typeof Buffer2 !== "undefined");
        return this.toArrayLike(Buffer2, endian, length);
      };
      BN.prototype.toArray = function toArray(endian, length) {
        return this.toArrayLike(Array, endian, length);
      };
      BN.prototype.toArrayLike = function toArrayLike(ArrayType, endian, length) {
        var byteLength = this.byteLength();
        var reqLength = length || Math.max(1, byteLength);
        assert(byteLength <= reqLength, "byte array longer than desired length");
        assert(reqLength > 0, "Requested array length <= 0");
        this.strip();
        var littleEndian = endian === "le";
        var res = new ArrayType(reqLength);
        var b, i;
        var q = this.clone();
        if (!littleEndian) {
          for (i = 0; i < reqLength - byteLength; i++) {
            res[i] = 0;
          }
          for (i = 0; !q.isZero(); i++) {
            b = q.andln(255);
            q.iushrn(8);
            res[reqLength - i - 1] = b;
          }
        } else {
          for (i = 0; !q.isZero(); i++) {
            b = q.andln(255);
            q.iushrn(8);
            res[i] = b;
          }
          for (; i < reqLength; i++) {
            res[i] = 0;
          }
        }
        return res;
      };
      if (Math.clz32) {
        BN.prototype._countBits = function _countBits(w) {
          return 32 - Math.clz32(w);
        };
      } else {
        BN.prototype._countBits = function _countBits(w) {
          var t = w;
          var r = 0;
          if (t >= 4096) {
            r += 13;
            t >>>= 13;
          }
          if (t >= 64) {
            r += 7;
            t >>>= 7;
          }
          if (t >= 8) {
            r += 4;
            t >>>= 4;
          }
          if (t >= 2) {
            r += 2;
            t >>>= 2;
          }
          return r + t;
        };
      }
      BN.prototype._zeroBits = function _zeroBits(w) {
        if (w === 0) return 26;
        var t = w;
        var r = 0;
        if ((t & 8191) === 0) {
          r += 13;
          t >>>= 13;
        }
        if ((t & 127) === 0) {
          r += 7;
          t >>>= 7;
        }
        if ((t & 15) === 0) {
          r += 4;
          t >>>= 4;
        }
        if ((t & 3) === 0) {
          r += 2;
          t >>>= 2;
        }
        if ((t & 1) === 0) {
          r++;
        }
        return r;
      };
      BN.prototype.bitLength = function bitLength() {
        var w = this.words[this.length - 1];
        var hi = this._countBits(w);
        return (this.length - 1) * 26 + hi;
      };
      function toBitArray(num) {
        var w = new Array(num.bitLength());
        for (var bit = 0; bit < w.length; bit++) {
          var off = bit / 26 | 0;
          var wbit = bit % 26;
          w[bit] = (num.words[off] & 1 << wbit) >>> wbit;
        }
        return w;
      }
      BN.prototype.zeroBits = function zeroBits() {
        if (this.isZero()) return 0;
        var r = 0;
        for (var i = 0; i < this.length; i++) {
          var b = this._zeroBits(this.words[i]);
          r += b;
          if (b !== 26) break;
        }
        return r;
      };
      BN.prototype.byteLength = function byteLength() {
        return Math.ceil(this.bitLength() / 8);
      };
      BN.prototype.toTwos = function toTwos(width) {
        if (this.negative !== 0) {
          return this.abs().inotn(width).iaddn(1);
        }
        return this.clone();
      };
      BN.prototype.fromTwos = function fromTwos(width) {
        if (this.testn(width - 1)) {
          return this.notn(width).iaddn(1).ineg();
        }
        return this.clone();
      };
      BN.prototype.isNeg = function isNeg() {
        return this.negative !== 0;
      };
      BN.prototype.neg = function neg() {
        return this.clone().ineg();
      };
      BN.prototype.ineg = function ineg() {
        if (!this.isZero()) {
          this.negative ^= 1;
        }
        return this;
      };
      BN.prototype.iuor = function iuor(num) {
        while (this.length < num.length) {
          this.words[this.length++] = 0;
        }
        for (var i = 0; i < num.length; i++) {
          this.words[i] = this.words[i] | num.words[i];
        }
        return this.strip();
      };
      BN.prototype.ior = function ior(num) {
        assert((this.negative | num.negative) === 0);
        return this.iuor(num);
      };
      BN.prototype.or = function or(num) {
        if (this.length > num.length) return this.clone().ior(num);
        return num.clone().ior(this);
      };
      BN.prototype.uor = function uor(num) {
        if (this.length > num.length) return this.clone().iuor(num);
        return num.clone().iuor(this);
      };
      BN.prototype.iuand = function iuand(num) {
        var b;
        if (this.length > num.length) {
          b = num;
        } else {
          b = this;
        }
        for (var i = 0; i < b.length; i++) {
          this.words[i] = this.words[i] & num.words[i];
        }
        this.length = b.length;
        return this.strip();
      };
      BN.prototype.iand = function iand(num) {
        assert((this.negative | num.negative) === 0);
        return this.iuand(num);
      };
      BN.prototype.and = function and(num) {
        if (this.length > num.length) return this.clone().iand(num);
        return num.clone().iand(this);
      };
      BN.prototype.uand = function uand(num) {
        if (this.length > num.length) return this.clone().iuand(num);
        return num.clone().iuand(this);
      };
      BN.prototype.iuxor = function iuxor(num) {
        var a;
        var b;
        if (this.length > num.length) {
          a = this;
          b = num;
        } else {
          a = num;
          b = this;
        }
        for (var i = 0; i < b.length; i++) {
          this.words[i] = a.words[i] ^ b.words[i];
        }
        if (this !== a) {
          for (; i < a.length; i++) {
            this.words[i] = a.words[i];
          }
        }
        this.length = a.length;
        return this.strip();
      };
      BN.prototype.ixor = function ixor(num) {
        assert((this.negative | num.negative) === 0);
        return this.iuxor(num);
      };
      BN.prototype.xor = function xor(num) {
        if (this.length > num.length) return this.clone().ixor(num);
        return num.clone().ixor(this);
      };
      BN.prototype.uxor = function uxor(num) {
        if (this.length > num.length) return this.clone().iuxor(num);
        return num.clone().iuxor(this);
      };
      BN.prototype.inotn = function inotn(width) {
        assert(typeof width === "number" && width >= 0);
        var bytesNeeded = Math.ceil(width / 26) | 0;
        var bitsLeft = width % 26;
        this._expand(bytesNeeded);
        if (bitsLeft > 0) {
          bytesNeeded--;
        }
        for (var i = 0; i < bytesNeeded; i++) {
          this.words[i] = ~this.words[i] & 67108863;
        }
        if (bitsLeft > 0) {
          this.words[i] = ~this.words[i] & 67108863 >> 26 - bitsLeft;
        }
        return this.strip();
      };
      BN.prototype.notn = function notn(width) {
        return this.clone().inotn(width);
      };
      BN.prototype.setn = function setn(bit, val) {
        assert(typeof bit === "number" && bit >= 0);
        var off = bit / 26 | 0;
        var wbit = bit % 26;
        this._expand(off + 1);
        if (val) {
          this.words[off] = this.words[off] | 1 << wbit;
        } else {
          this.words[off] = this.words[off] & ~(1 << wbit);
        }
        return this.strip();
      };
      BN.prototype.iadd = function iadd(num) {
        var r;
        if (this.negative !== 0 && num.negative === 0) {
          this.negative = 0;
          r = this.isub(num);
          this.negative ^= 1;
          return this._normSign();
        } else if (this.negative === 0 && num.negative !== 0) {
          num.negative = 0;
          r = this.isub(num);
          num.negative = 1;
          return r._normSign();
        }
        var a, b;
        if (this.length > num.length) {
          a = this;
          b = num;
        } else {
          a = num;
          b = this;
        }
        var carry = 0;
        for (var i = 0; i < b.length; i++) {
          r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
          this.words[i] = r & 67108863;
          carry = r >>> 26;
        }
        for (; carry !== 0 && i < a.length; i++) {
          r = (a.words[i] | 0) + carry;
          this.words[i] = r & 67108863;
          carry = r >>> 26;
        }
        this.length = a.length;
        if (carry !== 0) {
          this.words[this.length] = carry;
          this.length++;
        } else if (a !== this) {
          for (; i < a.length; i++) {
            this.words[i] = a.words[i];
          }
        }
        return this;
      };
      BN.prototype.add = function add(num) {
        var res;
        if (num.negative !== 0 && this.negative === 0) {
          num.negative = 0;
          res = this.sub(num);
          num.negative ^= 1;
          return res;
        } else if (num.negative === 0 && this.negative !== 0) {
          this.negative = 0;
          res = num.sub(this);
          this.negative = 1;
          return res;
        }
        if (this.length > num.length) return this.clone().iadd(num);
        return num.clone().iadd(this);
      };
      BN.prototype.isub = function isub(num) {
        if (num.negative !== 0) {
          num.negative = 0;
          var r = this.iadd(num);
          num.negative = 1;
          return r._normSign();
        } else if (this.negative !== 0) {
          this.negative = 0;
          this.iadd(num);
          this.negative = 1;
          return this._normSign();
        }
        var cmp = this.cmp(num);
        if (cmp === 0) {
          this.negative = 0;
          this.length = 1;
          this.words[0] = 0;
          return this;
        }
        var a, b;
        if (cmp > 0) {
          a = this;
          b = num;
        } else {
          a = num;
          b = this;
        }
        var carry = 0;
        for (var i = 0; i < b.length; i++) {
          r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
          carry = r >> 26;
          this.words[i] = r & 67108863;
        }
        for (; carry !== 0 && i < a.length; i++) {
          r = (a.words[i] | 0) + carry;
          carry = r >> 26;
          this.words[i] = r & 67108863;
        }
        if (carry === 0 && i < a.length && a !== this) {
          for (; i < a.length; i++) {
            this.words[i] = a.words[i];
          }
        }
        this.length = Math.max(this.length, i);
        if (a !== this) {
          this.negative = 1;
        }
        return this.strip();
      };
      BN.prototype.sub = function sub(num) {
        return this.clone().isub(num);
      };
      function smallMulTo(self2, num, out) {
        out.negative = num.negative ^ self2.negative;
        var len = self2.length + num.length | 0;
        out.length = len;
        len = len - 1 | 0;
        var a = self2.words[0] | 0;
        var b = num.words[0] | 0;
        var r = a * b;
        var lo = r & 67108863;
        var carry = r / 67108864 | 0;
        out.words[0] = lo;
        for (var k = 1; k < len; k++) {
          var ncarry = carry >>> 26;
          var rword = carry & 67108863;
          var maxJ = Math.min(k, num.length - 1);
          for (var j = Math.max(0, k - self2.length + 1); j <= maxJ; j++) {
            var i = k - j | 0;
            a = self2.words[i] | 0;
            b = num.words[j] | 0;
            r = a * b + rword;
            ncarry += r / 67108864 | 0;
            rword = r & 67108863;
          }
          out.words[k] = rword | 0;
          carry = ncarry | 0;
        }
        if (carry !== 0) {
          out.words[k] = carry | 0;
        } else {
          out.length--;
        }
        return out.strip();
      }
      var comb10MulTo = function comb10MulTo2(self2, num, out) {
        var a = self2.words;
        var b = num.words;
        var o = out.words;
        var c = 0;
        var lo;
        var mid;
        var hi;
        var a0 = a[0] | 0;
        var al0 = a0 & 8191;
        var ah0 = a0 >>> 13;
        var a1 = a[1] | 0;
        var al1 = a1 & 8191;
        var ah1 = a1 >>> 13;
        var a2 = a[2] | 0;
        var al2 = a2 & 8191;
        var ah2 = a2 >>> 13;
        var a3 = a[3] | 0;
        var al3 = a3 & 8191;
        var ah3 = a3 >>> 13;
        var a4 = a[4] | 0;
        var al4 = a4 & 8191;
        var ah4 = a4 >>> 13;
        var a5 = a[5] | 0;
        var al5 = a5 & 8191;
        var ah5 = a5 >>> 13;
        var a6 = a[6] | 0;
        var al6 = a6 & 8191;
        var ah6 = a6 >>> 13;
        var a7 = a[7] | 0;
        var al7 = a7 & 8191;
        var ah7 = a7 >>> 13;
        var a8 = a[8] | 0;
        var al8 = a8 & 8191;
        var ah8 = a8 >>> 13;
        var a9 = a[9] | 0;
        var al9 = a9 & 8191;
        var ah9 = a9 >>> 13;
        var b0 = b[0] | 0;
        var bl0 = b0 & 8191;
        var bh0 = b0 >>> 13;
        var b1 = b[1] | 0;
        var bl1 = b1 & 8191;
        var bh1 = b1 >>> 13;
        var b2 = b[2] | 0;
        var bl2 = b2 & 8191;
        var bh2 = b2 >>> 13;
        var b3 = b[3] | 0;
        var bl3 = b3 & 8191;
        var bh3 = b3 >>> 13;
        var b4 = b[4] | 0;
        var bl4 = b4 & 8191;
        var bh4 = b4 >>> 13;
        var b5 = b[5] | 0;
        var bl5 = b5 & 8191;
        var bh5 = b5 >>> 13;
        var b6 = b[6] | 0;
        var bl6 = b6 & 8191;
        var bh6 = b6 >>> 13;
        var b7 = b[7] | 0;
        var bl7 = b7 & 8191;
        var bh7 = b7 >>> 13;
        var b8 = b[8] | 0;
        var bl8 = b8 & 8191;
        var bh8 = b8 >>> 13;
        var b9 = b[9] | 0;
        var bl9 = b9 & 8191;
        var bh9 = b9 >>> 13;
        out.negative = self2.negative ^ num.negative;
        out.length = 19;
        lo = Math.imul(al0, bl0);
        mid = Math.imul(al0, bh0);
        mid = mid + Math.imul(ah0, bl0) | 0;
        hi = Math.imul(ah0, bh0);
        var w0 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w0 >>> 26) | 0;
        w0 &= 67108863;
        lo = Math.imul(al1, bl0);
        mid = Math.imul(al1, bh0);
        mid = mid + Math.imul(ah1, bl0) | 0;
        hi = Math.imul(ah1, bh0);
        lo = lo + Math.imul(al0, bl1) | 0;
        mid = mid + Math.imul(al0, bh1) | 0;
        mid = mid + Math.imul(ah0, bl1) | 0;
        hi = hi + Math.imul(ah0, bh1) | 0;
        var w1 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w1 >>> 26) | 0;
        w1 &= 67108863;
        lo = Math.imul(al2, bl0);
        mid = Math.imul(al2, bh0);
        mid = mid + Math.imul(ah2, bl0) | 0;
        hi = Math.imul(ah2, bh0);
        lo = lo + Math.imul(al1, bl1) | 0;
        mid = mid + Math.imul(al1, bh1) | 0;
        mid = mid + Math.imul(ah1, bl1) | 0;
        hi = hi + Math.imul(ah1, bh1) | 0;
        lo = lo + Math.imul(al0, bl2) | 0;
        mid = mid + Math.imul(al0, bh2) | 0;
        mid = mid + Math.imul(ah0, bl2) | 0;
        hi = hi + Math.imul(ah0, bh2) | 0;
        var w2 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w2 >>> 26) | 0;
        w2 &= 67108863;
        lo = Math.imul(al3, bl0);
        mid = Math.imul(al3, bh0);
        mid = mid + Math.imul(ah3, bl0) | 0;
        hi = Math.imul(ah3, bh0);
        lo = lo + Math.imul(al2, bl1) | 0;
        mid = mid + Math.imul(al2, bh1) | 0;
        mid = mid + Math.imul(ah2, bl1) | 0;
        hi = hi + Math.imul(ah2, bh1) | 0;
        lo = lo + Math.imul(al1, bl2) | 0;
        mid = mid + Math.imul(al1, bh2) | 0;
        mid = mid + Math.imul(ah1, bl2) | 0;
        hi = hi + Math.imul(ah1, bh2) | 0;
        lo = lo + Math.imul(al0, bl3) | 0;
        mid = mid + Math.imul(al0, bh3) | 0;
        mid = mid + Math.imul(ah0, bl3) | 0;
        hi = hi + Math.imul(ah0, bh3) | 0;
        var w3 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w3 >>> 26) | 0;
        w3 &= 67108863;
        lo = Math.imul(al4, bl0);
        mid = Math.imul(al4, bh0);
        mid = mid + Math.imul(ah4, bl0) | 0;
        hi = Math.imul(ah4, bh0);
        lo = lo + Math.imul(al3, bl1) | 0;
        mid = mid + Math.imul(al3, bh1) | 0;
        mid = mid + Math.imul(ah3, bl1) | 0;
        hi = hi + Math.imul(ah3, bh1) | 0;
        lo = lo + Math.imul(al2, bl2) | 0;
        mid = mid + Math.imul(al2, bh2) | 0;
        mid = mid + Math.imul(ah2, bl2) | 0;
        hi = hi + Math.imul(ah2, bh2) | 0;
        lo = lo + Math.imul(al1, bl3) | 0;
        mid = mid + Math.imul(al1, bh3) | 0;
        mid = mid + Math.imul(ah1, bl3) | 0;
        hi = hi + Math.imul(ah1, bh3) | 0;
        lo = lo + Math.imul(al0, bl4) | 0;
        mid = mid + Math.imul(al0, bh4) | 0;
        mid = mid + Math.imul(ah0, bl4) | 0;
        hi = hi + Math.imul(ah0, bh4) | 0;
        var w4 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w4 >>> 26) | 0;
        w4 &= 67108863;
        lo = Math.imul(al5, bl0);
        mid = Math.imul(al5, bh0);
        mid = mid + Math.imul(ah5, bl0) | 0;
        hi = Math.imul(ah5, bh0);
        lo = lo + Math.imul(al4, bl1) | 0;
        mid = mid + Math.imul(al4, bh1) | 0;
        mid = mid + Math.imul(ah4, bl1) | 0;
        hi = hi + Math.imul(ah4, bh1) | 0;
        lo = lo + Math.imul(al3, bl2) | 0;
        mid = mid + Math.imul(al3, bh2) | 0;
        mid = mid + Math.imul(ah3, bl2) | 0;
        hi = hi + Math.imul(ah3, bh2) | 0;
        lo = lo + Math.imul(al2, bl3) | 0;
        mid = mid + Math.imul(al2, bh3) | 0;
        mid = mid + Math.imul(ah2, bl3) | 0;
        hi = hi + Math.imul(ah2, bh3) | 0;
        lo = lo + Math.imul(al1, bl4) | 0;
        mid = mid + Math.imul(al1, bh4) | 0;
        mid = mid + Math.imul(ah1, bl4) | 0;
        hi = hi + Math.imul(ah1, bh4) | 0;
        lo = lo + Math.imul(al0, bl5) | 0;
        mid = mid + Math.imul(al0, bh5) | 0;
        mid = mid + Math.imul(ah0, bl5) | 0;
        hi = hi + Math.imul(ah0, bh5) | 0;
        var w5 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w5 >>> 26) | 0;
        w5 &= 67108863;
        lo = Math.imul(al6, bl0);
        mid = Math.imul(al6, bh0);
        mid = mid + Math.imul(ah6, bl0) | 0;
        hi = Math.imul(ah6, bh0);
        lo = lo + Math.imul(al5, bl1) | 0;
        mid = mid + Math.imul(al5, bh1) | 0;
        mid = mid + Math.imul(ah5, bl1) | 0;
        hi = hi + Math.imul(ah5, bh1) | 0;
        lo = lo + Math.imul(al4, bl2) | 0;
        mid = mid + Math.imul(al4, bh2) | 0;
        mid = mid + Math.imul(ah4, bl2) | 0;
        hi = hi + Math.imul(ah4, bh2) | 0;
        lo = lo + Math.imul(al3, bl3) | 0;
        mid = mid + Math.imul(al3, bh3) | 0;
        mid = mid + Math.imul(ah3, bl3) | 0;
        hi = hi + Math.imul(ah3, bh3) | 0;
        lo = lo + Math.imul(al2, bl4) | 0;
        mid = mid + Math.imul(al2, bh4) | 0;
        mid = mid + Math.imul(ah2, bl4) | 0;
        hi = hi + Math.imul(ah2, bh4) | 0;
        lo = lo + Math.imul(al1, bl5) | 0;
        mid = mid + Math.imul(al1, bh5) | 0;
        mid = mid + Math.imul(ah1, bl5) | 0;
        hi = hi + Math.imul(ah1, bh5) | 0;
        lo = lo + Math.imul(al0, bl6) | 0;
        mid = mid + Math.imul(al0, bh6) | 0;
        mid = mid + Math.imul(ah0, bl6) | 0;
        hi = hi + Math.imul(ah0, bh6) | 0;
        var w6 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w6 >>> 26) | 0;
        w6 &= 67108863;
        lo = Math.imul(al7, bl0);
        mid = Math.imul(al7, bh0);
        mid = mid + Math.imul(ah7, bl0) | 0;
        hi = Math.imul(ah7, bh0);
        lo = lo + Math.imul(al6, bl1) | 0;
        mid = mid + Math.imul(al6, bh1) | 0;
        mid = mid + Math.imul(ah6, bl1) | 0;
        hi = hi + Math.imul(ah6, bh1) | 0;
        lo = lo + Math.imul(al5, bl2) | 0;
        mid = mid + Math.imul(al5, bh2) | 0;
        mid = mid + Math.imul(ah5, bl2) | 0;
        hi = hi + Math.imul(ah5, bh2) | 0;
        lo = lo + Math.imul(al4, bl3) | 0;
        mid = mid + Math.imul(al4, bh3) | 0;
        mid = mid + Math.imul(ah4, bl3) | 0;
        hi = hi + Math.imul(ah4, bh3) | 0;
        lo = lo + Math.imul(al3, bl4) | 0;
        mid = mid + Math.imul(al3, bh4) | 0;
        mid = mid + Math.imul(ah3, bl4) | 0;
        hi = hi + Math.imul(ah3, bh4) | 0;
        lo = lo + Math.imul(al2, bl5) | 0;
        mid = mid + Math.imul(al2, bh5) | 0;
        mid = mid + Math.imul(ah2, bl5) | 0;
        hi = hi + Math.imul(ah2, bh5) | 0;
        lo = lo + Math.imul(al1, bl6) | 0;
        mid = mid + Math.imul(al1, bh6) | 0;
        mid = mid + Math.imul(ah1, bl6) | 0;
        hi = hi + Math.imul(ah1, bh6) | 0;
        lo = lo + Math.imul(al0, bl7) | 0;
        mid = mid + Math.imul(al0, bh7) | 0;
        mid = mid + Math.imul(ah0, bl7) | 0;
        hi = hi + Math.imul(ah0, bh7) | 0;
        var w7 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w7 >>> 26) | 0;
        w7 &= 67108863;
        lo = Math.imul(al8, bl0);
        mid = Math.imul(al8, bh0);
        mid = mid + Math.imul(ah8, bl0) | 0;
        hi = Math.imul(ah8, bh0);
        lo = lo + Math.imul(al7, bl1) | 0;
        mid = mid + Math.imul(al7, bh1) | 0;
        mid = mid + Math.imul(ah7, bl1) | 0;
        hi = hi + Math.imul(ah7, bh1) | 0;
        lo = lo + Math.imul(al6, bl2) | 0;
        mid = mid + Math.imul(al6, bh2) | 0;
        mid = mid + Math.imul(ah6, bl2) | 0;
        hi = hi + Math.imul(ah6, bh2) | 0;
        lo = lo + Math.imul(al5, bl3) | 0;
        mid = mid + Math.imul(al5, bh3) | 0;
        mid = mid + Math.imul(ah5, bl3) | 0;
        hi = hi + Math.imul(ah5, bh3) | 0;
        lo = lo + Math.imul(al4, bl4) | 0;
        mid = mid + Math.imul(al4, bh4) | 0;
        mid = mid + Math.imul(ah4, bl4) | 0;
        hi = hi + Math.imul(ah4, bh4) | 0;
        lo = lo + Math.imul(al3, bl5) | 0;
        mid = mid + Math.imul(al3, bh5) | 0;
        mid = mid + Math.imul(ah3, bl5) | 0;
        hi = hi + Math.imul(ah3, bh5) | 0;
        lo = lo + Math.imul(al2, bl6) | 0;
        mid = mid + Math.imul(al2, bh6) | 0;
        mid = mid + Math.imul(ah2, bl6) | 0;
        hi = hi + Math.imul(ah2, bh6) | 0;
        lo = lo + Math.imul(al1, bl7) | 0;
        mid = mid + Math.imul(al1, bh7) | 0;
        mid = mid + Math.imul(ah1, bl7) | 0;
        hi = hi + Math.imul(ah1, bh7) | 0;
        lo = lo + Math.imul(al0, bl8) | 0;
        mid = mid + Math.imul(al0, bh8) | 0;
        mid = mid + Math.imul(ah0, bl8) | 0;
        hi = hi + Math.imul(ah0, bh8) | 0;
        var w8 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w8 >>> 26) | 0;
        w8 &= 67108863;
        lo = Math.imul(al9, bl0);
        mid = Math.imul(al9, bh0);
        mid = mid + Math.imul(ah9, bl0) | 0;
        hi = Math.imul(ah9, bh0);
        lo = lo + Math.imul(al8, bl1) | 0;
        mid = mid + Math.imul(al8, bh1) | 0;
        mid = mid + Math.imul(ah8, bl1) | 0;
        hi = hi + Math.imul(ah8, bh1) | 0;
        lo = lo + Math.imul(al7, bl2) | 0;
        mid = mid + Math.imul(al7, bh2) | 0;
        mid = mid + Math.imul(ah7, bl2) | 0;
        hi = hi + Math.imul(ah7, bh2) | 0;
        lo = lo + Math.imul(al6, bl3) | 0;
        mid = mid + Math.imul(al6, bh3) | 0;
        mid = mid + Math.imul(ah6, bl3) | 0;
        hi = hi + Math.imul(ah6, bh3) | 0;
        lo = lo + Math.imul(al5, bl4) | 0;
        mid = mid + Math.imul(al5, bh4) | 0;
        mid = mid + Math.imul(ah5, bl4) | 0;
        hi = hi + Math.imul(ah5, bh4) | 0;
        lo = lo + Math.imul(al4, bl5) | 0;
        mid = mid + Math.imul(al4, bh5) | 0;
        mid = mid + Math.imul(ah4, bl5) | 0;
        hi = hi + Math.imul(ah4, bh5) | 0;
        lo = lo + Math.imul(al3, bl6) | 0;
        mid = mid + Math.imul(al3, bh6) | 0;
        mid = mid + Math.imul(ah3, bl6) | 0;
        hi = hi + Math.imul(ah3, bh6) | 0;
        lo = lo + Math.imul(al2, bl7) | 0;
        mid = mid + Math.imul(al2, bh7) | 0;
        mid = mid + Math.imul(ah2, bl7) | 0;
        hi = hi + Math.imul(ah2, bh7) | 0;
        lo = lo + Math.imul(al1, bl8) | 0;
        mid = mid + Math.imul(al1, bh8) | 0;
        mid = mid + Math.imul(ah1, bl8) | 0;
        hi = hi + Math.imul(ah1, bh8) | 0;
        lo = lo + Math.imul(al0, bl9) | 0;
        mid = mid + Math.imul(al0, bh9) | 0;
        mid = mid + Math.imul(ah0, bl9) | 0;
        hi = hi + Math.imul(ah0, bh9) | 0;
        var w9 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w9 >>> 26) | 0;
        w9 &= 67108863;
        lo = Math.imul(al9, bl1);
        mid = Math.imul(al9, bh1);
        mid = mid + Math.imul(ah9, bl1) | 0;
        hi = Math.imul(ah9, bh1);
        lo = lo + Math.imul(al8, bl2) | 0;
        mid = mid + Math.imul(al8, bh2) | 0;
        mid = mid + Math.imul(ah8, bl2) | 0;
        hi = hi + Math.imul(ah8, bh2) | 0;
        lo = lo + Math.imul(al7, bl3) | 0;
        mid = mid + Math.imul(al7, bh3) | 0;
        mid = mid + Math.imul(ah7, bl3) | 0;
        hi = hi + Math.imul(ah7, bh3) | 0;
        lo = lo + Math.imul(al6, bl4) | 0;
        mid = mid + Math.imul(al6, bh4) | 0;
        mid = mid + Math.imul(ah6, bl4) | 0;
        hi = hi + Math.imul(ah6, bh4) | 0;
        lo = lo + Math.imul(al5, bl5) | 0;
        mid = mid + Math.imul(al5, bh5) | 0;
        mid = mid + Math.imul(ah5, bl5) | 0;
        hi = hi + Math.imul(ah5, bh5) | 0;
        lo = lo + Math.imul(al4, bl6) | 0;
        mid = mid + Math.imul(al4, bh6) | 0;
        mid = mid + Math.imul(ah4, bl6) | 0;
        hi = hi + Math.imul(ah4, bh6) | 0;
        lo = lo + Math.imul(al3, bl7) | 0;
        mid = mid + Math.imul(al3, bh7) | 0;
        mid = mid + Math.imul(ah3, bl7) | 0;
        hi = hi + Math.imul(ah3, bh7) | 0;
        lo = lo + Math.imul(al2, bl8) | 0;
        mid = mid + Math.imul(al2, bh8) | 0;
        mid = mid + Math.imul(ah2, bl8) | 0;
        hi = hi + Math.imul(ah2, bh8) | 0;
        lo = lo + Math.imul(al1, bl9) | 0;
        mid = mid + Math.imul(al1, bh9) | 0;
        mid = mid + Math.imul(ah1, bl9) | 0;
        hi = hi + Math.imul(ah1, bh9) | 0;
        var w10 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w10 >>> 26) | 0;
        w10 &= 67108863;
        lo = Math.imul(al9, bl2);
        mid = Math.imul(al9, bh2);
        mid = mid + Math.imul(ah9, bl2) | 0;
        hi = Math.imul(ah9, bh2);
        lo = lo + Math.imul(al8, bl3) | 0;
        mid = mid + Math.imul(al8, bh3) | 0;
        mid = mid + Math.imul(ah8, bl3) | 0;
        hi = hi + Math.imul(ah8, bh3) | 0;
        lo = lo + Math.imul(al7, bl4) | 0;
        mid = mid + Math.imul(al7, bh4) | 0;
        mid = mid + Math.imul(ah7, bl4) | 0;
        hi = hi + Math.imul(ah7, bh4) | 0;
        lo = lo + Math.imul(al6, bl5) | 0;
        mid = mid + Math.imul(al6, bh5) | 0;
        mid = mid + Math.imul(ah6, bl5) | 0;
        hi = hi + Math.imul(ah6, bh5) | 0;
        lo = lo + Math.imul(al5, bl6) | 0;
        mid = mid + Math.imul(al5, bh6) | 0;
        mid = mid + Math.imul(ah5, bl6) | 0;
        hi = hi + Math.imul(ah5, bh6) | 0;
        lo = lo + Math.imul(al4, bl7) | 0;
        mid = mid + Math.imul(al4, bh7) | 0;
        mid = mid + Math.imul(ah4, bl7) | 0;
        hi = hi + Math.imul(ah4, bh7) | 0;
        lo = lo + Math.imul(al3, bl8) | 0;
        mid = mid + Math.imul(al3, bh8) | 0;
        mid = mid + Math.imul(ah3, bl8) | 0;
        hi = hi + Math.imul(ah3, bh8) | 0;
        lo = lo + Math.imul(al2, bl9) | 0;
        mid = mid + Math.imul(al2, bh9) | 0;
        mid = mid + Math.imul(ah2, bl9) | 0;
        hi = hi + Math.imul(ah2, bh9) | 0;
        var w11 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w11 >>> 26) | 0;
        w11 &= 67108863;
        lo = Math.imul(al9, bl3);
        mid = Math.imul(al9, bh3);
        mid = mid + Math.imul(ah9, bl3) | 0;
        hi = Math.imul(ah9, bh3);
        lo = lo + Math.imul(al8, bl4) | 0;
        mid = mid + Math.imul(al8, bh4) | 0;
        mid = mid + Math.imul(ah8, bl4) | 0;
        hi = hi + Math.imul(ah8, bh4) | 0;
        lo = lo + Math.imul(al7, bl5) | 0;
        mid = mid + Math.imul(al7, bh5) | 0;
        mid = mid + Math.imul(ah7, bl5) | 0;
        hi = hi + Math.imul(ah7, bh5) | 0;
        lo = lo + Math.imul(al6, bl6) | 0;
        mid = mid + Math.imul(al6, bh6) | 0;
        mid = mid + Math.imul(ah6, bl6) | 0;
        hi = hi + Math.imul(ah6, bh6) | 0;
        lo = lo + Math.imul(al5, bl7) | 0;
        mid = mid + Math.imul(al5, bh7) | 0;
        mid = mid + Math.imul(ah5, bl7) | 0;
        hi = hi + Math.imul(ah5, bh7) | 0;
        lo = lo + Math.imul(al4, bl8) | 0;
        mid = mid + Math.imul(al4, bh8) | 0;
        mid = mid + Math.imul(ah4, bl8) | 0;
        hi = hi + Math.imul(ah4, bh8) | 0;
        lo = lo + Math.imul(al3, bl9) | 0;
        mid = mid + Math.imul(al3, bh9) | 0;
        mid = mid + Math.imul(ah3, bl9) | 0;
        hi = hi + Math.imul(ah3, bh9) | 0;
        var w12 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w12 >>> 26) | 0;
        w12 &= 67108863;
        lo = Math.imul(al9, bl4);
        mid = Math.imul(al9, bh4);
        mid = mid + Math.imul(ah9, bl4) | 0;
        hi = Math.imul(ah9, bh4);
        lo = lo + Math.imul(al8, bl5) | 0;
        mid = mid + Math.imul(al8, bh5) | 0;
        mid = mid + Math.imul(ah8, bl5) | 0;
        hi = hi + Math.imul(ah8, bh5) | 0;
        lo = lo + Math.imul(al7, bl6) | 0;
        mid = mid + Math.imul(al7, bh6) | 0;
        mid = mid + Math.imul(ah7, bl6) | 0;
        hi = hi + Math.imul(ah7, bh6) | 0;
        lo = lo + Math.imul(al6, bl7) | 0;
        mid = mid + Math.imul(al6, bh7) | 0;
        mid = mid + Math.imul(ah6, bl7) | 0;
        hi = hi + Math.imul(ah6, bh7) | 0;
        lo = lo + Math.imul(al5, bl8) | 0;
        mid = mid + Math.imul(al5, bh8) | 0;
        mid = mid + Math.imul(ah5, bl8) | 0;
        hi = hi + Math.imul(ah5, bh8) | 0;
        lo = lo + Math.imul(al4, bl9) | 0;
        mid = mid + Math.imul(al4, bh9) | 0;
        mid = mid + Math.imul(ah4, bl9) | 0;
        hi = hi + Math.imul(ah4, bh9) | 0;
        var w13 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w13 >>> 26) | 0;
        w13 &= 67108863;
        lo = Math.imul(al9, bl5);
        mid = Math.imul(al9, bh5);
        mid = mid + Math.imul(ah9, bl5) | 0;
        hi = Math.imul(ah9, bh5);
        lo = lo + Math.imul(al8, bl6) | 0;
        mid = mid + Math.imul(al8, bh6) | 0;
        mid = mid + Math.imul(ah8, bl6) | 0;
        hi = hi + Math.imul(ah8, bh6) | 0;
        lo = lo + Math.imul(al7, bl7) | 0;
        mid = mid + Math.imul(al7, bh7) | 0;
        mid = mid + Math.imul(ah7, bl7) | 0;
        hi = hi + Math.imul(ah7, bh7) | 0;
        lo = lo + Math.imul(al6, bl8) | 0;
        mid = mid + Math.imul(al6, bh8) | 0;
        mid = mid + Math.imul(ah6, bl8) | 0;
        hi = hi + Math.imul(ah6, bh8) | 0;
        lo = lo + Math.imul(al5, bl9) | 0;
        mid = mid + Math.imul(al5, bh9) | 0;
        mid = mid + Math.imul(ah5, bl9) | 0;
        hi = hi + Math.imul(ah5, bh9) | 0;
        var w14 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w14 >>> 26) | 0;
        w14 &= 67108863;
        lo = Math.imul(al9, bl6);
        mid = Math.imul(al9, bh6);
        mid = mid + Math.imul(ah9, bl6) | 0;
        hi = Math.imul(ah9, bh6);
        lo = lo + Math.imul(al8, bl7) | 0;
        mid = mid + Math.imul(al8, bh7) | 0;
        mid = mid + Math.imul(ah8, bl7) | 0;
        hi = hi + Math.imul(ah8, bh7) | 0;
        lo = lo + Math.imul(al7, bl8) | 0;
        mid = mid + Math.imul(al7, bh8) | 0;
        mid = mid + Math.imul(ah7, bl8) | 0;
        hi = hi + Math.imul(ah7, bh8) | 0;
        lo = lo + Math.imul(al6, bl9) | 0;
        mid = mid + Math.imul(al6, bh9) | 0;
        mid = mid + Math.imul(ah6, bl9) | 0;
        hi = hi + Math.imul(ah6, bh9) | 0;
        var w15 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w15 >>> 26) | 0;
        w15 &= 67108863;
        lo = Math.imul(al9, bl7);
        mid = Math.imul(al9, bh7);
        mid = mid + Math.imul(ah9, bl7) | 0;
        hi = Math.imul(ah9, bh7);
        lo = lo + Math.imul(al8, bl8) | 0;
        mid = mid + Math.imul(al8, bh8) | 0;
        mid = mid + Math.imul(ah8, bl8) | 0;
        hi = hi + Math.imul(ah8, bh8) | 0;
        lo = lo + Math.imul(al7, bl9) | 0;
        mid = mid + Math.imul(al7, bh9) | 0;
        mid = mid + Math.imul(ah7, bl9) | 0;
        hi = hi + Math.imul(ah7, bh9) | 0;
        var w16 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w16 >>> 26) | 0;
        w16 &= 67108863;
        lo = Math.imul(al9, bl8);
        mid = Math.imul(al9, bh8);
        mid = mid + Math.imul(ah9, bl8) | 0;
        hi = Math.imul(ah9, bh8);
        lo = lo + Math.imul(al8, bl9) | 0;
        mid = mid + Math.imul(al8, bh9) | 0;
        mid = mid + Math.imul(ah8, bl9) | 0;
        hi = hi + Math.imul(ah8, bh9) | 0;
        var w17 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w17 >>> 26) | 0;
        w17 &= 67108863;
        lo = Math.imul(al9, bl9);
        mid = Math.imul(al9, bh9);
        mid = mid + Math.imul(ah9, bl9) | 0;
        hi = Math.imul(ah9, bh9);
        var w18 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w18 >>> 26) | 0;
        w18 &= 67108863;
        o[0] = w0;
        o[1] = w1;
        o[2] = w2;
        o[3] = w3;
        o[4] = w4;
        o[5] = w5;
        o[6] = w6;
        o[7] = w7;
        o[8] = w8;
        o[9] = w9;
        o[10] = w10;
        o[11] = w11;
        o[12] = w12;
        o[13] = w13;
        o[14] = w14;
        o[15] = w15;
        o[16] = w16;
        o[17] = w17;
        o[18] = w18;
        if (c !== 0) {
          o[19] = c;
          out.length++;
        }
        return out;
      };
      if (!Math.imul) {
        comb10MulTo = smallMulTo;
      }
      function bigMulTo(self2, num, out) {
        out.negative = num.negative ^ self2.negative;
        out.length = self2.length + num.length;
        var carry = 0;
        var hncarry = 0;
        for (var k = 0; k < out.length - 1; k++) {
          var ncarry = hncarry;
          hncarry = 0;
          var rword = carry & 67108863;
          var maxJ = Math.min(k, num.length - 1);
          for (var j = Math.max(0, k - self2.length + 1); j <= maxJ; j++) {
            var i = k - j;
            var a = self2.words[i] | 0;
            var b = num.words[j] | 0;
            var r = a * b;
            var lo = r & 67108863;
            ncarry = ncarry + (r / 67108864 | 0) | 0;
            lo = lo + rword | 0;
            rword = lo & 67108863;
            ncarry = ncarry + (lo >>> 26) | 0;
            hncarry += ncarry >>> 26;
            ncarry &= 67108863;
          }
          out.words[k] = rword;
          carry = ncarry;
          ncarry = hncarry;
        }
        if (carry !== 0) {
          out.words[k] = carry;
        } else {
          out.length--;
        }
        return out.strip();
      }
      function jumboMulTo(self2, num, out) {
        var fftm = new FFTM();
        return fftm.mulp(self2, num, out);
      }
      BN.prototype.mulTo = function mulTo(num, out) {
        var res;
        var len = this.length + num.length;
        if (this.length === 10 && num.length === 10) {
          res = comb10MulTo(this, num, out);
        } else if (len < 63) {
          res = smallMulTo(this, num, out);
        } else if (len < 1024) {
          res = bigMulTo(this, num, out);
        } else {
          res = jumboMulTo(this, num, out);
        }
        return res;
      };
      function FFTM(x, y) {
        this.x = x;
        this.y = y;
      }
      FFTM.prototype.makeRBT = function makeRBT(N) {
        var t = new Array(N);
        var l = BN.prototype._countBits(N) - 1;
        for (var i = 0; i < N; i++) {
          t[i] = this.revBin(i, l, N);
        }
        return t;
      };
      FFTM.prototype.revBin = function revBin(x, l, N) {
        if (x === 0 || x === N - 1) return x;
        var rb = 0;
        for (var i = 0; i < l; i++) {
          rb |= (x & 1) << l - i - 1;
          x >>= 1;
        }
        return rb;
      };
      FFTM.prototype.permute = function permute(rbt, rws, iws, rtws, itws, N) {
        for (var i = 0; i < N; i++) {
          rtws[i] = rws[rbt[i]];
          itws[i] = iws[rbt[i]];
        }
      };
      FFTM.prototype.transform = function transform(rws, iws, rtws, itws, N, rbt) {
        this.permute(rbt, rws, iws, rtws, itws, N);
        for (var s = 1; s < N; s <<= 1) {
          var l = s << 1;
          var rtwdf = Math.cos(2 * Math.PI / l);
          var itwdf = Math.sin(2 * Math.PI / l);
          for (var p = 0; p < N; p += l) {
            var rtwdf_ = rtwdf;
            var itwdf_ = itwdf;
            for (var j = 0; j < s; j++) {
              var re = rtws[p + j];
              var ie = itws[p + j];
              var ro = rtws[p + j + s];
              var io = itws[p + j + s];
              var rx = rtwdf_ * ro - itwdf_ * io;
              io = rtwdf_ * io + itwdf_ * ro;
              ro = rx;
              rtws[p + j] = re + ro;
              itws[p + j] = ie + io;
              rtws[p + j + s] = re - ro;
              itws[p + j + s] = ie - io;
              if (j !== l) {
                rx = rtwdf * rtwdf_ - itwdf * itwdf_;
                itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
                rtwdf_ = rx;
              }
            }
          }
        }
      };
      FFTM.prototype.guessLen13b = function guessLen13b(n, m) {
        var N = Math.max(m, n) | 1;
        var odd = N & 1;
        var i = 0;
        for (N = N / 2 | 0; N; N = N >>> 1) {
          i++;
        }
        return 1 << i + 1 + odd;
      };
      FFTM.prototype.conjugate = function conjugate(rws, iws, N) {
        if (N <= 1) return;
        for (var i = 0; i < N / 2; i++) {
          var t = rws[i];
          rws[i] = rws[N - i - 1];
          rws[N - i - 1] = t;
          t = iws[i];
          iws[i] = -iws[N - i - 1];
          iws[N - i - 1] = -t;
        }
      };
      FFTM.prototype.normalize13b = function normalize13b(ws, N) {
        var carry = 0;
        for (var i = 0; i < N / 2; i++) {
          var w = Math.round(ws[2 * i + 1] / N) * 8192 + Math.round(ws[2 * i] / N) + carry;
          ws[i] = w & 67108863;
          if (w < 67108864) {
            carry = 0;
          } else {
            carry = w / 67108864 | 0;
          }
        }
        return ws;
      };
      FFTM.prototype.convert13b = function convert13b(ws, len, rws, N) {
        var carry = 0;
        for (var i = 0; i < len; i++) {
          carry = carry + (ws[i] | 0);
          rws[2 * i] = carry & 8191;
          carry = carry >>> 13;
          rws[2 * i + 1] = carry & 8191;
          carry = carry >>> 13;
        }
        for (i = 2 * len; i < N; ++i) {
          rws[i] = 0;
        }
        assert(carry === 0);
        assert((carry & -8192) === 0);
      };
      FFTM.prototype.stub = function stub(N) {
        var ph = new Array(N);
        for (var i = 0; i < N; i++) {
          ph[i] = 0;
        }
        return ph;
      };
      FFTM.prototype.mulp = function mulp(x, y, out) {
        var N = 2 * this.guessLen13b(x.length, y.length);
        var rbt = this.makeRBT(N);
        var _ = this.stub(N);
        var rws = new Array(N);
        var rwst = new Array(N);
        var iwst = new Array(N);
        var nrws = new Array(N);
        var nrwst = new Array(N);
        var niwst = new Array(N);
        var rmws = out.words;
        rmws.length = N;
        this.convert13b(x.words, x.length, rws, N);
        this.convert13b(y.words, y.length, nrws, N);
        this.transform(rws, _, rwst, iwst, N, rbt);
        this.transform(nrws, _, nrwst, niwst, N, rbt);
        for (var i = 0; i < N; i++) {
          var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
          iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
          rwst[i] = rx;
        }
        this.conjugate(rwst, iwst, N);
        this.transform(rwst, iwst, rmws, _, N, rbt);
        this.conjugate(rmws, _, N);
        this.normalize13b(rmws, N);
        out.negative = x.negative ^ y.negative;
        out.length = x.length + y.length;
        return out.strip();
      };
      BN.prototype.mul = function mul(num) {
        var out = new BN(null);
        out.words = new Array(this.length + num.length);
        return this.mulTo(num, out);
      };
      BN.prototype.mulf = function mulf(num) {
        var out = new BN(null);
        out.words = new Array(this.length + num.length);
        return jumboMulTo(this, num, out);
      };
      BN.prototype.imul = function imul(num) {
        return this.clone().mulTo(num, this);
      };
      BN.prototype.imuln = function imuln(num) {
        assert(typeof num === "number");
        assert(num < 67108864);
        var carry = 0;
        for (var i = 0; i < this.length; i++) {
          var w = (this.words[i] | 0) * num;
          var lo = (w & 67108863) + (carry & 67108863);
          carry >>= 26;
          carry += w / 67108864 | 0;
          carry += lo >>> 26;
          this.words[i] = lo & 67108863;
        }
        if (carry !== 0) {
          this.words[i] = carry;
          this.length++;
        }
        this.length = num === 0 ? 1 : this.length;
        return this;
      };
      BN.prototype.muln = function muln(num) {
        return this.clone().imuln(num);
      };
      BN.prototype.sqr = function sqr() {
        return this.mul(this);
      };
      BN.prototype.isqr = function isqr() {
        return this.imul(this.clone());
      };
      BN.prototype.pow = function pow(num) {
        var w = toBitArray(num);
        if (w.length === 0) return new BN(1);
        var res = this;
        for (var i = 0; i < w.length; i++, res = res.sqr()) {
          if (w[i] !== 0) break;
        }
        if (++i < w.length) {
          for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
            if (w[i] === 0) continue;
            res = res.mul(q);
          }
        }
        return res;
      };
      BN.prototype.iushln = function iushln(bits) {
        assert(typeof bits === "number" && bits >= 0);
        var r = bits % 26;
        var s = (bits - r) / 26;
        var carryMask = 67108863 >>> 26 - r << 26 - r;
        var i;
        if (r !== 0) {
          var carry = 0;
          for (i = 0; i < this.length; i++) {
            var newCarry = this.words[i] & carryMask;
            var c = (this.words[i] | 0) - newCarry << r;
            this.words[i] = c | carry;
            carry = newCarry >>> 26 - r;
          }
          if (carry) {
            this.words[i] = carry;
            this.length++;
          }
        }
        if (s !== 0) {
          for (i = this.length - 1; i >= 0; i--) {
            this.words[i + s] = this.words[i];
          }
          for (i = 0; i < s; i++) {
            this.words[i] = 0;
          }
          this.length += s;
        }
        return this.strip();
      };
      BN.prototype.ishln = function ishln(bits) {
        assert(this.negative === 0);
        return this.iushln(bits);
      };
      BN.prototype.iushrn = function iushrn(bits, hint, extended) {
        assert(typeof bits === "number" && bits >= 0);
        var h;
        if (hint) {
          h = (hint - hint % 26) / 26;
        } else {
          h = 0;
        }
        var r = bits % 26;
        var s = Math.min((bits - r) / 26, this.length);
        var mask = 67108863 ^ 67108863 >>> r << r;
        var maskedWords = extended;
        h -= s;
        h = Math.max(0, h);
        if (maskedWords) {
          for (var i = 0; i < s; i++) {
            maskedWords.words[i] = this.words[i];
          }
          maskedWords.length = s;
        }
        if (s === 0) ;
        else if (this.length > s) {
          this.length -= s;
          for (i = 0; i < this.length; i++) {
            this.words[i] = this.words[i + s];
          }
        } else {
          this.words[0] = 0;
          this.length = 1;
        }
        var carry = 0;
        for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
          var word = this.words[i] | 0;
          this.words[i] = carry << 26 - r | word >>> r;
          carry = word & mask;
        }
        if (maskedWords && carry !== 0) {
          maskedWords.words[maskedWords.length++] = carry;
        }
        if (this.length === 0) {
          this.words[0] = 0;
          this.length = 1;
        }
        return this.strip();
      };
      BN.prototype.ishrn = function ishrn(bits, hint, extended) {
        assert(this.negative === 0);
        return this.iushrn(bits, hint, extended);
      };
      BN.prototype.shln = function shln(bits) {
        return this.clone().ishln(bits);
      };
      BN.prototype.ushln = function ushln(bits) {
        return this.clone().iushln(bits);
      };
      BN.prototype.shrn = function shrn(bits) {
        return this.clone().ishrn(bits);
      };
      BN.prototype.ushrn = function ushrn(bits) {
        return this.clone().iushrn(bits);
      };
      BN.prototype.testn = function testn(bit) {
        assert(typeof bit === "number" && bit >= 0);
        var r = bit % 26;
        var s = (bit - r) / 26;
        var q = 1 << r;
        if (this.length <= s) return false;
        var w = this.words[s];
        return !!(w & q);
      };
      BN.prototype.imaskn = function imaskn(bits) {
        assert(typeof bits === "number" && bits >= 0);
        var r = bits % 26;
        var s = (bits - r) / 26;
        assert(this.negative === 0, "imaskn works only with positive numbers");
        if (this.length <= s) {
          return this;
        }
        if (r !== 0) {
          s++;
        }
        this.length = Math.min(s, this.length);
        if (r !== 0) {
          var mask = 67108863 ^ 67108863 >>> r << r;
          this.words[this.length - 1] &= mask;
        }
        if (this.length === 0) {
          this.words[0] = 0;
          this.length = 1;
        }
        return this.strip();
      };
      BN.prototype.maskn = function maskn(bits) {
        return this.clone().imaskn(bits);
      };
      BN.prototype.iaddn = function iaddn(num) {
        assert(typeof num === "number");
        assert(num < 67108864);
        if (num < 0) return this.isubn(-num);
        if (this.negative !== 0) {
          if (this.length === 1 && (this.words[0] | 0) < num) {
            this.words[0] = num - (this.words[0] | 0);
            this.negative = 0;
            return this;
          }
          this.negative = 0;
          this.isubn(num);
          this.negative = 1;
          return this;
        }
        return this._iaddn(num);
      };
      BN.prototype._iaddn = function _iaddn(num) {
        this.words[0] += num;
        for (var i = 0; i < this.length && this.words[i] >= 67108864; i++) {
          this.words[i] -= 67108864;
          if (i === this.length - 1) {
            this.words[i + 1] = 1;
          } else {
            this.words[i + 1]++;
          }
        }
        this.length = Math.max(this.length, i + 1);
        return this;
      };
      BN.prototype.isubn = function isubn(num) {
        assert(typeof num === "number");
        assert(num < 67108864);
        if (num < 0) return this.iaddn(-num);
        if (this.negative !== 0) {
          this.negative = 0;
          this.iaddn(num);
          this.negative = 1;
          return this;
        }
        this.words[0] -= num;
        if (this.length === 1 && this.words[0] < 0) {
          this.words[0] = -this.words[0];
          this.negative = 1;
        } else {
          for (var i = 0; i < this.length && this.words[i] < 0; i++) {
            this.words[i] += 67108864;
            this.words[i + 1] -= 1;
          }
        }
        return this.strip();
      };
      BN.prototype.addn = function addn(num) {
        return this.clone().iaddn(num);
      };
      BN.prototype.subn = function subn(num) {
        return this.clone().isubn(num);
      };
      BN.prototype.iabs = function iabs() {
        this.negative = 0;
        return this;
      };
      BN.prototype.abs = function abs() {
        return this.clone().iabs();
      };
      BN.prototype._ishlnsubmul = function _ishlnsubmul(num, mul, shift) {
        var len = num.length + shift;
        var i;
        this._expand(len);
        var w;
        var carry = 0;
        for (i = 0; i < num.length; i++) {
          w = (this.words[i + shift] | 0) + carry;
          var right = (num.words[i] | 0) * mul;
          w -= right & 67108863;
          carry = (w >> 26) - (right / 67108864 | 0);
          this.words[i + shift] = w & 67108863;
        }
        for (; i < this.length - shift; i++) {
          w = (this.words[i + shift] | 0) + carry;
          carry = w >> 26;
          this.words[i + shift] = w & 67108863;
        }
        if (carry === 0) return this.strip();
        assert(carry === -1);
        carry = 0;
        for (i = 0; i < this.length; i++) {
          w = -(this.words[i] | 0) + carry;
          carry = w >> 26;
          this.words[i] = w & 67108863;
        }
        this.negative = 1;
        return this.strip();
      };
      BN.prototype._wordDiv = function _wordDiv(num, mode) {
        var shift = this.length - num.length;
        var a = this.clone();
        var b = num;
        var bhi = b.words[b.length - 1] | 0;
        var bhiBits = this._countBits(bhi);
        shift = 26 - bhiBits;
        if (shift !== 0) {
          b = b.ushln(shift);
          a.iushln(shift);
          bhi = b.words[b.length - 1] | 0;
        }
        var m = a.length - b.length;
        var q;
        if (mode !== "mod") {
          q = new BN(null);
          q.length = m + 1;
          q.words = new Array(q.length);
          for (var i = 0; i < q.length; i++) {
            q.words[i] = 0;
          }
        }
        var diff = a.clone()._ishlnsubmul(b, 1, m);
        if (diff.negative === 0) {
          a = diff;
          if (q) {
            q.words[m] = 1;
          }
        }
        for (var j = m - 1; j >= 0; j--) {
          var qj = (a.words[b.length + j] | 0) * 67108864 + (a.words[b.length + j - 1] | 0);
          qj = Math.min(qj / bhi | 0, 67108863);
          a._ishlnsubmul(b, qj, j);
          while (a.negative !== 0) {
            qj--;
            a.negative = 0;
            a._ishlnsubmul(b, 1, j);
            if (!a.isZero()) {
              a.negative ^= 1;
            }
          }
          if (q) {
            q.words[j] = qj;
          }
        }
        if (q) {
          q.strip();
        }
        a.strip();
        if (mode !== "div" && shift !== 0) {
          a.iushrn(shift);
        }
        return {
          div: q || null,
          mod: a
        };
      };
      BN.prototype.divmod = function divmod(num, mode, positive) {
        assert(!num.isZero());
        if (this.isZero()) {
          return {
            div: new BN(0),
            mod: new BN(0)
          };
        }
        var div, mod, res;
        if (this.negative !== 0 && num.negative === 0) {
          res = this.neg().divmod(num, mode);
          if (mode !== "mod") {
            div = res.div.neg();
          }
          if (mode !== "div") {
            mod = res.mod.neg();
            if (positive && mod.negative !== 0) {
              mod.iadd(num);
            }
          }
          return {
            div,
            mod
          };
        }
        if (this.negative === 0 && num.negative !== 0) {
          res = this.divmod(num.neg(), mode);
          if (mode !== "mod") {
            div = res.div.neg();
          }
          return {
            div,
            mod: res.mod
          };
        }
        if ((this.negative & num.negative) !== 0) {
          res = this.neg().divmod(num.neg(), mode);
          if (mode !== "div") {
            mod = res.mod.neg();
            if (positive && mod.negative !== 0) {
              mod.isub(num);
            }
          }
          return {
            div: res.div,
            mod
          };
        }
        if (num.length > this.length || this.cmp(num) < 0) {
          return {
            div: new BN(0),
            mod: this
          };
        }
        if (num.length === 1) {
          if (mode === "div") {
            return {
              div: this.divn(num.words[0]),
              mod: null
            };
          }
          if (mode === "mod") {
            return {
              div: null,
              mod: new BN(this.modn(num.words[0]))
            };
          }
          return {
            div: this.divn(num.words[0]),
            mod: new BN(this.modn(num.words[0]))
          };
        }
        return this._wordDiv(num, mode);
      };
      BN.prototype.div = function div(num) {
        return this.divmod(num, "div", false).div;
      };
      BN.prototype.mod = function mod(num) {
        return this.divmod(num, "mod", false).mod;
      };
      BN.prototype.umod = function umod(num) {
        return this.divmod(num, "mod", true).mod;
      };
      BN.prototype.divRound = function divRound(num) {
        var dm = this.divmod(num);
        if (dm.mod.isZero()) return dm.div;
        var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;
        var half = num.ushrn(1);
        var r2 = num.andln(1);
        var cmp = mod.cmp(half);
        if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;
        return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
      };
      BN.prototype.modn = function modn(num) {
        assert(num <= 67108863);
        var p = (1 << 26) % num;
        var acc = 0;
        for (var i = this.length - 1; i >= 0; i--) {
          acc = (p * acc + (this.words[i] | 0)) % num;
        }
        return acc;
      };
      BN.prototype.idivn = function idivn(num) {
        assert(num <= 67108863);
        var carry = 0;
        for (var i = this.length - 1; i >= 0; i--) {
          var w = (this.words[i] | 0) + carry * 67108864;
          this.words[i] = w / num | 0;
          carry = w % num;
        }
        return this.strip();
      };
      BN.prototype.divn = function divn(num) {
        return this.clone().idivn(num);
      };
      BN.prototype.egcd = function egcd(p) {
        assert(p.negative === 0);
        assert(!p.isZero());
        var x = this;
        var y = p.clone();
        if (x.negative !== 0) {
          x = x.umod(p);
        } else {
          x = x.clone();
        }
        var A = new BN(1);
        var B = new BN(0);
        var C = new BN(0);
        var D = new BN(1);
        var g = 0;
        while (x.isEven() && y.isEven()) {
          x.iushrn(1);
          y.iushrn(1);
          ++g;
        }
        var yp = y.clone();
        var xp = x.clone();
        while (!x.isZero()) {
          for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1) ;
          if (i > 0) {
            x.iushrn(i);
            while (i-- > 0) {
              if (A.isOdd() || B.isOdd()) {
                A.iadd(yp);
                B.isub(xp);
              }
              A.iushrn(1);
              B.iushrn(1);
            }
          }
          for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1) ;
          if (j > 0) {
            y.iushrn(j);
            while (j-- > 0) {
              if (C.isOdd() || D.isOdd()) {
                C.iadd(yp);
                D.isub(xp);
              }
              C.iushrn(1);
              D.iushrn(1);
            }
          }
          if (x.cmp(y) >= 0) {
            x.isub(y);
            A.isub(C);
            B.isub(D);
          } else {
            y.isub(x);
            C.isub(A);
            D.isub(B);
          }
        }
        return {
          a: C,
          b: D,
          gcd: y.iushln(g)
        };
      };
      BN.prototype._invmp = function _invmp(p) {
        assert(p.negative === 0);
        assert(!p.isZero());
        var a = this;
        var b = p.clone();
        if (a.negative !== 0) {
          a = a.umod(p);
        } else {
          a = a.clone();
        }
        var x1 = new BN(1);
        var x2 = new BN(0);
        var delta = b.clone();
        while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
          for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1) ;
          if (i > 0) {
            a.iushrn(i);
            while (i-- > 0) {
              if (x1.isOdd()) {
                x1.iadd(delta);
              }
              x1.iushrn(1);
            }
          }
          for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1) ;
          if (j > 0) {
            b.iushrn(j);
            while (j-- > 0) {
              if (x2.isOdd()) {
                x2.iadd(delta);
              }
              x2.iushrn(1);
            }
          }
          if (a.cmp(b) >= 0) {
            a.isub(b);
            x1.isub(x2);
          } else {
            b.isub(a);
            x2.isub(x1);
          }
        }
        var res;
        if (a.cmpn(1) === 0) {
          res = x1;
        } else {
          res = x2;
        }
        if (res.cmpn(0) < 0) {
          res.iadd(p);
        }
        return res;
      };
      BN.prototype.gcd = function gcd(num) {
        if (this.isZero()) return num.abs();
        if (num.isZero()) return this.abs();
        var a = this.clone();
        var b = num.clone();
        a.negative = 0;
        b.negative = 0;
        for (var shift = 0; a.isEven() && b.isEven(); shift++) {
          a.iushrn(1);
          b.iushrn(1);
        }
        do {
          while (a.isEven()) {
            a.iushrn(1);
          }
          while (b.isEven()) {
            b.iushrn(1);
          }
          var r = a.cmp(b);
          if (r < 0) {
            var t = a;
            a = b;
            b = t;
          } else if (r === 0 || b.cmpn(1) === 0) {
            break;
          }
          a.isub(b);
        } while (true);
        return b.iushln(shift);
      };
      BN.prototype.invm = function invm(num) {
        return this.egcd(num).a.umod(num);
      };
      BN.prototype.isEven = function isEven() {
        return (this.words[0] & 1) === 0;
      };
      BN.prototype.isOdd = function isOdd() {
        return (this.words[0] & 1) === 1;
      };
      BN.prototype.andln = function andln(num) {
        return this.words[0] & num;
      };
      BN.prototype.bincn = function bincn(bit) {
        assert(typeof bit === "number");
        var r = bit % 26;
        var s = (bit - r) / 26;
        var q = 1 << r;
        if (this.length <= s) {
          this._expand(s + 1);
          this.words[s] |= q;
          return this;
        }
        var carry = q;
        for (var i = s; carry !== 0 && i < this.length; i++) {
          var w = this.words[i] | 0;
          w += carry;
          carry = w >>> 26;
          w &= 67108863;
          this.words[i] = w;
        }
        if (carry !== 0) {
          this.words[i] = carry;
          this.length++;
        }
        return this;
      };
      BN.prototype.isZero = function isZero() {
        return this.length === 1 && this.words[0] === 0;
      };
      BN.prototype.cmpn = function cmpn(num) {
        var negative = num < 0;
        if (this.negative !== 0 && !negative) return -1;
        if (this.negative === 0 && negative) return 1;
        this.strip();
        var res;
        if (this.length > 1) {
          res = 1;
        } else {
          if (negative) {
            num = -num;
          }
          assert(num <= 67108863, "Number is too big");
          var w = this.words[0] | 0;
          res = w === num ? 0 : w < num ? -1 : 1;
        }
        if (this.negative !== 0) return -res | 0;
        return res;
      };
      BN.prototype.cmp = function cmp(num) {
        if (this.negative !== 0 && num.negative === 0) return -1;
        if (this.negative === 0 && num.negative !== 0) return 1;
        var res = this.ucmp(num);
        if (this.negative !== 0) return -res | 0;
        return res;
      };
      BN.prototype.ucmp = function ucmp(num) {
        if (this.length > num.length) return 1;
        if (this.length < num.length) return -1;
        var res = 0;
        for (var i = this.length - 1; i >= 0; i--) {
          var a = this.words[i] | 0;
          var b = num.words[i] | 0;
          if (a === b) continue;
          if (a < b) {
            res = -1;
          } else if (a > b) {
            res = 1;
          }
          break;
        }
        return res;
      };
      BN.prototype.gtn = function gtn(num) {
        return this.cmpn(num) === 1;
      };
      BN.prototype.gt = function gt(num) {
        return this.cmp(num) === 1;
      };
      BN.prototype.gten = function gten(num) {
        return this.cmpn(num) >= 0;
      };
      BN.prototype.gte = function gte(num) {
        return this.cmp(num) >= 0;
      };
      BN.prototype.ltn = function ltn(num) {
        return this.cmpn(num) === -1;
      };
      BN.prototype.lt = function lt(num) {
        return this.cmp(num) === -1;
      };
      BN.prototype.lten = function lten(num) {
        return this.cmpn(num) <= 0;
      };
      BN.prototype.lte = function lte(num) {
        return this.cmp(num) <= 0;
      };
      BN.prototype.eqn = function eqn(num) {
        return this.cmpn(num) === 0;
      };
      BN.prototype.eq = function eq(num) {
        return this.cmp(num) === 0;
      };
      BN.red = function red(num) {
        return new Red(num);
      };
      BN.prototype.toRed = function toRed(ctx) {
        assert(!this.red, "Already a number in reduction context");
        assert(this.negative === 0, "red works only with positives");
        return ctx.convertTo(this)._forceRed(ctx);
      };
      BN.prototype.fromRed = function fromRed() {
        assert(this.red, "fromRed works only with numbers in reduction context");
        return this.red.convertFrom(this);
      };
      BN.prototype._forceRed = function _forceRed(ctx) {
        this.red = ctx;
        return this;
      };
      BN.prototype.forceRed = function forceRed(ctx) {
        assert(!this.red, "Already a number in reduction context");
        return this._forceRed(ctx);
      };
      BN.prototype.redAdd = function redAdd(num) {
        assert(this.red, "redAdd works only with red numbers");
        return this.red.add(this, num);
      };
      BN.prototype.redIAdd = function redIAdd(num) {
        assert(this.red, "redIAdd works only with red numbers");
        return this.red.iadd(this, num);
      };
      BN.prototype.redSub = function redSub(num) {
        assert(this.red, "redSub works only with red numbers");
        return this.red.sub(this, num);
      };
      BN.prototype.redISub = function redISub(num) {
        assert(this.red, "redISub works only with red numbers");
        return this.red.isub(this, num);
      };
      BN.prototype.redShl = function redShl(num) {
        assert(this.red, "redShl works only with red numbers");
        return this.red.shl(this, num);
      };
      BN.prototype.redMul = function redMul(num) {
        assert(this.red, "redMul works only with red numbers");
        this.red._verify2(this, num);
        return this.red.mul(this, num);
      };
      BN.prototype.redIMul = function redIMul(num) {
        assert(this.red, "redMul works only with red numbers");
        this.red._verify2(this, num);
        return this.red.imul(this, num);
      };
      BN.prototype.redSqr = function redSqr() {
        assert(this.red, "redSqr works only with red numbers");
        this.red._verify1(this);
        return this.red.sqr(this);
      };
      BN.prototype.redISqr = function redISqr() {
        assert(this.red, "redISqr works only with red numbers");
        this.red._verify1(this);
        return this.red.isqr(this);
      };
      BN.prototype.redSqrt = function redSqrt() {
        assert(this.red, "redSqrt works only with red numbers");
        this.red._verify1(this);
        return this.red.sqrt(this);
      };
      BN.prototype.redInvm = function redInvm() {
        assert(this.red, "redInvm works only with red numbers");
        this.red._verify1(this);
        return this.red.invm(this);
      };
      BN.prototype.redNeg = function redNeg() {
        assert(this.red, "redNeg works only with red numbers");
        this.red._verify1(this);
        return this.red.neg(this);
      };
      BN.prototype.redPow = function redPow(num) {
        assert(this.red && !num.red, "redPow(normalNum)");
        this.red._verify1(this);
        return this.red.pow(this, num);
      };
      var primes = {
        k256: null,
        p224: null,
        p192: null,
        p25519: null
      };
      function MPrime(name, p) {
        this.name = name;
        this.p = new BN(p, 16);
        this.n = this.p.bitLength();
        this.k = new BN(1).iushln(this.n).isub(this.p);
        this.tmp = this._tmp();
      }
      MPrime.prototype._tmp = function _tmp() {
        var tmp = new BN(null);
        tmp.words = new Array(Math.ceil(this.n / 13));
        return tmp;
      };
      MPrime.prototype.ireduce = function ireduce(num) {
        var r = num;
        var rlen;
        do {
          this.split(r, this.tmp);
          r = this.imulK(r);
          r = r.iadd(this.tmp);
          rlen = r.bitLength();
        } while (rlen > this.n);
        var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
        if (cmp === 0) {
          r.words[0] = 0;
          r.length = 1;
        } else if (cmp > 0) {
          r.isub(this.p);
        } else {
          if (r.strip !== void 0) {
            r.strip();
          } else {
            r._strip();
          }
        }
        return r;
      };
      MPrime.prototype.split = function split(input, out) {
        input.iushrn(this.n, 0, out);
      };
      MPrime.prototype.imulK = function imulK(num) {
        return num.imul(this.k);
      };
      function K256() {
        MPrime.call(
          this,
          "k256",
          "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
        );
      }
      inherits2(K256, MPrime);
      K256.prototype.split = function split(input, output) {
        var mask = 4194303;
        var outLen = Math.min(input.length, 9);
        for (var i = 0; i < outLen; i++) {
          output.words[i] = input.words[i];
        }
        output.length = outLen;
        if (input.length <= 9) {
          input.words[0] = 0;
          input.length = 1;
          return;
        }
        var prev = input.words[9];
        output.words[output.length++] = prev & mask;
        for (i = 10; i < input.length; i++) {
          var next = input.words[i] | 0;
          input.words[i - 10] = (next & mask) << 4 | prev >>> 22;
          prev = next;
        }
        prev >>>= 22;
        input.words[i - 10] = prev;
        if (prev === 0 && input.length > 10) {
          input.length -= 10;
        } else {
          input.length -= 9;
        }
      };
      K256.prototype.imulK = function imulK(num) {
        num.words[num.length] = 0;
        num.words[num.length + 1] = 0;
        num.length += 2;
        var lo = 0;
        for (var i = 0; i < num.length; i++) {
          var w = num.words[i] | 0;
          lo += w * 977;
          num.words[i] = lo & 67108863;
          lo = w * 64 + (lo / 67108864 | 0);
        }
        if (num.words[num.length - 1] === 0) {
          num.length--;
          if (num.words[num.length - 1] === 0) {
            num.length--;
          }
        }
        return num;
      };
      function P224() {
        MPrime.call(
          this,
          "p224",
          "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
        );
      }
      inherits2(P224, MPrime);
      function P192() {
        MPrime.call(
          this,
          "p192",
          "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
        );
      }
      inherits2(P192, MPrime);
      function P25519() {
        MPrime.call(
          this,
          "25519",
          "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
        );
      }
      inherits2(P25519, MPrime);
      P25519.prototype.imulK = function imulK(num) {
        var carry = 0;
        for (var i = 0; i < num.length; i++) {
          var hi = (num.words[i] | 0) * 19 + carry;
          var lo = hi & 67108863;
          hi >>>= 26;
          num.words[i] = lo;
          carry = hi;
        }
        if (carry !== 0) {
          num.words[num.length++] = carry;
        }
        return num;
      };
      BN._prime = function prime(name) {
        if (primes[name]) return primes[name];
        var prime2;
        if (name === "k256") {
          prime2 = new K256();
        } else if (name === "p224") {
          prime2 = new P224();
        } else if (name === "p192") {
          prime2 = new P192();
        } else if (name === "p25519") {
          prime2 = new P25519();
        } else {
          throw new Error("Unknown prime " + name);
        }
        primes[name] = prime2;
        return prime2;
      };
      function Red(m) {
        if (typeof m === "string") {
          var prime = BN._prime(m);
          this.m = prime.p;
          this.prime = prime;
        } else {
          assert(m.gtn(1), "modulus must be greater than 1");
          this.m = m;
          this.prime = null;
        }
      }
      Red.prototype._verify1 = function _verify1(a) {
        assert(a.negative === 0, "red works only with positives");
        assert(a.red, "red works only with red numbers");
      };
      Red.prototype._verify2 = function _verify2(a, b) {
        assert((a.negative | b.negative) === 0, "red works only with positives");
        assert(
          a.red && a.red === b.red,
          "red works only with red numbers"
        );
      };
      Red.prototype.imod = function imod(a) {
        if (this.prime) return this.prime.ireduce(a)._forceRed(this);
        return a.umod(this.m)._forceRed(this);
      };
      Red.prototype.neg = function neg(a) {
        if (a.isZero()) {
          return a.clone();
        }
        return this.m.sub(a)._forceRed(this);
      };
      Red.prototype.add = function add(a, b) {
        this._verify2(a, b);
        var res = a.add(b);
        if (res.cmp(this.m) >= 0) {
          res.isub(this.m);
        }
        return res._forceRed(this);
      };
      Red.prototype.iadd = function iadd(a, b) {
        this._verify2(a, b);
        var res = a.iadd(b);
        if (res.cmp(this.m) >= 0) {
          res.isub(this.m);
        }
        return res;
      };
      Red.prototype.sub = function sub(a, b) {
        this._verify2(a, b);
        var res = a.sub(b);
        if (res.cmpn(0) < 0) {
          res.iadd(this.m);
        }
        return res._forceRed(this);
      };
      Red.prototype.isub = function isub(a, b) {
        this._verify2(a, b);
        var res = a.isub(b);
        if (res.cmpn(0) < 0) {
          res.iadd(this.m);
        }
        return res;
      };
      Red.prototype.shl = function shl(a, num) {
        this._verify1(a);
        return this.imod(a.ushln(num));
      };
      Red.prototype.imul = function imul(a, b) {
        this._verify2(a, b);
        return this.imod(a.imul(b));
      };
      Red.prototype.mul = function mul(a, b) {
        this._verify2(a, b);
        return this.imod(a.mul(b));
      };
      Red.prototype.isqr = function isqr(a) {
        return this.imul(a, a.clone());
      };
      Red.prototype.sqr = function sqr(a) {
        return this.mul(a, a);
      };
      Red.prototype.sqrt = function sqrt(a) {
        if (a.isZero()) return a.clone();
        var mod3 = this.m.andln(3);
        assert(mod3 % 2 === 1);
        if (mod3 === 3) {
          var pow = this.m.add(new BN(1)).iushrn(2);
          return this.pow(a, pow);
        }
        var q = this.m.subn(1);
        var s = 0;
        while (!q.isZero() && q.andln(1) === 0) {
          s++;
          q.iushrn(1);
        }
        assert(!q.isZero());
        var one = new BN(1).toRed(this);
        var nOne = one.redNeg();
        var lpow = this.m.subn(1).iushrn(1);
        var z = this.m.bitLength();
        z = new BN(2 * z * z).toRed(this);
        while (this.pow(z, lpow).cmp(nOne) !== 0) {
          z.redIAdd(nOne);
        }
        var c = this.pow(z, q);
        var r = this.pow(a, q.addn(1).iushrn(1));
        var t = this.pow(a, q);
        var m = s;
        while (t.cmp(one) !== 0) {
          var tmp = t;
          for (var i = 0; tmp.cmp(one) !== 0; i++) {
            tmp = tmp.redSqr();
          }
          assert(i < m);
          var b = this.pow(c, new BN(1).iushln(m - i - 1));
          r = r.redMul(b);
          c = b.redSqr();
          t = t.redMul(c);
          m = i;
        }
        return r;
      };
      Red.prototype.invm = function invm(a) {
        var inv = a._invmp(this.m);
        if (inv.negative !== 0) {
          inv.negative = 0;
          return this.imod(inv).redNeg();
        } else {
          return this.imod(inv);
        }
      };
      Red.prototype.pow = function pow(a, num) {
        if (num.isZero()) return new BN(1).toRed(this);
        if (num.cmpn(1) === 0) return a.clone();
        var windowSize = 4;
        var wnd = new Array(1 << windowSize);
        wnd[0] = new BN(1).toRed(this);
        wnd[1] = a;
        for (var i = 2; i < wnd.length; i++) {
          wnd[i] = this.mul(wnd[i - 1], a);
        }
        var res = wnd[0];
        var current = 0;
        var currentLen = 0;
        var start = num.bitLength() % 26;
        if (start === 0) {
          start = 26;
        }
        for (i = num.length - 1; i >= 0; i--) {
          var word = num.words[i];
          for (var j = start - 1; j >= 0; j--) {
            var bit = word >> j & 1;
            if (res !== wnd[0]) {
              res = this.sqr(res);
            }
            if (bit === 0 && current === 0) {
              currentLen = 0;
              continue;
            }
            current <<= 1;
            current |= bit;
            currentLen++;
            if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;
            res = this.mul(res, wnd[current]);
            currentLen = 0;
            current = 0;
          }
          start = 26;
        }
        return res;
      };
      Red.prototype.convertTo = function convertTo(num) {
        var r = num.umod(this.m);
        return r === num ? r.clone() : r;
      };
      Red.prototype.convertFrom = function convertFrom(num) {
        var res = num.clone();
        res.red = null;
        return res;
      };
      BN.mont = function mont(num) {
        return new Mont(num);
      };
      function Mont(m) {
        Red.call(this, m);
        this.shift = this.m.bitLength();
        if (this.shift % 26 !== 0) {
          this.shift += 26 - this.shift % 26;
        }
        this.r = new BN(1).iushln(this.shift);
        this.r2 = this.imod(this.r.sqr());
        this.rinv = this.r._invmp(this.m);
        this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
        this.minv = this.minv.umod(this.r);
        this.minv = this.r.sub(this.minv);
      }
      inherits2(Mont, Red);
      Mont.prototype.convertTo = function convertTo(num) {
        return this.imod(num.ushln(this.shift));
      };
      Mont.prototype.convertFrom = function convertFrom(num) {
        var r = this.imod(num.mul(this.rinv));
        r.red = null;
        return r;
      };
      Mont.prototype.imul = function imul(a, b) {
        if (a.isZero() || b.isZero()) {
          a.words[0] = 0;
          a.length = 1;
          return a;
        }
        var t = a.imul(b);
        var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
        var u = t.isub(c).iushrn(this.shift);
        var res = u;
        if (u.cmp(this.m) >= 0) {
          res = u.isub(this.m);
        } else if (u.cmpn(0) < 0) {
          res = u.iadd(this.m);
        }
        return res._forceRed(this);
      };
      Mont.prototype.mul = function mul(a, b) {
        if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);
        var t = a.mul(b);
        var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
        var u = t.isub(c).iushrn(this.shift);
        var res = u;
        if (u.cmp(this.m) >= 0) {
          res = u.isub(this.m);
        } else if (u.cmpn(0) < 0) {
          res = u.iadd(this.m);
        }
        return res._forceRed(this);
      };
      Mont.prototype.invm = function invm(a) {
        var res = this.imod(a._invmp(this.m).mul(this.r2));
        return res._forceRed(this);
      };
    })(module, bn);
  })(bn$1);
  return bn$1.exports;
}
var api = {};
var encoders = {};
var inherits = { exports: {} };
var inherits_browser = { exports: {} };
var hasRequiredInherits_browser;
function requireInherits_browser() {
  if (hasRequiredInherits_browser) return inherits_browser.exports;
  hasRequiredInherits_browser = 1;
  if (typeof Object.create === "function") {
    inherits_browser.exports = function inherits2(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      }
    };
  } else {
    inherits_browser.exports = function inherits2(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {
        };
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }
    };
  }
  return inherits_browser.exports;
}
var hasRequiredInherits;
function requireInherits() {
  if (hasRequiredInherits) return inherits.exports;
  hasRequiredInherits = 1;
  try {
    var util = require("util");
    if (typeof util.inherits !== "function") throw "";
    inherits.exports = util.inherits;
  } catch (e) {
    inherits.exports = requireInherits_browser();
  }
  return inherits.exports;
}
var safer_1;
var hasRequiredSafer;
function requireSafer() {
  if (hasRequiredSafer) return safer_1;
  hasRequiredSafer = 1;
  var buffer2 = require$$0$1;
  var Buffer2 = buffer2.Buffer;
  var safer = {};
  var key;
  for (key in buffer2) {
    if (!buffer2.hasOwnProperty(key)) continue;
    if (key === "SlowBuffer" || key === "Buffer") continue;
    safer[key] = buffer2[key];
  }
  var Safer = safer.Buffer = {};
  for (key in Buffer2) {
    if (!Buffer2.hasOwnProperty(key)) continue;
    if (key === "allocUnsafe" || key === "allocUnsafeSlow") continue;
    Safer[key] = Buffer2[key];
  }
  safer.Buffer.prototype = Buffer2.prototype;
  if (!Safer.from || Safer.from === Uint8Array.from) {
    Safer.from = function(value, encodingOrOffset, length) {
      if (typeof value === "number") {
        throw new TypeError('The "value" argument must not be of type number. Received type ' + typeof value);
      }
      if (value && typeof value.length === "undefined") {
        throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
      }
      return Buffer2(value, encodingOrOffset, length);
    };
  }
  if (!Safer.alloc) {
    Safer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError('The "size" argument must be of type number. Received type ' + typeof size);
      }
      if (size < 0 || size >= 2 * (1 << 30)) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
      var buf = Buffer2(size);
      if (!fill || fill.length === 0) {
        buf.fill(0);
      } else if (typeof encoding === "string") {
        buf.fill(fill, encoding);
      } else {
        buf.fill(fill);
      }
      return buf;
    };
  }
  if (!safer.kStringMaxLength) {
    try {
      safer.kStringMaxLength = process.binding("buffer").kStringMaxLength;
    } catch (e) {
    }
  }
  if (!safer.constants) {
    safer.constants = {
      MAX_LENGTH: safer.kMaxLength
    };
    if (safer.kStringMaxLength) {
      safer.constants.MAX_STRING_LENGTH = safer.kStringMaxLength;
    }
  }
  safer_1 = safer;
  return safer_1;
}
var reporter = {};
var hasRequiredReporter;
function requireReporter() {
  if (hasRequiredReporter) return reporter;
  hasRequiredReporter = 1;
  const inherits2 = requireInherits();
  function Reporter(options) {
    this._reporterState = {
      obj: null,
      path: [],
      options: options || {},
      errors: []
    };
  }
  reporter.Reporter = Reporter;
  Reporter.prototype.isError = function isError(obj) {
    return obj instanceof ReporterError;
  };
  Reporter.prototype.save = function save() {
    const state = this._reporterState;
    return { obj: state.obj, pathLen: state.path.length };
  };
  Reporter.prototype.restore = function restore(data) {
    const state = this._reporterState;
    state.obj = data.obj;
    state.path = state.path.slice(0, data.pathLen);
  };
  Reporter.prototype.enterKey = function enterKey(key) {
    return this._reporterState.path.push(key);
  };
  Reporter.prototype.exitKey = function exitKey(index) {
    const state = this._reporterState;
    state.path = state.path.slice(0, index - 1);
  };
  Reporter.prototype.leaveKey = function leaveKey(index, key, value) {
    const state = this._reporterState;
    this.exitKey(index);
    if (state.obj !== null)
      state.obj[key] = value;
  };
  Reporter.prototype.path = function path() {
    return this._reporterState.path.join("/");
  };
  Reporter.prototype.enterObject = function enterObject() {
    const state = this._reporterState;
    const prev = state.obj;
    state.obj = {};
    return prev;
  };
  Reporter.prototype.leaveObject = function leaveObject(prev) {
    const state = this._reporterState;
    const now = state.obj;
    state.obj = prev;
    return now;
  };
  Reporter.prototype.error = function error(msg) {
    let err;
    const state = this._reporterState;
    const inherited = msg instanceof ReporterError;
    if (inherited) {
      err = msg;
    } else {
      err = new ReporterError(state.path.map(function(elem) {
        return "[" + JSON.stringify(elem) + "]";
      }).join(""), msg.message || msg, msg.stack);
    }
    if (!state.options.partial)
      throw err;
    if (!inherited)
      state.errors.push(err);
    return err;
  };
  Reporter.prototype.wrapResult = function wrapResult(result) {
    const state = this._reporterState;
    if (!state.options.partial)
      return result;
    return {
      result: this.isError(result) ? null : result,
      errors: state.errors
    };
  };
  function ReporterError(path, msg) {
    this.path = path;
    this.rethrow(msg);
  }
  inherits2(ReporterError, Error);
  ReporterError.prototype.rethrow = function rethrow(msg) {
    this.message = msg + " at: " + (this.path || "(shallow)");
    if (Error.captureStackTrace)
      Error.captureStackTrace(this, ReporterError);
    if (!this.stack) {
      try {
        throw new Error(this.message);
      } catch (e) {
        this.stack = e.stack;
      }
    }
    return this;
  };
  return reporter;
}
var buffer = {};
var hasRequiredBuffer;
function requireBuffer() {
  if (hasRequiredBuffer) return buffer;
  hasRequiredBuffer = 1;
  const inherits2 = requireInherits();
  const Reporter = requireReporter().Reporter;
  const Buffer2 = requireSafer().Buffer;
  function DecoderBuffer(base2, options) {
    Reporter.call(this, options);
    if (!Buffer2.isBuffer(base2)) {
      this.error("Input not Buffer");
      return;
    }
    this.base = base2;
    this.offset = 0;
    this.length = base2.length;
  }
  inherits2(DecoderBuffer, Reporter);
  buffer.DecoderBuffer = DecoderBuffer;
  DecoderBuffer.isDecoderBuffer = function isDecoderBuffer(data) {
    if (data instanceof DecoderBuffer) {
      return true;
    }
    const isCompatible = typeof data === "object" && Buffer2.isBuffer(data.base) && data.constructor.name === "DecoderBuffer" && typeof data.offset === "number" && typeof data.length === "number" && typeof data.save === "function" && typeof data.restore === "function" && typeof data.isEmpty === "function" && typeof data.readUInt8 === "function" && typeof data.skip === "function" && typeof data.raw === "function";
    return isCompatible;
  };
  DecoderBuffer.prototype.save = function save() {
    return { offset: this.offset, reporter: Reporter.prototype.save.call(this) };
  };
  DecoderBuffer.prototype.restore = function restore(save) {
    const res = new DecoderBuffer(this.base);
    res.offset = save.offset;
    res.length = this.offset;
    this.offset = save.offset;
    Reporter.prototype.restore.call(this, save.reporter);
    return res;
  };
  DecoderBuffer.prototype.isEmpty = function isEmpty() {
    return this.offset === this.length;
  };
  DecoderBuffer.prototype.readUInt8 = function readUInt8(fail) {
    if (this.offset + 1 <= this.length)
      return this.base.readUInt8(this.offset++, true);
    else
      return this.error(fail || "DecoderBuffer overrun");
  };
  DecoderBuffer.prototype.skip = function skip(bytes, fail) {
    if (!(this.offset + bytes <= this.length))
      return this.error(fail || "DecoderBuffer overrun");
    const res = new DecoderBuffer(this.base);
    res._reporterState = this._reporterState;
    res.offset = this.offset;
    res.length = this.offset + bytes;
    this.offset += bytes;
    return res;
  };
  DecoderBuffer.prototype.raw = function raw(save) {
    return this.base.slice(save ? save.offset : this.offset, this.length);
  };
  function EncoderBuffer(value, reporter2) {
    if (Array.isArray(value)) {
      this.length = 0;
      this.value = value.map(function(item) {
        if (!EncoderBuffer.isEncoderBuffer(item))
          item = new EncoderBuffer(item, reporter2);
        this.length += item.length;
        return item;
      }, this);
    } else if (typeof value === "number") {
      if (!(0 <= value && value <= 255))
        return reporter2.error("non-byte EncoderBuffer value");
      this.value = value;
      this.length = 1;
    } else if (typeof value === "string") {
      this.value = value;
      this.length = Buffer2.byteLength(value);
    } else if (Buffer2.isBuffer(value)) {
      this.value = value;
      this.length = value.length;
    } else {
      return reporter2.error("Unsupported type: " + typeof value);
    }
  }
  buffer.EncoderBuffer = EncoderBuffer;
  EncoderBuffer.isEncoderBuffer = function isEncoderBuffer(data) {
    if (data instanceof EncoderBuffer) {
      return true;
    }
    const isCompatible = typeof data === "object" && data.constructor.name === "EncoderBuffer" && typeof data.length === "number" && typeof data.join === "function";
    return isCompatible;
  };
  EncoderBuffer.prototype.join = function join(out, offset) {
    if (!out)
      out = Buffer2.alloc(this.length);
    if (!offset)
      offset = 0;
    if (this.length === 0)
      return out;
    if (Array.isArray(this.value)) {
      this.value.forEach(function(item) {
        item.join(out, offset);
        offset += item.length;
      });
    } else {
      if (typeof this.value === "number")
        out[offset] = this.value;
      else if (typeof this.value === "string")
        out.write(this.value, offset);
      else if (Buffer2.isBuffer(this.value))
        this.value.copy(out, offset);
      offset += this.length;
    }
    return out;
  };
  return buffer;
}
var minimalisticAssert;
var hasRequiredMinimalisticAssert;
function requireMinimalisticAssert() {
  if (hasRequiredMinimalisticAssert) return minimalisticAssert;
  hasRequiredMinimalisticAssert = 1;
  minimalisticAssert = assert;
  function assert(val, msg) {
    if (!val)
      throw new Error(msg || "Assertion failed");
  }
  assert.equal = function assertEqual(l, r, msg) {
    if (l != r)
      throw new Error(msg || "Assertion failed: " + l + " != " + r);
  };
  return minimalisticAssert;
}
var node$1;
var hasRequiredNode$1;
function requireNode$1() {
  if (hasRequiredNode$1) return node$1;
  hasRequiredNode$1 = 1;
  const Reporter = requireReporter().Reporter;
  const EncoderBuffer = requireBuffer().EncoderBuffer;
  const DecoderBuffer = requireBuffer().DecoderBuffer;
  const assert = requireMinimalisticAssert();
  const tags = [
    "seq",
    "seqof",
    "set",
    "setof",
    "objid",
    "bool",
    "gentime",
    "utctime",
    "null_",
    "enum",
    "int",
    "objDesc",
    "bitstr",
    "bmpstr",
    "charstr",
    "genstr",
    "graphstr",
    "ia5str",
    "iso646str",
    "numstr",
    "octstr",
    "printstr",
    "t61str",
    "unistr",
    "utf8str",
    "videostr"
  ];
  const methods = [
    "key",
    "obj",
    "use",
    "optional",
    "explicit",
    "implicit",
    "def",
    "choice",
    "any",
    "contains"
  ].concat(tags);
  const overrided = [
    "_peekTag",
    "_decodeTag",
    "_use",
    "_decodeStr",
    "_decodeObjid",
    "_decodeTime",
    "_decodeNull",
    "_decodeInt",
    "_decodeBool",
    "_decodeList",
    "_encodeComposite",
    "_encodeStr",
    "_encodeObjid",
    "_encodeTime",
    "_encodeNull",
    "_encodeInt",
    "_encodeBool"
  ];
  function Node(enc, parent, name) {
    const state = {};
    this._baseState = state;
    state.name = name;
    state.enc = enc;
    state.parent = parent || null;
    state.children = null;
    state.tag = null;
    state.args = null;
    state.reverseArgs = null;
    state.choice = null;
    state.optional = false;
    state.any = false;
    state.obj = false;
    state.use = null;
    state.useDecoder = null;
    state.key = null;
    state["default"] = null;
    state.explicit = null;
    state.implicit = null;
    state.contains = null;
    if (!state.parent) {
      state.children = [];
      this._wrap();
    }
  }
  node$1 = Node;
  const stateProps = [
    "enc",
    "parent",
    "children",
    "tag",
    "args",
    "reverseArgs",
    "choice",
    "optional",
    "any",
    "obj",
    "use",
    "alteredUse",
    "key",
    "default",
    "explicit",
    "implicit",
    "contains"
  ];
  Node.prototype.clone = function clone() {
    const state = this._baseState;
    const cstate = {};
    stateProps.forEach(function(prop) {
      cstate[prop] = state[prop];
    });
    const res = new this.constructor(cstate.parent);
    res._baseState = cstate;
    return res;
  };
  Node.prototype._wrap = function wrap() {
    const state = this._baseState;
    methods.forEach(function(method) {
      this[method] = function _wrappedMethod() {
        const clone = new this.constructor(this);
        state.children.push(clone);
        return clone[method].apply(clone, arguments);
      };
    }, this);
  };
  Node.prototype._init = function init(body) {
    const state = this._baseState;
    assert(state.parent === null);
    body.call(this);
    state.children = state.children.filter(function(child) {
      return child._baseState.parent === this;
    }, this);
    assert.equal(state.children.length, 1, "Root node can have only one child");
  };
  Node.prototype._useArgs = function useArgs(args) {
    const state = this._baseState;
    const children = args.filter(function(arg) {
      return arg instanceof this.constructor;
    }, this);
    args = args.filter(function(arg) {
      return !(arg instanceof this.constructor);
    }, this);
    if (children.length !== 0) {
      assert(state.children === null);
      state.children = children;
      children.forEach(function(child) {
        child._baseState.parent = this;
      }, this);
    }
    if (args.length !== 0) {
      assert(state.args === null);
      state.args = args;
      state.reverseArgs = args.map(function(arg) {
        if (typeof arg !== "object" || arg.constructor !== Object)
          return arg;
        const res = {};
        Object.keys(arg).forEach(function(key) {
          if (key == (key | 0))
            key |= 0;
          const value = arg[key];
          res[value] = key;
        });
        return res;
      });
    }
  };
  overrided.forEach(function(method) {
    Node.prototype[method] = function _overrided() {
      const state = this._baseState;
      throw new Error(method + " not implemented for encoding: " + state.enc);
    };
  });
  tags.forEach(function(tag) {
    Node.prototype[tag] = function _tagMethod() {
      const state = this._baseState;
      const args = Array.prototype.slice.call(arguments);
      assert(state.tag === null);
      state.tag = tag;
      this._useArgs(args);
      return this;
    };
  });
  Node.prototype.use = function use(item) {
    assert(item);
    const state = this._baseState;
    assert(state.use === null);
    state.use = item;
    return this;
  };
  Node.prototype.optional = function optional() {
    const state = this._baseState;
    state.optional = true;
    return this;
  };
  Node.prototype.def = function def(val) {
    const state = this._baseState;
    assert(state["default"] === null);
    state["default"] = val;
    state.optional = true;
    return this;
  };
  Node.prototype.explicit = function explicit(num) {
    const state = this._baseState;
    assert(state.explicit === null && state.implicit === null);
    state.explicit = num;
    return this;
  };
  Node.prototype.implicit = function implicit(num) {
    const state = this._baseState;
    assert(state.explicit === null && state.implicit === null);
    state.implicit = num;
    return this;
  };
  Node.prototype.obj = function obj() {
    const state = this._baseState;
    const args = Array.prototype.slice.call(arguments);
    state.obj = true;
    if (args.length !== 0)
      this._useArgs(args);
    return this;
  };
  Node.prototype.key = function key(newKey) {
    const state = this._baseState;
    assert(state.key === null);
    state.key = newKey;
    return this;
  };
  Node.prototype.any = function any() {
    const state = this._baseState;
    state.any = true;
    return this;
  };
  Node.prototype.choice = function choice(obj) {
    const state = this._baseState;
    assert(state.choice === null);
    state.choice = obj;
    this._useArgs(Object.keys(obj).map(function(key) {
      return obj[key];
    }));
    return this;
  };
  Node.prototype.contains = function contains(item) {
    const state = this._baseState;
    assert(state.use === null);
    state.contains = item;
    return this;
  };
  Node.prototype._decode = function decode2(input, options) {
    const state = this._baseState;
    if (state.parent === null)
      return input.wrapResult(state.children[0]._decode(input, options));
    let result = state["default"];
    let present = true;
    let prevKey = null;
    if (state.key !== null)
      prevKey = input.enterKey(state.key);
    if (state.optional) {
      let tag = null;
      if (state.explicit !== null)
        tag = state.explicit;
      else if (state.implicit !== null)
        tag = state.implicit;
      else if (state.tag !== null)
        tag = state.tag;
      if (tag === null && !state.any) {
        const save = input.save();
        try {
          if (state.choice === null)
            this._decodeGeneric(state.tag, input, options);
          else
            this._decodeChoice(input, options);
          present = true;
        } catch (e) {
          present = false;
        }
        input.restore(save);
      } else {
        present = this._peekTag(input, tag, state.any);
        if (input.isError(present))
          return present;
      }
    }
    let prevObj;
    if (state.obj && present)
      prevObj = input.enterObject();
    if (present) {
      if (state.explicit !== null) {
        const explicit = this._decodeTag(input, state.explicit);
        if (input.isError(explicit))
          return explicit;
        input = explicit;
      }
      const start = input.offset;
      if (state.use === null && state.choice === null) {
        let save;
        if (state.any)
          save = input.save();
        const body = this._decodeTag(
          input,
          state.implicit !== null ? state.implicit : state.tag,
          state.any
        );
        if (input.isError(body))
          return body;
        if (state.any)
          result = input.raw(save);
        else
          input = body;
      }
      if (options && options.track && state.tag !== null)
        options.track(input.path(), start, input.length, "tagged");
      if (options && options.track && state.tag !== null)
        options.track(input.path(), input.offset, input.length, "content");
      if (state.any) ;
      else if (state.choice === null) {
        result = this._decodeGeneric(state.tag, input, options);
      } else {
        result = this._decodeChoice(input, options);
      }
      if (input.isError(result))
        return result;
      if (!state.any && state.choice === null && state.children !== null) {
        state.children.forEach(function decodeChildren(child) {
          child._decode(input, options);
        });
      }
      if (state.contains && (state.tag === "octstr" || state.tag === "bitstr")) {
        const data = new DecoderBuffer(result);
        result = this._getUse(state.contains, input._reporterState.obj)._decode(data, options);
      }
    }
    if (state.obj && present)
      result = input.leaveObject(prevObj);
    if (state.key !== null && (result !== null || present === true))
      input.leaveKey(prevKey, state.key, result);
    else if (prevKey !== null)
      input.exitKey(prevKey);
    return result;
  };
  Node.prototype._decodeGeneric = function decodeGeneric(tag, input, options) {
    const state = this._baseState;
    if (tag === "seq" || tag === "set")
      return null;
    if (tag === "seqof" || tag === "setof")
      return this._decodeList(input, tag, state.args[0], options);
    else if (/str$/.test(tag))
      return this._decodeStr(input, tag, options);
    else if (tag === "objid" && state.args)
      return this._decodeObjid(input, state.args[0], state.args[1], options);
    else if (tag === "objid")
      return this._decodeObjid(input, null, null, options);
    else if (tag === "gentime" || tag === "utctime")
      return this._decodeTime(input, tag, options);
    else if (tag === "null_")
      return this._decodeNull(input, options);
    else if (tag === "bool")
      return this._decodeBool(input, options);
    else if (tag === "objDesc")
      return this._decodeStr(input, tag, options);
    else if (tag === "int" || tag === "enum")
      return this._decodeInt(input, state.args && state.args[0], options);
    if (state.use !== null) {
      return this._getUse(state.use, input._reporterState.obj)._decode(input, options);
    } else {
      return input.error("unknown tag: " + tag);
    }
  };
  Node.prototype._getUse = function _getUse(entity, obj) {
    const state = this._baseState;
    state.useDecoder = this._use(entity, obj);
    assert(state.useDecoder._baseState.parent === null);
    state.useDecoder = state.useDecoder._baseState.children[0];
    if (state.implicit !== state.useDecoder._baseState.implicit) {
      state.useDecoder = state.useDecoder.clone();
      state.useDecoder._baseState.implicit = state.implicit;
    }
    return state.useDecoder;
  };
  Node.prototype._decodeChoice = function decodeChoice(input, options) {
    const state = this._baseState;
    let result = null;
    let match = false;
    Object.keys(state.choice).some(function(key) {
      const save = input.save();
      const node2 = state.choice[key];
      try {
        const value = node2._decode(input, options);
        if (input.isError(value))
          return false;
        result = { type: key, value };
        match = true;
      } catch (e) {
        input.restore(save);
        return false;
      }
      return true;
    }, this);
    if (!match)
      return input.error("Choice not matched");
    return result;
  };
  Node.prototype._createEncoderBuffer = function createEncoderBuffer(data) {
    return new EncoderBuffer(data, this.reporter);
  };
  Node.prototype._encode = function encode2(data, reporter2, parent) {
    const state = this._baseState;
    if (state["default"] !== null && state["default"] === data)
      return;
    const result = this._encodeValue(data, reporter2, parent);
    if (result === void 0)
      return;
    if (this._skipDefault(result, reporter2, parent))
      return;
    return result;
  };
  Node.prototype._encodeValue = function encode2(data, reporter2, parent) {
    const state = this._baseState;
    if (state.parent === null)
      return state.children[0]._encode(data, reporter2 || new Reporter());
    let result = null;
    this.reporter = reporter2;
    if (state.optional && data === void 0) {
      if (state["default"] !== null)
        data = state["default"];
      else
        return;
    }
    let content = null;
    let primitive = false;
    if (state.any) {
      result = this._createEncoderBuffer(data);
    } else if (state.choice) {
      result = this._encodeChoice(data, reporter2);
    } else if (state.contains) {
      content = this._getUse(state.contains, parent)._encode(data, reporter2);
      primitive = true;
    } else if (state.children) {
      content = state.children.map(function(child) {
        if (child._baseState.tag === "null_")
          return child._encode(null, reporter2, data);
        if (child._baseState.key === null)
          return reporter2.error("Child should have a key");
        const prevKey = reporter2.enterKey(child._baseState.key);
        if (typeof data !== "object")
          return reporter2.error("Child expected, but input is not object");
        const res = child._encode(data[child._baseState.key], reporter2, data);
        reporter2.leaveKey(prevKey);
        return res;
      }, this).filter(function(child) {
        return child;
      });
      content = this._createEncoderBuffer(content);
    } else {
      if (state.tag === "seqof" || state.tag === "setof") {
        if (!(state.args && state.args.length === 1))
          return reporter2.error("Too many args for : " + state.tag);
        if (!Array.isArray(data))
          return reporter2.error("seqof/setof, but data is not Array");
        const child = this.clone();
        child._baseState.implicit = null;
        content = this._createEncoderBuffer(data.map(function(item) {
          const state2 = this._baseState;
          return this._getUse(state2.args[0], data)._encode(item, reporter2);
        }, child));
      } else if (state.use !== null) {
        result = this._getUse(state.use, parent)._encode(data, reporter2);
      } else {
        content = this._encodePrimitive(state.tag, data);
        primitive = true;
      }
    }
    if (!state.any && state.choice === null) {
      const tag = state.implicit !== null ? state.implicit : state.tag;
      const cls = state.implicit === null ? "universal" : "context";
      if (tag === null) {
        if (state.use === null)
          reporter2.error("Tag could be omitted only for .use()");
      } else {
        if (state.use === null)
          result = this._encodeComposite(tag, primitive, cls, content);
      }
    }
    if (state.explicit !== null)
      result = this._encodeComposite(state.explicit, false, "context", result);
    return result;
  };
  Node.prototype._encodeChoice = function encodeChoice(data, reporter2) {
    const state = this._baseState;
    const node2 = state.choice[data.type];
    if (!node2) {
      assert(
        false,
        data.type + " not found in " + JSON.stringify(Object.keys(state.choice))
      );
    }
    return node2._encode(data.value, reporter2);
  };
  Node.prototype._encodePrimitive = function encodePrimitive(tag, data) {
    const state = this._baseState;
    if (/str$/.test(tag))
      return this._encodeStr(data, tag);
    else if (tag === "objid" && state.args)
      return this._encodeObjid(data, state.reverseArgs[0], state.args[1]);
    else if (tag === "objid")
      return this._encodeObjid(data, null, null);
    else if (tag === "gentime" || tag === "utctime")
      return this._encodeTime(data, tag);
    else if (tag === "null_")
      return this._encodeNull();
    else if (tag === "int" || tag === "enum")
      return this._encodeInt(data, state.args && state.reverseArgs[0]);
    else if (tag === "bool")
      return this._encodeBool(data);
    else if (tag === "objDesc")
      return this._encodeStr(data, tag);
    else
      throw new Error("Unsupported tag: " + tag);
  };
  Node.prototype._isNumstr = function isNumstr(str) {
    return /^[0-9 ]*$/.test(str);
  };
  Node.prototype._isPrintstr = function isPrintstr(str) {
    return /^[A-Za-z0-9 '()+,-./:=?]*$/.test(str);
  };
  return node$1;
}
var der = {};
var hasRequiredDer$2;
function requireDer$2() {
  if (hasRequiredDer$2) return der;
  hasRequiredDer$2 = 1;
  (function(exports$1) {
    function reverse(map) {
      const res = {};
      Object.keys(map).forEach(function(key) {
        if ((key | 0) == key)
          key = key | 0;
        const value = map[key];
        res[value] = key;
      });
      return res;
    }
    exports$1.tagClass = {
      0: "universal",
      1: "application",
      2: "context",
      3: "private"
    };
    exports$1.tagClassByName = reverse(exports$1.tagClass);
    exports$1.tag = {
      0: "end",
      1: "bool",
      2: "int",
      3: "bitstr",
      4: "octstr",
      5: "null_",
      6: "objid",
      7: "objDesc",
      8: "external",
      9: "real",
      10: "enum",
      11: "embed",
      12: "utf8str",
      13: "relativeOid",
      16: "seq",
      17: "set",
      18: "numstr",
      19: "printstr",
      20: "t61str",
      21: "videostr",
      22: "ia5str",
      23: "utctime",
      24: "gentime",
      25: "graphstr",
      26: "iso646str",
      27: "genstr",
      28: "unistr",
      29: "charstr",
      30: "bmpstr"
    };
    exports$1.tagByName = reverse(exports$1.tag);
  })(der);
  return der;
}
var der_1$1;
var hasRequiredDer$1;
function requireDer$1() {
  if (hasRequiredDer$1) return der_1$1;
  hasRequiredDer$1 = 1;
  const inherits2 = requireInherits();
  const Buffer2 = requireSafer().Buffer;
  const Node = requireNode$1();
  const der2 = requireDer$2();
  function DEREncoder(entity) {
    this.enc = "der";
    this.name = entity.name;
    this.entity = entity;
    this.tree = new DERNode();
    this.tree._init(entity.body);
  }
  der_1$1 = DEREncoder;
  DEREncoder.prototype.encode = function encode2(data, reporter2) {
    return this.tree._encode(data, reporter2).join();
  };
  function DERNode(parent) {
    Node.call(this, "der", parent);
  }
  inherits2(DERNode, Node);
  DERNode.prototype._encodeComposite = function encodeComposite(tag, primitive, cls, content) {
    const encodedTag = encodeTag(tag, primitive, cls, this.reporter);
    if (content.length < 128) {
      const header2 = Buffer2.alloc(2);
      header2[0] = encodedTag;
      header2[1] = content.length;
      return this._createEncoderBuffer([header2, content]);
    }
    let lenOctets = 1;
    for (let i = content.length; i >= 256; i >>= 8)
      lenOctets++;
    const header = Buffer2.alloc(1 + 1 + lenOctets);
    header[0] = encodedTag;
    header[1] = 128 | lenOctets;
    for (let i = 1 + lenOctets, j = content.length; j > 0; i--, j >>= 8)
      header[i] = j & 255;
    return this._createEncoderBuffer([header, content]);
  };
  DERNode.prototype._encodeStr = function encodeStr(str, tag) {
    if (tag === "bitstr") {
      return this._createEncoderBuffer([str.unused | 0, str.data]);
    } else if (tag === "bmpstr") {
      const buf = Buffer2.alloc(str.length * 2);
      for (let i = 0; i < str.length; i++) {
        buf.writeUInt16BE(str.charCodeAt(i), i * 2);
      }
      return this._createEncoderBuffer(buf);
    } else if (tag === "numstr") {
      if (!this._isNumstr(str)) {
        return this.reporter.error("Encoding of string type: numstr supports only digits and space");
      }
      return this._createEncoderBuffer(str);
    } else if (tag === "printstr") {
      if (!this._isPrintstr(str)) {
        return this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark");
      }
      return this._createEncoderBuffer(str);
    } else if (/str$/.test(tag)) {
      return this._createEncoderBuffer(str);
    } else if (tag === "objDesc") {
      return this._createEncoderBuffer(str);
    } else {
      return this.reporter.error("Encoding of string type: " + tag + " unsupported");
    }
  };
  DERNode.prototype._encodeObjid = function encodeObjid(id, values, relative) {
    if (typeof id === "string") {
      if (!values)
        return this.reporter.error("string objid given, but no values map found");
      if (!values.hasOwnProperty(id))
        return this.reporter.error("objid not found in values map");
      id = values[id].split(/[\s.]+/g);
      for (let i = 0; i < id.length; i++)
        id[i] |= 0;
    } else if (Array.isArray(id)) {
      id = id.slice();
      for (let i = 0; i < id.length; i++)
        id[i] |= 0;
    }
    if (!Array.isArray(id)) {
      return this.reporter.error("objid() should be either array or string, got: " + JSON.stringify(id));
    }
    if (!relative) {
      if (id[1] >= 40)
        return this.reporter.error("Second objid identifier OOB");
      id.splice(0, 2, id[0] * 40 + id[1]);
    }
    let size = 0;
    for (let i = 0; i < id.length; i++) {
      let ident = id[i];
      for (size++; ident >= 128; ident >>= 7)
        size++;
    }
    const objid = Buffer2.alloc(size);
    let offset = objid.length - 1;
    for (let i = id.length - 1; i >= 0; i--) {
      let ident = id[i];
      objid[offset--] = ident & 127;
      while ((ident >>= 7) > 0)
        objid[offset--] = 128 | ident & 127;
    }
    return this._createEncoderBuffer(objid);
  };
  function two(num) {
    if (num < 10)
      return "0" + num;
    else
      return num;
  }
  DERNode.prototype._encodeTime = function encodeTime(time, tag) {
    let str;
    const date = new Date(time);
    if (tag === "gentime") {
      str = [
        two(date.getUTCFullYear()),
        two(date.getUTCMonth() + 1),
        two(date.getUTCDate()),
        two(date.getUTCHours()),
        two(date.getUTCMinutes()),
        two(date.getUTCSeconds()),
        "Z"
      ].join("");
    } else if (tag === "utctime") {
      str = [
        two(date.getUTCFullYear() % 100),
        two(date.getUTCMonth() + 1),
        two(date.getUTCDate()),
        two(date.getUTCHours()),
        two(date.getUTCMinutes()),
        two(date.getUTCSeconds()),
        "Z"
      ].join("");
    } else {
      this.reporter.error("Encoding " + tag + " time is not supported yet");
    }
    return this._encodeStr(str, "octstr");
  };
  DERNode.prototype._encodeNull = function encodeNull() {
    return this._createEncoderBuffer("");
  };
  DERNode.prototype._encodeInt = function encodeInt(num, values) {
    if (typeof num === "string") {
      if (!values)
        return this.reporter.error("String int or enum given, but no values map");
      if (!values.hasOwnProperty(num)) {
        return this.reporter.error("Values map doesn't contain: " + JSON.stringify(num));
      }
      num = values[num];
    }
    if (typeof num !== "number" && !Buffer2.isBuffer(num)) {
      const numArray = num.toArray();
      if (!num.sign && numArray[0] & 128) {
        numArray.unshift(0);
      }
      num = Buffer2.from(numArray);
    }
    if (Buffer2.isBuffer(num)) {
      let size2 = num.length;
      if (num.length === 0)
        size2++;
      const out2 = Buffer2.alloc(size2);
      num.copy(out2);
      if (num.length === 0)
        out2[0] = 0;
      return this._createEncoderBuffer(out2);
    }
    if (num < 128)
      return this._createEncoderBuffer(num);
    if (num < 256)
      return this._createEncoderBuffer([0, num]);
    let size = 1;
    for (let i = num; i >= 256; i >>= 8)
      size++;
    const out = new Array(size);
    for (let i = out.length - 1; i >= 0; i--) {
      out[i] = num & 255;
      num >>= 8;
    }
    if (out[0] & 128) {
      out.unshift(0);
    }
    return this._createEncoderBuffer(Buffer2.from(out));
  };
  DERNode.prototype._encodeBool = function encodeBool(value) {
    return this._createEncoderBuffer(value ? 255 : 0);
  };
  DERNode.prototype._use = function use(entity, obj) {
    if (typeof entity === "function")
      entity = entity(obj);
    return entity._getEncoder("der").tree;
  };
  DERNode.prototype._skipDefault = function skipDefault(dataBuffer, reporter2, parent) {
    const state = this._baseState;
    let i;
    if (state["default"] === null)
      return false;
    const data = dataBuffer.join();
    if (state.defaultBuffer === void 0)
      state.defaultBuffer = this._encodeValue(state["default"], reporter2, parent).join();
    if (data.length !== state.defaultBuffer.length)
      return false;
    for (i = 0; i < data.length; i++)
      if (data[i] !== state.defaultBuffer[i])
        return false;
    return true;
  };
  function encodeTag(tag, primitive, cls, reporter2) {
    let res;
    if (tag === "seqof")
      tag = "seq";
    else if (tag === "setof")
      tag = "set";
    if (der2.tagByName.hasOwnProperty(tag))
      res = der2.tagByName[tag];
    else if (typeof tag === "number" && (tag | 0) === tag)
      res = tag;
    else
      return reporter2.error("Unknown tag: " + tag);
    if (res >= 31)
      return reporter2.error("Multi-octet tag encoding unsupported");
    if (!primitive)
      res |= 32;
    res |= der2.tagClassByName[cls || "universal"] << 6;
    return res;
  }
  return der_1$1;
}
var pem$1;
var hasRequiredPem$1;
function requirePem$1() {
  if (hasRequiredPem$1) return pem$1;
  hasRequiredPem$1 = 1;
  const inherits2 = requireInherits();
  const DEREncoder = requireDer$1();
  function PEMEncoder(entity) {
    DEREncoder.call(this, entity);
    this.enc = "pem";
  }
  inherits2(PEMEncoder, DEREncoder);
  pem$1 = PEMEncoder;
  PEMEncoder.prototype.encode = function encode2(data, options) {
    const buf = DEREncoder.prototype.encode.call(this, data);
    const p = buf.toString("base64");
    const out = ["-----BEGIN " + options.label + "-----"];
    for (let i = 0; i < p.length; i += 64)
      out.push(p.slice(i, i + 64));
    out.push("-----END " + options.label + "-----");
    return out.join("\n");
  };
  return pem$1;
}
var hasRequiredEncoders;
function requireEncoders() {
  if (hasRequiredEncoders) return encoders;
  hasRequiredEncoders = 1;
  (function(exports$1) {
    const encoders2 = exports$1;
    encoders2.der = requireDer$1();
    encoders2.pem = requirePem$1();
  })(encoders);
  return encoders;
}
var decoders = {};
var der_1;
var hasRequiredDer;
function requireDer() {
  if (hasRequiredDer) return der_1;
  hasRequiredDer = 1;
  const inherits2 = requireInherits();
  const bignum = requireBn();
  const DecoderBuffer = requireBuffer().DecoderBuffer;
  const Node = requireNode$1();
  const der2 = requireDer$2();
  function DERDecoder(entity) {
    this.enc = "der";
    this.name = entity.name;
    this.entity = entity;
    this.tree = new DERNode();
    this.tree._init(entity.body);
  }
  der_1 = DERDecoder;
  DERDecoder.prototype.decode = function decode2(data, options) {
    if (!DecoderBuffer.isDecoderBuffer(data)) {
      data = new DecoderBuffer(data, options);
    }
    return this.tree._decode(data, options);
  };
  function DERNode(parent) {
    Node.call(this, "der", parent);
  }
  inherits2(DERNode, Node);
  DERNode.prototype._peekTag = function peekTag(buffer2, tag, any) {
    if (buffer2.isEmpty())
      return false;
    const state = buffer2.save();
    const decodedTag = derDecodeTag(buffer2, 'Failed to peek tag: "' + tag + '"');
    if (buffer2.isError(decodedTag))
      return decodedTag;
    buffer2.restore(state);
    return decodedTag.tag === tag || decodedTag.tagStr === tag || decodedTag.tagStr + "of" === tag || any;
  };
  DERNode.prototype._decodeTag = function decodeTag(buffer2, tag, any) {
    const decodedTag = derDecodeTag(
      buffer2,
      'Failed to decode tag of "' + tag + '"'
    );
    if (buffer2.isError(decodedTag))
      return decodedTag;
    let len = derDecodeLen(
      buffer2,
      decodedTag.primitive,
      'Failed to get length of "' + tag + '"'
    );
    if (buffer2.isError(len))
      return len;
    if (!any && decodedTag.tag !== tag && decodedTag.tagStr !== tag && decodedTag.tagStr + "of" !== tag) {
      return buffer2.error('Failed to match tag: "' + tag + '"');
    }
    if (decodedTag.primitive || len !== null)
      return buffer2.skip(len, 'Failed to match body of: "' + tag + '"');
    const state = buffer2.save();
    const res = this._skipUntilEnd(
      buffer2,
      'Failed to skip indefinite length body: "' + this.tag + '"'
    );
    if (buffer2.isError(res))
      return res;
    len = buffer2.offset - state.offset;
    buffer2.restore(state);
    return buffer2.skip(len, 'Failed to match body of: "' + tag + '"');
  };
  DERNode.prototype._skipUntilEnd = function skipUntilEnd(buffer2, fail) {
    for (; ; ) {
      const tag = derDecodeTag(buffer2, fail);
      if (buffer2.isError(tag))
        return tag;
      const len = derDecodeLen(buffer2, tag.primitive, fail);
      if (buffer2.isError(len))
        return len;
      let res;
      if (tag.primitive || len !== null)
        res = buffer2.skip(len);
      else
        res = this._skipUntilEnd(buffer2, fail);
      if (buffer2.isError(res))
        return res;
      if (tag.tagStr === "end")
        break;
    }
  };
  DERNode.prototype._decodeList = function decodeList(buffer2, tag, decoder, options) {
    const result = [];
    while (!buffer2.isEmpty()) {
      const possibleEnd = this._peekTag(buffer2, "end");
      if (buffer2.isError(possibleEnd))
        return possibleEnd;
      const res = decoder.decode(buffer2, "der", options);
      if (buffer2.isError(res) && possibleEnd)
        break;
      result.push(res);
    }
    return result;
  };
  DERNode.prototype._decodeStr = function decodeStr(buffer2, tag) {
    if (tag === "bitstr") {
      const unused = buffer2.readUInt8();
      if (buffer2.isError(unused))
        return unused;
      return { unused, data: buffer2.raw() };
    } else if (tag === "bmpstr") {
      const raw = buffer2.raw();
      if (raw.length % 2 === 1)
        return buffer2.error("Decoding of string type: bmpstr length mismatch");
      let str = "";
      for (let i = 0; i < raw.length / 2; i++) {
        str += String.fromCharCode(raw.readUInt16BE(i * 2));
      }
      return str;
    } else if (tag === "numstr") {
      const numstr = buffer2.raw().toString("ascii");
      if (!this._isNumstr(numstr)) {
        return buffer2.error("Decoding of string type: numstr unsupported characters");
      }
      return numstr;
    } else if (tag === "octstr") {
      return buffer2.raw();
    } else if (tag === "objDesc") {
      return buffer2.raw();
    } else if (tag === "printstr") {
      const printstr = buffer2.raw().toString("ascii");
      if (!this._isPrintstr(printstr)) {
        return buffer2.error("Decoding of string type: printstr unsupported characters");
      }
      return printstr;
    } else if (/str$/.test(tag)) {
      return buffer2.raw().toString();
    } else {
      return buffer2.error("Decoding of string type: " + tag + " unsupported");
    }
  };
  DERNode.prototype._decodeObjid = function decodeObjid(buffer2, values, relative) {
    let result;
    const identifiers = [];
    let ident = 0;
    let subident = 0;
    while (!buffer2.isEmpty()) {
      subident = buffer2.readUInt8();
      ident <<= 7;
      ident |= subident & 127;
      if ((subident & 128) === 0) {
        identifiers.push(ident);
        ident = 0;
      }
    }
    if (subident & 128)
      identifiers.push(ident);
    const first = identifiers[0] / 40 | 0;
    const second = identifiers[0] % 40;
    if (relative)
      result = identifiers;
    else
      result = [first, second].concat(identifiers.slice(1));
    if (values) {
      let tmp = values[result.join(" ")];
      if (tmp === void 0)
        tmp = values[result.join(".")];
      if (tmp !== void 0)
        result = tmp;
    }
    return result;
  };
  DERNode.prototype._decodeTime = function decodeTime(buffer2, tag) {
    const str = buffer2.raw().toString();
    let year;
    let mon;
    let day;
    let hour;
    let min;
    let sec;
    if (tag === "gentime") {
      year = str.slice(0, 4) | 0;
      mon = str.slice(4, 6) | 0;
      day = str.slice(6, 8) | 0;
      hour = str.slice(8, 10) | 0;
      min = str.slice(10, 12) | 0;
      sec = str.slice(12, 14) | 0;
    } else if (tag === "utctime") {
      year = str.slice(0, 2) | 0;
      mon = str.slice(2, 4) | 0;
      day = str.slice(4, 6) | 0;
      hour = str.slice(6, 8) | 0;
      min = str.slice(8, 10) | 0;
      sec = str.slice(10, 12) | 0;
      if (year < 70)
        year = 2e3 + year;
      else
        year = 1900 + year;
    } else {
      return buffer2.error("Decoding " + tag + " time is not supported yet");
    }
    return Date.UTC(year, mon - 1, day, hour, min, sec, 0);
  };
  DERNode.prototype._decodeNull = function decodeNull() {
    return null;
  };
  DERNode.prototype._decodeBool = function decodeBool(buffer2) {
    const res = buffer2.readUInt8();
    if (buffer2.isError(res))
      return res;
    else
      return res !== 0;
  };
  DERNode.prototype._decodeInt = function decodeInt(buffer2, values) {
    const raw = buffer2.raw();
    let res = new bignum(raw);
    if (values)
      res = values[res.toString(10)] || res;
    return res;
  };
  DERNode.prototype._use = function use(entity, obj) {
    if (typeof entity === "function")
      entity = entity(obj);
    return entity._getDecoder("der").tree;
  };
  function derDecodeTag(buf, fail) {
    let tag = buf.readUInt8(fail);
    if (buf.isError(tag))
      return tag;
    const cls = der2.tagClass[tag >> 6];
    const primitive = (tag & 32) === 0;
    if ((tag & 31) === 31) {
      let oct = tag;
      tag = 0;
      while ((oct & 128) === 128) {
        oct = buf.readUInt8(fail);
        if (buf.isError(oct))
          return oct;
        tag <<= 7;
        tag |= oct & 127;
      }
    } else {
      tag &= 31;
    }
    const tagStr = der2.tag[tag];
    return {
      cls,
      primitive,
      tag,
      tagStr
    };
  }
  function derDecodeLen(buf, primitive, fail) {
    let len = buf.readUInt8(fail);
    if (buf.isError(len))
      return len;
    if (!primitive && len === 128)
      return null;
    if ((len & 128) === 0) {
      return len;
    }
    const num = len & 127;
    if (num > 4)
      return buf.error("length octect is too long");
    len = 0;
    for (let i = 0; i < num; i++) {
      len <<= 8;
      const j = buf.readUInt8(fail);
      if (buf.isError(j))
        return j;
      len |= j;
    }
    return len;
  }
  return der_1;
}
var pem;
var hasRequiredPem;
function requirePem() {
  if (hasRequiredPem) return pem;
  hasRequiredPem = 1;
  const inherits2 = requireInherits();
  const Buffer2 = requireSafer().Buffer;
  const DERDecoder = requireDer();
  function PEMDecoder(entity) {
    DERDecoder.call(this, entity);
    this.enc = "pem";
  }
  inherits2(PEMDecoder, DERDecoder);
  pem = PEMDecoder;
  PEMDecoder.prototype.decode = function decode2(data, options) {
    const lines = data.toString().split(/[\r\n]+/g);
    const label = options.label.toUpperCase();
    const re = /^-----(BEGIN|END) ([^-]+)-----$/;
    let start = -1;
    let end = -1;
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(re);
      if (match === null)
        continue;
      if (match[2] !== label)
        continue;
      if (start === -1) {
        if (match[1] !== "BEGIN")
          break;
        start = i;
      } else {
        if (match[1] !== "END")
          break;
        end = i;
        break;
      }
    }
    if (start === -1 || end === -1)
      throw new Error("PEM section not found for: " + label);
    const base64 = lines.slice(start + 1, end).join("");
    base64.replace(/[^a-z0-9+/=]+/gi, "");
    const input = Buffer2.from(base64, "base64");
    return DERDecoder.prototype.decode.call(this, input, options);
  };
  return pem;
}
var hasRequiredDecoders;
function requireDecoders() {
  if (hasRequiredDecoders) return decoders;
  hasRequiredDecoders = 1;
  (function(exports$1) {
    const decoders2 = exports$1;
    decoders2.der = requireDer();
    decoders2.pem = requirePem();
  })(decoders);
  return decoders;
}
var hasRequiredApi;
function requireApi() {
  if (hasRequiredApi) return api;
  hasRequiredApi = 1;
  (function(exports$1) {
    const encoders2 = requireEncoders();
    const decoders2 = requireDecoders();
    const inherits2 = requireInherits();
    const api2 = exports$1;
    api2.define = function define(name, body) {
      return new Entity(name, body);
    };
    function Entity(name, body) {
      this.name = name;
      this.body = body;
      this.decoders = {};
      this.encoders = {};
    }
    Entity.prototype._createNamed = function createNamed(Base) {
      const name = this.name;
      function Generated(entity) {
        this._initNamed(entity, name);
      }
      inherits2(Generated, Base);
      Generated.prototype._initNamed = function _initNamed(entity, name2) {
        Base.call(this, entity, name2);
      };
      return new Generated(this);
    };
    Entity.prototype._getDecoder = function _getDecoder(enc) {
      enc = enc || "der";
      if (!this.decoders.hasOwnProperty(enc))
        this.decoders[enc] = this._createNamed(decoders2[enc]);
      return this.decoders[enc];
    };
    Entity.prototype.decode = function decode2(data, enc, options) {
      return this._getDecoder(enc).decode(data, options);
    };
    Entity.prototype._getEncoder = function _getEncoder(enc) {
      enc = enc || "der";
      if (!this.encoders.hasOwnProperty(enc))
        this.encoders[enc] = this._createNamed(encoders2[enc]);
      return this.encoders[enc];
    };
    Entity.prototype.encode = function encode2(data, enc, reporter2) {
      return this._getEncoder(enc).encode(data, reporter2);
    };
  })(api);
  return api;
}
var base = {};
var hasRequiredBase;
function requireBase() {
  if (hasRequiredBase) return base;
  hasRequiredBase = 1;
  (function(exports$1) {
    const base2 = exports$1;
    base2.Reporter = requireReporter().Reporter;
    base2.DecoderBuffer = requireBuffer().DecoderBuffer;
    base2.EncoderBuffer = requireBuffer().EncoderBuffer;
    base2.Node = requireNode$1();
  })(base);
  return base;
}
var constants = {};
var hasRequiredConstants;
function requireConstants() {
  if (hasRequiredConstants) return constants;
  hasRequiredConstants = 1;
  (function(exports$1) {
    const constants2 = exports$1;
    constants2._reverse = function reverse(map) {
      const res = {};
      Object.keys(map).forEach(function(key) {
        if ((key | 0) == key)
          key = key | 0;
        const value = map[key];
        res[value] = key;
      });
      return res;
    };
    constants2.der = requireDer$2();
  })(constants);
  return constants;
}
var hasRequiredAsn1;
function requireAsn1() {
  if (hasRequiredAsn1) return asn1;
  hasRequiredAsn1 = 1;
  (function(exports$1) {
    const asn12 = exports$1;
    asn12.bignum = requireBn();
    asn12.define = requireApi().define;
    asn12.base = requireBase();
    asn12.constants = requireConstants();
    asn12.decoders = requireDecoders();
    asn12.encoders = requireEncoders();
  })(asn1);
  return asn1;
}
var jws = {};
var safeBuffer = { exports: {} };
var hasRequiredSafeBuffer;
function requireSafeBuffer() {
  if (hasRequiredSafeBuffer) return safeBuffer.exports;
  hasRequiredSafeBuffer = 1;
  (function(module, exports$1) {
    var buffer2 = require$$0$1;
    var Buffer2 = buffer2.Buffer;
    function copyProps(src2, dst) {
      for (var key in src2) {
        dst[key] = src2[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module.exports = buffer2;
    } else {
      copyProps(buffer2, exports$1);
      exports$1.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    SafeBuffer.prototype = Object.create(Buffer2.prototype);
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer2.SlowBuffer(size);
    };
  })(safeBuffer, safeBuffer.exports);
  return safeBuffer.exports;
}
var dataStream;
var hasRequiredDataStream;
function requireDataStream() {
  if (hasRequiredDataStream) return dataStream;
  hasRequiredDataStream = 1;
  var Buffer2 = requireSafeBuffer().Buffer;
  var Stream = require$$3;
  var util = require$$5;
  function DataStream(data) {
    this.buffer = null;
    this.writable = true;
    this.readable = true;
    if (!data) {
      this.buffer = Buffer2.alloc(0);
      return this;
    }
    if (typeof data.pipe === "function") {
      this.buffer = Buffer2.alloc(0);
      data.pipe(this);
      return this;
    }
    if (data.length || typeof data === "object") {
      this.buffer = data;
      this.writable = false;
      process.nextTick(function() {
        this.emit("end", data);
        this.readable = false;
        this.emit("close");
      }.bind(this));
      return this;
    }
    throw new TypeError("Unexpected data type (" + typeof data + ")");
  }
  util.inherits(DataStream, Stream);
  DataStream.prototype.write = function write(data) {
    this.buffer = Buffer2.concat([this.buffer, Buffer2.from(data)]);
    this.emit("data", data);
  };
  DataStream.prototype.end = function end(data) {
    if (data)
      this.write(data);
    this.emit("end", data);
    this.emit("close");
    this.writable = false;
    this.readable = false;
  };
  dataStream = DataStream;
  return dataStream;
}
var paramBytesForAlg_1;
var hasRequiredParamBytesForAlg;
function requireParamBytesForAlg() {
  if (hasRequiredParamBytesForAlg) return paramBytesForAlg_1;
  hasRequiredParamBytesForAlg = 1;
  function getParamSize(keySize) {
    var result = (keySize / 8 | 0) + (keySize % 8 === 0 ? 0 : 1);
    return result;
  }
  var paramBytesForAlg = {
    ES256: getParamSize(256),
    ES384: getParamSize(384),
    ES512: getParamSize(521)
  };
  function getParamBytesForAlg(alg) {
    var paramBytes = paramBytesForAlg[alg];
    if (paramBytes) {
      return paramBytes;
    }
    throw new Error('Unknown algorithm "' + alg + '"');
  }
  paramBytesForAlg_1 = getParamBytesForAlg;
  return paramBytesForAlg_1;
}
var ecdsaSigFormatter;
var hasRequiredEcdsaSigFormatter;
function requireEcdsaSigFormatter() {
  if (hasRequiredEcdsaSigFormatter) return ecdsaSigFormatter;
  hasRequiredEcdsaSigFormatter = 1;
  var Buffer2 = requireSafeBuffer().Buffer;
  var getParamBytesForAlg = requireParamBytesForAlg();
  var MAX_OCTET = 128, CLASS_UNIVERSAL = 0, PRIMITIVE_BIT = 32, TAG_SEQ = 16, TAG_INT = 2, ENCODED_TAG_SEQ = TAG_SEQ | PRIMITIVE_BIT | CLASS_UNIVERSAL << 6, ENCODED_TAG_INT = TAG_INT | CLASS_UNIVERSAL << 6;
  function base64Url(base64) {
    return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }
  function signatureAsBuffer(signature) {
    if (Buffer2.isBuffer(signature)) {
      return signature;
    } else if ("string" === typeof signature) {
      return Buffer2.from(signature, "base64");
    }
    throw new TypeError("ECDSA signature must be a Base64 string or a Buffer");
  }
  function derToJose(signature, alg) {
    signature = signatureAsBuffer(signature);
    var paramBytes = getParamBytesForAlg(alg);
    var maxEncodedParamLength = paramBytes + 1;
    var inputLength = signature.length;
    var offset = 0;
    if (signature[offset++] !== ENCODED_TAG_SEQ) {
      throw new Error('Could not find expected "seq"');
    }
    var seqLength = signature[offset++];
    if (seqLength === (MAX_OCTET | 1)) {
      seqLength = signature[offset++];
    }
    if (inputLength - offset < seqLength) {
      throw new Error('"seq" specified length of "' + seqLength + '", only "' + (inputLength - offset) + '" remaining');
    }
    if (signature[offset++] !== ENCODED_TAG_INT) {
      throw new Error('Could not find expected "int" for "r"');
    }
    var rLength = signature[offset++];
    if (inputLength - offset - 2 < rLength) {
      throw new Error('"r" specified length of "' + rLength + '", only "' + (inputLength - offset - 2) + '" available');
    }
    if (maxEncodedParamLength < rLength) {
      throw new Error('"r" specified length of "' + rLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
    }
    var rOffset = offset;
    offset += rLength;
    if (signature[offset++] !== ENCODED_TAG_INT) {
      throw new Error('Could not find expected "int" for "s"');
    }
    var sLength = signature[offset++];
    if (inputLength - offset !== sLength) {
      throw new Error('"s" specified length of "' + sLength + '", expected "' + (inputLength - offset) + '"');
    }
    if (maxEncodedParamLength < sLength) {
      throw new Error('"s" specified length of "' + sLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
    }
    var sOffset = offset;
    offset += sLength;
    if (offset !== inputLength) {
      throw new Error('Expected to consume entire buffer, but "' + (inputLength - offset) + '" bytes remain');
    }
    var rPadding = paramBytes - rLength, sPadding = paramBytes - sLength;
    var dst = Buffer2.allocUnsafe(rPadding + rLength + sPadding + sLength);
    for (offset = 0; offset < rPadding; ++offset) {
      dst[offset] = 0;
    }
    signature.copy(dst, offset, rOffset + Math.max(-rPadding, 0), rOffset + rLength);
    offset = paramBytes;
    for (var o = offset; offset < o + sPadding; ++offset) {
      dst[offset] = 0;
    }
    signature.copy(dst, offset, sOffset + Math.max(-sPadding, 0), sOffset + sLength);
    dst = dst.toString("base64");
    dst = base64Url(dst);
    return dst;
  }
  function countPadding(buf, start, stop) {
    var padding = 0;
    while (start + padding < stop && buf[start + padding] === 0) {
      ++padding;
    }
    var needsSign = buf[start + padding] >= MAX_OCTET;
    if (needsSign) {
      --padding;
    }
    return padding;
  }
  function joseToDer(signature, alg) {
    signature = signatureAsBuffer(signature);
    var paramBytes = getParamBytesForAlg(alg);
    var signatureBytes = signature.length;
    if (signatureBytes !== paramBytes * 2) {
      throw new TypeError('"' + alg + '" signatures must be "' + paramBytes * 2 + '" bytes, saw "' + signatureBytes + '"');
    }
    var rPadding = countPadding(signature, 0, paramBytes);
    var sPadding = countPadding(signature, paramBytes, signature.length);
    var rLength = paramBytes - rPadding;
    var sLength = paramBytes - sPadding;
    var rsBytes = 1 + 1 + rLength + 1 + 1 + sLength;
    var shortLength = rsBytes < MAX_OCTET;
    var dst = Buffer2.allocUnsafe((shortLength ? 2 : 3) + rsBytes);
    var offset = 0;
    dst[offset++] = ENCODED_TAG_SEQ;
    if (shortLength) {
      dst[offset++] = rsBytes;
    } else {
      dst[offset++] = MAX_OCTET | 1;
      dst[offset++] = rsBytes & 255;
    }
    dst[offset++] = ENCODED_TAG_INT;
    dst[offset++] = rLength;
    if (rPadding < 0) {
      dst[offset++] = 0;
      offset += signature.copy(dst, offset, 0, paramBytes);
    } else {
      offset += signature.copy(dst, offset, rPadding, paramBytes);
    }
    dst[offset++] = ENCODED_TAG_INT;
    dst[offset++] = sLength;
    if (sPadding < 0) {
      dst[offset++] = 0;
      signature.copy(dst, offset, paramBytes);
    } else {
      signature.copy(dst, offset, paramBytes + sPadding);
    }
    return dst;
  }
  ecdsaSigFormatter = {
    derToJose,
    joseToDer
  };
  return ecdsaSigFormatter;
}
var bufferEqualConstantTime;
var hasRequiredBufferEqualConstantTime;
function requireBufferEqualConstantTime() {
  if (hasRequiredBufferEqualConstantTime) return bufferEqualConstantTime;
  hasRequiredBufferEqualConstantTime = 1;
  var Buffer2 = require$$0$1.Buffer;
  var SlowBuffer = require$$0$1.SlowBuffer;
  bufferEqualConstantTime = bufferEq;
  function bufferEq(a, b) {
    if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    var c = 0;
    for (var i = 0; i < a.length; i++) {
      c |= a[i] ^ b[i];
    }
    return c === 0;
  }
  bufferEq.install = function() {
    Buffer2.prototype.equal = SlowBuffer.prototype.equal = function equal(that) {
      return bufferEq(this, that);
    };
  };
  var origBufEqual = Buffer2.prototype.equal;
  var origSlowBufEqual = SlowBuffer.prototype.equal;
  bufferEq.restore = function() {
    Buffer2.prototype.equal = origBufEqual;
    SlowBuffer.prototype.equal = origSlowBufEqual;
  };
  return bufferEqualConstantTime;
}
var jwa;
var hasRequiredJwa;
function requireJwa() {
  if (hasRequiredJwa) return jwa;
  hasRequiredJwa = 1;
  var Buffer2 = requireSafeBuffer().Buffer;
  var crypto = require$$0$2;
  var formatEcdsa = requireEcdsaSigFormatter();
  var util = require$$5;
  var MSG_INVALID_ALGORITHM = '"%s" is not a valid algorithm.\n  Supported algorithms are:\n  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".';
  var MSG_INVALID_SECRET = "secret must be a string or buffer";
  var MSG_INVALID_VERIFIER_KEY = "key must be a string or a buffer";
  var MSG_INVALID_SIGNER_KEY = "key must be a string, a buffer or an object";
  var supportsKeyObjects = typeof crypto.createPublicKey === "function";
  if (supportsKeyObjects) {
    MSG_INVALID_VERIFIER_KEY += " or a KeyObject";
    MSG_INVALID_SECRET += "or a KeyObject";
  }
  function checkIsPublicKey(key) {
    if (Buffer2.isBuffer(key)) {
      return;
    }
    if (typeof key === "string") {
      return;
    }
    if (!supportsKeyObjects) {
      throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key !== "object") {
      throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key.type !== "string") {
      throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key.asymmetricKeyType !== "string") {
      throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key.export !== "function") {
      throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
  }
  function checkIsPrivateKey(key) {
    if (Buffer2.isBuffer(key)) {
      return;
    }
    if (typeof key === "string") {
      return;
    }
    if (typeof key === "object") {
      return;
    }
    throw typeError(MSG_INVALID_SIGNER_KEY);
  }
  function checkIsSecretKey(key) {
    if (Buffer2.isBuffer(key)) {
      return;
    }
    if (typeof key === "string") {
      return key;
    }
    if (!supportsKeyObjects) {
      throw typeError(MSG_INVALID_SECRET);
    }
    if (typeof key !== "object") {
      throw typeError(MSG_INVALID_SECRET);
    }
    if (key.type !== "secret") {
      throw typeError(MSG_INVALID_SECRET);
    }
    if (typeof key.export !== "function") {
      throw typeError(MSG_INVALID_SECRET);
    }
  }
  function fromBase64(base64) {
    return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }
  function toBase64(base64url) {
    base64url = base64url.toString();
    var padding = 4 - base64url.length % 4;
    if (padding !== 4) {
      for (var i = 0; i < padding; ++i) {
        base64url += "=";
      }
    }
    return base64url.replace(/\-/g, "+").replace(/_/g, "/");
  }
  function typeError(template) {
    var args = [].slice.call(arguments, 1);
    var errMsg = util.format.bind(util, template).apply(null, args);
    return new TypeError(errMsg);
  }
  function bufferOrString(obj) {
    return Buffer2.isBuffer(obj) || typeof obj === "string";
  }
  function normalizeInput(thing) {
    if (!bufferOrString(thing))
      thing = JSON.stringify(thing);
    return thing;
  }
  function createHmacSigner(bits) {
    return function sign(thing, secret) {
      checkIsSecretKey(secret);
      thing = normalizeInput(thing);
      var hmac = crypto.createHmac("sha" + bits, secret);
      var sig = (hmac.update(thing), hmac.digest("base64"));
      return fromBase64(sig);
    };
  }
  var bufferEqual;
  var timingSafeEqual = "timingSafeEqual" in crypto ? function timingSafeEqual2(a, b) {
    if (a.byteLength !== b.byteLength) {
      return false;
    }
    return crypto.timingSafeEqual(a, b);
  } : function timingSafeEqual2(a, b) {
    if (!bufferEqual) {
      bufferEqual = requireBufferEqualConstantTime();
    }
    return bufferEqual(a, b);
  };
  function createHmacVerifier(bits) {
    return function verify(thing, signature, secret) {
      var computedSig = createHmacSigner(bits)(thing, secret);
      return timingSafeEqual(Buffer2.from(signature), Buffer2.from(computedSig));
    };
  }
  function createKeySigner(bits) {
    return function sign(thing, privateKey) {
      checkIsPrivateKey(privateKey);
      thing = normalizeInput(thing);
      var signer = crypto.createSign("RSA-SHA" + bits);
      var sig = (signer.update(thing), signer.sign(privateKey, "base64"));
      return fromBase64(sig);
    };
  }
  function createKeyVerifier(bits) {
    return function verify(thing, signature, publicKey) {
      checkIsPublicKey(publicKey);
      thing = normalizeInput(thing);
      signature = toBase64(signature);
      var verifier = crypto.createVerify("RSA-SHA" + bits);
      verifier.update(thing);
      return verifier.verify(publicKey, signature, "base64");
    };
  }
  function createPSSKeySigner(bits) {
    return function sign(thing, privateKey) {
      checkIsPrivateKey(privateKey);
      thing = normalizeInput(thing);
      var signer = crypto.createSign("RSA-SHA" + bits);
      var sig = (signer.update(thing), signer.sign({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
      }, "base64"));
      return fromBase64(sig);
    };
  }
  function createPSSKeyVerifier(bits) {
    return function verify(thing, signature, publicKey) {
      checkIsPublicKey(publicKey);
      thing = normalizeInput(thing);
      signature = toBase64(signature);
      var verifier = crypto.createVerify("RSA-SHA" + bits);
      verifier.update(thing);
      return verifier.verify({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
      }, signature, "base64");
    };
  }
  function createECDSASigner(bits) {
    var inner = createKeySigner(bits);
    return function sign() {
      var signature = inner.apply(null, arguments);
      signature = formatEcdsa.derToJose(signature, "ES" + bits);
      return signature;
    };
  }
  function createECDSAVerifer(bits) {
    var inner = createKeyVerifier(bits);
    return function verify(thing, signature, publicKey) {
      signature = formatEcdsa.joseToDer(signature, "ES" + bits).toString("base64");
      var result = inner(thing, signature, publicKey);
      return result;
    };
  }
  function createNoneSigner() {
    return function sign() {
      return "";
    };
  }
  function createNoneVerifier() {
    return function verify(thing, signature) {
      return signature === "";
    };
  }
  jwa = function jwa2(algorithm) {
    var signerFactories = {
      hs: createHmacSigner,
      rs: createKeySigner,
      ps: createPSSKeySigner,
      es: createECDSASigner,
      none: createNoneSigner
    };
    var verifierFactories = {
      hs: createHmacVerifier,
      rs: createKeyVerifier,
      ps: createPSSKeyVerifier,
      es: createECDSAVerifer,
      none: createNoneVerifier
    };
    var match = algorithm.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/);
    if (!match)
      throw typeError(MSG_INVALID_ALGORITHM, algorithm);
    var algo = (match[1] || match[3]).toLowerCase();
    var bits = match[2];
    return {
      sign: signerFactories[algo](bits),
      verify: verifierFactories[algo](bits)
    };
  };
  return jwa;
}
var tostring;
var hasRequiredTostring;
function requireTostring() {
  if (hasRequiredTostring) return tostring;
  hasRequiredTostring = 1;
  var Buffer2 = require$$0$1.Buffer;
  tostring = function toString(obj) {
    if (typeof obj === "string")
      return obj;
    if (typeof obj === "number" || Buffer2.isBuffer(obj))
      return obj.toString();
    return JSON.stringify(obj);
  };
  return tostring;
}
var signStream;
var hasRequiredSignStream;
function requireSignStream() {
  if (hasRequiredSignStream) return signStream;
  hasRequiredSignStream = 1;
  var Buffer2 = requireSafeBuffer().Buffer;
  var DataStream = requireDataStream();
  var jwa2 = requireJwa();
  var Stream = require$$3;
  var toString = requireTostring();
  var util = require$$5;
  function base64url(string, encoding) {
    return Buffer2.from(string, encoding).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }
  function jwsSecuredInput(header, payload, encoding) {
    encoding = encoding || "utf8";
    var encodedHeader = base64url(toString(header), "binary");
    var encodedPayload = base64url(toString(payload), encoding);
    return util.format("%s.%s", encodedHeader, encodedPayload);
  }
  function jwsSign(opts) {
    var header = opts.header;
    var payload = opts.payload;
    var secretOrKey = opts.secret || opts.privateKey;
    var encoding = opts.encoding;
    var algo = jwa2(header.alg);
    var securedInput = jwsSecuredInput(header, payload, encoding);
    var signature = algo.sign(securedInput, secretOrKey);
    return util.format("%s.%s", securedInput, signature);
  }
  function SignStream(opts) {
    var secret = opts.secret;
    secret = secret == null ? opts.privateKey : secret;
    secret = secret == null ? opts.key : secret;
    if (/^hs/i.test(opts.header.alg) === true && secret == null) {
      throw new TypeError("secret must be a string or buffer or a KeyObject");
    }
    var secretStream = new DataStream(secret);
    this.readable = true;
    this.header = opts.header;
    this.encoding = opts.encoding;
    this.secret = this.privateKey = this.key = secretStream;
    this.payload = new DataStream(opts.payload);
    this.secret.once("close", function() {
      if (!this.payload.writable && this.readable)
        this.sign();
    }.bind(this));
    this.payload.once("close", function() {
      if (!this.secret.writable && this.readable)
        this.sign();
    }.bind(this));
  }
  util.inherits(SignStream, Stream);
  SignStream.prototype.sign = function sign() {
    try {
      var signature = jwsSign({
        header: this.header,
        payload: this.payload.buffer,
        secret: this.secret.buffer,
        encoding: this.encoding
      });
      this.emit("done", signature);
      this.emit("data", signature);
      this.emit("end");
      this.readable = false;
      return signature;
    } catch (e) {
      this.readable = false;
      this.emit("error", e);
      this.emit("close");
    }
  };
  SignStream.sign = jwsSign;
  signStream = SignStream;
  return signStream;
}
var verifyStream;
var hasRequiredVerifyStream;
function requireVerifyStream() {
  if (hasRequiredVerifyStream) return verifyStream;
  hasRequiredVerifyStream = 1;
  var Buffer2 = requireSafeBuffer().Buffer;
  var DataStream = requireDataStream();
  var jwa2 = requireJwa();
  var Stream = require$$3;
  var toString = requireTostring();
  var util = require$$5;
  var JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
  function isObject(thing) {
    return Object.prototype.toString.call(thing) === "[object Object]";
  }
  function safeJsonParse(thing) {
    if (isObject(thing))
      return thing;
    try {
      return JSON.parse(thing);
    } catch (e) {
      return void 0;
    }
  }
  function headerFromJWS(jwsSig) {
    var encodedHeader = jwsSig.split(".", 1)[0];
    return safeJsonParse(Buffer2.from(encodedHeader, "base64").toString("binary"));
  }
  function securedInputFromJWS(jwsSig) {
    return jwsSig.split(".", 2).join(".");
  }
  function signatureFromJWS(jwsSig) {
    return jwsSig.split(".")[2];
  }
  function payloadFromJWS(jwsSig, encoding) {
    encoding = encoding || "utf8";
    var payload = jwsSig.split(".")[1];
    return Buffer2.from(payload, "base64").toString(encoding);
  }
  function isValidJws(string) {
    return JWS_REGEX.test(string) && !!headerFromJWS(string);
  }
  function jwsVerify(jwsSig, algorithm, secretOrKey) {
    if (!algorithm) {
      var err = new Error("Missing algorithm parameter for jws.verify");
      err.code = "MISSING_ALGORITHM";
      throw err;
    }
    jwsSig = toString(jwsSig);
    var signature = signatureFromJWS(jwsSig);
    var securedInput = securedInputFromJWS(jwsSig);
    var algo = jwa2(algorithm);
    return algo.verify(securedInput, signature, secretOrKey);
  }
  function jwsDecode(jwsSig, opts) {
    opts = opts || {};
    jwsSig = toString(jwsSig);
    if (!isValidJws(jwsSig))
      return null;
    var header = headerFromJWS(jwsSig);
    if (!header)
      return null;
    var payload = payloadFromJWS(jwsSig);
    if (header.typ === "JWT" || opts.json)
      payload = JSON.parse(payload, opts.encoding);
    return {
      header,
      payload,
      signature: signatureFromJWS(jwsSig)
    };
  }
  function VerifyStream(opts) {
    opts = opts || {};
    var secretOrKey = opts.secret;
    secretOrKey = secretOrKey == null ? opts.publicKey : secretOrKey;
    secretOrKey = secretOrKey == null ? opts.key : secretOrKey;
    if (/^hs/i.test(opts.algorithm) === true && secretOrKey == null) {
      throw new TypeError("secret must be a string or buffer or a KeyObject");
    }
    var secretStream = new DataStream(secretOrKey);
    this.readable = true;
    this.algorithm = opts.algorithm;
    this.encoding = opts.encoding;
    this.secret = this.publicKey = this.key = secretStream;
    this.signature = new DataStream(opts.signature);
    this.secret.once("close", function() {
      if (!this.signature.writable && this.readable)
        this.verify();
    }.bind(this));
    this.signature.once("close", function() {
      if (!this.secret.writable && this.readable)
        this.verify();
    }.bind(this));
  }
  util.inherits(VerifyStream, Stream);
  VerifyStream.prototype.verify = function verify() {
    try {
      var valid = jwsVerify(this.signature.buffer, this.algorithm, this.key.buffer);
      var obj = jwsDecode(this.signature.buffer, this.encoding);
      this.emit("done", valid, obj);
      this.emit("data", valid);
      this.emit("end");
      this.readable = false;
      return valid;
    } catch (e) {
      this.readable = false;
      this.emit("error", e);
      this.emit("close");
    }
  };
  VerifyStream.decode = jwsDecode;
  VerifyStream.isValid = isValidJws;
  VerifyStream.verify = jwsVerify;
  verifyStream = VerifyStream;
  return verifyStream;
}
var hasRequiredJws;
function requireJws() {
  if (hasRequiredJws) return jws;
  hasRequiredJws = 1;
  var SignStream = requireSignStream();
  var VerifyStream = requireVerifyStream();
  var ALGORITHMS = [
    "HS256",
    "HS384",
    "HS512",
    "RS256",
    "RS384",
    "RS512",
    "PS256",
    "PS384",
    "PS512",
    "ES256",
    "ES384",
    "ES512"
  ];
  jws.ALGORITHMS = ALGORITHMS;
  jws.sign = SignStream.sign;
  jws.verify = VerifyStream.verify;
  jws.decode = VerifyStream.decode;
  jws.isValid = VerifyStream.isValid;
  jws.createSign = function createSign(opts) {
    return new SignStream(opts);
  };
  jws.createVerify = function createVerify(opts) {
    return new VerifyStream(opts);
  };
  return jws;
}
var webPushConstants;
var hasRequiredWebPushConstants;
function requireWebPushConstants() {
  if (hasRequiredWebPushConstants) return webPushConstants;
  hasRequiredWebPushConstants = 1;
  const WebPushConstants = {};
  WebPushConstants.supportedContentEncodings = {
    AES_GCM: "aesgcm",
    AES_128_GCM: "aes128gcm"
  };
  WebPushConstants.supportedUrgency = {
    VERY_LOW: "very-low",
    LOW: "low",
    NORMAL: "normal",
    HIGH: "high"
  };
  webPushConstants = WebPushConstants;
  return webPushConstants;
}
var urlsafeBase64Helper;
var hasRequiredUrlsafeBase64Helper;
function requireUrlsafeBase64Helper() {
  if (hasRequiredUrlsafeBase64Helper) return urlsafeBase64Helper;
  hasRequiredUrlsafeBase64Helper = 1;
  function validate(base64) {
    return /^[A-Za-z0-9\-_]+$/.test(base64);
  }
  urlsafeBase64Helper = {
    validate
  };
  return urlsafeBase64Helper;
}
var vapidHelper;
var hasRequiredVapidHelper;
function requireVapidHelper() {
  if (hasRequiredVapidHelper) return vapidHelper;
  hasRequiredVapidHelper = 1;
  const crypto = require$$0$2;
  const asn12 = requireAsn1();
  const jws2 = requireJws();
  const { URL: URL2 } = require$$3$1;
  const WebPushConstants = requireWebPushConstants();
  const urlBase64Helper = requireUrlsafeBase64Helper();
  const DEFAULT_EXPIRATION_SECONDS = 12 * 60 * 60;
  const MAX_EXPIRATION_SECONDS = 24 * 60 * 60;
  const ECPrivateKeyASN = asn12.define("ECPrivateKey", function() {
    this.seq().obj(
      this.key("version").int(),
      this.key("privateKey").octstr(),
      this.key("parameters").explicit(0).objid().optional(),
      this.key("publicKey").explicit(1).bitstr().optional()
    );
  });
  function toPEM(key) {
    return ECPrivateKeyASN.encode({
      version: 1,
      privateKey: key,
      parameters: [1, 2, 840, 10045, 3, 1, 7]
      // prime256v1
    }, "pem", {
      label: "EC PRIVATE KEY"
    });
  }
  function generateVAPIDKeys() {
    const curve = crypto.createECDH("prime256v1");
    curve.generateKeys();
    let publicKeyBuffer = curve.getPublicKey();
    let privateKeyBuffer = curve.getPrivateKey();
    if (privateKeyBuffer.length < 32) {
      const padding = Buffer.alloc(32 - privateKeyBuffer.length);
      padding.fill(0);
      privateKeyBuffer = Buffer.concat([padding, privateKeyBuffer]);
    }
    if (publicKeyBuffer.length < 65) {
      const padding = Buffer.alloc(65 - publicKeyBuffer.length);
      padding.fill(0);
      publicKeyBuffer = Buffer.concat([padding, publicKeyBuffer]);
    }
    return {
      publicKey: publicKeyBuffer.toString("base64url"),
      privateKey: privateKeyBuffer.toString("base64url")
    };
  }
  function validateSubject(subject) {
    if (!subject) {
      throw new Error("No subject set in vapidDetails.subject.");
    }
    if (typeof subject !== "string" || subject.length === 0) {
      throw new Error("The subject value must be a string containing an https: URL or mailto: address. " + subject);
    }
    let subjectParseResult = null;
    try {
      subjectParseResult = new URL2(subject);
    } catch (err) {
      throw new Error("Vapid subject is not a valid URL. " + subject);
    }
    if (!["https:", "mailto:"].includes(subjectParseResult.protocol)) {
      throw new Error("Vapid subject is not an https: or mailto: URL. " + subject);
    }
    if (subjectParseResult.hostname === "localhost") {
      console.warn("Vapid subject points to a localhost web URI, which is unsupported by Apple's push notification server and will result in a BadJwtToken error when sending notifications.");
    }
  }
  function validatePublicKey(publicKey) {
    if (!publicKey) {
      throw new Error("No key set vapidDetails.publicKey");
    }
    if (typeof publicKey !== "string") {
      throw new Error("Vapid public key is must be a URL safe Base 64 encoded string.");
    }
    if (!urlBase64Helper.validate(publicKey)) {
      throw new Error('Vapid public key must be a URL safe Base 64 (without "=")');
    }
    publicKey = Buffer.from(publicKey, "base64url");
    if (publicKey.length !== 65) {
      throw new Error("Vapid public key should be 65 bytes long when decoded.");
    }
  }
  function validatePrivateKey(privateKey) {
    if (!privateKey) {
      throw new Error("No key set in vapidDetails.privateKey");
    }
    if (typeof privateKey !== "string") {
      throw new Error("Vapid private key must be a URL safe Base 64 encoded string.");
    }
    if (!urlBase64Helper.validate(privateKey)) {
      throw new Error('Vapid private key must be a URL safe Base 64 (without "=")');
    }
    privateKey = Buffer.from(privateKey, "base64url");
    if (privateKey.length !== 32) {
      throw new Error("Vapid private key should be 32 bytes long when decoded.");
    }
  }
  function getFutureExpirationTimestamp(numSeconds) {
    const futureExp = /* @__PURE__ */ new Date();
    futureExp.setSeconds(futureExp.getSeconds() + numSeconds);
    return Math.floor(futureExp.getTime() / 1e3);
  }
  function validateExpiration(expiration) {
    if (!Number.isInteger(expiration)) {
      throw new Error("`expiration` value must be a number");
    }
    if (expiration < 0) {
      throw new Error("`expiration` must be a positive integer");
    }
    const maxExpirationTimestamp = getFutureExpirationTimestamp(MAX_EXPIRATION_SECONDS);
    if (expiration >= maxExpirationTimestamp) {
      throw new Error("`expiration` value is greater than maximum of 24 hours");
    }
  }
  function getVapidHeaders(audience, subject, publicKey, privateKey, contentEncoding, expiration) {
    if (!audience) {
      throw new Error("No audience could be generated for VAPID.");
    }
    if (typeof audience !== "string" || audience.length === 0) {
      throw new Error("The audience value must be a string containing the origin of a push service. " + audience);
    }
    try {
      new URL2(audience);
    } catch (err) {
      throw new Error("VAPID audience is not a url. " + audience);
    }
    validateSubject(subject);
    validatePublicKey(publicKey);
    validatePrivateKey(privateKey);
    privateKey = Buffer.from(privateKey, "base64url");
    if (expiration) {
      validateExpiration(expiration);
    } else {
      expiration = getFutureExpirationTimestamp(DEFAULT_EXPIRATION_SECONDS);
    }
    const header = {
      typ: "JWT",
      alg: "ES256"
    };
    const jwtPayload = {
      aud: audience,
      exp: expiration,
      sub: subject
    };
    const jwt = jws2.sign({
      header,
      payload: jwtPayload,
      privateKey: toPEM(privateKey)
    });
    if (contentEncoding === WebPushConstants.supportedContentEncodings.AES_128_GCM) {
      return {
        Authorization: "vapid t=" + jwt + ", k=" + publicKey
      };
    }
    if (contentEncoding === WebPushConstants.supportedContentEncodings.AES_GCM) {
      return {
        Authorization: "WebPush " + jwt,
        "Crypto-Key": "p256ecdsa=" + publicKey
      };
    }
    throw new Error("Unsupported encoding type specified.");
  }
  vapidHelper = {
    generateVAPIDKeys,
    getFutureExpirationTimestamp,
    getVapidHeaders,
    validateSubject,
    validatePublicKey,
    validatePrivateKey,
    validateExpiration
  };
  return vapidHelper;
}
var ece;
var hasRequiredEce;
function requireEce() {
  if (hasRequiredEce) return ece;
  hasRequiredEce = 1;
  var crypto = require$$0$2;
  var AES_GCM = "aes-128-gcm";
  var PAD_SIZE = { "aes128gcm": 1, "aesgcm": 2 };
  var TAG_LENGTH = 16;
  var KEY_LENGTH = 16;
  var NONCE_LENGTH = 12;
  var SHA_256_LENGTH = 32;
  var MODE_ENCRYPT = "encrypt";
  var MODE_DECRYPT = "decrypt";
  var keylog;
  if (process.env.ECE_KEYLOG === "1") {
    keylog = function(m, k) {
      console.warn(m + " [" + k.length + "]: " + k.toString("base64url"));
      return k;
    };
  } else {
    keylog = function(m, k) {
      return k;
    };
  }
  function decode2(b) {
    if (typeof b === "string") {
      return Buffer.from(b, "base64url");
    }
    return b;
  }
  function HMAC_hash(key, input) {
    var hmac = crypto.createHmac("sha256", key);
    hmac.update(input);
    return hmac.digest();
  }
  function HKDF_extract(salt, ikm) {
    keylog("salt", salt);
    keylog("ikm", ikm);
    return keylog("extract", HMAC_hash(salt, ikm));
  }
  function HKDF_expand(prk, info2, l) {
    keylog("prk", prk);
    keylog("info", info2);
    var output = Buffer.alloc(0);
    var T = Buffer.alloc(0);
    info2 = Buffer.from(info2, "ascii");
    var counter = 0;
    var cbuf = Buffer.alloc(1);
    while (output.length < l) {
      cbuf.writeUIntBE(++counter, 0, 1);
      T = HMAC_hash(prk, Buffer.concat([T, info2, cbuf]));
      output = Buffer.concat([output, T]);
    }
    return keylog("expand", output.slice(0, l));
  }
  function HKDF(salt, ikm, info2, len) {
    return HKDF_expand(HKDF_extract(salt, ikm), info2, len);
  }
  function info(base2, context) {
    var result = Buffer.concat([
      Buffer.from("Content-Encoding: " + base2 + "\0", "ascii"),
      context
    ]);
    keylog("info " + base2, result);
    return result;
  }
  function lengthPrefix(buffer2) {
    var b = Buffer.concat([Buffer.alloc(2), buffer2]);
    b.writeUIntBE(buffer2.length, 0, 2);
    return b;
  }
  function extractDH(header, mode) {
    var key = header.privateKey;
    var senderPubKey, receiverPubKey;
    if (mode === MODE_ENCRYPT) {
      senderPubKey = key.getPublicKey();
      receiverPubKey = header.dh;
    } else if (mode === MODE_DECRYPT) {
      senderPubKey = header.dh;
      receiverPubKey = key.getPublicKey();
    } else {
      throw new Error("Unknown mode only " + MODE_ENCRYPT + " and " + MODE_DECRYPT + " supported");
    }
    return {
      secret: key.computeSecret(header.dh),
      context: Buffer.concat([
        Buffer.from(header.keylabel, "ascii"),
        Buffer.from([0]),
        lengthPrefix(receiverPubKey),
        // user agent
        lengthPrefix(senderPubKey)
        // application server
      ])
    };
  }
  function extractSecretAndContext(header, mode) {
    var result = { secret: null, context: Buffer.alloc(0) };
    if (header.key) {
      result.secret = header.key;
      if (result.secret.length !== KEY_LENGTH) {
        throw new Error("An explicit key must be " + KEY_LENGTH + " bytes");
      }
    } else if (header.dh) {
      result = extractDH(header, mode);
    } else if (typeof header.keyid !== void 0) {
      result.secret = header.keymap[header.keyid];
    }
    if (!result.secret) {
      throw new Error("Unable to determine key");
    }
    keylog("secret", result.secret);
    keylog("context", result.context);
    if (header.authSecret) {
      result.secret = HKDF(
        header.authSecret,
        result.secret,
        info("auth", Buffer.alloc(0)),
        SHA_256_LENGTH
      );
      keylog("authsecret", result.secret);
    }
    return result;
  }
  function webpushSecret(header, mode) {
    if (!header.authSecret) {
      throw new Error("No authentication secret for webpush");
    }
    keylog("authsecret", header.authSecret);
    var remotePubKey, senderPubKey, receiverPubKey;
    if (mode === MODE_ENCRYPT) {
      senderPubKey = header.privateKey.getPublicKey();
      remotePubKey = receiverPubKey = header.dh;
    } else if (mode === MODE_DECRYPT) {
      remotePubKey = senderPubKey = header.keyid;
      receiverPubKey = header.privateKey.getPublicKey();
    } else {
      throw new Error("Unknown mode only " + MODE_ENCRYPT + " and " + MODE_DECRYPT + " supported");
    }
    keylog("remote pubkey", remotePubKey);
    keylog("sender pubkey", senderPubKey);
    keylog("receiver pubkey", receiverPubKey);
    return keylog(
      "secret dh",
      HKDF(
        header.authSecret,
        header.privateKey.computeSecret(remotePubKey),
        Buffer.concat([
          Buffer.from("WebPush: info\0"),
          receiverPubKey,
          senderPubKey
        ]),
        SHA_256_LENGTH
      )
    );
  }
  function extractSecret(header, mode, keyLookupCallback) {
    if (keyLookupCallback) {
      if (!isFunction(keyLookupCallback)) {
        throw new Error("Callback is not a function");
      }
    }
    if (header.key) {
      if (header.key.length !== KEY_LENGTH) {
        throw new Error("An explicit key must be " + KEY_LENGTH + " bytes");
      }
      return keylog("secret key", header.key);
    }
    if (!header.privateKey) {
      if (!keyLookupCallback) {
        var key = header.keymap && header.keymap[header.keyid];
      } else {
        var key = keyLookupCallback(header.keyid);
      }
      if (!key) {
        throw new Error('No saved key (keyid: "' + header.keyid + '")');
      }
      return key;
    }
    return webpushSecret(header, mode);
  }
  function deriveKeyAndNonce(header, mode, lookupKeyCallback) {
    if (!header.salt) {
      throw new Error("must include a salt parameter for " + header.version);
    }
    var keyInfo;
    var nonceInfo;
    var secret;
    if (header.version === "aesgcm") {
      var s = extractSecretAndContext(header, mode);
      keyInfo = info("aesgcm", s.context);
      nonceInfo = info("nonce", s.context);
      secret = s.secret;
    } else if (header.version === "aes128gcm") {
      keyInfo = Buffer.from("Content-Encoding: aes128gcm\0");
      nonceInfo = Buffer.from("Content-Encoding: nonce\0");
      secret = extractSecret(header, mode, lookupKeyCallback);
    } else {
      throw new Error("Unable to set context for mode " + header.version);
    }
    var prk = HKDF_extract(header.salt, secret);
    var result = {
      key: HKDF_expand(prk, keyInfo, KEY_LENGTH),
      nonce: HKDF_expand(prk, nonceInfo, NONCE_LENGTH)
    };
    keylog("key", result.key);
    keylog("nonce base", result.nonce);
    return result;
  }
  function parseParams(params) {
    var header = {};
    header.version = params.version || "aes128gcm";
    header.rs = parseInt(params.rs, 10);
    if (isNaN(header.rs)) {
      header.rs = 4096;
    }
    var overhead = PAD_SIZE[header.version];
    if (header.version === "aes128gcm") {
      overhead += TAG_LENGTH;
    }
    if (header.rs <= overhead) {
      throw new Error("The rs parameter has to be greater than " + overhead);
    }
    if (params.salt) {
      header.salt = decode2(params.salt);
      if (header.salt.length !== KEY_LENGTH) {
        throw new Error("The salt parameter must be " + KEY_LENGTH + " bytes");
      }
    }
    header.keyid = params.keyid;
    if (params.key) {
      header.key = decode2(params.key);
    } else {
      header.privateKey = params.privateKey;
      if (!header.privateKey) {
        header.keymap = params.keymap;
      }
      if (header.version !== "aes128gcm") {
        header.keylabel = params.keylabel || "P-256";
      }
      if (params.dh) {
        header.dh = decode2(params.dh);
      }
    }
    if (params.authSecret) {
      header.authSecret = decode2(params.authSecret);
    }
    return header;
  }
  function generateNonce(base2, counter) {
    var nonce = Buffer.from(base2);
    var m = nonce.readUIntBE(nonce.length - 6, 6);
    var x = ((m ^ counter) & 16777215) + ((m / 16777216 ^ counter / 16777216) & 16777215) * 16777216;
    nonce.writeUIntBE(x, nonce.length - 6, 6);
    keylog("nonce" + counter, nonce);
    return nonce;
  }
  function readHeader(buffer2, header) {
    var idsz = buffer2.readUIntBE(20, 1);
    header.salt = buffer2.slice(0, KEY_LENGTH);
    header.rs = buffer2.readUIntBE(KEY_LENGTH, 4);
    header.keyid = buffer2.slice(21, 21 + idsz);
    return 21 + idsz;
  }
  function unpadLegacy(data, version) {
    var padSize = PAD_SIZE[version];
    var pad = data.readUIntBE(0, padSize);
    if (pad + padSize > data.length) {
      throw new Error("padding exceeds block size");
    }
    keylog("padding", data.slice(0, padSize + pad));
    var padCheck = Buffer.alloc(pad);
    padCheck.fill(0);
    if (padCheck.compare(data.slice(padSize, padSize + pad)) !== 0) {
      throw new Error("invalid padding");
    }
    return data.slice(padSize + pad);
  }
  function unpad(data, last2) {
    var i = data.length - 1;
    while (i >= 0) {
      if (data[i]) {
        if (last2) {
          if (data[i] !== 2) {
            throw new Error("last record needs to start padding with a 2");
          }
        } else {
          if (data[i] !== 1) {
            throw new Error("last record needs to start padding with a 2");
          }
        }
        return data.slice(0, i);
      }
      --i;
    }
    throw new Error("all zero plaintext");
  }
  function decryptRecord(key, counter, buffer2, header, last2) {
    keylog("decrypt", buffer2);
    var nonce = generateNonce(key.nonce, counter);
    var gcm = crypto.createDecipheriv(AES_GCM, key.key, nonce);
    gcm.setAuthTag(buffer2.slice(buffer2.length - TAG_LENGTH));
    var data = gcm.update(buffer2.slice(0, buffer2.length - TAG_LENGTH));
    data = Buffer.concat([data, gcm.final()]);
    keylog("decrypted", data);
    if (header.version !== "aes128gcm") {
      return unpadLegacy(data, header.version);
    }
    return unpad(data, last2);
  }
  function decrypt(buffer2, params, keyLookupCallback) {
    var header = parseParams(params);
    if (header.version === "aes128gcm") {
      var headerLength = readHeader(buffer2, header);
      buffer2 = buffer2.slice(headerLength);
    }
    var key = deriveKeyAndNonce(header, MODE_DECRYPT, keyLookupCallback);
    var start = 0;
    var result = Buffer.alloc(0);
    var chunkSize = header.rs;
    if (header.version !== "aes128gcm") {
      chunkSize += TAG_LENGTH;
    }
    for (var i = 0; start < buffer2.length; ++i) {
      var end = start + chunkSize;
      if (header.version !== "aes128gcm" && end === buffer2.length) {
        throw new Error("Truncated payload");
      }
      end = Math.min(end, buffer2.length);
      if (end - start <= TAG_LENGTH) {
        throw new Error("Invalid block: too small at " + i);
      }
      var block = decryptRecord(
        key,
        i,
        buffer2.slice(start, end),
        header,
        end >= buffer2.length
      );
      result = Buffer.concat([result, block]);
      start = end;
    }
    return result;
  }
  function encryptRecord(key, counter, buffer2, pad, header, last2) {
    keylog("encrypt", buffer2);
    pad = pad || 0;
    var nonce = generateNonce(key.nonce, counter);
    var gcm = crypto.createCipheriv(AES_GCM, key.key, nonce);
    var ciphertext = [];
    var padSize = PAD_SIZE[header.version];
    var padding = Buffer.alloc(pad + padSize);
    padding.fill(0);
    if (header.version !== "aes128gcm") {
      padding.writeUIntBE(pad, 0, padSize);
      keylog("padding", padding);
      ciphertext.push(gcm.update(padding));
      ciphertext.push(gcm.update(buffer2));
      if (!last2 && padding.length + buffer2.length < header.rs) {
        throw new Error("Unable to pad to record size");
      }
    } else {
      ciphertext.push(gcm.update(buffer2));
      padding.writeUIntBE(last2 ? 2 : 1, 0, 1);
      keylog("padding", padding);
      ciphertext.push(gcm.update(padding));
    }
    gcm.final();
    var tag = gcm.getAuthTag();
    if (tag.length !== TAG_LENGTH) {
      throw new Error("invalid tag generated");
    }
    ciphertext.push(tag);
    return keylog("encrypted", Buffer.concat(ciphertext));
  }
  function writeHeader(header) {
    var ints = Buffer.alloc(5);
    var keyid = Buffer.from(header.keyid || []);
    if (keyid.length > 255) {
      throw new Error("keyid is too large");
    }
    ints.writeUIntBE(header.rs, 0, 4);
    ints.writeUIntBE(keyid.length, 4, 1);
    return Buffer.concat([header.salt, ints, keyid]);
  }
  function encrypt(buffer2, params, keyLookupCallback) {
    if (!Buffer.isBuffer(buffer2)) {
      throw new Error("buffer argument must be a Buffer");
    }
    var header = parseParams(params);
    if (!header.salt) {
      header.salt = crypto.randomBytes(KEY_LENGTH);
    }
    var result;
    if (header.version === "aes128gcm") {
      if (header.privateKey && !header.keyid) {
        header.keyid = header.privateKey.getPublicKey();
      }
      result = writeHeader(header);
    } else {
      result = Buffer.alloc(0);
    }
    var key = deriveKeyAndNonce(header, MODE_ENCRYPT, keyLookupCallback);
    var start = 0;
    var padSize = PAD_SIZE[header.version];
    var overhead = padSize;
    if (header.version === "aes128gcm") {
      overhead += TAG_LENGTH;
    }
    var pad = isNaN(parseInt(params.pad, 10)) ? 0 : parseInt(params.pad, 10);
    var counter = 0;
    var last2 = false;
    while (!last2) {
      var recordPad = Math.min(header.rs - overhead - 1, pad);
      if (header.version !== "aes128gcm") {
        recordPad = Math.min((1 << padSize * 8) - 1, recordPad);
      }
      if (pad > 0 && recordPad === 0) {
        ++recordPad;
      }
      pad -= recordPad;
      var end = start + header.rs - overhead - recordPad;
      if (header.version !== "aes128gcm") {
        last2 = end > buffer2.length;
      } else {
        last2 = end >= buffer2.length;
      }
      last2 = last2 && pad <= 0;
      var block = encryptRecord(
        key,
        counter,
        buffer2.slice(start, end),
        recordPad,
        header,
        last2
      );
      result = Buffer.concat([result, block]);
      start = end;
      ++counter;
    }
    return result;
  }
  function isFunction(object) {
    return typeof object === "function";
  }
  ece = {
    decrypt,
    encrypt
  };
  return ece;
}
var encryptionHelper;
var hasRequiredEncryptionHelper;
function requireEncryptionHelper() {
  if (hasRequiredEncryptionHelper) return encryptionHelper;
  hasRequiredEncryptionHelper = 1;
  const crypto = require$$0$2;
  const ece2 = requireEce();
  const encrypt = function(userPublicKey, userAuth, payload, contentEncoding) {
    if (!userPublicKey) {
      throw new Error("No user public key provided for encryption.");
    }
    if (typeof userPublicKey !== "string") {
      throw new Error("The subscription p256dh value must be a string.");
    }
    if (Buffer.from(userPublicKey, "base64url").length !== 65) {
      throw new Error("The subscription p256dh value should be 65 bytes long.");
    }
    if (!userAuth) {
      throw new Error("No user auth provided for encryption.");
    }
    if (typeof userAuth !== "string") {
      throw new Error("The subscription auth key must be a string.");
    }
    if (Buffer.from(userAuth, "base64url").length < 16) {
      throw new Error("The subscription auth key should be at least 16 bytes long");
    }
    if (typeof payload !== "string" && !Buffer.isBuffer(payload)) {
      throw new Error("Payload must be either a string or a Node Buffer.");
    }
    if (typeof payload === "string" || payload instanceof String) {
      payload = Buffer.from(payload);
    }
    const localCurve = crypto.createECDH("prime256v1");
    const localPublicKey = localCurve.generateKeys();
    const salt = crypto.randomBytes(16).toString("base64url");
    const cipherText = ece2.encrypt(payload, {
      version: contentEncoding,
      dh: userPublicKey,
      privateKey: localCurve,
      salt,
      authSecret: userAuth
    });
    return {
      localPublicKey,
      salt,
      cipherText
    };
  };
  encryptionHelper = {
    encrypt
  };
  return encryptionHelper;
}
var webPushError;
var hasRequiredWebPushError;
function requireWebPushError() {
  if (hasRequiredWebPushError) return webPushError;
  hasRequiredWebPushError = 1;
  function WebPushError(message, statusCode, headers, body, endpoint) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = statusCode;
    this.headers = headers;
    this.body = body;
    this.endpoint = endpoint;
  }
  require$$5.inherits(WebPushError, Error);
  webPushError = WebPushError;
  return webPushError;
}
var dist$1 = {};
var src$1 = { exports: {} };
var browser = { exports: {} };
var ms;
var hasRequiredMs;
function requireMs() {
  if (hasRequiredMs) return ms;
  hasRequiredMs = 1;
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;
  ms = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0) {
      return parse(val);
    } else if (type === "number" && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
    );
  };
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || "ms").toLowerCase();
    switch (type) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "weeks":
      case "week":
      case "w":
        return n * w;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return Math.round(ms2 / d) + "d";
    }
    if (msAbs >= h) {
      return Math.round(ms2 / h) + "h";
    }
    if (msAbs >= m) {
      return Math.round(ms2 / m) + "m";
    }
    if (msAbs >= s) {
      return Math.round(ms2 / s) + "s";
    }
    return ms2 + "ms";
  }
  function fmtLong(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return plural(ms2, msAbs, d, "day");
    }
    if (msAbs >= h) {
      return plural(ms2, msAbs, h, "hour");
    }
    if (msAbs >= m) {
      return plural(ms2, msAbs, m, "minute");
    }
    if (msAbs >= s) {
      return plural(ms2, msAbs, s, "second");
    }
    return ms2 + " ms";
  }
  function plural(ms2, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms2 / n) + " " + name + (isPlural ? "s" : "");
  }
  return ms;
}
var common;
var hasRequiredCommon;
function requireCommon() {
  if (hasRequiredCommon) return common;
  hasRequiredCommon = 1;
  function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce2;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = requireMs();
    createDebug.destroy = destroy;
    Object.keys(env).forEach((key) => {
      createDebug[key] = env[key];
    });
    createDebug.names = [];
    createDebug.skips = [];
    createDebug.formatters = {};
    function selectColor(namespace) {
      let hash = 0;
      for (let i = 0; i < namespace.length; i++) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    function createDebug(namespace) {
      let prevTime;
      let enableOverride = null;
      let namespacesCache;
      let enabledCache;
      function debug(...args) {
        if (!debug.enabled) {
          return;
        }
        const self2 = debug;
        const curr = Number(/* @__PURE__ */ new Date());
        const ms2 = curr - (prevTime || curr);
        self2.diff = ms2;
        self2.prev = prevTime;
        self2.curr = curr;
        prevTime = curr;
        args[0] = createDebug.coerce(args[0]);
        if (typeof args[0] !== "string") {
          args.unshift("%O");
        }
        let index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
          if (match === "%%") {
            return "%";
          }
          index++;
          const formatter = createDebug.formatters[format];
          if (typeof formatter === "function") {
            const val = args[index];
            match = formatter.call(self2, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        createDebug.formatArgs.call(self2, args);
        const logFn = self2.log || createDebug.log;
        logFn.apply(self2, args);
      }
      debug.namespace = namespace;
      debug.useColors = createDebug.useColors();
      debug.color = createDebug.selectColor(namespace);
      debug.extend = extend;
      debug.destroy = createDebug.destroy;
      Object.defineProperty(debug, "enabled", {
        enumerable: true,
        configurable: false,
        get: () => {
          if (enableOverride !== null) {
            return enableOverride;
          }
          if (namespacesCache !== createDebug.namespaces) {
            namespacesCache = createDebug.namespaces;
            enabledCache = createDebug.enabled(namespace);
          }
          return enabledCache;
        },
        set: (v) => {
          enableOverride = v;
        }
      });
      if (typeof createDebug.init === "function") {
        createDebug.init(debug);
      }
      return debug;
    }
    function extend(namespace, delimiter) {
      const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
      newDebug.log = this.log;
      return newDebug;
    }
    function enable(namespaces) {
      createDebug.save(namespaces);
      createDebug.namespaces = namespaces;
      createDebug.names = [];
      createDebug.skips = [];
      const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const ns of split) {
        if (ns[0] === "-") {
          createDebug.skips.push(ns.slice(1));
        } else {
          createDebug.names.push(ns);
        }
      }
    }
    function matchesTemplate(search, template) {
      let searchIndex = 0;
      let templateIndex = 0;
      let starIndex = -1;
      let matchIndex = 0;
      while (searchIndex < search.length) {
        if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
          if (template[templateIndex] === "*") {
            starIndex = templateIndex;
            matchIndex = searchIndex;
            templateIndex++;
          } else {
            searchIndex++;
            templateIndex++;
          }
        } else if (starIndex !== -1) {
          templateIndex = starIndex + 1;
          matchIndex++;
          searchIndex = matchIndex;
        } else {
          return false;
        }
      }
      while (templateIndex < template.length && template[templateIndex] === "*") {
        templateIndex++;
      }
      return templateIndex === template.length;
    }
    function disable() {
      const namespaces = [
        ...createDebug.names,
        ...createDebug.skips.map((namespace) => "-" + namespace)
      ].join(",");
      createDebug.enable("");
      return namespaces;
    }
    function enabled(name) {
      for (const skip of createDebug.skips) {
        if (matchesTemplate(name, skip)) {
          return false;
        }
      }
      for (const ns of createDebug.names) {
        if (matchesTemplate(name, ns)) {
          return true;
        }
      }
      return false;
    }
    function coerce2(val) {
      if (val instanceof Error) {
        return val.stack || val.message;
      }
      return val;
    }
    function destroy() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    createDebug.enable(createDebug.load());
    return createDebug;
  }
  common = setup;
  return common;
}
var hasRequiredBrowser;
function requireBrowser() {
  if (hasRequiredBrowser) return browser.exports;
  hasRequiredBrowser = 1;
  (function(module, exports$1) {
    exports$1.formatArgs = formatArgs;
    exports$1.save = save;
    exports$1.load = load;
    exports$1.useColors = useColors;
    exports$1.storage = localstorage();
    exports$1.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports$1.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports$1.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports$1.storage.setItem("debug", namespaces);
        } else {
          exports$1.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports$1.storage.getItem("debug") || exports$1.storage.getItem("DEBUG");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = requireCommon()(exports$1);
    const { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  })(browser, browser.exports);
  return browser.exports;
}
var node = { exports: {} };
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(tty$1);
var hasFlag;
var hasRequiredHasFlag;
function requireHasFlag() {
  if (hasRequiredHasFlag) return hasFlag;
  hasRequiredHasFlag = 1;
  hasFlag = (flag, argv = process.argv) => {
    const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
    const position = argv.indexOf(prefix + flag);
    const terminatorPosition = argv.indexOf("--");
    return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
  };
  return hasFlag;
}
var supportsColor_1;
var hasRequiredSupportsColor;
function requireSupportsColor() {
  if (hasRequiredSupportsColor) return supportsColor_1;
  hasRequiredSupportsColor = 1;
  const os = require$$0$3;
  const tty2 = require$$0;
  const hasFlag2 = requireHasFlag();
  const { env } = process;
  let forceColor;
  if (hasFlag2("no-color") || hasFlag2("no-colors") || hasFlag2("color=false") || hasFlag2("color=never")) {
    forceColor = 0;
  } else if (hasFlag2("color") || hasFlag2("colors") || hasFlag2("color=true") || hasFlag2("color=always")) {
    forceColor = 1;
  }
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      forceColor = 1;
    } else if (env.FORCE_COLOR === "false") {
      forceColor = 0;
    } else {
      forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
    }
  }
  function translateLevel(level) {
    if (level === 0) {
      return false;
    }
    return {
      level,
      hasBasic: true,
      has256: level >= 2,
      has16m: level >= 3
    };
  }
  function supportsColor(haveStream, streamIsTTY) {
    if (forceColor === 0) {
      return 0;
    }
    if (hasFlag2("color=16m") || hasFlag2("color=full") || hasFlag2("color=truecolor")) {
      return 3;
    }
    if (hasFlag2("color=256")) {
      return 2;
    }
    if (haveStream && !streamIsTTY && forceColor === void 0) {
      return 0;
    }
    const min = forceColor || 0;
    if (env.TERM === "dumb") {
      return min;
    }
    if (process.platform === "win32") {
      const osRelease = os.release().split(".");
      if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
        return Number(osRelease[2]) >= 14931 ? 3 : 2;
      }
      return 1;
    }
    if ("CI" in env) {
      if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
        return 1;
      }
      return min;
    }
    if ("TEAMCITY_VERSION" in env) {
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
    }
    if (env.COLORTERM === "truecolor") {
      return 3;
    }
    if ("TERM_PROGRAM" in env) {
      const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (env.TERM_PROGRAM) {
        case "iTerm.app":
          return version >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    if (/-256(color)?$/i.test(env.TERM)) {
      return 2;
    }
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
      return 1;
    }
    if ("COLORTERM" in env) {
      return 1;
    }
    return min;
  }
  function getSupportLevel(stream) {
    const level = supportsColor(stream, stream && stream.isTTY);
    return translateLevel(level);
  }
  supportsColor_1 = {
    supportsColor: getSupportLevel,
    stdout: translateLevel(supportsColor(true, tty2.isatty(1))),
    stderr: translateLevel(supportsColor(true, tty2.isatty(2)))
  };
  return supportsColor_1;
}
var hasRequiredNode;
function requireNode() {
  if (hasRequiredNode) return node.exports;
  hasRequiredNode = 1;
  (function(module, exports$1) {
    const tty2 = require$$0;
    const util = require$$5;
    exports$1.init = init;
    exports$1.log = log;
    exports$1.formatArgs = formatArgs;
    exports$1.save = save;
    exports$1.load = load;
    exports$1.useColors = useColors;
    exports$1.destroy = util.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports$1.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = requireSupportsColor();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports$1.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports$1.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports$1.inspectOpts ? Boolean(exports$1.inspectOpts.colors) : tty2.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports$1.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.formatWithOptions(exports$1.inspectOpts, ...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug) {
      debug.inspectOpts = {};
      const keys = Object.keys(exports$1.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports$1.inspectOpts[keys[i]];
      }
    }
    module.exports = requireCommon()(exports$1);
    const { formatters } = module.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  })(node, node.exports);
  return node.exports;
}
var hasRequiredSrc$1;
function requireSrc$1() {
  if (hasRequiredSrc$1) return src$1.exports;
  hasRequiredSrc$1 = 1;
  if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
    src$1.exports = requireBrowser();
  } else {
    src$1.exports = requireNode();
  }
  return src$1.exports;
}
var dist = {};
var helpers = {};
var hasRequiredHelpers;
function requireHelpers() {
  if (hasRequiredHelpers) return helpers;
  hasRequiredHelpers = 1;
  var __createBinding = helpers && helpers.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = helpers && helpers.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = helpers && helpers.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(helpers, "__esModule", { value: true });
  helpers.req = helpers.json = helpers.toBuffer = void 0;
  const http = __importStar(require$$0$4);
  const https = __importStar(require$$1);
  async function toBuffer(stream) {
    let length = 0;
    const chunks = [];
    for await (const chunk of stream) {
      length += chunk.length;
      chunks.push(chunk);
    }
    return Buffer.concat(chunks, length);
  }
  helpers.toBuffer = toBuffer;
  async function json(stream) {
    const buf = await toBuffer(stream);
    const str = buf.toString("utf8");
    try {
      return JSON.parse(str);
    } catch (_err) {
      const err = _err;
      err.message += ` (input: ${str})`;
      throw err;
    }
  }
  helpers.json = json;
  function req(url, opts = {}) {
    const href = typeof url === "string" ? url : url.href;
    const req2 = (href.startsWith("https:") ? https : http).request(url, opts);
    const promise = new Promise((resolve, reject) => {
      req2.once("response", resolve).once("error", reject).end();
    });
    req2.then = promise.then.bind(promise);
    return req2;
  }
  helpers.req = req;
  return helpers;
}
var hasRequiredDist$1;
function requireDist$1() {
  if (hasRequiredDist$1) return dist;
  hasRequiredDist$1 = 1;
  (function(exports$1) {
    var __createBinding = dist && dist.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = dist && dist.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = dist && dist.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __exportStar = dist && dist.__exportStar || function(m, exports$12) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$12, p)) __createBinding(exports$12, m, p);
    };
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.Agent = void 0;
    const net = __importStar(require$$0$5);
    const http = __importStar(require$$0$4);
    const https_1 = require$$1;
    __exportStar(requireHelpers(), exports$1);
    const INTERNAL = /* @__PURE__ */ Symbol("AgentBaseInternalState");
    class Agent extends http.Agent {
      constructor(opts) {
        super(opts);
        this[INTERNAL] = {};
      }
      /**
       * Determine whether this is an `http` or `https` request.
       */
      isSecureEndpoint(options) {
        if (options) {
          if (typeof options.secureEndpoint === "boolean") {
            return options.secureEndpoint;
          }
          if (typeof options.protocol === "string") {
            return options.protocol === "https:";
          }
        }
        const { stack } = new Error();
        if (typeof stack !== "string")
          return false;
        return stack.split("\n").some((l) => l.indexOf("(https.js:") !== -1 || l.indexOf("node:https:") !== -1);
      }
      // In order to support async signatures in `connect()` and Node's native
      // connection pooling in `http.Agent`, the array of sockets for each origin
      // has to be updated synchronously. This is so the length of the array is
      // accurate when `addRequest()` is next called. We achieve this by creating a
      // fake socket and adding it to `sockets[origin]` and incrementing
      // `totalSocketCount`.
      incrementSockets(name) {
        if (this.maxSockets === Infinity && this.maxTotalSockets === Infinity) {
          return null;
        }
        if (!this.sockets[name]) {
          this.sockets[name] = [];
        }
        const fakeSocket = new net.Socket({ writable: false });
        this.sockets[name].push(fakeSocket);
        this.totalSocketCount++;
        return fakeSocket;
      }
      decrementSockets(name, socket) {
        if (!this.sockets[name] || socket === null) {
          return;
        }
        const sockets = this.sockets[name];
        const index = sockets.indexOf(socket);
        if (index !== -1) {
          sockets.splice(index, 1);
          this.totalSocketCount--;
          if (sockets.length === 0) {
            delete this.sockets[name];
          }
        }
      }
      // In order to properly update the socket pool, we need to call `getName()` on
      // the core `https.Agent` if it is a secureEndpoint.
      getName(options) {
        const secureEndpoint = this.isSecureEndpoint(options);
        if (secureEndpoint) {
          return https_1.Agent.prototype.getName.call(this, options);
        }
        return super.getName(options);
      }
      createSocket(req, options, cb) {
        const connectOpts = {
          ...options,
          secureEndpoint: this.isSecureEndpoint(options)
        };
        const name = this.getName(connectOpts);
        const fakeSocket = this.incrementSockets(name);
        Promise.resolve().then(() => this.connect(req, connectOpts)).then((socket) => {
          this.decrementSockets(name, fakeSocket);
          if (socket instanceof http.Agent) {
            try {
              return socket.addRequest(req, connectOpts);
            } catch (err) {
              return cb(err);
            }
          }
          this[INTERNAL].currentSocket = socket;
          super.createSocket(req, options, cb);
        }, (err) => {
          this.decrementSockets(name, fakeSocket);
          cb(err);
        });
      }
      createConnection() {
        const socket = this[INTERNAL].currentSocket;
        this[INTERNAL].currentSocket = void 0;
        if (!socket) {
          throw new Error("No socket was returned in the `connect()` function");
        }
        return socket;
      }
      get defaultPort() {
        return this[INTERNAL].defaultPort ?? (this.protocol === "https:" ? 443 : 80);
      }
      set defaultPort(v) {
        if (this[INTERNAL]) {
          this[INTERNAL].defaultPort = v;
        }
      }
      get protocol() {
        return this[INTERNAL].protocol ?? (this.isSecureEndpoint() ? "https:" : "http:");
      }
      set protocol(v) {
        if (this[INTERNAL]) {
          this[INTERNAL].protocol = v;
        }
      }
    }
    exports$1.Agent = Agent;
  })(dist);
  return dist;
}
var parseProxyResponse = {};
var hasRequiredParseProxyResponse;
function requireParseProxyResponse() {
  if (hasRequiredParseProxyResponse) return parseProxyResponse;
  hasRequiredParseProxyResponse = 1;
  var __importDefault = parseProxyResponse && parseProxyResponse.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(parseProxyResponse, "__esModule", { value: true });
  parseProxyResponse.parseProxyResponse = void 0;
  const debug_1 = __importDefault(requireSrc$1());
  const debug = (0, debug_1.default)("https-proxy-agent:parse-proxy-response");
  function parseProxyResponse$1(socket) {
    return new Promise((resolve, reject) => {
      let buffersLength = 0;
      const buffers = [];
      function read() {
        const b = socket.read();
        if (b)
          ondata(b);
        else
          socket.once("readable", read);
      }
      function cleanup() {
        socket.removeListener("end", onend);
        socket.removeListener("error", onerror);
        socket.removeListener("readable", read);
      }
      function onend() {
        cleanup();
        debug("onend");
        reject(new Error("Proxy connection ended before receiving CONNECT response"));
      }
      function onerror(err) {
        cleanup();
        debug("onerror %o", err);
        reject(err);
      }
      function ondata(b) {
        buffers.push(b);
        buffersLength += b.length;
        const buffered = Buffer.concat(buffers, buffersLength);
        const endOfHeaders = buffered.indexOf("\r\n\r\n");
        if (endOfHeaders === -1) {
          debug("have not received end of HTTP headers yet...");
          read();
          return;
        }
        const headerParts = buffered.slice(0, endOfHeaders).toString("ascii").split("\r\n");
        const firstLine = headerParts.shift();
        if (!firstLine) {
          socket.destroy();
          return reject(new Error("No header received from proxy CONNECT response"));
        }
        const firstLineParts = firstLine.split(" ");
        const statusCode = +firstLineParts[1];
        const statusText = firstLineParts.slice(2).join(" ");
        const headers = {};
        for (const header of headerParts) {
          if (!header)
            continue;
          const firstColon = header.indexOf(":");
          if (firstColon === -1) {
            socket.destroy();
            return reject(new Error(`Invalid header from proxy CONNECT response: "${header}"`));
          }
          const key = header.slice(0, firstColon).toLowerCase();
          const value = header.slice(firstColon + 1).trimStart();
          const current = headers[key];
          if (typeof current === "string") {
            headers[key] = [current, value];
          } else if (Array.isArray(current)) {
            current.push(value);
          } else {
            headers[key] = value;
          }
        }
        debug("got proxy server response: %o %o", firstLine, headers);
        cleanup();
        resolve({
          connect: {
            statusCode,
            statusText,
            headers
          },
          buffered
        });
      }
      socket.on("error", onerror);
      socket.on("end", onend);
      read();
    });
  }
  parseProxyResponse.parseProxyResponse = parseProxyResponse$1;
  return parseProxyResponse;
}
var hasRequiredDist;
function requireDist() {
  if (hasRequiredDist) return dist$1;
  hasRequiredDist = 1;
  var __createBinding = dist$1 && dist$1.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = dist$1 && dist$1.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = dist$1 && dist$1.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __importDefault = dist$1 && dist$1.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(dist$1, "__esModule", { value: true });
  dist$1.HttpsProxyAgent = void 0;
  const net = __importStar(require$$0$5);
  const tls = __importStar(require$$1$1);
  const assert_1 = __importDefault(require$$2);
  const debug_1 = __importDefault(requireSrc$1());
  const agent_base_1 = requireDist$1();
  const url_1 = require$$3$1;
  const parse_proxy_response_1 = requireParseProxyResponse();
  const debug = (0, debug_1.default)("https-proxy-agent");
  const setServernameFromNonIpHost = (options) => {
    if (options.servername === void 0 && options.host && !net.isIP(options.host)) {
      return {
        ...options,
        servername: options.host
      };
    }
    return options;
  };
  class HttpsProxyAgent extends agent_base_1.Agent {
    constructor(proxy, opts) {
      super(opts);
      this.options = { path: void 0 };
      this.proxy = typeof proxy === "string" ? new url_1.URL(proxy) : proxy;
      this.proxyHeaders = opts?.headers ?? {};
      debug("Creating new HttpsProxyAgent instance: %o", this.proxy.href);
      const host = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, "");
      const port = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
      this.connectOpts = {
        // Attempt to negotiate http/1.1 for proxy servers that support http/2
        ALPNProtocols: ["http/1.1"],
        ...opts ? omit(opts, "headers") : null,
        host,
        port
      };
    }
    /**
     * Called when the node-core HTTP client library is creating a
     * new HTTP request.
     */
    async connect(req, opts) {
      const { proxy } = this;
      if (!opts.host) {
        throw new TypeError('No "host" provided');
      }
      let socket;
      if (proxy.protocol === "https:") {
        debug("Creating `tls.Socket`: %o", this.connectOpts);
        socket = tls.connect(setServernameFromNonIpHost(this.connectOpts));
      } else {
        debug("Creating `net.Socket`: %o", this.connectOpts);
        socket = net.connect(this.connectOpts);
      }
      const headers = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : { ...this.proxyHeaders };
      const host = net.isIPv6(opts.host) ? `[${opts.host}]` : opts.host;
      let payload = `CONNECT ${host}:${opts.port} HTTP/1.1\r
`;
      if (proxy.username || proxy.password) {
        const auth = `${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password)}`;
        headers["Proxy-Authorization"] = `Basic ${Buffer.from(auth).toString("base64")}`;
      }
      headers.Host = `${host}:${opts.port}`;
      if (!headers["Proxy-Connection"]) {
        headers["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
      }
      for (const name of Object.keys(headers)) {
        payload += `${name}: ${headers[name]}\r
`;
      }
      const proxyResponsePromise = (0, parse_proxy_response_1.parseProxyResponse)(socket);
      socket.write(`${payload}\r
`);
      const { connect, buffered } = await proxyResponsePromise;
      req.emit("proxyConnect", connect);
      this.emit("proxyConnect", connect, req);
      if (connect.statusCode === 200) {
        req.once("socket", resume);
        if (opts.secureEndpoint) {
          debug("Upgrading socket connection to TLS");
          return tls.connect({
            ...omit(setServernameFromNonIpHost(opts), "host", "path", "port"),
            socket
          });
        }
        return socket;
      }
      socket.destroy();
      const fakeSocket = new net.Socket({ writable: false });
      fakeSocket.readable = true;
      req.once("socket", (s) => {
        debug("Replaying proxy buffer for failed request");
        (0, assert_1.default)(s.listenerCount("data") > 0);
        s.push(buffered);
        s.push(null);
      });
      return fakeSocket;
    }
  }
  HttpsProxyAgent.protocols = ["http", "https"];
  dist$1.HttpsProxyAgent = HttpsProxyAgent;
  function resume(socket) {
    socket.resume();
  }
  function omit(obj, ...keys) {
    const ret = {};
    let key;
    for (key in obj) {
      if (!keys.includes(key)) {
        ret[key] = obj[key];
      }
    }
    return ret;
  }
  return dist$1;
}
var webPushLib;
var hasRequiredWebPushLib;
function requireWebPushLib() {
  if (hasRequiredWebPushLib) return webPushLib;
  hasRequiredWebPushLib = 1;
  const url = require$$3$1;
  const https = require$$1;
  const WebPushError = requireWebPushError();
  const vapidHelper2 = requireVapidHelper();
  const encryptionHelper2 = requireEncryptionHelper();
  const webPushConstants2 = requireWebPushConstants();
  const urlBase64Helper = requireUrlsafeBase64Helper();
  const DEFAULT_TTL = 2419200;
  let gcmAPIKey = "";
  let vapidDetails;
  function WebPushLib() {
  }
  WebPushLib.prototype.setGCMAPIKey = function(apiKey2) {
    if (apiKey2 === null) {
      gcmAPIKey = null;
      return;
    }
    if (typeof apiKey2 === "undefined" || typeof apiKey2 !== "string" || apiKey2.length === 0) {
      throw new Error("The GCM API Key should be a non-empty string or null.");
    }
    gcmAPIKey = apiKey2;
  };
  WebPushLib.prototype.setVapidDetails = function(subject, publicKey, privateKey) {
    if (arguments.length === 1 && arguments[0] === null) {
      vapidDetails = null;
      return;
    }
    vapidHelper2.validateSubject(subject);
    vapidHelper2.validatePublicKey(publicKey);
    vapidHelper2.validatePrivateKey(privateKey);
    vapidDetails = {
      subject,
      publicKey,
      privateKey
    };
  };
  WebPushLib.prototype.generateRequestDetails = function(subscription, payload, options) {
    if (!subscription || !subscription.endpoint) {
      throw new Error("You must pass in a subscription with at least an endpoint.");
    }
    if (typeof subscription.endpoint !== "string" || subscription.endpoint.length === 0) {
      throw new Error("The subscription endpoint must be a string with a valid URL.");
    }
    if (payload) {
      if (typeof subscription !== "object" || !subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
        throw new Error("To send a message with a payload, the subscription must have 'auth' and 'p256dh' keys.");
      }
    }
    let currentGCMAPIKey = gcmAPIKey;
    let currentVapidDetails = vapidDetails;
    let timeToLive = DEFAULT_TTL;
    let extraHeaders = {};
    let contentEncoding = webPushConstants2.supportedContentEncodings.AES_128_GCM;
    let urgency = webPushConstants2.supportedUrgency.NORMAL;
    let topic;
    let proxy;
    let agent;
    let timeout;
    if (options) {
      const validOptionKeys = [
        "headers",
        "gcmAPIKey",
        "vapidDetails",
        "TTL",
        "contentEncoding",
        "urgency",
        "topic",
        "proxy",
        "agent",
        "timeout"
      ];
      const optionKeys = Object.keys(options);
      for (let i = 0; i < optionKeys.length; i += 1) {
        const optionKey = optionKeys[i];
        if (!validOptionKeys.includes(optionKey)) {
          throw new Error("'" + optionKey + "' is an invalid option. The valid options are ['" + validOptionKeys.join("', '") + "'].");
        }
      }
      if (options.headers) {
        extraHeaders = options.headers;
        let duplicates = Object.keys(extraHeaders).filter(function(header) {
          return typeof options[header] !== "undefined";
        });
        if (duplicates.length > 0) {
          throw new Error("Duplicated headers defined [" + duplicates.join(",") + "]. Please either define the header in thetop level options OR in the 'headers' key.");
        }
      }
      if (options.gcmAPIKey) {
        currentGCMAPIKey = options.gcmAPIKey;
      }
      if (options.vapidDetails !== void 0) {
        currentVapidDetails = options.vapidDetails;
      }
      if (options.TTL !== void 0) {
        timeToLive = Number(options.TTL);
        if (timeToLive < 0) {
          throw new Error("TTL should be a number and should be at least 0");
        }
      }
      if (options.contentEncoding) {
        if (options.contentEncoding === webPushConstants2.supportedContentEncodings.AES_128_GCM || options.contentEncoding === webPushConstants2.supportedContentEncodings.AES_GCM) {
          contentEncoding = options.contentEncoding;
        } else {
          throw new Error("Unsupported content encoding specified.");
        }
      }
      if (options.urgency) {
        if (options.urgency === webPushConstants2.supportedUrgency.VERY_LOW || options.urgency === webPushConstants2.supportedUrgency.LOW || options.urgency === webPushConstants2.supportedUrgency.NORMAL || options.urgency === webPushConstants2.supportedUrgency.HIGH) {
          urgency = options.urgency;
        } else {
          throw new Error("Unsupported urgency specified.");
        }
      }
      if (options.topic) {
        if (!urlBase64Helper.validate(options.topic)) {
          throw new Error("Unsupported characters set use the URL or filename-safe Base64 characters set");
        }
        if (options.topic.length > 32) {
          throw new Error("use maximum of 32 characters from the URL or filename-safe Base64 characters set");
        }
        topic = options.topic;
      }
      if (options.proxy) {
        if (typeof options.proxy === "string" || typeof options.proxy.host === "string") {
          proxy = options.proxy;
        } else {
          console.warn("Attempt to use proxy option, but invalid type it should be a string or proxy options object.");
        }
      }
      if (options.agent) {
        if (options.agent instanceof https.Agent) {
          if (proxy) {
            console.warn("Agent option will be ignored because proxy option is defined.");
          }
          agent = options.agent;
        } else {
          console.warn("Wrong type for the agent option, it should be an instance of https.Agent.");
        }
      }
      if (typeof options.timeout === "number") {
        timeout = options.timeout;
      }
    }
    if (typeof timeToLive === "undefined") {
      timeToLive = DEFAULT_TTL;
    }
    const requestDetails = {
      method: "POST",
      headers: {
        TTL: timeToLive
      }
    };
    Object.keys(extraHeaders).forEach(function(header) {
      requestDetails.headers[header] = extraHeaders[header];
    });
    let requestPayload = null;
    if (payload) {
      const encrypted = encryptionHelper2.encrypt(subscription.keys.p256dh, subscription.keys.auth, payload, contentEncoding);
      requestDetails.headers["Content-Length"] = encrypted.cipherText.length;
      requestDetails.headers["Content-Type"] = "application/octet-stream";
      if (contentEncoding === webPushConstants2.supportedContentEncodings.AES_128_GCM) {
        requestDetails.headers["Content-Encoding"] = webPushConstants2.supportedContentEncodings.AES_128_GCM;
      } else if (contentEncoding === webPushConstants2.supportedContentEncodings.AES_GCM) {
        requestDetails.headers["Content-Encoding"] = webPushConstants2.supportedContentEncodings.AES_GCM;
        requestDetails.headers.Encryption = "salt=" + encrypted.salt;
        requestDetails.headers["Crypto-Key"] = "dh=" + encrypted.localPublicKey.toString("base64url");
      }
      requestPayload = encrypted.cipherText;
    } else {
      requestDetails.headers["Content-Length"] = 0;
    }
    const isGCM = subscription.endpoint.startsWith("https://android.googleapis.com/gcm/send");
    const isFCM = subscription.endpoint.startsWith("https://fcm.googleapis.com/fcm/send");
    if (isGCM) {
      if (!currentGCMAPIKey) {
        console.warn("Attempt to send push notification to GCM endpoint, but no GCM key is defined. Please use setGCMApiKey() or add 'gcmAPIKey' as an option.");
      } else {
        requestDetails.headers.Authorization = "key=" + currentGCMAPIKey;
      }
    } else if (currentVapidDetails) {
      const parsedUrl = url.parse(subscription.endpoint);
      const audience = parsedUrl.protocol + "//" + parsedUrl.host;
      const vapidHeaders = vapidHelper2.getVapidHeaders(
        audience,
        currentVapidDetails.subject,
        currentVapidDetails.publicKey,
        currentVapidDetails.privateKey,
        contentEncoding
      );
      requestDetails.headers.Authorization = vapidHeaders.Authorization;
      if (contentEncoding === webPushConstants2.supportedContentEncodings.AES_GCM) {
        if (requestDetails.headers["Crypto-Key"]) {
          requestDetails.headers["Crypto-Key"] += ";" + vapidHeaders["Crypto-Key"];
        } else {
          requestDetails.headers["Crypto-Key"] = vapidHeaders["Crypto-Key"];
        }
      }
    } else if (isFCM && currentGCMAPIKey) {
      requestDetails.headers.Authorization = "key=" + currentGCMAPIKey;
    }
    requestDetails.headers.Urgency = urgency;
    if (topic) {
      requestDetails.headers.Topic = topic;
    }
    requestDetails.body = requestPayload;
    requestDetails.endpoint = subscription.endpoint;
    if (proxy) {
      requestDetails.proxy = proxy;
    }
    if (agent) {
      requestDetails.agent = agent;
    }
    if (timeout) {
      requestDetails.timeout = timeout;
    }
    return requestDetails;
  };
  WebPushLib.prototype.sendNotification = function(subscription, payload, options) {
    let requestDetails;
    try {
      requestDetails = this.generateRequestDetails(subscription, payload, options);
    } catch (err) {
      return Promise.reject(err);
    }
    return new Promise(function(resolve, reject) {
      const httpsOptions = {};
      const urlParts = url.parse(requestDetails.endpoint);
      httpsOptions.hostname = urlParts.hostname;
      httpsOptions.port = urlParts.port;
      httpsOptions.path = urlParts.path;
      httpsOptions.headers = requestDetails.headers;
      httpsOptions.method = requestDetails.method;
      if (requestDetails.timeout) {
        httpsOptions.timeout = requestDetails.timeout;
      }
      if (requestDetails.agent) {
        httpsOptions.agent = requestDetails.agent;
      }
      if (requestDetails.proxy) {
        const { HttpsProxyAgent } = requireDist();
        httpsOptions.agent = new HttpsProxyAgent(requestDetails.proxy);
      }
      const pushRequest = https.request(httpsOptions, function(pushResponse) {
        let responseText = "";
        pushResponse.on("data", function(chunk) {
          responseText += chunk;
        });
        pushResponse.on("end", function() {
          if (pushResponse.statusCode < 200 || pushResponse.statusCode > 299) {
            reject(new WebPushError(
              "Received unexpected response code",
              pushResponse.statusCode,
              pushResponse.headers,
              responseText,
              requestDetails.endpoint
            ));
          } else {
            resolve({
              statusCode: pushResponse.statusCode,
              body: responseText,
              headers: pushResponse.headers
            });
          }
        });
      });
      if (requestDetails.timeout) {
        pushRequest.on("timeout", function() {
          pushRequest.destroy(new Error("Socket timeout"));
        });
      }
      pushRequest.on("error", function(e) {
        reject(e);
      });
      if (requestDetails.body) {
        pushRequest.write(requestDetails.body);
      }
      pushRequest.end();
    });
  };
  webPushLib = WebPushLib;
  return webPushLib;
}
var src;
var hasRequiredSrc;
function requireSrc() {
  if (hasRequiredSrc) return src;
  hasRequiredSrc = 1;
  const vapidHelper2 = requireVapidHelper();
  const encryptionHelper2 = requireEncryptionHelper();
  const WebPushLib = requireWebPushLib();
  const WebPushError = requireWebPushError();
  const WebPushConstants = requireWebPushConstants();
  const webPush = new WebPushLib();
  src = {
    WebPushError,
    supportedContentEncodings: WebPushConstants.supportedContentEncodings,
    encrypt: encryptionHelper2.encrypt,
    getVapidHeaders: vapidHelper2.getVapidHeaders,
    generateVAPIDKeys: vapidHelper2.generateVAPIDKeys,
    setGCMAPIKey: webPush.setGCMAPIKey,
    setVapidDetails: webPush.setVapidDetails,
    generateRequestDetails: webPush.generateRequestDetails,
    sendNotification: webPush.sendNotification.bind(webPush)
  };
  return src;
}
var srcExports = requireSrc();
const webpush = /* @__PURE__ */ getDefaultExportFromCjs(srcExports);
const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL = process.env.VAPID_EMAIL || "mailto:admin@fundedng.com";
let configured = false;
function configure() {
  if (configured) return true;
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) return false;
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE);
  configured = true;
  return true;
}
async function sendPushToUser(userId, payload) {
  if (!configure()) {
    console.warn("[push] VAPID keys not configured; skipping");
    return;
  }
  const { data: subs } = await supabaseAdmin.from("push_subscriptions").select("id, endpoint, p256dh, auth").eq("user_id", userId);
  if (!subs?.length) return;
  const body = JSON.stringify({ title: payload.title, body: payload.body, url: payload.url ?? "/dashboard" });
  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          body
        );
      } catch (e) {
        const status = e?.statusCode;
        if (status === 404 || status === 410) {
          await supabaseAdmin.from("push_subscriptions").delete().eq("id", s.id);
        } else {
          console.error("[push] send failed", e);
        }
      }
    })
  );
}
async function sendPushToAdmins(payload) {
  const { data: admins } = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "admin");
  if (!admins?.length) return;
  await Promise.all(admins.map((a) => sendPushToUser(a.user_id, payload)));
}
const Route$B = createFileRoute("/api/provision-account")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const order_id = body?.order_id;
          if (!order_id) {
            return Response.json({ error: "order_id required" }, { status: 400 });
          }
          const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", order_id).maybeSingle();
          if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
          if (order.status !== "paid" && order.status !== "delivered") {
            return Response.json({ error: `Order not paid (status=${order.status})` }, { status: 400 });
          }
          const { data: existing } = await supabaseAdmin.from("trader_accounts").select("id, mt5_login, mt5_server").eq("order_id", order.id).maybeSingle();
          if (existing) {
            return Response.json({
              ok: true,
              already: true,
              login: existing.mt5_login,
              server: existing.mt5_server
            });
          }
          const { data: ch } = await supabaseAdmin.from("challenges").select("*").eq("id", order.challenge_id).single();
          if (!ch) return Response.json({ error: "Challenge missing" }, { status: 500 });
          await supabaseAdmin.from("account_requests").update({
            status: "claimed",
            claimed_by: "bot",
            claimed_at: (/* @__PURE__ */ new Date()).toISOString()
          }).eq("order_id", order.id);
          let provisioned;
          try {
            provisioned = await botProvision({
              balanceNGN: ch.account_size,
              idempotencyKey: order.id,
              challengeName: ch.name
            });
          } catch (err) {
            const reason = err instanceof Error ? err.message : "bot provision failed";
            await supabaseAdmin.from("account_requests").update({
              status: "failed",
              failure_reason: reason.slice(0, 500),
              claimed_by: null
            }).eq("order_id", order.id);
            await supabaseAdmin.from("mt5_worker_events").insert({
              event_type: "bot_provision_failed",
              worker_id: "bot",
              payload: { order_id: order.id, error: reason.slice(0, 1e3) }
            });
            return Response.json({ error: reason }, { status: 502 });
          }
          const { error: insertErr } = await supabaseAdmin.from("trader_accounts").insert({
            user_id: order.user_id,
            order_id: order.id,
            challenge_id: order.challenge_id,
            mt5_login: provisioned.login,
            mt5_password: provisioned.password,
            investor_password: null,
            mt5_server: provisioned.server,
            metaapi_account_id: null,
            provider: "exness-bot",
            starting_balance: ch.account_size,
            current_equity: ch.account_size,
            current_phase: 1,
            status: "active"
          });
          if (insertErr) {
            await supabaseAdmin.from("account_requests").update({
              status: "failed",
              failure_reason: `db insert: ${insertErr.message}`,
              claimed_by: null
            }).eq("order_id", order.id);
            return Response.json({ error: insertErr.message }, { status: 500 });
          }
          await supabaseAdmin.from("orders").update({ status: "delivered" }).eq("id", order.id);
          await supabaseAdmin.from("account_requests").update({
            status: "fulfilled",
            fulfilled_at: (/* @__PURE__ */ new Date()).toISOString(),
            claimed_by: "bot",
            provider_response: { login: provisioned.login, server: provisioned.server }
          }).eq("order_id", order.id);
          await supabaseAdmin.from("mt5_worker_events").insert({
            event_type: "bot_provision_success",
            worker_id: "bot",
            payload: { order_id: order.id, login: provisioned.login, server: provisioned.server }
          });
          await supabaseAdmin.from("notifications").insert({
            user_id: order.user_id,
            title: "🎉 Your MT5 Account is Ready",
            message: `${ch.name} active. Login: ${provisioned.login} · Server: ${provisioned.server}. Open the dashboard to view your password.`,
            type: "welcome"
          });
          await sendPushToUser(order.user_id, {
            title: "🎉 Your MT5 Account is Ready",
            body: `${ch.name} is active. Tap to view your login.`,
            url: "/dashboard"
          });
          await sendEventEmail({ type: "mt5_delivered", orderId: order.id, mt5Login: provisioned.login, mt5Password: provisioned.password, mt5Server: provisioned.server }).catch(
            (e) => console.error("[provision-account] email send failed", e)
          );
          await sendPushToAdmins({
            title: "New challenge purchase",
            body: `${ch.name} delivered for order ${order.id.slice(0, 8)}…`,
            url: "/admin"
          });
          return Response.json({
            ok: true,
            login: provisioned.login,
            server: provisioned.server
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "fail";
          console.error("[provision-account] unexpected", msg);
          return Response.json({ error: msg }, { status: 500 });
        }
      }
    }
  }
});
const Route$A = createFileRoute("/api/partner-application")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const required = [
            "fullName",
            "email",
            "phone",
            "country",
            "primaryPlatform",
            "profileLink",
            "followerCount",
            "communityType",
            "activelyTrades",
            "tradingStyle",
            "passedChallenge",
            "willingToPassPublicly",
            "whyFundedNG",
            "contentType",
            "otherPropFirms"
          ];
          for (const key of required) {
            if (!body[key] || typeof body[key] === "string" && !body[key].trim()) {
              return Response.json({ error: `${key} is required` }, { status: 400 });
            }
          }
          if (!body.email?.includes("@")) {
            return Response.json({ error: "Valid email required" }, { status: 400 });
          }
          if ((body.whyFundedNG?.trim().length ?? 0) < 50) {
            return Response.json({ error: "Why FundedNG must be at least 50 characters" }, { status: 400 });
          }
          if (!body.agreeNoGiveawayOnly || !body.agreePublicChallenge || !body.agreeNoDM || !body.agreeTerms) {
            return Response.json({ error: "All commitments must be acknowledged" }, { status: 400 });
          }
          const { data, error } = await supabaseAdmin.from("partner_applications").insert({
            full_name: body.fullName,
            email: body.email,
            phone: body.phone,
            country: body.country,
            primary_platform: body.primaryPlatform,
            profile_link: body.profileLink,
            follower_count: body.followerCount,
            community_type: body.communityType,
            community_size: body.communitySize || null,
            community_link: body.communityLink || null,
            actively_trades: body.activelyTrades,
            trading_style: body.tradingStyle,
            passed_challenge: body.passedChallenge,
            challenge_platform: body.challengePlatform || null,
            willing_to_pass_publicly: body.willingToPassPublicly,
            why_funded_ng: body.whyFundedNG,
            content_type: body.contentType,
            other_prop_firms: body.otherPropFirms,
            sample_content_link: body.sampleContentLink || null,
            agree_no_giveaway_only: body.agreeNoGiveawayOnly,
            agree_public_challenge: body.agreePublicChallenge,
            agree_no_dm: body.agreeNoDM,
            agree_terms: body.agreeTerms
          }).select("id").single();
          if (error) {
            console.error("[partner-application] insert error", error);
            return Response.json({ error: "Failed to save application" }, { status: 500 });
          }
          const telegramMessage = [
            `🎯 <b>New Partner Application</b>`,
            ``,
            `👤 <b>${body.fullName}</b>`,
            `📧 ${body.email}`,
            `📱 ${body.phone}`,
            `🌍 ${body.country}`,
            ``,
            `📱 <b>Online Presence</b>`,
            `Platform: ${body.primaryPlatform}`,
            `Followers: ${body.followerCount}`,
            `Link: ${body.profileLink}`,
            `Community: ${body.communityType}${body.communitySize ? ` (${body.communitySize})` : ""}`,
            body.communityLink ? `Community Link: ${body.communityLink}` : "",
            ``,
            `📈 <b>Trading Background</b>`,
            `Active Trader: ${body.activelyTrades}`,
            `Style: ${body.tradingStyle}`,
            `Passed Challenge: ${body.passedChallenge}`,
            body.challengePlatform ? `Platform: ${body.challengePlatform}` : "",
            `Willing to Pass Publicly: ${body.willingToPassPublicly}`,
            ``,
            `💡 <b>Brand Fit</b>`,
            `Why FundedNG: ${body.whyFundedNG}`,
            `Content Type: ${body.contentType}`,
            `Other Prop Firms: ${body.otherPropFirms}`,
            body.sampleContentLink ? `Sample: ${body.sampleContentLink}` : "",
            ``,
            `✅ All commitments acknowledged`,
            ``,
            `🔗 <a href="https://app.fundedng.com/admin">Review in Admin Panel</a>`
          ].filter(Boolean).join("\n");
          await supabaseAdmin.rpc("send_telegram", {
            p_message: telegramMessage
          }).catch((e) => {
            console.error("[partner-application] telegram notification failed", e);
          });
          return Response.json({ ok: true, id: data.id });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Unexpected error";
          console.error("[partner-application] unexpected", msg);
          return Response.json({ error: msg }, { status: 500 });
        }
      }
    }
  }
});
const Route$z = createFileRoute("/api/notify-new-purchase")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const order_id = body?.order_id;
          if (!order_id) {
            return Response.json({ error: "order_id required" }, { status: 400 });
          }
          const { data: order } = await supabaseAdmin.from("orders").select("id, user_id, challenge_id").eq("id", order_id).maybeSingle();
          if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
          const { data: ch } = await supabaseAdmin.from("challenges").select("name, price_naira").eq("id", order.challenge_id).maybeSingle();
          const { data: profile } = await supabaseAdmin.from("profiles").select("full_name").eq("id", order.user_id).maybeSingle();
          const traderName = profile?.full_name || "A trader";
          const chName = ch?.name || "Challenge";
          await sendPushToAdmins({
            title: "💰 New challenge purchase",
            body: `${traderName} bought ${chName} — deliver manually in /admin`,
            url: "/admin"
          });
          await sendEventEmail({ type: "purchase_confirmed", orderId: order.id }).catch(
            (e) => console.error("[notify-new-purchase] email send failed", e)
          );
          return Response.json({ ok: true });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "fail";
          console.error("[notify-new-purchase] unexpected", msg);
          return Response.json({ error: msg }, { status: 500 });
        }
      }
    }
  }
});
const Route$y = createFileRoute("/api/initialize-payment")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get("authorization");
          const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : null;
          if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
          const { data: userData, error: authErr } = await supabaseAdmin.auth.getUser(token);
          if (authErr || !userData?.user?.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
          }
          const user = userData.user;
          const body = await request.json().catch(() => ({}));
          const challengeId = body.challenge_id?.trim();
          if (!challengeId) {
            return Response.json({ error: "challenge_id is required" }, { status: 400 });
          }
          const { data: challenge, error: chErr } = await supabaseAdmin.from("challenges").select("id, name, price_naira, usd_price, currency, is_active, account_size").eq("id", challengeId).maybeSingle();
          if (chErr || !challenge || !challenge.is_active) {
            return Response.json({ error: "Challenge not available" }, { status: 404 });
          }
          const orderCurrency = body.currency || challenge.currency || "NGN";
          let effectivePriceNaira;
          if (orderCurrency === "USD") {
            const usdPrice = Number(challenge.usd_price || 0);
            const rate = body.exchange_rate || await getUSDRate();
            effectivePriceNaira = Math.ceil(usdPrice * rate);
          } else {
            effectivePriceNaira = Number(challenge.price_naira);
          }
          const headerOrigin = request.headers.get("origin");
          const referer = request.headers.get("referer");
          let origin = process.env.PUBLIC_SITE_URL?.trim() || headerOrigin || (referer ? new URL(referer).origin : "") || new URL(request.url).origin;
          if (/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(origin)) {
            origin = process.env.PUBLIC_SITE_URL?.trim() || origin;
          }
          const reference = `FNG-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
          const originalAmountNaira = effectivePriceNaira;
          let discountCode = null;
          let partnerPromoCode = null;
          let promoPercent = 0;
          let partnerPercent = 0;
          if (body.discount_code?.trim()) {
            const code = body.discount_code.trim().toUpperCase();
            const { data: promoRows } = await supabaseAdmin.rpc("validate_discount_code", { _code: code, _challenge_id: challengeId });
            const promo = Array.isArray(promoRows) ? promoRows[0] : null;
            if (promo) {
              discountCode = promo.code;
              promoPercent = Number(promo.percent_off) || 0;
            }
          }
          if (body.partner_promo_code?.trim()) {
            const code = body.partner_promo_code.trim().toUpperCase();
            const { data: partner } = await supabaseAdmin.from("partner_profiles").select("promo_code").eq("promo_code", code).eq("is_active", true).maybeSingle();
            if (partner) {
              partnerPromoCode = code;
              partnerPercent = 15;
            }
          }
          if (!partnerPercent) {
            const { data: prof } = await supabaseAdmin.from("profiles").select("partner_referred_by").eq("id", user.id).maybeSingle();
            if (prof?.partner_referred_by) {
              const { data: partner } = await supabaseAdmin.from("partner_profiles").select("promo_code").eq("user_id", prof.partner_referred_by).eq("is_active", true).maybeSingle();
              if (partner) {
                partnerPromoCode = partner.promo_code;
                partnerPercent = 15;
              }
            }
          }
          const discountPercent = promoPercent > 0 ? promoPercent : partnerPercent;
          const discountAmountNaira = Math.floor(originalAmountNaira * discountPercent / 100);
          const amountKobo = Math.max(0, originalAmountNaira - discountAmountNaira) * 100;
          if (amountKobo <= 0) {
            const { data: order, error: orderErr } = await supabaseAdmin.from("orders").insert({
              user_id: user.id,
              challenge_id: challengeId,
              original_amount: originalAmountNaira * 100,
              discount_amount: discountAmountNaira * 100,
              discount_code: discountCode,
              discount_percent: discountPercent,
              partner_promo_code: partnerPromoCode,
              amount_paid: 0,
              status: "paid",
              paystack_reference: reference,
              currency: orderCurrency
            }).select("id").single();
            if (orderErr || !order) {
              return Response.json(
                { error: orderErr?.message ?? "Order creation failed" },
                { status: 500 }
              );
            }
            if (discountCode) {
              await supabaseAdmin.rpc("increment_discount_redemption", { _code: discountCode });
            }
            const poolResult = await claimPoolAccount({
              orderId: order.id,
              accountSizeNgn: orderCurrency === "USD" ? 0 : challenge.account_size,
              accountSizeUsd: orderCurrency === "USD" ? challenge.account_size : void 0,
              currency: orderCurrency,
              challengeId: challenge.id,
              userId: user.id
            }).catch((e) => {
              console.error("[initialize-payment] claimPoolAccount threw", e);
              return null;
            });
            const { data: prof } = await supabaseAdmin.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
            const traderName = prof?.full_name || user.email || "A trader";
            const currencySymbol2 = orderCurrency === "USD" ? "$" : "₦";
            if (poolResult?.ok) {
              try {
                await supabaseAdmin.rpc("send_telegram", {
                  p_message: `✅ <b>Free Purchase — Auto-Delivered</b>
Trader: ${traderName}
Challenge: ${challenge.name}
Size: ${currencySymbol2}${challenge.account_size?.toLocaleString("en-NG")}
Login: ${poolResult.mt5Login}
Server: ${poolResult.mt5Server}`
                });
              } catch (e) {
                console.error("[initialize-payment] telegram send failed", e);
              }
            } else {
              try {
                await supabaseAdmin.rpc("send_telegram", {
                  p_message: `⏳ <b>Free Purchase — Manual Delivery Needed</b>
Trader: ${traderName}
Challenge: ${challenge.name}
Size: ${currencySymbol2}${challenge.account_size?.toLocaleString("en-NG")}
Reason: ${poolResult?.error ?? "Pool unavailable"}`
                });
              } catch (e) {
                console.error("[initialize-payment] telegram send failed", e);
              }
            }
            await sendEventEmail({ type: "purchase_confirmed", orderId: order.id }).catch(
              (e) => console.error("[initialize-payment] email send failed", e)
            );
            return Response.json({ ok: true, free: true, order_id: order.id, reference, auto_delivered: poolResult?.ok ?? false });
          }
          const squadSecret = process.env.SQUAD_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY;
          if (!squadSecret) {
            console.error("[initialize-payment] SQUAD_SECRET_KEY missing");
            return Response.json({ error: "Payment is not configured" }, { status: 500 });
          }
          const { data: profile } = await supabaseAdmin.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
          const customerName = profile?.full_name?.trim() || user.email?.split("@")[0] || "Customer";
          const callbackParams = new URLSearchParams({
            challenge_id: challengeId,
            dp: String(discountPercent),
            oa: String(originalAmountNaira * 100)
          });
          if (discountCode) callbackParams.set("dc", discountCode);
          if (partnerPromoCode) callbackParams.set("pp", partnerPromoCode);
          const initRes = await fetch("https://api-d.squadco.com/transaction/initiate", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${squadSecret}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              amount: amountKobo,
              email: user.email,
              currency: "NGN",
              initiate_type: "inline",
              transaction_ref: reference,
              customer_name: customerName,
              callback_url: `${origin}/payment/callback?${callbackParams.toString()}`,
              payment_channels: ["transfer"],
              metadata: {
                challenge_id: challenge.id,
                challenge_name: challenge.name,
                user_id: user.id
              }
            })
          });
          const initJson = await initRes.json().catch(() => ({}));
          if (!initRes.ok || initJson.status !== 200 || !initJson.data?.checkout_url) {
            console.error("[initialize-payment] Squad raw response:", JSON.stringify(initJson));
            return Response.json(
              { error: JSON.stringify(initJson) },
              { status: 400 }
            );
          }
          return Response.json({
            ok: true,
            authorization_url: initJson.data.checkout_url,
            reference: initJson.data.transaction_ref ?? reference
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Initialization failed";
          console.error("[initialize-payment] unexpected", msg);
          return Response.json({ error: msg }, { status: 500 });
        }
      }
    }
  }
});
const Route$x = createFileRoute("/api/exchange-rate")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const rate = await getUSDRate();
          const { updatedAt } = await getCachedUSDRate();
          return Response.json({ rate, updatedAt });
        } catch {
          const { rate, updatedAt } = await getCachedUSDRate();
          return Response.json({ rate, updatedAt });
        }
      }
    }
  }
});
const Route$w = createFileRoute("/api/deliver-account")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get("authorization");
          const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : null;
          if (!token) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
          }
          const { data: userData, error: authErr } = await supabaseAdmin.auth.getUser(token);
          if (authErr || !userData?.user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
          }
          const { data: roles, error: roleErr } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userData.user.id);
          if (roleErr) {
            return Response.json({ error: roleErr.message }, { status: 500 });
          }
          if (!roles?.some((r) => r.role === "admin")) {
            return Response.json(
              { error: "Forbidden — admins only" },
              { status: 403 }
            );
          }
          const body = await request.json();
          const {
            order_id,
            mt5_login,
            mt5_password,
            mt5_server,
            investor_password
          } = body;
          if (!order_id) {
            return Response.json({ error: "order_id required" }, { status: 400 });
          }
          if (!mt5_login || !mt5_password || !mt5_server) {
            return Response.json(
              { error: "mt5_login, mt5_password and mt5_server are required" },
              { status: 400 }
            );
          }
          const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", order_id).maybeSingle();
          if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
          const { data: existing } = await supabaseAdmin.from("trader_accounts").select("id, mt5_login").eq("order_id", order.id).maybeSingle();
          if (existing) {
            return Response.json({ ok: true, already: true, login: existing.mt5_login });
          }
          const { data: ch } = await supabaseAdmin.from("challenges").select("*").eq("id", order.challenge_id).single();
          if (!ch) return Response.json({ error: "Challenge missing" }, { status: 500 });
          const { data: profile } = await supabaseAdmin.from("profiles").select("full_name, phone").eq("id", order.user_id).single();
          const { error: insertErr } = await supabaseAdmin.from("trader_accounts").insert({
            user_id: order.user_id,
            order_id: order.id,
            challenge_id: order.challenge_id,
            mt5_login: mt5_login.trim(),
            mt5_password: mt5_password.trim(),
            investor_password: investor_password?.trim() || null,
            mt5_server: mt5_server.trim(),
            metaapi_account_id: null,
            provider: "manual",
            currency: ch.currency || "NGN",
            starting_balance: ch.account_size,
            current_equity: ch.account_size,
            current_phase: 1,
            status: "active"
          });
          if (insertErr) {
            return Response.json({ error: insertErr.message }, { status: 500 });
          }
          await supabaseAdmin.from("orders").update({ status: "delivered" }).eq("id", order.id);
          await supabaseAdmin.from("account_requests").update({
            status: "fulfilled",
            fulfilled_at: (/* @__PURE__ */ new Date()).toISOString(),
            claimed_by: "manual",
            provider_response: { login: mt5_login, server: mt5_server }
          }).eq("order_id", order.id);
          await supabaseAdmin.from("mt5_worker_events").insert({
            event_type: "manual_delivery",
            worker_id: "manual",
            payload: { order_id: order.id, login: mt5_login }
          });
          await supabaseAdmin.from("notifications").insert({
            user_id: order.user_id,
            title: "🎉 Your MT5 Account is Ready",
            message: `${ch.name} active. Login: ${mt5_login} · Server: ${mt5_server}. Open the dashboard to view your password.`,
            type: "welcome"
          });
          await sendPushToUser(order.user_id, {
            title: "🎉 Your MT5 Account is Ready",
            body: `${ch.name} active. Tap to view your login.`,
            url: "/dashboard"
          });
          await sendEventEmail({ type: "mt5_delivered", orderId: order.id, mt5Login: mt5_login, mt5Password: mt5_password, mt5Server: mt5_server }).catch(
            (e) => console.error("[deliver-account] email send failed", e)
          );
          return Response.json({ ok: true, login: mt5_login, server: mt5_server });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "fail";
          console.error("[deliver-account] unexpected", msg);
          return Response.json({ error: msg }, { status: 500 });
        }
      }
    }
  }
});
const $$splitComponentImporter$l = () => import("./support-CJb3CX1H.js");
const Route$v = createFileRoute("/_authenticated/support")({
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./stats-Cde7Dftx.js");
const Route$u = createFileRoute("/_authenticated/stats")({
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./profile-C-2tK4-W.js");
const Route$t = createFileRoute("/_authenticated/profile")({
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./partner-B_EcLy34.js");
const Route$s = createFileRoute("/_authenticated/partner")({
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./dashboard-CDoS52Yq.js");
const Route$r = createFileRoute("/_authenticated/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./community-Bx2guq6G.js");
const Route$q = createFileRoute("/_authenticated/community")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./affiliate-BzroGAE6.js");
const Route$p = createFileRoute("/_authenticated/affiliate")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./admin-CQg-4qFC.js");
const Route$o = createFileRoute("/_admin/admin")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./community.index-Br9exnVE.js");
const Route$n = createFileRoute("/_authenticated/community/")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./admin.index-CKeG_3g-.js");
const Route$m = createFileRoute("/_admin/admin/")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const Route$l = createFileRoute("/api/public/push-event")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const secret = process.env.PUSH_WEBHOOK_SECRET;
          if (!secret) {
            return Response.json({ error: "webhook not configured" }, { status: 500 });
          }
          const provided = request.headers.get("x-webhook-secret");
          if (!provided || provided !== secret) {
            return Response.json({ error: "unauthorized" }, { status: 401 });
          }
          const body = await request.json();
          if (!body.title || !body.body) {
            return Response.json({ error: "title and body required" }, { status: 400 });
          }
          if (!body.user_id && !body.admins) {
            return Response.json({ error: "user_id or admins required" }, { status: 400 });
          }
          const payload = {
            title: body.title.slice(0, 120),
            body: body.body.slice(0, 280),
            url: body.url ?? "/dashboard"
          };
          if (body.user_id) {
            await sendPushToUser(body.user_id, payload);
            await supabaseAdmin.from("notifications").insert({
              user_id: body.user_id,
              title: payload.title,
              message: payload.body,
              type: body.event ?? "info"
            });
          }
          if (body.admins) {
            await sendPushToAdmins(payload);
          }
          return Response.json({ ok: true });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "fail";
          console.error("[push-event] unexpected", msg);
          return Response.json({ error: msg }, { status: 500 });
        }
      }
    }
  }
});
async function assertAdmin$2(token) {
  const { data: userData, error: authErr } = await supabaseAdmin.auth.getUser(token);
  if (authErr || !userData?.user) return { ok: false };
  const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userData.user.id);
  if (!roles?.some((r) => r.role === "admin")) return { ok: false };
  return { ok: true, userId: userData.user.id };
}
const Route$k = createFileRoute("/api/admin/set-exchange-rate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get("authorization");
          const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : null;
          if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
          const auth = await assertAdmin$2(token);
          if (!auth.ok) return Response.json({ error: "Forbidden" }, { status: 403 });
          const body = await request.json();
          const rate = body.rate;
          if (!rate || rate <= 0) {
            return Response.json({ error: "Rate must be a positive number" }, { status: 400 });
          }
          await setUSDRate(rate);
          return Response.json({ ok: true, rate });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "fail";
          console.error("[api.admin.set-exchange-rate] POST unexpected", msg);
          return Response.json({ error: msg }, { status: 500 });
        }
      }
    }
  }
});
async function assertAdmin$1(token) {
  const { data: userData, error: authErr } = await supabaseAdmin.auth.getUser(token);
  if (authErr || !userData?.user) return { ok: false };
  const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userData.user.id);
  if (!roles?.some((r) => r.role === "admin")) return { ok: false };
  return { ok: true, userId: userData.user.id };
}
const Route$j = createFileRoute("/api/admin/pool")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get("authorization");
          const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : null;
          if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
          const auth = await assertAdmin$1(token);
          if (!auth.ok) return Response.json({ error: "Forbidden" }, { status: 403 });
          const body = await request.json();
          if (body.action === "add") {
            const { mt5_login, mt5_password, investor_password, mt5_server, account_size_ngn, account_size_usd, currency, notes } = body;
            const poolCurrency = currency || "NGN";
            if (!mt5_login || !mt5_password || !investor_password) {
              return Response.json(
                { error: "mt5_login, mt5_password, and investor_password are required" },
                { status: 400 }
              );
            }
            if (poolCurrency === "USD" && !account_size_usd) {
              return Response.json(
                { error: "account_size_usd is required for USD accounts" },
                { status: 400 }
              );
            }
            if (poolCurrency !== "USD" && !account_size_ngn) {
              return Response.json(
                { error: "account_size_ngn is required for NGN accounts" },
                { status: 400 }
              );
            }
            const { data, error } = await supabaseAdmin.from("account_pool").insert({
              mt5_login: mt5_login.trim(),
              mt5_password: mt5_password.trim(),
              investor_password: investor_password.trim(),
              mt5_server: (mt5_server ?? "Exness-MT5Trial9").trim(),
              account_size_ngn: poolCurrency === "USD" ? null : account_size_ngn ?? null,
              account_size_usd: poolCurrency === "USD" ? account_size_usd ?? null : null,
              currency: poolCurrency,
              notes: notes?.trim() ?? null
            }).select("id").single();
            if (error) return Response.json({ error: error.message }, { status: 500 });
            return Response.json({ ok: true, id: data.id });
          }
          if (body.action === "archive") {
            if (!body.id) return Response.json({ error: "id required" }, { status: 400 });
            const { data: existing } = await supabaseAdmin.from("account_pool").select("status").eq("id", body.id).maybeSingle();
            if (!existing) return Response.json({ error: "Not found" }, { status: 404 });
            if (existing.status !== "available") {
              return Response.json({ error: "Can only archive available accounts" }, { status: 400 });
            }
            const { error } = await supabaseAdmin.from("account_pool").update({ status: "archived" }).eq("id", body.id);
            if (error) return Response.json({ error: error.message }, { status: 500 });
            return Response.json({ ok: true });
          }
          if (body.action === "delete") {
            if (!body.id) return Response.json({ error: "id required" }, { status: 400 });
            const { error } = await supabaseAdmin.from("account_pool").delete().eq("id", body.id);
            if (error) return Response.json({ error: error.message }, { status: 500 });
            return Response.json({ ok: true });
          }
          return Response.json({ error: "Unknown action" }, { status: 400 });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "fail";
          console.error("[api.admin.pool] POST unexpected", msg);
          return Response.json({ error: msg }, { status: 500 });
        }
      },
      GET: async ({ request }) => {
        try {
          const authHeader = request.headers.get("authorization");
          const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : null;
          if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
          const auth = await assertAdmin$1(token);
          if (!auth.ok) return Response.json({ error: "Forbidden" }, { status: 403 });
          const url = new URL(request.url);
          const variant = url.searchParams.get("variant");
          if (variant === "stats") {
            const { data: available, error: availErr } = await supabaseAdmin.from("account_pool").select("account_size_ngn, account_size_usd, currency").eq("status", "available");
            if (availErr) return Response.json({ error: availErr.message }, { status: 500 });
            const inventory = {};
            for (const row of available ?? []) {
              const key = row.currency === "USD" ? `usd_${row.account_size_usd}` : `ngn_${row.account_size_ngn}`;
              inventory[key] = (inventory[key] ?? 0) + 1;
            }
            const { data: allRows, error: allErr } = await supabaseAdmin.from("account_pool").select("*").order("created_at", { ascending: false });
            if (allErr) return Response.json({ error: allErr.message }, { status: 500 });
            return Response.json({ ok: true, inventory, rows: allRows ?? [] });
          }
          const { data: rows, error } = await supabaseAdmin.from("account_pool").select("*").order("created_at", { ascending: false });
          if (error) return Response.json({ error: error.message }, { status: 500 });
          return Response.json({ ok: true, rows: rows ?? [] });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "fail";
          console.error("[api.admin.pool] GET unexpected", msg);
          return Response.json({ error: msg }, { status: 500 });
        }
      }
    }
  }
});
async function assertAdmin(token) {
  const { data: userData, error: authErr } = await supabaseAdmin.auth.getUser(token);
  if (authErr || !userData?.user) return { ok: false };
  const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userData.user.id);
  if (!roles?.some((r) => r.role === "admin")) return { ok: false };
  return { ok: true, userId: userData.user.id };
}
const Route$i = createFileRoute("/api/admin/delete-request")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get("authorization");
          const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : null;
          if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
          const auth = await assertAdmin(token);
          if (!auth.ok) return Response.json({ error: "Forbidden" }, { status: 403 });
          const body = await request.json();
          const requestId = body.request_id?.trim();
          if (!requestId) {
            return Response.json({ error: "request_id is required" }, { status: 400 });
          }
          const { data: req } = await supabaseAdmin.from("account_requests").select("id, order_id, status").eq("id", requestId).maybeSingle();
          if (!req) return Response.json({ error: "Request not found" }, { status: 404 });
          if (!["pending", "failed"].includes(req.status)) {
            return Response.json({ error: "Can only delete pending or failed requests" }, { status: 400 });
          }
          const { error: delErr } = await supabaseAdmin.from("account_requests").delete().eq("id", requestId);
          if (delErr) return Response.json({ error: delErr.message }, { status: 500 });
          if (req.order_id) {
            await supabaseAdmin.from("orders").update({ status: "cancelled" }).eq("id", req.order_id);
          }
          return Response.json({ ok: true });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "fail";
          console.error("[api.admin.delete-request] POST unexpected", msg);
          return Response.json({ error: msg }, { status: 500 });
        }
      }
    }
  }
});
const $$splitComponentImporter$b = () => import("./community._slug-Dq-17XOu.js");
const Route$h = createFileRoute("/_authenticated/community/$slug")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./admin.tickets-3tY9punh.js");
const Route$g = createFileRoute("/_admin/admin/tickets")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./admin.social-yTRtGhuf.js");
const Route$f = createFileRoute("/_admin/admin/social")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./admin.settings-B7K7ogCK.js");
const Route$e = createFileRoute("/_admin/admin/settings")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./admin.pool-CnWO-85x.js");
const Route$d = createFileRoute("/_admin/admin/pool")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./admin.pending-Ba8wWtMO.js");
const Route$c = createFileRoute("/_admin/admin/pending")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./admin.payouts-DWRsaPUo.js");
const Route$b = createFileRoute("/_admin/admin/payouts")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./admin.partners-DX2B6NTD.js");
const Route$a = createFileRoute("/_admin/admin/partners")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./admin.discounts-Dh7iMGcw.js");
const Route$9 = createFileRoute("/_admin/admin/discounts")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin.challenges-CVbzJBhg.js");
const Route$8 = createFileRoute("/_admin/admin/challenges")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./admin.affiliate-YvpCndIb.js");
const Route$7 = createFileRoute("/_admin/admin/affiliate")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./admin.accounts-BGyFBaXP.js");
const Route$6 = createFileRoute("/_admin/admin/accounts")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const Route$5 = createFileRoute("/api/public/cron/sync-equity-v2")({
  server: {
    handlers: {
      POST: async ({ request }) => syncEquityV2(request),
      GET: async ({ request }) => syncEquityV2(request)
    }
  }
});
async function refreshTradingDays(accountId) {
  try {
    const { data: acct } = await supabaseAdmin.from("trader_accounts").select("current_phase, phase1_passed_at, created_at, starting_balance, currency").eq("id", accountId).single();
    if (!acct) return;
    const phaseStart = acct.current_phase >= 2 && acct.phase1_passed_at ? acct.phase1_passed_at : acct.created_at;
    const isUSD = acct.currency === "USD";
    const startingBalance = Number(acct.starting_balance ?? 0);
    const threshold = startingBalance * 5e-3;
    const { data: closeData } = await supabaseAdmin.from("closed_trades").select("close_time, profit").eq("account_id", accountId).gte("close_time", phaseStart).order("close_time", { ascending: true });
    if (!closeData || closeData.length === 0) {
      const { error: updateErr2 } = await supabaseAdmin.from("trader_accounts").update({ trading_days: 0 }).eq("id", accountId);
      if (updateErr2) console.error(`[sync-equity-v2] refreshTradingDays update failed:`, updateErr2);
      return;
    }
    const dayMap = /* @__PURE__ */ new Map();
    for (const t of closeData) {
      const date = t.close_time.slice(0, 10);
      dayMap.set(date, (dayMap.get(date) ?? 0) + Number(t.profit));
    }
    let profitableDays = 0;
    if (isUSD) {
      for (const dayProfit of dayMap.values()) {
        if (dayProfit >= threshold) profitableDays++;
      }
    } else {
      profitableDays = dayMap.size;
    }
    const { error: updateErr } = await supabaseAdmin.from("trader_accounts").update({ trading_days: profitableDays }).eq("id", accountId);
    if (updateErr) {
      console.error(`[sync-equity-v2] refreshTradingDays update failed:`, updateErr);
    }
  } catch (e) {
    console.error(`[sync-equity-v2] refreshTradingDays error:`, e);
  }
}
async function syncEquityV2(request) {
  const secret = request.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { account_id, mt5_login, equity, balance, profit, scalping_violations, news_violations, weekend_violations, closed_deals, fetcher_only, open_positions } = body;
  if (fetcher_only === true) {
    if (closed_deals?.length) {
      const { error: upsertErr } = await supabaseAdmin.from("closed_trades").upsert(
        closed_deals.map((d) => ({
          account_id,
          ticket: d.ticket,
          symbol: d.symbol,
          open_time: new Date(d.open_time * 1e3).toISOString(),
          close_time: new Date(d.close_time * 1e3).toISOString(),
          duration_seconds: d.duration_seconds,
          profit: d.profit,
          volume: d.volume,
          trade_type: d.type ?? null
        })),
        { onConflict: "account_id,ticket", ignoreDuplicates: true }
      );
      if (upsertErr) {
        console.error(`[sync-equity-v2] closed_trades upsert failed for ${account_id}:`, upsertErr);
      }
    }
    if (open_positions !== void 0) {
      await supabaseAdmin.from("open_positions").delete().eq("account_id", account_id);
      if (open_positions.length > 0) {
        await supabaseAdmin.from("open_positions").insert(
          open_positions.map((p) => ({
            account_id,
            ticket: p.ticket,
            symbol: p.symbol,
            open_time: new Date(p.open_time * 1e3).toISOString(),
            volume: p.volume,
            profit: p.profit,
            price_open: p.price_open,
            type: p.type
          }))
        );
      }
    }
    await refreshTradingDays(account_id);
    if (scalping_violations?.length > 0) {
      const scalingUrl = new URL(request.url);
      scalingUrl.pathname = "/api/public/cron/handle-scalping";
      await fetch(scalingUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cron-secret": process.env.CRON_SECRET ?? ""
        },
        body: JSON.stringify({
          account_id,
          mt5_login,
          violations: scalping_violations
        })
      });
    }
    const { count: shortCount2 } = await supabaseAdmin.from("closed_trades").select("id", { count: "exact", head: true }).eq("account_id", account_id).lt("duration_seconds", 180);
    if (shortCount2 !== null && shortCount2 >= 4) {
      const { data: acct } = await supabaseAdmin.from("trader_accounts").select("id, user_id, status").eq("id", account_id).single();
      if (acct && acct.status !== "breached") {
        const breachReason = `Scalping violation: account breached after ${shortCount2} short-held trades (held under 180s). All trades must be held a minimum of 3 minutes regardless of close type.`;
        await supabaseAdmin.from("trader_accounts").update({
          status: "breached",
          breach_reason: breachReason,
          scalping_warnings: 0
        }).eq("id", account_id);
        await supabaseAdmin.from("notifications").insert({
          user_id: acct.user_id,
          title: "⚠️ Account Breached — Scalping Violation",
          message: `Your account was breached after ${shortCount2} trades were held for less than 3 minutes. All trades must be held a minimum of 3 minutes.`,
          type: "breach"
        });
        try {
          const { data: allShortHeld } = await supabaseAdmin.from("closed_trades").select("ticket, symbol, duration_seconds, close_time, profit").eq("account_id", account_id).lt("duration_seconds", 180).order("close_time", { ascending: true });
          await sendEventEmail({
            type: "breached",
            accountId: account_id,
            reason: breachReason,
            shortHeldTrades: allShortHeld ?? []
          });
        } catch (emailErr) {
          console.error("[sync-equity-v2] Breach email failed:", emailErr);
        }
        try {
          await supabaseAdmin.rpc("send_telegram", {
            p_message: `🚫 <b>Scalping Breach — Safety Net</b>
Account: ${mt5_login ?? account_id}
Short-held trades: ${shortCount2}
👉 <a href="https://app.fundedng.com/admin">Open Admin Panel</a>`
          });
        } catch (e) {
          console.error("[sync-equity-v2] Telegram send failed:", e);
        }
      }
    }
    return Response.json({ ok: true, fetcher_only: true });
  }
  if (!account_id || !mt5_login || equity === void 0 || balance === void 0 || profit === void 0) {
    return Response.json(
      { error: "Missing required fields: account_id, mt5_login, equity, balance, profit" },
      { status: 400 }
    );
  }
  const { data: account, error: acctErr } = await supabaseAdmin.from("trader_accounts").select("id, status, starting_balance, peak_equity, last_synced_at, trading_days").eq("id", account_id).in("status", ["active", "funded"]).single();
  if (acctErr || !account) {
    return Response.json(
      { error: "Account not found or status not active/funded" },
      { status: 404 }
    );
  }
  const startingBalance = Number(account.starting_balance);
  const prevPeak = Number(account.peak_equity ?? startingBalance);
  const justReset = Math.abs(prevPeak - startingBalance) < 1;
  const balanceIsReset = Math.abs(balance - startingBalance) < startingBalance * 0.02;
  let newPeak;
  if (justReset && !balanceIsReset) {
    newPeak = startingBalance;
  } else {
    newPeak = Math.max(startingBalance, prevPeak, equity);
  }
  const drawdownPercent = equity < newPeak ? Number(((newPeak - equity) / newPeak * 100).toFixed(2)) : 0;
  const { error: snapErr } = await supabaseAdmin.from("account_snapshots").insert({
    trader_account_id: account_id,
    equity,
    balance,
    profit,
    drawdown_percent: drawdownPercent
  });
  if (snapErr) {
    return Response.json({ error: snapErr.message }, { status: 500 });
  }
  const { data: updatedAccount, error: updateErr } = await supabaseAdmin.from("trader_accounts").update({
    last_synced_at: (/* @__PURE__ */ new Date()).toISOString(),
    current_equity: equity,
    peak_equity: newPeak
  }).eq("id", account_id).select("status, breach_reason").single();
  if (updateErr) {
    return Response.json({ error: updateErr.message }, { status: 500 });
  }
  if (updatedAccount.status === "breached") {
    try {
      await sendEventEmail({
        type: "breached",
        accountId: account_id,
        reason: updatedAccount.breach_reason ?? "Maximum drawdown exceeded"
      });
    } catch (emailErr) {
      console.error("[sync-equity-v2] Breach email failed:", emailErr);
    }
    try {
      await supabaseAdmin.rpc("send_telegram", {
        p_message: `🚫 <b>Drawdown Breach</b>
Account: ${mt5_login ?? account_id}
Reason: ${updatedAccount.breach_reason ?? "Maximum drawdown exceeded"}
👉 <a href="https://app.fundedng.com/admin">Open Admin Panel</a>`
      });
    } catch (e) {
      console.error("[sync-equity-v2] Telegram send failed:", e);
    }
  }
  if (news_violations?.length > 0) {
    const newsUrl = new URL(request.url);
    newsUrl.pathname = "/api/public/cron/handle-news-violation";
    try {
      const resp = await fetch(newsUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cron-secret": process.env.CRON_SECRET ?? ""
        },
        body: JSON.stringify({
          account_id,
          mt5_login,
          violations: news_violations
        })
      });
      if (!resp.ok) {
        const body2 = await resp.text().catch(() => "");
        console.error(`[sync-equity-v2] news handler returned ${resp.status}: ${body2}`);
      }
    } catch (e) {
      console.error("[sync-equity-v2] news forward failed:", e);
    }
  }
  await refreshTradingDays(account_id);
  if (weekend_violations?.length > 0) {
    const weekendUrl = new URL(request.url);
    weekendUrl.pathname = "/api/public/cron/handle-weekend-violation";
    try {
      const resp = await fetch(weekendUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cron-secret": process.env.CRON_SECRET ?? ""
        },
        body: JSON.stringify({
          account_id,
          mt5_login,
          violations: weekend_violations
        })
      });
      if (!resp.ok) {
        const body2 = await resp.text().catch(() => "");
        console.error(`[sync-equity-v2] weekend handler returned ${resp.status}: ${body2}`);
      }
    } catch (e) {
      console.error("[sync-equity-v2] weekend forward failed:", e);
    }
  }
  if (closed_deals?.length) {
    const { error: upsertErr } = await supabaseAdmin.from("closed_trades").upsert(
      closed_deals.map((d) => ({
        account_id,
        ticket: d.ticket,
        symbol: d.symbol,
        open_time: new Date(d.open_time * 1e3).toISOString(),
        close_time: new Date(d.close_time * 1e3).toISOString(),
        duration_seconds: d.duration_seconds,
        profit: d.profit,
        volume: d.volume,
        trade_type: d.type ?? null
      })),
      { onConflict: "account_id,ticket", ignoreDuplicates: true }
    );
    if (upsertErr) {
      console.error(`[sync-equity-v2] closed_trades upsert failed for ${account_id}:`, upsertErr);
    }
  }
  if (scalping_violations?.length > 0) {
    const scalingUrl = new URL(request.url);
    scalingUrl.pathname = "/api/public/cron/handle-scalping";
    try {
      const resp = await fetch(scalingUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cron-secret": process.env.CRON_SECRET ?? ""
        },
        body: JSON.stringify({
          account_id,
          mt5_login,
          violations: scalping_violations
        })
      });
      if (!resp.ok) {
        const body2 = await resp.text().catch(() => "");
        console.error(`[sync-equity-v2] scalping handler returned ${resp.status}: ${body2}`);
      }
    } catch (e) {
      console.error("[sync-equity-v2] scalping forward failed:", e);
    }
  }
  const { count: shortCount } = await supabaseAdmin.from("closed_trades").select("id", { count: "exact", head: true }).eq("account_id", account_id).lt("duration_seconds", 180);
  if (shortCount !== null && shortCount >= 4) {
    const { data: acct } = await supabaseAdmin.from("trader_accounts").select("id, user_id, status").eq("id", account_id).single();
    if (acct && acct.status !== "breached") {
      const breachReason = `Scalping violation: account breached after ${shortCount} short-held trades (held under 180s). All trades must be held a minimum of 3 minutes regardless of close type.`;
      await supabaseAdmin.from("trader_accounts").update({
        status: "breached",
        breach_reason: breachReason,
        scalping_warnings: 0
      }).eq("id", account_id);
      await supabaseAdmin.from("notifications").insert({
        user_id: acct.user_id,
        title: "⚠️ Account Breached — Scalping Violation",
        message: `Your account was breached after ${shortCount} trades were held for less than 3 minutes. All trades must be held a minimum of 3 minutes.`,
        type: "breach"
      });
      try {
        const { data: allShortHeld } = await supabaseAdmin.from("closed_trades").select("ticket, symbol, duration_seconds, close_time, profit").eq("account_id", account_id).lt("duration_seconds", 180).order("close_time", { ascending: true });
        await sendEventEmail({
          type: "breached",
          accountId: account_id,
          reason: breachReason,
          shortHeldTrades: allShortHeld ?? []
        });
      } catch (emailErr) {
        console.error("[sync-equity-v2] Breach email failed:", emailErr);
      }
      try {
        await supabaseAdmin.rpc("send_telegram", {
          p_message: `🚫 <b>Scalping Breach — Safety Net</b>
Account: ${mt5_login ?? account_id}
Short-held trades: ${shortCount}
👉 <a href="https://app.fundedng.com/admin">Open Admin Panel</a>`
        });
      } catch (e) {
        console.error("[sync-equity-v2] Telegram send failed:", e);
      }
    }
  }
  return Response.json({
    ok: true,
    account_id,
    drawdown_percent: drawdownPercent,
    status: updatedAccount.status
  });
}
const Route$4 = createFileRoute("/api/public/cron/sync-equity")({
  server: {
    handlers: {
      POST: async () => syncEquity(),
      GET: async () => syncEquity()
    }
  }
});
async function syncEquity() {
  const startedAt = Date.now();
  const { data: accounts, error } = await supabaseAdmin.from("trader_accounts").select("id, mt5_login, provider, starting_balance, peak_equity, status, last_synced_at, trading_days").in("status", ["active", "funded"]).eq("provider", "exness-bot");
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  const list = accounts ?? [];
  let synced = 0;
  let failed = 0;
  const errors = [];
  for (const acct of list) {
    if (!acct.mt5_login) continue;
    try {
      const info = await botEquity(acct.mt5_login);
      if (!info) {
        failed++;
        continue;
      }
      const profit = info.equity - acct.starting_balance;
      const peak = Math.max(
        acct.starting_balance,
        Number(acct.peak_equity ?? acct.starting_balance),
        info.equity
      );
      const drawdown = info.equity < peak ? (peak - info.equity) / peak * 100 : 0;
      const { error: snapErr } = await supabaseAdmin.from("account_snapshots").insert({
        trader_account_id: acct.id,
        equity: info.equity,
        balance: info.balance,
        profit,
        drawdown_percent: Number(drawdown.toFixed(2))
      });
      if (snapErr) {
        failed++;
        errors.push({ id: acct.id, error: snapErr.message });
        continue;
      }
      const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      const lastSyncDay = acct.last_synced_at ? acct.last_synced_at.slice(0, 10) : null;
      const isNewDay = lastSyncDay !== today;
      await supabaseAdmin.from("trader_accounts").update({
        last_synced_at: (/* @__PURE__ */ new Date()).toISOString(),
        trading_days: isNewDay ? (acct.trading_days ?? 0) + 1 : acct.trading_days ?? 0
      }).eq("id", acct.id);
      synced++;
    } catch (e) {
      failed++;
      errors.push({ id: acct.id, error: e instanceof Error ? e.message : "unknown" });
    }
  }
  await supabaseAdmin.from("mt5_worker_events").insert({
    event_type: "equity_sync_run",
    worker_id: "cron",
    payload: { synced, failed, total: list.length, ms: Date.now() - startedAt, errors: errors.slice(0, 5) }
  });
  return Response.json({ ok: true, synced, failed, total: list.length });
}
const Route$3 = createFileRoute("/api/public/cron/reconcile-payments")({
  server: {
    handlers: {
      POST: async ({ request }) => reconcilePayments(request)
    }
  }
});
async function attemptDelivery(orderId, userId, challengeId) {
  const { data: challenge } = await supabaseAdmin.from("challenges").select("id, name, account_size").eq("id", challengeId).maybeSingle();
  if (!challenge) return;
  const poolResult = await claimPoolAccount({
    orderId,
    accountSizeNgn: challenge.account_size,
    challengeId: challenge.id,
    userId
  }).catch(() => null);
  const { data: prof } = await supabaseAdmin.from("profiles").select("full_name").eq("id", userId).maybeSingle();
  const traderName = prof?.full_name ?? "A trader";
  if (poolResult?.ok) {
    await sendEventEmail({
      type: "mt5_delivered",
      orderId,
      mt5Login: poolResult.mt5Login,
      mt5Password: poolResult.mt5Password,
      mt5Server: poolResult.mt5Server
    }).catch(() => {
    });
    await supabaseAdmin.rpc("send_telegram", {
      p_message: `✅ <b>Reconciliation Delivery</b>
Trader: ${traderName}
Challenge: ${challenge.name}
Login: ${poolResult.mt5Login}
Server: ${poolResult.mt5Server}`
    }).catch(() => {
    });
  } else {
    await supabaseAdmin.rpc("send_telegram", {
      p_message: `⏳ <b>Reconciliation — Manual Delivery Needed</b>
Trader: ${traderName}
Challenge: ${challenge.name}
Order: ${orderId}
Reason: ${poolResult?.error ?? "Pool unavailable"}`
    }).catch(() => {
    });
  }
}
async function pollSquadTransactions(squadSecret) {
  const now = /* @__PURE__ */ new Date();
  const from = new Date(now.getTime() - 60 * 60 * 1e3);
  const queryUrl = new URL("https://api-d.squadco.com/transaction/query");
  queryUrl.searchParams.set("page", "1");
  queryUrl.searchParams.set("perPage", "50");
  queryUrl.searchParams.set("from", from.toISOString());
  queryUrl.searchParams.set("to", now.toISOString());
  const res = await fetch(queryUrl.toString(), {
    headers: { Authorization: `Bearer ${squadSecret}` }
  });
  if (!res.ok) {
    console.error("[reconcile-payments] Squad query failed:", res.status);
    return [];
  }
  const json = await res.json().catch(() => ({}));
  const transactions = Array.isArray(json?.data) ? json.data : Array.isArray(json?.records) ? json.records : [];
  const created = [];
  for (const tx of transactions) {
    const reference = tx.transaction_ref;
    const txStatus = (tx.transaction_status ?? "").toLowerCase();
    if (!reference || txStatus !== "success") continue;
    const { data: existing } = await supabaseAdmin.from("orders").select("id").eq("paystack_reference", reference).maybeSingle();
    if (existing) continue;
    let userId = tx.meta?.user_id ?? tx.metadata?.user_id;
    let challengeId = tx.meta?.challenge_id ?? tx.metadata?.challenge_id;
    if (!userId || !challengeId) {
      const verifyRes = await fetch(
        `https://api-d.squadco.com/transaction/verify/${encodeURIComponent(reference)}`,
        { headers: { Authorization: `Bearer ${squadSecret}` } }
      );
      const verifyJson = await verifyRes.json().catch(() => ({}));
      const vData = verifyJson?.data;
      if (vData?.meta) {
        userId = userId || vData.meta.user_id;
        challengeId = challengeId || vData.meta.challenge_id;
      }
      if (!userId) userId = vData?.meta?.user_id ?? tx.meta?.user_id ?? tx.metadata?.user_id;
      if (!challengeId) challengeId = vData?.meta?.challenge_id ?? tx.meta?.challenge_id ?? tx.metadata?.challenge_id;
    }
    if (!userId || !challengeId) {
      console.warn(`[reconcile-payments] Cannot resolve user/challenge for ${reference} — notifying admin`);
      await supabaseAdmin.rpc("send_telegram", {
        p_message: `⚠️ <b>Unresolved Squad Payment</b>
Ref: ${reference}
Amount: ${(tx.transaction_amount ?? 0) / 100} NGN
Email: ${tx.email ?? "N/A"}
No metadata — manual check needed.`
      }).catch(() => {
      });
      continue;
    }
    const { data: challenge } = await supabaseAdmin.from("challenges").select("id, name, account_size, price_naira").eq("id", challengeId).maybeSingle();
    if (!challenge) {
      console.warn(`[reconcile-payments] Challenge ${challengeId} not found for ${reference}`);
      continue;
    }
    const amountPaid = Number(tx.transaction_amount ?? 0);
    const originalKobo = Number(challenge.price_naira) * 100;
    const { data: order, error: orderErr } = await supabaseAdmin.from("orders").insert({
      user_id: userId,
      challenge_id: challengeId,
      original_amount: originalKobo,
      discount_amount: Math.max(0, originalKobo - amountPaid),
      amount_paid: amountPaid,
      status: "paid",
      paystack_reference: reference
    }).select("id").single();
    if (orderErr || !order) {
      console.error(`[reconcile-payments] Order creation failed for ${reference}:`, orderErr?.message);
      continue;
    }
    await supabaseAdmin.rpc("send_telegram", {
      p_message: `🔄 <b>Squad Reconciled — Missing Order Created</b>
Ref: ${reference}
Amount: ${(amountPaid / 100).toLocaleString("en-NG")} NGN
Challenge: ${challenge.name}`
    }).catch(() => {
    });
    await attemptDelivery(order.id, userId, challengeId);
    created.push({ reference, orderId: order.id });
  }
  return created;
}
async function reconcilePayments(request) {
  const secret = request.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  let reconciled = 0;
  const squadSecret = process.env.SQUAD_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY;
  if (squadSecret) {
    try {
      const created = await pollSquadTransactions(squadSecret);
      reconciled = created.length;
    } catch (e) {
      console.error("[reconcile-payments] Squad poll failed:", e);
    }
  } else {
    console.warn("[reconcile-payments] No SQUAD_SECRET_KEY configured — skipping Squad poll");
  }
  const { data: paidOrders, error: queryErr } = await supabaseAdmin.from("orders").select("id, user_id, challenge_id, created_at").eq("status", "paid").order("created_at", { ascending: true });
  if (queryErr) {
    console.error("[reconcile-payments] Query failed:", queryErr);
    return Response.json({ error: queryErr.message }, { status: 500 });
  }
  if (!paidOrders || paidOrders.length === 0) {
    return Response.json({ ok: true, reconciled, processed: 0 });
  }
  const orderIds = paidOrders.map((o) => o.id);
  const { data: deliveredAccounts } = await supabaseAdmin.from("trader_accounts").select("order_id").in("order_id", orderIds);
  const deliveredOrderIds = new Set(
    (deliveredAccounts ?? []).map((a) => a.order_id)
  );
  const undelivered = paidOrders.filter((o) => !deliveredOrderIds.has(o.id));
  if (undelivered.length === 0) {
    return Response.json({ ok: true, reconciled, total: paidOrders.length, undelivered: 0 });
  }
  let attempts = 0;
  let errors = 0;
  for (const order of undelivered) {
    try {
      await attemptDelivery(order.id, order.user_id, order.challenge_id);
      attempts++;
    } catch (e) {
      console.error("[reconcile-payments] Delivery failed for order", order.id, e);
      errors++;
    }
  }
  return Response.json({
    ok: true,
    reconciled,
    total: paidOrders.length,
    undelivered: undelivered.length,
    delivered: attempts,
    errors
  });
}
const Route$2 = createFileRoute("/api/public/cron/handle-weekend-violation")({
  server: {
    handlers: {
      POST: async ({ request }) => handleWeekendViolation(request)
    }
  }
});
async function handleWeekendViolation(request) {
  const secret = request.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { account_id, mt5_login, violations } = body;
  if (!account_id || !violations || violations.length === 0) {
    return Response.json({ ok: true, action: "none" });
  }
  const { data: existing } = await supabaseAdmin.from("processed_violations").select("ticket").eq("account_id", account_id).eq("violation_type", "weekend").in("ticket", violations.map((v2) => v2.ticket));
  const existingTickets = new Set((existing ?? []).map((r) => r.ticket));
  const newViolations = violations.filter((v2) => !existingTickets.has(v2.ticket));
  if (newViolations.length === 0) {
    return Response.json({ ok: true, action: "none" });
  }
  const { data: account } = await supabaseAdmin.from("trader_accounts").select("id, user_id, status, breach_reason").eq("id", account_id).single();
  if (!account) {
    return Response.json({ error: "Account not found" }, { status: 404 });
  }
  if (account.status === "breached") {
    return Response.json({ ok: true, action: "already_breached" });
  }
  const v = newViolations[0];
  const breachReason = `Weekend holding violation: position on ${v.symbol} (ticket #${v.ticket}) was held open into the weekend market close. Positions must be closed before weekend close to avoid gap risk. Crypto pairs are exempt from this rule.`;
  const insertRows = newViolations.map((nv) => ({
    account_id,
    ticket: nv.ticket,
    violation_type: "weekend"
  }));
  const { error: insertErr } = await supabaseAdmin.from("processed_violations").insert(insertRows).select();
  if (insertErr) {
    return Response.json({ error: insertErr.message }, { status: 500 });
  }
  const { error: updateErr } = await supabaseAdmin.from("trader_accounts").update({
    status: "breached",
    breach_reason: breachReason
  }).eq("id", account_id);
  if (updateErr) {
    return Response.json({ error: updateErr.message }, { status: 500 });
  }
  await supabaseAdmin.from("notifications").insert({
    user_id: account.user_id,
    title: "⚠️ Account Breached — Weekend Holding Violation",
    message: `Position ${v.symbol} (ticket #${v.ticket}) was held open into the weekend market close. Positions must be closed before weekend close to avoid gap risk. Crypto pairs are exempt from this rule.`,
    type: "breach"
  });
  try {
    await sendEventEmail({
      type: "breached",
      accountId: account_id,
      reason: breachReason
    });
  } catch (emailErr) {
    console.error("[handle-weekend-violation] Breach email failed:", emailErr);
  }
  return Response.json({
    ok: true,
    action: "breached",
    violations_count: newViolations.length
  });
}
const Route$1 = createFileRoute("/api/public/cron/handle-scalping")({
  server: {
    handlers: {
      POST: async ({ request }) => handleScalping(request)
    }
  }
});
function hasOverlappingTrades(violations) {
  for (let i = 0; i < violations.length; i++) {
    for (let j = i + 1; j < violations.length; j++) {
      const a = violations[i];
      const b = violations[j];
      if (a.open_time < b.close_time && b.open_time < a.close_time) {
        return true;
      }
    }
  }
  return false;
}
async function handleScalping(request) {
  const secret = request.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { account_id, mt5_login, violations } = body;
  if (!account_id || !violations || violations.length === 0) {
    return Response.json({ ok: true, action: "none" });
  }
  const { data: existing } = await supabaseAdmin.from("processed_violations").select("ticket").eq("account_id", account_id).eq("violation_type", "scalping").in("ticket", violations.map((v2) => v2.ticket));
  const existingTickets = new Set((existing ?? []).map((r) => r.ticket));
  const newViolations = violations.filter((v2) => !existingTickets.has(v2.ticket));
  if (newViolations.length === 0) {
    return Response.json({ ok: true, action: "none" });
  }
  const { data: account } = await supabaseAdmin.from("trader_accounts").select("id, user_id, status, breach_reason").eq("id", account_id).single();
  if (!account) {
    return Response.json({ error: "Account not found" }, { status: 404 });
  }
  if (account.status === "breached") {
    return Response.json({ ok: true, action: "already_breached" });
  }
  const insertRows = newViolations.map((v2) => ({
    account_id,
    ticket: v2.ticket,
    violation_type: "scalping"
  }));
  const { error: insertErr } = await supabaseAdmin.from("processed_violations").insert(insertRows).select();
  if (insertErr) {
    return Response.json({ error: insertErr.message }, { status: 500 });
  }
  const shortHeldRows = newViolations.map((v2) => ({
    account_id,
    ticket: v2.ticket,
    symbol: v2.symbol,
    opened_at: new Date(v2.open_time * 1e3).toISOString(),
    closed_at: new Date(v2.close_time * 1e3).toISOString(),
    duration_seconds: v2.duration_seconds
  }));
  const { error: shortErr } = await supabaseAdmin.from("short_held_trades").insert(shortHeldRows);
  if (shortErr) {
    console.error("[handle-scalping] short_held_trades insert failed:", shortErr);
  }
  if (hasOverlappingTrades(newViolations)) {
    const v2 = newViolations[0];
    const breachReason = `Scalping violation: two short-held trades overlapped in time (e.g., ${v2.symbol} ticket #${v2.ticket}). All trades must be held a minimum of 3 minutes (180s) regardless of close type.`;
    await supabaseAdmin.from("trader_accounts").update({
      status: "breached",
      breach_reason: breachReason,
      scalping_warnings: 0
    }).eq("id", account_id);
    await supabaseAdmin.from("notifications").insert({
      user_id: account.user_id,
      title: "⚠️ Account Breached — Scalping Violation",
      message: `Two trades were held for less than 3 minutes at the same time. All trades must be held a minimum of 3 minutes.`,
      type: "breach"
    });
    try {
      await sendEventEmail({
        type: "breached",
        accountId: account_id,
        reason: breachReason
      });
    } catch (emailErr) {
      console.error("[handle-scalping] Breach email failed:", emailErr);
    }
    try {
      await supabaseAdmin.rpc("send_telegram", {
        p_message: `🚫 <b>Scalping Breach — Overlapping Trades</b>
Account: ${mt5_login ?? account_id}
Reason: Two short-held trades overlapped
👉 <a href="https://app.fundedng.com/admin">Open Admin Panel</a>`
      });
    } catch (e) {
      console.error("[handle-scalping] Telegram send failed:", e);
    }
    return Response.json({ ok: true, action: "breached", reason: "overlapping_short_trades" });
  }
  const { data: newTotal, error: rpcErr } = await supabaseAdmin.rpc(
    "increment_scalping_warnings",
    {
      p_account_id: account_id,
      p_increment: newViolations.length
    }
  );
  if (rpcErr) {
    return Response.json({ error: rpcErr.message }, { status: 500 });
  }
  if (newTotal === -1) {
    return Response.json({ ok: true, action: "already_breached" });
  }
  if (newTotal >= 4) {
    const v2 = newViolations[0];
    const breachReason = `Scalping violation: ${v2.symbol} trade closed in ${v2.duration_seconds}s. All trades must be held a minimum of 3 minutes (180s) regardless of close type. Trade #${v2.ticket}. Account breached on the 4th short-held trade.`;
    await supabaseAdmin.from("trader_accounts").update({
      status: "breached",
      breach_reason: breachReason,
      scalping_warnings: 0
    }).eq("id", account_id);
    await supabaseAdmin.from("notifications").insert({
      user_id: account.user_id,
      title: "⚠️ Account Breached — Scalping Violation",
      message: `A trade on ${v2.symbol} was closed in ${v2.duration_seconds} seconds. This was the 4th short-held trade — the account has been breached.`,
      type: "breach"
    });
    try {
      const { data: allShortHeld } = await supabaseAdmin.from("closed_trades").select("ticket, symbol, duration_seconds, close_time, profit").eq("account_id", account_id).lt("duration_seconds", 180).order("close_time", { ascending: true });
      await sendEventEmail({
        type: "breached",
        accountId: account_id,
        reason: breachReason,
        shortHeldTrades: allShortHeld ?? []
      });
    } catch (emailErr) {
      console.error("[handle-scalping] Breach email failed:", emailErr);
    }
    try {
      await supabaseAdmin.rpc("send_telegram", {
        p_message: `🚫 <b>Scalping Breach — 4th Short Trade</b>
Account: ${mt5_login ?? account_id}
Trades: ${newViolations.length} new violation(s), ${newTotal} total
👉 <a href="https://app.fundedng.com/admin">Open Admin Panel</a>`
      });
    } catch (e) {
      console.error("[handle-scalping] Telegram send failed:", e);
    }
    return Response.json({
      ok: true,
      action: "breached",
      violations_count: newViolations.length,
      total_warnings: newTotal
    });
  }
  const v = newViolations[0];
  const warningNum = newTotal;
  await supabaseAdmin.from("notifications").insert({
    user_id: account.user_id,
    title: `⚠️ Scalping Warning ${warningNum}/3`,
    message: `A trade on ${v.symbol} was closed in ${v.duration_seconds} seconds. Warning ${warningNum} of 3 — ${3 - warningNum} more short-held trades and the account will be breached. All trades must be held a minimum of 3 minutes.`,
    type: "warning"
  });
  return Response.json({
    ok: true,
    action: "warning",
    warnings_count: newTotal,
    violations_count: newViolations.length
  });
}
const Route2 = createFileRoute("/api/public/cron/handle-news-violation")({
  server: {
    handlers: {
      POST: async ({ request }) => handleNewsViolation(request)
    }
  }
});
async function handleNewsViolation(request) {
  const secret = request.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { account_id, mt5_login, violations } = body;
  if (!account_id || !violations || violations.length === 0) {
    return Response.json({ ok: true, action: "none" });
  }
  const { data: existing } = await supabaseAdmin.from("processed_violations").select("ticket").eq("account_id", account_id).eq("violation_type", "news").in("ticket", violations.map((v2) => v2.ticket));
  const existingTickets = new Set((existing ?? []).map((r) => r.ticket));
  const newViolations = violations.filter((v2) => !existingTickets.has(v2.ticket));
  if (newViolations.length === 0) {
    return Response.json({ ok: true, action: "none" });
  }
  const { data: account } = await supabaseAdmin.from("trader_accounts").select("id, user_id, status, breach_reason").eq("id", account_id).single();
  if (!account) {
    return Response.json({ error: "Account not found" }, { status: 404 });
  }
  if (account.status === "breached") {
    return Response.json({ ok: true, action: "already_breached" });
  }
  const insertRows = newViolations.map((v2) => ({
    account_id,
    ticket: v2.ticket,
    violation_type: "news"
  }));
  const { error: insertErr } = await supabaseAdmin.from("processed_violations").insert(insertRows).select();
  if (insertErr) {
    return Response.json({ error: insertErr.message }, { status: 500 });
  }
  const v = newViolations[0];
  const breachReason = `News trading violation: trade opened on ${v.symbol} near high-impact news event "${v.event_title}". No trades may be opened 5 minutes before or 5 minutes after a high-impact news event. Trade #${v.ticket}`;
  const { error: updateErr } = await supabaseAdmin.from("trader_accounts").update({
    status: "breached",
    breach_reason: breachReason
  }).eq("id", account_id);
  if (updateErr) {
    return Response.json({ error: updateErr.message }, { status: 500 });
  }
  await supabaseAdmin.from("notifications").insert({
    user_id: account.user_id,
    title: "⚠️ Account Breached — News Trading Violation",
    message: `A trade on ${v.symbol} was opened near a high-impact news event (${v.event_title}). No new trades may be opened 5 minutes before or 5 minutes after a high-impact news event.`,
    type: "breach"
  });
  try {
    await sendEventEmail({
      type: "breached",
      accountId: account_id,
      reason: breachReason
    });
  } catch (emailErr) {
    console.error("[handle-news-violation] Breach email failed:", emailErr);
  }
  return Response.json({
    ok: true,
    action: "breached",
    violations_count: newViolations.length
  });
}
const RulesRoute = Route$S.update({
  id: "/rules",
  path: "/rules",
  getParentRoute: () => Route$T
});
const PartnerApplyRoute = Route$R.update({
  id: "/partner-apply",
  path: "/partner-apply",
  getParentRoute: () => Route$T
});
const DiscordRoute = Route$Q.update({
  id: "/discord",
  path: "/discord",
  getParentRoute: () => Route$T
});
const BuyRoute = Route$P.update({
  id: "/buy",
  path: "/buy",
  getParentRoute: () => Route$T
});
const AgreementRoute = Route$O.update({
  id: "/agreement",
  path: "/agreement",
  getParentRoute: () => Route$T
});
const AuthenticatedRoute = Route$N.update({
  id: "/_authenticated",
  getParentRoute: () => Route$T
});
const AdminRoute = Route$M.update({
  id: "/_admin",
  getParentRoute: () => Route$T
});
const IndexRoute = Route$L.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$T
});
const PaymentCallbackRoute = Route$K.update({
  id: "/payment/callback",
  path: "/payment/callback",
  getParentRoute: () => Route$T
});
const AuthResetPasswordRoute = Route$J.update({
  id: "/auth/reset-password",
  path: "/auth/reset-password",
  getParentRoute: () => Route$T
});
const AuthRegisterRoute = Route$I.update({
  id: "/auth/register",
  path: "/auth/register",
  getParentRoute: () => Route$T
});
const AuthLoginRoute = Route$H.update({
  id: "/auth/login",
  path: "/auth/login",
  getParentRoute: () => Route$T
});
const AuthForgotPasswordRoute = Route$G.update({
  id: "/auth/forgot-password",
  path: "/auth/forgot-password",
  getParentRoute: () => Route$T
});
const ApiVerifyPaymentRoute = Route$F.update({
  id: "/api/verify-payment",
  path: "/api/verify-payment",
  getParentRoute: () => Route$T
});
const ApiVerifyBankRoute = Route$E.update({
  id: "/api/verify-bank",
  path: "/api/verify-bank",
  getParentRoute: () => Route$T
});
const ApiSquadWebhookRoute = Route$D.update({
  id: "/api/squad-webhook",
  path: "/api/squad-webhook",
  getParentRoute: () => Route$T
});
const ApiSendEmailRoute = Route$C.update({
  id: "/api/send-email",
  path: "/api/send-email",
  getParentRoute: () => Route$T
});
const ApiProvisionAccountRoute = Route$B.update({
  id: "/api/provision-account",
  path: "/api/provision-account",
  getParentRoute: () => Route$T
});
const ApiPartnerApplicationRoute = Route$A.update({
  id: "/api/partner-application",
  path: "/api/partner-application",
  getParentRoute: () => Route$T
});
const ApiNotifyNewPurchaseRoute = Route$z.update({
  id: "/api/notify-new-purchase",
  path: "/api/notify-new-purchase",
  getParentRoute: () => Route$T
});
const ApiInitializePaymentRoute = Route$y.update({
  id: "/api/initialize-payment",
  path: "/api/initialize-payment",
  getParentRoute: () => Route$T
});
const ApiExchangeRateRoute = Route$x.update({
  id: "/api/exchange-rate",
  path: "/api/exchange-rate",
  getParentRoute: () => Route$T
});
const ApiDeliverAccountRoute = Route$w.update({
  id: "/api/deliver-account",
  path: "/api/deliver-account",
  getParentRoute: () => Route$T
});
const AuthenticatedSupportRoute = Route$v.update({
  id: "/support",
  path: "/support",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedStatsRoute = Route$u.update({
  id: "/stats",
  path: "/stats",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedProfileRoute = Route$t.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedPartnerRoute = Route$s.update({
  id: "/partner",
  path: "/partner",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardRoute = Route$r.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedCommunityRoute = Route$q.update({
  id: "/community",
  path: "/community",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedAffiliateRoute = Route$p.update({
  id: "/affiliate",
  path: "/affiliate",
  getParentRoute: () => AuthenticatedRoute
});
const AdminAdminRoute = Route$o.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AdminRoute
});
const AuthenticatedCommunityIndexRoute = Route$n.update({
  id: "/",
  path: "/",
  getParentRoute: () => AuthenticatedCommunityRoute
});
const AdminAdminIndexRoute = Route$m.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminAdminRoute
});
const ApiPublicPushEventRoute = Route$l.update({
  id: "/api/public/push-event",
  path: "/api/public/push-event",
  getParentRoute: () => Route$T
});
const ApiAdminSetExchangeRateRoute = Route$k.update({
  id: "/api/admin/set-exchange-rate",
  path: "/api/admin/set-exchange-rate",
  getParentRoute: () => Route$T
});
const ApiAdminPoolRoute = Route$j.update({
  id: "/api/admin/pool",
  path: "/api/admin/pool",
  getParentRoute: () => Route$T
});
const ApiAdminDeleteRequestRoute = Route$i.update({
  id: "/api/admin/delete-request",
  path: "/api/admin/delete-request",
  getParentRoute: () => Route$T
});
const AuthenticatedCommunitySlugRoute = Route$h.update({
  id: "/$slug",
  path: "/$slug",
  getParentRoute: () => AuthenticatedCommunityRoute
});
const AdminAdminTicketsRoute = Route$g.update({
  id: "/tickets",
  path: "/tickets",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminSocialRoute = Route$f.update({
  id: "/social",
  path: "/social",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminSettingsRoute = Route$e.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminPoolRoute = Route$d.update({
  id: "/pool",
  path: "/pool",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminPendingRoute = Route$c.update({
  id: "/pending",
  path: "/pending",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminPayoutsRoute = Route$b.update({
  id: "/payouts",
  path: "/payouts",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminPartnersRoute = Route$a.update({
  id: "/partners",
  path: "/partners",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminDiscountsRoute = Route$9.update({
  id: "/discounts",
  path: "/discounts",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminChallengesRoute = Route$8.update({
  id: "/challenges",
  path: "/challenges",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminAffiliateRoute = Route$7.update({
  id: "/affiliate",
  path: "/affiliate",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminAccountsRoute = Route$6.update({
  id: "/accounts",
  path: "/accounts",
  getParentRoute: () => AdminAdminRoute
});
const ApiPublicCronSyncEquityV2Route = Route$5.update({
  id: "/api/public/cron/sync-equity-v2",
  path: "/api/public/cron/sync-equity-v2",
  getParentRoute: () => Route$T
});
const ApiPublicCronSyncEquityRoute = Route$4.update({
  id: "/api/public/cron/sync-equity",
  path: "/api/public/cron/sync-equity",
  getParentRoute: () => Route$T
});
const ApiPublicCronReconcilePaymentsRoute = Route$3.update({
  id: "/api/public/cron/reconcile-payments",
  path: "/api/public/cron/reconcile-payments",
  getParentRoute: () => Route$T
});
const ApiPublicCronHandleWeekendViolationRoute = Route$2.update({
  id: "/api/public/cron/handle-weekend-violation",
  path: "/api/public/cron/handle-weekend-violation",
  getParentRoute: () => Route$T
});
const ApiPublicCronHandleScalpingRoute = Route$1.update({
  id: "/api/public/cron/handle-scalping",
  path: "/api/public/cron/handle-scalping",
  getParentRoute: () => Route$T
});
const ApiPublicCronHandleNewsViolationRoute = Route2.update({
  id: "/api/public/cron/handle-news-violation",
  path: "/api/public/cron/handle-news-violation",
  getParentRoute: () => Route$T
});
const AdminAdminRouteChildren = {
  AdminAdminAccountsRoute,
  AdminAdminAffiliateRoute,
  AdminAdminChallengesRoute,
  AdminAdminDiscountsRoute,
  AdminAdminPartnersRoute,
  AdminAdminPayoutsRoute,
  AdminAdminPendingRoute,
  AdminAdminPoolRoute,
  AdminAdminSettingsRoute,
  AdminAdminSocialRoute,
  AdminAdminTicketsRoute,
  AdminAdminIndexRoute
};
const AdminAdminRouteWithChildren = AdminAdminRoute._addFileChildren(
  AdminAdminRouteChildren
);
const AdminRouteChildren = {
  AdminAdminRoute: AdminAdminRouteWithChildren
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const AuthenticatedCommunityRouteChildren = {
  AuthenticatedCommunitySlugRoute,
  AuthenticatedCommunityIndexRoute
};
const AuthenticatedCommunityRouteWithChildren = AuthenticatedCommunityRoute._addFileChildren(
  AuthenticatedCommunityRouteChildren
);
const AuthenticatedRouteChildren = {
  AuthenticatedAffiliateRoute,
  AuthenticatedCommunityRoute: AuthenticatedCommunityRouteWithChildren,
  AuthenticatedDashboardRoute,
  AuthenticatedPartnerRoute,
  AuthenticatedProfileRoute,
  AuthenticatedStatsRoute,
  AuthenticatedSupportRoute
};
const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute: AdminRouteWithChildren,
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  AgreementRoute,
  BuyRoute,
  DiscordRoute,
  PartnerApplyRoute,
  RulesRoute,
  ApiDeliverAccountRoute,
  ApiExchangeRateRoute,
  ApiInitializePaymentRoute,
  ApiNotifyNewPurchaseRoute,
  ApiPartnerApplicationRoute,
  ApiProvisionAccountRoute,
  ApiSendEmailRoute,
  ApiSquadWebhookRoute,
  ApiVerifyBankRoute,
  ApiVerifyPaymentRoute,
  AuthForgotPasswordRoute,
  AuthLoginRoute,
  AuthRegisterRoute,
  AuthResetPasswordRoute,
  PaymentCallbackRoute,
  ApiAdminDeleteRequestRoute,
  ApiAdminPoolRoute,
  ApiAdminSetExchangeRateRoute,
  ApiPublicPushEventRoute,
  ApiPublicCronHandleNewsViolationRoute,
  ApiPublicCronHandleScalpingRoute,
  ApiPublicCronHandleWeekendViolationRoute,
  ApiPublicCronReconcilePaymentsRoute,
  ApiPublicCronSyncEquityRoute,
  ApiPublicCronSyncEquityV2Route
};
const routeTree = Route$T._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({ error, reset }) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "rounded-md border border-border px-4 py-2 text-sm", children: "Go home" })
    ] })
  ] }) });
}
const getRouter = () => {
  return createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Link as L,
  Route$P as R,
  useNavigate as a,
  useLocation as b,
  Route$K as c,
  Route$h as d,
  ReactDOM as e,
  router as f,
  reactDomExports as r,
  supabase as s,
  toast as t,
  useAuth as u
};
