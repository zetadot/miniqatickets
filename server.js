const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const dataDir = path.join(__dirname, 'data');
const ticketsFile = path.join(dataDir, 'tickets.json');
const usersFile = path.join(dataDir, 'users.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function enrichTicket(ticket) {
  const users = readJson(usersFile);
  const assignee = users.find(user => user.id === Number(ticket.assigneeId)) || null;
  return { ...ticket, assignee };
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'mini-qa-tickets', timestamp: new Date().toISOString() });
});

app.get('/api/users', (req, res) => {
  res.json(readJson(usersFile));
});

app.get('/api/tickets', (req, res) => {
  let tickets = readJson(ticketsFile);
  const { status, priority, project, q } = req.query;

  if (status) tickets = tickets.filter(ticket => ticket.status.toLowerCase() === status.toLowerCase());
  if (priority) tickets = tickets.filter(ticket => ticket.priority.toLowerCase() === priority.toLowerCase());
  if (project) tickets = tickets.filter(ticket => ticket.project.toLowerCase().includes(project.toLowerCase()));
  if (q) {
    const query = q.toLowerCase();
    tickets = tickets.filter(ticket =>
      ticket.title.toLowerCase().includes(query) ||
      ticket.description.toLowerCase().includes(query) ||
      ticket.project.toLowerCase().includes(query)
    );
  }

  res.json(tickets.map(enrichTicket));
});

app.get('/api/tickets/:id', (req, res) => {
  const tickets = readJson(ticketsFile);
  const ticket = tickets.find(item => item.id === Number(req.params.id));
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  res.json(enrichTicket(ticket));
});

app.post('/api/tickets', (req, res) => {
  const { title, description, status, priority, project, assigneeId } = req.body;

  if (!title || !description || !priority || !project || !assigneeId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const tickets = readJson(ticketsFile);
  const nextId = tickets.length ? Math.max(...tickets.map(ticket => ticket.id)) + 1 : 101;
  const newTicket = {
    id: nextId,
    title,
    description,
    status: status || 'Open',
    priority,
    project,
    assigneeId: Number(assigneeId),
    createdAt: new Date().toISOString().slice(0, 10)
  };

  tickets.push(newTicket);
  writeJson(ticketsFile, tickets);
  res.status(201).json(enrichTicket(newTicket));
});

app.patch('/api/tickets/:id', (req, res) => {
  const tickets = readJson(ticketsFile);
  const index = tickets.findIndex(item => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Ticket not found' });

  tickets[index] = { ...tickets[index], ...req.body, id: tickets[index].id };
  if (req.body.assigneeId) tickets[index].assigneeId = Number(req.body.assigneeId);
  writeJson(ticketsFile, tickets);
  res.json(enrichTicket(tickets[index]));
});

app.delete('/api/tickets/:id', (req, res) => {
  const tickets = readJson(ticketsFile);
  const exists = tickets.some(item => item.id === Number(req.params.id));
  if (!exists) return res.status(404).json({ error: 'Ticket not found' });

  const remainingTickets = tickets.filter(item => item.id !== Number(req.params.id));
  writeJson(ticketsFile, remainingTickets);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Mini QA Tickets running at http://localhost:${PORT}`);
});
