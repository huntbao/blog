---
layout: post
title: 在网易云上部署应用
category: engineering
tag: engineering
permalink: depoy-site-on-163yun
---

本文以 Node.js 应用为例，一步一步演示如何将它部署到[网易云的蜂巢](http://c.163yun.com/)上面。

## 本地开发环境及工具

* 操作系统：macOS Sierra 10.12.1

* 后端技术：Node.js v6.9.2 + Koa v1.2.4 + MySql v5.7.17 + Redis v2.6.3

* 前端技术：Vuejs v2.1.0 + Webpack v2.1.0

* 版本控制：Git

* 接口定义：[NEI 接口管理平台](https://nei.netease.com/)

* 接口 Mock 工具：[NEI Toolkit](https://github.com/NEYouFan/nej-toolkit)


## 项目开发流程

首先在 [NEI 接口管理平台](https://nei.netease.com/) 上面定义好所有的异步接口、数据模型和页面等资源，通过 [NEI Toolkit](https://github.com/NEYouFan/nei-toolkit) 提供接口 Mock 服务。

使用 Vuejs 和 Webpack 开发前端页面，同时调通所有的接口。前端开发完成后，再使用 Node.js 开发后端服务。再之后的前后端调试利用 NEI Toolkit 提供的代理功能，将请求代理到本地的 Node.js 服务接口上。开发完成后，在本地将所有资源打包，提交到代码仓库。本演示项目托管在 [bitbucket](https://bitbucket.org/) 上面。

本地的静态文件由 Node.js 服务提供，部署到服务器上后，我们希望使用 Nginx 直接代理到本地文件。本地开发 Node.js 的服务端口是 8081，部署到服务器上面后，端口保持不变，通过 Nginx 将 80 端口转到 8081 上面。


## 在网易蜂巢上面创建服务

登录 [网易蜂巢](https://c.163.com/)，左边侧栏，老用户有“容器管理”选项，新用户只能看到“服务管理”。

点击“服务管理”，可以创建空间，也可以直接使用 default 空间。选中空间后，点击“创建服务”。

按要求填写服务名称，服务有“无状态”和“有状态”之分，这里我们选择“有状态”，选择使用“公网”。

如果想按带宽收费就选“带宽”，想按流量收费就选“流量”，不同的带宽大小收费不一样。

> 注意，选择按“流量”收费后，下面显示的仍旧是带宽数，此时带宽大小并不影响费用，因为服务是按“流量”收费的

点击“下一步”。

选择镜像。这里我们选择“蜂巢官方镜像”下面的 “public/ubuntu”，版本是 16.04。

填写容器名称。SSH 密钥先选择不注入（因为目前的版本直接注入后，之后使用时会遇到问题）。

点击“下一步”。

按照自己的喜好和预算选择计费方式和规格。由于我们使用公网来使用服务，“端口配置”可以先忽略，按要求随便填个数字即可。

此时最下方会显示配置信息和配置费用的总览，如下图所示：

![static](/public/images/fengchao/config.png)

确认信息无误，点击“立即创建”。之后会显示创建过程的信息提示，不用等多久，服务就会创建完成。


## 登录远程服务器

服务创建完成后，点击“详情信息”标签。我们看到，系统已经为该服务分配了一个公网IP，可以将自己的域名解析到这个公网IP。

由于我们在创建服务的时候并没有注入自己的 SSH 密钥，还无法通过本地机器的终端连远程机器。此时可以通过 Web Console 来操作。

点击“副本信息”中相应服务的 Console，就可以登录远程服务器了。


## 服务环境安装

>以下所有操作都可以在 Web Console 中直接完成

需要安装的工具有：Node.js、Git、Redis、Nginx，至于 MySql，网易蜂巢提供了专门的数据库服务，不过，本着省钱的原则，哦，不对，本着钻研技术的精神，本文会演示如何在机器上安装 MySql。

所有安装操作都较直观，按提示安装即可。安装方法及顺序也多种多样，可自行选择。

首先更新安装工具命令：

{% highlight shell %}
apt-get update
{% endhighlight %}


安装 npm：

{% highlight shell %}
apt-get install npm
{% endhighlight %}


使用 npm 安装 n：

{% highlight shell %}
npm install n -g
{% endhighlight %}


使用 n 安装 Node：

{% highlight shell %}
n 6.9.2
{% endhighlight %}


安装 Redis：

{% highlight shell %}
apt-get install redis-server
{% endhighlight %}


启动 Redis：

{% highlight shell %}
/etc/init.d/redis-server start
{% endhighlight %}

更改 Redis 密码：

{% highlight shell %}
vim /etc/redis/redis.conf
{% endhighlight %}

找到 `SECURITY` 部分的 `requirepass`，后面跟的就是需要设置的密码。

安装 Git：

{% highlight shell %}
apt-get install git-core
{% endhighlight %}


安装 MySql：

{% highlight shell %}
apt-get install mysql-server mysql-client
{% endhighlight %}


启动 MySql：

{% highlight shell %}
/etc/init.d/mysql start
{% endhighlight %}


配置 MySql

由于 mysql 默认使用的编码是 lant1，默认时区也不是中国时区，前者会导致中文乱码问题，后者导致时间差了 8 个小时。

按下面的命令进入 mysql 服务：

{% highlight shell %}
mysql -p
{% endhighlight %}

按提示输入在安装 MySql 时输了两遍的密码。可以使用下面的命令查看 mysql 的编码信息：

{% highlight shell %}
status;
{% endhighlight %}

使用 vim 修改 MySql 的配置文件，修改编码和时区：

{% highlight shell %}
vim /etc/mysql/mysql.conf.d/mysqld.cnf
{% endhighlight %}

按一下键盘上的“i”键，进入 INSERT 状态：

找个空处，输入以下内容：

{% highlight shell %}
[client]
default-character-set=utf8mb4

[mysql]
default-character-set=utf8mb4
{% endhighlight %}

在 `[mysqld]` 添加以下内容：

{% highlight shell %}
character-set-server = utf8mb4
collation-server = utf8mb4_general_ci

default-time-zone = '+8:00'
{% endhighlight %}

确认无误后，按一下键盘上的“esc”键，再输入“:wq”保存此次更改，重启 mysql 服务：

{% highlight shell %}
/etc/init.d/mysql restart
{% endhighlight %}

至此，除了 Nginx 外，其他工具都已经安装完成。


## 通过 pm2 部署 Node.js 应用

本小节演示如何通过 [PM2](https://github.com/Unitech/pm2) 将 Node.js 应用部署到目标服务器上面。

本地机器和目标服务器都需要 PM2，通过以下命令安装：

{% highlight shell %}
npm install -g pm2
{% endhighlight %}

在项目根目录输入下述命令生成 pm2 的配置文件：

{% highlight shell %}
pm2 ecosystem
{% endhighlight %}

编辑生成的 `ecosystem.config.js` 文件，内容大致如下：

{% highlight javascript %}
module.exports = {
  apps: [
    {
      name: "[项目名称]",
      script: "[启动文件]",
      env: {
        COMMON_VARIABLE: "true"
      },
      env_production: {
        NODE_ENV: "production"
      },
      args: '[传给Node应用的参数放这里]'
    }
  ],
  deploy: {
    production: {
      user: "root",
      host: "[蜂巢服务的公网IP地址]",
      ref: "origin/master",
      repo: "[bitbucket上面的源代码仓库地址]",
      path: "[在服务器上面存放源代码的路径]，比如 /home/myproject",
      "post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js --env production"
    }
  }
}
{% endhighlight %}

填写完毕后，首次部署时输入下述命令，否则不要输最后的 `setup`：

{% highlight shell %}
pm2 deploy ecosystem.config.js production setup
{% endhighlight %}

此时会提示拉取代码失败，因为远程服务器并没有拉取 bitbucket 源代码的权限。


## 设置 SSH 公钥

打开 Web Console，输入下述命令生成远程机器的 SSH 密钥：

{% highlight shell %}
ssh-keygen
{% endhighlight %}

没有特殊要求就一路回车，生成完后，通过下述命令 copy 公钥：

{% highlight shell %}
cat ~/.ssh/id_rsa.pub | pbcopy
{% endhighlight %}

打开 bitbucket 上面的项目，点击左边侧栏最下文的“Settings”，在面板中选择“Access keys”，选择“Add key”，将刚才拷贝的公钥复制到 key 输入框中，保存即可。

至此，远程服务器就有拉取这个项目源代码的权限了。

再在本地运行部署命令：

{% highlight shell %}
pm2 deploy ecosystem.config.js production
{% endhighlight %}

可能还会报错，按提示可通过下述命令解决：

{% highlight shell %}
ssh-keyscan -t rsa bitbucket.org >> ~/.ssh/known_hosts
{% endhighlight %}

再次运行上面的部署命令，如果看到最后的 “Success”，那就说明部署已经成功。

> `npm install` 命令可能花费较长时间，有可能会安装失败，可以使用 `npm install --production` 节省一些时间和流量:)

此时就可以在浏览器中打开你的应用了，地址是：`http://[蜂巢服务的公网IP地址]:8081`


## 安装 Nginx

我们希望静态文件通过 Nginx 直接代理到本地文件，并且可以直接通过地址 `http://[蜂巢服务的公网IP地址]` 访问到我们的应用。

先安装 Nginx：

{% highlight shell %}
apt-get install nginx
{% endhighlight %}

通过 vim 修改 nginx 的配置文件：

{% highlight shell %}
vim /etc/nginx/sites-enabled/default
{% endhighlight %}

在监听 80 端口的 server 中，按照自己的需求更改配置，比如：


静态文件的代理配置：

{% highlight shell %}
location ~ ^/(libs|dist)/ {
    expires 1y;
    root /home/myproject;
}
{% endhighlight %}


将服务代理到 8081 端口的配置：

{% highlight shell %}
location / {
    expires -1;
    proxy_pass http://localhost:8081;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
}
{% endhighlight %}

打开 gzip：
{% highlight shell %}
gzip on;
gzip_min_length 1k;
gzip_buffers 4 8k;
gzip_http_version 1.1;
gzip_types text/plain application/javascript application/x-javascript text/javascript text/css application/xml;
{% endhighlight %}

配置修改完后，启动或者重启 Nginx 服务：

{% highlight shell %}
// 启动
nginx

// 或者重启
nginx -s reload
{% endhighlight %}

至此，应用部署完成。


## 写在最后

由于环境和软件版本的差异以及随着时间的推移，本文所讲述的过程和方法难免会出现差错的情况。也有可能现在你完全按照本文的操作步骤也不成功，这些都是可能的。不过，如果你已经看到这里，我相信所有的问题你都能解决。
