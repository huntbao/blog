---
title: 重写思考
category: engineering
tag: rewrite
permalink: rewrite-web-app
---

在程序员的职业生涯中，绝大多数时间都在和老工程打交道，他们需要在老工程上面不断添加新代码，实现新功能。随着技术的发展，工程的技术架构和技术栈就会落后，随着功能的不断增加，代码开始腐化，研发人员的效率、质量和心情都会明显下降。此时，重构或者重写就成了研发团队的一个热门话题。

![题图](/public/images/rewrite-web-app/rewrite.jpg)

业界有一种说法，很多程序员看不懂自己三个月前的代码，这种说法很容易验证是正确的。在实际开发中，很多程序员都会遇到这样的情况，当他们需要修改某个功能的时候，他们会发现自己已经忘记了这个功能的实现细节，甚至忘记了这个功能的存在。

此时，团队中的某些同学就会提出重构的建议，他们想要重构某个模块、某张页面、某个组件等等。有的时候，还会提出重写工程的想法。

重构是指在现有的代码基础上，对代码进行局部的修改，以使软件更容易理解、更容易维护、更方便添加新功能。重构有可能不会涉及软件的功能、UI 和用户体验，为的是将来能更好地开发和维护。局部重构其实无时无刻都在进行着，比如修复 Bug、Code Review 等等，都有可能对代码进行局部修改。

重写是对系统从头到尾地重新实现一遍，比如更换技术框架，差不多每隔三年就会有人提出重写工程的要求，这样就能展现他们的技术水平、创新精神和编码能力。

有的时候，不管是重构还是重写，风险都很大，重构和重写的目标往往都是他人编写的代码，谁也无法保证结果的质量会更加优异，因为看自己三个月前的代码都已经看不懂了，更何况是看别人的代码。而且，这样的想法往往会被否决，特别是重写，很可能会失败，导致研发团队的整体士气更加低落。关于重写失败，业界有个著名的例子，就是 Netscape 6.0[1] 的重写，重写花费了研发团队三年的宝贵时间，公司错过了最佳商业机会，直接导致了 Netscape 的衰落。

重构还是重写还是保持不变，很考验做决策的人。本文接下来会探讨近一年来我们重写七鱼[2] Web 端的一些思考，希望能够帮助大家做出更好的决策。

## 工程分析

七鱼是网易旗下的一款在线智能客服系统软件，包括了 Web 端、移动端、PC/MAC 端、小程序端等多个端，本文只讨论 Web 端。从 2015 年 9 月七鱼立项至今已经有八年多的时间，在网易工作过的前端同学应该都知道，那会儿公司内部有自研的前端框架 NEJ[3]，当时公司的很多项目都用了 NEJ 框架，七鱼也不例外。

NEJ 框架是一款功能非常丰富的前端框架，它封装了非常多的高级功能，比如依赖管理、模块调度、模板系统、组件系统等，其中很多组件都是从实际业务中抽象出来的，真正达到了开箱即用的效果。使用 NEJ 开发的代码，可以使用 NEJ 构建工具[4] 来构建和部署前端工程，非常方便，除此之外，NEJ 构建工具还和很多内部配套基建打通，显著地提升了研发效率。

NEJ 框架的诞生时间不会晚于现今主流的前端框架，比如 React、Vue 等，但是 NEJ 框架的设计理念和现在的主流框架有很大的不同，比如它的组件系统是基于继承的，而现在的主流框架都是基于组合的。基于继承的设计理念，使得 NEJ 框架的组件系统非常强大，但是也带来了一些问题，比如组件的继承关系非常复杂，组件的生命周期非常多，在调试代码时，一直在很多个文件中跳转，直至顶级基类，这也证明了 NEJ 的学习曲线是非常陡峭的，需要长时间的学习和实践才能掌握。再比如 NEJ 的路由系统，设计理念非常先进，可以通过路由规则配置达到组件复用的效果，但由于文档不够完善，导致很多同学都不会用，就算正确配置路由规则，也不明白其中原理，一旦配置错误，排查问题无从下手。

NEJ 的依赖管理系统是自己实现的，这导致了 NEJ 项目无法使用 NPM 等现代化的依赖管理工具，无法享受数以万计的开源组件，比如 Ant Design[5] 这样的组件库都是无法直接使用的，如果业务中的组件都需要自己实现，开发效率低不用多说，说得严重些还会影响业务发展速度。

