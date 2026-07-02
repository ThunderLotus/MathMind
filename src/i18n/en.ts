import type { TranslationKeys } from './zh';

const en: TranslationKeys = {
  header: {
    title: 'Math Worksheet Generator',
  },
  settings: {
    mode: {
      label: 'Mode:',
      integer: 'Integer',
      fraction: 'Fraction',
      mixed: 'Mixed (Int & Frac)',
    },
    count: {
      label: 'Count:',
      hint: '(10~200)',
    },
    columns: {
      label: 'Columns:',
    },
    opCount: {
      label: 'Operators:',
      hint: '(1~3)',
    },
    hasParens: 'Include Parentheses (1 pair)',
    ops: {
      label: 'Operation Types:',
      addition: 'Addition',
      subtraction: 'Subtraction',
      multiplication: 'Multiplication',
      division: 'Division',
    },
    numRange: {
      label: 'Number Range:',
      singleDigit: '1-digit',
      doubleDigit: '2-digit',
    },
    resultRange: {
      label: 'Result Range:',
      within: 'up to (incl.)',
    },
    allowNegative: 'Allow Negative Results',
    fraction: {
      label: 'Fraction Settings:',
      proper: 'Proper',
      improper: 'Improper',
      mixed: 'Mixed',
        denominator: 'Denominator:',
        sameDenom: 'Same Denom.',
        diffDenom: 'Diff. Denom.',
        maxCommonDenom: 'Max Comm. Denom:',
      numerator: 'Numerator:',
      allowZero: 'Allow Zero',
    },
  },
  preview: {
    title: 'Preview',
    empty: 'Click "Generate Preview" below to see problems',
    count: '{count} problems',
  },
  actions: {
    generate: 'Generate Preview',
    generating: 'Generating...',
    showTitle: 'Show Title',
    printOutput: 'Print:',
    questions: 'Questions',
    answers: 'With Answers',
  },
  errors: {
    checkRange: 'Please check the number range!',
    selectOp: 'Please select at least one operation type!',
    generationFailed: 'Generation complete, but {count} problem(s) could not be generated due to conflicting constraints. Try relaxing the limits.',
  },
  print: {
    integer: 'Integer Arithmetic',
    fraction: 'Fraction Arithmetic',
    mixed: 'Mixed Arithmetic',
    questionsLabel: '(Practice)',
    answersLabel: '(Answer Key)',
    name: 'Name:',
    date: 'Date:',
    duration: 'Time:',
    score: 'Score:',
  },
};

export default en;
