
// 这是题目要求的输入格式
let inputs = `
4,1000
`;

inputs = inputs.trim().split(',').map(BigInt);

var superPalindromesInRange = function(left, right) {
  let checkPalindromes = function(num) {
    return Array.from(num.toString()).reverse().join("") === num.toString()
  };

  // 构造奇数、偶数回文数，比如 123 -> 12321, 123321
  let makePalindromes = function(num) {
    let numStr = num.toString();
    let revNumStr = Array.from(numStr).reverse().join("");
    // num: 20000  ->  [2000000002n, 200000002n] 都是回文数
    return [BigInt(numStr + revNumStr), BigInt(numStr + revNumStr.slice(1))];
  };

  let ans = []; 
  // 从 1 开始构造回文数
  // 因为最大就是20位数，所以这里构造回文数肯定不会超 100000，因为 100000 的回文数是 100000000001，它的平方是 10000000000200000000001n，已经超过 20 位数了
  for(let i = 1; i < 100000; i++) {
    let [p1, p2] = makePalindromes(i);
    let pp1 = BigInt(p1 * p1);
    let pp2 = BigInt(p2 * p2);
      
    if(pp1 >= left && pp1 <= right && checkPalindromes(pp1)) {
      ans.push(pp1.toString());
    }

    if(pp2 >= left && pp2 <= right && checkPalindromes(pp2)) {
      ans.push(pp2.toString());
    }
  }
    
  return ans.sort((a, b) => a - b);
};


// 示例
console.log(`[${superPalindromesInRange(inputs[0], inputs[1]).join(', ')}]`);