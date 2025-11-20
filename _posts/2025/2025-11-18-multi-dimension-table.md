---
title: 多维表格
category: multi-dimension-table
tag: tools
permalink: multi-dimension-table
---

## 概念介绍

多维表格，其实就是一张可视化的数据库表，比如使用 MySQL Workbench 查询数据库时，查询结果集就是一张可视化的表格。

![mysql_workbench](/public/images/multidimensiontable/mysql_workbench.png)

多维表格的每一行数据，都是一个记录，每一列数据，都是一个字段，字段类型很丰富，可以是文本、数字、日期等。多维表格的历史可以追溯到 2012年 Airtable 的诞生，Airtable 是一个在线多维表格工具，类似于 Google Sheets，但功能更强大。

有了数据后，就可以对数据进行统计分析了，绘制图表、生成报表等。

下面介绍一下飞书多维表格，以了解多维表格的大致功能。

## 飞书多维表格

![feishu_mdt_1](/public/images/multidimensiontable/feishu_mdt_1.png)

上图是使用飞书多维表格内置的「工单系统」模板创建的多维表格。

我们发现，表格字段的类型非常丰富，有文本、单选、多选、人员、群组等。

![feishu_mdt_2](/public/images/multidimensiontable/feishu_mdt_2.png)

每种非文本类型都是一种功能逻辑的抽象，就和前端组件一样，可以实现特定的功能。

每种类型还有一个附加的功能叫做“字段捷径”，这个功能很强大，比如可以结合 AI 对某个字段进行总结、翻译等操作。

![feishu_mdt_3](/public/images/multidimensiontable/feishu_mdt_3.png)

此外，字段类型还可以是公式，可以对其他字段进行计算，生成新的字段。公式计算实现了一套自己的函数体系，类似 Excel 公式，如果要去查看文档，就需要花点时间学习，幸好可以借助 AI 来辅助完成。

![feishu_mdt_4](/public/images/multidimensiontable/feishu_mdt_4.png)

有了数据后，就可以对数据进行分析了，飞书多维表格内置了很图表功能，可以将数据可视化。

![feishu_mdt_5](/public/images/multidimensiontable/feishu_mdt_5.png)

![feishu_mdt_6](/public/images/multidimensiontable/feishu_mdt_6.png)

飞书多维表格还有其他更强大的功能，比如可以添加自动化工作流等，在此不再赘述。

## 适用场景

多维表格就相当于一款数据管理和分析的垂直低代码工具，使用起来非常方便，适用于非技术人员进行数据管理和分析（当然技术人员也可以使用）。

多维表格的数据支持导入，用户可以将 Excel、CSV 等格式的数据导入到多维表格中。这和传统的 BI 工具不同，传统 BI 工具一般需要连接数据库或数据仓库，数据准备工作比较复杂，而多维表格则简化了数据准备的过程。

不过多维表格的主要弱点也是数据维护，需要人工维护更新，要分析的数据大多数都来自用户公司的内部系统，一般不太会以开放接口对接外部系统，因为这样就需要技术人员介入了，使用成本就高了。

另外，我体验下来，Web 版本的多维表格用起来还是挺卡顿的，尤其是数据量大时，操作体验不太友好，也有可能是我的电脑配置有点落伍吧。

## 总结

整体来说，多维表格（对于首次使用的我来说）还是非常惊艳的，功能强大且易用，适合非技术人员进行数据管理和分析，发现数据背后的隐藏价值，工作效率大大提升。

再结合 AI 的能力，多维表格的使用门槛进一步降低。