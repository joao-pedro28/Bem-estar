import React from 'react';
import { Calendar as CalendarIcon, Users, Sparkles, Award, DollarSign, Settings, HelpCircle, UserPlus } from 'lucide-react';

export default function Sidebar({ selectedDate, onDateChange, onOpenModal, currentTab, onTabChange }) {
  const [year, month, day] = selectedDate.split('-').map(Number);
  
  // Nomes dos dias da semana simplificados
  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  // Dias do mês atual para o mini-calendário
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayIndex = new Date(year, month - 1, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handleSelectDay = (d) => {
    if (!d) return;
    const formattedDay = String(d).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');
    onDateChange(`${year}-${formattedMonth}-${formattedDay}`);
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const navItems = [
    { id: 'agenda', label: 'Agenda Clínica', icon: CalendarIcon },
    { id: 'pacientes', label: 'Pacientes & Prontuários', icon: Users },
    { id: 'tratamentos', label: 'Tratamentos & Protocolos', icon: Sparkles },
    { id: 'pacotes', label: 'Pacotes & Sessões', icon: Award },
    { id: 'financeiro', label: 'Financeiro & Repasses', icon: DollarSign }
  ];

  return (
    <aside className="w-72 hidden lg:flex flex-col justify-between p-4 bg-white dark:bg-surface-darkCard border-r border-outlineVariant/30 dark:border-surface-darkBorder shrink-0 sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto space-y-6 transition-colors duration-200">
      
      <div className="space-y-6">
        
        {/* Botão de Atalho Rápido */}
        <button
          onClick={() => onOpenModal()}
          className="w-full py-2.5 px-4 rounded-xl bg-surface-container dark:bg-surface-darkCardHigh border border-primary/20 dark:border-primary-dark/30 text-primary dark:text-primary-dark font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary-light dark:hover:bg-primary/20 transition-all shadow-2xs active:scale-98"
        >
          <UserPlus className="w-4 h-4" />
          <span>Cadastrar Cliente</span>
        </button>

        {/* Menu de Navegação Interativo */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all text-left ${
                  isActive
                    ? 'bg-primary dark:bg-primary-dark text-white shadow-xs'
                    : 'text-outline dark:text-gray-400 hover:text-onSurface dark:hover:text-gray-200 hover:bg-surface-container dark:hover:bg-surface-darkCardHigh'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-primary dark:text-primary-dark'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mini-Calendário Mensal Interativo (só na aba agenda ou como widget) */}
        <div className="p-4 rounded-2xl bg-surface-container/40 dark:bg-surface-darkCardHigh/60 border border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="font-serif-display text-sm font-bold text-onSurface dark:text-gray-200">
              {monthNames[month - 1]} {year}
            </span>
            <span className="text-[10px] uppercase font-bold text-primary dark:text-primary-dark px-2 py-0.5 rounded-md bg-primary-fixed dark:bg-primary/20">
              Mês
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-outline dark:text-gray-400 mb-1">
            {weekDays.map((w, idx) => (
              <span key={idx}>{w}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {days.map((d, index) => {
              if (d === null) {
                return <span key={index} className="py-1"></span>;
              }
              const isSelected = d === day;
              return (
                <button
                  key={index}
                  onClick={() => handleSelectDay(d)}
                  className={`py-1 rounded-lg text-xs font-semibold transition-all relative ${
                    isSelected
                      ? 'bg-primary dark:bg-primary-dark text-white font-bold shadow-xs'
                      : 'hover:bg-white dark:hover:bg-surface-darkCard text-onSurface dark:text-gray-300'
                  }`}
                >
                  {d}
                  {/* Ponto indicador de atendimentos */}
                  {(d === 12 || d === 15 || d === 24 || d === day) && (
                    <span
                      className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                        isSelected ? 'bg-secondary-fixed' : 'bg-secondary-gold'
                      }`}
                    ></span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-outlineVariant/20 dark:border-surface-darkBorder flex items-center justify-between text-[11px] font-medium text-outline dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary dark:bg-primary-dark"></span> Consultas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary-gold"></span> Pacotes
            </span>
          </div>
        </div>

        {/* Dica do Dia: Aromaterapia */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 space-y-1.5">
          <div className="flex items-center gap-2 text-primary dark:text-primary-dark font-bold text-xs uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px]">local_florist</span>
            <span>Aromaterapia do Dia</span>
          </div>
          <p className="text-xs text-onSurface dark:text-gray-300 font-medium">
            Difusor: Lavanda &amp; Capim-limão para as sessões da tarde.
          </p>
          <span className="text-[11px] text-primary dark:text-primary-dark font-semibold block pt-1">
            ✓ Salas 01 e 02 higienizadas
          </span>
        </div>

      </div>

      {/* Rodapé da Sidebar */}
      <div className="pt-4 border-t border-outlineVariant/30 dark:border-surface-darkBorder space-y-1">
        <button
          onClick={() => alert('Configurações da clínica: Dados cadastrais, salas e horários de atendimento.')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-outline dark:text-gray-400 hover:text-onSurface dark:hover:text-gray-200 hover:bg-surface-container dark:hover:bg-surface-darkCardHigh text-xs font-medium transition-colors text-left"
        >
          <Settings className="w-4 h-4" />
          <span>Configurações</span>
        </button>
        <button
          onClick={() => alert('Suporte Técnico da Clínica Bem-Estar: Atendimento via WhatsApp.')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-outline dark:text-gray-400 hover:text-onSurface dark:hover:text-gray-200 hover:bg-surface-container dark:hover:bg-surface-darkCardHigh text-xs font-medium transition-colors text-left"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Suporte &amp; Ajuda</span>
        </button>
      </div>

    </aside>
  );
}
