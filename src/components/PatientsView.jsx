import React, { useState, useEffect } from 'react';
import { User, Phone, Award, MessageCircle, Calendar, FileText, Search, UserPlus } from 'lucide-react';

export default function PatientsView({ onOpenModalWithPatient }) {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pacientes')
      .then((res) => res.json())
      .then((data) => {
        setPatients(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = patients.filter((p) =>
    p.nome_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.telefone && p.telefone.includes(searchTerm))
  );

  const getWhatsAppLink = (nome, telefone) => {
    let raw = (telefone || '').replace(/\D/g, '');
    if (!raw) raw = '71999999999';
    if (!raw.startsWith('55') && raw.length <= 11) raw = '55' + raw;
    const msg = encodeURIComponent(`Olá ${nome}! Aqui é da Clínica Bem-Estar 🌿 Como você está se sentindo após as últimas sessões?`);
    return `https://wa.me/${raw}?text=${msg}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Topo da Seção de Pacientes */}
      <div className="bg-white dark:bg-surface-darkCard p-5 rounded-2xl border border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-display text-xl lg:text-2xl font-bold text-onSurface dark:text-gray-100">
            Pacientes &amp; Prontuários
          </h2>
          <p className="text-xs text-outline dark:text-gray-400 font-medium">
            Histórico clínico, fichas de acompanhamento e pacotes contratados
          </p>
        </div>

        {/* Busca de Pacientes */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline dark:text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou WhatsApp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-outlineVariant/40 dark:border-surface-darkBorder bg-white dark:bg-surface-darkCardHigh text-xs font-medium text-onSurface dark:text-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Grid de Pacientes */}
      {loading ? (
        <div className="p-12 text-center text-xs text-outline">Carregando prontuários...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-surface-darkCard p-12 rounded-2xl border border-dashed border-outlineVariant/40 text-center text-xs text-outline">
          Nenhum paciente encontrado para os termos pesquisados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((patient, index) => {
            const hasPackage = patient.possui_pacote === 1;

            return (
              <div
                key={index}
                className="bg-white dark:bg-surface-darkCard p-5 rounded-2xl border border-outlineVariant/30 dark:border-surface-darkBorder hover:border-primary/40 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-dark font-bold text-base flex items-center justify-center shrink-0 border border-primary/20">
                        {patient.nome_cliente.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-serif-display text-base font-bold text-onSurface dark:text-gray-100">
                          {patient.nome_cliente}
                        </h3>
                        <p className="text-xs text-outline dark:text-gray-400 font-medium flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {patient.telefone || 'Telefone não informado'}
                        </p>
                      </div>
                    </div>

                    {hasPackage ? (
                      <span className="px-2.5 py-1 rounded-full bg-secondary-fixed/50 dark:bg-secondary-fixed/20 text-secondary dark:text-secondary-fixed text-xs font-bold flex items-center gap-1 shrink-0">
                        <Award className="w-3.5 h-3.5" />
                        Pacote Ativo
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-surface-container dark:bg-surface-darkCardHigh text-outline dark:text-gray-400 text-xs font-medium shrink-0">
                        Avulso
                      </span>
                    )}
                  </div>

                  {/* Informações de Tratamento e Sessões */}
                  <div className="mt-4 pt-3 border-t border-outlineVariant/20 dark:border-surface-darkBorder space-y-2 text-xs">
                    <div className="flex items-center justify-between text-outline dark:text-gray-400">
                      <span>Total de atendimentos:</span>
                      <span className="font-bold text-onSurface dark:text-gray-200">{patient.total_atendimentos} sessões</span>
                    </div>

                    {hasPackage && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between font-semibold text-secondary-gold">
                          <span>Progresso do Pacote:</span>
                          <span>{patient.sessao_atual} de {patient.quantidade_sessoes}</span>
                        </div>
                        <div className="w-full bg-surface-container dark:bg-surface-darkCardHigh h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-secondary-gold h-full rounded-full"
                            style={{ width: `${Math.round((patient.sessao_atual / patient.quantidade_sessoes) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {patient.ultimas_observacoes && (
                      <div className="p-2.5 rounded-xl bg-surface-container/50 dark:bg-surface-darkCardHigh/50 border border-outlineVariant/20 dark:border-surface-darkBorder text-[11px] text-outline dark:text-gray-300">
                        <span className="font-bold text-primary dark:text-primary-dark block mb-0.5 flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Anotação Clínica / Queixa:
                        </span>
                        {patient.ultimas_observacoes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Ações do Paciente */}
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-outlineVariant/20 dark:border-surface-darkBorder">
                  <a
                    href={getWhatsAppLink(patient.nome_cliente, patient.telefone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => onOpenModalWithPatient(patient.nome_cliente, patient.telefone)}
                    className="px-3 py-1.5 rounded-xl bg-primary dark:bg-primary-dark hover:bg-primary-container text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Agendar Sessão</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
