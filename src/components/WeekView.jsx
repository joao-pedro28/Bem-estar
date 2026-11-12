import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, Award, CheckCircle2 } from 'lucide-react';

export default function WeekView({
  selectedDate,
  onDateChange,
  agendamentos,
  onOpenModal,
  onSelectDay
}) {
  // Calcula o início da semana (segunda-feira) a partir de selectedDate
  const curr = new Date(selectedDate + 'T12:00:00');
  const dayOfWeek = curr.getDay(); // 0 = Domingo, 1 = Segunda...
  // Ajuste para segunda-feira como início da semana comercial
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(curr);
  monday.setDate(curr.getDate() + diffToMonday);

  // Gera os 7 dias da semana
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    weekDays.push({
      dateStr,
      dayNumber: d.getDate(),
      dayName: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
      isToday: dateStr === new Date().toISOString().split('T')[0],
      isSelected: dateStr === selectedDate
    });
  }

  const changeWeek = (offsetWeeks) => {
    const newDate = new Date(monday);
    newDate.setDate(monday.getDate() + (offsetWeeks * 7));
    onDateChange(newDate.toISOString().split('T')[0]);
  };

  const startFormatted = monday.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const endFormatted = sunday.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* Barra de Navegação da Semana */}
      <div className="bg-white dark:bg-surface-darkCard p-4 rounded-2xl border border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-container dark:bg-surface-darkCardHigh rounded-xl p-1 border border-outlineVariant/20 dark:border-surface-darkBorder">
            <button
              onClick={() => changeWeek(-1)}
              className="p-1.5 hover:bg-white dark:hover:bg-surface-darkCard rounded-lg text-outline dark:text-gray-400 hover:text-onSurface dark:hover:text-gray-200 transition-all"
              title="Semana anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => changeWeek(1)}
              className="p-1.5 hover:bg-white dark:hover:bg-surface-darkCard rounded-lg text-outline dark:text-gray-400 hover:text-onSurface dark:hover:text-gray-200 transition-all"
              title="Próxima semana"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="pl-2">
            <h3 className="font-serif-display text-lg font-bold text-onSurface dark:text-gray-100">
              Visão Semanal: {startFormatted} a {endFormatted}
            </h3>
            <span className="text-xs text-outline dark:text-gray-400 font-medium">
              Grade consolidada de atendimentos da semana
            </span>
          </div>
        </div>

        <button
          onClick={() => onDateChange(new Date().toISOString().split('T')[0])}
          className="px-3 py-1.5 rounded-xl border border-primary/30 dark:border-primary-dark/40 text-primary dark:text-primary-dark hover:bg-primary-light dark:hover:bg-primary/20 font-bold text-xs transition-colors"
        >
          Semana Atual
        </button>
      </div>

      {/* Grade de 7 Colunas da Semana */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          // Filtra agendamentos deste dia específico
          const dayAppointments = agendamentos.filter(
            (a) => a.data_atendimento === day.dateStr
          );

          return (
            <div
              key={day.dateStr}
              className={`bg-white dark:bg-surface-darkCard rounded-2xl border transition-all flex flex-col justify-between min-h-[360px] p-3 ${
                day.isSelected
                  ? 'ring-2 ring-primary dark:ring-primary-dark border-primary/40'
                  : 'border-outlineVariant/30 dark:border-surface-darkBorder hover:border-primary/30'
              }`}
            >
              {/* Cabeçalho do Dia */}
              <div>
                <div
                  onClick={() => onSelectDay(day.dateStr)}
                  className="cursor-pointer pb-2 mb-2 border-b border-outlineVariant/20 dark:border-surface-darkBorder flex items-center justify-between"
                >
                  <div className="text-left">
                    <span className="text-[11px] font-bold text-outline dark:text-gray-400 uppercase block">
                      {day.dayName}
                    </span>
                    <span className={`text-base font-bold font-serif-display ${
                      day.isToday ? 'text-primary dark:text-primary-dark' : 'text-onSurface dark:text-gray-100'
                    }`}>
                      {day.dayNumber}
                    </span>
                  </div>

                  {day.isToday && (
                    <span className="px-1.5 py-0.5 rounded-md bg-primary dark:bg-primary-dark text-white text-[9px] font-bold uppercase">
                      Hoje
                    </span>
                  )}
                </div>

                {/* Lista de Atendimentos do Dia */}
                <div className="space-y-2">
                  {dayAppointments.length === 0 ? (
                    <div className="py-6 text-center text-[11px] text-outline/60 dark:text-gray-500 italic">
                      Livre
                    </div>
                  ) : (
                    dayAppointments.map((app) => (
                      <div
                        key={app.id}
                        className={`p-2 rounded-xl border text-left text-xs transition-all ${
                          app.status === 'concluido'
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 text-emerald-900 dark:text-emerald-300'
                            : app.possui_pacote === 1
                            ? 'bg-secondary-fixed/20 dark:bg-secondary-fixed/10 border-secondary-gold/30 text-onSurface dark:text-gray-200'
                            : 'bg-surface-container/50 dark:bg-surface-darkCardHigh border-outlineVariant/30 dark:border-surface-darkBorder text-onSurface dark:text-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-[11px] mb-0.5">
                          <span>{app.horario_atendimento}</span>
                          {app.possui_pacote === 1 && (
                            <span className="text-secondary-gold text-[10px]">★ Pacote</span>
                          )}
                        </div>
                        <p className="font-semibold truncate text-[11px]">{app.nome_cliente}</p>
                        <p className="text-[10px] text-outline dark:text-gray-400 truncate">{app.procedimento}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Botão para Agendar neste dia */}
              <button
                onClick={() => onOpenModal('', null, day.dateStr)}
                className="mt-3 w-full py-1.5 rounded-lg border border-dashed border-primary/40 dark:border-primary-dark/40 text-primary dark:text-primary-dark hover:bg-primary-light dark:hover:bg-primary/20 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                title={`Agendar atendimento para ${day.dateStr}`}
              >
                <Plus className="w-3 h-3" />
                <span>Agendar</span>
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
}
