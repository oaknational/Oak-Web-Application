!(function () {
  "use strict";
  var t = {
      515: function (t, e, r) {
        var n =
          (this && this.__values) ||
          function (t) {
            var e = "function" == typeof Symbol && Symbol.iterator,
              r = e && t[e],
              n = 0;
            if (r) return r.call(t);
            if (t && "number" == typeof t.length)
              return {
                next: function () {
                  return (
                    t && n >= t.length && (t = void 0),
                    { value: t && t[n++], done: !t }
                  );
                },
              };
            throw new TypeError(
              e ? "Object is not iterable." : "Symbol.iterator is not defined.",
            );
          };
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.MathJax =
            e.combineWithMathJax =
            e.combineDefaults =
            e.combineConfig =
            e.isObject =
              void 0);
        var o = r(282);
        function a(t) {
          return "object" == typeof t && null !== t;
        }
        function i(t, e) {
          var r, o;
          try {
            for (
              var u = n(Object.keys(e)), c = u.next();
              !c.done;
              c = u.next()
            ) {
              var l = c.value;
              "__esModule" !== l &&
                (!a(t[l]) || !a(e[l]) || e[l] instanceof Promise
                  ? null !== e[l] && void 0 !== e[l] && (t[l] = e[l])
                  : i(t[l], e[l]));
            }
          } catch (t) {
            r = { error: t };
          } finally {
            try {
              c && !c.done && (o = u.return) && o.call(u);
            } finally {
              if (r) throw r.error;
            }
          }
          return t;
        }
        (e.isObject = a),
          (e.combineConfig = i),
          (e.combineDefaults = function t(e, r, o) {
            var i, u;
            e[r] || (e[r] = {}), (e = e[r]);
            try {
              for (
                var c = n(Object.keys(o)), l = c.next();
                !l.done;
                l = c.next()
              ) {
                var s = l.value;
                a(e[s]) && a(o[s])
                  ? t(e, s, o[s])
                  : null == e[s] && null != o[s] && (e[s] = o[s]);
              }
            } catch (t) {
              i = { error: t };
            } finally {
              try {
                l && !l.done && (u = c.return) && u.call(c);
              } finally {
                if (i) throw i.error;
              }
            }
            return e;
          }),
          (e.combineWithMathJax = function (t) {
            return i(e.MathJax, t);
          }),
          void 0 === r.g.MathJax && (r.g.MathJax = {}),
          r.g.MathJax.version ||
            (r.g.MathJax = { version: o.VERSION, _: {}, config: r.g.MathJax }),
          (e.MathJax = r.g.MathJax);
      },
      235: function (t, e, r) {
        var n,
          o,
          a =
            (this && this.__values) ||
            function (t) {
              var e = "function" == typeof Symbol && Symbol.iterator,
                r = e && t[e],
                n = 0;
              if (r) return r.call(t);
              if (t && "number" == typeof t.length)
                return {
                  next: function () {
                    return (
                      t && n >= t.length && (t = void 0),
                      { value: t && t[n++], done: !t }
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
          (e.CONFIG =
            e.MathJax =
            e.Loader =
            e.PathFilters =
            e.PackageError =
            e.Package =
              void 0);
        var i = r(515),
          u = r(265),
          c = r(265);
        Object.defineProperty(e, "Package", {
          enumerable: !0,
          get: function () {
            return c.Package;
          },
        }),
          Object.defineProperty(e, "PackageError", {
            enumerable: !0,
            get: function () {
              return c.PackageError;
            },
          });
        var l,
          s = r(525);
        if (
          ((e.PathFilters = {
            source: function (t) {
              return (
                e.CONFIG.source.hasOwnProperty(t.name) &&
                  (t.name = e.CONFIG.source[t.name]),
                !0
              );
            },
            normalize: function (t) {
              var e = t.name;
              return (
                e.match(/^(?:[a-z]+:\/)?\/|[a-z]:\\|\[/i) ||
                  (t.name = "[mathjax]/" + e.replace(/^\.\//, "")),
                t.addExtension && !e.match(/\.[^\/]+$/) && (t.name += ".js"),
                !0
              );
            },
            prefix: function (t) {
              for (
                var r;
                (r = t.name.match(/^\[([^\]]*)\]/)) &&
                e.CONFIG.paths.hasOwnProperty(r[1]);

              )
                t.name = e.CONFIG.paths[r[1]] + t.name.substr(r[0].length);
              return !0;
            },
          }),
          (function (t) {
            var r = i.MathJax.version;
            (t.versions = new Map()),
              (t.ready = function () {
                for (var t, e, r = [], n = 0; n < arguments.length; n++)
                  r[n] = arguments[n];
                0 === r.length && (r = Array.from(u.Package.packages.keys()));
                var o = [];
                try {
                  for (var i = a(r), c = i.next(); !c.done; c = i.next()) {
                    var l = c.value,
                      s = u.Package.packages.get(l) || new u.Package(l, !0);
                    o.push(s.promise);
                  }
                } catch (e) {
                  t = { error: e };
                } finally {
                  try {
                    c && !c.done && (e = i.return) && e.call(i);
                  } finally {
                    if (t) throw t.error;
                  }
                }
                return Promise.all(o);
              }),
              (t.load = function () {
                for (var r, n, o = [], i = 0; i < arguments.length; i++)
                  o[i] = arguments[i];
                if (0 === o.length) return Promise.resolve();
                var c = [],
                  l = function (r) {
                    var n = u.Package.packages.get(r);
                    n || (n = new u.Package(r)).provides(e.CONFIG.provides[r]),
                      n.checkNoLoad(),
                      c.push(
                        n.promise.then(function () {
                          e.CONFIG.versionWarnings &&
                            n.isLoaded &&
                            !t.versions.has(u.Package.resolvePath(r)) &&
                            console.warn(
                              "No version information available for component ".concat(
                                r,
                              ),
                            );
                        }),
                      );
                  };
                try {
                  for (var s = a(o), f = s.next(); !f.done; f = s.next()) {
                    var d = f.value;
                    l(d);
                  }
                } catch (t) {
                  r = { error: t };
                } finally {
                  try {
                    f && !f.done && (n = s.return) && n.call(s);
                  } finally {
                    if (r) throw r.error;
                  }
                }
                return u.Package.loadAll(), Promise.all(c);
              }),
              (t.preLoad = function () {
                for (var t, r, n = [], o = 0; o < arguments.length; o++)
                  n[o] = arguments[o];
                try {
                  for (var i = a(n), c = i.next(); !c.done; c = i.next()) {
                    var l = c.value,
                      s = u.Package.packages.get(l);
                    s ||
                      (s = new u.Package(l, !0)).provides(e.CONFIG.provides[l]),
                      s.loaded();
                  }
                } catch (e) {
                  t = { error: e };
                } finally {
                  try {
                    c && !c.done && (r = i.return) && r.call(i);
                  } finally {
                    if (t) throw t.error;
                  }
                }
              }),
              (t.defaultReady = function () {
                void 0 !== e.MathJax.startup &&
                  e.MathJax.config.startup.ready();
              }),
              (t.getRoot = function () {
                var t = "//../../es5";
                if ("undefined" != typeof document) {
                  var e =
                    document.currentScript ||
                    document.getElementById("MathJax-script");
                  e && (t = e.src.replace(/\/[^\/]*$/, ""));
                }
                return t;
              }),
              (t.checkVersion = function (n, o, a) {
                return (
                  t.versions.set(u.Package.resolvePath(n), r),
                  !(!e.CONFIG.versionWarnings || o === r) &&
                    (console.warn(
                      "Component "
                        .concat(n, " uses ")
                        .concat(o, " of MathJax; version in use is ")
                        .concat(r),
                    ),
                    !0)
                );
              }),
              (t.pathFilters = new s.FunctionList()),
              t.pathFilters.add(e.PathFilters.source, 0),
              t.pathFilters.add(e.PathFilters.normalize, 10),
              t.pathFilters.add(e.PathFilters.prefix, 20);
          })((l = e.Loader || (e.Loader = {}))),
          (e.MathJax = i.MathJax),
          void 0 === e.MathJax.loader)
        ) {
          (0, i.combineDefaults)(e.MathJax.config, "loader", {
            paths: { mathjax: l.getRoot() },
            source: {},
            dependencies: {},
            provides: {},
            load: [],
            ready: l.defaultReady.bind(l),
            failed: function (t) {
              return console.log(
                "MathJax(".concat(t.package || "?", "): ").concat(t.message),
              );
            },
            require: null,
            pathFilters: [],
            versionWarnings: !0,
          }),
            (0, i.combineWithMathJax)({ loader: l });
          try {
            for (
              var f = a(e.MathJax.config.loader.pathFilters), d = f.next();
              !d.done;
              d = f.next()
            ) {
              var p = d.value;
              Array.isArray(p)
                ? l.pathFilters.add(p[0], p[1])
                : l.pathFilters.add(p);
            }
          } catch (t) {
            n = { error: t };
          } finally {
            try {
              d && !d.done && (o = f.return) && o.call(f);
            } finally {
              if (n) throw n.error;
            }
          }
        }
        e.CONFIG = e.MathJax.config.loader;
      },
      265: function (t, e, r) {
        var n,
          o =
            (this && this.__extends) ||
            ((n = function (t, e) {
              return (
                (n =
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
                n(t, e)
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
              n(t, e),
                (t.prototype =
                  null === e
                    ? Object.create(e)
                    : ((r.prototype = e.prototype), new r()));
            }),
          a =
            (this && this.__values) ||
            function (t) {
              var e = "function" == typeof Symbol && Symbol.iterator,
                r = e && t[e],
                n = 0;
              if (r) return r.call(t);
              if (t && "number" == typeof t.length)
                return {
                  next: function () {
                    return (
                      t && n >= t.length && (t = void 0),
                      { value: t && t[n++], done: !t }
                    );
                  },
                };
              throw new TypeError(
                e
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined.",
              );
            },
          i =
            (this && this.__read) ||
            function (t, e) {
              var r = "function" == typeof Symbol && t[Symbol.iterator];
              if (!r) return t;
              var n,
                o,
                a = r.call(t),
                i = [];
              try {
                for (; (void 0 === e || e-- > 0) && !(n = a.next()).done; )
                  i.push(n.value);
              } catch (t) {
                o = { error: t };
              } finally {
                try {
                  n && !n.done && (r = a.return) && r.call(a);
                } finally {
                  if (o) throw o.error;
                }
              }
              return i;
            },
          u =
            (this && this.__spreadArray) ||
            function (t, e, r) {
              if (r || 2 === arguments.length)
                for (var n, o = 0, a = e.length; o < a; o++)
                  (!n && o in e) ||
                    (n || (n = Array.prototype.slice.call(e, 0, o)),
                    (n[o] = e[o]));
              return t.concat(n || Array.prototype.slice.call(e));
            };
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.Package = e.PackageError = void 0);
        var c = r(235),
          l = (function (t) {
            function e(e, r) {
              var n = t.call(this, e) || this;
              return (n.package = r), n;
            }
            return o(e, t), e;
          })(Error);
        e.PackageError = l;
        var s = (function () {
          function t(e, r) {
            void 0 === r && (r = !1),
              (this.isLoaded = !1),
              (this.isLoading = !1),
              (this.hasFailed = !1),
              (this.dependents = []),
              (this.dependencies = []),
              (this.dependencyCount = 0),
              (this.provided = []),
              (this.name = e),
              (this.noLoad = r),
              t.packages.set(e, this),
              (this.promise = this.makePromise(this.makeDependencies()));
          }
          return (
            Object.defineProperty(t.prototype, "canLoad", {
              get: function () {
                return (
                  0 === this.dependencyCount &&
                  !this.noLoad &&
                  !this.isLoading &&
                  !this.hasFailed
                );
              },
              enumerable: !1,
              configurable: !0,
            }),
            (t.resolvePath = function (t, e) {
              void 0 === e && (e = !0);
              var r = { name: t, original: t, addExtension: e };
              return c.Loader.pathFilters.execute(r), r.name;
            }),
            (t.loadAll = function () {
              var t, e;
              try {
                for (
                  var r = a(this.packages.values()), n = r.next();
                  !n.done;
                  n = r.next()
                ) {
                  var o = n.value;
                  o.canLoad && o.load();
                }
              } catch (e) {
                t = { error: e };
              } finally {
                try {
                  n && !n.done && (e = r.return) && e.call(r);
                } finally {
                  if (t) throw t.error;
                }
              }
            }),
            (t.prototype.makeDependencies = function () {
              var e,
                r,
                n = [],
                o = t.packages,
                l = this.noLoad,
                s = this.name,
                f = [];
              c.CONFIG.dependencies.hasOwnProperty(s)
                ? f.push.apply(f, u([], i(c.CONFIG.dependencies[s]), !1))
                : "core" !== s && f.push("core");
              try {
                for (var d = a(f), p = d.next(); !p.done; p = d.next()) {
                  var h = p.value,
                    y = o.get(h) || new t(h, l);
                  this.dependencies.indexOf(y) < 0 &&
                    (y.addDependent(this, l),
                    this.dependencies.push(y),
                    y.isLoaded || (this.dependencyCount++, n.push(y.promise)));
                }
              } catch (t) {
                e = { error: t };
              } finally {
                try {
                  p && !p.done && (r = d.return) && r.call(d);
                } finally {
                  if (e) throw e.error;
                }
              }
              return n;
            }),
            (t.prototype.makePromise = function (t) {
              var e = this,
                r = new Promise(function (t, r) {
                  (e.resolve = t), (e.reject = r);
                }),
                n = c.CONFIG[this.name] || {};
              return (
                n.ready &&
                  (r = r.then(function (t) {
                    return n.ready(e.name);
                  })),
                t.length &&
                  (t.push(r),
                  (r = Promise.all(t).then(function (t) {
                    return t.join(", ");
                  }))),
                n.failed &&
                  r.catch(function (t) {
                    return n.failed(new l(t, e.name));
                  }),
                r
              );
            }),
            (t.prototype.load = function () {
              if (!this.isLoaded && !this.isLoading && !this.noLoad) {
                this.isLoading = !0;
                var e = t.resolvePath(this.name);
                c.CONFIG.require ? this.loadCustom(e) : this.loadScript(e);
              }
            }),
            (t.prototype.loadCustom = function (t) {
              var e = this;
              try {
                var r = c.CONFIG.require(t);
                r instanceof Promise
                  ? r
                      .then(function () {
                        return e.checkLoad();
                      })
                      .catch(function (r) {
                        return e.failed(
                          "Can't load \"" + t + '"\n' + r.message.trim(),
                        );
                      })
                  : this.checkLoad();
              } catch (t) {
                this.failed(t.message);
              }
            }),
            (t.prototype.loadScript = function (t) {
              var e = this,
                r = document.createElement("script");
              (r.src = t),
                (r.charset = "UTF-8"),
                (r.onload = function (t) {
                  return e.checkLoad();
                }),
                (r.onerror = function (r) {
                  return e.failed("Can't load \"" + t + '"');
                }),
                document.head.appendChild(r);
            }),
            (t.prototype.loaded = function () {
              var t, e, r, n;
              (this.isLoaded = !0), (this.isLoading = !1);
              try {
                for (
                  var o = a(this.dependents), i = o.next();
                  !i.done;
                  i = o.next()
                ) {
                  i.value.requirementSatisfied();
                }
              } catch (e) {
                t = { error: e };
              } finally {
                try {
                  i && !i.done && (e = o.return) && e.call(o);
                } finally {
                  if (t) throw t.error;
                }
              }
              try {
                for (
                  var u = a(this.provided), c = u.next();
                  !c.done;
                  c = u.next()
                ) {
                  c.value.loaded();
                }
              } catch (t) {
                r = { error: t };
              } finally {
                try {
                  c && !c.done && (n = u.return) && n.call(u);
                } finally {
                  if (r) throw r.error;
                }
              }
              this.resolve(this.name);
            }),
            (t.prototype.failed = function (t) {
              (this.hasFailed = !0),
                (this.isLoading = !1),
                this.reject(new l(t, this.name));
            }),
            (t.prototype.checkLoad = function () {
              var t = this;
              (
                (c.CONFIG[this.name] || {}).checkReady ||
                function () {
                  return Promise.resolve();
                }
              )()
                .then(function () {
                  return t.loaded();
                })
                .catch(function (e) {
                  return t.failed(e);
                });
            }),
            (t.prototype.requirementSatisfied = function () {
              this.dependencyCount &&
                (this.dependencyCount--, this.canLoad && this.load());
            }),
            (t.prototype.provides = function (e) {
              var r, n;
              void 0 === e && (e = []);
              try {
                for (var o = a(e), i = o.next(); !i.done; i = o.next()) {
                  var u = i.value,
                    l = t.packages.get(u);
                  l ||
                    (c.CONFIG.dependencies[u] ||
                      (c.CONFIG.dependencies[u] = []),
                    c.CONFIG.dependencies[u].push(u),
                    ((l = new t(u, !0)).isLoading = !0)),
                    this.provided.push(l);
                }
              } catch (t) {
                r = { error: t };
              } finally {
                try {
                  i && !i.done && (n = o.return) && n.call(o);
                } finally {
                  if (r) throw r.error;
                }
              }
            }),
            (t.prototype.addDependent = function (t, e) {
              this.dependents.push(t), e || this.checkNoLoad();
            }),
            (t.prototype.checkNoLoad = function () {
              var t, e;
              if (this.noLoad) {
                this.noLoad = !1;
                try {
                  for (
                    var r = a(this.dependencies), n = r.next();
                    !n.done;
                    n = r.next()
                  ) {
                    n.value.checkNoLoad();
                  }
                } catch (e) {
                  t = { error: e };
                } finally {
                  try {
                    n && !n.done && (e = r.return) && e.call(r);
                  } finally {
                    if (t) throw t.error;
                  }
                }
              }
            }),
            (t.packages = new Map()),
            t
          );
        })();
        e.Package = s;
      },
      388: function (t, e, r) {
        var n =
            (this && this.__assign) ||
            function () {
              return (
                (n =
                  Object.assign ||
                  function (t) {
                    for (var e, r = 1, n = arguments.length; r < n; r++)
                      for (var o in (e = arguments[r]))
                        Object.prototype.hasOwnProperty.call(e, o) &&
                          (t[o] = e[o]);
                    return t;
                  }),
                n.apply(this, arguments)
              );
            },
          o =
            (this && this.__values) ||
            function (t) {
              var e = "function" == typeof Symbol && Symbol.iterator,
                r = e && t[e],
                n = 0;
              if (r) return r.call(t);
              if (t && "number" == typeof t.length)
                return {
                  next: function () {
                    return (
                      t && n >= t.length && (t = void 0),
                      { value: t && t[n++], done: !t }
                    );
                  },
                };
              throw new TypeError(
                e
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined.",
              );
            },
          a =
            (this && this.__read) ||
            function (t, e) {
              var r = "function" == typeof Symbol && t[Symbol.iterator];
              if (!r) return t;
              var n,
                o,
                a = r.call(t),
                i = [];
              try {
                for (; (void 0 === e || e-- > 0) && !(n = a.next()).done; )
                  i.push(n.value);
              } catch (t) {
                o = { error: t };
              } finally {
                try {
                  n && !n.done && (r = a.return) && r.call(a);
                } finally {
                  if (o) throw o.error;
                }
              }
              return i;
            },
          i =
            (this && this.__spreadArray) ||
            function (t, e, r) {
              if (r || 2 === arguments.length)
                for (var n, o = 0, a = e.length; o < a; o++)
                  (!n && o in e) ||
                    (n || (n = Array.prototype.slice.call(e, 0, o)),
                    (n[o] = e[o]));
              return t.concat(n || Array.prototype.slice.call(e));
            };
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.CONFIG = e.MathJax = e.Startup = void 0);
        var u,
          c = r(515),
          l = r(666),
          s = r(233);
        !(function (t) {
          var u,
            c,
            s = new l.PrioritizedList();
          function d(e) {
            return u.visitTree(e, t.document);
          }
          function p() {
            (u =
              new e.MathJax._.core.MmlTree.SerializedMmlVisitor.SerializedMmlVisitor()),
              (c = e.MathJax._.mathjax.mathjax),
              (t.input = b()),
              (t.output = g()),
              (t.adaptor = O()),
              t.handler && c.handlers.unregister(t.handler),
              (t.handler = w()),
              t.handler && (c.handlers.register(t.handler), (t.document = P()));
          }
          function h() {
            var e, r;
            t.input && t.output && y();
            var n = t.output ? t.output.name.toLowerCase() : "";
            try {
              for (var a = o(t.input), i = a.next(); !i.done; i = a.next()) {
                var u = i.value,
                  c = u.name.toLowerCase();
                m(c, u), x(c, u), t.output && v(c, n, u);
              }
            } catch (t) {
              e = { error: t };
            } finally {
              try {
                i && !i.done && (r = a.return) && r.call(a);
              } finally {
                if (e) throw e.error;
              }
            }
          }
          function y() {
            (e.MathJax.typeset = function (e) {
              void 0 === e && (e = null),
                (t.document.options.elements = e),
                t.document.reset(),
                t.document.render();
            }),
              (e.MathJax.typesetPromise = function (e) {
                return (
                  void 0 === e && (e = null),
                  (t.document.options.elements = e),
                  t.document.reset(),
                  c.handleRetriesFor(function () {
                    t.document.render();
                  })
                );
              }),
              (e.MathJax.typesetClear = function (e) {
                void 0 === e && (e = null),
                  e ? t.document.clearMathItemsWithin(e) : t.document.clear();
              });
          }
          function v(r, n, o) {
            var a = r + "2" + n;
            (e.MathJax[a] = function (e, r) {
              return (
                void 0 === r && (r = {}),
                (r.format = o.name),
                t.document.convert(e, r)
              );
            }),
              (e.MathJax[a + "Promise"] = function (e, r) {
                return (
                  void 0 === r && (r = {}),
                  (r.format = o.name),
                  c.handleRetriesFor(function () {
                    return t.document.convert(e, r);
                  })
                );
              }),
              (e.MathJax[n + "Stylesheet"] = function () {
                return t.output.styleSheet(t.document);
              }),
              "getMetricsFor" in t.output &&
                (e.MathJax.getMetricsFor = function (e, r) {
                  return t.output.getMetricsFor(e, r);
                });
          }
          function m(r, n) {
            var o = e.MathJax._.core.MathItem.STATE;
            (e.MathJax[r + "2mml"] = function (e, r) {
              return (
                void 0 === r && (r = {}),
                (r.end = o.CONVERT),
                (r.format = n.name),
                d(t.document.convert(e, r))
              );
            }),
              (e.MathJax[r + "2mmlPromise"] = function (e, r) {
                return (
                  void 0 === r && (r = {}),
                  (r.end = o.CONVERT),
                  (r.format = n.name),
                  c.handleRetriesFor(function () {
                    return d(t.document.convert(e, r));
                  })
                );
              });
          }
          function x(t, r) {
            e.MathJax[t + "Reset"] = function () {
              for (var t = [], e = 0; e < arguments.length; e++)
                t[e] = arguments[e];
              return r.reset.apply(r, i([], a(t), !1));
            };
          }
          function b() {
            var r,
              n,
              a = [];
            try {
              for (
                var i = o(e.CONFIG.input), u = i.next();
                !u.done;
                u = i.next()
              ) {
                var c = u.value,
                  l = t.constructors[c];
                if (!l)
                  throw Error(
                    'Input Jax "' +
                      c +
                      '" is not defined (has it been loaded?)',
                  );
                a.push(new l(e.MathJax.config[c]));
              }
            } catch (t) {
              r = { error: t };
            } finally {
              try {
                u && !u.done && (n = i.return) && n.call(i);
              } finally {
                if (r) throw r.error;
              }
            }
            return a;
          }
          function g() {
            var r = e.CONFIG.output;
            if (!r) return null;
            var n = t.constructors[r];
            if (!n)
              throw Error(
                'Output Jax "' + r + '" is not defined (has it been loaded?)',
              );
            return new n(e.MathJax.config[r]);
          }
          function O() {
            var r = e.CONFIG.adaptor;
            if (!r || "none" === r) return null;
            var n = t.constructors[r];
            if (!n)
              throw Error(
                'DOMAdaptor "' + r + '" is not defined (has it been loaded?)',
              );
            return n(e.MathJax.config[r]);
          }
          function w() {
            var r,
              n,
              a = e.CONFIG.handler;
            if (!a || "none" === a || !t.adaptor) return null;
            var i = t.constructors[a];
            if (!i)
              throw Error(
                'Handler "' + a + '" is not defined (has it been loaded?)',
              );
            var u = new i(t.adaptor, 5);
            try {
              for (var c = o(s), l = c.next(); !l.done; l = c.next()) {
                u = l.value.item(u);
              }
            } catch (t) {
              r = { error: t };
            } finally {
              try {
                l && !l.done && (n = c.return) && n.call(c);
              } finally {
                if (r) throw r.error;
              }
            }
            return u;
          }
          function P(r) {
            return (
              void 0 === r && (r = null),
              c.document(
                r || e.CONFIG.document,
                n(n({}, e.MathJax.config.options), {
                  InputJax: t.input,
                  OutputJax: t.output,
                }),
              )
            );
          }
          (t.constructors = {}),
            (t.input = []),
            (t.output = null),
            (t.handler = null),
            (t.adaptor = null),
            (t.elements = null),
            (t.document = null),
            (t.promise = new Promise(function (e, r) {
              (t.promiseResolve = e), (t.promiseReject = r);
            })),
            (t.pagePromise = new Promise(function (t, e) {
              var n = r.g.document;
              if (
                n &&
                n.readyState &&
                "complete" !== n.readyState &&
                "interactive" !== n.readyState
              ) {
                var o = function () {
                  return t();
                };
                n.defaultView.addEventListener("load", o, !0),
                  n.defaultView.addEventListener("DOMContentLoaded", o, !0);
              } else t();
            })),
            (t.toMML = d),
            (t.registerConstructor = function (e, r) {
              t.constructors[e] = r;
            }),
            (t.useHandler = function (t, r) {
              void 0 === r && (r = !1),
                (e.CONFIG.handler && !r) || (e.CONFIG.handler = t);
            }),
            (t.useAdaptor = function (t, r) {
              void 0 === r && (r = !1),
                (e.CONFIG.adaptor && !r) || (e.CONFIG.adaptor = t);
            }),
            (t.useInput = function (t, r) {
              void 0 === r && (r = !1), (f && !r) || e.CONFIG.input.push(t);
            }),
            (t.useOutput = function (t, r) {
              void 0 === r && (r = !1),
                (e.CONFIG.output && !r) || (e.CONFIG.output = t);
            }),
            (t.extendHandler = function (t, e) {
              void 0 === e && (e = 10), s.add(t, e);
            }),
            (t.defaultReady = function () {
              p(),
                h(),
                t.pagePromise
                  .then(function () {
                    return e.CONFIG.pageReady();
                  })
                  .then(function () {
                    return t.promiseResolve();
                  })
                  .catch(function (e) {
                    return t.promiseReject(e);
                  });
            }),
            (t.defaultPageReady = function () {
              return e.CONFIG.typeset && e.MathJax.typesetPromise
                ? e.MathJax.typesetPromise(e.CONFIG.elements)
                : Promise.resolve();
            }),
            (t.getComponents = p),
            (t.makeMethods = h),
            (t.makeTypesetMethods = y),
            (t.makeOutputMethods = v),
            (t.makeMmlMethods = m),
            (t.makeResetMethod = x),
            (t.getInputJax = b),
            (t.getOutputJax = g),
            (t.getAdaptor = O),
            (t.getHandler = w),
            (t.getDocument = P);
        })((u = e.Startup || (e.Startup = {}))),
          (e.MathJax = c.MathJax),
          void 0 === e.MathJax._.startup &&
            ((0, c.combineDefaults)(e.MathJax.config, "startup", {
              input: [],
              output: "",
              handler: null,
              adaptor: null,
              document: "undefined" == typeof document ? "" : document,
              elements: null,
              typeset: !0,
              ready: u.defaultReady.bind(u),
              pageReady: u.defaultPageReady.bind(u),
            }),
            (0, c.combineWithMathJax)({ startup: u, options: {} }),
            e.MathJax.config.startup.invalidOption &&
              (s.OPTIONS.invalidOption =
                e.MathJax.config.startup.invalidOption),
            e.MathJax.config.startup.optionError &&
              (s.OPTIONS.optionError = e.MathJax.config.startup.optionError)),
          (e.CONFIG = e.MathJax.config.startup);
        var f = 0 !== e.CONFIG.input.length;
      },
      282: function (t, e) {
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.VERSION = void 0),
          (e.VERSION = "3.2.2");
      },
      525: function (t, e, r) {
        var n,
          o =
            (this && this.__extends) ||
            ((n = function (t, e) {
              return (
                (n =
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
                n(t, e)
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
              n(t, e),
                (t.prototype =
                  null === e
                    ? Object.create(e)
                    : ((r.prototype = e.prototype), new r()));
            }),
          a =
            (this && this.__values) ||
            function (t) {
              var e = "function" == typeof Symbol && Symbol.iterator,
                r = e && t[e],
                n = 0;
              if (r) return r.call(t);
              if (t && "number" == typeof t.length)
                return {
                  next: function () {
                    return (
                      t && n >= t.length && (t = void 0),
                      { value: t && t[n++], done: !t }
                    );
                  },
                };
              throw new TypeError(
                e
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined.",
              );
            },
          i =
            (this && this.__read) ||
            function (t, e) {
              var r = "function" == typeof Symbol && t[Symbol.iterator];
              if (!r) return t;
              var n,
                o,
                a = r.call(t),
                i = [];
              try {
                for (; (void 0 === e || e-- > 0) && !(n = a.next()).done; )
                  i.push(n.value);
              } catch (t) {
                o = { error: t };
              } finally {
                try {
                  n && !n.done && (r = a.return) && r.call(a);
                } finally {
                  if (o) throw o.error;
                }
              }
              return i;
            },
          u =
            (this && this.__spreadArray) ||
            function (t, e, r) {
              if (r || 2 === arguments.length)
                for (var n, o = 0, a = e.length; o < a; o++)
                  (!n && o in e) ||
                    (n || (n = Array.prototype.slice.call(e, 0, o)),
                    (n[o] = e[o]));
              return t.concat(n || Array.prototype.slice.call(e));
            };
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.FunctionList = void 0);
        var c = (function (t) {
          function e() {
            return (null !== t && t.apply(this, arguments)) || this;
          }
          return (
            o(e, t),
            (e.prototype.execute = function () {
              for (var t, e, r = [], n = 0; n < arguments.length; n++)
                r[n] = arguments[n];
              try {
                for (var o = a(this), c = o.next(); !c.done; c = o.next()) {
                  var l = c.value,
                    s = l.item.apply(l, u([], i(r), !1));
                  if (!1 === s) return !1;
                }
              } catch (e) {
                t = { error: e };
              } finally {
                try {
                  c && !c.done && (e = o.return) && e.call(o);
                } finally {
                  if (t) throw t.error;
                }
              }
              return !0;
            }),
            (e.prototype.asyncExecute = function () {
              for (var t = [], e = 0; e < arguments.length; e++)
                t[e] = arguments[e];
              var r = -1,
                n = this.items;
              return new Promise(function (e, o) {
                !(function a() {
                  for (var c; ++r < n.length; ) {
                    var l = (c = n[r]).item.apply(c, u([], i(t), !1));
                    if (l instanceof Promise)
                      return void l.then(a).catch(function (t) {
                        return o(t);
                      });
                    if (!1 === l) return void e(!1);
                  }
                  e(!0);
                })();
              });
            }),
            e
          );
        })(r(666).PrioritizedList);
        e.FunctionList = c;
      },
      233: function (t, e) {
        var r =
            (this && this.__values) ||
            function (t) {
              var e = "function" == typeof Symbol && Symbol.iterator,
                r = e && t[e],
                n = 0;
              if (r) return r.call(t);
              if (t && "number" == typeof t.length)
                return {
                  next: function () {
                    return (
                      t && n >= t.length && (t = void 0),
                      { value: t && t[n++], done: !t }
                    );
                  },
                };
              throw new TypeError(
                e
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined.",
              );
            },
          n =
            (this && this.__read) ||
            function (t, e) {
              var r = "function" == typeof Symbol && t[Symbol.iterator];
              if (!r) return t;
              var n,
                o,
                a = r.call(t),
                i = [];
              try {
                for (; (void 0 === e || e-- > 0) && !(n = a.next()).done; )
                  i.push(n.value);
              } catch (t) {
                o = { error: t };
              } finally {
                try {
                  n && !n.done && (r = a.return) && r.call(a);
                } finally {
                  if (o) throw o.error;
                }
              }
              return i;
            },
          o =
            (this && this.__spreadArray) ||
            function (t, e, r) {
              if (r || 2 === arguments.length)
                for (var n, o = 0, a = e.length; o < a; o++)
                  (!n && o in e) ||
                    (n || (n = Array.prototype.slice.call(e, 0, o)),
                    (n[o] = e[o]));
              return t.concat(n || Array.prototype.slice.call(e));
            };
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.lookup =
            e.separateOptions =
            e.selectOptionsFromKeys =
            e.selectOptions =
            e.userOptions =
            e.defaultOptions =
            e.insert =
            e.copy =
            e.keys =
            e.makeArray =
            e.expandable =
            e.Expandable =
            e.OPTIONS =
            e.REMOVE =
            e.APPEND =
            e.isObject =
              void 0);
        var a = {}.constructor;
        function i(t) {
          return (
            "object" == typeof t &&
            null !== t &&
            (t.constructor === a || t.constructor === u)
          );
        }
        (e.isObject = i),
          (e.APPEND = "[+]"),
          (e.REMOVE = "[-]"),
          (e.OPTIONS = {
            invalidOption: "warn",
            optionError: function (t, r) {
              if ("fatal" === e.OPTIONS.invalidOption) throw new Error(t);
              console.warn("MathJax: " + t);
            },
          });
        var u = function () {};
        function c(t) {
          return Object.assign(Object.create(u.prototype), t);
        }
        function l(t) {
          return t
            ? Object.keys(t).concat(Object.getOwnPropertySymbols(t))
            : [];
        }
        function s(t) {
          var e,
            n,
            o = {};
          try {
            for (var a = r(l(t)), d = a.next(); !d.done; d = a.next()) {
              var p = d.value,
                h = Object.getOwnPropertyDescriptor(t, p),
                y = h.value;
              Array.isArray(y)
                ? (h.value = f([], y, !1))
                : i(y) && (h.value = s(y)),
                h.enumerable && (o[p] = h);
            }
          } catch (t) {
            e = { error: t };
          } finally {
            try {
              d && !d.done && (n = a.return) && n.call(a);
            } finally {
              if (e) throw e.error;
            }
          }
          return Object.defineProperties(t.constructor === u ? c({}) : {}, o);
        }
        function f(t, a, c) {
          var d, p;
          void 0 === c && (c = !0);
          var h = function (r) {
            if (c && void 0 === t[r] && t.constructor !== u)
              return (
                "symbol" == typeof r && (r = r.toString()),
                e.OPTIONS.optionError(
                  'Invalid option "'.concat(r, '" (no default value).'),
                  r,
                ),
                "continue"
              );
            var d = a[r],
              p = t[r];
            if (
              !i(d) ||
              null === p ||
              ("object" != typeof p && "function" != typeof p)
            )
              Array.isArray(d)
                ? ((t[r] = []), f(t[r], d, !1))
                : i(d)
                ? (t[r] = s(d))
                : (t[r] = d);
            else {
              var h = l(d);
              Array.isArray(p) &&
              ((1 === h.length &&
                (h[0] === e.APPEND || h[0] === e.REMOVE) &&
                Array.isArray(d[h[0]])) ||
                (2 === h.length &&
                  h.sort().join(",") === e.APPEND + "," + e.REMOVE &&
                  Array.isArray(d[e.APPEND]) &&
                  Array.isArray(d[e.REMOVE])))
                ? (d[e.REMOVE] &&
                    (p = t[r] =
                      p.filter(function (t) {
                        return d[e.REMOVE].indexOf(t) < 0;
                      })),
                  d[e.APPEND] &&
                    (t[r] = o(o([], n(p), !1), n(d[e.APPEND]), !1)))
                : f(p, d, c);
            }
          };
          try {
            for (var y = r(l(a)), v = y.next(); !v.done; v = y.next()) {
              h(v.value);
            }
          } catch (t) {
            d = { error: t };
          } finally {
            try {
              v && !v.done && (p = y.return) && p.call(y);
            } finally {
              if (d) throw d.error;
            }
          }
          return t;
        }
        function d(t) {
          for (var e, n, o = [], a = 1; a < arguments.length; a++)
            o[a - 1] = arguments[a];
          var i = {};
          try {
            for (var u = r(o), c = u.next(); !c.done; c = u.next()) {
              var l = c.value;
              t.hasOwnProperty(l) && (i[l] = t[l]);
            }
          } catch (t) {
            e = { error: t };
          } finally {
            try {
              c && !c.done && (n = u.return) && n.call(u);
            } finally {
              if (e) throw e.error;
            }
          }
          return i;
        }
        (e.Expandable = u),
          (e.expandable = c),
          (e.makeArray = function (t) {
            return Array.isArray(t) ? t : [t];
          }),
          (e.keys = l),
          (e.copy = s),
          (e.insert = f),
          (e.defaultOptions = function (t) {
            for (var e = [], r = 1; r < arguments.length; r++)
              e[r - 1] = arguments[r];
            return (
              e.forEach(function (e) {
                return f(t, e, !1);
              }),
              t
            );
          }),
          (e.userOptions = function (t) {
            for (var e = [], r = 1; r < arguments.length; r++)
              e[r - 1] = arguments[r];
            return (
              e.forEach(function (e) {
                return f(t, e, !0);
              }),
              t
            );
          }),
          (e.selectOptions = d),
          (e.selectOptionsFromKeys = function (t, e) {
            return d.apply(void 0, o([t], n(Object.keys(e)), !1));
          }),
          (e.separateOptions = function (t) {
            for (var e, n, o, a, i = [], u = 1; u < arguments.length; u++)
              i[u - 1] = arguments[u];
            var c = [];
            try {
              for (var l = r(i), s = l.next(); !s.done; s = l.next()) {
                var f = s.value,
                  d = {},
                  p = {};
                try {
                  for (
                    var h = ((o = void 0), r(Object.keys(t || {}))),
                      y = h.next();
                    !y.done;
                    y = h.next()
                  ) {
                    var v = y.value;
                    (void 0 === f[v] ? p : d)[v] = t[v];
                  }
                } catch (t) {
                  o = { error: t };
                } finally {
                  try {
                    y && !y.done && (a = h.return) && a.call(h);
                  } finally {
                    if (o) throw o.error;
                  }
                }
                c.push(d), (t = p);
              }
            } catch (t) {
              e = { error: t };
            } finally {
              try {
                s && !s.done && (n = l.return) && n.call(l);
              } finally {
                if (e) throw e.error;
              }
            }
            return c.unshift(t), c;
          }),
          (e.lookup = function (t, e, r) {
            return void 0 === r && (r = null), e.hasOwnProperty(t) ? e[t] : r;
          });
      },
      666: function (t, e) {
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.PrioritizedList = void 0);
        var r = (function () {
          function t() {
            (this.items = []), (this.items = []);
          }
          return (
            (t.prototype[Symbol.iterator] = function () {
              var t = 0,
                e = this.items;
              return {
                next: function () {
                  return { value: e[t++], done: t > e.length };
                },
              };
            }),
            (t.prototype.add = function (e, r) {
              void 0 === r && (r = t.DEFAULTPRIORITY);
              var n = this.items.length;
              do {
                n--;
              } while (n >= 0 && r < this.items[n].priority);
              return this.items.splice(n + 1, 0, { item: e, priority: r }), e;
            }),
            (t.prototype.remove = function (t) {
              var e = this.items.length;
              do {
                e--;
              } while (e >= 0 && this.items[e].item !== t);
              e >= 0 && this.items.splice(e, 1);
            }),
            (t.DEFAULTPRIORITY = 5),
            t
          );
        })();
        e.PrioritizedList = r;
      },
    },
    e = {};
  function r(n) {
    var o = e[n];
    if (void 0 !== o) return o.exports;
    var a = (e[n] = { exports: {} });
    return t[n].call(a.exports, a, a.exports, r), a.exports;
  }
  (r.g = (function () {
    if ("object" == typeof globalThis) return globalThis;
    try {
      return this || new Function("return this")();
    } catch (t) {
      if ("object" == typeof window) return window;
    }
  })()),
    (function () {
      var t = r(515),
        e = r(282),
        n = r(235),
        o = r(265),
        a = r(388);
      function i(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var r = 0, n = new Array(e); r < e; r++) n[r] = t[r];
        return n;
      }
      MathJax.loader &&
        MathJax.loader.checkVersion("startup", e.VERSION, "startup"),
        (0, t.combineWithMathJax)({
          _: { components: { loader: n, package: o, startup: a } },
        });
      var u,
        c = {
          "a11y/semantic-enrich": ["input/mml", "a11y/sre"],
          "a11y/complexity": ["a11y/semantic-enrich"],
          "a11y/explorer": ["a11y/semantic-enrich", "ui/menu"],
          "[mml]/mml3": ["input/mml"],
          "[tex]/all-packages": ["input/tex-base"],
          "[tex]/action": ["input/tex-base", "[tex]/newcommand"],
          "[tex]/autoload": ["input/tex-base", "[tex]/require"],
          "[tex]/ams": ["input/tex-base"],
          "[tex]/amscd": ["input/tex-base"],
          "[tex]/bbox": ["input/tex-base", "[tex]/ams", "[tex]/newcommand"],
          "[tex]/boldsymbol": ["input/tex-base"],
          "[tex]/braket": ["input/tex-base"],
          "[tex]/bussproofs": ["input/tex-base"],
          "[tex]/cancel": ["input/tex-base", "[tex]/enclose"],
          "[tex]/centernot": ["input/tex-base"],
          "[tex]/color": ["input/tex-base"],
          "[tex]/colorv2": ["input/tex-base"],
          "[tex]/colortbl": ["input/tex-base", "[tex]/color"],
          "[tex]/configmacros": ["input/tex-base", "[tex]/newcommand"],
          "[tex]/enclose": ["input/tex-base"],
          "[tex]/extpfeil": ["input/tex-base", "[tex]/newcommand", "[tex]/ams"],
          "[tex]/html": ["input/tex-base"],
          "[tex]/mathtools": [
            "input/tex-base",
            "[tex]/newcommand",
            "[tex]/ams",
          ],
          "[tex]/mhchem": ["input/tex-base", "[tex]/ams"],
          "[tex]/newcommand": ["input/tex-base"],
          "[tex]/noerrors": ["input/tex-base"],
          "[tex]/noundefined": ["input/tex-base"],
          "[tex]/physics": ["input/tex-base"],
          "[tex]/require": ["input/tex-base"],
          "[tex]/setoptions": ["input/tex-base"],
          "[tex]/tagformat": ["input/tex-base"],
          "[tex]/textcomp": ["input/tex-base", "[tex]/textmacros"],
          "[tex]/textmacros": ["input/tex-base"],
          "[tex]/unicode": ["input/tex-base"],
          "[tex]/verb": ["input/tex-base"],
          "[tex]/cases": ["[tex]/empheq"],
          "[tex]/empheq": ["input/tex-base", "[tex]/ams"],
        },
        l = Array.from(Object.keys(c)).filter(function (t) {
          return (
            "[tex]" === t.substr(0, 5) &&
            "[tex]/autoload" !== t &&
            "[tex]/colorv2" !== t &&
            "[tex]/all-packages" !== t
          );
        }),
        s = {
          startup: ["loader"],
          "input/tex": [
            "input/tex-base",
            "[tex]/ams",
            "[tex]/newcommand",
            "[tex]/noundefined",
            "[tex]/require",
            "[tex]/autoload",
            "[tex]/configmacros",
          ],
          "input/tex-full": ["input/tex-base", "[tex]/all-packages"].concat(
            ((u = l),
            (function (t) {
              if (Array.isArray(t)) return i(t);
            })(u) ||
              (function (t) {
                if (
                  ("undefined" != typeof Symbol &&
                    null != t[Symbol.iterator]) ||
                  null != t["@@iterator"]
                )
                  return Array.from(t);
              })(u) ||
              (function (t, e) {
                if (t) {
                  if ("string" == typeof t) return i(t, e);
                  var r = Object.prototype.toString.call(t).slice(8, -1);
                  return (
                    "Object" === r && t.constructor && (r = t.constructor.name),
                    "Map" === r || "Set" === r
                      ? Array.from(t)
                      : "Arguments" === r ||
                        /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
                      ? i(t, e)
                      : void 0
                  );
                }
              })(u) ||
              (function () {
                throw new TypeError(
                  "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                );
              })()),
          ),
          "[tex]/all-packages": l,
        };
      function f(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var r = 0, n = new Array(e); r < e; r++) n[r] = t[r];
        return n;
      }
      (0, t.combineDefaults)(MathJax.config.loader, "dependencies", c),
        (0, t.combineDefaults)(MathJax.config.loader, "paths", {
          tex: "[mathjax]/input/tex/extensions",
          mml: "[mathjax]/input/mml/extensions",
          sre: "[mathjax]/sre/mathmaps",
        }),
        (0, t.combineDefaults)(MathJax.config.loader, "provides", s),
        (0, t.combineDefaults)(MathJax.config.loader, "source", {
          "[tex]/amsCd": "[tex]/amscd",
          "[tex]/colorV2": "[tex]/colorv2",
          "[tex]/configMacros": "[tex]/configmacros",
          "[tex]/tagFormat": "[tex]/tagformat",
        }),
        n.Loader.preLoad("loader"),
        n.Loader.load
          .apply(
            n.Loader,
            (function (t) {
              return (
                (function (t) {
                  if (Array.isArray(t)) return f(t);
                })(t) ||
                (function (t) {
                  if (
                    ("undefined" != typeof Symbol &&
                      null != t[Symbol.iterator]) ||
                    null != t["@@iterator"]
                  )
                    return Array.from(t);
                })(t) ||
                (function (t, e) {
                  if (!t) return;
                  if ("string" == typeof t) return f(t, e);
                  var r = Object.prototype.toString.call(t).slice(8, -1);
                  "Object" === r && t.constructor && (r = t.constructor.name);
                  if ("Map" === r || "Set" === r) return Array.from(t);
                  if (
                    "Arguments" === r ||
                    /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
                  )
                    return f(t, e);
                })(t) ||
                (function () {
                  throw new TypeError(
                    "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                  );
                })()
              );
            })(n.CONFIG.load),
          )
          .then(function () {
            return n.CONFIG.ready();
          })
          .catch(function (t) {
            return n.CONFIG.failed(t);
          });
    })();
})();
