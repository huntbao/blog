---
layout: post
title: Web Development with Node and Express Chapter 4: Tidying Up
---

* 版本控制的三大好处：

  1. 文档：通过回顾项目的历史记录，可以知道曾经做过哪些重要决定、模块的开发顺序等信息。

  2. 归属：有了错误可以马上找到提交代码的相关人员，对于团队协作项目来说非常重要。

  3. 实验：可以突然决定新建分支开发某个功能，如果实验失败，就丢失掉所做的更改，如果成功，就把更改合进代码库。

* 有些编辑器会产生以 `~` 结尾的备份文件，在 `.gitignore` 文件中添加 `*~` 可以将其忽略掉。

* 苹果 OS X 系统中的 `.DS_Store` 文件用于储存文件夹的自定义属性，比如图标的位置、选择了什么背景图片等。全称是 `Desktop Services Store`。

* npm 生成的文件夹叫 `node_modules` 而不是 `npm_packages`，有点遗憾，因为 Node 模块是一个不同的概念。

* `package.json` 文件有两个作用，一是描述项目的依赖模块，模块版本号的表示规则：[semver documentation](https://docs.npmjs.com/misc/semver)；二是描述项目的元信息：[package.json](https://docs.npmjs.com/files/package.json)。

* `README.md` 文件用于描述网站的整体架构以及一些新人需要的关键信息。
