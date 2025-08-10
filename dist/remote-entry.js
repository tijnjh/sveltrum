import { a, g, b, d, s } from "./chunks/event-state.js";
import { c, r, g as g$1, p } from "./chunks/query.js";
import { q } from "./chunks/query.js";
import { error, json } from "@sveltejs/kit";
import { D } from "./chunks/false.js";
import { b as b$1, c as c$1 } from "./chunks/paths.js";
// @__NO_SIDE_EFFECTS__
function command(validate_or_fn, maybe_fn) {
  const fn = maybe_fn ?? validate_or_fn;
  const validate = c(validate_or_fn, maybe_fn);
  const __ = { type: "command", id: "", name: "" };
  const wrapper = (arg) => {
    const event = a();
    if (!event.isRemoteRequest) {
      throw new Error(
        `Cannot call a command (\`${__.name}(${maybe_fn ? "..." : ""})\`) during server-side rendering`
      );
    }
    g(event).refreshes ??= {};
    const promise = Promise.resolve(r(event, true, arg, validate, fn));
    promise.updates = () => {
      throw new Error(`Cannot call '${__.name}(...).updates(...)' on the server`);
    };
    return (
      /** @type {ReturnType<RemoteCommand<Input, Output>>} */
      promise
    );
  };
  Object.defineProperty(wrapper, "__", { value: __ });
  return wrapper;
}
// @__NO_SIDE_EFFECTS__
function form(fn) {
  function create_instance(key) {
    const instance = {};
    instance.method = "POST";
    instance.onsubmit = () => {
    };
    Object.defineProperty(instance, "enhance", {
      value: () => {
        return { action: instance.action, method: instance.method, onsubmit: instance.onsubmit };
      }
    });
    const button_props = {
      type: "submit",
      onclick: () => {
      }
    };
    Object.defineProperty(button_props, "enhance", {
      value: () => {
        return { type: "submit", formaction: instance.buttonProps.formaction, onclick: () => {
        } };
      }
    });
    Object.defineProperty(instance, "buttonProps", {
      value: button_props
    });
    const __ = {
      type: "form",
      name: "",
      id: "",
      /** @param {FormData} form_data */
      fn: async (form_data) => {
        const event = a();
        const state = g(event);
        state.refreshes ??= {};
        const result = await r(event, true, form_data, (d2) => d2, fn);
        if (!event.isRemoteRequest) {
          (state.remote_data ??= {})[__.id] = result;
        }
        return result;
      }
    };
    Object.defineProperty(instance, "__", { value: __ });
    Object.defineProperty(instance, "action", {
      get: () => `?/remote=${__.id}`,
      enumerable: true
    });
    Object.defineProperty(button_props, "formaction", {
      get: () => `?/remote=${__.id}`,
      enumerable: true
    });
    Object.defineProperty(instance, "result", {
      get() {
        try {
          const { remote_data } = g(a());
          return remote_data?.[__.id];
        } catch {
          return void 0;
        }
      }
    });
    if (key == void 0) {
      Object.defineProperty(instance, "for", {
        /** @type {RemoteForm<any>['for']} */
        value: (key2) => {
          const state = g(a());
          let instance2 = (state.form_instances ??= /* @__PURE__ */ new Map()).get(key2);
          if (!instance2) {
            instance2 = create_instance(key2);
            instance2.__.id = `${__.id}/${encodeURIComponent(JSON.stringify(key2))}`;
            instance2.__.name = __.name;
            state.form_instances.set(key2, instance2);
          }
          return instance2;
        }
      });
    }
    return instance;
  }
  return create_instance();
}
// @__NO_SIDE_EFFECTS__
function prerender(validate_or_fn, fn_or_options, maybe_options) {
  const maybe_fn = typeof fn_or_options === "function" ? fn_or_options : void 0;
  const options = maybe_options ?? (maybe_fn ? void 0 : fn_or_options);
  const fn = maybe_fn ?? validate_or_fn;
  const validate = c(validate_or_fn, maybe_fn);
  const __ = {
    type: "prerender",
    id: "",
    name: "",
    has_arg: !!maybe_fn,
    inputs: options?.inputs,
    dynamic: options?.dynamic
  };
  const wrapper = (arg) => {
    const promise = (async () => {
      const event = a();
      const state = g(event);
      const payload = b(arg, state.transport);
      const id = __.id;
      const url = `${b$1}/${c$1}/remote/${id}${payload ? `/${payload}` : ""}`;
      if (!state.prerendering && !D && !event.isRemoteRequest) {
        try {
          return await g$1(id, arg, event, async () => {
            const response = await fetch(new URL(url, event.url.origin).href);
            if (!response.ok) {
              throw new Error("Prerendered response not found");
            }
            const prerendered = await response.json();
            if (prerendered.type === "error") {
              error(prerendered.status, prerendered.error);
            }
            (state.remote_data ??= {})[d(id, payload)] = prerendered.result;
            return p(prerendered.result, state.transport);
          });
        } catch {
        }
      }
      if (state.prerendering?.remote_responses.has(url)) {
        return (
          /** @type {Promise<any>} */
          state.prerendering.remote_responses.get(url)
        );
      }
      const promise2 = g$1(
        id,
        arg,
        event,
        () => r(event, false, arg, validate, fn)
      );
      if (state.prerendering) {
        state.prerendering.remote_responses.set(url, promise2);
      }
      const result = await promise2;
      if (state.prerendering) {
        const body = { type: "result", result: s(result, state.transport) };
        state.prerendering.dependencies.set(url, {
          body: JSON.stringify(body),
          response: json(body)
        });
      }
      return result;
    })();
    promise.catch(() => {
    });
    return (
      /** @type {RemoteResource<Output>} */
      promise
    );
  };
  Object.defineProperty(wrapper, "__", { value: __ });
  return wrapper;
}
export {
  command,
  form,
  prerender,
  q as query
};
