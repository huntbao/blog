
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

// 示例
console.log(lengthOfLIS(nums)); // 输出 4