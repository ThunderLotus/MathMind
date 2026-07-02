const zh = {
  header: {
    title: '口算题生成器',
  },
  settings: {
    mode: {
      label: '运算模式：',
      integer: '整数运算',
      fraction: '分数运算',
      mixed: '混合运算 (整数&分数)',
    },
    count: {
      label: '题目总数：',
      hint: '(10~200)',
    },
    columns: {
      label: '每行列数：',
    },
    opCount: {
      label: '运算次数：',
      hint: '(1~3次)',
    },
    hasParens: '包含括号(仅1对)',
    ops: {
      label: '运算类型：',
      addition: '加法',
      subtraction: '减法',
      multiplication: '乘法',
      division: '除法',
    },
    numRange: {
      label: '数字范围：',
      singleDigit: '个位整数',
      doubleDigit: '十位整数',
    },
    resultRange: {
      label: '结果范围：',
      within: '以内 (含)',
    },
    allowNegative: '允许负数结果',
    fraction: {
      label: '分数设置：',
      proper: '真分数',
      improper: '假分数',
      mixed: '带分数',
        denominator: '分母设置：',
        sameDenom: '同分母',
        diffDenom: '异分母',
        maxCommonDenom: '通分后最大值：',
      numerator: '分子设置：',
      allowZero: '允许为0',
    },
  },
  preview: {
    title: '题目预览',
    empty: '点击下方"生成预览"查看题目',
    count: '{count} 题',
  },
  actions: {
    generate: '生成预览',
    generating: '生成中...',
    showTitle: '显示标题',
    printOutput: '打印输出:',
    questions: '练习题',
    answers: '带答案练习题',
  },
  errors: {
    checkRange: '请检查数字范围！',
    selectOp: '请至少选择一种运算类型！',
    generationFailed: '生成完成，但由于参数冲突较难满足条件，有 {count} 题未能生成。建设放宽限制条件。',
  },
  print: {
    integer: '整数运算',
    fraction: '分数运算',
    mixed: '混合运算',
    questionsLabel: '(练习题)',
    answersLabel: '(参考答案)',
    name: '姓名：',
    date: '日期：',
    duration: '用时：',
    score: '得分：',
  },
};

export default zh;
export type TranslationKeys = typeof zh;
