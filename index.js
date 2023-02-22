// ==UserScript==
// @name         Bilibili 展示评论IP属地与显示被隐藏评论
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  新版b站页面展示ip属地与被隐藏评论
// @author       https://github.com/QingXia-Ela
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license MIT
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  /**
   * @param {NodeListOf<Element>} ReplyItemDom
   */
  function modifyDom(ReplyItemDom) {

    function append(e, isSub = false) {
      const replyProps = isSub ? e.__vnode.children[1].props.reply : e.__vnode.ctx.props.reply, s1 = `.${isSub ? 'sub-' : ''}reply-info`, s2 = `.${isSub ? 'sub-' : ''}reply-time`
      const rTime = e.querySelector(s1)?.querySelector(s2)
      if (rTime?.getAttribute('data-is-modify') == 'true') return

      const ipl = document.createElement('span')
      ipl.style.color = "#58b1d4"
      ipl.innerHTML = ` ${replyProps.reply_control.location}`
      rTime?.appendChild(ipl)

      if (replyProps.$isInvisible) {
        const invisibleMark = document.createElement('span')
        invisibleMark.style.color = "#d1403e"
        invisibleMark.innerHTML = " 该评论被隐藏"
        rTime?.appendChild(invisibleMark)
      }

      rTime?.setAttribute('data-is-modify', 'true')
    }

    ReplyItemDom.forEach((e) => {
      // 主节点
      append(e)

      // 子节点
      const subList = e.querySelectorAll('.sub-reply-item')
      subList.forEach((e) => {
        append(e, true)
      })
    })
  }

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

    const ReplyItemDom = commentApp.querySelector('.reply-list').querySelectorAll('.reply-item')

    modifyDom(ReplyItemDom)
  }

  window.addEventListener('load', () => {
    const targetNode = document.getElementById("comment")
    let hasCommentClass = false
    const observer = new MutationObserver((ml) => {
      if (hasCommentClass || targetNode.querySelector('.comment')) {
        hasCommentClass = true
        goRender()
      }
    })

    observer.observe(targetNode, {
      childList: true,
      subtree: true
    })
  })
})();
