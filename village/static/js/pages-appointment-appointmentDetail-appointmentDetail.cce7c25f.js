(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-appointment-appointmentDetail-appointmentDetail"],{"09d9":function(t,e,i){"use strict";i.r(e);var a=i("a7f5"),n=i("e6df");for(var l in n)"default"!==l&&function(t){i.d(e,t,(function(){return n[t]}))}(l);i("30f2");var o,s=i("f0c5"),p=Object(s["a"])(n["default"],a["b"],a["c"],!1,null,"ce71f93a",null,!1,a["a"],o);e["default"]=p.exports},"30f2":function(t,e,i){"use strict";var a=i("7681"),n=i.n(a);n.a},"3ae2":function(t,e,i){var a=i("24fb");e=a(!1),e.push([t.i,".container[data-v-ce71f93a]{width:100%;min-height:calc(100vh - %?90?%);padding-top:%?30?%;padding-bottom:%?60?%;background:#f2f2f6}.appointment-box[data-v-ce71f93a]{width:%?654?%;height:auto;padding:0 %?24?% %?30?%;background-color:#fff;-webkit-border-radius:%?16?%;border-radius:%?16?%;margin:0 auto;position:relative;overflow:hidden}.appointment-box .appointment-title[data-v-ce71f93a]{width:auto;height:%?140?%;border-bottom:1px hsla(0,0%,62.4%,.5) solid;margin-bottom:%?32?%}.appointment-box .appointment-title .appointment-title-t[data-v-ce71f93a]{line-height:%?140?%;font-size:%?32?%;font-weight:700;text-align:center}.appointment-box .angle[data-v-ce71f93a]{width:0;height:0;z-index:98;position:absolute;top:0;right:0}.appointment-box .angle-1[data-v-ce71f93a]{border-top:%?116?% solid #5fc2ff;border-left:%?116?% solid transparent}.appointment-box .angle-2[data-v-ce71f93a]{border-top:%?116?% solid #8dd34a;border-left:%?116?% solid transparent}.appointment-box .angle-3[data-v-ce71f93a]{border-top:%?116?% solid #e43838;border-left:%?116?% solid transparent}.appointment-box .angle-text[data-v-ce71f93a]{width:%?80?%;height:%?30?%;line-height:%?30?%;font-size:%?22?%;color:#fff;-webkit-transform:rotate(45deg);transform:rotate(45deg);z-index:99;position:absolute;top:%?26?%;right:0}.appointment-box .appointment-label[data-v-ce71f93a]{width:auto;line-height:%?44?%;padding:%?30?% 0;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.appointment-box .appointment-label .label-name[data-v-ce71f93a]{font-size:%?32?%}.appointment-box .appointment-label .label-value[data-v-ce71f93a]{font-size:%?26?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:end;-webkit-justify-content:flex-end;justify-content:flex-end;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.appointment-box .appointment-label .label-value .mobile[data-v-ce71f93a]{width:%?42?%;height:%?52?%;margin-left:%?30?%}.appointment-box .people-desc[data-v-ce71f93a]{width:%?600?%;line-height:%?40?%;font-size:%?26?%;color:#696969;margin:%?20?% auto 0}.appointment-reply[data-v-ce71f93a]{width:%?654?%;height:auto;padding:%?30?% %?24?%;background-color:#fff;-webkit-border-radius:%?16?%;border-radius:%?16?%;margin:%?24?% auto 0}.appointment-reply .reply-title[data-v-ce71f93a]{line-height:%?50?%;font-size:%?32?%;font-weight:700}.appointment-reply .add-reply-title[data-v-ce71f93a]{height:%?44?%;margin-bottom:%?30?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.appointment-reply .add-reply-title .add-reply-title-t[data-v-ce71f93a]{font-size:%?32?%}.appointment-reply .add-reply-title .add-reply-title-i[data-v-ce71f93a]{width:%?48?%;height:%?48?%}.appointment-reply .reply-content[data-v-ce71f93a]{width:%?600?%;line-height:%?40?%;font-size:%?26?%;color:#696969;margin:%?20?% auto 0}.appointment-reply .reply-content-1[data-v-ce71f93a]{width:auto;height:auto;padding:%?24?%;border:1px #dbdbdb solid;-webkit-border-radius:%?16?%;border-radius:%?16?%;margin-top:%?30?%}.appointment-reply .reply-content-1 .reply-input[data-v-ce71f93a]{width:100%;height:%?144?%;line-height:%?36?%;font-size:%?26?%}.btn-box[data-v-ce71f93a]{width:%?630?%;height:%?160?%;margin:auto;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.btn-box .refuse-btn[data-v-ce71f93a]{width:%?260?%;height:%?80?%;line-height:%?80?%;text-align:center;background-color:#e43838;-webkit-border-radius:%?40?%;border-radius:%?40?%;font-size:%?32?%;color:#fff}.btn-box .accept-btn[data-v-ce71f93a]{width:%?260?%;height:%?80?%;line-height:%?80?%;text-align:center;background-color:#5fc2ff;-webkit-border-radius:%?40?%;border-radius:%?40?%;font-size:%?32?%;color:#fff}",""]),t.exports=e},"402e":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={data:function(){return{appointmentId:"",appointmentDetail:{}}},onLoad:function(t){this.appointmentId=t.id,this.getDetail()},onShow:function(){},methods:{getDetail:function(){var t=this,e={};this.$api.visitorAppointmentDetail(e,this.appointmentId).then((function(e){t.appointmentDetail=e}))},cancel:function(){var t=this;uni.showModal({title:"提示",content:"确认拒绝预约？",success:function(e){if(e.confirm){var i={id:t.appointmentId,reply:t.content};t.$api.visitorGAppointmentReject(i).then((function(e){t.$toast("拒绝预约成功"),setTimeout((function(){uni.navigateBack({delta:1})}),1e3)}))}else e.cancel}})},accept:function(){var t=this;uni.showModal({title:"提示",content:"确认同意预约？",success:function(e){if(e.confirm){var i={id:t.appointmentId,reply:t.content};t.$api.visitorGAppointmentConfirm(i).then((function(e){t.$toast("预约成功"),setTimeout((function(){uni.navigateBack({delta:1})}),1e3)}))}else e.cancel}})},addRemark:function(){var t=this,e={id:this.appointmentId,remark:this.appointmentDetail.remark};this.$api.visitorAppointmentRemark(e).then((function(e){t.$toast("添加备注成功"),t.getDetail()}))},timeFormat:function(t){return this.$moment(t).format("YY-MM-DD hh:mm:ss")},callPhone:function(){uni.makePhoneCall({phoneNumber:this.appointmentDetail.mobile})}}};e.default=a},7681:function(t,e,i){var a=i("3ae2");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var n=i("4f06").default;n("224819ea",a,!0,{sourceMap:!1,shadowMode:!1})},a7f5:function(t,e,i){"use strict";var a;i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return l})),i.d(e,"a",(function(){return a}));var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-uni-view",{staticClass:"container"},[a("v-uni-view",{staticClass:"appointment-box"},[a("v-uni-view",{staticClass:"appointment-title"},[a("v-uni-view",{staticClass:"appointment-title-t"},[t._v(t._s(t.appointmentDetail.title))])],1),1==t.appointmentDetail.status?a("v-uni-view",{staticClass:"angle angle-1"}):t._e(),1==t.appointmentDetail.status?a("v-uni-view",{staticClass:"angle-text"},[t._v("已预约")]):t._e(),0==t.appointmentDetail.status?a("v-uni-view",{staticClass:"angle angle-2"}):t._e(),0==t.appointmentDetail.status?a("v-uni-view",{staticClass:"angle-text"},[t._v("待回复")]):t._e(),3==t.appointmentDetail.status?a("v-uni-view",{staticClass:"angle angle-3"}):t._e(),3==t.appointmentDetail.status?a("v-uni-view",{staticClass:"angle-text"},[t._v("被拒绝")]):t._e(),2==t.appointmentDetail.status?a("v-uni-view",{staticClass:"angle angle-3"}):t._e(),2==t.appointmentDetail.status?a("v-uni-view",{staticClass:"angle-text"},[t._v("已取消")]):t._e(),a("v-uni-view",{staticClass:"appointment-label"},[a("v-uni-view",{staticClass:"label-name"},[t._v("预约人")]),a("v-uni-view",{staticClass:"label-value"},[t._v(t._s(t.appointmentDetail.person))])],1),a("v-uni-view",{staticClass:"appointment-label"},[a("v-uni-view",{staticClass:"label-name"},[t._v("联系电话")]),a("v-uni-view",{staticClass:"label-value"},[t._v(t._s(t.appointmentDetail.mobile)),a("v-uni-image",{staticClass:"mobile",attrs:{src:i("c7f7"),mode:"aspectFit"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.callPhone()}}})],1)],1),a("v-uni-view",{staticClass:"appointment-label"},[a("v-uni-view",{staticClass:"label-name"},[t._v("公司名称")]),a("v-uni-view",{staticClass:"label-value"},[t._v(t._s(t.appointmentDetail.company))])],1),a("v-uni-view",{staticClass:"appointment-label"},[a("v-uni-view",{staticClass:"label-name"},[t._v("公司职位")]),a("v-uni-view",{staticClass:"label-value"},[t._v(t._s(t.appointmentDetail.cmpTitle))])],1),a("v-uni-view",{staticClass:"appointment-label"},[a("v-uni-view",{staticClass:"label-name"},[t._v("预约时间")]),a("v-uni-view",{staticClass:"label-value"},[t._v(t._s(t.timeFormat(t.appointmentDetail.startTime))+" ~\n\t\t\t\t"+t._s(t.timeFormat(t.appointmentDetail.endTime)))])],1),a("v-uni-view",{staticClass:"appointment-label"},[a("v-uni-view",{staticClass:"label-name"},[t._v("随访人数")]),a("v-uni-view",{staticClass:"label-value"},[t._v(t._s(t.appointmentDetail.num))])],1),a("v-uni-view",{staticClass:"appointment-label"},[a("v-uni-view",{staticClass:"label-name"},[t._v("随访人员介绍")]),a("v-uni-view",{staticClass:"label-value"})],1),a("v-uni-view",{staticClass:"people-desc"},[t._v(t._s(t.appointmentDetail.intro))])],1),0==t.appointmentDetail.status?a("v-uni-view",{staticClass:"appointment-reply"},[a("v-uni-view",{staticClass:"reply-title"},[t._v("添加回复：")]),a("v-uni-view",{staticClass:"reply-content-1"},[a("v-uni-textarea",{staticClass:"reply-input",attrs:{"placeholder-class":"place-holder",placeholder:"在此输入回复信息…",maxlength:"200"},model:{value:t.content,callback:function(e){t.content=e},expression:"content"}})],1)],1):t._e(),a("v-uni-view",{staticClass:"appointment-reply"},[a("v-uni-view",{staticClass:"add-reply-title"},[a("v-uni-view",{staticClass:"add-reply-title-t"},[t._v("预约备注：")]),a("v-uni-image",{directives:[{name:"show",rawName:"v-show",value:""==t.appointmentDetail.remark,expression:"appointmentDetail.remark == ''"}],staticClass:"add-reply-title-i",attrs:{src:i("c501"),mode:"aspectFit"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.addRemark()}}})],1),a("v-uni-view",{staticClass:"reply-content-1"},[a("v-uni-textarea",{staticClass:"reply-input",attrs:{"placeholder-class":"place-holder",placeholder:"在此输入预约备注…",maxlength:"200",disabled:""!=t.appointmentDetail.remark},model:{value:t.appointmentDetail.remark,callback:function(e){t.$set(t.appointmentDetail,"remark",e)},expression:"appointmentDetail.remark"}})],1)],1),0==t.appointmentDetail.status?a("v-uni-view",{staticClass:"btn-box"},[a("v-uni-view",{staticClass:"refuse-btn",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.cancel()}}},[t._v("拒绝预约")]),a("v-uni-view",{staticClass:"accept-btn",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.accept()}}},[t._v("同意预约")])],1):t._e()],1)},l=[]},c501:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFdklEQVRoQ9WZW2xUVRSGv3WmFymCEqkmgiAJYnwwgFRE6JlKUBEvUxONF0rpBYIxKKiJl8REKzwYNWK8RkHpnOFi1JjwYBSI0LTTQtXiLcRLNAHR+EZQUZR25ixzpp067Uw7+7QzQ92Pc/691v/vvfbaa68R/udDxjr/xnadEIdlxLlJLGYofCtFPB2+Wo563MekgNWdOrW7h5ClhBQWAyUDFlo5LiVUeCLGjIDGqM52PcJCSJV5km1xhc2OLfecMQFrurS45zS261KNEgIu9hPOIkTDtgQLKqDmQ50YGM8yLEKiLAMm+SGdihVwwkGpz7sAL55jPYkV9kIjPZ5HqECEO8K2vJcXAV48x5VqhBDKFXlIFt0Bi8lbK+VkTgR48Xy6m6DEqHYhJDB9hAtrNk3Y7djiheDI02hNp04sibEscQi9PA3nmnkfPUqFtRFbXvMtoKFVL3KtRFiEEK5BB+Xn0XPLakFB43Gm7VgsvxgJqO/QOd4qW72HcO5odi0rOxOA0OXYcmUSmnYGvHj+52+qxDuEJLLHNBO7hcIIPBEOysY0AfWtegnC46rcinBOoQj59aMlzI4skK8HCFjRojOtAJ/KKC4Wv0T68KdQ1hAAXLYb2DjqBGXGoAsN6tp0C7DawEAuIb+6FtXbKqWrrlVrEAMBwkuOLeszCWgHFuWSXRZbX8TihLxMUtuuFZZLK1CWzb8VYEnzItmfScBWoCGbgZx8F3a5p1ixban8VdOiU4sCfAJcaGD7RGkZF2yukJ40ASujOks0YSivl5HAc+H9PEaTuLV7dLw1jigkUnPWocrOSJXUDAb2p9HaVr3MEsLA/KzW/AKEboF7w7Z4Ow1NatUt4X28jGc6LO50KuXdIQX02lXraAfrXJeNAmeb2s6CO27Bbc1B8eI8Merb9FmFh33Y7479SfmOG+WPYQUkP67q0OmxOK8DN/hwkgYV+B7llnCV/NBPvlUbVXjLj10R9oRtychl2Gq0L729AJT7cehhBfZ3C7fvtOVEcm5Dm1a5wl6/NZQIa8N9xZvRDqSC7m7RyaUBNqmwAjWrXhW2nFXG2tSMseqAzozF6ATO87kYWlzCtDcX9BZvvgUkJ9R16PX0htWAm3CQwbgIj4Rt2ZT6+/KoTipSDgpc6pO8t5WHHFsqhprn60Hjpb7AODaosh5JFACp46QlLG+25YPUH5tatOhIgN3AEt/keyc86QRlQ04EJI14t6e4vCiwsO+3QwqNkeB/RVb/zkX1jUS9M8IREOZsteWrnApIGlt5QKcEirCa58vPmRzUteuDuAwIJz86FH6KBGXYdouvEPLjvCGqN7vKLkgLNWMzAi+Hg7JuuAl5EVDfqper0AFMMGabCVjEtc5C2VdwAXVR/QxlyMxhKOq30jLOH1y8jTiNGjol8fAXjpnih8G97QRleTY7OQ+hlft0ihST8dLJRib1u2VxV3OlvJNtTs4FeA7r2nR0DyShO1ZM+Y4F6cVb3kPIc5B4ZcXpzHDZZVvQ5Pe9TlCWmoDzsgOe4/o2fV7hIRMSaRjhPseWV03m5k3Ami4tO32Kw1lqp0wc1VKmN1dlvhwLEkJJJ4kC0GW3aRXrzRPh87At80xWP4E3BY4UV9+mEYVa0/kqNEVsecoUn3cB3nuiJMA3po8iCTA3vEi+HDMCEmnVtHEFx5yg+PpvIe870H8e2vQjgzf2K05Q7jdd/YKcgSQZr1HQE+fwcN0OFa6L2PLxmBTQdzc8oOA1CdKH8nvpeMqzFW8FTaODnXl9pyNRDmZqniX/NvWz+gUNoSSxvg7ggdQ2psIJS7kqtX9kKqRghziVkNeLteBRhVko38XjPLN9sfxoSjoVd0YEjIToUHP+BSWFuUAa9KqhAAAAAElFTkSuQmCC"},c7f7:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAA0CAYAAAD8H6qwAAAEbklEQVRoQ+2ZbYhUZRTHf+fOrKRLS1LEIpHUElSmRKSl7p3dTQkKyjUxq3XnjhFiL/ihvmgfwiCyT0Fv9qLuzt3NDBW1FwrBGL2zLpVB2JslgiuG9gZppbnrzj1xzaWN5pm5M7t3Zhd6vs55zvnd//M855znGWGcDBknnEQKmsroJRpjJWCLMF2VyQjHBNb1DfLinhYZDCtUpKCOp88Cq/PBCPT2D3DP5vnyYxjYqEF3A/NMIApHYkpTZ5McKwYbKWjS0z6BqUUgDp7JMWtri/xRyC4y0FRGL9IYpwGrmFoIG11bHqoKqNOj0/D5qihkYCD4Mbipw5YDJvvoFPW0VWFHKFBAYX1XQpZXHnSvrlJhbVhQ4ISbkCkVB0162iXQXgIoUsNV6dnSZ0hnpbgKb+t4egi4JvwMEKElbcueioG2fax18QFOnj8mJQyFxV0J2VYx0MW9OnHSIL8Ak0rgDE7UUrdJNlUMNAiUymqzwsso08LCqtLW1SRvVRR0KJjjaVBCHwbuBmoKQgsPuLZsrgroUNBURus1xhMIj6OGaqUscZtkS1VBhykcFIHWfDAq3NVly/tjArRIfp3vJuSjMQHqePoJMCsfTE648U1DvS8pz4U9vUa7NWo5t/EbUPsfG0HPDFJnavcqCurs0wZyHDZ8SHVqfT6YlKf3KeRPP8J7aVuCFJZ3VFTRVFZfUeWRvIdFWJ225bkxAepk9TBKQz4Y32Jmd6N8VnXQ1F6drsIXBpAfXJspiGjVQZNZXSvKKgPIa25CgjJrHBXZo80ZjU+NcxQlbwcvPol0s2SrDrpsny71c3QbQI64Ng2Flj2YF7mii7dobFI9XwLXGUCfdBNS9G4VOaiT1eUorxsg+/0YV3bPlZ+KVb1IQe/P6GUTYnwNXG7I4p2uLQ8Wg4x86VOe7lRYYID0a+LcsGG2HIwMNOnpDCvHoXSLnDUFSfXoCvV51fS7Ctu7bFkUBrIsRZ0eXY9P8E70qwjPTJjIS2/cLOeGB1zm6fW+sB81Xu5yFszoTMg3kYAu69Elvs/bw50rfBcXHuuwJXhipP2A1lqnCHrOQpe6TjcRbm8OxQp9mC60aPuByXmbCnjHt9ghOVYg3FpAqZMDA1wb9gG3JND2XVprTaQXmBF2qYw1W3g0bcu6Uv0UV1RVnCxbgdAbvwDEbtfm9mJVyLBihb/N8fQp4OlSFchjfzxmMbOjUY6X46ugosmsLhTYZryHh4yo8Kfl05RulmCPlzWMoG0ZvSL+d1WpK8vzP5P6sbjXbZR3R+LHCHpeTWX7SJwDZ8ViUbpRPhihH3P3dOGkHwUuLTPIKSvOgs45srfM+f+aVnCPOlldifJCGYFOxIQ7Cv15UKrPgqBBL1lbj6cwpwTHn8djLNw4V4LVGLVRNI+mPtV67WcHWrDaBEADKjz/8++s+fBO6R81wguOioKet1OVZA/zBFrV5xYRrgYuBk4jfCuw69wgGza1yPejDTjkLxxoVNFL8Ps/aAlihTIdN4r+BVVXZES2bGcDAAAAAElFTkSuQmCC"},e6df:function(t,e,i){"use strict";i.r(e);var a=i("402e"),n=i.n(a);for(var l in a)"default"!==l&&function(t){i.d(e,t,(function(){return a[t]}))}(l);e["default"]=n.a}}]);