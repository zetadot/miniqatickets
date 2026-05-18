const ticketList = document.querySelector('#ticketList');
const searchInput = document.querySelector('#searchInput');
const statusFilter = document.querySelector('#statusFilter');
const priorityFilter = document.querySelector('#priorityFilter');
const clearFilters = document.querySelector('#clearFilters');
const ticketFeedback = document.querySelector('#ticketFeedback');

function priorityClass(priority) {
  return priority.toLowerCase();
}

function renderTickets(tickets) {
  if (!tickets.length) {
    ticketList.innerHTML = '<p data-testid="empty-state">No tickets found.</p>';
    return;
  }

  ticketList.innerHTML = tickets.map(ticket => `
    <article class="card ticket-card" data-testid="ticket-card" data-ticket-id="${ticket.id}">
      <div>
        <h3>${ticket.title}</h3>
        <p class="ticket-meta">${ticket.project} · Assigned to ${ticket.assignee?.name || 'Unassigned'} · Created ${ticket.createdAt}</p>
        <p>${ticket.description}</p>
        <div class="badges">
          <span class="badge" data-testid="ticket-status">${ticket.status}</span>
          <span class="badge ${priorityClass(ticket.priority)}" data-testid="ticket-priority">${ticket.priority}</span>
        </div>
      </div>
      <div class="ticket-actions">
        <a class="button secondary" data-testid="view-ticket-${ticket.id}" href="/ticket-detail.html?id=${ticket.id}">View</a>
        <button class="button danger delete-ticket-button" type="button" data-testid="delete-ticket-${ticket.id}" data-ticket-id="${ticket.id}">Delete</button>
      </div>
    </article>
  `).join('');
}


function showTicketFeedback(message, type = 'success') {
  ticketFeedback.textContent = message;
  ticketFeedback.className = `message ${type}`;
}

async function deleteTicket(ticketId) {
  const response = await fetch(`/api/tickets/${ticketId}`, { method: 'DELETE' });

  if (!response.ok) {
    showTicketFeedback('The ticket could not be deleted.', 'error');
    return;
  }

  showTicketFeedback(`Ticket ${ticketId} deleted successfully.`);
  await loadTickets();
}

async function loadTickets() {
  const params = new URLSearchParams();
  if (searchInput.value.trim()) params.set('q', searchInput.value.trim());
  if (statusFilter.value) params.set('status', statusFilter.value);
  if (priorityFilter.value) params.set('priority', priorityFilter.value);

  const response = await fetch(`/api/tickets?${params.toString()}`);
  const tickets = await response.json();
  renderTickets(tickets);
}

[searchInput, statusFilter, priorityFilter].forEach(element => {
  element.addEventListener('input', loadTickets);
  element.addEventListener('change', loadTickets);
});

ticketList.addEventListener('click', async event => {
  const deleteButton = event.target.closest('.delete-ticket-button');
  if (!deleteButton) return;

  await deleteTicket(deleteButton.dataset.ticketId);
});

clearFilters.addEventListener('click', () => {
  searchInput.value = '';
  statusFilter.value = '';
  priorityFilter.value = '';
  loadTickets();
});

loadTickets();
