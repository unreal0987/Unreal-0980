import { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Languages,
  Palette,
  Calculator,
  Compass,
  Percent,
  Activity,
  Calendar,
  Layers,
  History,
  Sparkles,
} from 'lucide-react';

// Subcomponents
import { StandardTab } from './components/StandardTab';
import { ScientificTab } from './components/ScientificTab';
import { EmiTab } from './components/EmiTab';
import { BmiTab } from './components/BmiTab';
import { AgeTab } from './components/AgeTab';
import { UnitTab } from './components/UnitTab';
import { HistorySidebar, HistoryItem } from './components/HistorySidebar';
import { FunFactWidget } from './components/FunFactWidget';

// Utilities
import { playSound } from './utils/audio';
import { translations, Language } from './utils/translations';

// Theme configuration type
type Theme = 'deepspace' | 'cyberpunk' | 'retro' | 'sunset' | 'forest';

export default function App() {
  // --- States ---
  const [activeTab, setActiveTab] = useState<'standard' | 'scientific' | 'emi' | 'bmi' | 'age' | 'unit'>('standard');
  const [lang, setLang] = useState<Language>('hi'); // Default to Hinglish as requested!
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [theme, setTheme] = useState<Theme>('deepspace');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeHistoryItem, setActiveHistoryItem] = useState<HistoryItem | null>(null);
  const [showMobileHistory, setShowMobileHistory] = useState<boolean>(false);

  const t = translations[lang];

  // --- Load Initial Config from localStorage ---
  useEffect(() => {
    // History
    const storedHistory = localStorage.getItem('calc_history');
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }

    // Sound
    const storedSound = localStorage.getItem('calc_sound');
    if (storedSound !== null) {
      setSoundEnabled(storedSound === 'true');
    }

    // Language
    const storedLang = localStorage.getItem('calc_lang');
    if (storedLang === 'en' || storedLang === 'hi') {
      setLang(storedLang);
    }

    // Theme
    const storedTheme = localStorage.getItem('calc_theme') as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  // --- Sync functions with LocalStorage ---
  const handleAddHistory = (expression: string, result: string, type: 'standard' | 'scientific') => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      expression,
      result,
      timestamp: new Date().toISOString(),
      type,
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, 50); // Keep last 50 items
      localStorage.setItem('calc_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calc_history');
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setActiveHistoryItem(item);
    // If on mobile, close history drawer/view and jump to calculator tab
    setShowMobileHistory(false);
    if (item.type === 'standard') {
      setActiveTab('standard');
    } else if (item.type === 'scientific') {
      setActiveTab('scientific');
    }
  };

  const handleToggleSound = () => {
    const newVal = !soundEnabled;
    setSoundEnabled(newVal);
    localStorage.setItem('calc_sound', String(newVal));
    if (newVal) playSound('click');
  };

  const handleToggleLang = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en';
    setLang(nextLang);
    localStorage.setItem('calc_lang', nextLang);
    if (soundEnabled) playSound('click');
  };

  const handleChangeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('calc_theme', newTheme);
    if (soundEnabled) playSound('success');
  };

  // --- Theme Style Mappings ---
  const themeClasses = {
    deepspace: {
      bg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 text-slate-100',
      card: 'bg-slate-950/45 border-slate-800/80',
      activeTab: 'bg-indigo-600/95 border-indigo-500 text-white shadow-lg shadow-indigo-600/20',
      inactiveTab: 'bg-slate-900/60 border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40',
      accent: 'text-indigo-400',
      glow: 'shadow-[0_0_50px_-12px_rgba(99,102,241,0.15)]',
    },
    cyberpunk: {
      bg: 'bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 text-yellow-400 font-mono',
      card: 'bg-black/80 border-2 border-yellow-500/30',
      activeTab: 'bg-yellow-500 border-yellow-400 text-black font-extrabold shadow-lg shadow-yellow-500/20',
      inactiveTab: 'bg-zinc-900/80 border-zinc-800 text-yellow-600 hover:text-yellow-400 hover:bg-zinc-800/50',
      accent: 'text-pink-500',
      glow: 'shadow-[0_0_40px_-10px_rgba(234,179,8,0.15)]',
    },
    retro: {
      bg: 'bg-black text-green-500 font-mono',
      card: 'bg-black border-2 border-green-500/50',
      activeTab: 'bg-green-500 border-green-400 text-black font-bold shadow-md shadow-green-500/30',
      inactiveTab: 'bg-black border border-green-500/20 text-green-700 hover:text-green-500 hover:bg-green-950/30',
      accent: 'text-green-400',
      glow: 'shadow-[0_0_30px_rgba(34,197,94,0.1)]',
    },
    sunset: {
      bg: 'bg-gradient-to-br from-purple-950 via-neutral-900 to-rose-950/30 text-rose-100',
      card: 'bg-purple-950/40 border-purple-800/40',
      activeTab: 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/25',
      inactiveTab: 'bg-purple-950/20 border-purple-900/30 text-rose-400/80 hover:text-rose-200 hover:bg-purple-950/40',
      accent: 'text-rose-400',
      glow: 'shadow-[0_0_50px_-12px_rgba(244,63,94,0.15)]',
    },
    forest: {
      bg: 'bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950/30 text-emerald-100',
      card: 'bg-emerald-950/30 border-emerald-800/30',
      activeTab: 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/25',
      inactiveTab: 'bg-emerald-950/10 border-emerald-900/30 text-emerald-400/80 hover:text-emerald-200 hover:bg-emerald-950/20',
      accent: 'text-emerald-400',
      glow: 'shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)]',
    },
  }[theme];

  // --- Menu tabs configuration ---
  const menuTabs = [
    { id: 'standard', label: t.tabStandard, icon: Calculator },
    { id: 'scientific', label: t.tabScientific, icon: Compass },
    { id: 'emi', label: t.tabEMI, icon: Percent },
    { id: 'bmi', label: t.tabBMI, icon: Activity },
    { id: 'age', label: t.tabAge, icon: Calendar },
    { id: 'unit', label: t.tabUnit, icon: Layers },
  ] as const;

  const handleTabChange = (tabId: typeof activeTab) => {
    if (soundEnabled) playSound('click');
    setActiveTab(tabId);
    setActiveHistoryItem(null); // Reset selected history item
  };

  return (
    <div className={`min-h-screen transition-all duration-700 p-4 md:p-6 lg:p-8 flex flex-col justify-between ${themeClasses.bg}`}>
      
      {/* --- HEADER --- */}
      <header className="max-w-7xl mx-auto w-full mb-6 md:mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/40 pb-4 md:pb-5">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl shadow-md text-white">
            <Calculator className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              {t.title}
              <span className="text-[10px] font-bold uppercase bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded-full">
                V3.0
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Theme Picker */}
          <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-1 gap-1">
            <Palette className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
            {(['deepspace', 'cyberpunk', 'retro', 'sunset', 'forest'] as Theme[]).map((thm) => (
              <button
                key={thm}
                onClick={() => handleChangeTheme(thm)}
                className={`w-5 h-5 rounded-full transition-all border ${
                  theme === thm ? 'ring-2 ring-indigo-400 scale-110 border-white' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                style={{
                  backgroundColor:
                    thm === 'deepspace'
                      ? '#6366f1'
                      : thm === 'cyberpunk'
                      ? '#eab308'
                      : thm === 'retro'
                      ? '#22c55e'
                      : thm === 'sunset'
                      ? '#ec4899'
                      : '#10b981',
                }}
                title={`Theme: ${thm}`}
              />
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition-all active:scale-95"
            title={`${t.soundToggle}: ${soundEnabled ? t.soundOn : t.soundOff}`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span className="hidden sm:inline text-emerald-400 font-bold">{t.soundOn}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-red-400" />
                <span className="hidden sm:inline text-slate-500">{t.soundOff}</span>
              </>
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={handleToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/90 hover:bg-indigo-600 text-white border border-indigo-500/30 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-indigo-600/10"
          >
            <Languages className="w-4 h-4" />
            <span>{lang === 'hi' ? 'English' : 'Hinglish'}</span>
          </button>

          {/* Mobile History Toggle */}
          <button
            onClick={() => {
              if (soundEnabled) playSound('click');
              setShowMobileHistory(!showMobileHistory);
            }}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition-all active:scale-95"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">{t.history}</span>
          </button>
        </div>
      </header>

      {/* --- MAIN DASHBOARD LAYOUT --- */}
      <main className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
        
        {/* LEFT COLUMN: Sidebar Navigation (Col span 3) */}
        <nav className="lg:col-span-3 w-full space-y-2">
          {/* Desktop Sidebar menu */}
          <div className="hidden lg:flex flex-col gap-2 bg-slate-950/45 backdrop-blur-md rounded-2xl border border-slate-800/80 p-3 shadow-xl">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-3 py-1 mb-1 block">
              Menu / औजार चुनें
            </span>
            {menuTabs.map((menu) => {
              const Icon = menu.icon;
              const isActive = activeTab === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => handleTabChange(menu.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-bold text-left transition-all active:scale-[0.98] ${
                    isActive ? themeClasses.activeTab : themeClasses.inactiveTab
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{menu.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Horizontal sliding menu */}
          <div className="lg:hidden flex overflow-x-auto gap-2 py-1 scrollbar-none px-0.5">
            {menuTabs.map((menu) => {
              const Icon = menu.icon;
              const isActive = activeTab === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => handleTabChange(menu.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                    isActive ? themeClasses.activeTab : themeClasses.inactiveTab
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{menu.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mini Info Card under sidebar */}
          <div className="hidden lg:block bg-slate-900/20 backdrop-blur-sm border border-slate-800/40 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Multi-Calc Pro Suite</span>
            </div>
            <p className="leading-relaxed">
              Every calculator uses double-precision math and high fidelity equations. Switch tabs anytime; your data is safe.
            </p>
          </div>
        </nav>

        {/* MIDDLE COLUMN: The Active Calculator (Col span 6) */}
        <section className={`lg:col-span-6 w-full ${themeClasses.glow}`}>
          
          {/* Standard Calculator Tab */}
          {activeTab === 'standard' && (
            <StandardTab
              lang={lang}
              soundEnabled={soundEnabled}
              onAddHistory={handleAddHistory}
              activeHistoryItem={activeHistoryItem}
            />
          )}

          {/* Scientific Calculator Tab */}
          {activeTab === 'scientific' && (
            <ScientificTab
              lang={lang}
              soundEnabled={soundEnabled}
              onAddHistory={handleAddHistory}
              activeHistoryItem={activeHistoryItem}
            />
          )}

          {/* EMI Calculator Tab */}
          {activeTab === 'emi' && (
            <EmiTab lang={lang} soundEnabled={soundEnabled} />
          )}

          {/* BMI Calculator Tab */}
          {activeTab === 'bmi' && (
            <BmiTab lang={lang} soundEnabled={soundEnabled} />
          )}

          {/* Age Calculator Tab */}
          {activeTab === 'age' && (
            <AgeTab lang={lang} soundEnabled={soundEnabled} />
          )}

          {/* Unit Converter Tab */}
          {activeTab === 'unit' && (
            <UnitTab lang={lang} soundEnabled={soundEnabled} />
          )}
        </section>

        {/* RIGHT COLUMN: History & Fun facts (Col span 3) */}
        <aside className="lg:col-span-3 w-full space-y-5 hidden lg:block">
          <HistorySidebar
            history={history}
            onClear={handleClearHistory}
            onSelect={handleSelectHistoryItem}
            lang={lang}
            soundEnabled={soundEnabled}
          />
          <FunFactWidget lang={lang} soundEnabled={soundEnabled} />
        </aside>

      </main>

      {/* --- MOBILE HISTORY DRAWER/VIEW --- */}
      {showMobileHistory && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col justify-end p-4">
          <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-slate-200">History / पिछला हिसाब</span>
              <button
                onClick={() => {
                  if (soundEnabled) playSound('click');
                  setShowMobileHistory(false);
                }}
                className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto mb-4">
              <HistorySidebar
                history={history}
                onClear={handleClearHistory}
                onSelect={handleSelectHistoryItem}
                lang={lang}
                soundEnabled={soundEnabled}
              />
            </div>
            <FunFactWidget lang={lang} soundEnabled={soundEnabled} />
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="max-w-7xl mx-auto w-full text-center text-[11px] text-slate-500 border-t border-slate-800/40 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>© 2026 Multi-Calc Pro. Made with ❤️ for accurate calculations & great usability.</p>
        <p className="font-semibold text-slate-400">कैलकुलेटर प्रो - आपका अपना हिसाब-किताब साथी</p>
      </footer>
      
    </div>
  );
}
