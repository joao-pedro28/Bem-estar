import React from 'react';
import { Sparkles, Calendar as CalendarIcon, Sun, Moon } from 'lucide-react';

export default function Header({ onOpenModal, selectedDate, onDateChange, isDarkMode, onToggleDarkMode }) {
  // Formata data amigável em português
  const formatDateDisplay = (dateString) => {
    try {
      const [year, month, day] = dateString.split('-');
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    } catch {
      return dateString;
    }
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <header className="w-full bg-white dark:bg-surface-darkCard border-b border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs sticky top-0 z-40 px-4 lg:px-8 py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Marca & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-dark border border-primary/20 shadow-xs">
            <span className="material-symbols-outlined text-[28px]">spa</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-display text-xl lg:text-2xl font-bold text-primary dark:text-primary-dark tracking-tight leading-none">
                Clínica Bem-Estar
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-fixed dark:bg-primary-dark/20 text-primary dark:text-primary-dark border border-primary/20">
                MVP v1.0
              </span>
            </div>
            <p className="text-xs text-outline dark:text-gray-400 font-medium tracking-wide">
              Massoterapia &amp; Estética Integrativa
            </p>
          </div>
        </div>

        {/* Indicador de Data Selecionada (Centro) */}
        <div className="hidden md:flex items-center gap-2 bg-surface-container/60 dark:bg-surface-darkCardHigh px-4 py-2 rounded-xl border border-outlineVariant/30 dark:border-surface-darkBorder">
          <CalendarIcon className="w-4 h-4 text-primary dark:text-primary-dark" />
          <span className="text-sm font-semibold text-onSurface dark:text-gray-200 capitalize">
            {formatDateDisplay(selectedDate)}
          </span>
          {isToday && (
            <span className="px-2 py-0.5 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider">
              Hoje
            </span>
          )}
        </div>

        {/* Ações, Modo Escuro e Perfil */}
        <div className="flex items-center gap-3">
          
          {/* Botão Alternador Modo Claro / Modo Escuro */}
          <button
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-xl border border-outlineVariant/40 dark:border-surface-darkBorder bg-surface-container/40 dark:bg-surface-darkCardHigh text-outline dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark hover:border-primary/40 transition-all shadow-2xs"
            title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            aria-label="Alternar tema"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 animate-fadeIn" />
            ) : (
              <Moon className="w-4 h-4 text-gray-700 animate-fadeIn" />
            )}
          </button>

          <div className="h-6 w-px bg-outlineVariant/40 dark:bg-surface-darkBorder mx-1 hidden sm:block"></div>

          {/* Perfil Terapeuta */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/15 border-2 border-primary-fixed dark:border-primary/40 flex items-center justify-center text-primary dark:text-primary-dark font-bold text-sm shadow-xs overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1594824813637-27b99379659b?w=120&auto=format&fit=crop&q=80"
                  alt="Dra. Helena Valente"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerText = 'HV';
                  }}
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-surface-darkCard"></span>
            </div>
            <div className="hidden xl:block text-left">
              <span className="block text-xs font-bold text-onSurface dark:text-gray-200 leading-tight">
                Dra. Helena Valente
              </span>
              <span className="text-[11px] text-outline dark:text-gray-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Em atendimento
              </span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
