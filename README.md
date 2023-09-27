# React课基础源码

目前正在更新中，以下功能课程更新到再开发

1. 面包屑
2. 与nestjs课程源码整合（目前用的mock，需要等nestjs的课程更新完用户权限即可脱离mock）
3. 文章管理，系统设置等功能页
4. 错误页面等
5. 面包屑
6. 皮肤功能
7. 样式优化
8. 注销用户登

目前已完成

1. 多种模式和多种颜色的布局
2. tailwind与antd整合
3. 动态暗黑和antd的动态国际化
4. zustand的封装
5. keepalive
6. react router v6.4的封装
7. 动态路由页面和雪碧加载
8. 数据加载
9. 用户登录和token
10. 权限路由和菜单
11. 图标组件
12. 基本的样式

#### 手动记录commitlint
```
types: [
      {value: 'feat',     name: 'feat:     新功能'},
      {value: 'fix',      name: 'fix:      修复'},
      {value: 'docs',     name: 'docs:     文档变更'},
      {value: 'style',    name: 'style:    代码格式(不影响代码运行的变动)'},
      {value: 'refactor', name: 'refactor: 重构(既不是增加feature，也不是修复bug)'},
      {value: 'perf',     name: 'perf:     性能优化'},
      {value: 'test',     name: 'test:     增加测试'},
      {value: 'chore',    name: 'chore:    构建过程或辅助工具的变动'},
      {value: 'revert',   name: 'revert:   回退'},
      {value: 'build',    name: 'build:    打包'}
],
```