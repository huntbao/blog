---
title: 单页应用的架构设计
category: presentation
tag: presentation, spa
permalink: spa-designing-guide
---
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>单页应用设计指南</title>
  <meta name="author" content="HuntBao">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui">
  <link rel="stylesheet" href="/public/reveal/css/reveal.css">
  <link rel="stylesheet" href="/public/reveal/css/theme/black.css" id="theme">
  <!-- Code syntax highlighting -->
  <link rel="stylesheet" href="/public/reveal/lib/css/zenburn.css">
  <style>
    section {
      text-align: left;
    }

    .reveal pre {
      width: 100%;
    }

    .reveal pre code {
      border-radius: 5px;
      padding: 12px;
    }

    .reveal sup {
      font-size: 12px;
      margin: -8px 4px 0;
      vertical-align: top;
    }

    .reveal h2 {
      text-transform: none;
    }

    code {
      padding: .25em .1em;
      font-size: 85%;
      color: #bf616a;
    }

    .reveal blockquote {
      padding: 0 20px;
      border-radius: 5px;
    }
  </style>
  <base target="_blank">
</head>
<body>

<div class="reveal">

  <div class="slides">

    <section style="text-align: center;">
      <h1>SPA</h1>
      <h3>单页应用设计指南</h3>
      <p>
        <small><a href="https://github.com/huntbao">包勇明</a> / <a href="http://weibo.com/gzooler">@huntbao</a>
        </small>
      </p>
    </section>

    <section>
      <h2>SPA 定义</h2>
      <p>单页应用（SPA，Single Page Application）是指在浏览器中运行的应用，在使用期间页面不会重新加载</p>
    </section>

    <section style="text-align: center;">
      <h2>Thank You</h2>
      <h3>Q & A</h3>
      <p>
        <small><a href="https://github.com/huntbao">包勇明</a> / <a href="http://weibo.com/gzooler">@huntbao</a>
        </small>
      </p>
    </section>

  </div>
</div>

<script src="/public/reveal/lib/js/head.min.js"></script>
<script src="/public/reveal/js/reveal.js"></script>
<script>
  // Full list of configuration options available at:
  // https://github.com/hakimel/reveal.js#configuration
  Reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: true,
    transition: 'slide', // none/fade/slide/convex/concave/zoom
    // Optional reveal.js plugins
    dependencies: [
      {
        src: '/public/reveal/lib/js/classList.js',
        condition: function () {
          return !document.body.classList;
        }
      },
      {
        src: '/public/reveal/plugin/markdown/marked.js',
        condition: function () {
          return !!document.querySelector('[data-markdown]');
        }
      },
      {
        src: '/public/reveal/plugin/markdown/markdown.js',
        condition: function () {
          return !!document.querySelector('[data-markdown]');
        }
      },
      {
        src: '/public/reveal/plugin/highlight/highlight.js',
        async: true,
        callback: function () {
          hljs.initHighlightingOnLoad();
        }
      },
      {src: '/public/reveal/plugin/zoom-js/zoom.js', async: true},
      {src: '/public/reveal/plugin/notes/notes.js', async: true}
    ]
  });
</script>
</body>
</html>
