import React, { useState, useEffect } from 'react';
import { Award, PlusCircle, CheckCircle2, AlertCircle, RefreshCw, MessageCircle } from 'lucide-react';

export default function PackagesView({ onAdvanceSession, onOpenModal }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = () => {
    fetch('/api/agendamentos?filtro=pacotes')
      .then((res) => res.json())
      .then((data) => {
        setPackages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleAdvance = async (pkg) => {
    await onAdvanceSession(pkg);
    fetchPackages();
  };

  return (
    <div className="space-y-6">
      
      {/* Topo */}
      <div className="bg-white dark:bg-surface-darkCard p-5 rounded-2xl border border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-display text-xl lg:text-2xl font-bold text-onSurface dark:text-gray-100 flex items-center gap-2">
            <Award className="w-6 h-6 text-secondary-gold" />
            Gestão de Pacotes
          </h2>
          <p className="text-xs text-outline dark:text-gray-400 font-medium">
            Acompanhe o consumo de sessões, renove planos e gerencie tratamentos contínuos
          </p>
        </div>

        <button
          onClick={() => onOpenModal()}
          className="px-4 py-2.5 rounded-xl bg-primary dark:bg-primary-dark hover:bg-primary-container text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
        >
          <Award className="w-4 h-4" />
          <span>Cadastrar Novo Pacote</span>
        </button>
      </div>

      {/* Lista de Pacotes */}
      {loading ? (
        <div className="p-12 text-center text-xs text-outline">Carregando pacotes ativos...</div>
      ) : packages.length === 0 ? (
        <div className="bg-white dark:bg-surface-darkCard p-12 rounded-2xl border border-dashed border-outlineVariant/40 text-center text-xs text-outline">
          Nenhum pacote ativo registrado no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg) => {
            const sessaoAtual = pkg.sessao_atual || 1;
            const totalSessoes = pkg.quantidade_sessoes || 10;
            const percent = Math.min(100, Math.round((sessaoAtual / totalSessoes) * 100));
            const restantes = Math.max(0, totalSessoes - sessaoAtual);
            const isNearEnd = restantes <= 2;
            const isFinished = restantes === 0;

            return (
              <div
                key={pkg.id}
                className="bg-white dark:bg-surface-darkCard p-5 rounded-3xl border border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs hover:border-secondary-gold/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed/50 dark:bg-secondary-fixed/20 text-secondary dark:text-secondary-fixed text-xs font-bold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      Plano {totalSessoes} Sessões
                    </span>

                    {isFinished ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        Concluído
                      </span>
                    ) : isNearEnd ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Quase no fim!
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-surface-container dark:bg-surface-darkCardHigh text-outline dark:text-gray-400 text-[11px] font-medium">
                        Em andamento
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif-display text-lg font-bold text-onSurface dark:text-gray-100">
                      {pkg.nome_cliente}
                    </h3>
                    <p className="text-xs text-outline dark:text-gray-400 font-medium">
                      {pkg.procedimento}
                    </p>
                  </div>

                  {/* Barra de Progresso do Pacote */}
                  <div className="p-3.5 rounded-2xl bg-surface-container/60 dark:bg-surface-darkCardHigh border border-outlineVariant/20 dark:border-surface-darkBorder space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-secondary dark:text-secondary-fixed">
                        Sessão Realizada: {sessaoAtual} de {totalSessoes}
                      </span>
                      <span className="text-outline dark:text-gray-400">{percent}%</span>
                    </div>

                    <div className="w-full bg-white dark:bg-surface-darkCard h-2.5 rounded-full overflow-hidden p-0.5 border border-outlineVariant/30 dark:border-surface-darkBorder">
                      <div
                        className="bg-secondary-gold h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>

                    <p className="text-[11px] text-outline dark:text-gray-400 font-medium">
                      {isFinished
                        ? 'Todas as sessões foram realizadas! Sugerir renovação.'
                        : `Restam ${restantes} ${restantes === 1 ? 'sessão' : 'sessões'} para finalizar o plano.`}
                    </p>
                  </div>
                </div>

                {/* Ações */}
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-outlineVariant/20 dark:border-surface-darkBorder">
                  {!isFinished ? (
                    <button
                      onClick={() => handleAdvance(pkg)}
                      className="flex-1 py-2 rounded-xl bg-secondary-gold hover:bg-secondary text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      title="Registrar mais uma sessão realizada"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>+1 Sessão Feita</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenModal()}
                      className="flex-1 py-2 rounded-xl bg-primary dark:bg-primary-dark hover:bg-primary-container text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Renovar Pacote</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
