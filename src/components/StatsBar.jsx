import React from 'react';
import { Calendar, Award, Clock, CheckCircle2, UserCheck } from 'lucide-react';

export default function StatsBar({ stats }) {
  const total = stats?.totalAtendimentos || 0;
  const concluidos = stats?.concluidos || 0;
  const pacotes = stats?.pacotesAtivos || 0;
  const livres = stats?.horariosLivres || 0;
  const proximo = stats?.proximoAtendimento;

  const percentConcluido = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Card 1: Sessões Marcadas */}
      <div className="bg-white dark:bg-surface-darkCard p-5 rounded-2xl border border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-outline dark:text-gray-400 uppercase tracking-wider">
            Sessões do Dia
          </span>
          <div className="w-8 h-8 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-dark flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-3xl font-bold text-onSurface dark:text-gray-100">
              {total}
            </span>
            <span className="text-xs font-medium text-outline dark:text-gray-400">
              atendimentos
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-primary dark:text-primary-dark font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {concluidos} concluídos
            </span>
            <span className="text-outline dark:text-gray-400 font-medium">{percentConcluido}% do dia</span>
          </div>
          <div className="w-full bg-surface-container dark:bg-surface-darkCardHigh h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-primary dark:bg-primary-dark h-full rounded-full transition-all duration-500"
              style={{ width: `${percentConcluido}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Card 2: Pacotes & Fidelidade */}
      <div className="bg-white dark:bg-surface-darkCard p-5 rounded-2xl border border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-outline dark:text-gray-400 uppercase tracking-wider">
            Pacotes Ativos
          </span>
          <div className="w-8 h-8 rounded-xl bg-secondary-fixed/50 dark:bg-secondary-fixed/20 text-secondary-gold flex items-center justify-center">
            <Award className="w-4 h-4 text-secondary dark:text-secondary-gold" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-3xl font-bold text-onSurface dark:text-gray-100">
              {pacotes}
            </span>
            <span className="text-xs font-medium text-outline dark:text-gray-400">
              clientes em pacote
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-secondary dark:text-secondary-gold font-semibold">
            <span className="w-2 h-2 rounded-full bg-secondary-gold animate-pulse"></span>
            Acompanhamento contínuo
          </div>
          <div className="w-full bg-secondary-fixed/30 dark:bg-secondary-fixed/10 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-secondary-gold h-full rounded-full"
              style={{ width: `${Math.min(100, pacotes * 25)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Card 3: Horários Livres */}
      <div className="bg-white dark:bg-surface-darkCard p-5 rounded-2xl border border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-outline dark:text-gray-400 uppercase tracking-wider">
            Encaixes Livres
          </span>
          <div className="w-8 h-8 rounded-xl bg-surface-container dark:bg-surface-darkCardHigh text-primary dark:text-primary-dark flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-3xl font-bold text-primary dark:text-primary-dark">
              {livres}
            </span>
            <span className="text-xs font-medium text-outline dark:text-gray-400">
              janelas disponíveis
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-primary dark:text-primary-dark">
            <span className="px-2 py-0.5 rounded-md bg-surface-container dark:bg-surface-darkCardHigh border border-primary/20">11:30</span>
            <span className="px-2 py-0.5 rounded-md bg-surface-container dark:bg-surface-darkCardHigh border border-primary/20">15:30</span>
            <span className="px-2 py-0.5 rounded-md bg-surface-container dark:bg-surface-darkCardHigh border border-primary/20">17:30</span>
          </div>
          <span className="text-[11px] text-outline dark:text-gray-400 block mt-2">Pronto para agendar encaixes</span>
        </div>
      </div>

      {/* Card 4: Próximo Atendimento */}
      <div className="bg-gradient-to-br from-white to-surface-container/50 dark:from-surface-darkCard dark:to-surface-darkCardHigh p-5 rounded-2xl border-2 border-primary/30 dark:border-primary-dark/40 shadow-xs flex flex-col justify-between relative overflow-hidden transition-all">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-primary dark:text-primary-dark uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary dark:bg-primary-dark animate-ping"></span>
            Próximo Atendimento
          </span>
          {proximo ? (
            <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-[11px] font-bold">
              {proximo.horario_atendimento}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-surface-darkCardHigh text-gray-500 dark:text-gray-400 text-[11px] font-medium">
              Sem fila
            </span>
          )}
        </div>
        <div>
          {proximo ? (
            <>
              <h4 className="font-serif-display text-lg font-bold text-onSurface dark:text-gray-100 truncate">
                {proximo.nome_cliente}
              </h4>
              <p className="text-xs text-outline dark:text-gray-400 font-medium truncate mt-0.5">
                {proximo.procedimento}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs pt-1 border-t border-outlineVariant/30 dark:border-surface-darkBorder">
                <span className="text-primary dark:text-primary-dark font-semibold flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> {proximo.sala || 'Sala 01'}
                </span>
                {proximo.possui_pacote === 1 && (
                  <span className="text-secondary-gold font-bold">
                    Sessão {proximo.sessao_atual}/{proximo.quantidade_sessoes}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="py-2">
              <p className="text-xs text-outline dark:text-gray-400">
                Nenhum atendimento pendente para hoje.
              </p>
            </div>
          )}
        </div>
      </div>

    </section>
  );
}