NEJ 的构建工具也是自己实现的，前端构建离不开代码混淆，NEJ 的构建工具使用的是 uglify-js[6]，注意，是 UglifyJS 2 版本，而不是 UglifyJS 3，UglifyJS 2 只支持到 ES5 不支持 ES6，这导致了 NEJ 项目无法使用 ES6+ 的语法。ES6 是 JavaScript 语言发展史上一次重要的里程碑更新，新增了大约 25 种新语法，包括 let 和 const 关键字、箭头函数、模板字面量、解构赋值、默认参数值、扩展运算符、类和继承、模块化等等。虽然新语法数量不算很多，但它们都为 JavaScript 带来了更强大和更灵活的编程能力，使得开发人员能够更加高效地编写代码，但是非常遗憾，NEJ 项目无法使用。另外还有一个更坑的地方，因为在本地开发的时候，代码并不需要构建，所以如果不小心使用了 ES6 的语法，在本地开发阶段是发现不了的，只有等到部署时代码需要构建了才会报错，无数人都踩过这个坑，不管是新人还是老人，都会被这个坑坑到。

如果你已经耐心看到了这里，相信你已经无法忍受，NEJ 的设计原理、路由系统、组件系统等等这些不懂都可以学，但 ES6 新语法都不能用，那不是白瞎了苦苦学会的一身武艺嘛。

但有人可能也会说，七鱼项目从诞生至今一直用的是 NEJ，不也照样迭代到现在。但是鲜明的案例已经深深地摆在眼前，记得有次有个需求需要改动日历组件，如果是 React 框架，现成的开源组件就能满足需求，开发成本几乎为零，但当时我们评估该需求至少要 3 个工作日。还有一次有一个需求，要修改一个 NEJ 组件，评估后需要 8 个工作日，但是如果直接把页面使用 React 来重写也是 8 个工作日，这样的结论很夸张。

写到这里，有必要说明一下七鱼工程的代码量，如果工程中一共也没多少代码，那直接重写就行了，没有单独拿出来讨论的必要，但是如果工程代码量很大，那就需要仔细考虑了，因为重写的成本是非常高的，不仅仅是开发成本，还有测试成本、部署成本、迁移成本等等，所以在这种情况下，我们需要权衡一下，到底是重构还是重写。

七鱼 Web 端是一个非常复杂的前端工程，代码量统计如下图所示：

![代码行数](/public/images/rewrite-web-app/qiyu_code_lines.png)

其中核心的 JavaScript 和 CSS 文件的代码量均已超过 30 万行，其中 JavaScript 框架和库的代码行数在 5 万左右，去除框架和库，JavaScript 的业务代码量也超过了 30 万。如此复杂的项目，不管是重构还是重写，影响面都很大，决策需要非常谨慎。

那么，七鱼 Web 端的问题就摆在我们眼前，是重构、重写还是继续迭代？

## 前提条件

首先，我们在做任何重大决策之前，都需要征求上级领导的建议和意见。我没见过有什么项目，在得不到上级领导的支持下，还能成功往前推进的，如果领导不支持这样的项目，那做这件事情的意义会很小，甚至可能会被领导叫停。管理者对公司的人力和物力的使用负责，在什么项目上投入多少资源，都是需要经过严格的评估和决策的，管理者掌握的信息肯定比下属多，所以他们的决策也会更加准确，比如说，如果接下来公司会启动一个新项目，那么就需要考虑到人力的分配，重构或者重写会占用大量的人力，这样就会影响到新项目的开发，这就说明此时提出对老系统进行重构或者重写是不合适的，时机不对。

其次，需要得到团队中业务负责人的大力支持。如果业务负责人不支持，那么这件事情也很难推进下去，因为业务负责人对业务的理解是最深刻的，他们会对业务的发展趋势有着更加准确的判断，如果他们认为重构或者重写是不必要的，那么就需要认真考虑一下，是不是真的有必要。比如说，业务负责人已经明确知道，该项目接下来基本上不会再进行迭代（如已经稳定运行的核心模块），那这样的工程就没有必要进行重构或者重写了，重构或者重写的意义也不大。

