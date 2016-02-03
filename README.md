# Gzool blog

### Change gem sources:
Since rubygems.org is fucked by GFW, so need to change gem sources first:

```shell
gem sources --add https://ruby.taobao.org/ --remove https://rubygems.org/
gem sources -l
*** CURRENT SOURCES ***

https://ruby.taobao.org
```

#### Install jekyll
```shell
sudo gem install jekyll
```

if pygments is not installed, then:

```shell
sudo gem install pygments.rb
```


#### Run
```shell
jekyll serve
```

Now browse to http://localhost:4000
