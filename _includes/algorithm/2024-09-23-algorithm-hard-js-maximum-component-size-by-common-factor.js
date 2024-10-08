
// 这是题目要求的输入格式
let inputs = `
  4 16 15 35
`;
const nums = inputs.trim().split(' ').map(Number);

// 查找最大公约数
function findGCD(a, b){
  while(b !== 0){
    const tmp = b;
    b = a % b;
    a = tmp;
  }
  return a;
}

// 并查集
class UnionFind {
  constructor(size) {
    /**
        [0, 1, 2, ... , size]   // 初始状态下没有连通的节点，所有节点的父节点都是自身
        union(4, 6) // 把4跟6连通起来
        [..., 4, 5, 4, 7, 8, ... , size] // parent[6]设成parent[4]，表示两个节点共用了一个父节点，也就是连通了
        union(6, 15);
        [..., 4, 5, 4, 7, 8, ... , 13, 14, 4, 16, ... , size] // 15跟6也连通了，这时候componentSize就达到3了
    */
    // 初始化 parent 数组，每个节点的父节点初始化为自己
    this.parents = Array.from({ length: size }, (_, i) => i);
    // 根节点连通量
    this.componentSize = new Array(size).fill(1);
  }
  find(x) {
    if(this.parents[x] !== x){
      return this.find(this.parents[x]);
    }
    return x;
  }
  union(x, y){
    const rootX = this.find(x);
    const rootY = this.find(y);
    if(rootX !== rootY){
      this.parents[rootY] = rootX;
      this.componentSize[rootX] += this.componentSize[rootY];
    }
  }
  getLargestSize(){
    return Math.max(...this.componentSize);
  }
}
function largestComponentSize(nums) {
  // 确保parents能装下所有数字
  const uf = new UnionFind(Math.max(...nums)+1);
  for(let i = 0; i < nums.length; i++) {
    for(let j = 1; j < nums.length; j++) {
      if(findGCD(nums[i], nums[j]) > 1) {
        uf.union(i, j);
      }
    }
  }
  return uf.getLargestSize();
}

// 示例
// const nums = [4, 6, 15, 35];
console.log(largestComponentSize(nums)); // 输出 4