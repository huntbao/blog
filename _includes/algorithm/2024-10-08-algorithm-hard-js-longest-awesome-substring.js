
// 这是题目要求的输入格式
let inputs = `
3242415
`;

inputs = inputs.trim();

function longestAwesome(s) {
  const n = s.length;
  let mask = 0;
  const prefixMask = { 0: -1 }; // 初始状态，mask 为 0 的位置为 -1
  let maxLength = 0;

  for (let i = 0; i < n; i++) {
    // 更新当前字符的 mask
    mask ^= 1 << s[i];
    console.log(mask);

    // 检查当前 mask 是否已经出现过
    if (mask in prefixMask) {
      maxLength = Math.max(maxLength, i - prefixMask[mask]);
    } else {
      prefixMask[mask] = i;
    }

    // 检查单个字符变化的情况
    for (let j = 0; j < 10; j++) {
      const maskWithOneCharChanged = mask ^ (1 << j);
      if (maskWithOneCharChanged in prefixMask) {
        maxLength = Math.max(maxLength, i - prefixMask[maskWithOneCharChanged]);
      }
    }
  }

  return maxLength;
}

// 解法二
function longestAwesome2(s) {
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
console.log(longestAwesome2(inputs)); // 5