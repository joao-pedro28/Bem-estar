import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'clinica.sqlite');

const db = new DatabaseSync(dbPath);

// Criação da tabela conforme a documentação técnica
db.exec(`
  CREATE TABLE IF NOT EXISTS clientes_agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_cliente TEXT NOT NULL,
    telefone TEXT,
    data_atendimento TEXT NOT NULL,
    horario_atendimento TEXT NOT NULL,
    duracao_minutos INTEGER DEFAULT 60,
    procedimento TEXT NOT NULL,
    sala TEXT DEFAULT 'Sala 01',
    possui_pacote INTEGER DEFAULT 0,
    quantidade_sessoes INTEGER DEFAULT 0,
    sessao_atual INTEGER DEFAULT 1,
    status TEXT DEFAULT 'agendado',
    observacoes TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Função para verificar se a tabela está vazia e popular com dados do protótipo
export function seedInitialData() {
  const countRow = db.prepare('SELECT COUNT(*) as total FROM clientes_agendamentos').get();
  if (countRow.total === 0) {
    const today = new Date().toISOString().split('T')[0];

    const insert = db.prepare(`
      INSERT INTO clientes_agendamentos (
        nome_cliente, telefone, data_atendimento, horario_atendimento,
        duracao_minutos, procedimento, sala, possui_pacote, quantidade_sessoes,
        sessao_atual, status, observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialClients = [
      [
        'Rodrigo Souza',
        '71991234567',
        today,
        '08:00',
        60,
        'Massagem Desportiva & Liberação Miofascial',
        'Sala 01',
        0,
        0,
        0,
        'concluido',
        'Foco em lombar e panturrilhas pós-maratona.'
      ],
      [
        'Camila Duarte',
        '71998765432',
        today,
        '09:30',
        60,
        'Drenagem Linfática Método Exclusivo',
        'Sala 02',
        1,
        10,
        7,
        'agendado',
        'Retenção de líquidos pós-cirúrgica. Pacote fidelidade.'
      ],
      [
        'Juliana Mendes',
        '71987651234',
        today,
        '11:00',
        60,
        'Massagem Relaxante com Pedras Quentes',
        'Sala 01',
        1,
        5,
        3,
        'agendado',
        'Tensão cervical. Prefere óleo essencial de lavanda.'
      ],
      [
        'Maria Silva',
        '71993456789',
        today,
        '14:00',
        60,
        'Massagem Relaxante com Aromaterapia',
        'Sala 01',
        1,
        10,
        5,
        'agendado',
        'Próximo atendimento prioritário do dia. Difusor capim-limão.'
      ],
      [
        'Lucas Fernandes',
        '71992348765',
        today,
        '16:30',
        60,
        'Massoterapia Terapêutica Postural',
        'Sala 02',
        0,
        0,
        0,
        'agendado',
        'Correção postural e dores na cervical.'
      ]
    ];

    for (const client of initialClients) {
      insert.run(...client);
    }
    console.log(`[Banco de Dados] Dados iniciais do protótipo Stitch semeados com sucesso (${initialClients.length} atendimentos)!`);
  }
}

// Executa a semeadura inicial
seedInitialData();

export default db;