第三，需要得到团队中一线研发同学的认可和支持。一般来说，重构或者重写的建议也是由一线研发同学提出来的，管理者需要找到合适人选，这一点非常重要，后面会再提到。

第四，重构或者重写，投入是否是值得的，也就是说现在的人力投入成本，能否在软件的整个生命周期中收回来，这是一笔很容易计算的账。在《简约之美》[7]一书中，作者提到：软件开发的成本包含实现成本和维护成本，价值也包括当前价值和未来价值。软件设计的本质中的所有问题，都可以用下面的方程式来解答：

![代码行数](/public/images/rewrite-web-app/software-value.jpeg)

其中：

* D 表示这个变化的合意程度
* Ei 代表实现成本
* Em 代表维护成本
* Vn 代表当前价值
* Vf 代表未来价值

用文字说明就是：改变的合意程度，正比于软件当前价值与未来价值之和，反比于实现成本和维护成本之和。作者最后也通过一个示例总结到：一般来说，软件系统都需要维护很长时间，大多数情况下，未来长期收益和维护成本才是真正需要考虑的，与之相比，当前价值和实现成本变得无足轻重。

从而我们也可以得出结论，如果我们把一个软件的生命周期拉得足够长，那不管当前我们的决策是重构还是重写，当下的投入都是值得的。

对于七鱼 Web 端工程本身来说，以上条件都是满足的，所以我们接下来要分析的是，应该是重构还是重写。

## 重构利弊

重构方案的优点很明显，我们不需要对工程大动干戈，可以持续对老代码进行优化，局部调整技术方案，技术优化事项可以跟着业务需求迭代一起上线，也减轻了测试人员的工作量，对业务迭代发展的影响可以降到很低，可以为公司节省不少的时间和金钱。对于七鱼 Web 端工程来说，新页面或者新模块可以使用 UMD 方案，这样就能使用现代框架技术，也可以使用 IFRAME 嵌入的方案，这样就能使用新的技术栈，同时也可以避免对老代码的影响。

重构适合团队中的开发人员对老代码都很熟悉，对老代码接受程度高，这样可以持续地局部重构，最终使得代码达到理想状态。

重构方案的缺点也很明显，对于七鱼 Web 端工程来说，有以下几个方面：

* UMD 方案，虽然可以使用上新技术栈，但会极大地提升工程复杂度，还要考虑新老技术栈之间如何交互的问题，导致软件的维护成本很高，很容易产出 Bug。
* IFRAME 方案，对于一些复杂的页面，比如说客服聊天页面，iframe 方案会导致页面加载速度变慢，用户体验变差。
* NEJ 技术栈需要持续迭代，但 NEJ 对新人不友好，上手成本高，接受程度低，团队培养负担重，开发成本高，开发体验差，负面情绪大。

综上所述，重构方案可以解决部分问题，但无法解决七鱼 Web 端的可持续发展问题。

## 重写利弊

重写需要巨大的勇气，往往令人望而生畏。前面我们已经分析过并得到结论：从软件的整个生命周期来看，当下的任何投入都是能赚回来的。

重写有很明显的优点，那就是重写可以解决前面提到的重构方案的缺点。对于七鱼 Web 端工程来说，我们可以使用现代的前端技术框架，比如 React，也可以用上 TypeScript 这样的编程语言，对于大型 Web 应用来说，编码规范良好的 TypeScript 代码是能极大提升工程整体质量的。

但软件开发活动是受时间和资源限制的，我们需要在有限的时间内用有限的资源完成既定目标，所以重写的缺点也很明显，对于七鱼 Web 端工程来说，有以下几个方面：

* 开发周期长，投入人力大，涉及范围广
* 重写过程中，老代码还在维护，在重写的时候还需要将新功能迁移到重写版本
* 老代码逻辑细节很多，没有注释和文档不全的情况比比皆是，重写时想要考虑到所有的细节是非常困难的，出现 Bug 影响用户体验在所难免
* 重写后，交互和视觉上的差异会导致用户的不习惯，从而产生负面情绪，严重的还会影响续费

## 实际方案

无论什么公司，做任何事情的资源和时间都是有限制的，七鱼当然也不例外。我们不可能停下所有的业务，去重构或者重写，这种方案在现代公司是不可能采用的，没有人会同意这种方案。所以，我们需要保证正常的业务迭代不受影响，同时在限定的时间内完成重构或者重写。

