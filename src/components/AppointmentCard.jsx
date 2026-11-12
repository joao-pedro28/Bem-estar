import React from 'react';
import { CheckCircle2, MessageCircle, Trash2, Award, Clock, MapPin, PlusCircle } from 'lucide-react';

export default function AppointmentCard({ appointment, onToggleStatus, onAdvanceSession, onDelete }) {
  const isConcluido = appointment.status === 'concluido';
  const isPacote = appointment.possui_pacote === 1;

  // Gerador de link do WhatsApp com mensagem personalizada para a cliente
  const getWhatsAppLink = () => {
    let rawPhone = (appointment.telefone || '').replace(/\D/g, '');
    if (!rawPhone) rawPhone = '71999999999';
    if (!rawPhone.startsWith('55') && rawPhone.length <= 11) {
      rawPhone = '55' + rawPhone;
    }

    const mensagem = encodeURIComponent(
      `Olá ${appointment.nome_cliente}! Tudo bem? 🌿\nConfirmamos seu horário na *Clínica Bem-Estar* para *${appointment.procedimento}* hoje às *${appointment.horario_atendimento}* (${appointment.sala || 'Sala 01'}).\nQualquer dúvida estamos à disposição!`
    );

    return `https://wa.me/${rawPhone}?text=${mensagem}`;
  };

  const getInitials = (name) => {
    if (!name) return 'CB';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div
      className={`bg-white dark:bg-surface-darkCard p-4 lg:p-5 rounded-2xl border transition-all duration-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isConcluido
          ? 'border-emerald-200/60 dark:border-emerald-800/40 bg-emerald-50/20 dark:bg-emerald-950/10 opacity-85'
          : isPacote
          ? 'border-l-4 border-l-secondary-gold border-y-outlineVariant/30 dark:border-y-surface-darkBorder border-r-outlineVariant/30 dark:border-r-surface-darkBorder hover:border-primary/40'
          : 'border-outlineVariant/30 dark:border-surface-darkBorder hover:border-primary/40'
      }`}
    >
      {/* 1. Coluna de Horário e Status */}
      <div className="w-full md:w-36 flex md:flex-col justify-between items-baseline md:items-start shrink-0 border-b md:border-b-0 md:border-r border-outlineVariant/20 dark:border-surface-darkBorder pb-2 md:pb-0 md:pr-4">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-primary dark:text-primary-dark" />
          <span className="font-serif-display text-lg font-bold text-onSurface dark:text-gray-100">
            {appointment.horario_atendimento}
          </span>
        </div>
        <span className="text-[11px] font-medium text-outline dark:text-gray-400">
          {appointment.duracao_minutos || 60} minutos
        </span>
        <div className="mt-1">
          {isConcluido ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Concluído
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/30 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Agendado
            </span>
          )}
        </div>
      </div>

      {/* 2. Coluna de Dados da Cliente e Procedimento */}
      <div className="flex-1 flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-dark font-bold text-sm flex items-center justify-center shrink-0 border border-primary/20">
          {getInitials(appointment.nome_cliente)}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-serif-display text-base lg:text-lg font-bold text-onSurface dark:text-gray-100">
              {appointment.nome_cliente}
            </h3>

            {/* Tag de Pacote vs Avulso */}
            {isPacote ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed/50 dark:bg-secondary-fixed/20 text-secondary dark:text-secondary-fixed font-bold text-xs border border-secondary-gold/30">
                <Award className="w-3.5 h-3.5 text-secondary dark:text-secondary-fixed" />
                Pacote: Sessão {appointment.sessao_atual}/{appointment.quantidade_sessoes}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container dark:bg-surface-darkCardHigh text-outline dark:text-gray-400 font-semibold text-xs">
                Atendimento Avulso
              </span>
            )}

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container dark:bg-surface-darkCardHigh text-primary dark:text-primary-dark font-medium text-xs">
              <MapPin className="w-3 h-3" />
              {appointment.sala || 'Sala 01'}
            </span>
          </div>

          <p className="text-sm text-outline dark:text-gray-400 font-medium">
            {appointment.procedimento}
          </p>

          {appointment.observacoes && (
            <p className="text-xs text-outline/80 dark:text-gray-400 italic line-clamp-1">
              Obs: {appointment.observacoes}
            </p>
          )}
        </div>
      </div>

      {/* 3. Ações Rápidas (Concluir, WhatsApp, Avançar Sessão, Excluir) */}
      <div className="flex items-center gap-2 self-end md:self-center flex-wrap shrink-0">
        
        {/* Avançar Sessão do Pacote se aplicável */}
        {isPacote && !isConcluido && (
          <button
            onClick={() => onAdvanceSession(appointment)}
            className="px-2.5 py-1.5 rounded-xl border border-secondary-gold/40 text-secondary dark:text-secondary-fixed hover:bg-secondary-fixed/30 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Avançar uma sessão realizada do pacote"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+1 Sessão</span>
          </button>
        )}

        {/* Botão de Concluir / Reabrir */}
        <button
          onClick={() => onToggleStatus(appointment)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs ${
            isConcluido
              ? 'bg-gray-100 dark:bg-surface-darkCardHigh hover:bg-gray-200 text-gray-700 dark:text-gray-300'
              : 'bg-primary dark:bg-primary-dark hover:bg-primary-container text-white'
          }`}
          title={isConcluido ? 'Reabrir agendamento' : 'Marcar como concluído'}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isConcluido ? 'Reabrir' : 'Concluir'}</span>
        </button>

        {/* Botão WhatsApp */}
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-xl border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
          title="Enviar confirmação e lembrete pelo WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>WhatsApp</span>
        </a>

        {/* Botão Excluir */}
        <button
          onClick={() => onDelete(appointment.id)}
          className="p-1.5 rounded-xl text-outline dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          title="Excluir agendamento"
        >
          <Trash2 className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
