# 口算题生成器 / Math Problem Generator

[English](#english) | [中文](#中文)

---

## 中文

一款面向小学生和教育工作者的口算练习题生成工具。支持**整数**、**分数**和**混合运算**，可自定义难度参数，生成排版精美的练习题或带参考答案的试卷，支持直接打印输出。

### 功能特性

- **三种运算模式**：整数运算 / 分数运算 / 混合运算（整数 & 分数）
- **灵活配置**：题目数量、每行列数、运算次数、运算符类型
- **数字范围控制**：个位 / 十位整数、结果范围限制
- **分数专项设置**：真分数 / 假分数 / 带分数、同分母 / 异分母
- **智能生成引擎**：基于 AST 抽象语法树 + 蒙特卡洛重试算法，确保所有题目满足约束条件
- **打印排版**：练习题与带答案两种打印模式，姓名/日期/用时/得分栏位

### 快速开始

**前置条件：** Node.js

```bash
# 安装依赖
npm install

# 配置 Gemini API 密钥
# 编辑 .env.local，设置你的 GEMINI_API_KEY

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 即可使用。

### 构建部署

```bash
npm run build
npm run preview
```

---

## English

A mental math worksheet generator for elementary school students and educators. Supports **integer**, **fraction**, and **mixed** arithmetic, with customizable difficulty parameters. Generates beautifully formatted practice worksheets or answer-key included sheets, ready for printing.

### Features

- **Three operation modes**: Integer / Fraction / Mixed (integers & fractions)
- **Flexible configuration**: Question count, columns per row, operation count, operator types
- **Number range control**: Single/double-digit integers, result range limits
- **Fraction-specific settings**: Proper / improper / mixed fractions, same / different denominators
- **Smart generation engine**: AST-based + Monte Carlo retry algorithm ensures all problems meet constraints
- **Print layout**: Two print modes (questions only / with answers) with name/date/time/score fields

### Quick Start

**Prerequisites:** Node.js

```bash
# Install dependencies
npm install

# Set Gemini API key
# Edit .env.local and set your GEMINI_API_KEY

# Start dev server
npm run dev
```

Visit http://localhost:3000 to use.

### Build & Deploy

```bash
npm run build
npm run preview
```

### Cloudflare Pages 部署 / Deploy to Cloudflare Pages

| 配置项 | 值 |
|---|---|
| Framework preset | **None**（留空） |
| Build command | `npm run build` |
| Build output directory | `dist` |

**环境变量：** 无需配置。

### Vercel 部署 / Deploy to Vercel

| 配置项 | 值 |
|---|---|
| Framework preset | **Vite** |
| Build command | `npm run build`（自动填入） |
| Build output directory | `dist`（自动填入） |

**环境变量：** 无需配置。
