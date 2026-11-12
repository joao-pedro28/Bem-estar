# 🌿 Clínica Bem-Estar - Sistema de Agendamento (MVP)

MVP (Minimum Viable Product) desenvolvido com base na documentação técnica do projeto e no protótipo de alta fidelidade gerado no **Google Stitch** (*Design System Serene Sanctuary*).

---

## 🚀 Pilha Tecnológica (Tech Stack)

* **Frontend:**
  * **React 19:** Componentização reativa e modularizada.
  * **Tailwind CSS:** Estilização responsiva moderna com a paleta relaxante da clínica (Verde sálvia `#466150`, Areia/Linho `#F7F5F0`, Dourado `#C5A059`).
  * **Lucide React & Material Symbols:** Ícones para calendário, sessões, status e atalhos rápidos.
  * **Vite:** Ferramenta de build rápida com suporte a Hot Module Replacement (HMR).
* **Backend:**
  * **Node.js:** Ambiente de execução assíncrono.
  * **Express:** API REST estruturada para cadastro, busca, controle de status e pacotes.
* **Banco de Dados:**
  * **SQLite (`node:sqlite`):** Banco de dados relacional em arquivo local (`server/clinica.sqlite`), leve e confiável, sem necessidade de servidores externos.

---

## 🎯 Requisitos Implementados

* **RF01 - Calendário e Agendamentos do Dia:**
  * Linha do tempo das 08:00 às 18:00 com todos os atendimentos do dia.
  * Navegação interativa por datas (dia anterior, próximo dia e seletor rápido).
  * Indicação visual para intervalo de almoço e higienização das salas.
* **RF02 - Cadastro de Clientes e Controle de Pacotes:**
  * Modal interativo `+ Novo Agendamento` com validação de campos.
  * Checkbox/Interruptor de pacote de sessões com seleção de planos (5, 10 ou 15 sessões) e contagem da sessão atual.
  * Botão de ação rápida `+1 Sessão` no card para avançar sessões concluídas de um pacote.
* **RF03 - Filtro e Pesquisa em Tempo Real:**
  * Barra de busca rápida por nome da cliente, procedimento ou telefone.
  * Pílulas de filtro dinâmico: *Todos*, *Pacotes & Planos*, *Atendimento Avulso*, *Concluídos*, *Pendentes*.
* **RF04 - Responsividade (Desktop & Mobile):**
  * **Desktop:** Layout amplo de 2 colunas com barra lateral contendo mini-calendário mensal, resumo de salas e menu clínico.
  * **Mobile:** Barra de navegação inferior (Bottom Navigation) e Botão Flutuante (FAB) para agendamentos rápidos em celulares.
* **Ações Rápidas de Atendimento:**
  * **Concluir / Reabrir:** Atualiza o status em tempo real no banco SQLite.
  * **WhatsApp:** Link inteligente que abre conversa com a cliente já com mensagem formatada e horários preenchidos.
  * **Excluir:** Remoção segura de agendamentos.

---

## 🗄️ Modelagem do Banco (SQLite)

Tabela: `clientes_agendamentos`
| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Identificador único autoincremental |
| `nome_cliente` | TEXT | Nome completo da cliente |
| `telefone` | TEXT | WhatsApp/telefone para contato |
| `data_atendimento` | TEXT (YYYY-MM-DD) | Data marcada para a sessão |
| `horario_atendimento` | TEXT (HH:MM) | Horário de início do atendimento |
| `duracao_minutos` | INTEGER | Duração da sessão (padrão 60 min) |
| `procedimento` | TEXT | Tipo de massagem ou procedimento |
| `sala` | TEXT | Sala alocada (Sala 01 ou Sala 02) |
| `possui_pacote` | INTEGER (0 ou 1) | Booleano indicando se fechou pacote |
| `quantidade_sessoes` | INTEGER | Total de sessões do pacote contratado |
| `sessao_atual` | INTEGER | Número da sessão realizada |
| `status` | TEXT | `agendado`, `concluido` ou `cancelado` |
| `observacoes` | TEXT | Queixas clínicas ou preferências de aromaterapia |
| `criado_em` | DATETIME | Data e hora do registro |

---

## ⚡ Como Executar o MVP

### Opção 1: Executar Aplicação Completa (Produção / Demonstração)
Inicia o servidor Express que serve tanto a API quanto a interface React compilada:
```bash
npm start
```
Acesse no seu navegador: **`http://localhost:3001`**

### Opção 2: Modo de Desenvolvimento (Vite + HMR)
Em um terminal, inicie a API:
```bash
npm run server
```
Em outro terminal, inicie o frontend com Vite:
```bash
npm run dev
```
Acesse no seu navegador: **`http://localhost:3000`** (o Vite redireciona chamadas `/api` automaticamente para a porta 3001).

---

## 📁 Estrutura de Arquivos Criados

```
Bem_estar_clinica/
├── server/
│   ├── db.js                # Conexão SQLite e semeadura dos dados
│   ├── index.js             # API Express com rotas de agendamentos e métricas
│   └── clinica.sqlite       # Arquivo do banco de dados SQLite
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Cabeçalho com marca, data e botão + Novo
│   │   ├── StatsBar.jsx         # Cards de resumo diário (métricas do protótipo)
│   │   ├── SearchBar.jsx        # Busca em tempo real e filtros em pílulas
│   │   ├── CalendarView.jsx     # Linha do tempo diária e controle de datas
│   │   ├── AppointmentCard.jsx  # Card individual de atendimento com ações WhatsApp/Concluir
│   │   ├── AppointmentForm.jsx  # Modal de cadastro de cliente e pacote
│   │   ├── Sidebar.jsx          # Menu lateral com mini-calendário e aromaterapia
│   │   └── MobileNav.jsx        # Bottom Navigation e botão flutuante FAB para mobile
│   ├── App.jsx              # Gerenciador de estado global
│   └── main.jsx             # Ponto de entrada do React
├── dist/                    # Bundle de produção otimizado
├── index.html               # Template HTML com Tailwind e fontes Google
├── package.json             # Dependências e scripts
└── vite.config.js           # Configuração do Vite e proxy reverso
```
