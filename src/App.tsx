import React, { useState, useEffect } from 'react';
import { Settings, Printer, Eye, AlertTriangle } from 'lucide-react';
import { 
    AppSettings, 
    generateSingleProblem, 
    ExprNode, 
    Op 
} from './lib/generator';
import { Frac } from './lib/fraction';
import { MathNode } from './components/MathNode';

import { useTranslation } from './i18n/index.tsx';

export default function App() {
    const { t, lang, setLang } = useTranslation();
    const [settings, setSettings] = useState<AppSettings>({
        mode: 'integer',
        count: 54,
        columns: 2,
        opCount: 3,
        hasParens: true,
        ops: ['+', '-'],
        num1Digit: true,
        num2Digit: true,
        resultMax: 100,
        
        allowProper: true,
        allowImproper: true,
        allowMixed: false,
        allowSameDenom: true,
        allowDiffDenom: true,
        
        denom1Digit: true,
        denom2Digit: true,
        allowZeroNum: false,
        allowNegativeResult: false,
        maxCommonDenom: 50,
    });

    const [problems, setProblems] = useState<{ ast: ExprNode, ans: Frac }[]>([]);
    const [problemsFresh, setProblemsFresh] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [printMode, setPrintMode] = useState<'none' | 'questions' | 'answers'>('none');
    const [showPrintTitle, setShowPrintTitle] = useState(false);

    const handleOpChange = (op: Op) => {
        setSettings(s => ({
            ...s, 
            ops: s.ops.includes(op) 
                ? s.ops.filter(o => o !== op) 
                : [...s.ops, op]
        }));
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        setErrorMsg('');
        
        if (!settings.num1Digit && !settings.num2Digit) {
            setErrorMsg(t('errors.checkRange'));
            setIsGenerating(false);
            return;
        }
        if (settings.ops.length === 0) {
            setErrorMsg(t('errors.selectOp'));
            setIsGenerating(false);
            return;
        }

        setTimeout(() => {
            const newProblems: { ast: ExprNode, ans: Frac }[] = [];
            let failed = 0;
            
            for (let i = 0; i < settings.count; i++) {
                const p = generateSingleProblem(settings);
                if (p) newProblems.push(p);
                else failed++;
            }

            if (failed > 0) {
                setErrorMsg(t('errors.generationFailed', { count: failed }));
            }
            
            setProblems(newProblems);
            setProblemsFresh(true);
            setIsGenerating(false);
        }, 10);
    };

    const handlePrint = (mode: 'questions' | 'answers') => {
        setPrintMode(mode);
        setTimeout(() => window.print(), 300);
    };

    // Reset print mode after printing (browser print is synchronous, so this runs after print dialog closes usually)
    useEffect(() => {
        const handleAfterPrint = () => setPrintMode('none');
        window.addEventListener('afterprint', handleAfterPrint);
        return () => window.removeEventListener('afterprint', handleAfterPrint);
    }, []);

    // Reset problems freshness when any parameter changes
    useEffect(() => { setProblemsFresh(false); }, [settings, showPrintTitle]);

    const isIntMode = settings.mode === 'integer';

    if (printMode !== 'none') {
        const title = settings.mode === 'integer' ? t('print.integer') : 
                      settings.mode === 'fraction' ? t('print.fraction') : t('print.mixed');
        const typeLabel = printMode === 'questions' ? t('print.questionsLabel') : t('print.answersLabel');
        
        return (
            <div className="bg-white text-black min-h-screen p-8 text-xl font-serif">
                {showPrintTitle && (
                    <>
                        <div className="text-center mb-8">
                            <h1 className={`text-4xl font-bold font-sans tracking-widest ${lang === 'en' ? 'text-3xl' : ''}`}>
                                {lang === 'zh' ? `口算${title} ${typeLabel}` : `${title} ${typeLabel}`}
                            </h1>
                        </div>
                        
                        <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-6 text-2xl font-sans">
                            <div className="w-1/4">{t('print.name')}<span className="inline-block w-32 border-b border-black"></span></div>
                            <div className="w-1/4">{t('print.date')}<span className="inline-block w-32 border-b border-black"></span></div>
                            <div className="w-1/4 "><span className="ml-[10%]">{t('print.duration')}</span><span className="inline-block w-28 border-b border-black"></span></div>
                            <div className="w-1/4 text-right">{t('print.score')}<span className="inline-block w-24 border-b border-black"></span></div>
                        </div>
                    </>
                )}

                <div 
                    className={`grid gap-y-12 gap-x-8 ${showPrintTitle ? 'mt-12' : 'mt-4'}`}
                    style={{ gridTemplateColumns: `repeat(${settings.columns}, minmax(0, 1fr))` }}
                >
                    {problems.map((p, i) => (
                        <div key={i} className="flex items-center text-2xl relative">
                            {/* Dotted border top simulation based on UI, we just rely on grid gap for clean look mostly, but visual shows thin subtle horizontal lines between rows... omitted for standard clean look or we can add custom border */}
                            <div className="w-full flex items-center h-16">
                                <MathNode node={p.ast} /> 
                                <span className="mx-2 text-3xl font-sans translate-y-[2px]">=</span> 
                                {printMode === 'answers' && (
                                    <span className="ml-2 font-bold text-red-700">
                                        <MathNode node={{type: 'num', val: p.ans, valFormat: 'mixed'}} />
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-100 font-sans">
            <div className="w-full max-w-7xl mx-auto bg-white shadow-xl border border-neutral-200 overflow-hidden flex flex-col min-h-screen md:min-h-0 md:my-4 md:mx-auto md:rounded-lg md:max-h-[calc(100vh-2rem)]">
                
                {/* Header */}
                <div className="bg-blue-600 text-white px-4 py-3 flex items-center space-x-2 sticky top-0 z-10 shrink-0">
                    <Settings size={20} />
                    <h1 className="text-lg font-semibold tracking-wider">{t('header.title')}</h1>
                    <button
                        onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                        className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full border border-white/40 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                        title={lang === 'zh' ? 'Switch to English' : '切换到中文'}
                    >
                        {lang === 'zh' ? 'EN' : '中'}
                    </button>
                </div>

                {/* Settings Panel */}
                <div className="p-3 md:p-5 border-b border-neutral-200 bg-neutral-50 shrink-0 overflow-y-auto">
                    <div className="flex flex-col gap-y-2 text-xs sm:text-sm text-neutral-700">
                        
                        {/* Row 1: Mode + Count + Columns + OpCount + HasParens */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="font-medium whitespace-nowrap">{t('settings.mode.label')}</span>
                            {(['integer', 'fraction', 'mixed'] as const).map(mode => (
                                <label key={mode} className="flex items-center space-x-1 cursor-pointer">
                                    <input type="radio" value={mode} checked={settings.mode === mode} 
                                        onChange={() => {
                                            if (mode === 'fraction') {
                                                setSettings({...settings, mode,
                                                    ops: ['+', '-'],
                                                    num1Digit: true, num2Digit: false,
                                                    allowProper: true, allowImproper: false, allowMixed: false,
                                                    allowSameDenom: true, allowDiffDenom: true,
                                                    denom1Digit: true, denom2Digit: false,
                                                    maxCommonDenom: 50,
                                                });
                                            } else {
                                                setSettings({...settings, mode});
                                            }
                                        }}
                                        className="w-4 h-4 text-blue-600" />
                                    <span>{mode === 'integer' ? t('settings.mode.integer') : mode === 'fraction' ? t('settings.mode.fraction') : t('settings.mode.mixed')}</span>
                                </label>
                            ))}
                            <div className="hidden lg:block w-px h-5 bg-neutral-300 mx-1"></div>
                            <div className="flex items-center space-x-1 border rounded-sm bg-white px-2 py-1 shadow-sm">
                                <span className="font-medium whitespace-nowrap">{t('settings.count.label')}</span>
                                <input type="number" min={10} max={200} value={settings.count} 
                                    onChange={e => setSettings({...settings, count: Number(e.target.value)})}
                                    className="w-14 border rounded px-1 outline-none focus:ring-1 focus:ring-blue-500 text-center" />
                                <span className="text-neutral-400 text-xs">{t('settings.count.hint')}</span>
                            </div>
                            <div className="flex items-center space-x-1 border rounded-sm bg-white px-2 py-1 shadow-sm">
                                <span className="font-medium whitespace-nowrap">{t('settings.columns.label')}</span>
                                <input type="number" min={1} max={5} value={settings.columns} 
                                    onChange={e => setSettings({...settings, columns: Number(e.target.value)})}
                                    className="w-12 border rounded px-1 outline-none focus:ring-1 focus:ring-blue-500 text-center" />
                            </div>
                            <div className="flex items-center space-x-1 border rounded-sm bg-white px-2 py-1 shadow-sm">
                                <span className="font-medium whitespace-nowrap">{t('settings.opCount.label')}</span>
                                <input type="number" min={1} max={3} value={settings.opCount} 
                                    onChange={e => setSettings({...settings, opCount: Number(e.target.value)})}
                                    className="w-12 border rounded px-1 outline-none focus:ring-1 focus:ring-blue-500 text-center" />
                                <span className="text-neutral-400 text-xs">{t('settings.opCount.hint')}</span>
                            </div>
                            <label className="flex items-center space-x-1 cursor-pointer bg-white px-2 py-1 border rounded-sm shadow-sm">
                                <input type="checkbox" checked={settings.hasParens} 
                                    onChange={e => setSettings({...settings, hasParens: e.target.checked})}
                                    disabled={settings.opCount < 2}
                                    className="w-4 h-4 text-blue-600 rounded" />
                                <span className={`whitespace-nowrap ${settings.opCount < 2 ? 'text-neutral-400' : ''}`}>{t('settings.hasParens')}</span>
                            </label>
                        </div>

                        {/* Row 2: Ops + Num Range + Result Range + Allow Negative */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="font-medium whitespace-nowrap">{t('settings.ops.label')}</span>
                            {(['+', '-', '×', '÷'] as Op[]).map(op => (
                                <label key={op} className="flex items-center space-x-1 cursor-pointer">
                                    <input type="checkbox" checked={settings.ops.includes(op)}
                                        onChange={() => handleOpChange(op)}
                                        className="w-4 h-4 text-blue-600 rounded" />
                                    <span>{op === '+' ? t('settings.ops.addition') : op === '-' ? t('settings.ops.subtraction') : op === '×' ? t('settings.ops.multiplication') : t('settings.ops.division')}</span>
                                </label>
                            ))}
                            <div className="hidden lg:block w-px h-5 bg-neutral-300 mx-1"></div>
                            <span className="font-medium whitespace-nowrap">{t('settings.numRange.label')}</span>
                            <label className="flex items-center space-x-1 cursor-pointer">
                                <input type="checkbox" checked={settings.num1Digit}
                                    onChange={e => setSettings({...settings, num1Digit: e.target.checked})}
                                    className="w-4 h-4 text-blue-600 rounded" />
                                <span>{t('settings.numRange.singleDigit')}</span>
                            </label>
                            <label className="flex items-center space-x-1 cursor-pointer">
                                <input type="checkbox" checked={settings.num2Digit}
                                    onChange={e => setSettings({...settings, num2Digit: e.target.checked})}
                                    className="w-4 h-4 text-blue-600 rounded" />
                                <span>{t('settings.numRange.doubleDigit')}</span>
                            </label>
                            <div className={`flex items-center space-x-1 ${settings.mode === 'fraction' ? 'opacity-50 pointer-events-none' : ''}`}>
                                <span className="font-medium whitespace-nowrap">{t('settings.resultRange.label')}</span>
                                <input type="number" min="1" list="result-max-options"
                                    value={settings.resultMax || ''}
                                    onChange={e => setSettings({...settings, resultMax: Number(e.target.value)})}
                                    className="w-16 border rounded px-1 outline-none focus:ring-1 focus:ring-blue-500 text-center" />
                                <datalist id="result-max-options">
                                    <option value="50" />
                                    <option value="100" />
                                </datalist>
                                <span className="whitespace-nowrap">{t('settings.resultRange.within')}</span>
                            </div>
                            <label className="flex items-center space-x-1 cursor-pointer">
                                <input type="checkbox" checked={settings.allowNegativeResult}
                                    onChange={e => setSettings({...settings, allowNegativeResult: e.target.checked})}
                                    className="w-4 h-4 text-blue-600 rounded" />
                                <span>{t('settings.allowNegative')}</span>
                            </label>
                        </div>

                        {/* Row 3: Fraction specific */}
                        <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 border-t border-dashed border-neutral-300 ${isIntMode ? 'opacity-50 pointer-events-none' : ''}`}>
                            <span className="font-medium whitespace-nowrap">{t('settings.fraction.label')}</span>
                            <label className="flex items-center space-x-1 cursor-pointer">
                                <input type="checkbox" checked={settings.allowProper} 
                                    onChange={e => setSettings({...settings, allowProper: e.target.checked})}
                                    className="w-4 h-4 text-blue-600 rounded" />
                                <span>{t('settings.fraction.proper')}</span>
                            </label>
                            <label className="flex items-center space-x-1 cursor-pointer">
                                <input type="checkbox" checked={settings.allowImproper} 
                                    onChange={e => setSettings({...settings, allowImproper: e.target.checked})}
                                    className="w-4 h-4 text-blue-600 rounded" />
                                <span>{t('settings.fraction.improper')}</span>
                            </label>
                            <label className="flex items-center space-x-1 cursor-pointer">
                                <input type="checkbox" checked={settings.allowMixed} 
                                    onChange={e => setSettings({...settings, allowMixed: e.target.checked})}
                                    className="w-4 h-4 text-blue-600 rounded" />
                                <span>{t('settings.fraction.mixed')}</span>
                            </label>
                            <div className="hidden lg:block w-px h-5 bg-neutral-300 mx-1"></div>
                            <span className="font-medium whitespace-nowrap">{t('settings.fraction.denominator')}</span>
                            <label className="flex items-center space-x-1 cursor-pointer">
                                <input type="checkbox" checked={settings.allowSameDenom} 
                                    onChange={e => setSettings({...settings, allowSameDenom: e.target.checked})}
                                    className="w-4 h-4 text-blue-600 rounded" />
                                <span>{t('settings.fraction.sameDenom')}</span>
                            </label>
                            <label className="flex items-center space-x-1 cursor-pointer">
                                <input type="checkbox" checked={settings.allowDiffDenom} 
                                    onChange={e => setSettings({...settings, allowDiffDenom: e.target.checked})}
                                    className="w-4 h-4 text-blue-600 rounded" />
                                <span>{t('settings.fraction.diffDenom')}</span>
                            </label>
                            <div className={`flex items-center space-x-1 ${!settings.allowDiffDenom ? 'opacity-50 pointer-events-none' : ''}`}>
                                <span className="text-xs whitespace-nowrap">{t('settings.fraction.maxCommonDenom')}</span>
                                <input type="number" min={10} max={500} value={settings.maxCommonDenom}
                                    onChange={e => setSettings({...settings, maxCommonDenom: Number(e.target.value)})}
                                    disabled={!settings.allowDiffDenom}
                                    className="w-14 border rounded px-1 outline-none focus:ring-1 focus:ring-blue-500 text-center text-xs bg-white" />
                            </div>
                            <div className="hidden lg:block w-px h-5 bg-neutral-300 mx-1"></div>
                            <label className="flex items-center space-x-1 cursor-pointer">
                                <input type="checkbox" checked={settings.denom1Digit}
                                    onChange={e => setSettings({...settings, denom1Digit: e.target.checked})}
                                    className="w-4 h-4 text-blue-600 rounded" />
                                <span>{t('settings.numRange.singleDigit')}</span>
                            </label>
                            <label className="flex items-center space-x-1 cursor-pointer">
                                <input type="checkbox" checked={settings.denom2Digit}
                                    onChange={e => setSettings({...settings, denom2Digit: e.target.checked})}
                                    className="w-4 h-4 text-blue-600 rounded" />
                                <span>{t('settings.numRange.doubleDigit')}</span>
                            </label>
                            <div className="hidden lg:block w-px h-5 bg-neutral-300 mx-1"></div>
                            <span className="font-medium whitespace-nowrap">{t('settings.fraction.numerator')}</span>
                            <label className="flex items-center space-x-1 cursor-pointer">
                                <input type="checkbox" checked={settings.allowZeroNum}
                                    onChange={e => setSettings({...settings, allowZeroNum: e.target.checked})}
                                    className="w-4 h-4 text-blue-600 rounded" />
                                <span>{t('settings.fraction.allowZero')}</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                    <div className="bg-yellow-50 border-y border-yellow-200 px-4 py-2 flex items-start space-x-2 text-yellow-800 text-sm">
                        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                        <span className="leading-snug">{errorMsg}</span>
                    </div>
                )}

                {/* Preview Panel */}
                <div className="flex-1 bg-white p-4 overflow-y-auto font-serif min-h-0">
                    <div className="text-sm font-semibold text-neutral-500 mb-4 font-sans px-2 border-b border-neutral-100 pb-2 flex items-center space-x-2">
                        <Eye size={16} /> <span>{t('preview.title')}</span> 
                        {problems.length > 0 && <span className="font-normal">({t('preview.count', { count: problems.length })})</span>}
                    </div>
                    {problems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-neutral-400 font-sans">
                            <span className="text-lg">{t('preview.empty')}</span>
                        </div>
                    ) : (
                        <div 
                            className="grid gap-y-6 gap-x-2 text-lg lg:text-xl pl-2"
                            style={{ gridTemplateColumns: `repeat(${settings.columns}, minmax(0, 1fr))` }}
                        >
                            {problems.map((p, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="flex items-center h-12 w-full justify-start">
                                        <MathNode node={p.ast} /> <span className="mx-1.5 translate-y-[1px] font-sans">=</span>
                                        {/* Optional inline answer preview rendering for debugging/display, usually omitted from regular preview to just show questions. If we want it: <span className="ml-1 text-red-500 text-sm"><MathNode node={{type:'num', val:p.ans}}/></span> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Bar */}
                <div className="p-3 md:p-4 bg-neutral-100 border-t border-neutral-300 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 shadow-sm px-6 py-2.5 rounded-md font-medium transition flex items-center justify-center space-x-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                    >
                        <Eye size={18} className="text-blue-600" />
                        <span>{isGenerating ? t('actions.generating') : t('actions.generate')}</span>
                    </button>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <label className="flex items-center space-x-1 cursor-pointer sm:mr-2 border-r-0 sm:border-r sm:border-neutral-300 sm:pr-4">
                            <input type="checkbox" checked={showPrintTitle}
                                onChange={e => { setShowPrintTitle(e.target.checked); setSettings(s => ({...s, count: e.target.checked ? 50 : 54})); }}
                                className="w-4 h-4 text-blue-600 rounded" />
                            <span className="text-sm font-medium text-neutral-600">{t('actions.showTitle')}</span>
                        </label>
                        <span className="text-sm text-neutral-500 hidden sm:inline">{t('actions.printOutput')}</span>
                        <button 
                            onClick={() => handlePrint('questions')}
                            disabled={problems.length === 0 || !problemsFresh || isGenerating}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-md font-medium transition flex items-center justify-center space-x-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                        >
                            <Printer size={18} />
                            <span>{t('actions.questions')}</span>
                        </button>
                        <button 
                            onClick={() => handlePrint('answers')}
                            disabled={problems.length === 0 || !problemsFresh || isGenerating}
                            className="bg-green-600 hover:bg-green-700 text-white shadow-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-md font-medium transition flex items-center justify-center space-x-2 focus:ring-2 focus:ring-green-500 outline-none disabled:opacity-50"
                        >
                            <Printer size={18} />
                            <span>{t('actions.answers')}</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
