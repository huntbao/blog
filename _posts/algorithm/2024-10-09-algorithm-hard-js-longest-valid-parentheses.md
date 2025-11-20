---
title: 【算法题-困难】最长有效括号
category: algorithm
tag: algorithm, javascript
permalink: algorithm-hard-js-longest-valid-parentheses
hidden: true
---

> 困难算法题，最长有效括号，使用 JavaScript 语言编写

## 题目

给你一个只包含 `(` 和 `)` 的字符串，找出最长有效（格式正确且连续）括号子串的长度。

### 输入格式

包含 `(` 和 `)` 的字符串

### 输出格式

有效括号子串的长度

### 输入样例

输入样例一：

```plaintext
(()
```

输入样例二：

```plaintext
)()(()))
```

输入样例三：

```plaintext

```

### 输出样例

输出样例一：

```plaintext
2
```

输出样例二：

```plaintext
6
```

输出样例三：

```plaintext
0
```

## 分析

1. 初始化一个栈，用于存储括号的索引。
2. 初始化一个变量 `max_length`，用于记录最长有效括号子串的长度。
3. 将栈初始化为 `[-1]`，以便处理边界情况。
4. 遍历字符串的每个字符及其索引：

* 如果字符是 `(`，将其索引压入栈中。
* 如果字符是 `)`，弹出栈顶元素。
  * 如果栈为空，将当前索引压入栈中。
  * 如果栈不为空，计算当前有效括号子串的长度，并更新 `max_length`。

5. 返回 `max_length`。

## 解答

```js
{% include algorithm/2024-10-09-algorithm-hard-js-longest-valid-parentheses.js %}
```

## 解释
