---
name: tailwind-styling-rules
description: "用 Tailwind CSS v4 写页面与组件样式、配置 globals.css 与设计 token、定义自定义工具类与变体、处理暗色模式与响应式断点、合并条件类名、审查样式写法与类名组织时触发。"
disable-model-invocation: false
---

# Tailwind CSS v4 样式规则

以下规则为强制约束，逐条执行。

## 配置

1. 全局样式只有 `src/app/globals.css` 一个入口，文件首行写 `@import "tailwindcss";`。

2. 配置一律用 CSS-first 写法；禁止新建 `tailwind.config.js` 与 `@config` 指令。

3. 颜色、字号、圆角、阴影、间距等设计 token 只在 `@theme` 块中声明为 CSS 变量。

   > 示例：
   > ```css
   > @theme {
   >   --color-brand-500: oklch(0.62 0.19 259);
   >   --radius-card: 0.75rem;
   > }
   > ```

4. `src/` 之外需要被扫描的类名来源用 `@source` 显式声明。

5. 第三方 Tailwind 插件用 `@plugin` 引入，并写在 `@source` 之后。

6. 暗色模式只用 `@custom-variant dark (&:is(.dark *));` 声明并靠 `html` 上的 class 切换；禁止依赖系统媒体查询判定。

7. 断点只用内置的 `sm`、`md`、`lg`、`xl`、`2xl`；确需新断点时在 `@theme` 中以 `--breakpoint-*` 声明，禁止在类名里写任意媒体查询。

## 类名写法

8. 布局、间距、排版、响应式与状态变体一律用原子类表达；禁止新建 `.module.css` 与手写全局选择器。

9. 只有依赖运行时计算的值才用内联 `style`；其余样式一律走类名。

10. 自定义工具类用 `@utility` 声明；禁止用 `@layer utilities` 手写规则块。

11. 禁止用 `@apply` 制造语义类；重复出现的类名组合抽成 React 组件复用。

12. 类名拼接与冲突消解只用 `src/lib/utils.ts` 导出的 `cn`，其实现为 `clsx` 搭配 `twMerge`。

13. 条件类名用 `cn` 的对象或数组参数表达；禁止用模板字符串拼接类名片段。

    > 示例：
    > ```tsx
    > <div className={cn("p-4", { "bg-brand-500": active })} />        // 用
    > <div className={`p-4 ${active ? "bg-" + color : ""}`} />         // 禁止
    > ```

14. 颜色、圆角、阴影只引用 `@theme` 中的 token 类；禁止在类名里写 `#` 开头的十六进制色值。

15. 尺寸优先用内置刻度；确需精确值时才用 `w-[137px]` 这类任意值，并且同一数值出现第二次就提到 `@theme`。

16. 同一元素的多套外观用组件内的 `variant` 映射表集中表达；禁止在 JSX 里堆叠多层三元拼类名。

17. 布局方向、间距与响应式按移动优先书写，小屏为基础类、大屏用断点前缀覆盖。

18. 类名顺序交给 `prettier-plugin-tailwindcss` 处理；禁止手工调整顺序。

## 边界

19. 样式系统只保留 Tailwind；禁止引入 StyleX、styled-components、emotion 与其他运行时 CSS-in-JS。

20. 组件库自带的样式覆写只通过其暴露的 `className` 与 slot 属性传入；禁止用后代选择器穿透第三方组件内部 DOM。

21. 基础动效只用 `Tailwind CSS` 的过渡与动画类或 `HeroUI` 自带交互反馈；额外视觉依赖只允许在用户明确要求后按项目选型规则引入。
