
// 这是题目要求的输入格式
let inputs = `
()(()
`;

inputs = inputs.trim();

function longestValidParentheses(s) {
  // 初始值 -1 确保了在计算第一个有效括号子串长度时，能够正确计算长度。例如，对于字符串 ()()，在遇到第一个 ) 时，栈中只有 -1，计算长度为 1 - (-1) = 2。
  const stack = [-1];
  let maxLength = 0;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      stack.push(i); // 左括号的索引入栈
    } else {
      stack.pop(); // 右括号，弹出栈顶元素
      if (stack.length === 0) {
        // 如果栈为空，说明当前右括号没有匹配的左括号，将当前索引 i 压入栈中，作为新的基准。
        stack.push(i);
      } else {
        // 如果栈不为空，计算当前有效括号子串的长度，即 i - stack[stack.length - 1]，并更新 maxLength。
        // maxLength = i - stack[stack.length - 1]; // 错误写法，不能通过用例 "()(()"。
        maxLength = Math.max(maxLength, i - stack[stack.length - 1]);
        console.log('maxLength:', maxLength);
      }
    }
  }

  return maxLength;
}

// 示例
console.log(longestValidParentheses(inputs));