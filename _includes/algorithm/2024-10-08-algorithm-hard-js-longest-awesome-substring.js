
// 这是题目要求的输入格式
let inputs = `
3242415
`;

inputs = inputs.trim();

function longestAwesome(s) {
  let maxLength = 0;
  // 单独一个数字也算回文
  for (let i = 0; i < s.length; i++) {
    // 数字出现的次数（0-9）
    const showTimes = new Array(10).fill(0);
    for (let j = i; j < s.length; j++) {
      showTimes[s[j]]++;
      
      let oddCounts = 0;
      // 0-9 出现的次数为奇数的个数
      for (let k = 0; k < 10; k++) {
        if (showTimes[k] % 2 !== 0) {
          oddCounts++;
        }
      }
      if (oddCounts <= 1) {
        maxLength = Math.max(j - i + 1, maxLength);
      }
    }
  }
  return maxLength;
}

// 示例
console.log(longestAwesome(inputs)); // 5