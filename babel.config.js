module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  // 按需加载配置
  // "plugins": [
  //   [
  //     "component",
  //     {
  //       "libraryName": "element-ui",
  //       "styleLibraryName": "theme-chalk"
  //     }
  //   ]
  // ]
  plugins: [
    [
      "import",
      {
        libraryName: "ant-design-vue",
        libraryDirectory: "es",
        style: true
      }
    ]
  ]
}
