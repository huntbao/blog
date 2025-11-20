
// 这是题目要求的输入格式
let inputs = `
[[1,1,0,0,0];[1,1,0,0,0];[0,0,1,0,0];[0,0,0,1,1]]
`;
const arr = inputs.trim().replace(/\[/g, '').replace(/\]/g, '').split(";").map(str => (
  str.split(',').map((i) => parseInt(i))
));

function findBiggestIsland(arr) {
  const row = arr.length;
  const col = arr[0].length;
  function dfs(i, j) {
    if (i < 0 || i >= row || j < 0 || j >= col || arr[i][j] === 0) {
      return 0;
    }
    arr[i][j] = 0; // 标记为已访问
    return 1 + dfs(i - 1, j) + dfs(i + 1, j) + dfs(i, j - 1) + dfs(i, j + 1);
  }
  let biggest = 0;
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      biggest = Math.max(biggest, dfs(i, j));
    }
  }
  return biggest;
}

console.log(findBiggestIsland(arr));