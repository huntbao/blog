---
title: ChatGPT 加持下的 Code Review 探索
category: engineering
tag: chatgpt, code-review
permalink: code-review-with-chatgpt
---

在编程世界中，有三个老大难问题，大家都觉得非常重要但实际上却经常被忽视：文档、单元测试和代码审查（Code Review）。

本文要讨论的是第三个问题：Code Review，主要介绍网易云商前端团队在 Code Review 流程和工具上的探索和实践，不涉及 Code Review 的理论知识。

![cr](/public/images/codereview/6.jpg)

## 为什么要做 Code Review

Code Review 的重要性不言而喻，但为什么有些团队却不重视它呢？我认为主要有以下几个原因：

1. 时间成本：Code Review 需要耗费大量的时间，而且很多时候并不能起到立竿见影的效果。业务需求开发本身就很紧张，技术方案设计有时都来不及做，再要花额外的时间去做 Code Review，很多团队 Leader 会觉得不划算。另外，很多团队 Leader 觉得 Code Review 是一种浪费时间的行为，因为大家纠结最多的无非是一些代码风格、代码格式、注释等问题，这些问题并不是很重要，不值得花费大量的时间去讨论，有时候还会因此引起争吵，影响团队氛围。
2. 业务特性：比如有些业务需求是临时性的，只需要开发一次就不再需要维护，或者代码生命周期短，这种情况下做 Code Review 的话，大家的积极性也不高，反正又不会影响绩效，为什么要做呢？

那么，为什么云商前端团队一直在坚持做 Code Review 呢？我觉得主要还是由我们的业务特性决定的。

云商有一款核心产品，七鱼智能客服，它是一款 SaaS 产品，已经迭代了近 10 年，在可预见的将来还需要不断地维护和优化代码，代码量巨大，所有 Web 工程的代码加起来就有上百万行。产品功能非常复杂，包括产品、研发和测试在内，没有一个人能搞得清楚所有的业务逻辑，比如有非常多的个性化逻辑都是用配置开关控制实现的，不看代码根本不知道具体逻辑是怎么样的。

因此，我们认为 Code Review 于我们团队是非常重要的，它能够利用团队智慧帮助我们发现代码中的问题。

![cr](/public/images/codereview/7.jpg)

## 如何做 Code Review

如何做 Code Review 是一个很大的话题，没有一成不变的规则，这里我只介绍我们团队的一些实践。

按照我们团队的研发流程，需求的发布，一般来说要经过测试、预发、灰度和全量四个环境：

1. 开发人员在本地开发完需求后，就可以将需求提测，此时开发人员或者测试人员会创建一个用来测试验证的小环境。
2. 在需求发布日，会发布到预发环境，这个环境是用来验证所有即将要发布的需求合并在一起后的表现是否仍旧正常。
3. 在需求发布日，预发环境验证通过后，同时会发布到灰度环境，灰度环境中的用户都是真实用户，但只有非常少量的客户，可用来验证需求在真实环境下的表现，比如修复某个客户遇到的 Bug。
4. 在灰度环境运行一段时间后（一般是一周左右），如果没有问题反馈，就会发布到全量环境。

有这么多套环境要部署，如果每次部署环境都需要 Code Review 是不太现实的。我们团队约定的规则是只在部署预发环境的时候做 Code Review，在部署预发环境的时候需要遵循以下规则：

1. 需求开发同学，在 Gitlab 上面提交 Merge Request，并指定 Reviewer。
2. 需求开发同学在泡泡群里面通知 Reviewer 进行 Code Review，并提供 Merge Request 的链接。
3. Reviewer 需要马上进行 Code Review，如果发现问题，就把问题发到泡泡群并艾特需求开发同学，大家可以一起在群里面讨论。
4. 所有 Review 结果被 Resolved 后，Reviewer 再合并 Merge Request。

在很长的一段时间内，我们都是这么做 Code Review 的，效果实际上并不是很理想。

## 遇到了一些问题

在实际的 Code Review 过程中，我们遇到了一些问题：

