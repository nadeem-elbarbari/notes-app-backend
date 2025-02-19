import { req, validateToken } from "./auth.js";

// Redirect to login if no token and on dashboard page
const token = localStorage.getItem('token');
const isDashboard = window.location.pathname === '/dashboard.html';

if (!token && isDashboard) {
    window.location.href = 'login.html';
}

// Show/hide sidebar elements based on token presence
if (token && isDashboard) {
    $('#sidebar-register, #sidebar-login, #sidebar-dashboard').hide();
    $('#sidebar-home, #logoutButton').show();
}

// Sidebar toggle functionality
$('#menuToggle').click(() => $('#sidebar').addClass('open'));
$('#closeSidebar').click(() => $('#sidebar').removeClass('open'));

const entriesContainer = document.getElementById('entries');

const getNotes = async () => {
    try {
        const response = await req('notes', 'GET');
        const data = await response.json();

        if (data.success) {
            entriesContainer.innerHTML = '';
            const notes = data.data;
            document.querySelector('.empty-notes').style.display = notes.length ? 'none' : 'block';

            notes.forEach(({ _id, title, description }) => {
                const entryCard = document.createElement('div');
                entryCard.classList.add('entry-card');
                entryCard.dataset.id = _id;
                entryCard.innerHTML = `
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <div class="actions">
                        <button class="edit">Edit</button>
                        <button class="delete">Delete</button>
                    </div>
                `;
                entriesContainer.appendChild(entryCard);
            });
        }
    } catch (error) {
        console.error('Fetching notes error:', error);
    }
};

const handleNoteOperation = async (endpoint, method, body = null, successMessage) => {
    if (!(await validateToken())) return;
    try {
        const response = await req(endpoint, method, body);
        const data = await response.json();
        if (data.success) {
            await getNotes();
            showToast(successMessage, 'success');
        } else {
            console.error('Note operation error:', data.message);
        }
    } catch (error) {
        console.error(`${method} note error:`, error);
    }
};

const addNote = async (title, description) =>
    handleNoteOperation('notes/create', 'POST', { title, description }, 'Note added successfully');

const updateNote = async (noteId, title, description) =>
    handleNoteOperation(`notes/update/${noteId}`, 'PATCH', { title, description }, 'Note updated successfully');

const deleteNote = async (noteId) =>
    handleNoteOperation(`notes/delete/${noteId}`, 'DELETE', null, 'Note deleted successfully');

let editNoteId = null;
entriesContainer.addEventListener('click', async (e) => {
    const entryCard = e.target.closest('.entry-card');
    if (!entryCard) return;

    const noteId = entryCard.dataset.id;
    if (e.target.classList.contains('delete')) await deleteNote(noteId);

    if (e.target.classList.contains('edit')) {
        document.getElementById('title').value = entryCard.querySelector('h3').textContent;
        document.getElementById('description').value = entryCard.querySelector('p').textContent;
        $('#updateButton').show();
        $('#addButton').hide();
        editNoteId = noteId;
    }
});

document.getElementById('crudForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    if (title.length < 3 || description.length < 3 || title.length > 10 || description.length > 100) {
        return showAlert('Title: 3-10 chars, Description: 3-100 chars');
    }

    if (editNoteId) {
        await updateNote(editNoteId, title, description);
        editNoteId = null;
    } else {
        await addNote(title, description);
    }

    $('#addButton').show();
    $('#updateButton').hide();
    e.target.reset();
});

document.getElementById('updateButton').addEventListener('click', async () => {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    if (!editNoteId) return showAlert('No note selected for update');
    if (title.length < 3 || description.length < 3 || title.length > 10 || description.length > 100) {
        return showAlert('Title: 3-10 chars, Description: 3-100 chars');
    }

    await updateNote(editNoteId, title, description);
    $('#addButton').show();
    $('#updateButton').hide();
    document.getElementById('crudForm').reset();
    editNoteId = null;
});

$('#logoutButton, #sidebar-logoutButton').click(logOut);

export function showAlert(message) {
    showToast(message);
}

function showToast(message, type = 'error') {
    const toast = $('<div>').addClass(`toast toast-${type}`).text(message).appendTo('#toast-container');
    setTimeout(() => toast.fadeOut(() => toast.remove()), 3000);
}

function logOut() {
    localStorage.removeItem('token');
    window.location.href = '/';
}

(async () => {
    if (await validateToken()) await getNotes();
})();
