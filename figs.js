/* ══════════════════════════════════════════════════════════════
   전개도 마스터 — 그림 모음 (그림04 · 2026-09-30)
   공용 그리기 도우미 links/fig.js 를 쓴다. index.html(펼쳐보기) 과 lesson.js(수업 슬라이드) 가 함께 부른다.

   한 칸의 모양
     키: { cap:'캡션 한 줄', cards:['입체 키'…], draw:function(){ … } }
       cards — index.html 의 SOLIDS 키(cube · box · tri · hex · cyl · pyr · cone · oblq).
               펼쳐보기에서 그 입체를 고르면 설명 아래에 이 그림이 뜬다.

   ▸ 근거 — 기초제도(씨마스) 교과서 「Ⅲ-5. 전개도 그리기」 128~133쪽
     · 평행선법: 원기둥 — 평면도 원둘레 12등분 · L = πD 를 12등분 (130쪽)
                 경사로 잘린 원기둥 — 정면도의 높이를 수평으로 옮겨 곡선으로 (131쪽)
     · 방사선법: 원뿔 — 빗변(모선)을 반지름으로 원호 · 12등분 / 각뿔 — 원호를 밑변 길이로 4등분 (132쪽)
     · 삼각형법: 삼각형으로 분할 · 직각삼각형(높이 × 평면도 길이)으로 실제 길이 (133쪽)
     교과서 그림은 순서 확인용으로만 봤고 모양은 새로 짰다.
     원뿔 부채꼴의 중심각 식(360° × r / ℓ)과 예(r 30 · ℓ 90 → 120°)는 이 도구의 설명·슬라이드 그대로다.
     편심 원뿔 그림은 도구의 obliqueConeNet(12, 0.81, 2.16, 0.60) 과 같은 비율로 계산해 그렸다.
   ══════════════════════════════════════════════════════════════ */
