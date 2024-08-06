# Gzool blog

## Change gem sources

Since rubygems.org is fucked by GFW, so need to change gem sources first:

```shell
# gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/
gem sources --add https://mirrors.tuna.tsinghua.edu.cn/rubygems/ --remove https://gems.ruby-china.com/
gem sources -l
*** CURRENT SOURCES ***
# https://ruby.taobao.org
```

### Install jekyll

```shell
sudo gem install jekyll
```

if pygments is not installed, then:

```shell
sudo gem install pygments.rb
```

### Run

```shell
bundle exec jekyll server --livereload
```

Now browse to http://localhost:4000

## MathJax

* https://github.com/jeffreytse/jekyll-spaceship
* https://docs.mathjax.org/en/latest/options/output/svg.html