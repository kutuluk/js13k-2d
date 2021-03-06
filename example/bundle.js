var t = function (t, n, i) {
    this.l = t, this.c = n, this.n = i, this.p = null;
};
t.prototype.r = function () {
    this.p ? (this.p.n = this.n) : (this.l.h = this.n), this.n && (this.n.p = this.p);
};
var n = function () {
    this.h = null;
};
n.prototype.add = function (n) {
    var i = new t(this, n, this.h);
    return this.h && (this.h.p = i), this.h = i, i;
}, n.prototype.i = function (t) {
    for (var n = this.h;n; ) 
        { t(n.c), n = n.n; }
};
var i = {
    p: {
        t: 0
    }
}, e = function (t) {
    this.z = t, this.o = new n(), this.t = new n();
};
e.prototype.add = function (t) {
    t.remove(), t.l = this, t.n = (1 !== t.a || 0 === t.frame.p.a ? this.t : this.o).add(t);
};
var r = function (t, n) {
    var a = new e(0), o = [a], s = new ArrayBuffer(3407820), u = new Float32Array(s), c = new Uint32Array(s), h = r.Point, f = Object.assign({
        antialias: !1,
        alpha: !1
    }, n), l = f.alpha ? 1 : 770, p = f.scale || 1;
    delete f.scale;
    var v = t.getContext("webgl", f), d = v.getExtension("ANGLE_instanced_arrays"), g = function (t, n) {
        var i = v.createShader(n);
        return v.shaderSource(i, t), v.compileShader(i), i;
    }, m = v.createProgram();
    v.attachShader(m, g("attribute vec2 g;\nattribute vec2 a;\nattribute vec2 t;\nattribute float r;\nattribute vec2 s;\nattribute vec4 u;\nattribute vec4 c;\nattribute float z;\nuniform mat4 m;\nvarying vec2 v;\nvarying vec4 i;\nvoid main(){\nv=u.xy+g*u.zw;\ni=c.abgr;\nvec2 p=(g-a)*s;\nfloat q=cos(r);\nfloat w=sin(r);\np=vec2(p.x*q-p.y*w,p.x*w+p.y*q);\np+=a+t;\ngl_Position=m*vec4(p,z,1);}", 35633)), v.attachShader(m, g("precision mediump float;\nuniform sampler2D x;\nuniform float j;\nvarying vec2 v;\nvarying vec4 i;\nvoid main(){\nvec4 c=texture2D(x,v);\ngl_FragColor=c*i;\nif(j>0.0){\nif(c.a<j)discard;\ngl_FragColor.a=1.0;};}", 35632)), v.linkProgram(m);
    var y = function (t, n, i) {
        v.bindBuffer(t, v.createBuffer()), v.bufferData(t, n, i || 35044);
    }, x = function (t, n, i, e, r, a, o) {
        var s = v.getAttribLocation(m, t);
        v.enableVertexAttribArray(s), v.vertexAttribPointer(s, n, a || 5126, !(!o), i || 0, r || 0), e && d.vertexAttribDivisorANGLE(s, e);
    };
    y(34963, new Uint8Array([0,1,2,2,1,3])), y(34962, new Float32Array([0,0,0,1,1,
        0,1,1])), x("g", 2), y(34962, s, 35048), x("a", 2, 52, 1), x("s", 2, 52, 1, 8), x("r", 1, 52, 1, 16), x("t", 2, 52, 1, 20), x("u", 4, 52, 1, 28), x("c", 4, 52, 1, 44, 5121, !0), x("z", 1, 52, 1, 48);
    var b, w, z, P, A = function (t) {
        return v.getUniformLocation(m, t);
    }, j = A("m"), S = A("x"), D = A("j"), E = 0, F = function () {
        w = t.clientHeight * p | 0;
        var n = t.width !== (b = t.clientWidth * p | 0) || t.height !== w;
        return t.width = b, t.height = w, n;
    }, L = function () {
        E && (v.blendFunc(P ? 1 : l, P ? 0 : 771), v.depthFunc(P ? 513 : 515), v.bindTexture(3553, z.p.t), v.uniform1i(S, z.p.t), v.uniform1f(D, P ? z.p.a : 0), v.bufferSubData(34962, 0, u.subarray(0, 13 * E)), d.drawElementsInstancedANGLE(4, 6, 5121, 0, E), E = 0);
    }, _ = function (t) {
        if (t.visible) {
            65535 === E && L();
            var n = t.frame, i = n.uvs;
            z.p.t !== n.p.t && (z.p.t && L(), z = n);
            var e = 13 * E;
            u[e++] = n.anchor.x, u[e++] = n.anchor.y, u[e++] = t.scale.x * n.size.x, u[e++] = t.scale.y * n.size.y, u[e++] = t.rotation, u[e++] = t.position.x, u[e++] = t.position.y, u[e++] = i[0], u[e++] = i[1], u[e++] = i[2], u[e++] = i[3], c[e++] = ((16777215 & t.tint) << 8 | 255 * t.a & 255) >>> 0, u[e] = t.l.z, E++;
        }
    }, C = {
        gl: v,
        camera: {
            at: h(),
            to: h(),
            angle: 0
        },
        background: function (t, n, i, e) {
            v.clearColor(t, n, i, 0 === e ? 0 : e || 1);
        },
        layer: function (t) {
            var n = o.find(function (n) {
                return n.z === t;
            });
            return n || (n = new e(t), o.push(n), o.sort(function (t, n) {
                return n.z - t.z;
            })), n;
        },
        add: function (t) {
            a.add(t);
        },
        texture: function (t, n, i, e) {
            var r = t.width, a = t.height, o = v.createTexture();
            return v.bindTexture(3553, o), v.texParameteri(3553, 10240, 9728 | +i), v.texParameteri(3553, 10241, 9728 | +i | +e << 8 | +e << 1), v.texImage2D(3553, 0, 6408, 6408, 5121, t), e && v.generateMipmap(3553), {
                size: h(r, a),
                anchor: h(),
                uvs: [0,0,1,1],
                p: {
                    a: 0 === n ? 0 : n || 1,
                    t: o
                },
                frame: function (t, n, i) {
                    return {
                        size: n,
                        anchor: i || this.anchor,
                        uvs: [t.x / r,t.y / a,n.x / r,n.y / a],
                        p: this.p
                    };
                }
            };
        },
        resize: F,
        render: function () {
            F();
            var t = C.camera, n = t.at, e = t.to, r = t.angle, a = n.x - b * e.x, s = n.y - w * e.y, u = Math.cos(r), c = Math.sin(r), h = 2 / b, f = -2 / w, l = [u * h,
                c * f,0,0,-c * h,u * f,0,0,0,0,-1e-5,0,(n.x * (1 - u) + n.y * c) * h - 2 * a / b - 1,
                (n.y * (1 - u) - n.x * c) * f + 2 * s / w + 1,0,1];
            v.useProgram(m), v.enable(3042), v.enable(2929), v.uniformMatrix4fv(j, !1, l), v.viewport(0, 0, b, w), v.clear(16640), z = i, P = !0, o.forEach(function (t) {
                return t.o.i(_);
            }), L(), P = !1;
            for (var p = o.length - 1;p >= 0; p--) 
                { o[p].t.i(_); }
            L();
        }
    };
    return F(), C;
};
r.Point = (function () {
    function t(t, n) {
        if (!(this instanceof r.Point)) 
            { return new r.Point(t, n); }
        this.set(t, n);
    }
    
    return t.prototype.set = function (t, n) {
        return this.x = t || 0, this.y = n || (0 !== n ? this.x : 0), this;
    }, t;
})(), r.Sprite = (function () {
    function t(n, i) {
        if (!(this instanceof t)) 
            { return new t(n, i); }
        Object.assign(this, {
            frame: n,
            visible: !0,
            position: r.Point(),
            rotation: 0,
            scale: r.Point(1),
            tint: 16777215,
            a: 1,
            l: null,
            n: null
        }, i);
    }
    
    var n = {
        alpha: {
            configurable: !0
        }
    };
    return n.alpha.get = function () {
        return this.a;
    }, n.alpha.set = function (t) {
        var n = t < 1 && 1 === this.a || 1 === t && this.a < 1;
        this.a = t, n && this.frame.p.a > 0 && this.l && this.l.add(this);
    }, t.prototype.remove = function () {
        this.n && this.n.r(), this.l = null, this.n = null;
    }, Object.defineProperties(t.prototype, n), t;
})();

var Point = r.Point;
var Sprite = r.Sprite;
var stats = new Stats();
document.body.appendChild(stats.dom);
var view = document.getElementById('view');
var scene = r(view);
var gl = scene.gl;
console.log(gl);
scene.background(1, 1, 1, 0);
scene.camera.at.set(400, 300);
scene.camera.to.set(0.5);
var atlasImg = function () {
    var canvas = document.createElement('canvas');
    var size = 32;
    var half = size / 2;
    canvas.width = 128;
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
var atlas = scene.texture(atlasImg(), 0.5);
atlas.anchor = Point(0.5);
var bFrame = atlas.frame(Point(), Point(32));
var qFrame = atlas.frame(Point(32, 0), Point(32));
var fFrame = atlas.frame(Point(64, 0), Point(32));
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
    for (var i = 0;i < a; i++) {
        var sprite = Sprite(frames[i % 4]);
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
