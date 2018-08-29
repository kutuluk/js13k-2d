var t = function (t, r) {
    this.c = t, this.p = null, this.n = r, this.d = !1;
};
t.prototype.remove = function () {
    this.d = !0;
};
var r = function () {
    this.h = null;
};
r.prototype.add = function (r) {
    var e = new t(r, this.h);
    return this.h && (this.h.p = e), this.h = e, e;
}, r.prototype.iterate = function (t) {
    var this$1 = this;

    for (var r = this.h;r; ) 
        { r.d ? (r.p ? (r.p.n = r.n) : (this$1.h = r.n), r.n && (r.n.p = r.p)) : t(r.c), r = r.n; }
};
var e = function (t) {
    this.l = new r(), this.z = t;
};
e.prototype.add = function (t) {
    t.node = this.l.add(t);
};
var n = function (t) {
    this.bitmap = t, this.anchor = {
        x: .5,
        y: .5
    }, this.position = {
        x: 0,
        y: 0
    }, this.rotation = 0, this.scale = {
        x: 1,
        y: 1
    }, this.tint = 16777215, this.alpha = 1, this.visible = !0, this.node = null;
};
n.prototype.remove = function () {
    this.node && this.node.remove();
};
var i = function (t, r) {
    var n = t.getContext("webgl", r), i = n.getExtension("ANGLE_instanced_arrays"), a = function (t, r) {
        var e = n.createShader(r);
        return n.shaderSource(e, t), n.compileShader(e), e;
    }, o = function (t, r, e) {
        var i = n.createBuffer();
        return n.bindBuffer(t, i), n.bufferData(t, r, e), i;
    }, u = [], c = function (t) {
        var r = u.find(function (r) {
            return r.z === t;
        });
        if (r) 
            { return r; }
        var n = new e(t);
        return u.push(n), u.sort(function (t, r) {
            return t.z < r.z ? -1 : t.z > r.z ? 1 : 0;
        }), n;
    }, h = c(0), v = (function (t, r) {
        var e = a(t, n.VERTEX_SHADER), i = a(r, n.FRAGMENT_SHADER), o = n.createProgram();
        return n.attachShader(o, e), n.attachShader(o, i), n.linkProgram(o), o;
    })("precision mediump float;\nattribute vec2 g;\nattribute vec2 a;\nattribute vec2 t;\nattribute float r;\nattribute vec2 s;\nattribute vec4 u;\nattribute vec4 c;\nuniform mat4 m;\nvarying vec2 v;\nvarying vec4 vc;\nvoid main(){\nv=u.xy+g*u.zw;\nvc=c.abgr;\nvec2 p=(g-a)*s;\nfloat cr=cos(r);\nfloat sr=sin(r);\np=vec2(p.x*cr-p.y*sr,p.x*sr+p.y*cr);\np+=a+t;\ngl_Position=m*vec4(p,0,1);}", "precision mediump float;\nuniform sampler2D x;\nvarying vec2 v;\nvarying vec4 vc;\nvoid main(){\ngl_FragColor=texture2D(x,v)*vc;}"), E = function (t, r, e, a, o, u, c) {
        var h = n.getAttribLocation(v, t);
        return n.enableVertexAttribArray(h), n.vertexAttribPointer(h, r, u || n.FLOAT, !(!c), e || 0, o || 0), a && i.vertexAttribDivisorANGLE(h, a), h;
    };
    o(n.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,2,1,3]), n.STATIC_DRAW), o(n.ARRAY_BUFFER, new Float32Array([0,
        0,0,1,1,0,1,1]), n.STATIC_DRAW), E("g", 2);
    var s = new ArrayBuffer(3145680), f = new Float32Array(s), T = new Uint32Array(s);
    o(n.ARRAY_BUFFER, s, n.DYNAMIC_DRAW), E("a", 2, 48, 1), E("s", 2, 48, 1, 8), E("r", 1, 48, 1, 16), E("t", 2, 48, 1, 20), E("u", 4, 48, 1, 28), E("c", 4, 48, 1, 44, n.UNSIGNED_BYTE, !0);
    var R, A = n.getUniformLocation(v, "m"), d = n.getUniformLocation(v, "x"), l = 0, p = function () {
        l && (n.bufferSubData(n.ARRAY_BUFFER, 0, f.subarray(0, 12 * l)), i.drawElementsInstancedANGLE(n.TRIANGLES, 6, n.UNSIGNED_SHORT, 0, l), l = 0);
    }, _ = function () {
        var r = t.clientWidth, e = t.clientHeight;
        t.width = r, t.height = e, n.viewport(0, 0, r, e), n.enable(n.BLEND), n.blendFunc(n.SRC_ALPHA, n.ONE_MINUS_SRC_ALPHA), n.clear(n.COLOR_BUFFER_BIT);
        var i = [2 / r,0,0,0,0,-2 / e,0,0,0,0,1,0,-1,1,0,1];
        n.useProgram(v), n.activeTexture(n.TEXTURE0), n.uniformMatrix4fv(A, !1, i), R = null, u.forEach(function (t) {
            return t.l.iterate(function (t) {
                return (function (t) {
                    if (t.visible) {
                        65535 === l && p();
                        var r = t.bitmap, e = r.tex, i = r.width, a = r.height, o = r.uvs;
                        R !== e && (p(), R = e, n.bindTexture(n.TEXTURE_2D, e), n.uniform1i(d, e));
                        var u = 12 * l;
                        f[u++] = t.anchor.x, f[u++] = t.anchor.y, f[u++] = t.scale.x * i, f[u++] = t.scale.y * a, f[u++] = t.rotation, f[u++] = t.position.x, f[u++] = t.position.y, f[u++] = o[0], f[u++] = o[1], f[u++] = o[2], f[u++] = o[3], T[u++] = ((16777215 & t.tint) << 8 | 255 * t.alpha & 255) >>> 0, l++;
                    }
                })(t);
            });
        }), p();
    };
    return _(), {
        gl: n,
        bkg: function (t, r, e) {
            n.clearColor(t, r, e, 1);
        },
        texture: function (t, r, e, i, a) {
            var o = n.createTexture();
            return n.bindTexture(n.TEXTURE_2D, o), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, r || n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_T, e || n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, a || n.LINEAR), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, i || n.LINEAR), n.texImage2D(n.TEXTURE_2D, 0, n.RGBA, n.RGBA, n.UNSIGNED_BYTE, t), n.generateMipmap(n.TEXTURE_2D), {
                tex: o,
                width: t.width,
                height: t.height,
                uvs: [0,0,1,1]
            };
        },
        bitmap: function (t, r, e, n, i) {
            var a = n - r + 1, o = i - e + 1;
            return {
                tex: t.tex,
                width: a,
                height: o,
                uvs: [r / t.width,e / t.height,a / t.width,o / t.height]
            };
        },
        layer: c,
        add: function (t) {
            h.add(t);
        },
        render: _
    };
};
i.Sprite = n;

