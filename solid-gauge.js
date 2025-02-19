/*
 Highcharts JS v7.2.1 (2019-10-31)

 Solid angular gauge module

 (c) 2010-2019 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(b) {
  "object" === typeof module && module.exports
    ? ((b["default"] = b), (module.exports = b))
    : "function" === typeof define && define.amd
    ? define("highcharts/modules/solid-gauge", [
        "highcharts",
        "highcharts/highcharts-more"
      ], function(k) {
        b(k);
        b.Highcharts = k;
        return b;
      })
    : b("undefined" !== typeof Highcharts ? Highcharts : void 0);
})(function(b) {
  function k(b, f, k, m) {
    b.hasOwnProperty(f) || (b[f] = m.apply(null, k));
  }
  b = b ? b._modules : {};
  k(
    b,
    "modules/solid-gauge.src.js",
    [b["parts/Globals.js"], b["parts/Utilities.js"]],
    function(b, f) {
      var k = f.extend,
        m = f.isNumber,
        u = f.pick,
        v = f.pInt;
      f = b.wrap;
      f(b.Renderer.prototype.symbols, "arc", function(a, b, e, d, g, c) {
        a = a(b, e, d, g, c);
        c.rounded &&
          ((d = ((c.r || d) - c.innerR) / 2),
          (c = ["A", d, d, 0, 1, 1, a[12], a[13]]),
          a.splice.apply(
            a,
            [a.length - 1, 0].concat(["A", d, d, 0, 1, 1, a[1], a[2]])
          ),
          a.splice.apply(a, [11, 3].concat(c)));
        return a;
      });
      var w = {
        initDataClasses: function(a) {
          var t = this.chart,
            e,
            d = 0,
            g = this.options;
          this.dataClasses = e = [];
          a.dataClasses.forEach(function(c, h) {
            c = b.merge(c);
            e.push(c);
            c.color ||
              ("category" === g.dataClassColor
                ? ((h = t.options.colors),
                  (c.color = h[d++]),
                  d === h.length && (d = 0))
                : (c.color = b
                    .color(g.minColor)
                    .tweenTo(
                      b.color(g.maxColor),
                      h / (a.dataClasses.length - 1)
                    )));
          });
        },
        initStops: function(a) {
          this.stops = a.stops || [
            [0, this.options.minColor],
            [1, this.options.maxColor]
          ];
          this.stops.forEach(function(a) {
            a.color = b.color(a[1]);
          });
        },
        toColor: function(a, b) {
          var e = this.stops,
            d = this.dataClasses,
            g;
          if (d)
            for (g = d.length; g--; ) {
              var c = d[g];
              var h = c.from;
              e = c.to;
              if ((void 0 === h || a >= h) && (void 0 === e || a <= e)) {
                var t = c.color;
                b && (b.dataClass = g);
                break;
              }
            }
          else {
            this.isLog && (a = this.val2lin(a));
            a = 1 - (this.max - a) / (this.max - this.min);
            for (g = e.length; g-- && !(a > e[g][0]); );
            h = e[g] || e[g + 1];
            e = e[g + 1] || h;
            a = 1 - (e[0] - a) / (e[0] - h[0] || 1);
            t = h.color.tweenTo(e.color, a);
          }
          return t;
        }
      };
      b.seriesType(
        "solidgauge",
        "gauge",
        { colorByPoint: !0, dataLabels: { y: 0 } },
        {
          drawLegendSymbol: b.LegendSymbolMixin.drawRectangle,
          translate: function() {
            var a = this.yAxis;
            k(a, w);
            !a.dataClasses &&
              a.options.dataClasses &&
              a.initDataClasses(a.options);
            a.initStops(a.options);
            b.seriesTypes.gauge.prototype.translate.call(this);
          },
          drawPoints: function() {
            var a = this,
              b = a.yAxis,
              e = b.center,
              d = a.options,
              g = a.chart.renderer,
              c = d.overshoot,
              h = m(c) ? (c / 180) * Math.PI : 0,
              f;
            m(d.threshold) &&
              (f =
                b.startAngleRad +
                b.translate(d.threshold, null, null, null, !0));
            this.thresholdAngleRad = u(f, b.startAngleRad);
            a.points.forEach(function(c) {
              if (!c.isNull) {
                var f = c.graphic,
                  l = b.startAngleRad + b.translate(c.y, null, null, null, !0),
                  r = (v(u(c.options.radius, d.radius, 100)) * e[2]) / 200,
                  n =
                    (v(u(c.options.innerRadius, d.innerRadius, 60)) * e[2]) /
                    200,
                  p = b.toColor(c.y, c),
                  q = Math.min(b.startAngleRad, b.endAngleRad),
                  m = Math.max(b.startAngleRad, b.endAngleRad);
                "none" === p && (p = c.color || a.color || "none");
                "none" !== p && (c.color = p);
                l = Math.max(q - h, Math.min(m + h, l));
                !1 === d.wrap && (l = Math.max(q, Math.min(m, l)));
                q = Math.min(l, a.thresholdAngleRad);
                l = Math.max(l, a.thresholdAngleRad);
                l - q > 2 * Math.PI && (l = q + 2 * Math.PI);
                c.shapeArgs = n = {
                  x: e[0],
                  y: e[1],
                  r: r,
                  innerR: n,
                  start: q,
                  end: l,
                  rounded: d.rounded
                };
                c.startR = r;
                f
                  ? ((r = n.d), f.animate(k({ fill: p }, n)), r && (n.d = r))
                  : ((c.graphic = f = g
                      .arc(n)
                      .attr({ fill: p, "sweep-flag": 0 })
                      .add(a.group)),
                    a.chart.styledMode ||
                      ("square" !== d.linecap &&
                        f.attr({
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round"
                        }),
                      f.attr({
                        stroke: d.borderColor || "none",
                        "stroke-width": d.borderWidth || 0
                      })));
                f && f.addClass(c.getClassName(), !0);
              }
            });
          },
          animate: function(a) {
            a ||
              ((this.startAngleRad = this.thresholdAngleRad),
              b.seriesTypes.pie.prototype.animate.call(this, a));
          }
        }
      );
      ("");
    }
  );
  k(b, "masters/modules/solid-gauge.src.js", [], function() {});
});
//# sourceMappingURL=solid-gauge.js.map