对于七鱼 Web 端这么复杂的工程来说，我们使用了一种增量重写模式（本文最后会来介绍这种模式）。我和公司内部的很多同事交流过，大家都赞成这种方式，认为这种方式是最合理的。在我加入七鱼团队之前，我们的小伙伴已经就这么做了，他们在需求迭代过程中已经使用 React 新技术栈重写了绝大多数的页面、模块或者组件，将影响范围控制在最小，同时也保证了业务的正常迭代。另外也有约定，新的页面必须使用 React 技术栈。由于某个核心功能还是 NEJ，我们根据实际情况的不同，使用了 UMD、IFRAME 和微前端等三种方案来将新功能集成到现有系统中。借用 IFRAME 和微前端的优势，我们将七鱼 Web 端拆分成了三十多个子应用，每个子应用都是独立的，这样可以极大地提升开发效率，同时也可以降低维护成本，方便团队的分工协作。

客服工作台是七鱼的核心系统，用的还是 NEJ 技术栈，它是客服登录系统后最频繁使用的功能，比如在线会话列表、消息列表、在线电话、消息发送、客户资料、服务小记等等都是每个客服重度使用的功能。它是七鱼最早开发的工程，也是最复杂的工程，代码量最大，逻辑最复杂，细节也最多。

如果我们不重写这个核心系统，那我们需要永远维护和开发 NEJ，永远会被 NEJ 困扰，这是团队迫切需要解决的问题。

最终，经过非常谨慎的评估，我们决定对上述核心系统进行重写，下面将介绍我们是如何做的。

## 如何重写

在我们决定对七鱼的核心系统进行重写后，我们是按照下面的方式来开展工作的：

1. 找对系统最熟悉的开发同学，拆分模块，设定优先级（P0、P1等），评估每个模块的重写工作量。一定要找到最熟悉功能的同学，只有如此，评估出来的工作量才是最准确的，这样就不会偏离目标。
2. 根据评估出来的工作量，决定参与重构的人选。看到这里你可能会觉得这无需考虑，肯定是选择最熟悉的开发同学参与重构，既能保证质量又能保证效率。但实际上这么决定是非常不妥的，我们还需要维护现有系统和开发新功能，还有每天都很重要的技术支持工作，这些事情离都不开这些同学。如果把他们抽调出来去重写，那正常的业务迭代和技术支持工作将会受到非常大的影响。当时七鱼前端团队分成了两个小组，每个组有一个小组长，他们带有一定的管理职责。根据当时的实际情况，最终决定让两位小组长全职参与重写，加上我一共三个人，根据评估出来的工作量，我们三个人只需要花费三个月的时间就能完成全部的重写工作。
3. 拆分模块，分配到人，保证每个人的工作量是均衡的。这里其实还有一个第四人，他会记录重写期间在老系统上迭代的新功能，包括新功能的上线时间，代码 MR 地址，负责人等等。
4. 项目 KickOff，让更多的人知道重写的背景、目标和里程碑节点。
5. 申请关闭开发一个月。因为是彻底的重写，前期的沟通成本是巨大的，比如架构设计、技术方案讨论、什么时间点进行模块对接联调等等都需要进行非常充分的沟通。对于七鱼系统来说，前期花一个月的沟通时间是非常有必要的。
6. 重写系统。由于每个人的思维习惯不一样，我们没有要求具体每天需要完成什么，但我们每周会开一次站会，大家讨论一下进度，有问题及时沟通，有风险及时暴露。如果有人进度上落后了，那需要想办法在下次站会前补上。如果有人提前完成了，那就继续做下一个模块，或者兼顾一些其他重要的事情。另外，我们在重写期间，对于视觉、交互、功能等实现上有变化的点，都进行了详细记录，方便后续 QA 测试。对于比较复杂的功能模块，我们也出了详细的设计方案文档，方便后续和其他人的沟通对齐。对一些方案还无法确定的地方，我们也进行了详细记录并暂时搁置，我们优先重写已经明确方案的模块，没有在不明确的地方浪费过多时间，时间对于我们来说很宝贵，技术难题留到最后或者等到必须要解决的时候再来解决。
7. 分批提测。和 QA 同事进行充分的沟通后，我们决定分成两批来提测，第一批是两个月后，完成所有 P0 模块，第二批完成剩下所有模块，并修复第一批提测后的 Bug 和迁移完重写期间的新功能。
8. 充分测试，修复 Bug。这期间，我们会和 QA 同事一起测试，发现问题后，我们会及时修复，然后再次提测。实际上，这期间我们已经不需要全部投入了，可以兼顾一下其他工作。
9. 全员 Bugbash。这个时候，我们已经完成了所有模块的重写和测试工作，但是还没有上线，我们召集了团队全员参与测试，尽可能多地发现问题。
10. 测试完成，制定灰度方案，同步给各方人员，比如产品、客服、技术支持等，确保信息充分传达。七鱼有现成的强大灰度基建能力，我们可以按企业ID、客户级别（S类、A类、B类等）等维度进行灰度。
11. 开始灰度。每次灰度一定百分比的客户，灰度后发现的问题会立即进行修复验证，验证通过之后再继续加大灰度比例，最后保证了重写版本平滑上线。如果被灰度的企业发现了问题，可以修改灰度配置，将客户切换到老版本，客户侧只要刷新下页面即可切回到老版本。