1. Code Review 的时候，如果要对所有变更代码都进行仔细 Review，加上很多时候 Reviewer 缺乏对上下文的理解，耗费的时间非常高昂。Reviewer 自己也有工作需要处理，很多时候并不能及时处理 Merge Request，所以很多时候 Code Review 就只是走了个形式，帮忙合并了 Merge Request，没有真正发挥出它应有的作用。
2. 很多 Reviewer 在 Review 代码的时候，都会以私聊的形式向代码提交提问题，这样的问题并没有记录下来，团队中的其他同学看不到，没有机会看到问题是怎么解决的，也就无法学习到经验。一些很宝贵的经验没有沉淀下来，这是非常可惜的。记得有一次，团队中的有一个同学在开发一个功能，Reviewer 在 Review 代码的时候提了一个和需求本身关系不大的问题，质疑某段代码的用处是什么，因为凭借 Reviewer 的直觉经验，他觉得这段代码是多余的，这位开发同学看完代码后也无法反驳 Reviewer 的质疑，最后选择去掉了这段代码。但结果相信大家已经猜到了，改完后就出了一个线上 Bug。这段代码是有用的，是为了解决一个特殊的场景，是另外一位开发同学修复的问题。如果当时我们是在泡泡群里面讨论的话，另外那位同学就有机会看到这个问题并做出解释，这样就能避免出线上 Bug 了。
3. 因为很多 Review 的沟通交流都是私下一对一地进行，团队的技术交流氛围也很低迷。

针对上述问题，我们团队一直在探索如何改进 Code Review 的方式，如何让它更加高效。

## 流程优化

为了解决上述问题，我们团队做了一些优化流程的改进方案：

1. 由于提 Merge Request 的时候，Reviewer 只会收到邮件通知提醒，通常是代码变更者在泡泡群里面通知 Reviewer。我们把这个流程做了自动化，当代码变更者提 Merge Request 的时候，通过 Gitlab 的 Webhook 来调用泡泡机器人，由泡泡机器人在泡泡群里面艾特 Reviewer，并附上 Merge Request 的分析报告，比如是谁发起的、需求标题、需求链接等信息。另外，我们也对变更代码做了初步分析，比如新增代码行数、删除代码行数、注释率、空行率等，其中注释率和空行率也会给出推荐的值。代码注释是一个非常重要的指标，注释率非常低的话，Reviewer 人员可以直接要求代码变更者增加注释。泡泡群是事先就已经创建好的专门用来做 Code Review 的群，所有开发同学都在群里，保证了熟悉业务模块的同学都在同个群里。另外还可以做一些基本分析，比如 package.json 文件中的 npm 依赖包的版本如果有变更，就可以提醒 Reviewer 需要特别注意，如果依赖包的版本降低了，那一般来说肯定是有问题的，可以直接做出重要提醒。
2. 由于 Reviewer 不一定能马上处理 Merge Request，所以我们约定，Code Review 也可以事后 Review，即代码可以先合并，但是需要在一定时间内完成 Code Review。这样做的好处是不会影响需求发布。我们推荐事前就做 Code Review，但是不强制。
3. 在泡泡群里面讨论的问题，是很难跟踪和记录的，很多典型案例是值得所有人学习的。所以我们决定把泡泡群里面的讨论记录下来，我们约定，所有代码评论需要在 Gitlab 的 Merge Request 里面进行，然后利用了 Gitlab 的 Webhook，在有评论发出时，把评论数据保存下来，这样就能把评论汇总展示，方便大家学习。在有评论发出的时候，也会将评论内容推送到泡泡群里面，这样大家就能看到评论内容，所有人都能参与讨论，促进了团队的技术交流氛围，也能让业务新手得到快速成长。

![cr](/public/images/codereview/1.svg)

通过上面的流程优化，参与 Code Review 同学的积极性得到了很大的提升，所有人都能看到 Merge Request 和 Review 的内容，可以根据自身情况参与讨论，很多技术和业务知识点也得到了沉淀。

但不管流程如何改进，方案如何优化，都无法解决以下问题：

1. 如果 Reviewer 缺乏对上下文的理解，Code Review 需要耗费大量的时间。
2. 如果代码文件变更数量非常大，Code Review 也需要耗费大量的时间。

