# unlock-bilibili-PcBrowser-comment

基于油猴实现的新版b站评论区显示IP归属地与展示被隐藏评论

## 食用方法

1. Greasy fork (未启用，等待更新)
2. 下载本仓库的 index.js，在油猴管理页面新建一个脚本，并将下载的js文件里面的内容复制一份到新建的脚本中

## 实现原理

1. 通过 DOM 获取评论区 __vue_app__ 实例，并通过 provides 获取全局注入的 store，将 store 内部数据进行修改
2. 获取所有评论的 DOM 实例，通过 __vnode 属性获取 props，再根据 props 传入内容进行 DOM 处理以添加 IP 属地展示和隐藏评论提示

## 效果

https://www.bilibili.com/video/BV1Bd4y1j7jy

![图片](https://user-images.githubusercontent.com/86217807/220519616-e394440a-a760-4195-bcda-68c2e4687a56.png)
