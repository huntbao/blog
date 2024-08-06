// MinStack 类
class MinStack {
  constructor() {
    this.stack = [];
  }

  push(x) {
    // 进栈，放到栈的顶部
    this.stack.push(x);
  }

  pop() {
    // 出栈，从栈的顶部弹出元素
    return this.stack.pop();
  }

  peek() {
    // 栈的 peek 是取栈的顶部元素
    return this.stack[this.size() - 1];
  }

  size() {
    return this.stack.length;
  }

  empty() {
    return this.size() === 0;
  }
}

// MyQueue 类
class MyQueue {
  constructor() {
    this.in = new MinStack();
    this.out = new MinStack();
  }

  push(x) {
    // 入队
    this.in.push(x);
  }

  pop() {
    // 出队
    this.in2out();
    return this.out.pop();
  }

  peek() {
    // 取队首元素
    this.in2out();
    return this.out.peek();
  }

  empty() {
    return this.in.empty() && this.out.empty();
  }

  in2out() {
    // 将 in 转存到 out
    // 如果 out 为空，则一次性将 in 里面的元素全部转存到 out 里面，这样可以保证进队顺序不被打乱
    // 如果 out 不为空，则此时不能转存 in 里面的元素，不然顺序就乱了
    if (this.out.empty()) {
      while(this.in.size()) {
        this.out.push(this.in.pop());
      }
    }
  }
}

// 这是题目要求的输入格式
let inputs = `
  push,push,peek,pop,empty
  1,2,,,
`;

const [methodStr, parameterStr] = inputs.split('\n');
const methods = methodStr.split(',');
const parameters = parameterStr.split(',');
const outputs = [];
const myQueue = new MyQueue();

methods.forEach((method, idx) => {
  switch (method) {
    case 'push': {
      myQueue.push(parameters[idx]);
      outputs.push('null');
      break;
    }
    case 'peek':
    case 'pop':
    case 'empty': {
      outputs.push(myQueue[method]());
      break;
    }
  }
});

// 输出结果
console.log(outputs.join(','));