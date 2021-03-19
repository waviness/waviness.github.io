export const getLayoutColor = (menuName: string) => {
  if (menuName === 'crm') {
    document.getElementsByTagName('body')[0].style.setProperty('--activeBgColor', 'rgb(35, 98, 251)')
    document.getElementsByTagName('body')[0].style.setProperty('--activeHoverBgColor', 'rgba(26, 45, 63, 0.8)')
    document.getElementsByTagName('body')[0].style.setProperty('--borderLeft', 'none')
    document.getElementsByTagName('body')[0].style.setProperty('--iconfontColor', '')
  } else if (menuName === 'admin') {
    document.getElementsByTagName('body')[0].style.setProperty('--activeBgColor', 'rgb(233,239,255)')
    document.getElementsByTagName('body')[0].style.setProperty('--activeHoverBgColor', 'rgb(233,239,255)')
    document.getElementsByTagName('body')[0].style.setProperty('--borderLeft', '3px solid rgba(252, 146, 63, 1)')
    document.getElementsByTagName('body')[0].style.setProperty('--iconfontColor', 'rgba(252, 146, 63, 1)')
  }
}
