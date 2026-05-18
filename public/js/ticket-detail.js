const detail = document.querySelector('#ticketDetail');
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function loadTicket() {
  if (!id) {
    detail.innerHTML = '<p class="message error">Missing ticket id.</p>';
    return;
  }

  const response = await fetch(`/api/tickets/${id}`);
  if (!response.ok) {
    detail.innerHTML = '<p class="message error" data-testid="not-found">Ticket not found.</p>';
    return;
  }

  const ticket = await response.json();
  detail.innerHTML = `
    <div class="detail-header">
      <div>
        <h1 data-testid="detail-title">${ticket.title}</h1>
        <p class="ticket-meta" data-testid="detail-project">${ticket.project} · Created ${ticket.createdAt}</p>
      </div>
      <div class="badges">
        <span class="badge" data-testid="detail-status">${ticket.status}</span>
        <span class="badge ${ticket.priority.toLowerCase()}" data-testid="detail-priority">${ticket.priority}</span>
      </div>
    </div>
    <p data-testid="detail-description">${ticket.description}</p>
    <section class="assignee" data-testid="detail-assignee">
      <img src="${ticket.assignee?.avatar || '/images/avatar-ana.svg'}" alt="Assignee avatar" />
      <div>
        <strong>${ticket.assignee?.name || 'Unassigned'}</strong><br />
        <span class="ticket-meta">${ticket.assignee?.role || ''}</span>
      </div>
    </section>
    <p style="margin-top: 24px;">
      <a class="button secondary" href="/tickets.html">Back to tickets</a>
    </p>
  `;
}

loadTicket();
