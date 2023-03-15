---
title: Web Development with Node and Express Chapter 20 - Debugging
category: wdwne
---

* `debugging` 这词并不准确，它会和“缺陷”联系在一起，用 `exploring` 似乎更准确一些。

* 调试的基本原理：How often have I said to you that when you have eliminated the impossible, whatever remains, however improbable, must be the truth? — Sir Authur Conan Doyle

* 调试最基本的原理是排除法，它有以下常见的形式

  * 系统性地注释或者禁用代码块。

  * 编写可以被单元测试覆盖的代码，单元测试本身会提供如何使用排除法的信息结构。

  * 分析网络以确定问题是在客户端还是服务端。

  * 先使用先前能工作的输入信息，然后每次修改一小点直到问题暴露。

  * 使用版本控制工具回到适当的时间点，保持每次较小的时间跨度，直到问题消失。

  * 模拟功能以排除复杂的子系统。

  * 最后，排除法也不是银弹，问题经常是由于多个组件之间互相交互产生的：排除或者模拟某个组件的代码，问题是会消失，但问题也不会存在单个组件中。排除法只能缩小范围。

* REPL：read-eval-print loop

* node debug：以 debug 模式在命令行中运行程序，如果不需要在命令行中 debug（比如使用 [Node Inspector](https://github.com/node-inspector/node-inspector)），则使用：node --debug
