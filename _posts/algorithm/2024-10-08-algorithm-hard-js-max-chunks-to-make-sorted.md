---
title: 【算法题-困难】最多能完成排序的块
category: algorithm
tag: algorithm, javascript
permalink: algorithm-hard-js-max-chunks-to-make-sorted
hidden: true
---

> 困难算法题，最多能完成排序的块，使用 JavaScript 语言编写

## 题目

给定一个整数数组 arr。将 arr 分割成若干块，并将这些块分别进行排序。之后再连接起来，使得连接的结果和按升序排序后的原数组相同。

返回能将数组分成的最多块数。

### 输入格式

1. 输入整数数列，元素之间以空格分开
2. 其中数组长度为n，1<=n<=1000,
3. 数组元素 1 <= arr[i], k <= 100，数组元素可有重复整数

### 输出格式

数组能分成的最多块数

### 输入样例

输入样例1：

```plaintext
5 4 3 2 1
```

输入样例2：

```plaintext
2 1 3 4 4
```

### 输出样例

输出样例1：

```plaintext
1
```

将数组分成2块或者更多块，都无法得到所需的结果。

例如，分成 [5, 4], [3, 2, 1] 的结果是 [4, 5, 1, 2, 3]，这不是有序的数组。

输出样例2：

```plaintext
4
```

可以把它分成两块，例如 [2, 1], [3, 4, 4]。

然而，分成 [2, 1], [3], [4], [4] 可以得到最多的块数。

代码长度限制

## 分析


## 解答

```js
{% include algorithm/2024-10-08-algorithm-hard-js-max-chunks-to-make-sorted.js %}
```

## 解释

