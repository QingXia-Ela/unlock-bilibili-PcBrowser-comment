# ~~unlock-bilibili-PcBrowser-comment~~

# 脚本已弃用，b站将改用 lit 做评论区，推荐改用更稳定的脚本

基于油猴实现的新版b站评论区显示IP归属地与展示被隐藏评论

目前只适用于新版视频页面，动态评论显示和旧版视频评论区请移步使用其他脚本

评论被隐藏的原因是评论发送者被 UP 拉黑了

目前b站已移除主楼评论隐藏属性，楼中楼的隐藏暂未被移除

[Github仓库链接](https://github.com/QingXia-Ela/unlock-bilibili-PcBrowser-comment)

脚本不生效的话试试在页面中 Ctrl+F5 不使用缓存，一般就会有效果了

如果还是没有效果请前往 issue 提出问题，并附带上问题描述截图：https://github.com/QingXia-Ela/unlock-bilibili-PcBrowser-comment/issues

## 食用方法

1. Greasy fork
2. 下载[仓库](https://github.com/QingXia-Ela/unlock-bilibili-PcBrowser-comment)的 index.js，在油猴管理页面新建一个脚本，并将下载的js文件里面的内容复制一份到新建的脚本中

## 实现原理

1. 通过 DOM 获取评论区 __vue_app__ 实例，并通过 provides 获取全局注入的 store，将 store 内部数据进行修改
2. 通过 app.mixin 直接获取 vnode 并对真实 dom 进行修改

## 效果

https://www.bilibili.com/video/BV1Bd4y1j7jy

![图片](https://user-images.githubusercontent.com/86217807/220519616-e394440a-a760-4195-bcda-68c2e4687a56.png)
