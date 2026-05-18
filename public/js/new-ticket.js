const form = document.querySelector('#ticketForm');
const assigneeSelect = document.querySelector('#assigneeId');
const message = document.querySelector('#formMessage');

async function loadUsers() {
  const response = await fetch('/api/users');
  const users = await response.json();
  assigneeSelect.innerHTML = '<option value="">Select assignee</option>' + users.map(user => `
    <option value="${user.id}">${user.name} - ${user.role}</option>
  `).join('');
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  message.textContent = '';
  message.className = 'message full';

  const body = Object.fromEntries(new FormData(form).entries());
  const response = await fetch('/api/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const result = await response.json();
  if (!response.ok) {
    message.textContent = result.error || 'Ticket could not be created.';
    message.classList.add('error');
    return;
  }

  message.textContent = `Ticket ${result.id} created successfully.`;
  message.classList.add('success');
  form.reset();
  await loadUsers();
});

loadUsers();
