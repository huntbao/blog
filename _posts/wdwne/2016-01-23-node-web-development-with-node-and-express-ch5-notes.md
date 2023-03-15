---
title: Web Development with Node and Express Chapter 5 - Quality Assurance
category: wdwne
---

* 测试分单元测试（unit testing）和集成测试（integration testing），系统测试（system testing）可以认为是集成测试的一种类型。 单元测试用来测试单个组件以确保其功能正常，集成测试用来测试多个组件（甚至是整个系统的组件）之间的交互。 一般来说，单元测试适合业务逻辑测试（但也可用来测试表现层），而集成测试对两者都适用。

* 测试工具：
  * 单页面测试：[Mocha](https://mochajs.org/)
  * 跨页面测试：[Zombie.js](http://zombie.js.org/)
  * Linting，用来发现潜在的错误：[JSHint](http://jshint.com/)
  * 死链接测试工具：[LinkChecker](https://github.com/wummel/linkchecker)

* 修改了代码后自动重启服务器的工具：[nodemon](https://github.com/remy/nodemon)，[Grunt 插件](https://github.com/ChrisWren/grunt-nodemon)。

* Node.js 的 BDD / TDD 断言框架：[chai](https://github.com/chaijs/chai)。

* 无头浏览器（headless browser）: [Selenium](http://www.seleniumhq.org/)、[PhantomJS](http://phantomjs.org/)、[Zombie](http://zombie.js.org/)。

* 持续集成（CI，Continuous Integration）：[Travis CI](https://travis-ci.org/)，Jenkins 的 [Node plugin](https://wiki.jenkins-ci.org/display/JENKINS/NodeJS+Plugin)，JetBrains 的 [TeamCity](https://www.jetbrains.com/teamcity/)。
