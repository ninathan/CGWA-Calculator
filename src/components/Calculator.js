"use client";

import React, { useState, useEffect } from "react";

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

export default function Calculator() {
  const [years, setYears] = useState([
    {
      id: generateId(),
      yearNumber: 1,
      terms: [
        { id: generateId(), termNumber: 1, gwa: "", units: "" },
      ],
    },
  ]);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showHonor, setShowHonor] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUnitsInfo, setShowUnitsInfo] = useState(false);

  // Check localStorage on mount for theme and warning
  useEffect(() => {
    const warningDismissed = localStorage.getItem('cgwa-warning-dismissed');
    if (warningDismissed === 'true') {
      setShowWarning(false);
    }
    
    const savedTheme = localStorage.getItem('cgwa-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // Toggle theme and save to localStorage
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('cgwa-theme', newTheme ? 'dark' : 'light');
  };

  // Handle marking as read (save to localStorage)
  const handleMarkAsRead = () => {
    localStorage.setItem('cgwa-warning-dismissed', 'true');
    setShowWarning(false);
  };

  // Handle temporary dismiss (just close, don't save)
  const handleTemporaryDismiss = () => {
    setShowWarning(false);
  };

  const addYear = () => {
    const maxYear = Math.max(...years.map(y => y.yearNumber), 0);
    setYears([...years, {
      id: generateId(),
      yearNumber: maxYear + 1,
      terms: [{ id: generateId(), termNumber: 1, gwa: "", units: "" }],
    }]);
  };

  const removeYear = (yearId) => {
    setYears(years.filter(y => y.id !== yearId));
  };

  const addTerm = (yearId) => {
    setYears(years.map(year => {
      if (year.id === yearId) {
        const maxTerm = Math.max(...year.terms.map(t => t.termNumber), 0);
        return {
          ...year,
          terms: [...year.terms, { id: generateId(), termNumber: maxTerm + 1, gwa: "", units: "" }],
        };
      }
      return year;
    }));
  };

  const removeTerm = (yearId, termId) => {
    setYears(years.map(year => {
      if (year.id === yearId) {
        return { ...year, terms: year.terms.filter(t => t.id !== termId) };
      }
      return year;
    }));
  };

  const updateTerm = (yearId, termId, field, value) => {
    setYears(years.map(year => {
      if (year.id === yearId) {
        return {
          ...year,
          terms: year.terms.map(term =>
            term.id === termId ? { ...term, [field]: value } : term
          ),
        };
      }
      return year;
    }));
  };

  // Calculate CGWA using formula: CGWA = ∑(GWA × units) / Total Units
  const calculateCGWA = () => {
    let totalWeightedSum = 0;
    let totalUnits = 0;

    years.forEach(year => {
      year.terms.forEach(term => {
        const gwa = parseFloat(term.gwa);
        const units = parseFloat(term.units);
        if (!isNaN(gwa) && !isNaN(units) && units > 0) {
          totalWeightedSum += gwa * units;
          totalUnits += units;
        }
      });
    });

    return totalUnits > 0 ? (totalWeightedSum / totalUnits).toFixed(4) : "0.0000";
  };

  const cgwa = calculateCGWA();

  // Determine Academic Honor based on CGWA
  const getAcademicHonor = () => {
    const cgwaNum = parseFloat(cgwa);
    if (cgwaNum < 3.25) {
      return { title: "No Academic Honor", subtitle: "Below 3.25", color: "from-slate-500 to-slate-600" };
    } else if (cgwaNum >= 3.25 && cgwaNum < 3.50) {
      return { title: "Cum Laude", subtitle: "3.25 - 3.49", color: "from-amber-500 to-amber-600" };
    } else if (cgwaNum >= 3.50 && cgwaNum < 3.75) {
      return { title: "Magna Cum Laude", subtitle: "3.50 - 3.74", color: "from-orange-500 to-orange-600" };
    } else {
      return { title: "Summa Cum Laude", subtitle: "3.75 and higher", color: "from-yellow-500 to-yellow-600" };
    }
  };

  const honor = getAcademicHonor();

  return (
    <div className={`min-h-screen p-6 md:p-12 font-sans transition-colors duration-500 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-900 text-white' : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 text-slate-800'}`}>
      
      {/* Warning Card Overlay */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className={`brutalist-card w-full max-w-md border-3 sm:border-4 p-4 sm:p-6 shadow-[6px_6px_0_#000] sm:shadow-[10px_10px_0_#000] animate-slide-up transition-colors duration-500 ${isDarkMode ? 'bg-slate-800 border-white' : 'bg-white border-black'}`}>
            <div className={`flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 border-b-2 pb-3 sm:pb-4 transition-colors duration-500 ${isDarkMode ? 'border-white' : 'border-black'}`}>
              <div className={`flex-shrink-0 p-1.5 sm:p-2 transition-colors duration-500 ${isDarkMode ? 'bg-white' : 'bg-black'}`}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-500 ${isDarkMode ? 'fill-black' : 'fill-white'}`}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              </div>
              <div className={`font-black text-xl sm:text-2xl uppercase transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-black'}`}>NOTE</div>
            </div>
            <div className={`mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed font-semibold border-b-2 pb-3 sm:pb-4 transition-colors duration-500 ${isDarkMode ? 'text-gray-200 border-white' : 'text-black border-black'}`}>
              This website is only a CGWA Calculator, it is not a guaranteed spot for an academic honor nor the actual CGWA of the student. It is a mere estimation of CGWA based on the student GWA. Always refer to the Student Handbook for any questions or confusions.
            </div>
            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              <button
                onClick={handleMarkAsRead}
                className={`brutalist-button brutalist-button-mark w-full py-2.5 sm:py-3 text-center text-sm sm:text-base font-bold uppercase border-[3px] relative transition-all duration-200 shadow-[4px_4px_0_#000] sm:shadow-[5px_5px_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#000] sm:hover:shadow-[7px_7px_0_#000] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none overflow-hidden group ${isDarkMode ? 'border-white bg-slate-800 text-white' : 'border-black bg-white text-black'}`}
              >
                <span className="relative z-10">Mark as Read</span>
                <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-600 group-hover:left-[100%]"></span>
              </button>
              <button
                onClick={handleTemporaryDismiss}
                className={`brutalist-button w-full py-2.5 sm:py-3 text-center text-sm sm:text-base font-bold uppercase border-[3px] relative transition-all duration-200 shadow-[4px_4px_0_#000] sm:shadow-[5px_5px_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#000] sm:hover:shadow-[7px_7px_0_#000] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none overflow-hidden group ${isDarkMode ? 'border-white bg-white text-black' : 'border-black bg-black text-white'}`}
              >
                <span className="relative z-10">Okay</span>
                <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-600 group-hover:left-[100%]"></span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header Section with Brutalist Style */}
        <header className={`p-4 sm:p-6 md:p-8 shadow-[6px_6px_0_#000] md:shadow-[8px_8px_0_#000] animate-fade-in border-3 md:border-4 transition-colors duration-500 ${isDarkMode ? 'bg-slate-800 border-white' : 'bg-white border-black'}`}>
          <div className="flex flex-row items-center justify-between gap-2 sm:gap-3 md:gap-4 mb-3">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 flex-1 min-w-0">
              <div className={`border-2 sm:border-3 md:border-4 px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-4 md:py-2 shadow-[2px_2px_0_#000] sm:shadow-[3px_3px_0_#000] md:shadow-[4px_4px_0_#000] transform -skew-x-6 bg-gradient-to-br from-blue-600 to-violet-600 flex-shrink-0 ${isDarkMode ? 'border-white' : 'border-black'}`}>
                <span className="text-white font-black text-sm sm:text-lg md:text-2xl transform skew-x-6 block">CGWA</span>
              </div>
              <h1 className={`font-black uppercase leading-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
                <span className="block text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl tracking-tight">
                  Calculator
                </span>
                <span className="block text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 -mt-0.5 sm:-mt-1">
                  For NU
                </span>
              </h1>
            </div>
            
            {/* Theme Toggle Switch */}
            <label className="theme-switch flex-shrink-0">
              <input 
                type="checkbox" 
                className="theme-switch__checkbox" 
                checked={isDarkMode}
                onChange={toggleTheme}
              />
              <div className="theme-switch__container">
                <div className="theme-switch__clouds" />
                <div className="theme-switch__stars-container">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z" fill="currentColor" />
                  </svg>
                </div>
                <div className="theme-switch__circle-container">
                  <div className="theme-switch__sun-moon-container">
                    <div className="theme-switch__moon">
                      <div className="theme-switch__spot" />
                      <div className="theme-switch__spot" />
                      <div className="theme-switch__spot" />
                    </div>
                  </div>
                </div>
              </div>
            </label>
          </div>
          <div className={`border-t-2 pt-2 sm:pt-3 mt-2 sm:mt-3 transition-colors duration-500 ${isDarkMode ? 'border-white' : 'border-black'}`}>
            <p className={`font-semibold uppercase tracking-wide leading-tight transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
              <span className="hidden sm:inline text-xs sm:text-sm">Track your current cumulative GPA</span>
              <span className="inline sm:hidden text-[10px]">Track your CGWA with precision</span>
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Left Column: About Section */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Animated Card */}
            <div className="relative select-none">
              {/* Animated Blobs */}
              <span 
                className={`absolute w-[60px] h-[60px] rounded-full opacity-30 animate-blob transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-t from-transparent to-cyan-400' : 'bg-gradient-to-t from-transparent to-blue-400'}`}
                style={{ top: '-5%', left: '-5%', animationDelay: '0.1s' }}
              />
              <span 
                className={`absolute w-[80px] h-[80px] rounded-full opacity-30 animate-blob transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-t from-transparent to-cyan-400' : 'bg-gradient-to-t from-transparent to-blue-400'}`}
                style={{ top: '60%', left: '-20%', animationDelay: '0.2s' }}
              />
              <span 
                className={`absolute w-[100px] h-[100px] rounded-full opacity-60 animate-blob transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-t from-transparent to-cyan-400' : 'bg-gradient-to-t from-transparent to-blue-400'}`}
                style={{ top: '10%', left: '60%', animationDelay: '0.3s' }}
              />
              <span 
                className={`absolute w-[90px] h-[90px] rounded-full opacity-40 animate-blob transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-t from-transparent to-cyan-400' : 'bg-gradient-to-t from-transparent to-blue-400'}`}
                style={{ top: '70%', left: '50%', animationDelay: '0.4s' }}
              />
              
              {/* Card Content */}
              <div className={`relative backdrop-blur-[15px] rounded-[5%] p-4 sm:p-6 flex flex-col justify-between min-h-[280px] sm:min-h-[320px] transition-all duration-500 ${isDarkMode ? 'outline outline-1 outline-blue-400 text-blue-400 bg-slate-900/60' : 'outline outline-1 outline-blue-500 text-blue-500 bg-white/60'}`}>
                {/* Check Icon */}
                <svg 
                  className={`absolute w-5 h-5 sm:w-6 sm:h-6 -top-2 -right-2 sm:-top-3 sm:-right-3 transition-colors duration-500 ${isDarkMode ? 'fill-blue-400' : 'fill-blue-500'}`}
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 512 512"
                >
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                </svg>
                
                <div className="space-y-2 sm:space-y-3">
                  <strong className="text-sm sm:text-base font-black uppercase block">CGWA Calculator</strong>
                  <p className={`text-xs leading-relaxed transition-colors duration-500 ${isDarkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                    He-yo! I'm <span className="font-bold">Nathan Rabanal</span>, a 3rd Year BSIT-MI Student at NU Fairview. I created this open-source calculator that helps NU students track their Cumulative GWA and check if their CGWA is within the reach for an academic honor.
                  </p>
                  <p>
                    
                  </p>
                </div>
                
                <hr className={`border-t opacity-50 transition-colors duration-500 ${isDarkMode ? 'border-blue-400' : 'border-blue-500'}`} />
                
                <a 
                  href="https://github.com/ninathan/CGWA-Calculator" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-center gap-1 py-3 px-6 rounded-2xl text-xs font-black uppercase transition-all duration-300 outline outline-1 ${isDarkMode ? 'outline-blue-400 hover:bg-blue-400 hover:text-slate-900' : 'outline-blue-500 hover:bg-blue-500 hover:text-white'}`}
                >
                  <span>GitHub</span>
                  <svg 
                    className={`h-5 w-0 scale-0 transition-all duration-300 group-hover:w-5 group-hover:ml-2 group-hover:scale-100 ${isDarkMode ? 'fill-slate-900' : 'fill-white'}`}
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 512 512"
                  >
                    <path d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* CGWA Result Card */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-600 to-violet-600 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl shadow-blue-600/20 text-white hover:shadow-2xl hover:shadow-blue-600/30 transition-all duration-500 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wide opacity-90">Your CGWA</h3>
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 hover:scale-110 flex items-center justify-center text-xs font-bold transition-all duration-300 backdrop-blur-sm"
                  title="Show computation breakdown"
                >
                  ?
                </button>
              </div>
              <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight my-3 drop-shadow-lg">{cgwa}</div>
              <p className="text-xs sm:text-sm opacity-80 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-white/40 rounded-full"></span>
                Cumulative General Weighted Average
              </p>

              {/* Academic Honor Button */}
              <button
                onClick={() => setShowHonor(!showHonor)}
                className="cta-button mt-4 w-full rounded-xl"
              >
                <span className="button-text font-semibold text-sm">
                  {showHonor ? 'HIDE' : 'SEE CURRENT ACADEMIC HONOR'}
                </span>
                {!showHonor && (
                  <span className="button-arrows">
                    <svg width="50px" height="20px" viewBox="0 0 66 43" version="1.1" xmlns="http://www.w3.org/2000/svg">
                      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <path className="arrow-one" d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z" fill="#FFFFFF" />
                        <path className="arrow-two" d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z" fill="#FFFFFF" />
                        <path className="arrow-three" d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z" fill="#FFFFFF" />
                      </g>
                    </svg>
                  </span>
                )}
              </button>

              {/* Academic Honor Display */}
              {showHonor && (
                <div className={`mt-4 p-4 bg-gradient-to-br ${honor.color} rounded-2xl shadow-lg animate-slide-down border-2 border-white/30`}>
                  <div>
                    <p className="text-lg font-bold text-white drop-shadow-md">{honor.title}</p>
                    <p className="text-xs text-white/80 font-medium">{honor.subtitle}</p>
                  </div>
                </div>
              )}
              
              {showBreakdown && (
                <div className="mt-4 pt-4 border-t border-white/20 text-xs space-y-2 animate-slide-down">
                  <p className="font-semibold opacity-90 mb-2">
                    Computation Breakdown:
                  </p>
                  {years.map((year) => (
                    <div key={year.id} className="space-y-1 bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                      <p className="font-semibold opacity-90">{year.yearNumber}{year.yearNumber === 1 ? 'st' : year.yearNumber === 2 ? 'nd' : year.yearNumber === 3 ? 'rd' : 'th'} Year:</p>
                      {year.terms.map((term) => {
                        const gwa = parseFloat(term.gwa);
                        const units = parseFloat(term.units);
                        if (!isNaN(gwa) && !isNaN(units) && units > 0) {
                          const weighted = gwa * units;
                          return (
                            <p key={term.id} className="opacity-80 pl-3 font-mono text-xs">
                              Term {term.termNumber}: {gwa} × {units} = <span className="font-semibold">{weighted.toFixed(2)}</span>
                            </p>
                          );
                        }
                        return null;
                      })}
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-white/20 bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                    <p className="font-semibold font-mono text-sm">
                      Total: {(() => {
                        let sum = 0;
                        let totalUnits = 0;
                        years.forEach(year => {
                          year.terms.forEach(term => {
                            const gwa = parseFloat(term.gwa);
                            const units = parseFloat(term.units);
                            if (!isNaN(gwa) && !isNaN(units) && units > 0) {
                              sum += gwa * units;
                              totalUnits += units;
                            }
                          });
                        });
                        return `${sum.toFixed(2)} ÷ ${totalUnits} = ${cgwa}`;
                      })()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Right Column: Calculator Section */}
          <main className="lg:col-span-2 space-y-6">
            
            {/* Dynamic Year Cards */}
            {years.map((year, yearIndex) => (
              <div 
                key={year.id} 
                className={`backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border transition-all duration-500 animate-slide-up ${isDarkMode ? 'bg-slate-800/80 shadow-slate-900/50 border-slate-700/50 hover:shadow-slate-900/60' : 'bg-white/80 shadow-slate-200/50 border-slate-100/50 hover:shadow-xl hover:shadow-slate-200/60'}`}
                style={{ animationDelay: `${yearIndex * 100}ms` }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-4">
                  <h3 className={`text-base sm:text-lg font-bold flex items-center gap-2 sm:gap-3 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-600/20">
                      {year.yearNumber}
                    </span>
                    {year.yearNumber}{year.yearNumber === 1 ? 'st' : year.yearNumber === 2 ? 'nd' : year.yearNumber === 3 ? 'rd' : 'th'} Year
                  </h3>
                  {years.length > 1 && (
                    <button
                      onClick={() => removeYear(year.id)}
                      className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all duration-200 font-medium hover:scale-105"
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>
                
                <div className="space-y-3">
                  {/* Headers - Hidden on mobile */}
                  <div className={`hidden sm:grid grid-cols-12 gap-4 px-3 text-xs font-semibold uppercase tracking-wider transition-colors duration-500 ${isDarkMode ? 'text-gray-400' : 'text-slate-400'}`}>
                    <div className="col-span-3">Term</div>
                    <div className="col-span-3">GWA</div>
                    <div className="col-span-3 flex items-center gap-1.5 relative">
                      Total Units
                      <button
                        onClick={() => setShowUnitsInfo(!showUnitsInfo)}
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-200 hover:scale-110 ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                        title="Click for info"
                      >
                        ?
                      </button>
                      {showUnitsInfo && (
                        <div className={`absolute top-6 left-0 z-50 w-72 p-4 rounded-xl border-2 shadow-xl transition-all duration-300 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-gray-200' : 'bg-white border-slate-300 text-slate-700'}`}>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Info</span>
                            <button
                              onClick={() => setShowUnitsInfo(false)}
                              className={`text-sm font-bold hover:scale-110 transition-transform ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-400 hover:text-slate-700'}`}
                            >
                              ✕
                            </button>
                          </div>
                          <p className="text-xs leading-relaxed">
                            To get total units, add all units for each subjects. Disregard the units of subjects that are marked with "*".
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="col-span-3"></div>
                  </div>

                  {/* Term Rows */}
                  {year.terms.map((term, idx) => (
                    <div key={term.id} className={`grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-start sm:items-center p-3 sm:p-3 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 group ${isDarkMode ? 'bg-gradient-to-r from-slate-700 to-blue-900/30 border-slate-600/60 hover:border-blue-500/60 hover:shadow-md' : 'bg-gradient-to-r from-slate-50 to-blue-50/30 border-slate-200/60 hover:border-blue-300/60 hover:shadow-md'}`}>
                      <div className={`sm:col-span-3 font-medium flex items-center gap-2 transition-colors duration-500 ${isDarkMode ? 'text-gray-200' : 'text-slate-700'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:scale-125 transition-transform duration-300"></span>
                        {term.termNumber}{term.termNumber === 1 ? 'st' : term.termNumber === 2 ? 'nd' : term.termNumber === 3 ? 'rd' : 'th'} Term
                      </div>
                      
                      {/* GWA Input with Tooltip */}
                      <div className="sm:col-span-3 relative input-container">
                        <input
                          type="number"
                          step="0.01"
                          min="1"
                          max="5"
                          value={term.gwa}
                          onChange={(e) => updateTerm(year.id, term.id, 'gwa', e.target.value)}
                          placeholder="GWA"
                          className={`w-full px-3 py-2.5 border-2 rounded-xl bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 opacity-80 focus:opacity-100 ${isDarkMode ? 'border-slate-600 text-white hover:border-slate-500 hover:bg-slate-700/50 focus:bg-slate-700 placeholder:text-gray-400' : 'border-white/80 text-slate-700 hover:border-slate-300 hover:bg-white/50 focus:bg-white placeholder:text-slate-400'}`}
                        />
                        <div className={`input-title absolute -top-12 left-1/2 -translate-x-1/2 text-xs font-semibold tracking-wider px-3 py-2 rounded-lg opacity-0 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg border before:content-[''] before:absolute before:w-2.5 before:h-2.5 before:border-r before:border-b before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:translate-y-1/2 before:rotate-45 before:-z-10 ${isDarkMode ? 'bg-slate-700 text-white border-slate-600 before:bg-slate-700 before:border-slate-600' : 'bg-white text-slate-800 border-slate-200 before:bg-white before:border-slate-200'}`}>
                          GWA
                        </div>
                      </div>
                      
                      {/* Units Input with Tooltip */}
                      <div className="sm:col-span-3 relative input-container">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={term.units}
                          onChange={(e) => updateTerm(year.id, term.id, 'units', e.target.value)}
                          placeholder="Units"
                          className={`w-full px-3 py-2.5 border-2 rounded-xl bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 opacity-80 focus:opacity-100 ${isDarkMode ? 'border-slate-600 text-white hover:border-slate-500 hover:bg-slate-700/50 focus:bg-slate-700 placeholder:text-gray-400' : 'border-white/80 text-slate-700 hover:border-slate-300 hover:bg-white/50 focus:bg-white placeholder:text-slate-400'}`}
                        />
                        <div className={`input-title absolute -top-12 left-1/2 -translate-x-1/2 text-xs font-semibold tracking-wider px-3 py-2 rounded-lg opacity-0 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg border before:content-[''] before:absolute before:w-2.5 before:h-2.5 before:border-r before:border-b before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:translate-y-1/2 before:rotate-45 before:-z-10 ${isDarkMode ? 'bg-slate-700 text-white border-slate-600 before:bg-slate-700 before:border-slate-600' : 'bg-white text-slate-800 border-slate-200 before:bg-white before:border-slate-200'}`}>
                          UNITS
                        </div>
                      </div>
                      
                      {year.terms.length > 1 && (
                        <button
                          onClick={() => removeTerm(year.id, term.id)}
                          className={`sm:col-span-3 text-xs px-2 py-1.5 rounded-lg transition-all duration-200 font-medium opacity-100 sm:opacity-0 group-hover:opacity-100 ${isDarkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Add Term Button */}
                  <button
                    onClick={() => addTerm(year.id)}
                    disabled={year.terms.length >= 3}
                    className={`cta-button w-full mt-4 rounded-xl text-sm sm:text-base ${year.terms.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="button-text font-semibold text-xs sm:text-sm">
                      {year.terms.length >= 3 ? 'MAX TERMS' : 'ADD TERM'}
                    </span>
                    {year.terms.length < 3 && (
                      <span className="button-arrows">
                        <svg width="50px" height="20px" viewBox="0 0 66 43" version="1.1" xmlns="http://www.w3.org/2000/svg">
                          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <path className="arrow-one" d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z" fill="#FFFFFF" />
                            <path className="arrow-two" d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z" fill="#FFFFFF" />
                            <path className="arrow-three" d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z" fill="#FFFFFF" />
                          </g>
                        </svg>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}

            {/* Add Year Button */}
            <button
              onClick={addYear}
              className="cta-button w-full py-4 sm:py-5 rounded-2xl sm:rounded-3xl"
            >
              <span className="button-text font-semibold text-xs sm:text-base">ADD ANOTHER YEAR</span>
              <span className="button-arrows">
                <svg width="50px" height="20px" viewBox="0 0 66 43" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <path className="arrow-one" d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z" fill="#FFFFFF" />
                    <path className="arrow-two" d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z" fill="#FFFFFF" />
                    <path className="arrow-three" d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z" fill="#FFFFFF" />
                  </g>
                </svg>
              </span>
            </button>

          </main>
        </div>
      </div>
    </div>
  );
}
