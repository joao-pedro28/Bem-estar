import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, Award, CheckCircle2, MapPin, AlignLeft } from 'lucide-react';

export default function AppointmentForm({ isOpen, onClose, onSave, defaultDate, defaultTime, initialData }) {
  const [nomeCliente, setNomeCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataAtendimento, setDataAtendimento] = useState('');
  const [horarioAtendimento, setHorarioAtendimento] = useState('09:00');
  const [duracaoMinutos, setDuracaoMinutos] = useState(60);
  const [procedimento, setProcedimento] = useState('Drenagem Linfática Método Exclusivo');
  const [sala, setSala] = useState('Sala 01');
  const [possuiPacote, setPossuiPacote] = useState(false);
  const [quantidadeSessoes, setQuantidadeSessoes] = useState(10);
  const [sessaoAtual, setSessaoAtual] = useState(1);
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDataAtendimento(defaultDate || new Date().toISOString().split('T')[0]);
      if (defaultTime) setHorarioAtendimento(defaultTime);
      if (initialData?.nomeCliente) setNomeCliente(initialData.nomeCliente);
      if (initialData?.telefone) setTelefone(initialData.telefone);
      if (initialData?.procedimento) setProcedimento(initialData.procedimento);
    }
  }, [isOpen, defaultDate, defaultTime, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomeCliente.trim()) {
      alert('Por favor, informe o nome da cliente.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        nome_cliente: nomeCliente,
        telefone,
        data_atendimento: dataAtendimento,
        horario_atendimento: horarioAtendimento,
        duracao_minutos: duracaoMinutos,
        procedimento,
        sala,
        possui_pacote: possuiPacote ? 1 : 0,
        quantidade_sessoes: possuiPacote ? quantidadeSessoes : 0,
        sessao_atual: possuiPacote ? sessaoAtual : 1,
        observacoes
      });

      // Limpa campos
      setNomeCliente('');
      setTelefone('');
      setObservacoes('');
      setPossuiPacote(false);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar agendamento.');
    } finally {
      setLoading(false);
    }
  };

  const procedimentosComuns = [
    'Drenagem Linfática Método Exclusivo',
    'Massagem Relaxante com Aromaterapia',
    'Massagem Desportiva & Liberação Miofascial',
    'Massagem com Pedras Quentes',
    'Ventosaterapia & Terapia Integrativa',
    'Massagem Modeladora Redutora',
    'Quick Massage Relaxante'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-surface-darkCard w-full max-w-xl rounded-3xl shadow-2xl border border-outlineVariant/30 dark:border-surface-darkBorder overflow-hidden flex flex-col max-h-[92vh] transition-colors duration-200">
        
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-surface-container to-white dark:from-surface-darkCardHigh dark:to-surface-darkCard border-b border-outlineVariant/30 dark:border-surface-darkBorder flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary dark:bg-primary-dark text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[22px]">calendar_add_on</span>
            </div>
            <div>
              <h2 className="font-serif-display text-lg lg:text-xl font-bold text-onSurface dark:text-gray-100">
                Novo Agendamento &amp; Sessão
              </h2>
              <p className="text-xs text-outline dark:text-gray-400 font-medium">
                Clínica Bem-Estar • Massoterapia &amp; Estética
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-outline dark:text-gray-400 hover:text-onSurface dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-surface-darkCardHigh transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-onSurface dark:text-gray-200">
          
          {/* Nome da Cliente (RF02) */}
          <div>
            <label className="block text-xs font-bold text-onSurface dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Nome Completo da Cliente *
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline dark:text-gray-400" />
              <input
                type="text"
                required
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                placeholder="Ex: Camila Duarte"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outlineVariant/50 dark:border-surface-darkBorder bg-white dark:bg-surface-darkCardHigh text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary text-onSurface dark:text-gray-100"
              />
            </div>
          </div>

          {/* Telefone / WhatsApp */}
          <div>
            <label className="block text-xs font-bold text-onSurface dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Telefone / WhatsApp (Para confirmação)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline dark:text-gray-400" />
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="Ex: (71) 99876-5432"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outlineVariant/50 dark:border-surface-darkBorder bg-white dark:bg-surface-darkCardHigh text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary text-onSurface dark:text-gray-100"
              />
            </div>
          </div>

          {/* Procedimento / Massagem */}
          <div>
            <label className="block text-xs font-bold text-onSurface dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Procedimento / Tratamento *
            </label>
            <select
              value={procedimento}
              onChange={(e) => setProcedimento(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-outlineVariant/50 dark:border-surface-darkBorder text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-surface-darkCardHigh text-onSurface dark:text-gray-100"
            >
              {procedimentosComuns.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Data, Horário e Sala (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-onSurface dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Data *
              </label>
              <input
                type="date"
                required
                value={dataAtendimento}
                onChange={(e) => setDataAtendimento(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-outlineVariant/50 dark:border-surface-darkBorder text-xs font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-surface-darkCardHigh text-onSurface dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-onSurface dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Horário *
              </label>
              <input
                type="time"
                required
                value={horarioAtendimento}
                onChange={(e) => setHorarioAtendimento(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-outlineVariant/50 dark:border-surface-darkBorder text-xs font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-surface-darkCardHigh text-onSurface dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-onSurface dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Sala
              </label>
              <select
                value={sala}
                onChange={(e) => setSala(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-outlineVariant/50 dark:border-surface-darkBorder text-xs font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-surface-darkCardHigh text-onSurface dark:text-gray-100"
              >
                <option value="Sala 01">Sala 01 (Térreo)</option>
                <option value="Sala 02">Sala 02 (Superior)</option>
              </select>
            </div>
          </div>

          {/* Seção Destaque: Controle de Pacotes (RF02) */}
          <div className="p-4 rounded-2xl bg-secondary-fixed/30 dark:bg-secondary-fixed/10 border border-secondary-gold/40 dark:border-secondary-gold/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-secondary dark:text-secondary-fixed" />
                <div>
                  <span className="text-xs font-bold text-secondary dark:text-secondary-fixed uppercase tracking-wider block">
                    Controle de Pacotes
                  </span>
                  <span className="text-[11px] text-outline dark:text-gray-400 font-medium">
                    A cliente fechou um pacote de sessões?
                  </span>
                </div>
              </div>

              {/* Switch / Checkbox */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={possuiPacote}
                  onChange={(e) => setPossuiPacote(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-gold"></div>
              </label>
            </div>

            {/* Campos Condicionais do Pacote */}
            {possuiPacote && (
              <div className="pt-2 border-t border-secondary-gold/20 grid grid-cols-2 gap-3 animate-fadeIn">
                <div>
                  <label className="block text-xs font-bold text-secondary dark:text-secondary-fixed mb-1">
                    Total de Sessões:
                  </label>
                  <select
                    value={quantidadeSessoes}
                    onChange={(e) => setQuantidadeSessoes(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-secondary-gold/50 bg-white dark:bg-surface-darkCardHigh text-xs font-bold text-secondary dark:text-secondary-fixed focus:ring-2 focus:ring-secondary/30"
                  >
                    <option value={5}>5 Sessões (Plano Starter)</option>
                    <option value={10}>10 Sessões (Plano Completo)</option>
                    <option value={15}>15 Sessões (Plano Prime)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-secondary dark:text-secondary-fixed mb-1">
                    Sessão Atual de Hoje:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={quantidadeSessoes}
                    value={sessaoAtual}
                    onChange={(e) => setSessaoAtual(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-secondary-gold/50 bg-white dark:bg-surface-darkCardHigh text-xs font-bold text-secondary dark:text-secondary-fixed focus:ring-2 focus:ring-secondary/30"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Observações Clínicas / Queixas */}
          <div>
            <label className="block text-xs font-bold text-onSurface dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5" />
              Observações / Foco do Atendimento
            </label>
            <textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Tensão na cervical, prefere óleo essencial de lavanda, retenção de líquido..."
              className="w-full px-3.5 py-2 rounded-xl border border-outlineVariant/50 dark:border-surface-darkBorder bg-white dark:bg-surface-darkCardHigh text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none text-onSurface dark:text-gray-100"
            ></textarea>
          </div>

          {/* Botões do Rodapé */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-outlineVariant/60 dark:border-surface-darkBorder text-outline dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-surface-darkCardHigh text-xs font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-primary dark:bg-primary-dark hover:bg-primary-container text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Salvando...' : 'Confirmar Agendamento'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
