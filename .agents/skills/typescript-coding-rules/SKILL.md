---
name: typescript-coding-rules
description: "编写或修改 TypeScript 代码、声明类型与接口与泛型、配置 tsconfig 严格选项、处理 any 与断言与非空判定、组织模块导入与路径别名、消除类型报错、审查类型设计时触发。"
disable-model-invocation: false
---

# TypeScript 编码规则

以下规则为强制约束，逐条执行。

## 编译配置

1. `tsconfig.json` 必须开启 `strict`，并额外开启 `noUncheckedIndexedAccess` 与 `verbatimModuleSyntax`；禁止为消除报错关闭任一项。

2. 类型报错一律通过修正类型或逻辑解决；禁止用 `@ts-ignore`，确需抑制时用 `@ts-expect-error` 并在上一行注释写明原因。

3. 模块导入只用 `@/` 路径别名；禁止 `../../` 这类跨目录相对导入。

4. 只导入类型时用 `import type`，混合导入时给类型成员加 `type` 前缀。

## 类型声明

5. 对象与函数类型一律用 `type` 别名；只有需要扩展第三方模块声明时才用 `interface`。

6. 导出函数必须显式标注返回类型；局部变量与回调参数交给推导，禁止冗余标注。

7. 有限取值的字段用字符串字面量联合类型；禁止 `enum`。

   > 示例：
   > ```ts
   > type Mode = "fast" | "accurate";   // 用
   > enum Mode { Fast, Accurate }       // 禁止
   > ```

8. 常量映射表用 `as const` 声明，并用 `keyof typeof` 派生其键类型。

9. 能由 Zod 的 `z.infer` 或 Drizzle 的 `$inferSelect` 推导的类型禁止手工重复声明。

10. 由已有类型派生的形状用 `Pick`、`Omit`、`Partial` 表达；禁止复制字段另起一个类型。

11. 联合类型的分支用同名判别字段区分，收窄一律靠该字段。

    > 示例：
    > ```ts
    > type Result = { kind: "ok"; data: User } | { kind: "error"; message: string };
    > ```

12. 缺失语义统一用可选属性表达；只有映射数据库可空列与第三方契约时才允许 `null`。

13. 函数参数超过三个，或存在两个以上同类型参数时改为单个对象参数。

14. 泛型参数用 `T` 加语义词命名，并在能约束时用 `extends` 约束上界。

## 类型安全

15. 禁止 `any`；外部来源的未知数据先标为 `unknown`，经校验或收窄后再使用。

16. 禁止用 `as` 断言绕过类型错误；`as` 只允许用于 `as const` 与已由判别逻辑证明的收窄。

17. 禁止非空断言 `!`；改为显式判空后提前返回或给默认值。

    > 示例：
    > ```ts
    > const first = items[0]!;                          // 禁止
    > const first = items[0]; if (!first) return null;   // 用
    > ```

18. 索引访问与 `find`、`pop` 这类可能为空的结果必须先判空再使用。

19. 请求体、`searchParams`、环境变量与第三方响应必须经 Zod 校验后再当作类型化数据；禁止直接断言成业务类型。

20. 错误对象在 `catch` 中类型为 `unknown`，必须用 `instanceof` 收窄后再读属性。

21. 禁止用类型断言伪造缺失字段来通过编译；缺字段时改类型定义或补齐数据。
