---
title: 【算法题-困难】按位与为零的三元组
category: algorithm
tag: algorithm, javascript
permalink: algorithm-hard-js-triplets-with-bitwise-and-equal-to-zero
hidden: true
---

> 困难算法题，按位与为零的三元组，使用 JavaScript 语言编写

## 题目

给你一个整数数组 nums ，返回其中 按位与三元组 的数目。

按位与三元组 是由下标 (i, j, k) 组成的三元组，并满足下述全部条件：

* 0 <= i < nums.length
* 0 <= j < nums.length
* 0 <= k < nums.length
* nums[i] & nums[j] & nums[k] == 0 ，其中 & 表示按位与运算符。

提示：

* 1 <= nums.length <= 1000
* 0 <= nums[i] < 2^16

注意：时间复杂度是 O(n^3)的算法，会超出时间限制。

### 输入格式

整数数组nums，以",”分隔字符串形式作为输入

### 输出格式

一个数字，字符串形式

### 输入样例

```plaintext
2,1,3
```

### 输出样例

```plaintext
12
```

## 分析

要解决这个问题，我们需要找到一种比 O(n^3) 更高效的方法。我们可以利用按位与运算的性质和哈希表来优化算法。

预处理两两组合的按位与结果：我们可以先计算所有可能的两两组合的按位与结果，并将这些结果存储在一个哈希表中。
检查第三个数：对于每个数 nums[k]，我们可以检查它与哈希表中所有按位与结果的组合是否等于 0。如果是，则说明存在一个三元组 (i, j, k) 满足条件。

## 解答

```js
{% include algorithm/2024-10-09-algorithm-hard-js-triplets-with-bitwise-and-equal-to-zero.js %}
```

## 解释

1. 预处理两两组合的按位与结果：我们遍历数组中的每一对元素 (nums[i], nums[j])，计算它们的按位与结果，并将结果存储在哈希表 countMap 中。哈希表的键是按位与结果，值是该结果出现的次数。
2. 检查第三个数：我们遍历数组中的每一个元素 nums[k]，并检查它与哈希表中所有按位与结果的组合是否等于 0。如果是，则说明存在一个三元组 (i, j, k) 满足条件。我们将这些组合的频次累加到 count 中。
3. 返回结果：最终返回满足条件的三元组的数量 count。

通过这种方法，我们可以有效地计算出满足条件的按位与三元组的数目，时间复杂度为 O(n^2)，比 O(n^3) 更高效。