var stats = new Stats();
document.body.appendChild(stats.dom);
var view = document.getElementById('view');
var renderer = i(view);
var gl = renderer.gl;
renderer.bkg(0.2, 0.2, 0.2, 1);
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
var atlasTex = renderer.texture(atlasImg());
var bBitmap = renderer.bitmap(atlasTex, 0, 0, 31, 31);
var qBitmap = renderer.bitmap(atlasTex, 32, 0, 63, 31);
var fBitmap = renderer.bitmap(atlasTex, 64, 0, 95, 31);
var bitmaps = [atlasTex,bBitmap,qBitmap,fBitmap];
var len = 0;
var sprs = [];
var addSprite = function (l, a) {
    len += a;
    for (var i$$1 = 0;i$$1 < a; i$$1++) {
        var s = new i.Sprite(bitmaps[i$$1 % 4]);
        s.position = {
            x: view.width * 0.1 + Math.random() * view.width * 0.8,
            y: view.height * 0.1 + Math.random() * view.height * 0.8
        };
        s.scale = {
            x: 0.5,
            y: 0.5
        };
        s.anchor = {
            x: 0.5,
            y: 0.5
        };
        s.alpha = 0.7;
        s.tint = Math.random() * 0xffffff;
        s.rotation = Math.random() * Math.PI * 2;
        s.dr = (0.5 - Math.random()) * 0.2;
        sprs.push(s);
        l.add(s);
    }
};
addSprite(renderer.layer(0), 300);
var sprites = document.getElementById('info');
var dbgRenderInfo = gl.getExtension('WEBGL_debug_renderer_info');
var info = gl.getParameter(dbgRenderInfo ? dbgRenderInfo.UNMASKED_RENDERER_WEBGL : gl.VENDOR);
var add = null;
var l = 1;
view.onmousedown = (function () {
    add = renderer.layer(l++);
});
view.ontouchstart = (function () {
    add = renderer.layer(l++);
});
view.onmouseup = (function () {
    add = null;
});
view.ontouchend = (function () {
    add = null;
});
var loop = function () {
    stats.begin();
    if (add) 
        { addSprite(add, 25); }
    sprites.innerHTML = "Renderer: " + info + "</br>Sprites: " + len;
    sprs.forEach(function (sprite) {
        sprite.dr && (sprite.rotation += sprite.dr);
    });
    renderer.render();
    stats.end();
    requestAnimationFrame(loop);
};
loop();
