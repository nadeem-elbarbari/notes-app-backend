// Redirect to login if no token and on dashboard page
if (!localStorage.getItem('token') && window.location.pathname === '/dashboard.html') {
    window.location.href = 'login.html';
}

// Show/hide sidebar elements based on token presence
if (localStorage.getItem('token') && window.location.pathname === '/dashboard.html') {
    $('#sidebar-register, #sidebar-login, #sidebar-dashboard').hide();
    $('#sidebar-home, #logoutButton').show();
}
export const req = async (endpoint, method, body = null) => {
    const url = 'https://notes-app-fullstack-psi.vercel.app';
    try {
        const response = await fetch(`${url}/api/v1/${endpoint}`, {
            method,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : null,
        });
        return response;
    } catch (error) {
        console.error('Request error:', error);
    }
};
// Sidebar toggle functionality
$('#menuToggle').click(() => $('#sidebar').addClass('open'));
$('#closeSidebar').click(() => $('#sidebar').removeClass('open'));

// Check token validity
const checkToken = async () => {
    try {
        const response = await req('auth/checktoken', 'GET');
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error checking token:', error);
        return false;
    }
};

// Validate token and handle session expiration
const validateToken = async () => {
    const isValid = await checkToken();
    console.log('isValid :', isValid);

    if (!isValid) {
        showAlert('Your session has expired. Please log in again');
        setTimeout(logOut, 3000);
    }
    return isValid;
};

const entriesContainer = document.getElementById('entries');

// Fetch and display notes
const getNotes = async () => {
    try {
        const response = await req('notes', 'GET');
        const data = await response.json();

        if (data.success) {
            entriesContainer.innerHTML = ''; // Clear previous entries
            const notes = data.data;
            document.querySelector('.empty-notes').style.display = notes.length === 0 ? 'block' : 'none';

            notes.forEach((note) => {
                const entryCard = document.createElement('div');
                entryCard.classList.add('entry-card');
                entryCard.dataset.id = note._id;
                entryCard.innerHTML = `
                    <h3>${note.title}</h3>
                    <p>${note.description}</p>
                    <div class="actions">
                        <button class="edit">Edit</button>
                        <button class="delete">Delete</button>
                    </div>
                `;
                entriesContainer.appendChild(entryCard);
            });
        }
    } catch (error) {
        console.error('Error fetching notes:', error);
    }
};
const req = async (url, method, body) => {
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        method: method,
        body: body,
    });
    return response;
};
// Add a new note
const addNote = async (title, description) => {
    try {
        const response = await req(
            'notes/create',
            'POST',
            JSON.stringify({ title, description })
        );
        const data = await response.json();
        if (data.success) {
            await getNotes(); // Refresh list after adding
            showToast('Note added successfully', 'success');
        }
    } catch (error) {
        console.error('Error adding note:', error);
    }
};

// Update an existing note
const updateNote = async (noteId, title, description) => {
    if (!(await validateToken())) return;

    try {
        const response = await req(
            `notes/update/${noteId}`,
            'PATCH',
            JSON.stringify({ title, description })
        );
        const data = await response.json();
        if (data.success) {
            await getNotes(); // Refresh list after update
            showToast('Note updated successfully', 'success');
        } else {
            console.error('Error updating note:', data.message);
        }
    } catch (error) {
        console.error('Error updating note:', error);
    }
};

// Delete a note
const deleteNote = async (noteId) => {
    if (!(await validateToken())) {
        return console.log('Token invalid');
    } else {
    }

    console.log(await validateToken());
};

// Event delegation for delete & edit buttons
let editNoteId = null;
entriesContainer.addEventListener('click', async (e) => {
    const entryCard = e.target.closest('.entry-card');
    if (!entryCard) return;

    const noteId = entryCard.dataset.id;

    if (e.target.classList.contains('delete')) {
        await deleteNote(noteId);
        getNotes(); // Refresh list after deletion
    }

    if (e.target.classList.contains('edit')) {
        document.getElementById('title').value = entryCard.querySelector('h3').textContent;
        document.getElementById('description').value = entryCard.querySelector('p').textContent;
        document.getElementById('updateButton').style.display = 'block';
        document.getElementById('addButton').style.display = 'none';
        editNoteId = noteId;
    }
});

// Handle form submission for adding/updating notes
document.getElementById('crudForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    if (title.length < 3 || description.length < 3) {
        showAlert('Title and description must be at least 3 characters long');
        return;
    }
    if (title.length > 10 || description.length > 100) {
        showAlert('Title max 10 chars, description max 100 chars');
        return;
    }

    if (!(await validateToken())) {
        return;
    }

    if (editNoteId) {
        await updateNote(editNoteId, title, description);
        editNoteId = null;
    } else {
        console.log(title, description);

        await addNote(title, description);
    }

    document.getElementById('addButton').style.display = 'block';
    document.getElementById('updateButton').style.display = 'none';
    e.target.reset();
});

// Handle update button click
document.getElementById('updateButton').addEventListener('click', async () => {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    if (!editNoteId) {
        showAlert('No note selected for update');
        return;
    }

    if (title.length < 3 || description.length < 3) {
        showAlert('Title and description must be at least 3 characters long');
        return;
    }

    if (title.length > 10 || description.length > 100) {
        showAlert('Title max 10 chars, description max 100 chars');
        return;
    }

    if (!(await validateToken())) return;

    await updateNote(editNoteId, title, description);

    document.getElementById('addButton').style.display = 'block';
    document.getElementById('updateButton').style.display = 'none';
    document.getElementById('crudForm').reset();
    editNoteId = null; // Reset after update
});

// Logout functionality
$('#logoutButton, #sidebar-logoutButton').click(logOut);

// Helper function for alerts
function showAlert(message) {
    showToast(message);
}

// Helper function for toasts
function showToast(message, type = 'error') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}

// Logout function
function logOut() {
    localStorage.removeItem('token');
    window.location.href = '/';
    console.log('Logged out');
}

// Initial token validation and notes fetching
(async () => {
    if (await validateToken()) {
        await getNotes();
    }
})();
