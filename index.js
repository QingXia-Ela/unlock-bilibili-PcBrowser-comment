// ==UserScript==
// @name         Bilibili 展示评论IP属地与显示被隐藏评论
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  新版b站页面展示ip属地与被隐藏评论
// @author       https://github.com/QingXia-Ela
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460488/Bilibili%20%E5%B1%95%E7%A4%BA%E8%AF%84%E8%AE%BAIP%E5%B1%9E%E5%9C%B0%E4%B8%8E%E6%98%BE%E7%A4%BA%E8%A2%AB%E9%9A%90%E8%97%8F%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/460488/Bilibili%20%E5%B1%95%E7%A4%BA%E8%AF%84%E8%AE%BAIP%E5%B1%9E%E5%9C%B0%E4%B8%8E%E6%98%BE%E7%A4%BA%E8%A2%AB%E9%9A%90%E8%97%8F%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

function modifyReply(el, isSub, replyProps) {
  const s1 = `.${isSub ? 'sub-' : ''}reply-info`, s2 = `.${isSub ? 'sub-' : ''}reply-time`

  const rTime = el.querySelector(s1)?.querySelector(s2)
  if (rTime?.getAttribute('data-is-modify') == 'true') return

  if (replyProps.reply_control.location) {
    const ipl = document.createElement('span')
    ipl.style.color = "#58b1d4"
    ipl.innerHTML = ` ${replyProps.reply_control.location}`
    rTime?.appendChild(ipl)
  }

  if (replyProps.$isInvisible) {
    const invisibleMark = document.createElement('span')
    invisibleMark.style.color = "#d1403e"
    invisibleMark.innerHTML = " 该评论被隐藏"
    rTime?.appendChild(invisibleMark)
  }

  rTime?.setAttribute('data-is-modify', 'true')
}

function getMixinPlugin() {
  return {
    beforeUpdate() {
      const vnode = this._.vnode
      const className = vnode.el.getAttribute("class")
      if (className !== "reply-item" && className !== "sub-reply-item") return
      const isSub = className === "sub-reply-item"
      const props = vnode.props[isSub ? "subReply" : "reply"]
      if (props) modifyReply(vnode.el, isSub, props)
    }
  }
}

(function run() {
  'use strict';

  function modifyReplyData(ReplyList) {
    ReplyList.forEach((v) => {
      if (v.invisible) {
        v.invisible = false
        v.$isInvisible = true
      }
      if (v.replies) modifyReplyData(v.replies)
    })
  }

  function goRender() {
    const commentApp = document.getElementById("comment").querySelector('.comment')
    const store = commentApp.__vue_app__._context.provides.store
    const replyList = store._state.data.apiData.replyList.res.data?.replies ?? []
    modifyReplyData(replyList)

    commentApp.__vue_app__.mixin(getMixinPlugin())
  }

  let hasCommentClass = false
  function init() {
    const targetNode = document.getElementById("comment")
    if (!targetNode) return
    const observer = new MutationObserver((ml) => {
      if (hasCommentClass || targetNode.querySelector('.comment').querySelector('.reply-list')) {
        hasCommentClass = true
        goRender()
      }
    })

    observer.observe(targetNode, {
      childList: true,
      subtree: true
    })
  }

  const timer = setInterval(() => {
    if (!hasCommentClass) init()
    else clearInterval(timer)
  }, 1000);
})();
