var t = function (t, n, e) {
    this.l = t, this.c = n, this.n = e, this.p = null;
};
t.prototype.r = function () {
    this.p ? (this.p.n = this.n) : (this.l.h = this.n), this.n && (this.n.p = this.p);
};
var n = function () {
    this.h = null;
};
n.prototype.add = function (n) {
    var e = new t(this, n, this.h);
    return this.h && (this.h.p = e), this.h = e, e;
}, n.prototype.i = function (t) {
    for (var n = this.h;n; ) 
        { t(n.c), n = n.n; }
};
var e = function (t) {
    this.z = t, this.o = new n(), this.t = new n();
};
e.prototype.add = function (t) {
    t.remove(), t.layer = this, t.n = ((function (t) {
        return 1 !== t.alpha || 0 === t.frame.atest;
    })(t) ? this.t : this.o).add(t);
};
var i = function (t, n) {
    var r = Object.assign({
        antialias: !1,
        alpha: !1
    }, n), a = r.alpha ? 1 : 770, o = t.getContext("webgl", r), s = o.getExtension("ANGLE_instanced_arrays"), c = function (t, n) {
        var e = o.createShader(n);
        return o.shaderSource(e, t), o.compileShader(e), e;
    }, u = o.createProgram();
    o.attachShader(u, c("attribute vec2 g;\nattribute vec2 a;\nattribute vec2 t;\nattribute float r;\nattribute vec2 s;\nattribute vec4 u;\nattribute vec4 c;\nattribute float z;\nuniform mat4 m;\nvarying vec2 v;\nvarying vec4 i;\nvoid main(){\nv=u.xy+g*u.zw;\ni=c.abgr;\nvec2 p=(g-a)*s;\nfloat q=cos(r);\nfloat w=sin(r);\np=vec2(p.x*q-p.y*w,p.x*w+p.y*q);\np+=a+t;\ngl_Position=m*vec4(p,z,1);}", 35633)), o.attachShader(u, c("precision mediump float;\nuniform sampler2D x;\nuniform float j;\nvarying vec2 v;\nvarying vec4 i;\nvoid main(){\nvec4 c=texture2D(x,v);\ngl_FragColor=c*i;\nif(j>0.0){\nif(c.a<j)discard;\ngl_FragColor.a=1.0;};}", 35632)), o.linkProgram(u);
    var h = function (t, n, e) {
        var i = o.createBuffer();
        o.bindBuffer(t, i), o.bufferData(t, n, e || 35044);
    }, f = function (t, n, e, i, r, a, c) {
        var h = o.getAttribLocation(u, t);
        o.enableVertexAttribArray(h), o.vertexAttribPointer(h, n, a || 5126, !(!c), e || 0, r || 0), i && s.vertexAttribDivisorANGLE(h, i);
    };
    h(34963, new Uint8Array([0,1,2,2,1,3])), h(34962, new Float32Array([0,0,0,1,1,
        0,1,1])), f("g", 2);
    var l = new ArrayBuffer(3407820), v = new Float32Array(l), p = new Uint32Array(l);
    h(34962, l, 35048), f("a", 2, 52, 1), f("s", 2, 52, 1, 8), f("r", 1, 52, 1, 16), f("t", 2, 52, 1, 20), f("u", 4, 52, 1, 28), f("c", 4, 52, 1, 44, 5121, !0), f("z", 1, 52, 1, 48);
    var x, y, d, g, b, m, w = function (t) {
        return o.getUniformLocation(u, t);
    }, P = w("m"), z = w("x"), A = w("j"), j = 0, E = function () {
        j && (m && (o.useProgram(u), o.uniformMatrix4fv(P, !1, x), o.viewport(0, 0, y, d), o.clear(16640), o.activeTexture(33984), o.enable(3042), o.enable(2929), m = !1), o.blendFunc(b ? 1 : a, b ? 0 : 771), o.depthFunc(b ? 513 : 515), o.bindTexture(3553, g.tex), o.uniform1i(z, g.tex), o.uniform1f(A, b ? g.atest : 0), o.bufferSubData(34962, 0, v.subarray(0, 13 * j)), s.drawElementsInstancedANGLE(4, 6, 5121, 0, j), j = 0);
    }, F = function (t) {
        if (t.visible) {
            65535 === j && E();
            var n = t.frame, e = n.uvs, i = t.anchor || n.anchor;
            g.tex !== n.tex && (g.tex && E(), g = n);
            var r = 13 * j;
            v[r++] = i.x, v[r++] = i.y, v[r++] = t.scale.x * n.size.x, v[r++] = t.scale.y * n.size.y, v[r++] = t.rotation, v[r++] = t.position.x, v[r++] = t.position.y, v[r++] = e[0], v[r++] = e[1], v[r++] = e[2], v[r++] = e[3], p[r++] = ((16777215 & t.tint) << 8 | 255 * t.alpha & 255) >>> 0, v[r++] = t.layer.z, j++;
        }
    }, S = new e(0), D = [S], O = {
        gl: o,
        camera: {
            at: i.Point(),
            to: i.Point(),
            angle: 0
        },
        background: function (t, n, e, i) {
            void 0 === i && (i = 1), o.clearColor(t, n, e, i);
        },
        layer: function (t) {
            var n = D.find(function (n) {
                return n.z === t;
            });
            return n || (n = new e(t), D.push(n), D.sort(function (t, n) {
                return n.z - t.z;
            })), n;
        },
        add: function (t) {
            S.add(t);
        },
        render: function () {
            d = t.clientHeight, t.width = (y = t.clientWidth), t.height = d;
            var n = O.camera, e = n.at, i = n.to, r = n.angle, a = e.x - y * i.x, o = e.y - d * i.y, s = Math.cos(r), c = Math.sin(r), u = 2 / y, h = -2 / d;
            x = [s * u,c * h,0,0,-c * u,s * h,0,0,0,0,-1e-5,0,(e.x * (1 - s) + e.y * c) * u - 2 * a / y - 1,
                (e.y * (1 - s) - e.x * c) * h + 2 * o / d + 1,0,1], m = !0, g = {
                tex: null
            }, b = !0, D.forEach(function (t) {
                return t.o.i(function (t) {
                    return F(t);
                });
            }), E(), b = !1;
            for (var f = D.length - 1;f >= 0; f--) 
                { D[f].t.i(function (t) {
                return F(t);
            }); }
            E();
        }
    };
    return O.render(), O;
};
i.Point = (function () {
    function t(t, n) {
        if (!(this instanceof i.Point)) 
            { return new i.Point(t, n); }
        this.set(t, n);
    }
    
    return t.prototype.set = function (t, n) {
        return this.x = t || 0, this.y = n || (0 !== n ? this.x : 0), this;
    }, t.prototype.copy = function (t) {
        return this.x = t.x, this.y = t.y, this;
    }, t;
})();
var r = function t(n, e, r, a) {
    if (!(this instanceof t)) 
        { return new t(n, e, r, a); }
    this.size = i.Point().copy(r), this.anchor = i.Point().copy(a || n.anchor), this.uvs = [e.x / n.size.x,
        e.y / n.size.y,r.x / n.size.x,r.y / n.size.y], this.t = n;
}, a = {
    atest: {
        configurable: !0
    },
    tex: {
        configurable: !0
    }
};
a.atest.get = function () {
    return this.t.atest;
}, a.tex.get = function () {
    return this.t.tex;
}, Object.defineProperties(r.prototype, a);
i.Frame = r, i.Texture = function t(n, e, r, a) {
    if (!(this instanceof t)) 
        { return new t(n, e, r, a); }
    this.size = i.Point(e.width, e.height), this.anchor = i.Point(), this.uvs = [0,
        0,1,1], this.atest = r || (0 === r ? 0 : 1);
    var o = Object.assign({
        10240: 9728,
        10241: 9728,
        10242: 33071,
        10243: 33071
    }, a), s = n.gl;
    this.tex = s.createTexture(), s.bindTexture(3553, this.tex), Object.keys(o).forEach(function (t) {
        return s.texParameteri(3553, t, o[t]);
    }), s.texImage2D(3553, 0, 6408, 6408, 5121, e);
}, i.Sprite = (function () {
    function t(n, e) {
        if (!(this instanceof t)) 
            { return new t(n, e); }
        this.frame = n, this.a = 1, Object.assign(this, {
            visible: !0,
            position: i.Point(),
            rotation: 0,
            anchor: null,
            scale: i.Point(1),
            tint: 16777215
        }, e), this.remove();
    }
    
    var n = {
        alpha: {
            configurable: !0
        }
    };
    return n.alpha.get = function () {
        return this.a;
    }, n.alpha.set = function (t) {
        var n = this.a;
        this.a = t, this.n && (t < 1 && 1 === n || 1 === t && n < 1) && this.layer.add(this);
    }, t.prototype.remove = function () {
        this.n && this.n.r(), this.layer = null, this.n = null;
    }, Object.defineProperties(t.prototype, n), t;
})();

