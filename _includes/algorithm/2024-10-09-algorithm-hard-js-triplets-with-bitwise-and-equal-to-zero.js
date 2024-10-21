
// 这是题目要求的输入格式
let inputs = `2,1,3`;

function countTriplets(nums) {
  const n = nums.length;
  const countMap = new Map();

  // 预处理两两组合的按位与结果
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const andResult = nums[i] & nums[j];
      countMap.set(andResult, (countMap.get(andResult) || 0) + 1);
    }
  }

  let count = 0;

  // 检查第三个数
  for (let k = 0; k < n; k++) {
    for (const [andResult, freq] of countMap) {
      if ((andResult & nums[k]) === 0) {
        count += freq;
      }
    }
  }

  return count;
}

// 示例
console.log(countTriplets(inputs.split(',').map(Number))); // 不使用 .map(Number) 的话测试用例会超时