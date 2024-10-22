
// 这是题目要求的输入格式
let inputs = `
0 2 3 1 4
`;

inputs = inputs.trim().split(' ').map(Number);

function maxChunksToSorted(arr) {
  // 初始化一个空栈 用来可以用来分成的块的最大的元素
  let stack = [];
  for (let i = 0; i < arr.length; i++) {
    const num = arr[i];
    if (stack.length && num < stack[stack.length - 1]) {
      // 需要合并块
      const tmp = stack.pop(); // 最大的数缓存起来
      // 把中间小于当前数的块都合并到这个块中来 
      // 举例：假设现在是[0,3,4]三个块，当碰到了元素1，1就需要跟3,4合并，剩下0,4两个块了
      while (stack.length && num < stack[stack.length - 1]) {
        stack.pop();
      }
      stack.push(tmp);
    } else {
      stack.push(num); //单独成块
    }
  }
  return stack.length;
}

console.log(maxChunksToSorted(inputs));


/**
    举例2 1 3 4 4
    第一趟 2 单独成一个块 stack: [2]
    第二趟 1小于2 所以 21单独成一个块 stack: [2, 1]
    第三趟 3大于2 单独成块 stack：[2, 1] [3]
    第四趟 4大于3 单独成块 stack: [2, 1] [3] [4]
    第五趟 4不小于4 单独成块 stack:  [2, 1] [3] [4] [4]
    结果就可以分成 [2, 1] [3] [4] [4] 总共四块

    举例0 2 3 1 4 
    第一趟 stack: [0]
    第二趟 stack: [0] [2]
    第三趟 stack: [0] [2] [3]
    第四趟 1小于3跟2，不小于0，132合并，剩下两个块 stack: [0] [1, 3, 2]
    第四趟 stack: [0] [1, 3, 2] [4]
    结果就分成了[0] [2,3,1] [4] 三个块
*/