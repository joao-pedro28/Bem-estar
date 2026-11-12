import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import db, { seedInitialData } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Semeia os dados iniciais do protótipo Stitch
seedInitialData();

// 1. Listar Agendamentos (com filtros e busca em tempo real)
app.get('/api/agendamentos', (req, res) => {
  try {
    const { data, data_inicio, data_fim, busca, filtro } = req.query;
    let query = 'SELECT * FROM clientes_agendamentos WHERE 1=1';
    const params = [];

    if (data_inicio && data_fim) {
      query += ' AND data_atendimento BETWEEN ? AND ?';
      params.push(data_inicio, data_fim);
    } else if (data) {
      query += ' AND data_atendimento = ?';
      params.push(data);
    }

    if (busca && busca.trim() !== '') {
      query += ' AND (nome_cliente LIKE ? OR procedimento LIKE ? OR telefone LIKE ?)';
      const term = `%${busca.trim()}%`;
      params.push(term, term, term);
    }

    if (filtro) {
      if (filtro === 'pacotes') {
        query += ' AND possui_pacote = 1';
      } else if (filtro === 'avulso') {
        query += ' AND possui_pacote = 0';
      } else if (filtro === 'concluido') {
        query += " AND status = 'concluido'";
      } else if (filtro === 'agendado') {
        query += " AND status = 'agendado'";
      }
    }

    query += ' ORDER BY data_atendimento ASC, horario_atendimento ASC';

    const stmt = db.prepare(query);
    const agendamentos = stmt.all(...params);

    res.json(agendamentos);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    res.status(500).json({ error: 'Erro interno ao consultar agendamentos' });
  }
});

// 2. Resumo de Métricas / Estatísticas do Dia (Cards do Topo)
app.get('/api/agendamentos/stats', (req, res) => {
  try {
    const targetDate = req.query.data || new Date().toISOString().split('T')[0];

    const totalHojeRow = db.prepare(
      'SELECT COUNT(*) as total FROM clientes_agendamentos WHERE data_atendimento = ?'
    ).get(targetDate);

    const concluidosHojeRow = db.prepare(
      'SELECT COUNT(*) as concluidos FROM clientes_agendamentos WHERE data_atendimento = ? AND status = ?'
    ).get(targetDate, 'concluido');

    const pacotesAtivosRow = db.prepare(
      'SELECT COUNT(*) as pacotes FROM clientes_agendamentos WHERE data_atendimento = ? AND possui_pacote = 1'
    ).get(targetDate);

    // Próximo atendimento agendado a partir do horário atual ou primeiro do dia
    const proximoRow = db.prepare(`
      SELECT * FROM clientes_agendamentos
      WHERE data_atendimento = ? AND status = 'agendado'
      ORDER BY horario_atendimento ASC
      LIMIT 1
    `).get(targetDate);

    // Total de slots estimados no dia útil (ex: 8 slots padrão das 08h às 18h)
    const totalSlots = 8;
    const agendados = totalHojeRow.total || 0;
    const horariosLivres = Math.max(0, totalSlots - agendados);

    res.json({
      data: targetDate,
      totalAtendimentos: agendados,
      concluidos: concluidosHojeRow.concluidos || 0,
      pacotesAtivos: pacotesAtivosRow.pacotes || 0,
      horariosLivres,
      proximoAtendimento: proximoRow || null
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno ao consultar métricas' });
  }
});

// 3. Cadastrar Novo Agendamento (RF02)
app.post('/api/agendamentos', (req, res) => {
  try {
    const {
      nome_cliente,
      telefone,
      data_atendimento,
      horario_atendimento,
      duracao_minutos = 60,
      procedimento,
      sala = 'Sala 01',
      possui_pacote = 0,
      quantidade_sessoes = 0,
      sessao_atual = 1,
      observacoes = ''
    } = req.body;

    if (!nome_cliente || !data_atendimento || !horario_atendimento || !procedimento) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes (nome, data, horário, procedimento)' });
    }

    const stmt = db.prepare(`
      INSERT INTO clientes_agendamentos (
        nome_cliente, telefone, data_atendimento, horario_atendimento,
        duracao_minutos, procedimento, sala, possui_pacote, quantidade_sessoes,
        sessao_atual, status, observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'agendado', ?)
    `);

    const result = stmt.run(
      nome_cliente.trim(),
      telefone ? telefone.trim() : '',
      data_atendimento,
      horario_atendimento,
      Number(duracao_minutos) || 60,
      procedimento.trim(),
      sala,
      possui_pacote ? 1 : 0,
      possui_pacote ? Number(quantidade_sessoes) || 10 : 0,
      possui_pacote ? Number(sessao_atual) || 1 : 1,
      observacoes ? observacoes.trim() : ''
    );

    const novoAgendamento = db.prepare('SELECT * FROM clientes_agendamentos WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(novoAgendamento);
  } catch (error) {
    console.error('Erro ao cadastrar agendamento:', error);
    res.status(500).json({ error: 'Erro ao salvar novo agendamento no banco de dados' });
  }
});

// 4. Alterar Status (Concluir / Cancelar / Reabrir)
app.patch('/api/agendamentos/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['agendado', 'concluido', 'cancelado'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const stmt = db.prepare('UPDATE clientes_agendamentos SET status = ? WHERE id = ?');
    stmt.run(status, id);

    const atualizado = db.prepare('SELECT * FROM clientes_agendamentos WHERE id = ?').get(id);
    if (!atualizado) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    res.json(atualizado);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar status' });
  }
});