var FIGS = (function () {
  var F = window.FIG;
  if (!F) return {};
  var C = F.C, t = F.t, line = F.line, box = F.box, arrow = F.arrow;
  var D = Math.PI / 180;

  function r1(v) { return Math.round(v * 10) / 10; }
  function ell(cx, cy, rx, ry, o) {
    o = o || {};
    return '<ellipse cx="' + r1(cx) + '" cy="' + r1(cy) + '" rx="' + r1(rx) + '" ry="' + r1(ry) + '" fill="' + (o.fill || 'none') +
      '" stroke="' + (o.c || C.ink) + '" stroke-width="' + (o.w || 2) + '"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>';
  }
  /* 타원의 아래(앞) 반쪽 · 위(뒤) 반쪽 */
  function halfEll(cx, cy, rx, ry, front, o) {
    o = o || {};
    return F.path('M' + r1(cx - rx) + ',' + r1(cy) + ' A' + r1(rx) + ',' + r1(ry) + ' 0 0 ' + (front ? 0 : 1) + ' ' + r1(cx + rx) + ',' + r1(cy),
      { c: o.c || C.ink, w: o.w || 2, dash: o.dash });
  }
  function dot(x, y, c, r) { return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + (r || 3) + '" fill="' + (c || C.ink) + '"/>'; }
  function arcPath(cx, cy, R, a0, a1) {   /* 화면 각도(아래로 +), a0 → a1 */
    var x0 = cx + R * Math.cos(a0 * D), y0 = cy + R * Math.sin(a0 * D), x1 = cx + R * Math.cos(a1 * D), y1 = cy + R * Math.sin(a1 * D);
    return 'M' + r1(x0) + ',' + r1(y0) + ' A' + r1(R) + ',' + r1(R) + ' 0 ' + (Math.abs(a1 - a0) > 180 ? 1 : 0) + ' 1 ' + r1(x1) + ',' + r1(y1);
  }
  function sep(x, y1, y2) { return line(x, y1, x, y2, { c: C.grayM, w: 1.2, dash: '6 5' }); }

  /* 편심 원뿔 — index.html 의 obliqueConeNet(12, 0.81, 2.16, 0.60) 과 같은 비율 (s = 화면 배율) */
  function oblCone(s) {
    var n = 12, r = 0.81 * s, h = 2.16 * s, ecc = 0.60 * s;
    var V = function (i) { var a = 2 * Math.PI * (i % n) / n; return [r * Math.cos(a), r * Math.sin(a)]; };
    var plan = function (i) { var v = V(i); return Math.hypot(v[0] - ecc, v[1]); };   /* 평면도에서 잰 길이 */
    var L = function (i) { return Math.hypot(plan(i), h); };                          /* 모선의 실제 길이 */
    return { n: n, r: r, h: h, ecc: ecc, V: V, plan: plan, L: L, c: 2 * r * Math.sin(Math.PI / n) };
  }

  return {

  /* ─────────── 고르는 법 ─────────── */
  moseon: { cards: ['cube', 'box', 'tri', 'hex', 'cyl', 'pyr', 'cone', 'oblq'],
    cap: '전개도법은 모선을 보고 고른다 — 나란하면 평행선법, 한 꼭짓점에 모이면 방사선법, 길이가 제각각이면 삼각형법',
    draw: function () {
      var s = sep(160, 20, 200) + sep(320, 20, 200), a, x, i;
      /* ① 기둥 */
      s += halfEll(80, 176, 44, 11, false, { dash: '5 4', w: 1.4 }) + F.path('M36,60 V176 M124,60 V176', { w: 2.2 });
      for (i = 1; i < 6; i++) { a = i * 30; x = 80 - 44 * Math.cos(a * D);
        s += line(x, 60 + 11 * Math.sin(a * D), x, 176 + 11 * Math.sin(a * D), { c: C.blue, w: 1.6 }); }
      s += ell(80, 60, 44, 11, { fill: C.paper }) + halfEll(80, 176, 44, 11, true);
      /* ② 뿔 */
      s += halfEll(240, 176, 46, 11, false, { dash: '5 4', w: 1.4 }) + F.path('M194,176 L240,36 L286,176', { w: 2.2 });
      for (i = 1; i < 6; i++) { a = i * 30;
        s += line(240, 36, 240 - 46 * Math.cos(a * D), 176 + 11 * Math.sin(a * D), { c: C.orange, w: 1.6 }); }
      s += halfEll(240, 176, 46, 11, true) + dot(240, 36, C.orange, 4.5);
      /* ③ 편심 원뿔 — 꼭짓점이 한쪽으로 치우쳐 모선 길이가 자리마다 다르다 */
      var ax = 428, ay = 40;
      s += halfEll(392, 176, 46, 11, false, { dash: '5 4', w: 1.4 }) + F.path('M346,176 L' + ax + ',' + ay + ' L438,176', { w: 2.2 });
      for (i = 1; i < 6; i++) { a = i * 30;
        s += line(ax, ay, 392 - 46 * Math.cos(a * D), 176 + 11 * Math.sin(a * D), { c: C.green, w: i === 5 || i === 1 ? 2.6 : 1.4 }); }
      s += halfEll(392, 176, 46, 11, true) + dot(ax, ay, C.green, 4.5);
      var lab = [[80, '기둥', '모선이 나란하다', '→ 평행선법', C.blue], [240, '뿔', '모선이 한 점에 모인다', '→ 방사선법', C.orange],
        [400, '편심 원뿔', '모선 길이가 제각각', '→ 삼각형법', C.green]];
      lab.forEach(function (q) {
        s += t(q[0], 214, q[1], { a: 'm', b: 1 }) + t(q[0], 236, q[2], { a: 'm', size: 13, c: C.sub, ans: q[0] === 80 }) +
          t(q[0], 258, q[3], { a: 'm', b: 1, c: q[4], ans: 1 });
      });
      return F.svg(480, 276, s);
    } },

  /* ─────────── 평행선법 ─────────── */
  prismStrip: { cards: ['cube', 'box', 'tri', 'hex'],
    cap: '각기둥 — 옆면을 한 줄로 펴면 가로는 밑면 둘레(① + ② + ③ + ④), 세로는 높이 h',
    draw: function () {
      var s = '', dx = 24.7, dy = -24.7;
      /* 사각기둥 (정면 70 × 120, 깊이 45°) — 숨은 모서리는 파선 */
      s += line(30 + dx, 200 + dy, 100 + dx, 200 + dy, { w: 1.4, dash: 'hidden' }) + line(30 + dx, 200 + dy, 30, 200, { w: 1.4, dash: 'hidden' }) +
        line(30 + dx, 200 + dy, 30 + dx, 80 + dy, { w: 1.4, dash: 'hidden' });
      s += F.poly([[30, 80], [100, 80], [100 + dx, 80 + dy], [30 + dx, 80 + dy]], { close: 1, fill: '#f3f4f6', w: 2.2 }) +
        F.poly([[100, 80], [100 + dx, 80 + dy], [100 + dx, 200 + dy], [100, 200]], { close: 1, fill: '#d1d5db', w: 2.2 }) +
        box(30, 80, 70, 120, { fill: C.paper, r: 0, w: 2.2 });
      s += t(65, 216, '①', { a: 'm', b: 1, c: C.blue }) + t(124, 196, '②', { a: 'm', b: 1, c: C.blue }) +
        t(84, 166, '③', { a: 'm', b: 1, c: C.sub, size: 14 }) + t(30, 176, '④', { a: 'm', b: 1, c: C.sub, size: 14 });
      s += arrow(140, 140, 168, 140, { c: C.sub, w: 1.8 }) + t(154, 124, '펴기', { a: 'm', size: 13, c: C.sub });
      /* 옆면 전개 */
      for (var i = 0; i < 4; i++) {
        s += box(176 + 70 * i, 80, 70, 120, { fill: i % 2 ? C.blueL : C.paper, c: C.ink, r: 0, w: 2 }) +
          t(211 + 70 * i, 140, '①②③④'.charAt(i), { a: 'm', b: 1, c: C.blue, size: 18 });
      }
      s += F.dim(176, 200, 456, 200, '가로 = 밑면 둘레', { off: 22, side: -1 });
      s += t(316, 60, '세로 = 높이 h', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 250, s);
    } },

  cylDraw: { cards: ['cyl'],
    cap: '원기둥 — 평면도 원둘레를 12등분하고, 원둘레 길이 L = πD 를 12등분해 세로선을 세운다 (평행선법)',
    draw: function () {
      var cx = 95, cy = 66, R = 45, L = Math.PI * 2 * R, x0 = 180, top = 156, bot = 246, s = '', i, a, px;
      s += t(cx, 14, '평면도', { a: 'm', size: 13, c: C.sub }) + t(cx, bot + 18, '정면도', { a: 'm', size: 13, c: C.sub }) +
        t(x0 + L / 2, bot + 18, '전개도', { a: 'm', size: 13, c: C.sub });
      /* 평면도 — 12등분 */
      s += F.circle(cx, cy, R, { fill: C.paper, w: 2.2 }) + line(cx - R - 8, cy, cx + R + 8, cy, { c: C.sub, w: 1, dash: 'center' }) +
        line(cx, cy - R - 8, cx, cy + R + 8, { c: C.sub, w: 1, dash: 'center' });
      for (i = 0; i < 12; i++) { a = i * 30; s += dot(cx + R * Math.cos(a * D), cy + R * Math.sin(a * D), C.blue, 3.2); }
      s += t(cx + R + 12, cy + 12, '1', { size: 13, b: 1, c: C.blue });
      /* 정면도 — 등분점에서 내린 선 */
      for (i = 0; i <= 6; i++) { px = cx + R * Math.cos(i * 30 * D);
        s += line(px, cy + R * Math.sin(i * 30 * D) + 4, px, top, { c: C.blue, w: 1, dash: '3 3' }) + line(px, top, px, bot, { c: C.grayM, w: 1 }); }
      s += box(cx - R, top, 2 * R, bot - top, { fill: 'none', r: 0, w: 2.2 });
      s += F.dim(cx - R, 134, cx + R, 134, 'D');
      /* 전개도 — L = πD, 12등분 */
      s += box(x0, top, L, bot - top, { fill: C.blueL, c: C.ink, r: 0, w: 2.2 }).replace('fill="' + C.blueL + '"', 'fill="' + C.blueL + '" fill-opacity=".45"');
      for (i = 1; i < 12; i++) s += line(x0 + L * i / 12, top, x0 + L * i / 12, bot, { c: C.blue, w: 1 });
      s += line(cx + R, top, x0, top, { c: C.sub, w: 1, dash: '5 4' }) + line(cx + R, bot, x0, bot, { c: C.sub, w: 1, dash: '5 4' });
      s += t(x0 + 10, bot - 12, '1', { a: 'm', size: 13, b: 1, c: C.blue }) + t(x0 + L - 10, bot - 12, '1', { a: 'm', size: 13, b: 1, c: C.blue });
      s += F.dim(x0, top, x0 + L, top, 'L = πD  (원둘레)', { off: 22 });
      s += t(x0 + L / 2, 104, '12등분한 간격마다 세로선', { a: 'm', size: 13, c: C.blue, ans: 1 });
      return F.svg(480, 280, s);
    } },

  cutCyl: { cards: ['cyl'],
    cap: '경사로 잘린 원기둥 — 등분점마다 정면도의 높이를 수평으로 옮겨 찍고, 점들을 곡선으로 잇는다',
    draw: function () {
      var cx = 80, cy = 48, R = 34, L = Math.PI * 2 * R, x0 = 176, bot = 252, s = '', i, a, px;
      function yTop(x) { return 150 - (x - (cx - R)) * (44 / (2 * R)); }   /* 잘린 면: 왼쪽이 낮고 오른쪽이 높다 */
      s += t(cx, 10, '평면도', { a: 'm', size: 13, c: C.sub }) + t(cx, bot + 18, '정면도', { a: 'm', size: 13, c: C.sub }) +
        t(x0 + L / 2, bot + 18, '전개도', { a: 'm', size: 13, c: C.sub });
      s += F.circle(cx, cy, R, { fill: C.paper, w: 2 });
      for (i = 0; i < 12; i++) { a = i * 30; s += dot(cx + R * Math.cos(a * D), cy + R * Math.sin(a * D), C.blue, 2.8); }
      /* 정면도 — 등분점의 높이 */
      for (i = 0; i <= 6; i++) { px = cx + R * Math.cos(i * 30 * D);
        s += line(px, cy + R * Math.sin(i * 30 * D) + 4, px, yTop(px), { c: C.blue, w: 1, dash: '3 3' }) + line(px, yTop(px), px, bot, { c: C.grayM, w: 1 }) + dot(px, yTop(px), C.orange, 3.2); }
      s += F.poly([[cx - R, bot], [cx + R, bot], [cx + R, yTop(cx + R)], [cx - R, yTop(cx - R)]], { close: 1, w: 2.2 });
      /* 전개도 — 등분점 k 의 높이 = 정면도에서 그 점의 높이 (점 1 = 오른쪽 끝에서 시작) */
      var pts = [], k, sx, hx;
      for (k = 0; k <= 48; k++) { sx = x0 + L * k / 48; hx = cx + R * Math.cos(k / 48 * 2 * Math.PI); pts.push([sx, yTop(hx)]); }
      s += F.poly(pts.concat([[x0 + L, bot], [x0, bot]]), { close: 1, fill: C.blueL, w: 0.01, c: C.blueL });
      for (k = 0; k <= 12; k++) { sx = x0 + L * k / 12; hx = cx + R * Math.cos(k * 30 * D);
        s += line(sx, yTop(hx), sx, bot, { c: C.blue, w: 1 }); }
      /* 수평으로 옮기는 선 (점 1~7) */
      for (k = 0; k <= 6; k++) { hx = cx + R * Math.cos(k * 30 * D); sx = x0 + L * k / 12;
        s += line(hx, yTop(hx), sx, yTop(hx), { c: C.orange, w: 1, dash: '4 3' }); }
      for (k = 0; k <= 12; k++) { sx = x0 + L * k / 12; hx = cx + R * Math.cos(k * 30 * D); s += dot(sx, yTop(hx), C.orange, 3.2); }
      s += F.poly(pts, { c: C.orange, w: 2.6 }) + line(x0, bot, x0 + L, bot, { w: 2.2 }) + line(x0, bot, x0, pts[0][1], { w: 2.2 }) + line(x0 + L, bot, x0 + L, pts[48][1], { w: 2.2 });
      s += t(x0 + L + 8, 96, '높이를\n옮긴다', { size: 14, b: 1, c: C.orange });
      s += F.callout(x0 + L * 0.5, pts[24][1], x0 + L * 0.5 + 40, 196, '곡선으로 잇는다', { c: C.orange });
      return F.svg(480, 282, s);
    } },

  /* ─────────── 방사선법 ─────────── */
  pyrDraw: { cards: ['pyr'],
    cap: '사각뿔 — 모선의 실제 길이를 반지름으로 원호를 그리고, 밑변 길이로 4번 끊어 잇는다 (방사선법)',
    draw: function () {
      var cx = 95, cy = 58, k = 45, s = '', i;
      var A = [cx + k, cy], B = [cx, cy - k], Cc = [cx - k, cy], Dd = [cx, cy + k];
      s += t(14, 14, '평면도', { size: 13, c: C.sub }) + t(cx, 236, '정면도', { a: 'm', size: 13, c: C.sub });
      s += F.poly([A, B, Cc, Dd], { close: 1, fill: C.paper, w: 2.2 }) + line(A[0], A[1], Cc[0], Cc[1], { w: 1.2 }) + line(B[0], B[1], Dd[0], Dd[1], { w: 1.2 });
      /* 정면도 */
      var Ot = [cx, 128], base = 218;
      s += line(A[0], A[1], A[0], base, { c: C.sub, w: 1, dash: '3 3' }) + line(Cc[0], Cc[1], Cc[0], base, { c: C.sub, w: 1, dash: '3 3' });
      s += F.poly([[cx - k, base], Ot, [cx + k, base]], { close: 1, fill: C.paper, w: 2.2 }) + line(cx, Ot[1], cx, base, { w: 1.2 });
      s += line(Ot[0], Ot[1], cx + k, base, { c: C.orange, w: 3.2 });
      s += t(cx - 6, Ot[1] - 12, 'O′', { a: 'e', b: 1 }) + t(cx + k + 6, base + 2, 'A′', { b: 1 });
      /* 전개 — 중심 O″, 반지름 = 모선의 실제 길이 */
      var Lt = Math.hypot(k, base - Ot[1]), side = Math.hypot(k, k), step = 2 * Math.asin(side / 2 / Lt) / D;
      var O2 = [300, 124], a0 = -2 * step, P = [];
      for (i = 0; i <= 4; i++) P.push([O2[0] + Lt * Math.cos((a0 + step * i) * D), O2[1] + Lt * Math.sin((a0 + step * i) * D)]);
      s += line(Ot[0] + 8, Ot[1] - 4, O2[0] - 8, O2[1], { c: C.sub, w: 1, dash: '5 4' });
      s += F.path(arcPath(O2[0], O2[1], Lt, a0 - 10, a0 + 4 * step + 10), { c: C.sub, w: 1.2, dash: '6 4' });
      var fan = [O2].concat(P);
      s += F.poly(fan, { close: 1, fill: C.orangeL, w: 2.2 });
      for (i = 1; i < 4; i++) s += line(O2[0], O2[1], P[i][0], P[i][1], { w: 1.2, dash: 'center' });
      s += line(O2[0], O2[1], P[0][0], P[0][1], { c: C.orange, w: 3.2 });
      s += t(O2[0] - 8, O2[1], 'O″', { a: 'e', b: 1 });
      var m = [(O2[0] + P[0][0]) / 2, (O2[1] + P[0][1]) / 2];
      s += t(m[0] - 10, m[1] - 10, '실제 길이', { a: 'e', b: 1, c: C.orange, size: 14 });
      s += t(O2[0] + 40, 246, '밑변 길이로 4번 끊는다', { a: 'm', size: 14, b: 1, c: C.blue });
      return F.svg(480, 264, s);
    } },

  coneFan: { cards: ['cone'],
    cap: '원뿔 — 펼치면 반지름이 모선 ℓ 인 부채꼴, 호의 길이 = 밑면 둘레 2πr, 중심각 θ = 360° × r / ℓ (그림은 r : ℓ = 1 : 3 → 120°)',
    draw: function () {
      var s = '', r = 40, l = 120, h = Math.sqrt(l * l - r * r), bx = 100, by = 188, ay = by - h;
      s += t(100, 22, '원뿔', { a: 'm', b: 1, size: 17 }) + t(330, 22, '펼친 옆면 (부채꼴)', { a: 'm', b: 1, size: 17, c: C.orange });
      s += sep(212, 30, 236);
      /* 원뿔 */
      s += halfEll(bx, by, r, 10, false, { dash: '5 4', w: 1.4 }) + F.poly([[bx - r, by], [bx, ay], [bx + r, by]], { w: 2.2 }) + halfEll(bx, by, r, 10, true);
      s += line(bx, ay, bx, by, { c: C.sub, w: 1.2, dash: '5 4' }) + line(bx, by, bx + r, by, { c: C.blue, w: 2.6 }) +
        line(bx, ay, bx + r, by, { c: C.orange, w: 3.2 });
      s += F.poly([[bx, by - 10], [bx + 10, by - 10], [bx + 10, by]], { c: C.sub, w: 1 });
      s += t(bx + 6, (ay + by) / 2 + 22, 'h', { b: 1, c: C.sub }) + t(bx + r / 2, by + 20, 'r', { a: 'm', b: 1, c: C.blue }) +
        t(bx + r / 2 + 14, (ay + by) / 2 - 4, 'ℓ', { b: 1, c: C.orange, size: 18 });
      s += t(bx, 230, '밑면 둘레 = 2πr', { a: 'm', size: 14 });
      /* 부채꼴 — 반지름 ℓ, 중심각 360 × r / ℓ = 120° */
      var cx = 330, cy = 50, th = 360 * r / l, a0 = 90 - th / 2, a1 = 90 + th / 2;
      var p0 = [cx + l * Math.cos(a0 * D), cy + l * Math.sin(a0 * D)], p1 = [cx + l * Math.cos(a1 * D), cy + l * Math.sin(a1 * D)];
      s += F.path('M' + cx + ',' + cy + ' L' + r1(p0[0]) + ',' + r1(p0[1]) + ' ' + arcPath(cx, cy, l, a0, a1).replace(/^M[^A]+/, '') + ' Z',
        { fill: C.orangeL, w: 2.2 });
      s += F.path(arcPath(cx, cy, l, a0, a1), { c: C.blue, w: 3.2 });
      s += line(cx, cy, p1[0], p1[1], { c: C.orange, w: 3.2 });
      s += F.path(arcPath(cx, cy, 26, a0, a1), { c: C.ink, w: 1.4 });
      s += t(cx, cy + 42, 'θ', { a: 'm', b: 1, size: 18 }) + t(cx, cy + 66, '= 360° × r / ℓ', { a: 'm', b: 1, size: 15 });
      s += t((cx + p1[0]) / 2 - 10, (cy + p1[1]) / 2 - 6, 'ℓ', { a: 'e', b: 1, c: C.orange, size: 18, ans: 1 });
      s += t(cx, cy + l + 22, '호의 길이 = 2πr', { a: 'm', b: 1, c: C.blue, size: 15 });
      return F.svg(480, 250, s);
    } },

  /* ─────────── 삼각형법 ─────────── */
  triSplit: { cards: ['oblq'],
    cap: '편심 원뿔 — 모선 길이가 자리마다 달라 부채꼴 하나로 못 편다. 삼각형(모선 두 개 + 밑변)을 하나씩 이어 붙인다',
    draw: function () {
      var q = oblCone(58), s = '', i;
      /* 평면도 — 꼭짓점의 발 O 가 한쪽으로 치우쳐 있다 */
      var cx = 86, cy = 96, O = [cx + q.ecc, cy];
      s += t(cx, 22, '평면도', { a: 'm', size: 13, c: C.sub });
      s += F.circle(cx, cy, q.r, { fill: C.paper, w: 2.2 });
      for (i = 0; i < q.n; i++) { var v = q.V(i); s += line(O[0], O[1], cx + v[0], cy + v[1], { c: i < 2 ? C.orange : C.sub, w: i < 2 ? 2 : 1 }); }
      var v0 = q.V(0), v1 = q.V(1);
      s += F.poly([O, [cx + v0[0], cy + v0[1]], [cx + v1[0], cy + v1[1]]], { close: 1, fill: C.orangeL, c: C.orange, w: 1.6 });
      s += dot(O[0], O[1], C.ink, 3.5) + t(O[0] + 4, O[1] - 12, 'O', { b: 1, size: 14 });
      s += t(cx, 178, '짧은 모선 · 긴 모선', { a: 'm', size: 13, c: C.sub });
      s += arrow(160, 104, 196, 104, { c: C.sub, w: 1.8 });
      /* 전개도 — 꼭짓점을 중심으로 삼각형을 차례로 (세 변: 모선 i · 모선 i+1 · 밑변 한 칸) */
      var ang = [], tot = 0;
      for (i = 0; i < q.n; i++) { var a = q.L(i), b = q.L(i + 1); ang.push(Math.acos((a * a + b * b - q.c * q.c) / (2 * a * b))); tot += ang[i]; }
      var A = [334, 36], th = Math.PI / 2 - tot / 2, P = [];
      for (i = 0; i <= q.n; i++) { P.push([A[0] + q.L(i) * Math.cos(th), A[1] + q.L(i) * Math.sin(th)]); if (i < q.n) th += ang[i]; }
      for (i = 0; i < q.n; i++) {
        s += F.poly([A, P[i], P[i + 1]], { close: 1, fill: i === 0 ? C.orangeL : (i % 2 ? C.blueL : C.paper), c: C.ink, w: 1.4 });
      }
      s += F.poly(P, { w: 2.4 }) + line(A[0], A[1], P[0][0], P[0][1], { w: 2.4 }) + line(A[0], A[1], P[q.n][0], P[q.n][1], { w: 2.4 });
      s += F.num((A[0] + P[0][0] + P[1][0]) / 3, (A[1] + P[0][1] + P[1][1]) / 3 + 20, 1, { c: C.orange, r: 11 });
      s += F.num((A[0] + P[1][0] + P[2][0]) / 3, (A[1] + P[1][1] + P[2][1]) / 3 + 20, 2, { c: C.blue, r: 11 });
      s += t(A[0] + 10, A[1] - 8, '꼭짓점', { size: 13, c: C.sub });
      s += t(334, 236, '삼각형을 차례로 이어 붙인다', { a: 'm', b: 1, size: 15 });
      return F.svg(480, 254, s);
    } },

  trueLen: { cards: ['oblq'],
    cap: '모선의 실제 길이 — 평면도에서 잰 길이를 밑변, 높이 h 를 세로로 한 직각삼각형의 빗변이 실제 길이다',
    draw: function () {
      var q = oblCone(58), s = '';
      var cx = 86, cy = 100, O = [cx + q.ecc, cy], v0 = q.V(0), v6 = q.V(6);
      s += t(cx, 22, '평면도', { a: 'm', size: 13, c: C.sub });
      s += F.circle(cx, cy, q.r, { fill: C.paper, w: 2.2 });
      s += line(O[0], O[1], cx + v0[0], cy + v0[1], { c: C.blue, w: 3.2 }) + line(O[0], O[1], cx + v6[0], cy + v6[1], { c: C.orange, w: 3.2 });
      s += dot(O[0], O[1], C.ink, 3.5) + t(O[0], O[1] - 14, 'O', { a: 'm', b: 1, size: 14 });
      s += t(cx, 176, '평면도에서는 짧아 보인다', { a: 'm', size: 13, c: C.sub });
      /* 실제 길이 그림 — 세로 h, 가로 = 평면도 길이 */
      var X = 232, Y0 = 50, Y1 = Y0 + q.h, p1 = q.plan(0), p2 = q.plan(6);
      s += line(X, Y0, X, Y1, { w: 2.2 }) + line(X, Y1, X + p2 + 40, Y1, { w: 2.2 });
      s += F.poly([[X, Y1 - 10], [X + 10, Y1 - 10], [X + 10, Y1]], { c: C.sub, w: 1 });
      s += line(X, Y0, X + p1, Y1, { c: C.blue, w: 3.2 }) + line(X, Y0, X + p2, Y1, { c: C.orange, w: 3.2 });
      s += line(X, Y1 + 6, X + p1, Y1 + 6, { c: C.blue, w: 4 }) + line(X, Y1 + 13, X + p2, Y1 + 13, { c: C.orange, w: 4 });
      s += t(X - 10, (Y0 + Y1) / 2, '높이 h', { a: 'e', b: 1, size: 15 });
      s += t(X + p2 / 2, Y1 + 32, '평면도에서 잰 길이', { a: 'm', size: 13, c: C.sub });
      s += t(X + p2 / 2 + 24, (Y0 + Y1) / 2 - 10, '실제 길이', { b: 1, c: C.orange, size: 15 });
      s += dot(X, Y0, C.ink, 3.5) + t(X + 8, Y0 - 12, '꼭짓점', { size: 13, c: C.sub });
      return F.svg(480, 232, s);
    } }

  };
})();
