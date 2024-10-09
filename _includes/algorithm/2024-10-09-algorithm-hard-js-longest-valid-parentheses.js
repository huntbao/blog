
// 这是题目要求的输入格式
let inputs = `
)()(()))
`;

inputs = inputs.trim();

function longestValidParentheses(s) {
  const stack = [-1]; // 初始化栈，放入一个初始值 -1
  let maxLength = 0;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      stack.push(i); // 左括号的索引入栈
    } else {
      stack.pop(); // 右括号，弹出栈顶元素
      if (stack.length === 0) {
        stack.push(i); // 如果栈为空，放入当前右括号的索引
      } else {
        maxLength = Math.max(maxLength, i - stack[stack.length - 1]); // 计算有效括号长度
      }
    }
  }

  return maxLength;
}

// 示例
console.log(longestValidParentheses(inputs));