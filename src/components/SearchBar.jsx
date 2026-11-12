import React from 'react';
import { Search, Award, CheckCircle2, X } from 'lucide-react';

export default function SearchBar({
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
  viewMode = 'dia',
  onViewModeChange
}) {
  const filterOptions = [
    { id: 'todos', label: 'Todos os Agendamentos' },
    { id: 'pacotes', label: 'Pacotes & Planos', icon: Award },
    { id: 'avulso', label: 'Atendimento Avulso' },
    { id: 'concluido', label: 'Concluídos', icon: CheckCircle2 },
    { id: 'agendado', label: 'Pendentes' }
  ];

  return (
    <section className="bg-white dark:bg-surface-darkCard p-4 rounded-2xl border border-outlineVariant/30 dark:border-surface-darkBorder shadow-xs mb-6 space-y-3 transition-colors duration-200">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Campo de Busca em Tempo Real (RF03) */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline dark:text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por cliente, procedimento ou telefone..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-outlineVariant/50 dark:border-surface-darkBorder bg-white dark:bg-surface-darkCardHigh text-sm text-onSurface dark:text-gray-100 placeholder:text-outline/70 dark:placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline dark:text-gray-400 hover:text-onSurface dark:hover:text-gray-100 p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-surface-darkBorder"
              title="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Alternador de Visualização (Dia / Semana / Mês) Totalmente Funcional */}
        <div className="flex items-center bg-surface-container/70 dark:bg-surface-darkCardHigh p-1 rounded-xl border border-outlineVariant/30 dark:border-surface-darkBorder self-stretch md:self-auto justify-center">
          <button
            onClick={() => onViewModeChange && onViewModeChange('dia')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'dia'
                ? 'bg-white dark:bg-surface-darkCard text-primary dark:text-primary-dark shadow-xs'
                : 'text-outline dark:text-gray-400 hover:text-onSurface dark:hover:text-gray-200'
            }`}
          >
            Dia
          </button>
          <button
            onClick={() => onViewModeChange && onViewModeChange('semana')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'semana'
                ? 'bg-white dark:bg-surface-darkCard text-primary dark:text-primary-dark shadow-xs'
                : 'text-outline dark:text-gray-400 hover:text-onSurface dark:hover:text-gray-200'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => onViewModeChange && onViewModeChange('mes')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'mes'
                ? 'bg-white dark:bg-surface-darkCard text-primary dark:text-primary-dark shadow-xs'
                : 'text-outline dark:text-gray-400 hover:text-onSurface dark:hover:text-gray-200'
            }`}
          >
            Mês
          </button>
        </div>

      </div>

      {/* Pílulas de Filtros Rápidos */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs font-semibold">
        {filterOptions.map((f) => {
          const isActive = activeFilter === f.id;
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              className={`px-3.5 py-1.5 rounded-full shrink-0 flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-primary dark:bg-primary-dark text-white shadow-xs'
                  : 'bg-surface-container/80 dark:bg-surface-darkCardHigh text-outline dark:text-gray-300 hover:bg-surface-container-high dark:hover:bg-surface-darkBorder hover:text-onSurface dark:hover:text-white'
              }`}
            >
              {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-secondary-gold'}`} />}
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
