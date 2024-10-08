
// 这是题目要求的输入格式
let inputs = `
6 1 3 7 1 7 5
5 1 9 2 5 1
`;

inputs = inputs.trim().split('\n').map(line => line.trim().split(' ').map(Number));

function maxUncrossedLines(nums1, nums2) {
  const m = nums1.length;
  const n = nums2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (nums1[i - 1] === nums2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}

// 示例
console.log(maxUncrossedLines(inputs[0].slice(1), inputs[1].slice(1)));