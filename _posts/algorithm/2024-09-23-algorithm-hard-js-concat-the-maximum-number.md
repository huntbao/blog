---
title: 【算法题-困难】拼接最大数
category: algorithm
tag: linked list, javascript
permalink: algorithm-hard-js-merge-two-linked-list
---

> 困难算法题，拼接最大数，使用 JavaScript 语言编写

## 题目

给定长度分别为 m 和 n 的两个数组，其元素由 0-9 构成，表示两个自然数各位上的数字。

现在从这两个数组中选出 k (0 <= k <= m + n) 个数字拼接成一个新的数，要求从同一个数组中取出的数字保持其在原数组中的相对顺序。
求满足该条件的最大数。结果返回一个表示该最大数的长度为 k 的数组。

### 输入格式

输入三个行内容：

* 第一行是数组nums1，元素内容用逗号分隔；数组最大长度为1000。
* 第二行是数组nums2，元素内容用逗号分隔；数组最大长度为1000。
* 第三行是长度k；

### 输出格式

返回一个表示该最大数的长度为 k 的数组，数组元素用逗号隔开。

### 输入样例

```plaintext
3,4,6,5
9,1,2,5,8,3
5
```

### 输出样例

```plaintext
9,8,6,5,3
```

## 提示

* 1 <= nums1.length, nums2.length <= 1000
* 0 <= nums1[i], nums2[i] <= 9

## 分析

## 解答

```js
{% include algorithm/2024-09-23-algorithm-hard-js-concat-the-maximum-number.js %}
```
