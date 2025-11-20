---
title: 【算法题-困难】二叉树的最大路径和
category: algorithm
tag: algorithm, javascript
permalink: algorithm-hard-js-maximum-path-sum-in-binary-tree
hidden: true
---

> 困难算法题，二叉树的最大路径和，使用 JavaScript 语言编写

## 题目

二叉树中的“路径”被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。同一个节点在一条路径序列中至多出现一次。该路径至少包含一个节点，且不一定经过根节点。

“路径和”是路径中各节点值的总和。

给你一个二叉树的根节点 root ，返回其最大路径和。

### 输入格式

树上的节点数满足 0 <= n <= 1000, 每个节点的值满足 -1000 <= val <= 1000

（注：null节点的左右叶子不会再打印 null）

### 输出格式

输出最大路径的和

### 输入样例

```plaintext
-10,9,20,null,null,15,7
```

### 输出样例

```plaintext
42
```

## 分析

要实现这个算法，我们可以使用递归的方法来遍历二叉树，并在每个节点计算包含该节点的最大路径和。我们需要一个辅助函数来计算从当前节点出发的最大路径和，同时更新全局最大路径和。

## 解答

```js
{% include algorithm/2024-10-08-algorithm-hard-js-maximum-path-sum-in-binary-tree.js %}
```