// 5. Atualizar Sessão do Pacote (ex: Avançar de sessão 3 para 4)
app.patch('/api/agendamentos/:id/sessao', (req, res) => {
  try {
    const { id } = req.params;
    const { sessao_atual } = req.body;

    const stmt = db.prepare('UPDATE clientes_agendamentos SET sessao_atual = ? WHERE id = ?');
    stmt.run(Number(sessao_atual), id);

    const atualizado = db.prepare('SELECT * FROM clientes_agendamentos WHERE id = ?').get(id);
    res.json(atualizado);
  } catch (error) {
    console.error('Erro ao atualizar sessão do pacote:', error);
    res.status(500).json({ error: 'Erro ao atualizar sessão' });
  }
});

// 6. Excluir Agendamento
app.delete('/api/agendamentos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM clientes_agendamentos WHERE id = ?');
    stmt.run(id);
    res.json({ success: true, message: 'Agendamento removido com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    res.status(500).json({ error: 'Erro ao excluir agendamento' });
  }
});

// 7. Listagem de Pacientes e Prontuários (Agrupado por Cliente)
app.get('/api/pacientes', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT 
        nome_cliente,
        telefone,
        MAX(data_atendimento) as ultimo_atendimento,
        COUNT(id) as total_atendimentos,
        MAX(possui_pacote) as possui_pacote,
        MAX(quantidade_sessoes) as quantidade_sessoes,
        MAX(sessao_atual) as sessao_atual,
        GROUP_CONCAT(DISTINCT procedimento) as procedimentos,
        MAX(observacoes) as ultimas_observacoes
      FROM clientes_agendamentos
      GROUP BY nome_cliente
      ORDER BY ultimo_atendimento DESC
    `).all();

    res.json(rows);
  } catch (error) {
    console.error('Erro ao listar pacientes:', error);
    res.status(500).json({ error: 'Erro ao buscar pacientes' });
  }
});

// 8. Catálogo de Tratamentos & Protocolos
app.get('/api/tratamentos', (req, res) => {
  const tratamentos = [
    {
      id: 1,
      nome: 'Drenagem Linfática Método Exclusivo',
      categoria: 'Corporal & Pós-Operatório',
      duracao: '60 min',
      valorAvulso: 160,
      valorPacote10: 1300,
      indicacoes: 'Retenção hídrica, pós-cirúrgico, alívio de peso nas pernas, detox.',
      salaRecomendada: 'Sala 02',
      destaque: true
    },
    {
      id: 2,
      nome: 'Massagem Relaxante com Aromaterapia',
      categoria: 'Bem-Estar & Antiestresse',
      duracao: '60 min',
      valorAvulso: 150,
      valorPacote10: 1200,
      indicacoes: 'Alívio de ansiedade, estresse crônico, relaxamento muscular profundo com óleos essenciais.',
      salaRecomendada: 'Sala 01',
      destaque: true
    },
    {
      id: 3,
      nome: 'Massagem Desportiva & Liberação Miofascial',
      categoria: 'Terapêutica & Muscular',
      duracao: '60 min',
      valorAvulso: 180,
      valorPacote10: 1500,
      indicacoes: 'Contraturas musculares, atletas, nódulos de tensão, recuperação pós-treino.',
      salaRecomendada: 'Sala 01',
      destaque: false
    },
    {
      id: 4,
      nome: 'Massagem Relaxante com Pedras Quentes',
      categoria: 'Termoterapia & Relaxamento',
      duracao: '75 min',
      valorAvulso: 200,
      valorPacote10: 1700,
      indicacoes: 'Dores crônicas, circulação, relaxamento termoterapêutico profundo com pedras vulcânicas.',
      salaRecomendada: 'Sala 01',
      destaque: true
    },
    {
      id: 5,
      nome: 'Ventosaterapia & Terapia Integrativa',
      categoria: 'Integrativa & Circulatória',
      duracao: '50 min',
      valorAvulso: 140,
      valorPacote10: 1150,
      indicacoes: 'Liberação de toxinas, dores lombares, tensão nas costas e estagnação sanguínea.',
      salaRecomendada: 'Sala 02',
      destaque: false
    },
    {
      id: 6,
      nome: 'Massagem Modeladora Redutora',
      categoria: 'Estética & Contorno',
      duracao: '60 min',
      valorAvulso: 160,
      valorPacote10: 1350,
      indicacoes: 'Estímulo metabólico, oxigenação tecidual, contorno corporal localizado.',
      salaRecomendada: 'Sala 02',
      destaque: false
    }
  ];

  res.json(tratamentos);
});

// 9. Dados Financeiros & Repasses
app.get('/api/financeiro', (req, res) => {
  try {
    const totalConcluidos = db.prepare('SELECT COUNT(*) as c FROM clientes_agendamentos WHERE status = ?').get('concluido').c;
    const totalPacotes = db.prepare('SELECT COUNT(*) as c FROM clientes_agendamentos WHERE possui_pacote = 1').get().c;
    const totalAvulsos = db.prepare('SELECT COUNT(*) as c FROM clientes_agendamentos WHERE possui_pacote = 0').get().c;

    // Estimativas de faturamento baseadas nas sessões e pacotes
    const faturamentoEstimadoMes = (totalPacotes * 1250) + (totalAvulsos * 160);
    const faturamentoHoje = totalConcluidos * 160;

    const transacoesRecentes = [
      { id: 'TRX-101', cliente: 'Camila Duarte', descricao: 'Pacote Drenagem 10x', valor: 1300, metodo: 'PIX', data: 'Hoje' },
      { id: 'TRX-102', cliente: 'Juliana Mendes', descricao: 'Pacote Pedras Quentes 5x', valor: 850, metodo: 'Cartão de Crédito', data: 'Ontem' },
      { id: 'TRX-103', cliente: 'Rodrigo Souza', descricao: 'Sessão Avulsa Desportiva', valor: 180, metodo: 'PIX', data: 'Hoje' },
      { id: 'TRX-104', cliente: 'Maria Silva', descricao: 'Pacote Aromaterapia 10x', valor: 1200, metodo: 'Cartão 3x', data: '22/10' }
    ];

    res.json({
      faturamentoEstimadoMes,
      faturamentoHoje,
      totalPacotesVendidos: totalPacotes,
      totalSessoesAvulsas: totalAvulsos,
      ticketMedio: 195,
      transacoesRecentes
    });
  } catch (error) {
    console.error('Erro ao calcular financeiro:', error);
    res.status(500).json({ error: 'Erro ao calcular financeiro' });
  }
});

// Servir frontend compilado em produção se o diretório dist existir
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n🌿 [Clínica Bem-Estar API] Servidor Express ativo na porta ${PORT}`);
  console.log(`🔗 Teste da API: http://localhost:${PORT}/api/agendamentos\n`);
});
