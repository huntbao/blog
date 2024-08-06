// 链表类
class ListNode {
  constructor(address, data, next) {
    this.address = address;
    this.data = data;
    this.next = next;
  }

  reverse() {
    // 反转链表，链表中的第一个节点来调用该方法即可
    let prev = null;
    let current = this;
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
// Map 只是为了方便构建链表数据结构
const map = new Map();
for (let i = 1; i <= parseInt(totalNodeNum); i++) {
    let [a1, v, n] = c[i].split(' ');
    map.set(a1, [v, n]);
}
//构建两个链表并且直接返回链表长度
let length1 = { val: 0 };
let length2 = { val: 0 };
var L1 = new ListNode(map, startAddr1, length1);
var L2 = new ListNode(map, startAddr2, length2);
if (length1.val < length2.val) {
    // 确保 L1 是长的链表
    [L1, L2] = [L2, L1];
}
// 反转短链表
L2 = L2.reverse();
let [cl1, cl2] = [L1, L2];
while (cl2 !== null) {
    // 长链表每隔2个结点，插一个短链表的结点。直到短链表没有剩余结点
    cl1 = cl1.next;
    [cl1.next, cl2.next, cl2, cl1] = [cl2, cl1.next, cl2.next, cl1.next];
}
console.log("" + L1);
