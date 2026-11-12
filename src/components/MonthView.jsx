import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';

export default function MonthView({
  selectedDate,
  onDateChange,
  agendamentos,
  onOpenModal,
  onSelectDay
}) {
  const [year, month, day] = selectedDate.split('-').map(Number);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekHeaders = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Dias do mês
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0 = Domingo

  const calendarCells = [];
  // Espaços vazios antes do dia 1
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const formattedD = String(i).padStart(2, '0');
    const formattedM = String(month).padStart(2, '0');
    const dateStr = `${year}-${formattedM}-${formattedD}`;
    calendarCells.push({
      dayNumber: i,
      dateStr,
      isToday: dateStr === new Date().toISOString().split('T')[0],
      isSelected: dateStr === selectedDate
    });
  }

  const changeMonth = (offset) => {
    let newMonth = month + offset;
    let newYear = year;
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    const formattedM = String(newMonth).padStart(2, '0');
    onDateChange(`${newYear}-${formattedM}-01`);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* Navegação do Mês */}
      <div className="bg-white dark:bg-surface-darkCard p-4 rounded-2xl border border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-container dark:bg-surface-darkCardHigh rounded-xl p-1 border border-outlineVariant/20 dark:border-surface-darkBorder">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1.5 hover:bg-white dark:hover:bg-surface-darkCard rounded-lg text-outline dark:text-gray-400 hover:text-onSurface dark:hover:text-gray-200 transition-all"
              title="Mês anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => changeMonth(1)}
              className="p-1.5 hover:bg-white dark:hover:bg-surface-darkCard rounded-lg text-outline dark:text-gray-400 hover:text-onSurface dark:hover:text-gray-200 transition-all"
              title="Próximo mês"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="pl-2">
            <h3 className="font-serif-display text-lg font-bold text-onSurface dark:text-gray-100">
              {monthNames[month - 1]} de {year}
            </h3>
            <span className="text-xs text-outline dark:text-gray-400 font-medium">
              Calendário mensal completo de atendimentos
            </span>
          </div>
        </div>

        <button
          onClick={() => onDateChange(new Date().toISOString().split('T')[0])}
          className="px-3 py-1.5 rounded-xl border border-primary/30 dark:border-primary-dark/40 text-primary dark:text-primary-dark hover:bg-primary-light dark:hover:bg-primary/20 font-bold text-xs transition-colors"
        >
          Mês Atual
        </button>
      </div>

      {/* Grade do Mês */}
      <div className="bg-white dark:bg-surface-darkCard p-4 rounded-3xl border border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs overflow-hidden">
        
        {/* Cabeçalho dos dias da semana */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-outline dark:text-gray-400 uppercase tracking-wider mb-2">
          {weekHeaders.map((w, idx) => (
            <div key={idx} className="py-1">
              {w}
            </div>
          ))}
        </div>

        {/* Células de Dias */}
        <div className="grid grid-cols-7 gap-2">
          {calendarCells.map((cell, idx) => {
            if (cell === null) {
              return <div key={idx} className="min-h-[100px] bg-surface-container/20 dark:bg-surface-darkCardHigh/20 rounded-2xl"></div>;
            }

            const dayApps = agendamentos.filter((a) => a.data_atendimento === cell.dateStr);

            return (
              <div
                key={cell.dateStr}
                onClick={() => onSelectDay(cell.dateStr)}
                className={`min-h-[100px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  cell.isSelected
                    ? 'ring-2 ring-primary dark:ring-primary-dark border-primary/50 bg-primary-light/30 dark:bg-primary/10'
                    : 'border-outlineVariant/30 dark:border-surface-darkBorder hover:border-primary/40 bg-surface-container/30 dark:bg-surface-darkCardHigh/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold font-serif-display ${
                      cell.isToday
                        ? 'w-6 h-6 rounded-full bg-primary dark:bg-primary-dark text-white flex items-center justify-center'
                        : 'text-onSurface dark:text-gray-200'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {dayApps.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-secondary-fixed/50 dark:bg-secondary-fixed/20 text-secondary dark:text-secondary-fixed text-[10px] font-bold">
                      {dayApps.length} {dayApps.length === 1 ? 'sessão' : 'sessões'}
                    </span>
                  )}
                </div>

                {/* Previews de Agendamentos */}
                <div className="space-y-1 my-1">
                  {dayApps.slice(0, 2).map((app) => (
                    <div
                      key={app.id}
                      className="px-1.5 py-0.5 rounded-md bg-white dark:bg-surface-darkCard text-[10px] text-onSurface dark:text-gray-200 border border-outlineVariant/30 dark:border-surface-darkBorder truncate"
                    >
                      <span className="font-bold mr-1 text-primary dark:text-primary-dark">{app.horario_atendimento}</span>
                      <span>{app.nome_cliente}</span>
                    </div>
                  ))}
                  {dayApps.length > 2 && (
                    <span className="text-[9px] text-outline dark:text-gray-400 font-semibold block text-center">
                      +{dayApps.length - 2} mais
                    </span>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModal('', null, cell.dateStr);
                    }}
                    className="p-1 rounded-md text-outline dark:text-gray-400 hover:text-primary dark:hover:text-primary-dark hover:bg-white dark:hover:bg-surface-darkCard"
                    title={`Agendar em ${cell.dateStr}`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
