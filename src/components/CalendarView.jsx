import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, Coffee } from 'lucide-react';
import AppointmentCard from './AppointmentCard';

export default function CalendarView({
  selectedDate,
  onDateChange,
  agendamentos,
  onOpenModal,
  onToggleStatus,
  onAdvanceSession,
  onDelete
}) {
  // Navegação de dias
  const changeDay = (offset) => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + offset);
    const newDateStr = date.toISOString().split('T')[0];
    onDateChange(newDateStr);
  };

  const setToday = () => {
    const today = new Date().toISOString().split('T')[0];
    onDateChange(today);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      
      {/* Barra de Navegação do Calendário Diário */}
      <div className="bg-white dark:bg-surface-darkCard p-4 rounded-2xl border border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-container dark:bg-surface-darkCardHigh rounded-xl p-1 border border-outlineVariant/20 dark:border-surface-darkBorder">
            <button
              onClick={() => changeDay(-1)}
              className="p-1.5 hover:bg-white dark:hover:bg-surface-darkCard rounded-lg text-outline dark:text-gray-400 hover:text-onSurface dark:hover:text-gray-200 transition-all"
              title="Dia anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => changeDay(1)}
              className="p-1.5 hover:bg-white dark:hover:bg-surface-darkCard rounded-lg text-outline dark:text-gray-400 hover:text-onSurface dark:hover:text-gray-200 transition-all"
              title="Próximo dia"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {!isToday && (
            <button
              onClick={setToday}
              className="px-3 py-1.5 rounded-xl border border-primary/30 dark:border-primary-dark/40 text-primary dark:text-primary-dark hover:bg-primary-light dark:hover:bg-primary/20 font-bold text-xs transition-colors"
            >
              Ir para Hoje
            </button>
          )}

          <div className="flex items-center gap-2 pl-2">
            <span className="font-serif-display text-lg font-bold text-onSurface dark:text-gray-100">
              Agenda do Dia
            </span>
            <span className="text-xs text-outline dark:text-gray-400 font-semibold">
              ({agendamentos.length} {agendamentos.length === 1 ? 'sessão' : 'sessões'})
            </span>
          </div>
        </div>

        {/* Input Date Nativo Elegante */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-outline dark:text-gray-400 hidden sm:inline">
            Data:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-outlineVariant/50 dark:border-surface-darkBorder bg-white dark:bg-surface-darkCardHigh text-xs font-semibold text-onSurface dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Lista de Atendimentos da Linha do Tempo */}
      <div className="space-y-3.5">
        
        {agendamentos.length === 0 ? (
          <div className="bg-white dark:bg-surface-darkCard p-12 rounded-2xl border border-dashed border-outlineVariant/50 dark:border-surface-darkBorder text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-dark mx-auto flex items-center justify-center">
              <CalendarIcon className="w-7 h-7" />
            </div>
            <h3 className="font-serif-display text-lg font-bold text-onSurface dark:text-gray-100">
              Nenhum agendamento encontrado para esta data
            </h3>
            <p className="text-xs text-outline dark:text-gray-400 max-w-sm mx-auto">
              Aproveite os horários livres para agendar novas clientes, encaixes ou sessões de pacotes.
            </p>
            <button
              onClick={() => onOpenModal()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary dark:bg-primary-dark text-white font-bold text-xs shadow-sm hover:bg-primary-container transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Agendar Primeiro Horário</span>
            </button>
          </div>
        ) : (
          <>
            {agendamentos.map((item, index) => {
              const isFirstAfterNoon = item.horario_atendimento >= '13:30' && (index === 0 || agendamentos[index - 1]?.horario_atendimento < '12:00');

              return (
                <React.Fragment key={item.id}>
                  {isFirstAfterNoon && (
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container dark:bg-surface-darkCardHigh border border-dashed border-outlineVariant/60 dark:border-surface-darkBorder text-outline dark:text-gray-400 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white dark:bg-surface-darkCard text-primary dark:text-primary-dark flex items-center justify-center shadow-2xs">
                          <Coffee className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-onSurface dark:text-gray-200">
                            12:00 - 13:30 • Intervalo de Almoço &amp; Higienização
                          </span>
                          <span className="block text-[11px] text-outline dark:text-gray-400">
                            Troca de lençóis hospitalares, higienização de difusores e ventilação de salas.
                          </span>
                        </div>
                      </div>
                      <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-white dark:bg-surface-darkCard text-outline dark:text-gray-300 font-semibold text-[11px]">
                        90 min
                      </span>
                    </div>
                  )}

                  <AppointmentCard
                    appointment={item}
                    onToggleStatus={onToggleStatus}
                    onAdvanceSession={onAdvanceSession}
                    onDelete={onDelete}
                  />
                </React.Fragment>
              );
            })}
          </>
        )}

        {/* Faixa de Encaixe / Horário Livre Adicional */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container/50 dark:bg-surface-darkCardHigh/50 border border-dashed border-primary/30 dark:border-primary-dark/30 hover:bg-surface-container dark:hover:bg-surface-darkCardHigh transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-dark flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-onSurface dark:text-gray-200">
                Horário Livre Disponível para Encaixe
              </span>
              <span className="block text-[11px] text-outline dark:text-gray-400">
                Encaixe disponível para sessão de 45 ou 60 minutos
              </span>
            </div>
          </div>
          <button
            onClick={() => onOpenModal('17:30')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/40 dark:border-primary-dark/40 text-primary dark:text-primary-dark hover:bg-primary dark:hover:bg-primary-dark hover:text-white font-bold text-xs transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agendar Encaixe</span>
          </button>
        </div>

      </div>

    </div>
  );
}
