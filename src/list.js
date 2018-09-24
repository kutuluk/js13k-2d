class Node {
  constructor(list, cargo, next) {
    this.l = list;
    this.c = cargo;
    this.n = next;
    this.p = null;
  }

  r() {
    if (this.p) {
      this.p.n = this.n;
    } else {
      this.l.h = this.n;
    }
    this.n && (this.n.p = this.p);
  }
}

export default class List {
  constructor() {
    this.h = null;
  }

  add(cargo) {
    const node = new Node(this, cargo, this.h);
    this.h && (this.h.p = node);
    this.h = node;
    return node;
  }

  i(fn) {
    let node = this.h;
    while (node) {
      fn(node.c);
      node = node.n;
    }
  }
}
