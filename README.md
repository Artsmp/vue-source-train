# 项目搭建

为某个包安装 workspace 中的包：`pnpm i @vue/shared@workspace --filter @vue/reactivity`

配置开发打包：`"dev": "node scripts/dev.js reactivity -f esm"`

- reactivity：打包目标
- `-f esm`：打包输出格式
