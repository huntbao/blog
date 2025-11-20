
// 这是题目要求的输入格式
let inputs = `abcabcbb`;

function lengthOfLongestSubstring(s) {
  const hashSet = new Set();
  let right = -1;    // 右指针初始化处于字符串左侧
  let maxLength = 0;
  for (let left = 0; left < s.length; left++) {
    if (left !== 0) {
      // 左指针移动，删掉一个元素
      hashSet.delete(s.charAt(left - 1))
    }
    // console.log("开始移动右指针前", right, left, hashSet);
    while (right + 1 < s.length && !hashSet.has(s.charAt(right + 1))) {
      hashSet.add(s.charAt(++right));
    }
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}

// 不能 trim，否则无法通过测试用例，因为输入s 由英文字母、数字、符号和空格组成
console.log(lengthOfLongestSubstring(inputs));