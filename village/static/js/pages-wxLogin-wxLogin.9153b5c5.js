(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-wxLogin-wxLogin"],{"07f3":function(n,t,e){"use strict";e.r(t);var o=e("49b9"),i=e.n(o);for(var a in o)"default"!==a&&function(n){e.d(t,n,(function(){return o[n]}))}(a);t["default"]=i.a},"1de5":function(n,t,e){"use strict";n.exports=function(n,t){return t||(t={}),n=n&&n.__esModule?n.default:n,"string"!==typeof n?n:(/^['"].*['"]$/.test(n)&&(n=n.slice(1,-1)),t.hash&&(n+=t.hash),/["'() \t\n]/.test(n)||t.needQuotes?'"'.concat(n.replace(/"/g,'\\"').replace(/\n/g,"\\n"),'"'):n)}},3581:function(n,t,e){"use strict";var o=e("c986"),i=e.n(o);i.a},"49b9":function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o={data:function(){return{wxAuthCode:""}},onLoad:function(){},onShow:function(){this.wxLogin()},methods:{wxLogin:function(){var n=this;uni.login({provider:"weixin",success:function(t){console.log("login success:",t),n.wxAuthCode=t.code?t.code:""},fail:function(n){console.log("login fail:",n)}})},getPhoneNumber:function(n){console.log(n),this.wxAuthLogin(n)},wxAuthLogin:function(n){var t=this,e={code:this.wxAuthCode,encryptedData:n.detail.encryptedData,iv:n.detail.iv,villagerWxBind:!1};this.$api.wxAuthLogin(e).then((function(n){console.log(n),t.$toast("授权登录成功"),uni.setStorageSync("token",n.token),uni.setStorageSync("mobile",n.mobile),uni.setStorageSync("role",n.role),uni.setStorageSync("needBindingWx",n.needBindingWx),2==n.role&&(n.needBindingWx?uni.navigateTo({url:"../wxUserInfo/wxUserInfo"}):uni.redirectTo({url:"../index/index"}))})).catch((function(n){t.wxLogin()}))},goLogin:function(){uni.navigateTo({url:"../login/login"})}}};t.default=o},"908a":function(n,t,e){"use strict";var o;e.d(t,"b",(function(){return i})),e.d(t,"c",(function(){return a})),e.d(t,"a",(function(){return o}));var i=function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("v-uni-view",{staticClass:"container"},[e("v-uni-view",{staticClass:"login-box"},[e("v-uni-view",{staticClass:"welcome"},[n._v("欢迎使用")]),e("v-uni-view",{staticClass:"welcome-1"},[n._v("横溪坞村委小程序")]),e("v-uni-button",{staticClass:"login-btn",attrs:{"open-type":"getPhoneNumber"},on:{getphonenumber:function(t){arguments[0]=t=n.$handleEvent(t),n.getPhoneNumber.apply(void 0,arguments)}}},[n._v("微信授权手机号登录")]),e("v-uni-view",{staticClass:"login-other",on:{click:function(t){arguments[0]=t=n.$handleEvent(t),n.goLogin()}}},[n._v("其他手机号登录")])],1)],1)},a=[]},af62:function(n,t,e){"use strict";e.r(t);var o=e("908a"),i=e("07f3");for(var a in i)"default"!==a&&function(n){e.d(t,n,(function(){return i[n]}))}(a);e("3581");var r,c=e("f0c5"),u=Object(c["a"])(i["default"],o["b"],o["c"],!1,null,"3b30bb25",null,!1,o["a"],r);t["default"]=u.exports},bcd7:function(n,t,e){var o=e("24fb"),i=e("1de5"),a=e("d053");t=o(!1);var r=i(a);t.push([n.i,".container[data-v-3b30bb25]{width:100%;height:100vh;background:-webkit-gradient(linear,left top,left bottom,from(#fff),to(#5fc2ff));background:-webkit-linear-gradient(#fff,#5fc2ff);background:linear-gradient(#fff,#5fc2ff)}.login-box[data-v-3b30bb25]{width:100%;height:auto;position:absolute;top:%?300?%;left:0}.login-box .welcome[data-v-3b30bb25]{line-height:%?60?%;padding-left:%?48?%;font-size:%?42?%}.login-box .welcome-1[data-v-3b30bb25]{line-height:%?66?%;padding-left:%?48?%;font-size:%?48?%;font-weight:700;margin-top:%?32?%}.login-box .login-btn[data-v-3b30bb25]{width:%?636?%;padding-left:%?130?%;height:%?96?%;line-height:%?96?%;background-color:#5fc2ff;background-image:url("+r+");background-repeat:no-repeat;background-position:%?470?% %?30?%;background-size:%?40?% %?40?%;-webkit-border-radius:%?48?%;border-radius:%?48?%;font-size:%?36?%;color:#fff;text-align:left;margin-top:%?180?%}.login-box .login-other[data-v-3b30bb25]{line-height:%?42?%;font-size:%?30?%;text-align:center;margin:%?48?% auto 0;color:#696969}",""]),n.exports=t},c986:function(n,t,e){var o=e("bcd7");"string"===typeof o&&(o=[[n.i,o,""]]),o.locals&&(n.exports=o.locals);var i=e("4f06").default;i("e4af8268",o,!0,{sourceMap:!1,shadowMode:!1})},d053:function(n,t){n.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAC8UlEQVRYR82YT4jNURTHP98FKwmxEJJYWZF/C7EwRQaTGWvbmVKKWCilbFgRRSlLW2ZGRv5MWKAwU6ys/MmfmRIrsT46uvN67/d+v/f73fe7T+7yvXPO/fzOuefce474z5f+cz5qA5rZGmA9sBpYGD74J/AJeCvpYx0ndAVoZtuBw0A/sKoE4CtwF7gh6XksbBSgme0BzgLbYjcK8q+AM5IeVNWvBGhmS4FrwKGqhkvkRoERST/K7JUCmtlmYAxYWWYs8v8ZYFDSVCe9joBmtgu4DSyI3Lyq+C/goKRHRQqFgMFzT3oIN8fkkH2S/Hy2rVzAcOZe9yCsRY7ycG+U9D0rUAR4M2FCVA33qKS2JGwDDKXkflWrQc6L8nJgfqReVrxf0r3mH/MAX0TWuTFJQ2bmtdE/bFENyClJWwsBww3xLHKDCUkHXMfMtgAPa0LulPR0jqHFg2bmxXgkEtDFL0o6kQjyuqThIsDPFe7WIv4Lkk4mgJyR1LgUGh4Mr5IPXXivWSUV5DpJ791wM+A+YKImoKungByQdCcLeAS4mgAwBeRRSVeygKeA84kAs5AD4U6vav60pHO9Brwk6XhImv3A35BVXLmAKUN8WdKxALcJmAQWV4RzsdwQx35l0X514dxubpJ481O3zKSAc8D2MhPC8aXGEysV3KykFUU3SbdXXSo45+p41Xk7GftYmJS0u0ZCZM9y8WMhbPISaHnylGSf9xMO6Nnq7WRMtmZNT0vyF1FjpXqwfgOWAPMiSkmeaPmDNXjxFjBUc7NY9XFJg1mlTk3TG6CRTbG7RcrPAhsqN03Bi34WHv+DtvN3aDv97Letssa9DxjvIaTD+XTBr8LcVWX04Rnts5TU4fawDknK9VxuoS76CjNbFoZHqRLHozKcd+YqJUkH0L1h/NZSqyISYjqM31p63076pSHOUzazHU0DzLLQeyjnBpiNdrLqR3UF2GzczNYWjIC9Q/QR8LuqMNFZXMdwKt3aHkwFUmTnD0WlFzgrpgKHAAAAAElFTkSuQmCC"}}]);