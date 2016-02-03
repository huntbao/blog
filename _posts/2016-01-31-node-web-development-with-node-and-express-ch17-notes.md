---
layout: post
title: Web Development with Node and Express Chapter 17 - Implementing MVC in Express
---

* `Model`：最重要的组成部分，不应该掺杂任何展示或者和用户交互的代码。在理想情况下，应该和持久层完全隔离，这可以做到，但需要花费相当大的代价，有时还可能得不偿失。

* `View-Model`：`Model` 和 `View` 之间的数据处理逻辑层，这样就不会影响到真正的 Model，保持了它的完整性。这一层的逻辑还能复用。

* `Controller`：负责处理用户交互和根据用户交互展示相应的视图。有点像路由，但比它多了一些功能。
