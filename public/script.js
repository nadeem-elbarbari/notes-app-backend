if (!localStorage.getItem('token') && window.location.pathname === '/dashboard.html') {
    window.location.href = 'login.html';
}

if (localStorage.getItem('token') && window.location.pathname === '/dashboard.html') {
    $('#sidebar-register').hide();
    $('#sidebar-login').hide();
    $('#sidebar-dashboard').hide();
    $('#sidebar-home').show();
    $('#logoutButton').show();
}

$('#menuToggle').click(() => $('#sidebar').addClass('open'));
$('#closeSidebar').click(() => $('#sidebar').removeClass('open'));

const token = localStorage.getItem('token');
const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

let isValid = null;

const checkToken = async () => {
    try {
        const response = await fetch('https://notes-app-fullstack-psi.vercel.app//api/v1/auth/checktoken', {
            headers,
        });
        const data = await response.json();
        isValid = data.success;
        return true;
    } catch (error) {
        console.log(error);
    }
};

checkToken();

if (!isValid) {
    showAlert('Your session has expired. Please log in again');
    setTimeout(() => {
        logOut();
    }, 3000);
}

const entriesContainer = document.getElementById('entries');

const getNotes = async () => {
    try {
        const response = await fetch('https://notes-app-fullstack-psi.vercel.app//api/v1/notes', { headers });
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
        console.log(error);
    }
};

// Fetch and display notes
getNotes();

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

const addNote = async (title, description) => {
    try {
        const response = await fetch('https://notes-app-fullstack-psi.vercel.app//api/v1/notes/create', {
            headers,
            method: 'POST',
            body: JSON.stringify({ title, description }),
        });

        const data = await response.json();
        if (data.success) {
            await getNotes(); // Refresh list after adding
            showToast('Note added successfully', 'success');
        }
    } catch (error) {
        console.log(error);
    }
};
console.log(isValid);

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

    if (!checkToken()) {
        showAlert('Your session has expired. Please log in again');
        setTimeout(() => {
            logOut();
        }, 3000);
        return;
    }

    await addNote(title, description);
    document.getElementById('addButton').style.display = 'block';
    document.getElementById('updateButton').style.display = 'none';
    e.target.reset();
});

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

    if (!isValid) {
        showAlert('Your session has expired. Please log in again');
        setTimeout(() => {
            logOut();
        }, 3000);
        return;
    }

    await updateNote(editNoteId, title, description);

    document.getElementById('addButton').style.display = 'block';
    document.getElementById('updateButton').style.display = 'none';
    document.getElementById('crudForm').reset();
    editNoteId = null; // Reset after update
});
const deleteNote = async (noteId) => {
    if (!isValid) {
        showAlert('Your session has expired. Please log in again');
        setTimeout(() => {
            logOut();
        }, 3000);
        return;
    }

    try {
        const response = await fetch(`https://notes-app-fullstack-psi.vercel.app//api/v1/notes/delete/${noteId}`, {
            method: 'DELETE',
            headers,
        });

        const data = await response.json();
        if (data.success) {
            console.log(`Note ${noteId} deleted`);
            showToast('Note deleted successfully', 'success');
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Error deleting note:', error);
    }
};

const updateNote = async (noteId, title, description) => {
    try {
        const response = await fetch(`https://notes-app-fullstack-psi.vercel.app//api/v1/notes/update/${noteId}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ title, description }),
        });

        const data = await response.json();
        console.log(data);

        if (data.success) {
            console.log(`Note ${noteId} updated ` + data.message);
            await getNotes(); // Refresh list after update
            showToast('Note updated successfully', 'success');
        }
        if (!data.success) {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Error updating note:', error);
    }
};

$('#logoutButton, #sidebar-logoutButton').click(() => {
    logOut();
});

// Helper function for alerts
function showAlert(message) {
    showToast(message);
}

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

function logOut() {
    localStorage.removeItem('token');
    window.location.href = '/';
    console.log('Logged out');
}
