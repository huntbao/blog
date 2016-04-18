---
layout: post
category: js
title: 获取输入框中选中文本相对于页面的偏移
---

### 题目：计算下图所示输入框中的选中文本相对于页面的偏移位置：

![o_textarea_selected_text_offset]({{ site.baseurl }}public/images/o_textarea_selected_text_offset.png)

#### 首先思考如何获取页面上选中文本相对页面的偏移位置。

很多人可能知道 [Element.getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect){:target="_blank"}，但这个方法是获取已知元素相对页面的偏移位置，所以在这里不能使用这个方法。

其实 [Range](https://developer.mozilla.org/en-US/docs/Web/API/range){:target="_blank"} 也有一个 [Range.getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/Range.getBoundingClientRect){:target="_blank"} 方法，它是获取 Range 相对于页面的偏移位置，又可以根据 [Selection](https://developer.mozilla.org/en-US/docs/Web/API/Selection){:target="_blank"} 得到 Range，所以问题似乎迎刃而解了。

对于 IE 来说，问题是解决了，因为 IE 有一个叫做 [createTextRange](http://msdn.microsoft.com/en-us/library/ie/ms536401(v=vs.85).aspx){:target="_blank"} 方法，它对于输入框中的选中文本也是有效的。但 Webkit 中却没有这个方法，似乎没有什么完美的方法能解决这个问题。今天要讨论的就是如何在 Chrome ( Webkit ) 中解决这个问题。

#### 解决的思路如下：

- 使用 div 克隆输入框，即使 div 看上去和输入框如出一辙：边框、字体、颜色、内容等。
- 根据输入框的 selectionStart 和 selectionEnd 值，选中 div 中对应的内容。
- 获取 Selection 得到 Range，再使用 Range.getBoundingClientRect() 方法获取偏移值。
- 删除 div 元素，根据之前保存的输入框的 selectionStart 和 selectionEnd 值，选中输入框之前选中的文本。


代码实现如下：

{% highlight javascript %}
var getSelectedTextBounding = function (input, start, end) {
    var inputBoudRect = input.getBoundingClientRect()
    var div = $('<div>').html(input.value.replace(/\n/g, '<br />')).appendTo(document.body)
    div[0].style.cssText = document.defaultView.getComputedStyle(input, null).cssText
    div.css({
        position: 'absolute',
        left: inputBoudRect.left,
        top: inputBoudRect.top,
        margin: 0,
        overflow: 'hidden'
    })
    div[0].scrollLeft = input.scrollLeft
    div[0].scrollTop = input.scrollTop
    var range = setSelectionRange(div[0], start, end)
    var textBounding = range.getBoundingClientRect()
    div.remove()
    return textBounding

    function getTextNodesIn(node) {
        var textNodes = []
        if (node.nodeType == 3) {
            textNodes.push(node)
        } else {
            var children = node.childNodes
            for (var i = 0, len = children.length i < len ++i) {
                textNodes.push.apply(textNodes, getTextNodesIn(children[i]))
            }
        }
        return textNodes
    }

    function setSelectionRange(el, start, end) {
        var range = document.createRange()
        range.selectNodeContents(el)
        var textNodes = getTextNodesIn(el)
        var foundStart = false
        var charCount = 0, endCharCount

        for (var i = 0, textNode; textNode = textNodes[i++];) {
            endCharCount = charCount + textNode.length
            if (!foundStart && start >= charCount && (start < endCharCount || (start == endCharCount && i < textNodes.length))) {
                range.setStart(textNode, start - charCount)
                foundStart = true
            }
            if (foundStart && end <= endCharCount) {
                range.setEnd(textNode, end - charCount)
                break
            }
            charCount = endCharCount
        }

        var sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
        return range
    }
}


var mouseDownedInput = null

$(document).on('mousedown', 'input, textarea', function () {
    mouseDownedInput = this
})

$(document).mouseup(function (e) {
    var sel = window.getSelection()
    var selectedText = sel.toString().trim()
    var boundingClientRect
    if (selectedText) {
        var r = sel.getRangeAt(0)
        if (r.collapsed) {
            if (mouseDownedInput) {
                var start = mouseDownedInput.selectionStart
                var end = mouseDownedInput.selectionEnd
                boundingClientRect = getSelectedTextBounding(mouseDownedInput, start, end)
                mouseDownedInput.setSelectionRange(start, end)
            }
        } else {
            boundingClientRect = r.getBoundingClientRect()
        }
    }
    console.log(boundingClientRect)
    mouseDownedInput = null
})
    
{% endhighlight %}

#### 说明

- 代码默认使用 jQuery 库。
- 上面的代码并没完美地解决问题，主要是使用 div 模拟 textarea （或者input）时会遇到一些问题，比如 textarea 中的换行，div 中需要转换成 <br> 标签，这期间会丢失精度（当然也可以多写些代码解决这个精度问题，但这里不再讨论）。
- 其他的都是一些细节问题，也有可能没有测试到，有遗漏也在所难免。若有问题，欢迎给我留言，非常感谢。
- 这段代码已经用在了我开发的 Chrome 扩展中，欢迎使用：[饥猪阅读](https://chrome.google.com/webstore/detail/jfckifkogfenafeakigpkjlifbkklmih){:target="_blank"}，github地址：[https://github.com/huntbao/piggyreader](https://github.com/huntbao/piggyreader){:target="_blank"}



#### 参考资料

- [http://stackoverflow.com/questions/298750/how-do-i-select-text-nodes-with-jquery](http://stackoverflow.com/questions/298750/how-do-i-select-text-nodes-with-jquery){:target="_blank"}

本文最初发表于[博客园](http://www.cnblogs.com/huntbao/p/get-input-selected-text-offset.html){:target="_blank"}