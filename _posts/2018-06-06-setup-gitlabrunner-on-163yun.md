---
layout: post
title: 在网易云上安装 Gitlab Runner
category: engineering
tag: engineering
permalink: setup-gitlabrunner-on-163yun
---

本文演示如何在[网易云](http://c.163yun.com/)上面安装 Gitlab Runner。


## 在网易蜂巢上面创建容器服务

登录 [网易蜂巢](https://c.163.com/)，左边侧栏，选择“容器服务”。可以创建空间，也可以直接使用 default 空间。选中空间后，点击“创建有状态负载”。

![static]({{ site.baseurl }}public/images/setupgitlabrunner/fc1.png)

填写完后，点击“下一步”。

点击“选择镜像”。

![static]({{ site.baseurl }}public/images/setupgitlabrunner/fc2.png)

在搜索框中，输入 `ubuntu`，选择“公共镜像”，选择自己喜欢的版本，我们就选择默认的“16.04-tools”。

填写容器名称。

选择 `SSH 密钥`。这是用户自己电脑上的公钥，等容器创建好后，可以在本地使用 SSH 的方式直接登录容器。如果是初次使用，就选择“创建SSH密钥”，然后选择“导入密钥”，可以上传本地的 SSH 公钥，或者是将公钥内容粘贴到文本框中。

蜂巢也可以直接使用 `Web Console`，本文使用这种方式，之后会讲解。

由于 Gitlab Runner 的 CI 服务，会产生很多的构建和缓存文件，容器的系统盘只有 20G，一般来说对于有规模的团队是不够用的，这里我们再挂载一个数据盘，大家可以按照自己的实际需求选择是否要挂载额外的数据盘。

选择“创建云硬盘”，按要求填写名称，按实际需求选择硬盘的容量

![static]({{ site.baseurl }}public/images/setupgitlabrunner/fc3.png)

点击“选择数据盘”下拉菜单，选择我们刚才创建的数据盘，然后填写挂载目录

![static]({{ site.baseurl }}public/images/setupgitlabrunner/fc4.png)

>注意，因为 gitlab runner 默认会安装在 /home/gitlab-runner 目录中，挂载目录也需要选择这个

点击“下一步”，然后点击“立即创建”，此时就会开始创建我们设置的容器服务。

不用等多久，容器服务就会创建完成。

## 绑定公网IP

容器服务创建成功后，需要绑定公网IP，选择容器服务的“详细信息”标签，点击“绑定公网IP”

![static]({{ site.baseurl }}public/images/setupgitlabrunner/fc5.png)

如果没有可用的公网IP，需要先申请公网IP。根据官方说明“弹性公网 IP 目前仅适用于可用区 B 中 VPC 网络环境中的实例，旧版 IP 管理中 IP 仅适用于可用区 A 中 classic 网络环境中的实例”，申请符合容器服务的公网IP。

因为前面我们在创建容器服务时，使用的是默认可用区，也就是“可用区A”，所以我们就只能申请“旧版 IP 管理”中的公网IP。申请完后，再到容器服务的详情页面中进行绑定即可。


## 登录服务器

选择“副本管理”标签，点击“Console”

![static]({{ site.baseurl }}public/images/setupgitlabrunner/fc6.png)


## 安装 Gitlab Runner

按照[官方文档](https://docs.gitlab.com/runner/install/linux-manually.html)，安装 Gitlab Runner

1. 运行下面的命令：

{% highlight shell %}
wget -O /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-linux-amd64
{% endhighlight %}

2. 修改权限

{% highlight shell %}
chmod +x /usr/local/bin/gitlab-runner
{% endhighlight %}

3. 创建 GitLab CI 用户

{% highlight shell %}
useradd --comment 'GitLab Runner' --create-home root --shell /bin/bash
{% endhighlight %}

4. 安装并运行服务

{% highlight shell %}
gitlab-runner install --user=root --working-directory=/home/gitlab-runner
gitlab-runner start
{% endhighlight %}


## 注册 Runner

先打开 Gitlal 上的某个项目，选择设置中的 CI/CD 页面，里面有注册 Runner 时需要的 URL 地址和 Token 信息。

然后依次运行下面的命令

运行注册命令

{% highlight shell %}
gitlab-runner register
{% endhighlight %}

输入 CI/CD 页面显示的 URL 地址
{% highlight shell %}
Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com )
https://xxx.xxx.xxx
{% endhighlight %}

输入 CI/CD 页面显示的 Token
{% highlight shell %}
Please enter the gitlab-ci token for this runner
xxx
{% endhighlight %}

输入 Runner 的描述
{% highlight shell %}
Please enter the gitlab-ci description for this runner
[hostame] my-runner
{% endhighlight %}

输入 Runner 的 Tag
{% highlight shell %}
Please enter the gitlab-ci tags for this runner (comma separated):
my-tag,another-tag
{% endhighlight %}

选择 [Runner executor](https://docs.gitlab.com/runner/executors/README.html)，我们选择 `shell`
{% highlight shell %}
Please enter the executor: ssh, docker+machine, docker-ssh+machine, kubernetes, docker, parallels, virtualbox, docker-ssh, shell:
docker
{% endhighlight %}

## 启动 Gitlab Runner

此时，在 Gitlab 上的项目的 CI/CD 设置页面，会出现我们注册的 Runner，并且默认已经是启动的。

如果没有启动，请点击“Enable for this project”。

之后，在项目的根目录中，添加 CI 的配置文件 `.gitlab-ci.yml`，它是一个使用 yaml 格式的文件，所以缩进非常重要，语法详见：[.gitlab-ci.yml](https://docs.gitlab.com/ce/ci/yaml/README.html)。 之后，再提交代码时，就会自动跑指定的任务了。


## 安装其他软件

对于前端来说，运行任务时，基本上都需要 Node.js 和其他的软件。常见的软件安装有：

首先更新安装工具命令：

{% highlight shell %}
apt-get update
{% endhighlight %}

安装 Git：

{% highlight shell %}
apt-get install git-core
{% endhighlight %}

安装 npm：

{% highlight shell %}
apt-get install npm
{% endhighlight %}

>如果要更新到最新的版本，可以再使用 `npm install npm@latest -g` 命令，运行完后记得重新登录容器服务


使用 npm 安装 n：

{% highlight shell %}
npm install n -g
{% endhighlight %}


使用 n 安装 Node：

{% highlight shell %}
n 8.11.2
{% endhighlight %}

安装 cnpm：

{% highlight shell %}
npm install -g cnpm --registry=https://registry.npm.taobao.org
{% endhighlight %}

有些项目可能需要用到 [puppeteer](https://github.com/GoogleChrome/puppeteer)，需要安装一些额外的库文件：

{% highlight shell %}
apt-get update && \
apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
{% endhighlight %}