以上问题是业界难题，一直都没有很好的解决方案。代码变更数量很大，要么就用自动化分析工具，但是自动化分析工具只能对一些标准性问题进行分析，比如代码规范、代码格式化、代码安全等等，很少见到能分析代码逻辑并提出建议的工具，比如代码的逻辑错误、代码的性能问题等等。

然而，自从 OpenAI 发布了 ChatGPT 之后，我们发现 ChatGPT 在分析代码方面有了很大的突破，它可以分析代码的逻辑并提出建议，这让我们看到了希望。我们团队就开始尝试将 ChatGPT 应用到 Code Review 中，看看它能否帮助我们更好地理解和处理代码。

![cr](/public/images/codereview/10.jpg)

## ChatGPT 在 Code Review 中的应用

想让 ChatGPT 如何分析代码，完全取决于 Prompt 如何编写。这个问题，换个角度来问，就是我们在 Code Review 的时候，最主要会关注哪些问题？

每个研发团队对 Code Review 的关注点都不尽相同，但是有一些是共通的，比如代码的逻辑是否正确、代码的性能是否合理、代码的安全性是否有问题等等。

我们团队目前重点关注的是新老代码的差异点、新代码的逻辑是否正确、新代码是否能优化（比如高级语法、性能、安全等等）。

在实际 Code Review 的时候，我们一般只会关注新老代码的差异，代码文件其余未变更的部分我们一般不会关注。因此，在发送给 ChatGPT 的 Prompt 中，只发送新老代码的差异部分，其余部分不发送，另外，ChatGPT 是按 tokens 来收费的，只发送代码的差异部分也能节省相当可观的费用。

获取新老代码的差异，Gitlab 有现成可用的开放接口，所有的代码差异片段都和下述类似：

```diff
@@ -71,7 +72,14 @@ export const getInit = (params) => {
     dispatch(setLoading(true));
     try {
       const data = (await querySettingBaseInit(params)).result;
-      const hasRichText = ['welcome', 'unknownImage', 'unknownEmoji', 'unknownEnchar', 'unknownOther'];
+      const hasRichText = [
+        'welcome',
+        'unknownImage',
+        'unknownEmoji',
+        'unknownEnchar',
+        'unknownOther',
+        'unknownMiniProgram',
+      ];
       hasRichText.forEach((item) => {
         if (data[item] && data[item].info) {
           // 转换初始数据的emoji文本
```

其中 `@@ -71,7 +72,14 @@` 的含义如下：

1. `-71,7` 表示老代码从 71 行显示，共显示 7 行，`-` 表示老代码。
2. `+72,14` 表示新代码从 72 行显示，共显示 14 行，`+` 表示新代码。

代码最前面的 `-` 表示删除的代码，`+` 表示新增的代码。

最开始的时候，我们是直接将上面的代码差异片段放在 Prompt 发送给 ChatGPT，并说明 `代码最前面的 - 表示删除的代码，+ 表示新增的代码`，但是 ChatGPT 的回复并不理想，ChatGPT 无法精准分析出新老代码分别是什么，我们使用的 ChatGPT Model 是 `gpt-3.5-turbo-0613`。

经过测试，最终我们选择事先就分离出新老代码，分别放在 Prompt 中，这样 ChatGPT 就能更好地分析出新老代码的差异，回复也更加精准。另外，我们也发现，Prompt 使用英文来描述问题，ChatGPT 的回复会更加精准。

最终的 Prompt 大致如下：

```plaintext
This is original code:\n```' + oldContent + '```\n\nThis is new code:\n```' + newContent + '```\nCompare and analyze the aforementioned original code and new code, point out the logical differences between the new code and the original code, indicate whether the new code can be optimized, and provide detailed explanations.. Response language: Chinese
```

经过上述优化后，ChatGPT 的回复效果得到了显著提升，它能够精准分析出新老代码的差异，提出合理的建议，这让我们团队非常惊喜，下面是一个 ChatGPT 的回复案例，帮我们发现了一个代码逻辑错误：

![cr](/public/images/codereview/2.png)

有了 ChatGPT 的加持，Reviewer 的 Review 效率有了明显的提升。有同学可能会有疑问，因为按照上面的 Prompt，发送给 ChatGPT 的代码是不完整的，连语法都不对，ChatGPT 能分析得准确吗？根据实际测试效果来看，ChatGPT 是能准确分析代码的，代码本身是否能运行不重要，它有自己的分析逻辑。

