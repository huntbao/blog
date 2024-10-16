
// 这是题目要求的输入格式
let inputs = `
6,5,4,6
`;

inputs = inputs.trim().split(',').map(Number);

function decode(encoded) {
  const n = encoded.length + 1;
  let totalXor = 0;
  let encodedXor = 0;

  // 计算 1 到 n 的所有整数的异或值
  for (let i = 1; i <= n; i++) {
    totalXor ^= i;
  }

  // 计算 encoded 数组中所有奇数索引位置的元素的异或值
  for (let i = 1; i < n - 1; i += 2) {
    encodedXor ^= encoded[i];
  }

  // 计算 perm 的第一个元素
  const first = totalXor ^ encodedXor;

  // 还原 perm 数组
  const perm = new Array(n);
  perm[0] = first;
  for (let i = 1; i < n; i++) {
    perm[i] = perm[i - 1] ^ encoded[i - 1];
  }

  return perm;
}

console.log(decode(inputs).join(',')); // 输出 2,4,1,5,3