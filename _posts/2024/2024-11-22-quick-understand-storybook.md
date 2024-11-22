---
title: 一文了解 Stroybook
category: 技术
tag: storybook
permalink: quick-understand-storybook
---

## 简介

[Storybook](https://github.com/storybookjs/storybook) 是一个 UI 组件开发环境，它允许开发者在独立的环境中开发和展示组件，而不需要在应用中运行。Storybook 有助于开发者在不同状态、变量、事件等情况下展示组件，方便开发者调试和展示组件。

Storybook 是一个开源项目，目前由 [Chromatic](https://www.chromatic.com) 公司维护，商业模式主要有以下几种方式：

1. 企业支持和服务：提供企业级的支持和服务，包括优先技术支持、定制开发和培训等。
2. 赞助和捐赠：接受来自个人和企业的赞助和捐赠，以支持项目的持续发展。
3. 商业插件和扩展：开发和销售高级功能的插件和扩展，满足企业用户的特定需求。

## 模板项目

想要了解一个项目的功能，最好的方式就是按照官方的介绍实际体验一下。

1. 运行 `npx storybook@latest init` 命令可以安装 Storybook 模板项目，技术栈选择 `React + Vite`。
2. 运行 `npm run dev` 命令可以启动项目。
3. 运行 `npm run storybook` 命令可以打开 Storybook 开发界面。

我们今天要讨论的是第 3 个命令，也就是 Storybook 的开发界面。

Storybook 模板项目内置了三个组件：`Button.tsx`、`Header.tsx` 和 `Page.tsx`。这是 3 个 React 组件，不需要任何 Storybook 功能就能正常运行，就是很普通的业务组件。

在组件代码文件所在的目录中，还有三个文件：`Button.stories.ts`、`Header.stories.ts` 和 `Page.stories.ts`，它们是组件的 storybook 文件，用于描述组件的不同状态、变量、事件等情况，并且可以在开发环境中展示，可以用来验证组件的逻辑是否实现正确，代码非常直观易懂，就不再展开。

![dev-button](/public/images/storybook/dev-button.png)

此外，会自动生成组件文档：

![dev-docs](/public/images/storybook/dev-docs.png)

模板项目运行很简单，效果很惊艳，忍不住要给它点个赞。

## 核心功能

组件开发环境是 Storybook 的核心功能，它有以下几个功能：

- `Controls` 面板的具体功能如下：
  - `Name` 列就是传给组件的属性值列表，比如 `primary`、`label`、`size`、`color` 等。
  - `Control` 列就是属性值对应的组件，Storybook 会根据属性值类型渲染成不同的组件，比如布尔类型的属性值会渲染成开关组件、字符串类型的属性值会渲染成输入框组件、颜色类型的属性值会渲染成颜色选择器组件等。这里需要说明下，我们知道在 JavaScript 中，并没有颜色类型的属性值，在 `Button.tsx` 组件中，颜色就是一个普通的字符串类型。所以需要在 `Button.stories.ts` 文件中需要给颜色类型增加一个额外的属性值，比如 `control: { type: 'color' }`，这是 Storybook 自身的功能，不会影响业务代码。

- `Actions` 面板的具体功能如下：
  - 事件捕获：捕获组件触发的事件，例如 onClick、onMouseEnter、onMouseLeave 等。
  - 事件日志：记录并显示这些事件的触发情况，方便开发者查看和调试。
  - 交互测试：帮助开发者验证组件的交互逻辑是否正确。

- `Visual tests` 面板的具体功能如下：
  - 视图测试，这个功能依赖 Chromatic 云端服务器，需要在本地运行命令，将代码上传到 Chromatic 云端，Chromatic 会截取代码修改前后的组件 UI 快照，然后对比两个快照的差异，生成变更报告，方便开发者查看组件的变更情况。

- `Interactions` 面板的具体功能如下：
  - 交互行为测试，这个功能会自动运行组件的 UI 测试用例，用例写在 stories 文件中，如果测试用例通过，会显示绿色的勾，如果测试用例不通过，会显示红色的叉，方便开发者查看组件的测试情况。

![dev-interactions-succeed](/public/images/storybook/dev-interactions-succeed.png)

![ddev-interactions-failed](/public/images/storybook/dev-interactions-failed.png)

## 小插曲

我在体验 Storybook 模板项目的过程，一开始并没有发现 `Page.stories.ts` 文件编写了交互行为测试代码，一直在看 `Button.stories.ts` 代码。

作为一名前端开发者应该有的嗅觉，看到了 `Interactions` 面板后，就研究了下官方文档说明 [Component tests](https://storybook.js.org/docs/writing-tests/component-testing?renderer=react)，然后自然是想要如何给这个 `Button.tsx` 按钮组件添加交互行为测试。

我的想法非常简单，在 `Button.tsx` 组件中添加了一个 `count` 状态，然后给按钮添加了一个 `onClick` 事件，每次点击按钮，`count` 状态加 1，然后在 `Button.stories.ts` 文件中添加了一个测试用例，用来验证按钮点击事件是否正确。

我给 `button` 元素添加了一个 `onClick` 方法，代码如下：

![ddev-interactions-failed](/public/images/storybook/button-interaction-code.png)

但写完发后发现点击事件不生效，排查后发现是因为我加的 `onClick` 方法被传入的参数 `props` 中的 `onClick` 默认值给覆盖了。为了快速验证效果，我就把 `props` 相关的代码都删除了，点击事件就生效了。

然后我就在 `Button.stories.ts` 文件中添加了一个测试用例，很完美地跑通用例后，心情是非常愉悦的。

然后我就想着如何通过命令行运行测试用例，继续研究了下官方文档说明 [Component tests](https://storybook.js.org/docs/writing-tests/component-testing?renderer=react#execute-tests-with-the-test-runner)，按照文档提示运行 `npm run test-storybook` 命令后，发现测试用例居然失败了！！！

我就很纳闷，明明在 Storybook 开发界面中测试用例是通过的，为什么在命令行中测试用例就不通过了？？？

仔细看了报错信息，不通过的用例是 `Page.stories.ts` 文件中的用例，因为我把 `Button.tsx` 组件的代码改坏了，导致 ``Page.stories.ts` 组件中的用例不通过。

这是一个很完美的“犯罪”现场：由于修改了老的业务代码导致其他地方的老功能受到了影响，这和我们平时开发业务代码时的情况是一样的，我见过太多这种案例了，相信看文章的你也一定遇到过。

## 价值总结

总结下 Storybook 的价值：

- 测试代码独立于业务代码，不会影响业务代码的正常运行。
- 能自动生成组件文档，方便开发者查看组件的属性、方法、事件等。
- 有 Visual tests，方便开发者查看组件的 UI 变更情况。
- 有 Interactions，方便开发者编写组件的交互行为测试用例。
- 可以集中管理项目中的所有组件。
- 提供独立的开发环境，不依赖业务代码就能开发和调试组件，大大地提升了开发效率。
- 可以对组件开发规范进行约束，便于团队协作开发，提升组件开发效率和质量，提升团队成员在组件开发方面的心智模型，提升团队整体的技术水平。

## 是否值得

前面分析了 Storybook 的核心功能和价值，那么是否值得在实际项目中使用呢？

任何事物都有两面性，Storybook 也不例外，它的缺点有以下几点：

- 有学习门槛：Storybook 有很多功能，需要花时间学习，不是一蹴而就的。
- 有维护成本：测试用例需要花时间维护。
- 有性能问题：在大型项目中，Storybook 的启动和运行速度可能会较慢，影响开发效率。
- 有复杂性：在某些项目中，特别是那些使用了自定义构建工具或配置的项目，集成 Storybook 可能会遇到一些兼容性问题，需要额外的配置和调整。
- 有局限性：虽然 Storybook 提供了丰富的功能，但在某些特定场景下，可能无法完全满足所有需求，需要开发者自行扩展或寻找替代方案。

那结合 Storybook 的价值和缺点，是否值得在实际项目中使用呢？

其实要不要用某个工具或者项目，并不是由人决定的，而是由业务需求决定的，理解这一点是非常重要的。

比如用 React 来开发一个简单的静态页面，那就用不着引入数据管理库。但在实际开发中，有些同学就不管三七二十一，一上来就用数据管理库，这完全是个人的技术追求和兴趣，和业务需求无关。后果就是增加了项目的复杂度，增加了维护成本，可能还会延期交付项目。如果你是团队的技术负责人，一定要及时制止这种行为，因为这是不负责任的行为。

在我看来，Storybook 适合大型 Web 项目，比如[网易七鱼](https://qiyukf.com/)这样的大型 SaaS 项目，我们有非常多的业务组件，有很多开发者协作开发，项目已经迭代了十多年，经常发生改坏老功能的情况。在这样的情况下，代码质量是第一位的，重要性甚至超过了开发效率。如果开发新功能就破坏老功能，那客户的体验就会受到影响，给客户造成损失还要赔偿，任何公司都无法接受。

## 如何落地

那么，如何在大型项目中落地 Storybook 呢？

以下是我能给到的一些建议：

- 在团队中推举一名最合适的开发者，首先他自己就有非常高的意愿、兴趣和信仰，愿意花业余时间学习和实践。
- 挑一个典型项目来接入 Storybook，成功接入并稳定运行一段时间。
- 在质量和开发效率提升方面，要有一定的量化数据，这样才能说服团队中的其他同学。
- 制定一套规范，比如组件的命名规范、组件的目录结构规范、组件的文档规范、组件的测试规范等，并沉淀为模板、文档、工具等。
- 由这名开发者负责给团队中的其他同学进行组件开发的培训，让他们了解 Storybook 的核心功能和价值。
- 推广到其他项目，最终一定是要在整个团队中推广，这样才能真正提升团队的整体技术水平。

## 结语

Storybook 是一个非常优秀的 UI 组件开发环境，它能够规范组件研发规范，能提升组件研发效率，能在一定程度上提升产品质量。

如果你有以上烦恼，那么建议你再花点时间深入调研一下，看看是否适合你的项目。
