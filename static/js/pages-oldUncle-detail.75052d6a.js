(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-oldUncle-detail"],{"0568":function(t,i,n){"use strict";var e=n("9968"),a=n.n(e);a.a},"4fd7":function(t,i,n){"use strict";var e=n("4ea4");Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0,n("96cf");var a=e(n("1da1")),o={data:function(){return{info:{}}},onLoad:function(t){this.id=t.id,this.getDetail()},methods:{getDetail:function(){var t=this;return(0,a.default)(regeneratorRuntime.mark((function i(){var n;return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:return i.next=2,t.$api.getUncel(t.id);case 2:n=i.sent,t.info=n;case 4:case"end":return i.stop()}}),i)})))()}}};i.default=o},"6a1d":function(t,i,n){"use strict";n.r(i);var e=n("4fd7"),a=n.n(e);for(var o in e)"default"!==o&&function(t){n.d(i,t,(function(){return e[t]}))}(o);i["default"]=a.a},"788a":function(t,i,n){var e=n("24fb");i=e(!1),i.push([t.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */.old-info[data-v-36d0f833]{background-color:#fff;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;align-items:center;padding:%?92?% 0 %?40?% 0;margin-bottom:%?24?%}.old-info__img[data-v-36d0f833]{width:%?180?%;height:%?180?%;-webkit-border-radius:100%;border-radius:100%}.old-info__name[data-v-36d0f833]{font-size:%?36?%;margin:%?24?% 0;font-weight:600}.old-info__tag[data-v-36d0f833]{font-size:%?24?%;border:%?2?% solid #333;-webkit-border-radius:%?8?%;border-radius:%?8?%;padding:0 %?20?%;height:%?60?%;line-height:%?56?%}.old-work[data-v-36d0f833]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;align-items:center;background-color:#fff;padding:%?32?% %?36?%;font-size:%?32?%}.old-work__content[data-v-36d0f833]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.old-desc[data-v-36d0f833]{background-color:#fff;padding:%?32?% %?36?%;margin-top:%?24?%}.old-desc__content[data-v-36d0f833]{font-size:%?28?%;background-color:#f2f2f6;-webkit-border-radius:%?18?%;border-radius:%?18?%;padding:%?28?%;margin-top:%?32?%}',""]),t.exports=i},9968:function(t,i,n){var e=n("788a");"string"===typeof e&&(e=[[t.i,e,""]]),e.locals&&(t.exports=e.locals);var a=n("4f06").default;a("3311ba44",e,!0,{sourceMap:!1,shadowMode:!1})},bce3:function(t,i,n){"use strict";var e;n.d(i,"b",(function(){return a})),n.d(i,"c",(function(){return o})),n.d(i,"a",(function(){return e}));var a=function(){var t=this,i=t.$createElement,n=t._self._c||i;return n("v-uni-view",{staticClass:"container"},[n("v-uni-view",{staticClass:"old-info"},[n("v-uni-image",{staticClass:"old-info__img",attrs:{src:t.info.avatar,mode:""}}),n("v-uni-view",{staticClass:"old-info__name"},[t._v(t._s(t.info.name)+" "+t._s(t.info.mobile))]),n("v-uni-view",{staticClass:"old-info__tag"},[t._v(t._s(t.info.tag))])],1),n("v-uni-view",{staticClass:"old-work"},[n("v-uni-view",{staticClass:"old-work__title"},[t._v("已调解的纠纷")]),n("v-uni-view",{staticClass:"old-work__content"},[n("v-uni-view",{staticClass:"blue fs-18 bold mr-4"},[t._v(t._s(t.info.handledTotal))]),t._v("起")],1)],1),n("v-uni-view",{staticClass:"old-work"},[n("v-uni-view",{staticClass:"old-work__title"},[t._v("待调解的纠纷")]),n("v-uni-view",{staticClass:"old-work__content"},[n("v-uni-view",{staticClass:"blue fs-18 bold mr-4"},[t._v(t._s(t.info.handledNotTotal))]),t._v("起")],1)],1),n("v-uni-view",{staticClass:"old-work"},[n("v-uni-view",{staticClass:"old-work__title"},[t._v("平均评价")]),n("v-uni-view",{staticClass:"old-work__content"},[n("v-uni-view",{staticClass:"blue fs-18 bold mr-4"},[t._v(t._s(t.info.rate))]),t._v("星")],1)],1),n("v-uni-view",{staticClass:"old-desc"},[n("v-uni-view",{staticClass:"fs-18 bold"},[t._v("简介")]),n("v-uni-view",{staticClass:"old-desc__content lh-20"},[t._v(t._s(t.info.uncelBrief))])],1)],1)},o=[]},cc2c:function(t,i,n){"use strict";n.r(i);var e=n("bce3"),a=n("6a1d");for(var o in a)"default"!==o&&function(t){n.d(i,t,(function(){return a[t]}))}(o);n("0568");var r,s=n("f0c5"),d=Object(s["a"])(a["default"],e["b"],e["c"],!1,null,"36d0f833",null,!1,e["a"],r);i["default"]=d.exports}}]);