# Transformer Atlas · 经典 Transformer 交互式学习手册

一个完整可运行的中文前端教学项目：通过 **文字拆解 + 数学公式 + 动画 + 实时计算**，重走 2017 年经典 Encoder–Decoder Transformer 从输入到生成的完整流程。

参考学习项目：[HiRidgewalker/learn-transformer-notebook](https://github.com/HiRidgewalker/learn-transformer-notebook)。本项目为重新组织的独立教学网站，使用独立的简化演算示例；不是原仓库的直接复制，固定示例不等同于训练后的模型参数。

## 直接运行

先完成一次生产构建，再打开静态站点：

```bash
npm install
npm run build
node scripts/serve.mjs
```

在浏览器打开 **http://127.0.0.1:4173**。如果不使用 Node.js 提供预览，也可在已有 `dist/` 时执行：

```bash
python3 -m http.server 4173 --directory dist
```

> `dist/` 包含 HTML、CSS、打包后的 JavaScript、本地字体和 MathJax。页面不请求外部 CDN、账号或模型 API。请通过本地 HTTP 服务打开，不要依赖双击 HTML 文件。

## 开发 / 修改源码

推荐 Node.js 20+。项目使用 **React + TypeScript + Vite + Tailwind CSS**：

```bash
npm install
npm run dev
```

默认打开 http://localhost:5173 。界面组件来自 shadcn 使用的 Radix 基础组件，图表使用 ECharts，架构和注意力连线使用 React Flow，章节正文是 MDX，公式由本地 MathJax 渲染。

生产构建：

```bash
npm run build
npm run preview
```

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
├── index.html
├── src/
│   ├── app.tsx                 # 导航、主题与路由
│   ├── core.ts                 # 教学数值
│   ├── app/globals.css         # Tailwind 与字体
│   ├── components/             # shadcn 组件、图表与流程图
│   ├── content/lessons/        # 14 章 MDX
│   └── labs/                   # 各章交互实验
├── public/
│   ├── fonts/                  # Google Sans 与 Noto Sans SC
│   └── vendor/mathjax/         # 本地 MathJax
├── dist/                       # 生产构建结果
├── scripts/serve.mjs           # 静态预览服务器
├── tests/core.test.ts
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

数值测试覆盖 softmax、注意力、位置编码、FFN 和 14 章 MDX。不要将数字演示误认为真实训练的权重或翻译精度。

## 核心数学约定

- 数组索引从 0 开始；注意力权重的行是 Query，列是 Key。
- 本教程的 Embedding 宽度示例常为 4，FFN 常为 4→8→4。
- Causal Mask 在 Softmax 前对禁止位置使用 `-∞`。
- 归一化是逐个 Token 沿特征维度统计，示例使用总体方差。
- `Training` 的梯度滑块不真正更新模型权重。
- `Generation` 的示例概率是人为设置的，展示的是贪心解码机制。

## 许可与归属

教学内容与业务源码可自行修改和使用。MathJax 脚本受其原始许可约束，详见 `public/vendor/NOTICE.txt`。React 随构建打包，遵循其原始许可。
