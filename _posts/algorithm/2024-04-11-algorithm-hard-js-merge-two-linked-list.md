---
title: 【算法题-困难】按格式合并两个链表
category: algorithm
tag: linked list, javascript
permalink: algorithm-hard-js-merge-two-linked-list
---

> 困难算法题，按格式合并两个链表，使用 JavaScript 语言编写

## 题目

给定两个链表：

* $L_{1} ​= a_{1}​ → a_{2} ​→ ⋯ → a_{n-1} ​→ a_{n}$​
* $L_{2}​ = b_{1}​ → b_{2} ​→ ⋯ → b_{m-1} ​→ b_{m}$​，其中 n ≥ 2m

需要将较短的链表 $L_{2}$ ​反转并合并到较长的链表 $L_{1}$ ​中，使得合并后的链表如下形式：$a_{1}​ → a_{2} ​→ b_{m} ​→ a_{3}​ → a_{4} ​→ b_{m-1} → … $​

> 合并规则：在长链表中每隔两个元素，将短链表中的元素倒序插入
>
> 例如：给定一个较长链表 $1 → 2 → 3 → 4 → 5$ ，另外一个较短链表 6 → 7，需要输出 $1 → 2 → 7 → 3 → 4 → 6 → 5$

### 输入格式

第一行包含两个链表的第一个节点地址（不确定哪个链表更长），以及两个链表的总节点数 N(≤100000)。节点地址用一个 5 位非负整数表示（可能有前导 0），空地址 NULL 用 −1 表示

> 例如：00100 01000 7。其中 00100 表示第一个链表的首个节点地址，01000 表示第二个链表的首个节点地址，7 表示两个链表的总节点数。

接下来 N 行，每行描述一个节点的信息，格式为 `Address Data Next`。其中 Address 是节点地址，Data 是一个绝对值不超过 100000 的整数，Next 是下一个节点的地址。保证两个链表都不为空，且较长的链表至少是较短链表长度的两倍

### 输出格式

对于每个测试用例，按顺序输出合并后的结果链表。每个结点占一行，按输入的格式输出

### 输入样例

在这里给出一组输入。例如：

```plaintext
00100 01000 7
02233 2 34891
00100 6 00001
34891 3 10086
01000 1 02233
00033 5 -1
10086 4 00033
00001 7 -1
```

### 输出样例

在这里给出相应的输出。例如：

```plaintext
01000 1 02233
02233 2 00001
00001 7 34891
34891 3 10086
10086 4 00100
00100 6 00033
00033 5 -1
```

## 分析

* JavaScript 中没有链表，需要模拟

## 解答

```js
{% include algorithm/2024-04-11-algorithm-hard-js-merge-two-linked-list.js %}
```