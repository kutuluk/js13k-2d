var t=function(t,n,e){this.l=t,this.c=n,this.n=e,this.p=null};t.prototype.r=function(){this.p?this.p.n=this.n:this.l.h=this.n,this.n&&(this.n.p=this.p)};var n=function(){this.h=null};n.prototype.add=function(n){var e=new t(this,n,this.h);return this.h&&(this.h.p=e),this.h=e,e},n.prototype.i=function(t){for(var n=this.h;n;)t(n.c),n=n.n};var e=function(t){this.z=t,this.o=new n,this.t=new n};e.prototype.add=function(t){t.remove(),t.layer=this,t.n=(function(t){return 1!==t.alpha||0===t.frame.atest}(t)?this.t:this.o).add(t)};var i=function(t,n){var r=Object.assign({antialias:!1,alpha:!1},n),a=r.alpha?1:770,o=r.scale||1;delete r.scale;var s=t.getContext("webgl",r),c=s.getExtension("ANGLE_instanced_arrays"),u=function(t,n){var e=s.createShader(n);return s.shaderSource(e,t),s.compileShader(e),e},h=s.createProgram();s.attachShader(h,u("attribute vec2 g;\nattribute vec2 a;\nattribute vec2 t;\nattribute float r;\nattribute vec2 s;\nattribute vec4 u;\nattribute vec4 c;\nattribute float z;\nuniform mat4 m;\nvarying vec2 v;\nvarying vec4 i;\nvoid main(){\nv=u.xy+g*u.zw;\ni=c.abgr;\nvec2 p=(g-a)*s;\nfloat q=cos(r);\nfloat w=sin(r);\np=vec2(p.x*q-p.y*w,p.x*w+p.y*q);\np+=a+t;\ngl_Position=m*vec4(p,z,1);}",35633)),s.attachShader(h,u("precision mediump float;\nuniform sampler2D x;\nuniform float j;\nvarying vec2 v;\nvarying vec4 i;\nvoid main(){\nvec4 c=texture2D(x,v);\ngl_FragColor=c*i;\nif(j>0.0){\nif(c.a<j)discard;\ngl_FragColor.a=1.0;};}",35632)),s.linkProgram(h);var f=function(t,n,e){var i=s.createBuffer();s.bindBuffer(t,i),s.bufferData(t,n,e||35044)},l=function(t,n,e,i,r,a,o){var u=s.getAttribLocation(h,t);s.enableVertexAttribArray(u),s.vertexAttribPointer(u,n,a||5126,!!o,e||0,r||0),i&&c.vertexAttribDivisorANGLE(u,i)};f(34963,new Uint8Array([0,1,2,2,1,3])),f(34962,new Float32Array([0,0,0,1,1,0,1,1])),l("g",2);var v=new ArrayBuffer(3407820),p=new Float32Array(v),y=new Uint32Array(v);f(34962,v,35048),l("a",2,52,1),l("s",2,52,1,8),l("r",1,52,1,16),l("t",2,52,1,20),l("u",4,52,1,28),l("c",4,52,1,44,5121,!0),l("z",1,52,1,48);var x,d,g,b,m,w=function(t){return s.getUniformLocation(h,t)},P=w("m"),z=w("x"),A=w("j"),j=0,E=function(){g=t.clientHeight*o|0;var n=t.width!==(d=t.clientWidth*o|0)||t.height!==g;return t.width=d,t.height=g,n},F=function(){j&&(s.blendFunc(m?1:a,m?0:771),s.depthFunc(m?513:515),s.bindTexture(3553,b.tex),s.uniform1i(z,b.tex),s.uniform1f(A,m?b.atest:0),s.bufferSubData(34962,0,p.subarray(0,13*j)),c.drawElementsInstancedANGLE(4,6,5121,0,j),j=0)},S=function(t){if(t.visible){65535===j&&F();var n=t.frame,e=n.uvs,i=t.anchor||n.anchor;b.tex!==n.tex&&(b.tex&&F(),b=n);var r=13*j;p[r++]=i.x,p[r++]=i.y,p[r++]=t.scale.x*n.size.x,p[r++]=t.scale.y*n.size.y,p[r++]=t.rotation,p[r++]=t.position.x,p[r++]=t.position.y,p[r++]=e[0],p[r++]=e[1],p[r++]=e[2],p[r++]=e[3],y[r++]=((16777215&t.tint)<<8|255*t.alpha&255)>>>0,p[r]=t.layer.z,j++}},D=new e(0),O=[D],L={gl:s,camera:{at:i.Point(),to:i.Point(),angle:0},background:function(t,n,e,i){void 0===i&&(i=1),s.clearColor(t,n,e,i)},layer:function(t){var n=O.find(function(n){return n.z===t});return n||(n=new e(t),O.push(n),O.sort(function(t,n){return n.z-t.z})),n},add:function(t){D.add(t)},resize:E,render:function(){E();var t=L.camera,n=t.at,e=t.to,i=t.angle,r=n.x-d*e.x,a=n.y-g*e.y,o=Math.cos(i),c=Math.sin(i),u=2/d,f=-2/g;x=[o*u,c*f,0,0,-c*u,o*f,0,0,0,0,-1e-5,0,(n.x*(1-o)+n.y*c)*u-2*r/d-1,(n.y*(1-o)-n.x*c)*f+2*a/g+1,0,1],s.useProgram(h),s.enable(3042),s.enable(2929),s.uniformMatrix4fv(P,!1,x),s.viewport(0,0,d,g),s.clear(16640),b={tex:null},m=!0,O.forEach(function(t){return t.o.i(S)}),F(),m=!1;for(var l=O.length-1;l>=0;l--)O[l].t.i(S);F()}};return E(),L};i.Point=function(){function t(t,n){if(!(this instanceof i.Point))return new i.Point(t,n);this.set(t,n)}return t.prototype.set=function(t,n){return void 0===t&&(t=0),this.x=t,this.y=n||t,this},t.prototype.copy=function(t){return this.x=t.x,this.y=t.y,this},t}();var r=function t(n,e,r,a){if(!(this instanceof t))return new t(n,e,r,a);this.size=i.Point().copy(r),this.anchor=i.Point().copy(a||n.anchor),this.uvs=[e.x/n.size.x,e.y/n.size.y,r.x/n.size.x,r.y/n.size.y],this.t=n},a={atest:{configurable:!0},tex:{configurable:!0}};a.atest.get=function(){return this.t.atest},a.tex.get=function(){return this.t.tex},Object.defineProperties(r.prototype,a);i.Frame=r,i.Texture=function t(n,e,r,a){if(!(this instanceof t))return new t(n,e,r,a);this.size=i.Point(e.width,e.height),this.anchor=i.Point(),this.uvs=[0,0,1,1],this.atest=r||(0===r?0:1);var o=Object.assign({10240:9728,10241:9728,10242:33071,10243:33071},a),s=n.gl;this.tex=s.createTexture(),s.bindTexture(3553,this.tex),Object.keys(o).forEach(function(t){return s.texParameteri(3553,t,o[t])}),s.texImage2D(3553,0,6408,6408,5121,e)},i.Sprite=function(){function t(n,e){if(!(this instanceof t))return new t(n,e);Object.assign(this,{frame:n,visible:!0,position:i.Point(),rotation:0,anchor:null,scale:i.Point(1),tint:16777215,a:1},e),this.remove()}var n={alpha:{configurable:!0}};return n.alpha.get=function(){return this.a},n.alpha.set=function(t){var n=this.a;this.a=t,this.n&&(t<1&&1===n||1===t&&n<1)&&this.layer.add(this)},t.prototype.remove=function(){this.n&&this.n.r(),this.layer=null,this.n=null},Object.defineProperties(t.prototype,n),t}(),module.exports=i;
