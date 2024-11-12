---
title: 一文了解 Strapi
category: 技术
tag: strapi
permalink: quick-guide-strapi
---

[Strapi](https://strapi.io/) 的官方介绍是：Open-source headless CMS。

上面这句话包含了 3 个关键信息：

1. 开源：Strapi 是一个开源项目，这意味着你可以免费使用它（某些功能可能会受限）。github 地址：[https://github.com/strapi/strapi](https://github.com/strapi/strapi)。
2. Headless：这意味着它不提供前端界面，你需要使用其他技术来构建前端应用。
3. CMS：这意味着 Strapi 适合用来构建 CMS 应用，非 CMS 应用是不适合的。

## 设计理念

Strapi 做的事情大致如下：

1. 提供了一个本地开发环境，让你可以方便的开发和调试。在本地开发环境中，使用 Content-Type Builder 功能，可以创建 Content-Type，这其实就是建模过程，一个 Content-Type 就是一个 Model，可以给这个 Content-Type 添加字段，字段也有类型，和创建数据库表类似，常见的需求肯定都是能配置出来的。在本创建的模型，会保存成一个 schema.json 文件。
2. 本地开发环境创建完模型后，可以将上述 schema.json 文件及其他配置数据部署到 Strapi Cloud 服务器上。当然部署过程中，需要提供一些账号信息，按照提示操作即可。
3. 在 Strapi Cloud 上部署完成后，你就可以使用 API 来获取数据了。API 支持 REST 和 GraphQL 两种方式。比如最常见的就是 CRUD 操作，可以先使用 POST 请求创建一条数据，最后使用 GET 请求来获取数据。当然这些接口的访问权限可以设置，比如公开、认证授权等等。

Strapi Cloud 可以理解为一台服务器，服务端接口已经都部署好了，我们可以使用前端技术（移动端技术也可以）来调用这些接口，这样就能快速创建一个 CMS 应用。

围绕着上述设计理念，Strapi 还提供了非常多的功能，这个也是显而易见需要提供的功能，不然常规 CMS 应用都无法创建。

## 和低代码平台的区别

低代码平台一般会提供一个可视化的界面，让你可以方便的拖拽组件来创建应用，同时低代码平台一般都是包含前端界面的。可以理解为 Strapi 是低代码平台的一种非常轻量级的实现。

## 商业模式

> 注：以下内容是 AI 生成的，仅供参考。

Strapi 采用开源加商业化的双轨制商业模式：

1. 社区版（Community Edition）
   - 完全免费开源
   - 提供核心功能
   - 支持自托管部署
   - 适合个人开发者和小型项目

2. 企业版（Enterprise Edition）
   - 付费订阅制
   - 提供额外的企业级功能：
     - SSO 单点登录
     - 高级角色权限管理
     - 审计日志
     - 优先技术支持
   - 适合大型企业和商业项目

3. Cloud 服务
   - 提供托管服务
   - 按规模付费
   - 包含自动扩展、备份等云服务特性
   - 降低部署和运维成本

这种商业模式让 Strapi 既能保持开源社区的活力，又能通过企业版和云服务获得持续的收入来维持项目发展。

## 国内国情

个人感觉这种产品在国内的存活率会很低，目前也没看到类似的产品。

## 小结

通过 Strapi 来构建 CMS 应用，非常方便，应该能吸引部分开发者和中小企业，但国内用户估计不太会买单。

想体验 Strapi 的开发过程，可以参考官方文档：[https://docs.strapi.io/dev-docs/quick-start](https://docs.strapi.io/dev-docs/quick-start)，按照文档操作即可。