var Point = i.Point;
var Texture = i.Texture;
var Frame = i.Frame;
var Sprite = i.Sprite;
var stats = new Stats();
document.body.appendChild(stats.dom);
var view = document.getElementById('view');
var scene = i(view);
var gl = scene.gl;
scene.background(1, 1, 1, 0);
scene.camera.at.set(400, 300);
scene.camera.to.set(0.5);
var atlasImg = function () {
    var canvas = document.createElement('canvas');
    var size = 32;
    var half = size / 2;
    canvas.width = 96;
    canvas.height = 32;
    var ctx = canvas.getContext('2d');
    var offset = 0;
    ctx.lineWidth = size / 16;
    ctx.fillStyle = '#cccccc';
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(offset + half, half);
    for (var angle = 0;angle < Math.PI * 2; angle += Math.PI * 2 / 5) {
        ctx.lineTo(offset + half - Math.sin(angle) * half * 0.9, half - Math.cos(angle) * half * 0.9);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    offset += size;
    ctx.beginPath();
    ctx.moveTo(offset + 3, 3);
    ctx.lineTo(offset + size - 3, 3);
    ctx.lineTo(offset + size - 3, size - 3);
    ctx.lineTo(offset + 3, size - 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    offset += size;
    ctx.beginPath();
    ctx.moveTo(offset + 3, 3);
    ctx.lineTo(offset + 29, 3);
    ctx.lineTo(offset + 29, 8);
    ctx.lineTo(offset + 8, 8);
    ctx.lineTo(offset + 8, 14);
    ctx.lineTo(offset + 20, 14);
    ctx.lineTo(offset + 20, 18);
    ctx.lineTo(offset + 8, 18);
    ctx.lineTo(offset + 8, 29);
    ctx.lineTo(offset + 3, 29);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    return canvas;
};
var logoMask = function () {
    var canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(400, 300);
    for (var angle = 0;angle < Math.PI * 2; angle += Math.PI * 2 / 5) {
        ctx.lineTo(400 - Math.sin(angle) * 250, 300 - Math.cos(angle) * 250);
    }
    ctx.closePath();
    ctx.fill();
    var ref = ctx.getImageData(0, 0, 800, 600);
    var data = ref.data;
    return function (x, y) { return data[(y * 800 + x) * 4] > 0; };
};
var atlas = Texture(scene, atlasImg(), 0.5);
atlas.anchor = Point(0.5);
var bFrame = Frame(atlas, Point(), Point(32));
var qFrame = Frame(atlas, Point(32, 0), Point(32));
var fFrame = Frame(atlas, Point(64, 0), Point(32));
var frames = [atlas,bFrame,qFrame,fFrame];
var len = 0;
var mask = logoMask();
var cl = 0;
var addSprite = function (a) {
    if (len % 250 === 0) {
        cl++;
    }
    var layer = scene.layer(cl);
    len += a;
    for (var i$$1 = 0;i$$1 < a; i$$1++) {
        var sprite = Sprite(frames[i$$1 % 4]);
        var x = 0;
        var y = 0;
        while (!mask(x, y)) {
            x = ~(~(800 * Math.random()));
            y = ~(~(600 * Math.random()));
        }
        sprite.position.set(x, y);
        sprite.tint = Math.random() * 0xffffff;
        sprite.rotation = Math.random() * Math.PI * 2;
        layer.add(sprite);
    }
};
var sprites = document.getElementById('info');
var dbgRenderInfo = gl.getExtension('WEBGL_debug_renderer_info');
var info = gl.getParameter(dbgRenderInfo ? dbgRenderInfo.UNMASKED_RENDERER_WEBGL : gl.VENDOR);
var add = false;
view.onmousedown = (function () {
    add = true;
});
view.ontouchstart = (function () {
    add = true;
});
view.onmouseup = (function () {
    add = false;
});
view.ontouchend = (function () {
    add = false;
});
var loop = function () {
    stats.begin();
    if (len < 3000 || add) 
        { addSprite(25); }
    sprites.innerHTML = "Renderer: " + info + "</br>Sprites: " + len + " (click to add)";
    scene.camera.angle += 0.005;
    scene.render();
    stats.end();
    requestAnimationFrame(loop);
};
loop();
