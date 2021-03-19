export function inputChangeListen(that: any, obj: any, funName: string) {
  let isInputZh = false
  that.$nextTick(() => {
    const typeEle = obj.$el.children[0].children[0]
    typeEle.addEventListener('compositionstart', function () {
      isInputZh = true
    }, false)

    typeEle.addEventListener('compositionend', function () {
      isInputZh = false
      that[funName](typeEle.value)
    }, false)

    typeEle.addEventListener('input', function (e: any) {
      if (isInputZh) return
      const value = e.value
      that[funName](value)
    }, false)
  })
}
/**
 * @description: 比较两个数组 取不同的项
 * @param {*}
 * @return {*}
 * @author: zhangning
 */
export function compareArr(oldArr: any, newArr: any, isObject: any = false, needStr: string = '') {
  const deleteArr: any = []
  if (!isObject) {
    for (let index = 0; index < oldArr.length; index++) {
      const oldElement = oldArr[index]
      if (newArr.indexOf(oldElement) === -1) deleteArr.push(oldElement)
    }
    return deleteArr
  } else {
    oldArr.filter((item: any) => {
      const ans = newArr.some((newItem: any) => newItem[needStr] === item[needStr])
      if (!ans) {
        deleteArr.push(item)
      }
    })
    // }
    return deleteArr
  }
}
