---
title: 【算法题-困难】无重复字符的最长子串
category: algorithm
tag: algorithm, javascript
permalink: algorithm-hard-js-longest-substring-without-repeat-chars
---

> 困难算法题，无重复字符的最长子串，使用 JavaScript 语言编写

## 题目

给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。

### 输入格式

一个字符串 s

### 输出格式

一个数字，表示最长子串的长度

### 输入样例

输入样例一：

```plaintext
abcabcbb
```

输入样例二：

```plaintext
bbbbb
```

输入样例三：

```plaintext
pwwkew
```

### 输出样例

输出样例一：

```plaintext
3
```

解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。

输出样例二：

```plaintext
1
```

解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。

输出样例三：

```plaintext
3
```

解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。

请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。

## 分析

详细步骤

1. 初始化：
  * 使用一个哈希表 `map` 来存储字符及其对应的索引。
  * 初始化两个指针 `left` 和 `right`，分别表示当前窗口的左右边界。
  * 初始化变量 `maxLength` 来记录最长子串的长度。

2. 遍历字符串：
  * 使用 `right` 指针遍历字符串 `s`。
  * 如果当前字符 `s[right]` 已经在哈希表 `map` 中，并且其索引大于等于 `left`，则更新 `left` 为 `map[s[right]] + 1`。
  * 将当前字符 `s[right]` 及其索引存入哈希表 `map`。
  * 计算当前窗口的长度 `right - left + 1`，并更新 `maxLength`。

3. 返回结果：
  * 返回 `maxLength`，即最长不含重复字符的子串的长度。

## 解答

```js
{% include algorithm/2024-10-09-algorithm-hard-js-longest-substring-without-repeat-chars.js %}
```

## 解释

1. 初始化：
  * `map` 用于存储字符及其索引。
  * `left` 和 `right` 指针用于表示当前窗口的左右边界。
  * `maxLength` 用于记录最长子串的长度。

2. 遍历字符串：
  * 遍历字符串 `s`，使用 `right` 指针。
  * 如果当前字符 `s[right]` 已经在 `map` 中，并且其索引大于等于 `left`，则更新 `left` 为 `map.get(s[right]) + 1`。
  * 将当前字符 `s[right]` 及其索引存入 `map`。
  * 计算当前窗口的长度 `right - left + 1`，并更新 `maxLength`。

3. 返回结果：
  * 返回 `maxLength`，即最长不含重复字符的子串的长度。