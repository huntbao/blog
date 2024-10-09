
// 这是题目要求的输入格式
let inputs = `
3,4,6,5
9,1,2,5,8,3
5
`;
const nums = inputs.trim().split('\n').map(line => line.split(',').map(Number));

function maxSubsequence(nums, len) {
  const stack = [];
  let drop = nums.length - len;
  for (const num of nums) {
    while (drop > 0 && stack.length > 0 && stack[stack.length - 1] < num) {
      stack.pop();
      drop--;
    }
    stack.push(num);
  }
  return stack.slice(0, len);
}
function merge(subseq1, subseq2) {
  const merged = [];
  while (subseq1.length > 0 || subseq2.length > 0) {
    if (subseq1 > subseq2) {
      merged.push(subseq1.shift());
    } else {
      merged.push(subseq2.shift());
    }
  }
  return merged;
}

function maxNumber(nums1, nums2, k) {
  let maxResult = [];
  for (let i = Math.max(0, k - nums2.length); i <= Math.min(k, nums1.length); i++) {
    const subseq1 = maxSubsequence(nums1, i);
    const subseq2 = maxSubsequence(nums2, k - i);
    const candidate = merge(subseq1, subseq2);
    if (candidate > maxResult) {
      maxResult = candidate;
    }
  }
  return maxResult;
}

console.log(maxNumber(nums[0], nums[1], nums[2][0]).join(',')); // 9,8,6,5,3