上面就是我们在重写七鱼系统时使用的大致方式，经过我们的实践验证，是非常有效的。当然，不同的团队，不同的项目，重写的方式也会有所不同，大家需要根据实际情况出发，制定符合自己团队的重写方法。

## 注意事项

虽然我们在重写过程中遇到了很多问题，但是我们都一一解决了，整体上来说是很成功的一个重写项目。这里我总结了一些注意事项，希望对大家有所帮助。

* 人选非常重要。据我观察，很多重写失败的项目都是人选不合适。有些团队会让应届生甚至是实习生参与重写，这是非常不明智的决策。参与重写的人选，一定要是经验丰富的同学，并且技术能力要过硬。另外，参与重写的人员要全职参与，不能分心去做其他工作，人员也不宜过多，最好不要超过 5 人，不然沟通成本就会变高，比如七鱼的重写，3 个人全职参与是合适的，符合团队的实际情况。

* 重写代码的方式。这个要看人，不同的人思维习惯是不一样的，有的人喜欢在充分理解现有功能的基础上，然后再按照自己的理解去重新实现功能，保证新实现的功能和老功能是一致的，但代码的组织逻辑完全是新的。有的人喜欢完全翻译老代码，逻辑保持和老代码的一致，这样至少是不会出错。这两种方式都能完成目标，没有好坏之分，两种方式都无法彻底避免出错，但如果时间非常充足，我会更推荐第一种方式，因为第一种方式可以让你更好地理解业务，而且可以在重写的过程中，对老代码进行优化，比如去掉一些不必要的逻辑，这样可以让新代码更加简洁。实际上，我们在重写七鱼的过程中，其他两位同事采用的是第一种方式，我基本上采用的是第二种方式，因为那会儿我刚加入七鱼团队不久，对业务逻辑还不熟悉，这是第一个我深度参与的项目。

* 对老代码一定要用敬畏之心。老代码经过了无数人的优化，一般来说，看似奇怪的逻辑，背后都是有原因的，但由于缺乏清晰的注释和 Commit 日志，想要搞清楚每个逻辑点，这是不太现实的，我们只能在时间允许的前提下，尽可能地搞清楚每个逻辑背后的真正内幕。这里我举一个实际的案例，就是七鱼电话客服的那个拨号盘的输入框，就是一个用来拨号的输入框，看似已经很简单了，但重写后出了两个问题。

![在线电话](/public/images/rewrite-web-app/qiyu_telephone.png){: width="200" style="display: block; margin: 0 auto" }

