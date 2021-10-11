---
layout: post
title: Gitlab Webhook Logs 查看入口
category: Tips
tag: tech-tips
permalink: gitlab-webhook-logs-entry
---

Code Review 是大家都比较关心的事情，之前在飞书群里面多次和大家说，在提交代码后顺手把 Commit 链接发到群里面，让大家来 Review，但几乎没人主动发链接，让人头疼。

自然就想到 Gitlab 的 Webhook，在提交 Merge Request 后，通过 hook 和飞书的自定义机器，将提交信息发送到团队飞书群。

在调试代码的时候，需要知道 Gitlab 调用 Webhook 时，发送过来的具体数据格式，官方文档只给了一个 Sample，一些枚举类型的字段具体有哪些枚举值都没说明。

所以能知道已有 hook 被触发的历史记录就比较完美了。

于是，在 Google 里面搜索 Gitlba Webhook logs where，看了很多个搜索结果，也没有明确的结论说查看入口在哪里（不知是否我的搜索姿势不太对），因为之前看到有人发过类似的链接所以确定有这么一个查看入口。

求人不如求知，经过一翻摸索后，发现入口在：

1. 项目的 Settings -> integrations

2. 找到已有的 Webhook，点击 Edit
![hooks](/public/images/gitlabwebhook/hook.png)

3. 最下面的 Recent Deliveries 就是最近触发的 hook
![hooks](/public/images/gitlabwebhook/hook1.png)

4. 点击某条数据后面的 View details 链接就可以查看此次请求发送的数据了

事情就这么愉快地解决了。

那为什么这么简单的一件事情要专门写一篇文章来记录呢？很简单，是要让搜索引擎收录一下本文标题作为关键词，方便以后其他朋友在网上搜索类似关键词时能直接搜索到这篇文章，以节省自己摸索的时间。
