import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, Award, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function FinanceView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/financeiro')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-xs text-outline">Carregando painel financeiro...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Topo Financeiro */}
      <div className="bg-white dark:bg-surface-darkCard p-5 rounded-2xl border border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-display text-xl lg:text-2xl font-bold text-onSurface dark:text-gray-100 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-primary dark:text-primary-dark" />
            Financeiro &amp; Faturamento
          </h2>
          <p className="text-xs text-outline dark:text-gray-400 font-medium">
            Recebimentos de pacotes, atendimentos avulsos e ticket médio
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5" />
          Fluxo Saudável
        </span>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Faturamento Mês */}
        <div className="bg-white dark:bg-surface-darkCard p-5 rounded-2xl border border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs">
          <span className="text-xs font-semibold text-outline dark:text-gray-400 uppercase tracking-wider block mb-1">
            Faturamento do Mês
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-outline dark:text-gray-400">R$</span>
            <span className="font-serif-display text-3xl font-bold text-primary dark:text-primary-dark">
              {data.faturamentoEstimadoMes.toLocaleString('pt-BR')}
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2 block">
            ↑ +18% em relação ao mês anterior
          </span>
        </div>

        {/* Card 2: Faturamento Hoje */}
        <div className="bg-white dark:bg-surface-darkCard p-5 rounded-2xl border border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs">
          <span className="text-xs font-semibold text-outline dark:text-gray-400 uppercase tracking-wider block mb-1">
            Receita Hoje (Concluídos)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-outline dark:text-gray-400">R$</span>
            <span className="font-serif-display text-3xl font-bold text-onSurface dark:text-gray-100">
              {data.faturamentoHoje.toLocaleString('pt-BR')}
            </span>
          </div>
          <span className="text-[11px] text-outline dark:text-gray-400 font-medium mt-2 block">
            Sessões finalizadas no dia
          </span>
        </div>

        {/* Card 3: Pacotes vs Avulsos */}
        <div className="bg-white dark:bg-surface-darkCard p-5 rounded-2xl border border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs">
          <span className="text-xs font-semibold text-outline dark:text-gray-400 uppercase tracking-wider block mb-1">
            Mix de Vendas
          </span>
          <div className="font-serif-display text-2xl font-bold text-secondary-gold">
            {data.totalPacotesVendidos} Pacotes
          </div>
          <span className="text-xs text-outline dark:text-gray-400 font-medium block mt-1">
            e {data.totalSessoesAvulsas} sessões avulsas
          </span>
        </div>

        {/* Card 4: Ticket Médio */}
        <div className="bg-white dark:bg-surface-darkCard p-5 rounded-2xl border border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs">
          <span className="text-xs font-semibold text-outline dark:text-gray-400 uppercase tracking-wider block mb-1">
            Ticket Médio
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-outline dark:text-gray-400">R$</span>
            <span className="font-serif-display text-3xl font-bold text-onSurface dark:text-gray-100">
              {data.ticketMedio}
            </span>
          </div>
          <span className="text-[11px] text-outline dark:text-gray-400 font-medium mt-2 block">
            Por cliente atendida
          </span>
        </div>

      </div>

      {/* Tabela de Transações Recentes */}
      <div className="bg-white dark:bg-surface-darkCard rounded-2xl border border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs overflow-hidden">
        <div className="p-4 bg-surface-container/40 dark:bg-surface-darkCardHigh border-b border-outlineVariant/30 dark:border-surface-darkBorder flex items-center justify-between">
          <h3 className="font-serif-display text-base font-bold text-onSurface dark:text-gray-100">
            Últimos Recebimentos
          </h3>
          <span className="text-xs text-outline dark:text-gray-400 font-medium">Histórico recente</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container/20 dark:bg-surface-darkCardHigh/50 text-outline dark:text-gray-400 uppercase tracking-wider border-b border-outlineVariant/20 dark:border-surface-darkBorder font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Descrição</th>
                <th className="py-3 px-4">Método</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outlineVariant/20 dark:divide-surface-darkBorder text-onSurface dark:text-gray-200">
              {data.transacoesRecentes.map((t) => (
                <tr key={t.id} className="hover:bg-surface-container/30 dark:hover:bg-surface-darkCardHigh/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-outline dark:text-gray-400">{t.id}</td>
                  <td className="py-3 px-4 font-bold">{t.cliente}</td>
                  <td className="py-3 px-4">{t.descricao}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-surface-container dark:bg-surface-darkCardHigh border border-outlineVariant/30 dark:border-surface-darkBorder font-medium">
                      {t.metodo}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-outline dark:text-gray-400">{t.data}</td>
                  <td className="py-3 px-4 font-bold text-right text-emerald-600 dark:text-emerald-400">
                    R$ {t.valor.toLocaleString('pt-BR')},00
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
