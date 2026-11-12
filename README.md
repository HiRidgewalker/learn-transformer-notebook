# Transformer Atlas · 经典 Transformer 交互式学习手册

一个完整可运行的中文前端教学项目：通过 **文字拆解 + 数学公式 + 动画 + 实时计算**，重走 2017 年经典 Encoder–Decoder Transformer 从输入到生成的完整流程。

参考学习项目：[HiRidgewalker/learn-transformer-notebook](https://github.com/HiRidgewalker/learn-transformer-notebook)。本项目为重新组织的独立教学网站，使用独立的简化演算示例；不是原仓库的直接复制，固定示例不等同于训练后的模型参数。

## 直接运行（无需安装依赖）

交付包已包含编译后的静态网站。进入项目目录后，使用：

```bash
node scripts/serve.mjs
```

在浏览器打开 **http://127.0.0.1:4173**。如果不使用 Node.js，也可执行：

```bash
python3 -m http.server 4173 --directory dist
```

> `dist/` 内已包含 HTML、CSS、编译后的 React 应用 JavaScript、公式渲染脚本及运行时脚本。无需外部 CDN、账号或模型 API。请通过本地 HTTP 服务打开，不要依赖双击 HTML 文件。

## 开发 / 修改源码

推荐 Node.js 20+。项目使用 **React + TypeScript + Vite**：

```bash
npm install
npm run dev
```

默认打开 http://localhost:5173 。开发模式会同时启动 TypeScript watch 与 Vite。修改 `src/app.tsx` 或 `src/data.ts` 后，TypeScript 自动重新编译到 `public/app.js`，Vite 会重新加载页面。

生产构建：

```bash
npm run build
npm run preview
```

也可以使用 `npm run build:vite` 生成 Vite 构建版本。

> 为了让交付的静态版本无需 npm 下载即可运行，React 运行时作为独立 JavaScript 文件随项目打包；源码是 TypeScript/TSX，使用 React 类组件来管理交互状态。依赖版本和声明在 `package.json` / `public/vendor/NOTICE.txt` 中。

## 课程与交互

| 路由 | 知识点 | 互动实验 |
| --- | --- | --- |
| `#/learn/overview` | 完整经典架构 | 可点击数据流图 |
| `#/learn/tokenizer` | Tokenizer / Vocabulary | 修改文本，查看迷你词表匹配与 ID |
| `#/learn/embedding` | Embedding 查表 | 点击 Token ID 显示四维向量 |
| `#/learn/position` | 正弦/余弦位置编码 | 拖动位置、切换向量维度 |
| `#/learn/attention` | Q/K/V、点积、Softmax、V 加权 | Query 选择 + 四阶段演算 + 动态连线 |
| `#/learn/multihead` | 多头注意力 | 两头权重对照与 Concat |
| `#/learn/normalization` | Add & Norm | 均值、方差、γ 缩放 |
| `#/learn/ffn` | FFN | 4→8→ReLU→4 逐步数值变化 |
| `#/learn/mask` | Causal Mask | 切换 Query 与 Mask，观察权重变化 |
| `#/learn/encoder` | Encoder | 单层数据流步进图 |
| `#/learn/decoder` | Decoder / Cross-Attention | 目标侧与源侧逐阶段示意 |
| `#/learn/training` | Teacher Forcing / Loss / Gradient | Logit 滑块，实时 Loss 与梯度 |
| `#/learn/generation` | 自回归生成 | 逐 Token 生成与停止条件 |
| `#/learn/glossary` | 名词与公式速查 | 术语搜索 |

每章还包含清晰的输入输出、分步数值推导、核心结论和常见误区。学习进度、深浅色模式保存在浏览器 `localStorage`。

## 目录

```text
transformer-visual-academy/
├── index.html              # 开发入口
├── src/
│   ├── data.ts             # 14 章课程、公式、步骤与例子
│   └── app.tsx             # React 页面、导航、可视化实验
├── public/
│   ├── styles.css          # 全站响应式设计与动画
│   ├── app.js              # TSX 编译产物
│   └── vendor/             # 离线运行时与 SVG 公式渲染脚本
├── dist/                   # 可直接部署的静态网站
├── scripts/
│   ├── build.mjs           # 将编译后的文件整理到 dist
│   └── serve.mjs           # 零依赖本地预览服务器
├── tests/core.test.cjs     # 核心计算与章节检查
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## 检查方式

```bash
npm run typecheck
npm test
npm run build
```

在交付环境中已通过 TypeScript 编译和 9 项 Node 数值/内容与页面组件检查。静态网站资源路径通过本地 HTTP 请求检查。由于环境浏览器实施了全局 URL 封锁策略，没有完成浏览器交互自动化和视觉快照验证；因此建议首次在本地运行后检查浏览器控制台。不要将数字演示误认为真实训练的权重或翻译精度。

## 核心数学约定

- 数组索引从 0 开始；注意力权重的行是 Query，列是 Key。
- 本教程的 Embedding 宽度示例常为 4，FFN 常为 4→8→4。
- Causal Mask 在 Softmax 前对禁止位置使用 `-∞`。
- 归一化是逐个 Token 沿特征维度统计，示例使用总体方差。
- `Training` 的梯度滑块不真正更新模型权重。
- `Generation` 的示例概率是人为设置的，展示的是贪心解码机制。

## 许可与归属

教学内容与业务源码可自行修改和使用。随包提供的 React、ReactDOM 与 MathJax 脚本分别受其原始许可约束，详见 `public/vendor/NOTICE.txt`。
