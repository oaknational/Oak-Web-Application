!(function () {
  "use strict";
  var t,
    e,
    r,
    a = {
      306: function (t, e) {
        (e.q = void 0), (e.q = "3.2.2");
      },
      335: function (t, e, r) {
        var a,
          n =
            (this && this.__extends) ||
            ((a = function (t, e) {
              return (
                (a =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (t, e) {
                      t.__proto__ = e;
                    }) ||
                  function (t, e) {
                    for (var r in e)
                      Object.prototype.hasOwnProperty.call(e, r) &&
                        (t[r] = e[r]);
                  }),
                a(t, e)
              );
            }),
            function (t, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Class extends value " +
                    String(e) +
                    " is not a constructor or null",
                );
              function r() {
                this.constructor = t;
              }
              a(t, e),
                (t.prototype =
                  null === e
                    ? Object.create(e)
                    : ((r.prototype = e.prototype), new r()));
            }),
          o =
            (this && this.__assign) ||
            function () {
              return (
                (o =
                  Object.assign ||
                  function (t) {
                    for (var e, r = 1, a = arguments.length; r < a; r++)
                      for (var n in (e = arguments[r]))
                        Object.prototype.hasOwnProperty.call(e, n) &&
                          (t[n] = e[n]);
                    return t;
                  }),
                o.apply(this, arguments)
              );
            },
          i =
            (this && this.__awaiter) ||
            function (t, e, r, a) {
              return new (r || (r = Promise))(function (n, o) {
                function i(t) {
                  try {
                    s(a.next(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function l(t) {
                  try {
                    s(a.throw(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function s(t) {
                  var e;
                  t.done
                    ? n(t.value)
                    : ((e = t.value),
                      e instanceof r
                        ? e
                        : new r(function (t) {
                            t(e);
                          })).then(i, l);
                }
                s((a = a.apply(t, e || [])).next());
              });
            },
          l =
            (this && this.__generator) ||
            function (t, e) {
              var r,
                a,
                n,
                o,
                i = {
                  label: 0,
                  sent: function () {
                    if (1 & n[0]) throw n[1];
                    return n[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: l(0), throw: l(1), return: l(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function l(o) {
                return function (l) {
                  return (function (o) {
                    if (r)
                      throw new TypeError("Generator is already executing.");
                    for (; i; )
                      try {
                        if (
                          ((r = 1),
                          a &&
                            (n =
                              2 & o[0]
                                ? a.return
                                : o[0]
                                ? a.throw || ((n = a.return) && n.call(a), 0)
                                : a.next) &&
                            !(n = n.call(a, o[1])).done)
                        )
                          return n;
                        switch (
                          ((a = 0), n && (o = [2 & o[0], n.value]), o[0])
                        ) {
                          case 0:
                          case 1:
                            n = o;
                            break;
                          case 4:
                            return i.label++, { value: o[1], done: !1 };
                          case 5:
                            i.label++, (a = o[1]), (o = [0]);
                            continue;
                          case 7:
                            (o = i.ops.pop()), i.trys.pop();
                            continue;
                          default:
                            if (
                              !((n = i.trys),
                              (n = n.length > 0 && n[n.length - 1]) ||
                                (6 !== o[0] && 2 !== o[0]))
                            ) {
                              i = 0;
                              continue;
                            }
                            if (
                              3 === o[0] &&
                              (!n || (o[1] > n[0] && o[1] < n[3]))
                            ) {
                              i.label = o[1];
                              break;
                            }
                            if (6 === o[0] && i.label < n[1]) {
                              (i.label = n[1]), (n = o);
                              break;
                            }
                            if (n && i.label < n[2]) {
                              (i.label = n[2]), i.ops.push(o);
                              break;
                            }
                            n[2] && i.ops.pop(), i.trys.pop();
                            continue;
                        }
                        o = e.call(t, i);
                      } catch (t) {
                        (o = [6, t]), (a = 0);
                      } finally {
                        r = n = 0;
                      }
                    if (5 & o[0]) throw o[1];
                    return { value: o[0] ? o[1] : void 0, done: !0 };
                  })([o, l]);
                };
              }
            },
          s =
            (this && this.__read) ||
            function (t, e) {
              var r = "function" == typeof Symbol && t[Symbol.iterator];
              if (!r) return t;
              var a,
                n,
                o = r.call(t),
                i = [];
              try {
                for (; (void 0 === e || e-- > 0) && !(a = o.next()).done; )
                  i.push(a.value);
              } catch (t) {
                n = { error: t };
              } finally {
                try {
                  a && !a.done && (r = o.return) && r.call(o);
                } finally {
                  if (n) throw n.error;
                }
              }
              return i;
            },
          y =
            (this && this.__spreadArray) ||
            function (t, e, r) {
              if (r || 2 === arguments.length)
                for (var a, n = 0, o = e.length; n < o; n++)
                  (!a && n in e) ||
                    (a || (a = Array.prototype.slice.call(e, 0, n)),
                    (a[n] = e[n]));
              return t.concat(a || Array.prototype.slice.call(e));
            },
          u =
            (this && this.__values) ||
            function (t) {
              var e = "function" == typeof Symbol && Symbol.iterator,
                r = e && t[e],
                a = 0;
              if (r) return r.call(t);
              if (t && "number" == typeof t.length)
                return {
                  next: function () {
                    return (
                      t && a >= t.length && (t = void 0),
                      { value: t && t[a++], done: !t }
                    );
                  },
                };
              throw new TypeError(
                e
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined.",
              );
            };
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.LazyHandler =
            e.LazyMathDocumentMixin =
            e.LazyMathItemMixin =
            e.LAZYID =
            e.LazyList =
              void 0);
        var c = r(769),
          h = r(239),
          p = (function () {
            function t() {
              (this.id = 0), (this.items = new Map());
            }
            return (
              (t.prototype.add = function (t) {
                var e = String(this.id++);
                return this.items.set(e, t), e;
              }),
              (t.prototype.get = function (t) {
                return this.items.get(t);
              }),
              (t.prototype.delete = function (t) {
                return this.items.delete(t);
              }),
              t
            );
          })();
        function f(t) {
          return (function (t) {
            function r() {
              for (var e = [], r = 0; r < arguments.length; r++)
                e[r] = arguments[r];
              var a = t.apply(this, y([], s(e), !1)) || this;
              return (
                (a.lazyCompile = !0),
                (a.lazyTypeset = !0),
                (a.lazyTex = !1),
                a.end.node || (a.lazyCompile = a.lazyTypeset = !1),
                a
              );
            }
            return (
              n(r, t),
              (r.prototype.compile = function (e) {
                this.lazyCompile
                  ? this.state() < c.STATE.COMPILED &&
                    ((this.lazyTex = "TeX" === this.inputJax.name),
                    (this.root = e.mmlFactory.create("math")),
                    this.state(c.STATE.COMPILED))
                  : t.prototype.compile.call(this, e);
              }),
              (r.prototype.state = function (e, r) {
                return (
                  void 0 === e && (e = null),
                  void 0 === r && (r = !1),
                  null !== r && t.prototype.state.call(this, e, r),
                  t.prototype.state.call(this)
                );
              }),
              (r.prototype.typeset = function (r) {
                var a;
                if (this.lazyTypeset) {
                  if (this.state() < c.STATE.TYPESET) {
                    var n = r.adaptor;
                    if (!this.lazyMarker) {
                      var o = r.lazyList.add(this);
                      (this.lazyMarker = n.node(
                        "mjx-lazy",
                        (((a = {})[e.LAZYID] = o), a),
                      )),
                        (this.typesetRoot = n.node("mjx-container", {}, [
                          this.lazyMarker,
                        ]));
                    }
                    this.state(c.STATE.TYPESET);
                  }
                } else t.prototype.typeset.call(this, r);
              }),
              (r.prototype.updateDocument = function (e) {
                t.prototype.updateDocument.call(this, e),
                  this.lazyTypeset && e.lazyObserver.observe(this.lazyMarker);
              }),
              r
            );
          })(t);
        }
        function d(t) {
          var r;
          return (
            (r = (function (t) {
              function r() {
                for (var e = [], r = 0; r < arguments.length; r++)
                  e[r] = arguments[r];
                var a = t.apply(this, y([], s(e), !1)) || this;
                (a.lazyAlwaysContainers = null),
                  (a.lazyAlwaysIndex = 0),
                  (a.lazyPromise = Promise.resolve()),
                  (a.lazyIdle = !1),
                  (a.lazySet = new Set()),
                  (a.options.MathItem = f(a.options.MathItem));
                var n = a.constructor.ProcessBits;
                !n.has("lazyAlways") && n.allocate("lazyAlways"),
                  (a.lazyObserver = new IntersectionObserver(
                    a.lazyObserve.bind(a),
                    { rootMargin: a.options.lazyMargin },
                  )),
                  (a.lazyList = new p());
                var o = a.lazyHandleSet.bind(a);
                if (
                  ((a.lazyProcessSet =
                    window && window.requestIdleCallback
                      ? function () {
                          return window.requestIdleCallback(o);
                        }
                      : function () {
                          return setTimeout(o, 10);
                        }),
                  window)
                ) {
                  var i = !1,
                    l = function () {
                      !i && a.lazyTypesetAll(), (i = !0);
                    };
                  window.matchMedia("print").addListener(l),
                    window.addEventListener("beforeprint", l);
                }
                return a;
              }
              return (
                n(r, t),
                (r.prototype.lazyAlways = function () {
                  var t, e;
                  if (
                    this.lazyAlwaysContainers &&
                    !this.processed.isSet("lazyAlways")
                  ) {
                    try {
                      for (
                        var r = u(this.math), a = r.next();
                        !a.done;
                        a = r.next()
                      ) {
                        var n = a.value;
                        n.lazyTypeset &&
                          this.lazyIsAlways(n) &&
                          (n.lazyCompile = n.lazyTypeset = !1);
                      }
                    } catch (e) {
                      t = { error: e };
                    } finally {
                      try {
                        a && !a.done && (e = r.return) && e.call(r);
                      } finally {
                        if (t) throw t.error;
                      }
                    }
                    this.processed.set("lazyAlways");
                  }
                }),
                (r.prototype.lazyIsAlways = function (t) {
                  if (t.state() < c.STATE.LAZYALWAYS) {
                    t.state(c.STATE.LAZYALWAYS);
                    var e = t.start.node,
                      r = this.adaptor,
                      a = this.lazyAlwaysIndex,
                      n = this.lazyAlwaysContainers.length;
                    do {
                      var o = this.lazyAlwaysContainers[this.lazyAlwaysIndex];
                      if (r.contains(o, e)) return !0;
                      ++this.lazyAlwaysIndex >= n && (this.lazyAlwaysIndex = 0);
                    } while (this.lazyAlwaysIndex !== a);
                  }
                  return !1;
                }),
                (r.prototype.state = function (e, r) {
                  return (
                    void 0 === r && (r = !1),
                    t.prototype.state.call(this, e, r),
                    e < c.STATE.LAZYALWAYS &&
                      this.processed.clear("lazyAlways"),
                    this
                  );
                }),
                (r.prototype.lazyTypesetAll = function () {
                  return i(this, void 0, void 0, function () {
                    var t,
                      e,
                      r,
                      a,
                      n,
                      o,
                      i,
                      s,
                      y = this;
                    return l(this, function (l) {
                      t = c.STATE.LAST;
                      try {
                        for (
                          e = u(this.math), r = e.next();
                          !r.done;
                          r = e.next()
                        )
                          (a = r.value),
                            ((n = a).lazyCompile || n.lazyTypeset) &&
                              (n.lazyCompile
                                ? (n.state(c.STATE.COMPILED - 1),
                                  (t = c.STATE.COMPILED))
                                : (n.state(c.STATE.TYPESET - 1),
                                  c.STATE.TYPESET < t && (t = c.STATE.TYPESET)),
                              (n.lazyCompile = n.lazyTypeset = !1),
                              n.lazyMarker &&
                                this.lazyObserver.unobserve(n.lazyMarker));
                      } catch (t) {
                        i = { error: t };
                      } finally {
                        try {
                          r && !r.done && (s = e.return) && s.call(e);
                        } finally {
                          if (i) throw i.error;
                        }
                      }
                      return t === c.STATE.LAST
                        ? [2, Promise.resolve()]
                        : (this.state(t - 1, null),
                          (o = this.outputJax.options.fontCache) &&
                            (this.outputJax.options.fontCache = "none"),
                          this.reset(),
                          [
                            2,
                            (0, h.handleRetriesFor)(function () {
                              return y.render();
                            }).then(function () {
                              o && (y.outputJax.options.fontCache = o);
                            }),
                          ]);
                    });
                  });
                }),
                (r.prototype.lazyObserve = function (t) {
                  var r, a;
                  try {
                    for (var n = u(t), o = n.next(); !o.done; o = n.next()) {
                      var i = o.value,
                        l = this.adaptor.getAttribute(i.target, e.LAZYID);
                      this.lazyList.get(l) &&
                        (i.isIntersecting
                          ? (this.lazySet.add(l),
                            this.lazyIdle ||
                              ((this.lazyIdle = !0), this.lazyProcessSet()))
                          : this.lazySet.delete(l));
                    }
                  } catch (t) {
                    r = { error: t };
                  } finally {
                    try {
                      o && !o.done && (a = n.return) && a.call(n);
                    } finally {
                      if (r) throw r.error;
                    }
                  }
                }),
                (r.prototype.lazyHandleSet = function () {
                  var t = this,
                    e = this.lazySet;
                  (this.lazySet = new Set()),
                    (this.lazyPromise = this.lazyPromise.then(function () {
                      var r = t.compileEarlierItems(e)
                        ? c.STATE.COMPILED
                        : c.STATE.TYPESET;
                      return (
                        (r = t.resetStates(e, r)),
                        t.state(r - 1, null),
                        (0, h.handleRetriesFor)(function () {
                          t.render(), (t.lazyIdle = !1);
                        })
                      );
                    }));
                }),
                (r.prototype.resetStates = function (t, e) {
                  var r, a;
                  try {
                    for (
                      var n = u(t.values()), o = n.next();
                      !o.done;
                      o = n.next()
                    ) {
                      var i = o.value,
                        l = this.lazyList.get(i);
                      l.lazyCompile
                        ? (l.state(c.STATE.COMPILED - 1),
                          (e = c.STATE.COMPILED))
                        : l.state(c.STATE.TYPESET - 1),
                        (l.lazyCompile = l.lazyTypeset = !1),
                        l.lazyMarker &&
                          this.lazyObserver.unobserve(l.lazyMarker);
                    }
                  } catch (t) {
                    r = { error: t };
                  } finally {
                    try {
                      o && !o.done && (a = n.return) && a.call(n);
                    } finally {
                      if (r) throw r.error;
                    }
                  }
                  return e;
                }),
                (r.prototype.compileEarlierItems = function (t) {
                  var e,
                    r,
                    a = this.earliestTex(t);
                  if (!a) return !1;
                  var n = !1;
                  try {
                    for (
                      var o = u(this.math), i = o.next();
                      !i.done;
                      i = o.next()
                    ) {
                      var l = i.value;
                      if (
                        l === a ||
                        !(null == l ? void 0 : l.lazyCompile) ||
                        !l.lazyTex
                      )
                        break;
                      (l.lazyCompile = !1),
                        l.lazyMarker &&
                          this.lazyObserver.unobserve(l.lazyMarker),
                        l.state(c.STATE.COMPILED - 1),
                        (n = !0);
                    }
                  } catch (t) {
                    e = { error: t };
                  } finally {
                    try {
                      i && !i.done && (r = o.return) && r.call(o);
                    } finally {
                      if (e) throw e.error;
                    }
                  }
                  return n;
                }),
                (r.prototype.earliestTex = function (t) {
                  var e,
                    r,
                    a = null,
                    n = null;
                  try {
                    for (
                      var o = u(t.values()), i = o.next();
                      !i.done;
                      i = o.next()
                    ) {
                      var l = i.value,
                        s = this.lazyList.get(l);
                      s.lazyTex &&
                        (null === a || parseInt(l) < a) &&
                        ((a = parseInt(l)), (n = s));
                    }
                  } catch (t) {
                    e = { error: t };
                  } finally {
                    try {
                      i && !i.done && (r = o.return) && r.call(o);
                    } finally {
                      if (e) throw e.error;
                    }
                  }
                  return n;
                }),
                (r.prototype.clearMathItemsWithin = function (r) {
                  var a,
                    n,
                    o = t.prototype.clearMathItemsWithin.call(this, r);
                  try {
                    for (var i = u(o), l = i.next(); !l.done; l = i.next()) {
                      var s = l.value.lazyMarker;
                      s &&
                        (this.lazyObserver.unobserve(s),
                        this.lazyList.delete(
                          this.adaptor.getAttribute(s, e.LAZYID),
                        ));
                    }
                  } catch (t) {
                    a = { error: t };
                  } finally {
                    try {
                      l && !l.done && (n = i.return) && n.call(i);
                    } finally {
                      if (a) throw a.error;
                    }
                  }
                  return o;
                }),
                (r.prototype.render = function () {
                  var e = this.options.lazyAlwaysTypeset;
                  return (
                    (this.lazyAlwaysContainers = e
                      ? this.adaptor.getElements(
                          Array.isArray(e) ? e : [e],
                          this.document,
                        )
                      : null),
                    (this.lazyAlwaysIndex = 0),
                    t.prototype.render.call(this),
                    this
                  );
                }),
                r
              );
            })(t)),
            (r.OPTIONS = o(o({}, t.OPTIONS), {
              lazyMargin: "200px",
              lazyAlwaysTypeset: null,
              renderActions: o(o({}, t.OPTIONS.renderActions), {
                lazyAlways: [c.STATE.LAZYALWAYS, "lazyAlways", "", !1],
              }),
            })),
            r
          );
        }
        (e.LazyList = p),
          (0, c.newState)("LAZYALWAYS", c.STATE.FINDMATH + 3),
          (e.LAZYID = "data-mjx-lazy"),
          (e.LazyMathItemMixin = f),
          (e.LazyMathDocumentMixin = d),
          (e.LazyHandler = function (t) {
            return (
              "undefined" != typeof IntersectionObserver &&
                (t.documentClass = d(t.documentClass)),
              t
            );
          });
      },
      723: function (t, e) {
        MathJax._.components.global.isObject,
          MathJax._.components.global.combineConfig,
          MathJax._.components.global.combineDefaults,
          (e.r8 = MathJax._.components.global.combineWithMathJax),
          MathJax._.components.global.MathJax;
      },
      769: function (t, e) {
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.protoItem = MathJax._.core.MathItem.protoItem),
          (e.AbstractMathItem = MathJax._.core.MathItem.AbstractMathItem),
          (e.STATE = MathJax._.core.MathItem.STATE),
          (e.newState = MathJax._.core.MathItem.newState);
      },
      239: function (t, e) {
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.handleRetriesFor = MathJax._.util.Retries.handleRetriesFor),
          (e.retryAfter = MathJax._.util.Retries.retryAfter);
      },
    },
    n = {};
  function o(t) {
    var e = n[t];
    if (void 0 !== e) return e.exports;
    var r = (n[t] = { exports: {} });
    return a[t].call(r.exports, r, r.exports, o), r.exports;
  }
  (t = o(723)),
    (e = o(306)),
    (r = o(335)),
    MathJax.loader && MathJax.loader.checkVersion("ui/lazy", e.q, "ui"),
    (0, t.r8)({ _: { ui: { lazy: { LazyHandler: r } } } }),
    MathJax.startup &&
      MathJax.startup.extendHandler(function (t) {
        return (0, r.LazyHandler)(t);
      });
})();
