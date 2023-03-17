---
title: FMPP 渲染 List 的解决方案
category: open source tools
tag: tools
permalink: fmpp-list-render-solution
---

[FMPP](http://fmpp.sourceforge.net/index.html) 是一款用来处理 [FreeMarker ](https://freemarker.apache.org/) 模板的文本引擎工具。

FMPP 本身是用 Java 编写的，Node.js 也可以执行 jar 文件，这就给 Node.js 渲染 ftl 模板提供了可能。

模板渲染引擎有两个很重要的素材是模板和数据，FMPP 支持的[数据类型](http://fmpp.sourceforge.net/dataloader.html)非常丰富。

在实际使用过程中，发现 FMPP 在渲染 List 对象（即 JavaScript 中的 Array）时，如果 List 元素为对象，则输出的格式并不符合 JSON 规范，看下面的示例：

```js
// 数据
const obj = [{'name':'HTML'}, {'name':'CSS'}];
```

```js
// ftl 模板
${skills}
```

则输出的结果为：`[{name=HTML}, {name=CSS}]`，这是一个字符串，并且格式并不符合 JSON 规范，我们希望输出的格式和数据本身保持一致。

当然，我们可以写函数转换成 JSON 格式（输出在 HTML 代码中），但处理过程比较繁琐，因为对象字段的值也可以是对象，比如：

```js
// 数据
const skills = [{'name':{first:'HTML',last:'FREEMARKER'}}, {'name':'CSS'}];
```

输出结果为：`[{name={last=FREEMARKER, first=HTML}}, {name=CSS}]`，处理起来就不方便了。

那会不会是 FreeMarker 本身的问题呢？我们可以使用下面的 Java 代码进行验证：

```java
package com.test;

import freemarker.template.*;
import java.util.*;
import java.io.*;

public class FreeMarkerTest {

  public static void main(String[] args) throws Exception {

    Configuration cfg = new Configuration(Configuration.VERSION_2_3_29);
    cfg.setDirectoryForTemplateLoading(new File("ftls"));
    cfg.setDefaultEncoding("UTF-8");
    cfg.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);

    Map root = new HashMap();
    Map obj1 = new HashMap();
    Map obj2 = new HashMap();

    obj1.put("name", "HTML");
    obj2.put("name", "CSS");

    List skills = new ArrayList();
    skills.add(obj1);
    skills.add(obj2);

    root.put("skills", skills);

    Template temp = cfg.getTemplate("test.ftl");

    Writer out = new OutputStreamWriter(System.out);

    temp.process(root, out);
  }
}
```

在项目中导入 [freemarker.jar](https://freemarker.apache.org/freemarkerdownload.html)，并在 `ftls` 目录添加 `test.ftl` 文件，由于 freemarker 默认不能直接渲染 Hash 对象，需要在模板中定义一个方法，我们命名为 `stringify`，`test.ftl` 的内容如下：

```shell
<#function stringify obj>
  <#if !obj??>
    <#return 'undefined'>
  </#if>
    <#if obj?is_boolean || obj?is_number>
        <#return obj?string>
    </#if>
    <#if obj?is_string>
        <#return '"' + obj?js_string + '"'>
    </#if>
  <#if obj?is_enumerable>
    <#local str = '['>
    <#list obj as x>
      <#local str = str + stringify(x)>
      <#if x_has_next>
        <#local str = str + ','>
      </#if>
    </#list>
    <#return str + ']'>
  </#if>
  <#if obj?is_hash || obj?is_hash_ex>
    <#local str = '{'>
    <#local arr = [] >
    <#local keys = obj?keys>
    <#list keys as x>
      <#if x!='class' && obj[x]?? && !obj[x]?is_method>
        <#local arr = arr + [x]>
      </#if>
    </#list>
    <#list arr as x>
      <#local str = str + x + ':' + stringify(obj[x])>
      <#if x_has_next>
        <#local str = str + ','>
      </#if>
    </#list>
    <#return str + '}'>
  </#if>
  <#return ''>
</#function>

${stringify(skills)}
```

结果输出为：`[{name:"HTML"},{name:"CSS"}]`，这个是我们想要的结果，所以原生的 freemarker 没有问题。


# 解决方案

FMPP 支持扩展数据类型，只要导入自定义的 JSON 解析包就可以了，具体步骤如下：

### 编写自定义解析库
这里我们直接使用 [flexjson](https://sourceforge.net/projects/flexjson/files/) 这个库，下载后，将 flexjson jar 包导入项目，解析库代码如下：

```java
package com.test.fmpp;

import flexjson.JSONDeserializer;
import flexjson.JSONSerializer;
import fmpp.Engine;
import fmpp.tdd.DataLoader;

import java.util.List;

public class JSONFactory implements DataLoader {

  @Override
  public Object load(Engine e, List args) throws Exception {
    return new JSON();
  }

  public static class JSON {
    public String stringify(Object object) {
      return new JSONSerializer().deepSerialize(object);
    }

    public Object parse(String jsonString) {
      return new JSONDeserializer().deserialize(jsonString);
    }
  }
}
```

将上述代码打成 jar 包，命名为 `json.jar`。


### 将 `flexjson.jar` 和 `json.jar` 导入 FMPP

下载 [FMPP](http://fmpp.sourceforge.net/index.html) 后，将上述的 `flexjson.jar` 和 `json.jar` 都拷贝到 FMPP 的 `lib` 目录下（注：放在 lib 目录中的 jar 包会自动导入到执行上下文中）。在调用 fmpp 命令时，除了要将数据传入外，还需要传入 JSON 解析方法，代码如下：

```js
`data:{${fmppData},JSONUtil:com.test.fmpp.JSONFactory()}`
```

### 在 ftl 模板中使用新的解析方法

现在 ftl 模板就可以这么写了：

```js
// ftl 模板
${JSONUtil.stringify(skills)}
```

结果输出为： `[{'name':'HTML'}, {'name':'CSS'}]`，可以直接输出在 HTML 中作为合法的 JavaScript 代码。

目前该方法已经集成在 [NEI](https://github.com/NEIAPI/nei-toolkit/blob/master/lib/node-fmpp/index.js#L44) 工具中，有兴趣的朋友可以自己研究。
