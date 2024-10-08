
// 这是题目要求的输入格式
let inputs = `
-10,9,20,null,null,15,7
`;
const nodes = inputs.trim().split(',').map(num => isNaN(num) ? null : parseInt(num));

class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function buildTree(nodes) {
  if (!nodes.length) return null;
  const root = new TreeNode(nodes[0]);
  const queue = [root];
  let i = 1;
  while (i < nodes.length) {
    const current = queue.shift();
    if (nodes[i] !== null) {
      current.left = new TreeNode(nodes[i]);
      queue.push(current.left);
    }
    i++;
    if (i < nodes.length && nodes[i] !== null) {
      current.right = new TreeNode(nodes[i]);
      queue.push(current.right);
    }
    i++;
  }
  return root;
}

function maxPathSum(root) {
  let maxSum = -Infinity;

  function maxGain(node) {
    if (node === null) {
      return 0;
    }

    // 递归计算左右子树的最大路径和
    const leftGain = Math.max(maxGain(node.left), 0);
    const rightGain = Math.max(maxGain(node.right), 0);

    // 计算经过当前节点的路径和
    const currentPathSum = node.val + leftGain + rightGain;

    // 更新全局最大路径和
    maxSum = Math.max(maxSum, currentPathSum);

    // 返回从当前节点出发的最大路径和
    return node.val + Math.max(leftGain, rightGain);
  }

  maxGain(root);
  return maxSum;
}

// 示例
const root = buildTree(nodes);
console.log(maxPathSum(root)); // 输出 42