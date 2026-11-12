import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, MapPin, Tag, Plus, Check } from 'lucide-react';

export default function TreatmentsView({ onSelectTreatmentToBook }) {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tratamentos')
      .then((res) => res.json())
      .then((data) => {
        setTreatments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white dark:bg-surface-darkCard p-5 rounded-2xl border border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-display text-xl lg:text-2xl font-bold text-onSurface dark:text-gray-100">
            Tratamentos &amp; Protocolos Clínicos
          </h2>
          <p className="text-xs text-outline dark:text-gray-400 font-medium">
            Tabela de procedimentos, durações, precificação e vantagens de pacotes
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-dark font-bold text-xs flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          {treatments.length} protocolos ativos
        </span>
      </div>

      {/* Grid de Tratamentos */}
      {loading ? (
        <div className="p-12 text-center text-xs text-outline">Carregando catálogo de protocolos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {treatments.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-surface-darkCard p-5 rounded-3xl border border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              {t.destaque && (
                <div className="absolute top-0 right-0 bg-secondary-gold text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider">
                  Mais Procurado
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary dark:text-primary-dark px-2.5 py-0.5 rounded-md bg-primary-fixed dark:bg-primary/20">
                    {t.categoria}
                  </span>
                </div>

                <h3 className="font-serif-display text-lg font-bold text-onSurface dark:text-gray-100 leading-snug">
                  {t.nome}
                </h3>

                <div className="flex items-center gap-3 text-xs text-outline dark:text-gray-400">
                  <span className="flex items-center gap-1 font-semibold text-onSurface dark:text-gray-200">
                    <Clock className="w-3.5 h-3.5 text-primary dark:text-primary-dark" />
                    {t.duracao}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {t.salaRecomendada}
                  </span>
                </div>

                <p className="text-xs text-outline dark:text-gray-400 line-clamp-3">
                  {t.indicacoes}
                </p>

                {/* Preços e Pacotes */}
                <div className="p-3.5 rounded-2xl bg-surface-container/60 dark:bg-surface-darkCardHigh border border-outlineVariant/20 dark:border-surface-darkBorder space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-outline dark:text-gray-400">Sessão Avulsa:</span>
                    <span className="font-bold text-onSurface dark:text-gray-100 text-sm">
                      R$ {t.valorAvulso},00
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-outlineVariant/20 dark:border-surface-darkBorder text-secondary-gold font-bold">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Pacote 10x:
                    </span>
                    <span>
                      R$ {t.valorPacote10},00
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block text-right">
                        (Economia de R$ {(t.valorAvulso * 10) - t.valorPacote10})
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão de Ação */}
              <button
                onClick={() => onSelectTreatmentToBook(t.nome)}
                className="w-full py-2.5 rounded-xl bg-primary dark:bg-primary-dark hover:bg-primary-container text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Agendar Este Protocolo</span>
              </button>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
