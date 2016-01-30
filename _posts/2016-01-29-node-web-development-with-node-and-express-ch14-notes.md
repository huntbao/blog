---
layout: post
title: Web Development with Node and Express Chapter 14 - Routing
---

* [Cool URIs don't change](https://www.w3.org/Provider/Style/URI.html)。

* 构建长久信息架构（IA）的几点建议：

  * 不要在 `URL` 中暴露技术细节：比如以 `.asp` 结尾的 URL。

  * 在 URL 中避免无意义的信息：URL 中的每个词都要深思熟虑。比如 URL 中的 `home`，根目录就是主页（home page），不需要额外添加信息，比如 `/home/directions` 和 `/home/contact`。

  * 避免不必要的长 URL：在其他条件相同的情况下，短 URL 要优于 长 URL。但不要为了以清晰、SEO 为代价而使用短 URL。使用很常见的缩略词。

  * 单词分隔符要一致：从审美学地角度来说，连字符要优于下划线。但无论使用哪种分隔符，要始终保持一致。

  * 不要使用空格或者无法使用键盘打出来的字符：使用字母、数字、连字符和下划线。

  * 使用小写形式的 URL：这会有争议，有些人觉得混合形式的 URL 不但可以接受，而且是更可取的。使用小写对程序自动化处理（处理 URL 时进行的字符串比较等）会有好处。

* Express 的路由不区分子域名，即 `app.get(/about) ` 会匹配 `http://meadowlarktravel.com/about` 和 `http://admin.meadowlarktravel.com/about`。可以使用 `vhost` 模块（virtual host，和 Apache 处理字域名的机制一样）：

{% highlight javascript %}
// create "admin" subdomain...this should appear
// before all your other routes
var admin = express.Router(); app.use(vhost('admin.*', admin));
// create admin routes; these can be defined anywhere
admin.get('/', function(req, res){
  res.render('admin/home');
});
admin.get('/users', function(req, res){
    res.render('admin/users');
});  
{% endhighlight %}

* 路由处理函数是中间件。下面是授权过滤器：
{% highlight javascript %}
function authorize(req, res, next){
  if(req.session.authorized) return next();
  res.render('not-authorized');
}
app.get('/secret', authorize, function(){
    res.render('secret');
})
app.get('/sub-rosa', authorize, function(){
  res.render('sub-rosa');
});
{% endhighlight %}

* 路由中的 `path` 最终会被 Express 转换成正则。在 `path` 中可以使用正则的元字符有：`+`, `?`, `*`, `(`, 和 `)`（不是所有的元字符都支持，比如 `.` 就不支持）。比如 `/user` 和 `/username` 使用同一个处理函数的写法：

{% highlight javascript %}
app.get('/user(name)?', function(req,res){
  res.render('user');
});
{% endhighlight %}

* 路由参数使用 `:` 表示，它匹配除了 `/` 之外的任何字符，匹配的结果放在 `req.params` 对象中，key 是路径参数的名称。在创建 REST API 时经常会使用路由参数。
{% highlight javascript %}
app.get('/staff/:city/:name', function(req, res){
  var info = staff[req.params.city][req.params.name];
  if(!info) return next(); // will eventually fall through to 404
  res.render('staffer', info);
});
{% endhighlight %}

* 常见的路由组织方式：

  * 路由处理程序使用具名函数。

  * 路由不要很神秘（比如到处乱放、分散在各个地方）。

  * 路由的组织要有扩展性。

  * 使用自动化的基于 `view` 的路由处理程序，去除重复代码（比如 URL 固定的静态资源）。

* 路由模块化，一种方法是返回一个数组，数组的每一项是包含 `method` 和 `handler` 属性的对象，如下所示：

{% highlight javascript %}
var routes = require('./routes.js')();

routes.forEach(function(route){
  app[route.method](route.handler);
})
{% endhighlight %}

* 按逻辑组织路由，将一些功能相关的放在一起。

* 添加 `view` 后不用增加路由的方法：

{% highlight javascript %}
var autoViews = {};
var fs = require('fs');
app.use(function(req,res,next){
  var path = req.path.toLowerCase();
  // check cache; if it's there, render the view
  if(autoViews[path]) return res.render(autoViews[path]);
  // if it's not in the cache, see if there's
  // a .handlebars file that matches
  if(fs.existsSync(__dirname + '/views' + path + '.handlebars')){
    autoViews[path] = path.replace(/^\//, '');
    return res.render(autoViews[path]);
  }
  // no view found; pass on to 404 handler
  next();
});
{% endhighlight %}

* 其他组织路由的方法：

  * `namespaced routing`：[express-namespace](https://github.com/expressjs/express-namespace)，适合于有大量有固定前缀的路由。

  * `resourceful routing`：[express-resource ](https://github.com/expressjs/express-resource)，它会根据对象的方法自动添加路由，适合于面向对象的代码逻辑。
