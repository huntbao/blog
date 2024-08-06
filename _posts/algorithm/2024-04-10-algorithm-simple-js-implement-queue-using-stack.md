---
title: 【算法题-简单】使用栈实现队列
category: algorithm
tag: stack, queue, javascript
permalink: algorithm-simple-js-implement-queue-using-stack
---

> 简单算法题，使用栈模拟队列的功能，使用 JavaScript 语言编写

## 题目

使用两个栈实现先入先出队列。队列应当支持一般队列支持的所有操作（`push`、`pop`、`peek`、`empty`）。

实现 `MyQueue` 类：

* `push(number x): void` 将元素 x 推到队列的末尾
* `pop(): number` 从队列的开头移除并返回元素
* `peek(): number` 返回队列开头的元素
* `empty(): boolean` 如果队列为空，返回 `true`，否则，返回 `false`

### 说明

* 只能使用标准的栈操作，即只有 push to top、peek/pop from top、size 和 is empty 操作是合法的
* 因为 JavaScript 中没有栈，需要自己实现栈 `MinStack`

### 输入格式

* 第一行输入是操作的序列，即 `MinStack` 类的方法名，以逗号分隔
* 第二行输入是成员函数所对应的参数，若没有参数则输入为 []

### 输出格式

输出为对应序列中每个操作的返回值

### 输入样例

```plaintext
push,push,peek,pop,empty
1,2,,,
```

### 输出样例

```plaintext
null,null,1,1,false
```

## 解释

```js
MyQueue myQueue = new MyQueue();
myQueue.push(1); // queue is: [1]
myQueue.push(2); // queue is: [1, 2] (leftmost is front of the queue)
myQueue.peek(); // return 1
myQueue.pop(); // return 1, queue is [2]
myQueue.empty(); // return false
```

## 分析

* 栈的特点是先进后出，队列的特点是先进先出
* JavaScript 中没有栈，需要自己实现栈 `MinStack`，可以使用数组来模拟栈

## 解答

```js
{% include algorithm/2024-04-10-algorithm-simple-js-implement-queue-using-stack.js %}
```
