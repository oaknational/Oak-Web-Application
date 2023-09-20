/* eslint-disable */
// @ts-nocheck
import e, {
  useState as r,
  useEffect as t,
  useContext as n,
  useRef as o,
} from "react";
import c from "prop-types";

function i(e, r, t) {
  return (
    r in e
      ? Object.defineProperty(e, r, {
          value: t,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[r] = t),
    e
  );
}

function a() {
  return (a =
    Object.assign ||
    function (e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = arguments[r];
        for (var n in t)
          Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
      }
      return e;
    }).apply(this, arguments);
}

function l(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    r &&
      (n = n.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })),
      t.push.apply(t, n);
  }
  return t;
}

function u(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2
      ? l(Object(t), !0).forEach(function (r) {
          i(e, r, t[r]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
      : l(Object(t)).forEach(function (r) {
          Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
  }
  return e;
}

function d(e, r) {
  if (null == e) return {};
  var t,
    n,
    o = (function (e, r) {
      if (null == e) return {};
      var t,
        n,
        o = {},
        c = Object.keys(e);
      for (n = 0; n < c.length; n++)
        (t = c[n]), r.indexOf(t) >= 0 || (o[t] = e[t]);
      return o;
    })(e, r);
  if (Object.getOwnPropertySymbols) {
    var c = Object.getOwnPropertySymbols(e);
    for (n = 0; n < c.length; n++)
      (t = c[n]),
        r.indexOf(t) >= 0 ||
          (Object.prototype.propertyIsEnumerable.call(e, t) && (o[t] = e[t]));
  }
  return o;
}

function s(e, r) {
  return (
    (function (e) {
      if (Array.isArray(e)) return e;
    })(e) ||
    (function (e, r) {
      if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(e)))
        return;
      var t = [],
        n = !0,
        o = !1,
        c = void 0;
      try {
        for (
          var i, a = e[Symbol.iterator]();
          !(n = (i = a.next()).done) && (t.push(i.value), !r || t.length !== r);
          n = !0
        );
      } catch (e) {
        (o = !0), (c = e);
      } finally {
        try {
          n || null == a.return || a.return();
        } finally {
          if (o) throw c;
        }
      }
      return t;
    })(e, r) ||
    f(e, r) ||
    (function () {
      throw new TypeError(
        "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
      );
    })()
  );
}

function p(e) {
  return (
    (function (e) {
      if (Array.isArray(e)) return b(e);
    })(e) ||
    (function (e) {
      if ("undefined" != typeof Symbol && Symbol.iterator in Object(e))
        return Array.from(e);
    })(e) ||
    f(e) ||
    (function () {
      throw new TypeError(
        "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
      );
    })()
  );
}

function f(e, r) {
  if (e) {
    if ("string" == typeof e) return b(e, r);
    var t = Object.prototype.toString.call(e).slice(8, -1);
    return (
      "Object" === t && e.constructor && (t = e.constructor.name),
      "Map" === t || "Set" === t
        ? Array.from(t)
        : "Arguments" === t ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
        ? b(e, r)
        : void 0
    );
  }
}

function b(e, r) {
  (null == r || r > e.length) && (r = e.length);
  for (var t = 0, n = new Array(r); t < r; t++) n[t] = e[t];
  return n;
}
var m = function () {},
  y = e.createContext({
    isReady: !1,
    debug: !1,
    autoblockingRules: void 0,
  }),
  g = function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
    return e.reduce(function (e, r) {
      return u(
        {},
        e,
        i({}, r.policySlug, [].concat(p(e[r.policySlug] || []), [r]))
      );
    }, {});
  },
  h = function (n) {
    var o,
      c = n.projectId,
      i = n.autoblocking,
      a = void 0 === i || i,
      l = n.debug,
      u = void 0 !== l && l,
      d = n.children,
      p = s(r(!1), 2),
      f = p[0],
      b = p[1],
      h = s(r(void 0), 2),
      v = h[0],
      O = h[1],
      j = f && (!a || v);
    return (
      t(function () {
        // MG edit - 2022 - 07 - 05 - just return children if in a test
        // environment
        if (process.env.NODE_ENV === "test") return;
        // RS edit - 2022-02-09 - support disabling metomic programmatically
        // because we need to automatically load these pages up in Puppeteer for
        // screenshots to PDF.
        // I'm using old style .includes here as I'm not sure this file gets augmented
        // by Next.js' compilers, so best to be wary.
        if (window.location.search.indexOf("metomic=") !== -1) return;

        var e = document.createElement("script");
        return (
          (e.src = "https://consent-manager.thenational.academy/embed.js"),
          (e.crossorigin = !0),
          (e.defer = !0),
          (e.charset = "utf-8"),
          e.addEventListener("load", function () {
            return b(!0);
          }),
          document.head.appendChild(e),
          function () {
            return e.remove();
          }
        );
      }, []),
      t(
        function () {
          if (!a) return m;
          var e = document.createElement("script");
          return (
            (e.src = "https://config.thenational.academy/config.js".concat(
              "?id=",
              c
            )),
            (e.crossorigin = !0),
            (e.defer = !0),
            (e.charset = "utf-8"),
            e.addEventListener("load", function () {
              return O(window._mtm);
            }),
            document.head.appendChild(e),
            function () {
              return e.remove();
            }
          );
        },
        [a, c]
      ),
      t(
        function () {
          j &&
            window.Metomic &&
            window.Metomic("load", {
              projectId: c,
            });
        },
        [a, j, c]
      ),
      e.createElement(
        e.Fragment,
        null,
        e.createElement(
          y.Provider,
          {
            value: {
              isReady: j,
              debug: u
                ? function () {
                    for (
                      var e, r = arguments.length, t = new Array(r), n = 0;
                      n < r;
                      n++
                    )
                      t[n] = arguments[n];
                    return (e = console).log.apply(e, ["[metomic]"].concat(t));
                  }
                : m,
              autoblockingRules: g(
                null == v || null === (o = v.configAutoblocking) || void 0 === o
                  ? void 0
                  : o.rules
              ),
            },
          },
          d
        )
      )
    );
  };
(h.propTypes = {
  projectId: c.string.isRequired,
  autoblocking: c.bool,
  debug: c.bool,
  children: c.node.isRequired,
}),
  (h.defaultProps = {
    autoblocking: !0,
    debug: !1,
  });

function v(r) {
  if (!r) return r;
  var t = r.props;
  return e.cloneElement(r, {
    "data-blocked-src": t.src,
    "data-blocked-srcset": t.srcSet,
    src: void 0,
    srcSet: void 0,
    children: e.Children.map(t.children, v),
  });
}
var O = function (c) {
  var i,
    l = c.micropolicy,
    u = c.placeholder,
    p = c.placeholderParams,
    f = c.children,
    b = d(c, ["micropolicy", "placeholder", "placeholderParams", "children"]),
    g = s(r(null), 2),
    h = g[0],
    O = g[1],
    j = n(y),
    w = j.isReady,
    S = j.autoblockingRules,
    P = j.debug,
    k = void 0 === P ? m : P,
    E = o();
  return (
    S[l] &&
      k(
        'An autoblocking rule for the "'.concat(
          l,
          '" micropolicy exists. Make sure to use either autoblocking or manual blocking but not both.'
        )
      ),
    t(
      function () {
        var e, r, t, n;
        w &&
          (null === (e = (r = window).Metomic) ||
            void 0 === e ||
            e.call(
              r,
              "getConsentState",
              {
                slug: l,
              },
              function (e) {
                var r = e.enabled;
                return O(r);
              }
            ),
          null === (t = (n = window).Metomic) ||
            void 0 === t ||
            t.call(n, "ConsentManager:onConsentStateChange", function (e) {
              var r = e.slug;
              "CONSENTED" === e.state && r === l && O(!0);
            }));
      },
      [w, l]
    ),
    null !== h &&
      e.createElement(
        e.Fragment,
        null,
        "",
        e.Children.only(f) && h
          ? f
          : e.createElement(
              "script",
              a(
                {
                  ref: function (e) {
                    e
                      ? (k("Blocking node for ".concat(l)),
                        (e.fromReact = !0),
                        (E.current = e))
                      : (k("Unblocking node for ".concat(l)),
                        (E.current = null));
                  },
                  type: "text/x-metomic",
                  "data-placeholder": u,
                  "data-micropolicy": l,
                  "data-placeholder-params":
                    ((i = p),
                    i &&
                      Object.keys(i).reduce(function (e, r) {
                        return ""
                          .concat(e, "\n       ")
                          .concat(r, "=")
                          .concat(i[r]);
                      }, "")),
                  width: f.props.width,
                  height: f.props.height,
                },
                b
              ),
              "string" == typeof (null == f ? void 0 : f.type) && v(f)
            ),
        ""
      )
  );
};
(O.propTypes = {
  micropolicy: c.string.isRequired,
  placeholder: c.string,
  placeholderParams: c.object,
  children: c.node.isRequired,
}),
  (O.defaultProps = {
    placeholder: void 0,
    placeholderParams: void 0,
  });
export { O as ConsentGate, y as MetomicContext, h as MetomicProvider };
