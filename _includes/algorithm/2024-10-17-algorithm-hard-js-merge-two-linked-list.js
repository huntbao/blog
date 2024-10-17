// 链表类
const nodeAddrMap = new Map();

class Node {
  addr = null
  data = null
  next = null
  constructor(addr, len) {
    len.val += 1;
    this.addr = addr;
    let [data, next] = nodeAddrMap.get(addr);
    this.data = data;
    if (next !== '-1') {
      this.next = new Node(next, len);
    }
  }
  toString() {
    let [next, retV] = [this, []];
    while (next !== null) {
      retV.push(`${next.addr} ${next.data} ${next.next === null ? '-1' : next.next.addr}`);
      next = next.next;
    }
    return retV.join('\n');
  }
  reverse() {
    // 反转链表
    let [prev, current] = [null, this];
    while (current !== null) {
      [current.next, prev, current] = [prev, current, current.next];
    }
    return prev;
  }
}

const inputs = `
00100 01000 7
02233 2 34891
00100 6 00001
34891 3 10086
01000 1 02233
00033 5 -1
10086 4 00033
00001 7 -1
`;

const c = inputs.split('\n');
const [startAddr1, startAddr2, totalNodeNum] = c[0].split(' ');

for (let i = 1; i <= parseInt(totalNum); i++) {
  let [addr, data, next] = c[i].split(' ');
  nodeAddrMap.set(addr, [data, next]);
}
//构建两个链表并且直接返回链表长度
let len1 = { val: 0 };
let len2 = { val: 0 };
let list1 = new Node(startAddr1, len1);
let list2 = new Node(startAddr2, len2);
if (len1.val < len2.val) {
  // 确保 list1 是长的链表
  [list1, list2] = [list2, list1];
}
// 反转短链表
list2 = list2.reverse();
let [cl1, cl2] = [list1, list2];
while (cl2 !== null) {
  // 长链表每隔2个结点，插一个短链表的结点。直到短链表没有剩余结点
  cl1 = cl1.next;
  [cl1.next, cl2.next, cl2, cl1] = [cl2, cl1.next, cl2.next, cl1.next];
}
console.log('' + list1);
