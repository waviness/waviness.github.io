(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-mailBox-mailAdd-mailAdd"],{"3ba0":function(t,i,a){"use strict";var e;a.d(i,"b",(function(){return n})),a.d(i,"c",(function(){return l})),a.d(i,"a",(function(){return e}));var n=function(){var t=this,i=t.$createElement,a=t._self._c||i;return a("v-uni-view",{staticClass:"container"},[a("v-uni-view",{staticClass:"mail-box"},[a("v-uni-view",{staticClass:"mail-title"},[a("v-uni-view",{staticClass:"mail-title-t"},[t._v("信件标题：")]),a("v-uni-input",{staticClass:"mail-title-input",attrs:{type:"text",maxlength:"30","placeholder-class":"place-holder",placeholder:"输入标题"},model:{value:t.mail.title,callback:function(i){t.$set(t.mail,"title",i)},expression:"mail.title"}})],1),a("v-uni-view",{staticClass:"mail-cont"},[a("v-uni-textarea",{staticClass:"mail-cont-input",attrs:{"placeholder-class":"place-holder",placeholder:"在此输入详细描述…",maxlength:"200"},model:{value:t.mail.content,callback:function(i){t.$set(t.mail,"content",i)},expression:"mail.content"}})],1),a("v-uni-view",{staticClass:"line"}),a("v-uni-view",{staticClass:"mail-type"},[a("v-uni-view",{staticClass:"mail-type-t"},[t._v("匿名")]),a("v-uni-switch",{on:{change:function(i){arguments[0]=i=t.$handleEvent(i),t.switchChange.apply(void 0,arguments)}}})],1)],1),a("v-uni-view",{staticClass:"submit",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.mailAdd()}}},[t._v("提交")])],1)},l=[]},"6caf":function(t,i,a){"use strict";a.r(i);var e=a("3ba0"),n=a("b100");for(var l in n)"default"!==l&&function(t){a.d(i,t,(function(){return n[t]}))}(l);a("818e");var o,s=a("f0c5"),d=Object(s["a"])(n["default"],e["b"],e["c"],!1,null,"73d9b7f9",null,!1,e["a"],o);i["default"]=d.exports},7997:function(t,i,a){var e=a("24fb");i=e(!1),i.push([t.i,".container[data-v-73d9b7f9]{width:100%;min-height:calc(100vh - %?30?%);padding-top:%?30?%;background:#f2f2f6}.mail-box[data-v-73d9b7f9]{width:%?654?%;height:auto;padding:%?24?%;background-color:#fff;-webkit-border-radius:%?16?%;border-radius:%?16?%;margin:auto}.mail-box .mail-title[data-v-73d9b7f9]{height:%?60?%;margin-bottom:%?30?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.mail-box .mail-title .mail-title-t[data-v-73d9b7f9]{font-size:%?32?%}.mail-box .mail-title .mail-title-input[data-v-73d9b7f9]{width:%?444?%;height:%?56?%;line-height:%?56?%;padding:0 %?12?%;font-size:%?26?%;border:%?1?% #dbdbdb solid;-webkit-border-radius:%?12?%;border-radius:%?12?%}.mail-box .mail-cont[data-v-73d9b7f9]{width:%?606?%;height:auto;padding:%?24?%;border:%?1?% #dbdbdb solid;-webkit-border-radius:%?16?%;border-radius:%?16?%}.mail-box .mail-cont .mail-cont-input[data-v-73d9b7f9]{width:100%;line-height:%?36?%;font-size:%?26?%}.mail-box .line[data-v-73d9b7f9]{width:%?654?%;height:1px;background-color:hsla(0,0%,62.4%,.5);margin:%?40?% 0}.mail-box .mail-type[data-v-73d9b7f9]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.mail-box .mail-type .mail-type-t[data-v-73d9b7f9]{font-size:%?32?%}.submit[data-v-73d9b7f9]{width:%?560?%;height:%?80?%;line-height:%?80?%;background-color:#5fc2ff;-webkit-border-radius:%?40?%;border-radius:%?40?%;text-align:center;font-size:%?32?%;color:#fff;position:absolute;bottom:%?112?%;left:%?85?%}",""]),t.exports=i},"7d2b":function(t,i,a){"use strict";Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var e={data:function(){return{mail:{content:"",isAnonymous:!1,title:""}}},onLoad:function(){},onShow:function(){},methods:{switchChange:function(t){console.log(t),t.detail.value?this.mail.isAnonymous=!0:this.mail.isAnonymous=!1},mailAdd:function(){var t=this;this.$api.newMailbox(this.mail).then((function(i){t.$toast("信件发送成功"),uni.navigateBack({delta:1})}))}}};i.default=e},"818e":function(t,i,a){"use strict";var e=a("a738"),n=a.n(e);n.a},a738:function(t,i,a){var e=a("7997");"string"===typeof e&&(e=[[t.i,e,""]]),e.locals&&(t.exports=e.locals);var n=a("4f06").default;n("e99fbf12",e,!0,{sourceMap:!1,shadowMode:!1})},b100:function(t,i,a){"use strict";a.r(i);var e=a("7d2b"),n=a.n(e);for(var l in e)"default"!==l&&function(t){a.d(i,t,(function(){return e[t]}))}(l);i["default"]=n.a}}]);