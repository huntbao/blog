---
title: 【算法题-困难】不相交的线
category: algorithm
tag: algorithm, javascript
permalink: algorithm-hard-js-non-intersecting-lines
---

> 困难算法题，不相交的线，使用 JavaScript 语言编写

## 题目

在两条独立的水平线上按给定的顺序写下 nums1 和 nums2 中的整数。

现在，可以绘制一些连接两个数字 nums1[i] 和 nums2[j] 的直线，这些直线需要同时满足满足：

nums1[i] == nums2[j]

且绘制的直线不与任何其他连线（非水平线）相交。

请注意，连线即使在端点也不能相交：每个数字只能属于一条连线。

以这种方法绘制线条，并返回可以绘制的最大连线数。

1 <= nums1.length, nums2.length <= 500

1 <= nums1[i], nums2[j] <= 2000

### 输入格式

每组输入为两行，表示nums1和nums2两个数组。每行有n+1个数字，数字间用空格分开，第一个数字表示数组个数n，后面跟n个数字；如2 2 3，表示数组有2个元素，元素值为2和3

### 输出格式

输出最多能绘制不想交线的条数。

### 输入样例

输入样例一：

```plaintext
3 1 4 2
3 1 2 4
```

输入样例二：

```plaintext
6 1 3 7 1 7 5
5 1 9 2 5 1
```

### 输出样例

```plaintext
2
```

```plaintext
2
```

## 分析

## 解答

```js
{% include algorithm/2024-10-08-algorithm-hard-js-non-intersecting-lines.js %}
```
