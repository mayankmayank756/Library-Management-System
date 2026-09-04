(() => {
  // Admin Credentials
  const ADMIN_ID = 'Mayank';
  const ADMIN_PASS = 'Mayank756';

  // Elements
  const sidebarTitle = document.getElementById('sidebar-title');
  const navLinks = document.getElementById('nav-links');
  const mainContent = document.getElementById('main-content');
  const sidebarFooter = document.getElementById('sidebar-footer');
  const mainContainer = document.querySelector('.main-container');

  // Data from localStorage
  const loadData = (key) => {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  };

  const saveData = (key, val) => {
    localStorage.setItem(key, JSON.stringify(val));
  };

  // Application state
  let state = {
    currentUser: null, // {type:'admin'|'student', id:string}
    students: loadData('students') || [],
    books: loadData('books') || [],
    issuedBooks: loadData('issuedBooks') || []
  };

  // Save/load current user
  const saveCurrentUser = () => {
    if (state.currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  };

  const loadCurrentUser = () => {
    const user = localStorage.getItem('currentUser');
    state.currentUser = user ? JSON.parse(user) : null;
  };

  // Navigation definitions
  const navConfig = {
    guest: [
      { label: 'Admin Login', action: showAdminLogin },
      { label: 'Student Login', action: showStudentLogin },
      { label: 'Student Signup', action: showStudentSignup }
    ],

    admin: [
      { label: 'Dashboard', action: showAdminDashboard },
      { label: 'Add Book', action: showAddBookForm },
      { label: 'All Issued Books', action: showAllIssuedBooks },
      { label: 'Students', action: showAllStudents },
      { label: 'Logout', action: logout }
    ],

    student: [
      { label: 'Browse Books', action: showStudentBrowse },
      { label: 'My Issued Books', action: showStudentIssuedBooks },
      { label: 'Logout', action: logout }
    ]
  };

  // Render navigation links
  function renderNav(role) {
    navLinks.innerHTML = '';

    navConfig[role].forEach(({ label, action }) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');

      btn.textContent = label;
      btn.setAttribute('aria-label', label);

      btn.onclick = () => {
        setActiveNav(label);
        action();
      };

      li.appendChild(btn);
      navLinks.appendChild(li);
    });
  }

  // Mark active nav button
  function setActiveNav(label) {
    [...navLinks.children].forEach(li => {
      const btn = li.querySelector('button');
      btn.classList.toggle('active', btn.textContent === label);
    });
  }

  // Update sidebar title
  function updateSidebarTitle(text) {
    sidebarTitle.textContent = text;
  }

  // Update footer info
  function updateSidebarFooter() {
    if (!state.currentUser) {
      sidebarFooter.textContent = 'Not logged in';
    } else {
      const typeCapitalized =
        state.currentUser.type.charAt(0).toUpperCase() +
        state.currentUser.type.slice(1);

      sidebarFooter.textContent =
        `${typeCapitalized}: ${state.currentUser.id}`;
    }
  }

  // Utility to format ISO date-time nicely
  function formatDateTime(isoString) {
    if (!isoString) return 'N/A';

    const d = new Date(isoString);

    if (isNaN(d)) return 'Invalid date';

    return d.toLocaleString();
  }

  // Initial animations show main container after slight delay
  window.addEventListener('load', () => {
    setTimeout(() => {
      mainContainer.style.opacity = '1';
    }, 400);
  });

  // --- Views ---

  // Guest welcome screen
  function showGuestView() {
    updateSidebarTitle('Welcome');
    updateSidebarFooter();
    renderNav('guest');
    setActiveNav(null);

    mainContent.innerHTML = `
      <p style="text-align:center; margin-top:3rem; font-size:1.05rem; color:#777;">
        Please login or signup to use the system.
      </p>`;
  }

  // Admin Login Form
  function showAdminLogin() {
    updateSidebarTitle('Admin Login');
    updateSidebarFooter();

    mainContent.innerHTML = `
      <h2 class="section-title">Admin Login</h2>
      <form id="admin-login-form" autocomplete="off" aria-label="Admin login form">
        <label for="admin-id">Admin ID</label>
        <input type="text" id="admin-id" name="admin-id" required placeholder="Enter Admin ID" />

        <label for="admin-pass">Password</label>
        <input type="password" id="admin-pass" name="admin-pass" required placeholder="Enter Password" />

        <button class="primary" type="submit">Login</button>

        <p class="message" id="admin-login-msg" role="alert" aria-live="assertive"></p>
      </form>`;

    renderNav('guest');
    setActiveNav('Admin Login');

    document.getElementById('admin-login-form').onsubmit = e => {
      e.preventDefault();

      const id = document.getElementById('admin-id').value.trim();
      const pass = document.getElementById('admin-pass').value;
      const msg = document.getElementById('admin-login-msg');

      if (id === ADMIN_ID && pass === ADMIN_PASS) {
        state.currentUser = { type: 'admin', id };
        saveCurrentUser();
        renderDashboard();
      } else {
        msg.textContent = 'Invalid admin credentials.';
        msg.classList.add('message');
      }
    };
  }

  // Student Login Form
  function showStudentLogin() {
    updateSidebarTitle('Student Login');
    updateSidebarFooter();

    mainContent.innerHTML = `
      <h2 class="section-title">Student Login</h2>
      <form id="student-login-form" autocomplete="off" aria-label="Student login form">
        <label for="student-id">Student ID</label>
        <input type="text" id="student-id" name="student-id" required placeholder="Enter Student ID" />

        <label for="student-pass">Password</label>
        <input type="password" id="student-pass" name="student-pass" required placeholder="Enter Password" />

        <button class="primary" type="submit">Login</button>

        <p class="message" id="login-msg" role="alert" aria-live="assertive"></p>
      </form>`;

    renderNav('guest');
    setActiveNav('Student Login');

    document.getElementById('student-login-form').onsubmit = e => {
      e.preventDefault();

      const id = document.getElementById('student-id').value.trim();
      const pass = document.getElementById('student-pass').value;
      const msg = document.getElementById('login-msg');

      const student = state.students.find(
        s => s.id === id && s.password === pass
      );

      if (student) {
        state.currentUser = { type: 'student', id };
        saveCurrentUser();
        renderStudentHome();
      } else {
        msg.textContent = 'Invalid student credentials.';
        msg.classList.add('message');
      }
    };
  }

  // Student Signup Form with contact and class
  function showStudentSignup() {
    updateSidebarTitle('Student Signup');
    updateSidebarFooter();

    mainContent.innerHTML = `
      <h2 class="section-title">Student Signup</h2>
      <form id="student-signup-form" autocomplete="off" aria-label="Student signup form">

        <label for="signup-id">Student ID</label>
        <input type="text" id="signup-id" name="signup-id" required placeholder="Create Student ID" />

        <label for="signup-contact">Contact</label>
        <input type="text" id="signup-contact" name="signup-contact" required placeholder="Contact (Phone/Email)" />

        <label for="signup-class">Class</label>
        <input type="text" id="signup-class" name="signup-class" required placeholder="Class (e.g. 10A)" />

        <label for="signup-pass">Password</label>
        <input type="password" id="signup-pass" name="signup-pass" required minlength="4" placeholder="Create Password" />

        <button class="primary" type="submit">Signup</button>

        <p class="message" id="signup-msg" role="alert" aria-live="assertive"></p>
      </form>`;

    renderNav('guest');
    setActiveNav('Student Signup');

    document.getElementById('student-signup-form').onsubmit = e => {
      e.preventDefault();

      const id = document.getElementById('signup-id').value.trim();
      const contact = document.getElementById('signup-contact').value.trim();
      const cls = document.getElementById('signup-class').value.trim();
      const pass = document.getElementById('signup-pass').value;
      const msg = document.getElementById('signup-msg');

      if (!id || !contact || !cls || !pass) {
        msg.textContent = 'Please fill all fields.';
        return;
      }

      if (state.students.find(s => s.id === id)) {
        msg.textContent = 'Student ID already exists.';
        return;
      }

      state.students.push({
        id,
        contact,
        class: cls,
        password: pass
      });

      saveData('students', state.students);

      msg.textContent = 'Signup successful! Redirecting to Login...';
      msg.classList.add('message', 'success');

      setTimeout(showStudentLogin, 2000);
    };
  }

  // Admin dashboard with options
  function renderDashboard() {
    if (state.currentUser.type === 'admin') {
      renderNav('admin');
      updateSidebarFooter();
      showAdminDashboard();
    } else if (state.currentUser.type === 'student') {
      renderNav('student');
      updateSidebarFooter();
      showStudentBrowse();
    }
  }

  // Admin Dashboard: List Books with delete option
  function showAdminDashboard() {
    updateSidebarTitle('Admin Dashboard');
    updateSidebarFooter();
    renderNav('admin');
    setActiveNav('Dashboard');

    if (state.books.length === 0) {
      mainContent.innerHTML = `
        <h2 class="section-title">Admin Dashboard</h2>
        <p>No books available. Use 'Add Book' from the sidebar.</p>`;
      return;
    }

    let html = `
      <h2 class="section-title">Books in Library</h2>
      <table aria-label="Books List Table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>`;

    state.books.forEach(book => {
      html += `
        <tr>
          <td>${book.id}</td>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.price.toFixed(2)} RS</td>
          <td>${book.stock}</td>
          <td>
            <button class="btn-delete-book sm-btn"
              data-id="${book.id}"
              aria-label="Delete ${book.title}">
              Delete
            </button>
          </td>
        </tr>`;
    });

    html += `</tbody></table>`;

    mainContent.innerHTML = html;

    // Attach delete handlers
    [...mainContent.querySelectorAll('.btn-delete-book')].forEach(btn => {
      btn.onclick = e => {
        const id = e.target.dataset.id;

        if (confirm('Delete this book?')) {
          state.books = state.books.filter(b => b.id !== id);
          saveData('books', state.books);
          showAdminDashboard();
        }
      };
    });
  }

  // Admin Add Book Form
  function showAddBookForm() {
    updateSidebarTitle('Add Book');
    updateSidebarFooter();

    mainContent.innerHTML = `
      <h2 class="section-title">Add New Book</h2>

      <form id="add-book-form" autocomplete="off" aria-label="Add Book Form">

        <label for="book-id">Book ID</label>
        <input type="text" id="book-id" name="book-id" required placeholder="Unique Book Identifier" />

        <label for="book-title">Title</label>
        <input type="text" id="book-title" name="book-title" required placeholder="Book Title" />

        <label for="book-author">Author</label>
        <input type="text" id="book-author" name="book-author" required placeholder="Author Name" />

        <label for="book-price">Price</label>
        <input type="text" id="book-price" name="book-price" required placeholder="e.g. 9.99" pattern="^\\d+(\\.\\d{1,2})?$" />

        <label for="book-stock">Stock</label>
        <input type="number" id="book-stock" name="book-stock" required min="0" />

        <button type="submit" class="primary">Add Book</button>

        <p class="message" id="book-msg" role="alert" aria-live="assertive"></p>
      </form>
    `;

    renderNav('admin');
    setActiveNav('Add Book');

    const form = document.getElementById('add-book-form');
    const msg = document.getElementById('book-msg');

    form.onsubmit = e => {
      e.preventDefault();

      const id = form['book-id'].value.trim();

      if (state.books.find(b => b.id === id)) {
        msg.textContent = 'Book ID already exists!';
        return;
      }

      const title = form['book-title'].value.trim();
      const author = form['book-author'].value.trim();
      const price = parseFloat(form['book-price'].value);
      const stock = parseInt(form['book-stock'].value);

      if (
        isNaN(price) ||
        price < 0 ||
        isNaN(stock) ||
        stock < 0
      ) {
        msg.textContent = 'Invalid price or stock values!';
        return;
      }

      state.books.push({
        id,
        title,
        author,
        price,
        stock
      });

      saveData('books', state.books);

      msg.textContent = 'Book added successfully!';
      msg.classList.add('success');

      form.reset();

      setTimeout(showAdminDashboard, 1800);
    };
  }

  // Admin View all issued book records including student details
  function showAllIssuedBooks() {
    updateSidebarTitle('Issued Book Records');
    updateSidebarFooter();
    renderNav('admin');
    setActiveNav('All Issued Books');

    if (state.issuedBooks.length === 0) {
      mainContent.innerHTML = `
        <h2 class="section-title">Issued Book Records</h2>
        <p>No issued book records found.</p>
      `;
      return;
    }

    let html = `
      <h2 class="section-title">Issued Book Records</h2>

      <table aria-label="All issued books record">
        <thead>
          <tr>
            <th>Book Title</th>
            <th>Student ID</th>
            <th>Contact</th>
            <th>Class</th>
            <th>Issued On</th>
            <th>Submitted On</th>
          </tr>
        </thead>
        <tbody>`;

    state.issuedBooks.forEach(record => {
      const book =
        state.books.find(b => b.id === record.bookId) ||
        { title: 'Unknown' };

      const student =
        state.students.find(s => s.id === record.studentId) ||
        { contact: '-', class: '-' };

      html += `
        <tr>
          <td>${book.title}</td>
          <td>${record.studentId}</td>
          <td>${student.contact}</td>
          <td>${student.class}</td>
          <td>${formatDateTime(record.issueDate)}</td>
          <td>${record.returnDate ? formatDateTime(record.returnDate) : '-'}</td>
        </tr>`;
    });

    html += `</tbody></table>`;

    mainContent.innerHTML = html;
  }

  // Admin View all students list with details
  function showAllStudents() {
    updateSidebarTitle('Students List');
    updateSidebarFooter();
    renderNav('admin');
    setActiveNav('Students');

    if (state.students.length === 0) {
      mainContent.innerHTML = `
        <h2 class="section-title">Students</h2>
        <p>No students registered yet.</p>
      `;
      return;
    }

    let html = `
      <h2 class="section-title">Students</h2>

      <table aria-label="All Students">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Contact</th>
            <th>Class</th>
          </tr>
        </thead>
        <tbody>`;

    state.students.forEach(student => {
      html += `
        <tr>
          <td>${student.id}</td>
          <td>${student.contact}</td>
          <td>${student.class}</td>
        </tr>`;
    });

    html += `</tbody></table>`;

    mainContent.innerHTML = html;
  }

  // Student Home: Browse books to purchase
  function showStudentBrowse() {
    updateSidebarTitle('Browse Books');
    updateSidebarFooter();
    renderNav('student');
    setActiveNav('Browse Books');

    if (state.books.length === 0) {
      mainContent.innerHTML = `
        <h2 class="section-title">Browse Books</h2>
        <p>No books available right now.</p>`;
      return;
    }

    let html = `
      <h2 class="section-title">Browse Books</h2>

      <table aria-label="Available books">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>`;

    state.books.forEach(book => {
      const disabled = book.stock <= 0 ? 'btn-disabled' : '';

      html += `
        <tr>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.price.toFixed(2)} RS</td>
          <td>${book.stock}</td>
          <td>
            <button
              class="btn-purchase sm-btn ${disabled}"
              data-id="${book.id}"
              ${disabled ? 'disabled' : ''}>
              Purchase
            </button>
          </td>
        </tr>`;
    });

    html += `</tbody></table>`;

    mainContent.innerHTML = html;

    mainContent.querySelectorAll('.btn-purchase').forEach(btn => {
      btn.onclick = () => {
        purchaseBook(btn.dataset.id);
      };
    });
  }

  // Purchase book function
  function purchaseBook(bookId) {
    const book = state.books.find(b => b.id === bookId);

    if (!book || book.stock <= 0) {
      alert('Book not currently available.');
      return;
    }

    // Check if already issued and not returned
    const issued = state.issuedBooks.find(
      rec =>
        rec.bookId === bookId &&
        rec.studentId === state.currentUser.id &&
        !rec.returnDate
    );

    if (issued) {
      alert(
        'You already have this book issued. Submit it before purchasing again.'
      );
      return;
    }

    book.stock--;

    state.issuedBooks.push({
      bookId: book.id,
      studentId: state.currentUser.id,
      issueDate: new Date().toISOString(),
      returnDate: null
    });

    saveData('books', state.books);
    saveData('issuedBooks', state.issuedBooks);

    alert(`Successfully purchased "${book.title}".`);

    showStudentBrowse();
  }

  // Student issued books page
  function showStudentIssuedBooks() {
    updateSidebarTitle('My Issued Books');
    updateSidebarFooter();
    renderNav('student');
    setActiveNav('My Issued Books');

    const issued = state.issuedBooks.filter(
      rec => rec.studentId === state.currentUser.id
    );

    if (issued.length === 0) {
      mainContent.innerHTML = `
        <h2 class="section-title">My Issued Books</h2>
        <p>You have no issued books.</p>`;
      return;
    }

    let html = `
      <h2 class="section-title">My Issued Books</h2>

      <table aria-label="My issued books">
        <thead>
          <tr>
            <th>Title</th>
            <th>Issued On</th>
            <th>Submitted On</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>`;

    issued.forEach(rec => {
      const book =
        state.books.find(b => b.id === rec.bookId) ||
        { title: 'Unknown' };

      const canSubmit = !rec.returnDate;

      html += `
        <tr>
          <td>${book.title}</td>
          <td>${formatDateTime(rec.issueDate)}</td>
          <td>${rec.returnDate ? formatDateTime(rec.returnDate) : '-'}</td>
          <td>
            ${
              canSubmit
                ? `<button class="btn-submit-book sm-btn" data-id="${book.id}">Submit</button>`
                : `<span class="badge">Returned</span>`
            }
          </td>
        </tr>`;
    });

    html += `</tbody></table>`;

    mainContent.innerHTML = html;

    mainContent.querySelectorAll('.btn-submit-book').forEach(btn => {
      btn.onclick = () => {
        submitBook(btn.dataset.id);
      };
    });
  }

  // Submit book function
  function submitBook(bookId) {
    const recIndex = state.issuedBooks.findIndex(
      rec =>
        rec.bookId === bookId &&
        rec.studentId === state.currentUser.id &&
        !rec.returnDate
    );

    if (recIndex < 0) {
      alert('No issued record found to submit.');
      return;
    }

    state.issuedBooks[recIndex].returnDate =
      new Date().toISOString();

    const book = state.books.find(b => b.id === bookId);

    if (book) book.stock++;

    saveData('issuedBooks', state.issuedBooks);
    saveData('books', state.books);

    alert('Book submitted successfully.');

    showStudentIssuedBooks();
  }

  // Logout function
  function logout() {
    if (confirm('Are you sure you want to logout?')) {
      state.currentUser = null;
      saveCurrentUser();
      showGuestView();
    }
  }

  // Render UI after login
  function renderDashboard() {
    if (state.currentUser.type === 'admin') {
      renderNav('admin');
      updateSidebarFooter();
      showAdminDashboard();
    } else if (state.currentUser.type === 'student') {
      renderNav('student');
      updateSidebarFooter();
      showStudentBrowse();
    }
  }

  // Render student homepage
  function renderStudentHome() {
    renderDashboard();
  }

  // Initialization
  loadCurrentUser();

  if (state.currentUser) {
    mainContainer.style.opacity = '1';
    renderDashboard();
  } else {
    mainContainer.style.opacity = '1';
    showGuestView();
  }

})();