import React from 'react';
import { Calendar, Users, Award, DollarSign, Plus } from 'lucide-react';

export default function MobileNav({ onOpenModal, currentTab, onTabChange }) {
  const tabs = [
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'pacientes', label: 'Pacientes', icon: Users },
    { id: 'pacotes', label: 'Pacotes', icon: Award },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign }
  ];

  return (
    <>
      {/* Botão de Ação Flutuante (FAB) Mobile */}
      <div className="lg:hidden fixed bottom-20 right-5 z-40">
        <button
          onClick={() => onOpenModal()}
          className="w-14 h-14 rounded-full bg-primary dark:bg-primary-dark hover:bg-primary-container text-white shadow-xl flex items-center justify-center active:scale-95 transition-all ring-4 ring-primary-light dark:ring-surface-darkCard"
          title="Novo Agendamento"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Barra de Navegação Inferior Fixa */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-surface-darkCard border-t border-outlineVariant/30 dark:border-surface-darkBorder px-6 py-2.5 flex items-center justify-between shadow-lg transition-colors duration-200">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = currentTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`flex flex-col items-center gap-1 text-[10px] transition-colors ${
                isActive
                  ? 'text-primary dark:text-primary-dark font-bold'
                  : 'text-outline dark:text-gray-400 hover:text-onSurface dark:hover:text-gray-200 font-medium'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
