class Node {
  constructor(cargo, next) {
    this.c = cargo;
    this.p = null;
    this.n = next;
    this.d = false;
  }

  remove() {
    this.d = true;
  }
}

export default class List {
  constructor() {
    this.h = null;
  }

  add(cargo) {
    const node = new Node(cargo, this.h);

    this.h && (this.h.p = node);
    this.h = node;

    return node;
  }

  iterate(fn) {
    let node = this.h;
    while (node) {
      if (node.d) {
        if (node.p) {
          node.p.n = node.n;
        } else {
          this.h = node.n;
        }
        node.n && (node.n.p = node.p);
      } else {
        fn(node.c);
      }
      node = node.n;
    }
  }
}
