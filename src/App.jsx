import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import SearchBar from './components/SearchBar';
import CalendarView from './components/CalendarView';
import WeekView from './components/WeekView';
import MonthView from './components/MonthView';
import AppointmentForm from './components/AppointmentForm';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import PatientsView from './components/PatientsView';
import TreatmentsView from './components/TreatmentsView';
import PackagesView from './components/PackagesView';
import FinanceView from './components/FinanceView';

export default function App() {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('todos');
  const [viewMode, setViewMode] = useState('dia'); // 'dia', 'semana', 'mes'
  const [agendamentos, setAgendamentos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSlot, setModalSlot] = useState('');
  const [modalInitialData, setModalInitialData] = useState(null);
  
  // Controle de Abas e Funcionalidades
  const [currentTab, setCurrentTab] = useState('agenda');

  // Modo Escuro / Claro
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return (
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  // Atualiza classe no <html> quando o tema muda
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 1. Carrega Agendamentos da API com filtros e modo de visualização (Dia, Semana, Mês)
  const loadAgendamentos = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (viewMode === 'dia') {
        if (selectedDate) params.append('data', selectedDate);
      } else if (viewMode === 'semana') {
        // Intervalo da semana (segunda a domingo)
        const curr = new Date(selectedDate + 'T12:00:00');
        const dayOfWeek = curr.getDay();
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(curr);
        monday.setDate(curr.getDate() + diffToMonday);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        params.append('data_inicio', monday.toISOString().split('T')[0]);
        params.append('data_fim', sunday.toISOString().split('T')[0]);
      } else if (viewMode === 'mes') {
        // Intervalo do mês completo
        const [y, m] = selectedDate.split('-').map(Number);
        const daysInM = new Date(y, m, 0).getDate();
        const monthStart = `${y}-${String(m).padStart(2, '0')}-01`;
        const monthEnd = `${y}-${String(m).padStart(2, '0')}-${String(daysInM).padStart(2, '0')}`;

        params.append('data_inicio', monthStart);
        params.append('data_fim', monthEnd);
      }

      if (searchTerm && searchTerm.trim() !== '') params.append('busca', searchTerm.trim());
      if (activeFilter && activeFilter !== 'todos') params.append('filtro', activeFilter);

      const res = await fetch(`/api/agendamentos?${params.toString()}`);
      if (!res.ok) throw new Error('Falha ao buscar agendamentos');
      const data = await res.json();
      setAgendamentos(data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, viewMode, searchTerm, activeFilter]);

  // 2. Carrega Estatísticas do Dia
  const loadStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/agendamentos/stats?data=${selectedDate}`);
      if (!res.ok) throw new Error('Falha ao buscar estatísticas');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadAgendamentos();
    loadStats();
  }, [loadAgendamentos, loadStats]);

  // Criar Novo Agendamento (RF02)
  const handleSaveAppointment = async (formData) => {
    const res = await fetch('/api/agendamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!res.ok) {
      throw new Error('Erro ao salvar agendamento');
    }

    // Recarrega lista e métricas
    await loadAgendamentos();
    await loadStats();
  };

  // Alternar Status: Concluir / Reabrir
  const handleToggleStatus = async (appointment) => {
    const nextStatus = appointment.status === 'concluido' ? 'agendado' : 'concluido';
    try {
      const res = await fetch(`/api/agendamentos/${appointment.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });

      if (!res.ok) throw new Error('Erro ao atualizar status');
      await loadAgendamentos();
      await loadStats();
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar status do atendimento.');
    }
  };

  // Avançar Sessão do Pacote
  const handleAdvanceSession = async (appointment) => {
    if (appointment.sessao_atual >= appointment.quantidade_sessoes) {
      alert(`O pacote de ${appointment.quantidade_sessoes} sessões já foi totalmente concluído!`);
      return;
    }

    try {
      const res = await fetch(`/api/agendamentos/${appointment.id}/sessao`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessao_atual: appointment.sessao_atual + 1 })
      });

      if (!res.ok) throw new Error('Erro ao avançar sessão');
      await loadAgendamentos();
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar sessão do pacote.');
    }
  };

  // Excluir Agendamento
  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Tem certeza que deseja cancelar e remover este agendamento?')) {
      return;
    }

    try {
      const res = await fetch(`/api/agendamentos/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Erro ao excluir');
      await loadAgendamentos();
      await loadStats();
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir agendamento.');
    }
  };

  const handleOpenModal = (timeSlot = '', initial = null, specificDate = null) => {
    setModalSlot(timeSlot);
    setModalInitialData(initial);
    if (specificDate) setSelectedDate(specificDate);
    setIsModalOpen(true);
  };

  // Atalhos para agendamento vindo de outras abas
  const handleOpenWithPatient = (nome, telefone) => {
    handleOpenModal('', { nomeCliente: nome, telefone });
  };

  const handleOpenWithTreatment = (procedimentoNome) => {
    handleOpenModal('', { procedimento: procedimentoNome });
  };

  return (
    <div className="min-h-screen bg-surface-low dark:bg-surface-darkBg flex flex-col font-sans pb-16 lg:pb-0 transition-colors duration-200">
      
      {/* 1. Header do Sistema com Botão Corrigido e Modo Escuro/Claro */}
      <Header
        onOpenModal={() => handleOpenModal()}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* 2. Conteúdo Principal: Sidebar Fixa + Painel Dinâmico */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto items-start">
        
        {/* Barra Lateral Fixa (Sticky) com Mini-Calendário */}
        <Sidebar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onOpenModal={() => handleOpenModal()}
          currentTab={currentTab}
          onTabChange={setCurrentTab}
        />

        {/* Área de Conteúdo Conforme a Aba Selecionada */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto w-full min-w-0">
          
          {/* Aba 1: Agenda Clínica (com visualização Dia / Semana / Mês) */}
          {currentTab === 'agenda' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Linha de Métricas Rápidas */}
              <StatsBar stats={stats} />

              {/* Barra de Pesquisa, Filtros e Alternador Dia/Semana/Mês */}
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />

              {/* Visão de Dia */}
              {viewMode === 'dia' && (
                <CalendarView
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  agendamentos={agendamentos}
                  onOpenModal={handleOpenModal}
                  onToggleStatus={handleToggleStatus}
                  onAdvanceSession={handleAdvanceSession}
                  onDelete={handleDeleteAppointment}
                />
              )}

              {/* Visão de Semana */}
              {viewMode === 'semana' && (
                <WeekView
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  agendamentos={agendamentos}
                  onOpenModal={handleOpenModal}
                  onSelectDay={(dayStr) => {
                    setSelectedDate(dayStr);
                    setViewMode('dia');
                  }}
                />
              )}

              {/* Visão de Mês */}
              {viewMode === 'mes' && (
                <MonthView
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  agendamentos={agendamentos}
                  onOpenModal={handleOpenModal}
                  onSelectDay={(dayStr) => {
                    setSelectedDate(dayStr);
                    setViewMode('dia');
                  }}
                />
              )}
            </div>
          )}

          {/* Aba 2: Pacientes & Prontuários */}
          {currentTab === 'pacientes' && (
            <div className="animate-fadeIn">
              <PatientsView onOpenModalWithPatient={handleOpenWithPatient} />
            </div>
          )}

          {/* Aba 3: Tratamentos & Protocolos */}
          {currentTab === 'tratamentos' && (
            <div className="animate-fadeIn">
              <TreatmentsView onSelectTreatmentToBook={handleOpenWithTreatment} />
            </div>
          )}

          {/* Aba 4: Pacotes & Sessões */}
          {currentTab === 'pacotes' && (
            <div className="animate-fadeIn">
              <PackagesView
                onAdvanceSession={handleAdvanceSession}
                onOpenModal={() => handleOpenModal()}
              />
            </div>
          )}

          {/* Aba 5: Financeiro & Repasses */}
          {currentTab === 'financeiro' && (
            <div className="animate-fadeIn">
              <FinanceView />
            </div>
          )}

        </main>

      </div>

      {/* 3. Modal de Cadastro de Agendamento (RF02) */}
      <AppointmentForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalInitialData(null);
        }}
        onSave={handleSaveAppointment}
        defaultDate={selectedDate}
        defaultTime={modalSlot}
        initialData={modalInitialData}
      />

      {/* 4. Navegação Mobile e FAB (RF04) */}
      <MobileNav
        onOpenModal={() => handleOpenModal()}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />

    </div>
  );
}
