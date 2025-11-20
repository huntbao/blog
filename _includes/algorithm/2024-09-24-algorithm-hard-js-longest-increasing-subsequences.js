
// 这是题目要求的输入格式
let inputs = `
10 9 2 5 3 7 101 18
`;
const nums = inputs.trim().split(' ').map(Number);

function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;

  const dp = new Array(nums.length).fill(1);

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  return Math.max(...dp);
}

function lengthOfLIS2(nums) {
  const stack = [];
  let ret = 0;
  while (nums.length > 0) {
    let f = nums.shift();
    while (stack.length > 0 && stack[stack.length - 1] >= f) {
      stack.pop();
    }
    stack.push(f);
    ret = Math.max(ret, stack.length);
  }
  return ret;
}

// 示例
console.log(lengthOfLIS2(nums)); // 输出 4