## 在 IDE 中进行 Code Review

前文所说的 Merge Request、评论以及 ChatGPT 分析报告都保存在一个平台中，在 Web 页面中进行展示，所以 Code Review 也是在 Web 页面中进行。但实际情况是，开发人员每天基本都在 IDE 中编写代码，比如前端就基本上是在 VSCode 中工作。所以会有以下几个问题：

1. Reviewer 需要切换到 Web 浏览器中进行 Review，而 Web 浏览器中的代码展示风格、样式等等和自己的 IDE 中的偏好设置并不一样，这会影响 Reviewer 看代码的效率。
2. 如果 Reviewer 觉得某段代码可以优化，但自己也没有把握该如何优化，自己提供的代码也需要测试验证，所以他一般会需要这么操作：把代码拷贝到自己所使用的 IDE 中，优化完代码后，再粘贴到 Merge Request 中的评论中，这个过程是比较繁琐的。不管如何，编码这个环节肯定是在自己最熟悉的 IDE 中进行才是最高效的，比如还可以使用 Github Copilot 插件对变更代码进行优化。

所以我们决定尝试将整个 Code Review 的流程都搬到 IDE 中进行。通过调研，我们发现 Gitlab 官方有一个插件，可以在 VSCode 中进行 Code Review，这个插件叫 GitLab Workflow，它可以在 VSCode 中进行 Merge Request 的 Review、评论等操作，这样就能解决上述问题。

![cr](/public/images/codereview/5.png)

但是非常遗憾，我们公司部署的 Gitlab 版本不支持这个插件（有个登录认证接口是新版本的 Gitlab 才加上的，老版本没有这个接口），此外，我们发现 Gitlab Workflow 插件在展示代码时，使用了只读模式，在只读模式下，右键菜单功能非常有限，比如没有 Github Copilot 菜单。

基于上述考虑，我们参考了 Gitlab Workflow 的功能和代码，开发了一个类似的插件，在渲染代码内容时，我们把编辑器设置为可编辑，这样所有右键菜单都能正常使用。关于插件的开发细节，这里就不展开了，可以参考插件作者编写的文章。

至此，我们的 Code Review 流程就完全搬到了 IDE 中进行，效果截图如下：

![cr](/public/images/codereview/3.png)

![cr](/public/images/codereview/4.png)

泡泡机器人的 Merge Request 通知内容如下：

```plaintext
有新的MR指派，请@xxx及时处理~
MR创建人：yyy
MR标题：Resolve OMYSF-60774 "Task/9.2/ 403 log release"
MR描述：Closes OMYSF-60774
工程：basic-web-kefu 
Source分支：task/9.2/OMYSF-60774_403_log_release
MR分析报告：
1. 本次 MR 共提交 16 次，其中包含6次Merge记录，变更文件 43 个
2. MR 标题是否以【预发】开头：是，是否含需求单ID：是
3. MR 基础评分（1-5，描述不为空且commit信息清晰）：3
4. 源分支名是否符合规范（如story/1.0.0/YSF-123_xxx）：是
5. 每次提交的变更文件是否都小于 7 个：否
6. 删减代码情况：共删减 630 行，其中注释 63 行，空行 5 行
7. 新增代码情况：共新增 795 行，其中注释 81 行，空行 43 行
    注释率：10.19%<推荐值15~30%>
    空行率：5.41%<推荐值5~15%>
8. 是否包含依赖变更：否
根据以上信息，本次 MR 的质量分为 3 分

AIGC分析报告：[报告链接]
MR链接：[MR链接，打开 Gitlab 地址]
vscode查看：[点击后，可以在 VSCode 中查看该 MR 代码]
```

## 小结

Code Review 是研发流程中比较重要的一个环节，如何做好 Code Review 是一个值得探索的问题。自从有了 ChatGPT，很多以前觉得无法做到的事情忽然变得异常简单了，ChatGPT 在分析方面有了很大的突破，针对代码分析应该也专门做了优化处理。

以上就是我们团队在 Code Review 上的一些探索和实践，希望能对大家有所启发。
