---
layout: page
title: Archives
---

<div class="archives">
  <div class="masthead">
      <h3 class="masthead-title">
          <a href="/" title="Home">☚ {{ site.title }}</a>
          <small>{{ site.tagline }}</small>
      </h3>
  </div>
  <ul class="archive-posts">
    {% for post in site.posts %}
      <li>
        <h3>
          <a href="{{ post.url }}">
            {{ post.title }}
            <small>{{ post.date | date_to_string }}</small>
          </a>
        </h3>
      </li>
    {% endfor %}
  </ul>
</div>
