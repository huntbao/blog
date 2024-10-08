---
title: 【算法题-困难】按格式合并两个链表
category: algorithm
tag: linked list, javascript
permalink: algorithm-hard-js-merge-two-linked-list
---

> 困难算法题，按格式合并两个链表，使用 JavaScript 语言编写

## 题目

给定一个由不同正整数组成的非空数组 nums，考虑下面的构图：

有 nums.length 个节点，按照从 nums[0]到 nums[nums.length-1]标记；

只有当 nums[i] 和 nums[j] 共用一个大于 1 的公因数时，nums[i] 和 nums[j] 之间才有一条边。

返回构图中最大连通组件的大小。

### 输入格式

输入为数组元素，空格分隔

### 输出格式

输出最大连通组件的大小

### 输入样例

```plaintext
4 6 15 35
```

### 输出样例

```plaintext
4
```

## 分析

## 解答

```js
{% include algorithm/2024-09-23-algorithm-hard-js-maximum-component-size-by-common-factor.js %}
```
