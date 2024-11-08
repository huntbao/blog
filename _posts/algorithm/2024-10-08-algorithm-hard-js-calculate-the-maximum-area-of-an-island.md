---
title: 【算法题-困难】计算岛屿最大面积
category: algorithm
tag: algorithm, javascript
permalink: algorithm-hard-js-calculate-the-maximum-area-of-an-island
hidden: true
---

> 困难算法题，计算岛屿最大面积，使用 JavaScript 语言编写

## 题目

给你一个大小为 m x n 的二进制矩阵 grid 。

岛屿 是由一些相邻的 1 (代表土地) 构成的组合，这里的「相邻」要求两个 1 必须在 水平或者竖直的四个方向上 相邻。你可以假设 grid 的四个边缘都被 0（代表水）包围着。

岛屿的面积是岛上值为 1 的单元格的数目。

计算并返回 grid 中最大的岛屿面积。如果没有岛屿，则返回面积为 0 。

示例 1：

输入：grid = [
 [1, 1, 0, 0, 0];
 [1, 1, 0, 0, 0];
 [0, 0, 1, 0, 0];
 [0, 0, 0, 1, 1]
];

输出：4

示例 2：

输入：grid = [[0,0,0,0,0,0,0,0]]

输出：0

### 输入格式

参考下方输入样例，字符串表示的二维数组。例如：[[1,1,0,0,0];[1,1,0,0,0];[0,0,1,0,0];[0,0,0,1,1]]

### 输出格式

数字。例如：4

### 输入样例

```plaintext
[[1,1,0,0,0];[1,1,0,0,0];[0,0,1,0,0];[0,0,0,1,1]]
```

### 输出样例

```plaintext
4
```

## 分析

## 解答

```js
{% include algorithm/2024-10-08-algorithm-hard-js-calculate-the-maximum-area-of-an-island.js %}
```