> 上面的号码输入框，老代码在按下最下方的绿色拨号按钮时，只校验了输入框的值是否为空，不为空就直接发请求给服务端。重写的时候，想当然地给输入框加了一个输入限制，即无法输入除数字、星号和井号之外的字符，这看起来是很合理的。灰度上线后，有客户就来反馈了，他说之前他可以先从其他地方把电话号码复制到输入框中，比如 0571-12345678 这样的字符串，然后再将不符合要求的字符删除，现在他无法这么做了，因为输入框的输入限制，他只能一个一个字符地输入，这样效率非常低下。非常有道理，原来想的是优化，最后的结果却给用户带来了麻烦。我们修复了这个问题，输入时不做限制，改成在按下最下方的绿色拨号按钮时才做字符的合法性校验，注意这个改动和老逻辑还是不一样，老逻辑只校验是否为空。这样过了一段时间后，以为就没有问题了，但是又有客户来反馈了，他说他无法在输入框中输入加密后的号码，加密后的号码除了数字外还有英文字母，现在无法拨打加密号码了，加密号码是七鱼本身的功能，可以从其他地方复制。绕了一大圈，最后发现原来老逻辑才是无懈可击的。

* 重写后的性能不一定比老版本好。很多人对新版本的期望比较高，会觉得重写版本的性能肯定会比老版本好。但老版本已经经过多年的优化，很多性能问题都已经得到了解决。在开发新版本的时候，其实并不会过多地关注性能问题，所以第一个版本的性能往往不如老版本，新版本也需要不断优化和迭代，这是正常现象。

## 写在最后

重写系统是一把双刃剑，重写系统的风险很大，而且很可能会失败。

决定重写系统之前，一定要慎之又慎，一定要在充分的调研和评估之后，再做决定。对于一线开发来说，他们最乐意每隔几年就重写一遍系统，尤其是那些不是他们编写的代码，这样他们就能使用最新最酷的技术，能证明他们的技术能力，能拿到好的绩效结果。但对于组织来说，需要权衡的地方有很多，重写是最后不得已的选择，绝大多数时候持续的局部重构才是最佳方案，做何种决策非常考验组织的管理水平。

重写也分方式，现代主流互联网公司是不太会停下所有业务迭代去彻底重写系统的。一般都使用增量可靠的重写，用重写后的工程、页面、模块等来逐步替换现有老系统，很长一段时间内，新老系统是共存的。这种方式也叫 Strangler Fig pattern（2019 年的时候改名为：Strangler Fig Application），是 Martin Fowler 在 2004 年首次提出的[8]。

Strangler Fig 是一种生长于热带及亚热带的植物物种，生活在热带雨林中，中文名叫绞杀植物，又名杀手树。

> 绞杀植物，又名杀手树，指一种植物以附生来开始它的生长，然后通过根茎的成长成为独立生活的植物，并采用挤压、攀抱、缠绕等方式盘剥寄树营养，剥夺寄树的生存空间，从而杀死寄树。[9]

![绞杀植物](/public/images/rewrite-web-app/stranglerfig.jpg)

下面这张图是 Strangler Fig 从萌发到彻底杀死宿主的过程：

![绞杀植物](/public/images/rewrite-web-app/stranglerfig2.jpg)

Strangler Fig Application 的思想就是借鉴了绞杀植物的生长方式，通过增量的方式，逐步替换老系统，最终彻底杀死老系统。

> 通过该模式可以让重要的遗留系统迁移过程以可控的方式逐步开展；同时，迁移的过程可以得到更早的反馈；迁移完成后遗留系统将受到全面的抑制，使其下线引发的风险降到极低。如果可以精细的构建迁移回滚机制，那么整个迁移过程将更为可靠、可控。[10]

关于重写，本文就写到这里。如果你最近也遇到了类似的困惑，不妨先看看这篇文章，或许能给你一些启发，也欢迎你在下方留言，和我分享你的经验。

## 参考资料

1. Netscape 6.0: <https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i>
2. 七鱼官网: <https://qi.163.com>
3. NEJ: <https://github.com/genify/nej>
4. NEJ 构建工具: <https://github.com/genify/toolkit2>
5. Ant Design: <https://ant.design/index-cn>
6. uglify-js: <https://github.com/mishoo/UglifyJS>
7. 简约之美: <https://book.douban.com/subject/20445258>
8. StranglerFigApplication: <https://martinfowler.com/bliki/StranglerFigApplication.html>
9. 绞杀植物: <https://zh.wikipedia.org/zh-hans/絞殺植物>
10. Strangler Fig 设计模式：<https://zhuanlan.zhihu.com/p/640696554>
11. Refactoring vs Rewrite：<https://methodpoet.com/refactoring-vs-rewrite>