---
title: 聊聊 SaaS 定制化
category: sass
tag: saas customization
permalink: saas-customization
---

说到 SaaS 软件，有一个问题会不断被拿出来讨论：是否要做定制化。

定制化，是指给某个或者某几个客户量身定制的功能模块，它不具备通用性，比如某个客户公司有一个内部系统想和我们的 SaaS 系统打通，我们需要增加一个特殊字段。如果把这样的功能添加到产品中，就会变成累赘，是一个再也甩不掉的包袱，所以有人会说定制化是 SaaS 软件的毒瘤。

那是否就应该坚决抵制定制化需求？比如现在公司资金短缺，有个大客户说做完就给100万，做还是不做？绝大多数公司都无法抵挡住这种诱惑，包括大公司内部的创业团队。

接定制化需求，无非有以下几种心理：

1. 做完这票，下次不做了。
2. 对方是家大公司，在推广产品的时候可以拿来当背书。
3. 这个功能也不是那么奇葩，对方是大公司，说不定以后会遇到相同需求的客户，所以把功能直接做进了产品。

更多时候其实都是自欺欺人。

为了公司存活，接一些定制化需求，无可厚非。

为了在前期积累一些标杆客户，接一些定制化需求，也无可厚非。特别是在开拓新行业的时候，就算不收取费用，也更应该主动地去接一些定制化需求，以完成产品功能的原始积累。

不过，不能没有自己的产品规划，不能没有自己的产品灵魂，不能没有自己的战略打法，毕竟我们不是外包公司，做项目外包，就是赚人头费，这和 SaaS 软件的初衷是完全背道而驰的，SaaS 软件公司做的是标品软件。

所以，做不做定制需求，是要看场景的，是要看公司的发展阶段的，不能一概而论，不然这个问题也不会时不时地被拿出来讨论。不过，我们不能一直没完没了的接定制化需求，研发资源不能被分散，创始人的精力更不能被分散。

SaaS 软件可以分为垂直行业类 SaaS 和通用工具类 SaaS，行业软件要看公司创始人对该行业的了解有多深入，通用工具类软件更加考验创始人各个方面的能力。

SaaS 软件非常考验产品能力，实际情况是想找到又有行业背景又懂产品的人才太少了，任何行业都需要非常长的时间积累，传统行业的人在描述需求的时候，可能都无法表达清楚，因为双方的沟通语言是不一样的。

SaaS 软件要提供 SOP，引导客户改变他们的工作方式，帮助客户提升工作效率。我相信很多购买 SaaS 软件的公司，本身就是想来学习业界的先进工作以及管理方法的。SaaS 软件只有做标品才能成功，做标品的回报才是最为丰厚的。


## 定制化能力更有竞争力
那么，对于客户来说，一款可定制和一款不可定制化的产品，其他功能差不多，价格也相差不大或者在预算范围内，那客户会选择哪款软件？我觉得就算目前客户没有定制化的需求，应该也会选择可定制化的软件。有了可定制化的能力，就能覆盖更多的长尾需求，在知识经济时代，长尾需求的利润占了近三分之一，是非常有价值的。标品有规模效应，个性化有长尾效应。


## 注意伪定制化
我们要非常清楚地知道哪些是真的定制化需求，哪些是其实并不是定制化需求。比如某个客户想更改主题色，这算定制化需求吗？每家公司都有自己的Logo和主题色，改颜色是很正常的需求，这就不能算定制化需求，这是产品能力缺失。


## 定制化的技术实现
根据前面的讨论，定制化需求有时是无法避免的，作为研发人员来说，应该如何设计技术架构呢？

要实现定制化的需求，最容易想到的就是增加配置选项，比如增加一张针对某个功能模块的设置页面，用户可以按照自己的偏好进行设置。

但是，随着功能模块的增加，越多越多的设置选项，给用户造成的困挠也越来越大，再加上一般设置选项也没有所见即所得的效果，就算是研发人员都不是非常清楚每个选项代表的是什么意思。

定制化，需要用户来设置，这一点是无法缺少的。

我们需要的是一种所见即所得的设置页面，并且设置页面的功能和实际功能完全一致。

我们可以使用低代码的思想来解决这个问题。目前业界的低代码平台实现都很类似，比如会内置丰富的组件，选中某个组件时，右侧会出现该组件的配置面板，可以设置该组件的一些配置选项。所以，低代码平台的组件设置也可以做为设置界面，如果我们把功能模块封装成组件，似乎问题都解决了：组件设置是所见即所得的，组件设置和组件功能完全一致，因为就是同个组件。

运用低代码的思想来解决 SaaS 软件中的定制化需求，从技术架构上来看似乎是行得通的，当然技术上还有很多环节需要考虑，本文先不展开了，等有了实际可行并且已落地的方案后再另写一篇文章来阐述技术方案。
