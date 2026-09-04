(() => {

  /* ================================
     ADMIN LOGIN DETAILS
  ================================= */

  const ADMIN_ID = 'Mayank';
  const ADMIN_PASS = 'Mayank756';


  /* ================================
     HTML ELEMENTS
  ================================= */

  const sidebarTitle =
    document.getElementById('sidebar-title');

  const navLinks =
    document.getElementById('nav-links');

  const mainContent =
    document.getElementById('main-content');

  const sidebarFooter =
    document.getElementById('sidebar-footer');


  /* ================================
     LOCAL STORAGE
  ================================= */

  const loadData = (key) => {

    const value =
      localStorage.getItem(key);

    return value
      ? JSON.parse(value)
      : null;
  };


  const saveData = (key, value) => {

    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  };


  /* ================================
     APPLICATION STATE
  ================================= */

  let state = {

    currentUser: null,

    students:
      loadData('students') || [],

    books:
      loadData('books') || [],

    issuedBooks:
      loadData('issuedBooks') || []

  };


  /* ================================
     CURRENT USER
  ================================= */

  const saveCurrentUser = () => {

    if (state.currentUser) {

      localStorage.setItem(
        'currentUser',
        JSON.stringify(state.currentUser)
      );

    } else {

      localStorage.removeItem(
        'currentUser'
      );

    }
  };


  const loadCurrentUser = () => {

    const user =
      localStorage.getItem(
        'currentUser'
      );

    state.currentUser =
      user
        ? JSON.parse(user)
        : null;
  };


  /* ================================
     NAVIGATION
  ================================= */

  const navConfig = {

    guest: [

      {
        label: 'Admin Login',
        action: showAdminLogin
      },

      {
        label: 'Student Login',
        action: showStudentLogin
      },

      {
        label: 'Student Signup',
        action: showStudentSignup
      }

    ],

    admin: [

      {
        label: 'Dashboard',
        action: showAdminDashboard
      },

      {
        label: 'Add Book',
        action: showAddBookForm
      },

      {
        label: 'All Issued Books',
        action: showAllIssuedBooks
      },

      {
        label: 'Students',
        action: showAllStudents
      },

      {
        label: 'Logout',
        action: logout
      }

    ],

    student: [

      {
        label: 'Browse Books',
        action: showStudentBrowse
      },

      {
        label: 'My Issued Books',
        action: showStudentIssuedBooks
      },

      {
        label: 'Logout',
        action: logout
      }

    ]

  };


  /* ================================
     RENDER NAVIGATION
  ================================= */

  function renderNav(role) {

    navLinks.innerHTML = '';

    navConfig[role].forEach(
      ({ label, action }) => {

        const li =
          document.createElement('li');

        const button =
          document.createElement('button');

        button.textContent = label;

        button.onclick = () => {

          setActiveNav(label);

          action();

        };

        li.appendChild(button);

        navLinks.appendChild(li);

      }
    );
  }


  function setActiveNav(label) {

    [
      ...navLinks.children
    ].forEach(li => {

      const button =
        li.querySelector('button');

      button.classList.toggle(
        'active',
        button.textContent === label
      );

    });
  }


  function updateSidebarTitle(text) {

    sidebarTitle.textContent = text;

  }


  function updateSidebarFooter() {

    if (!state.currentUser) {

      sidebarFooter.textContent =
        'Not logged in';

      return;
    }

    const type =
      state.currentUser.type
        .charAt(0)
        .toUpperCase()
      +
      state.currentUser.type.slice(1);

    sidebarFooter.textContent =
      `${type}: ${state.currentUser.id}`;
  }


  /* ================================
     DATE FORMAT
  ================================= */

  function formatDateTime(dateString) {

    if (!dateString) {

      return 'N/A';
    }

    const date =
      new Date(dateString);

    if (isNaN(date)) {

      return 'Invalid date';
    }

    return date.toLocaleString();
  }


  /* ================================
     GUEST VIEW
  ================================= */

  function showGuestView() {

    updateSidebarTitle(
      'Welcome'
    );

    updateSidebarFooter();

    renderNav('guest');

    mainContent.innerHTML = `

      <p style="
        text-align:center;
        margin-top:3rem;
        font-size:1.05rem;
        color:#777;
      ">

        Please login or signup
        to use the system.

      </p>

    `;

  }


  /* ================================
     ADMIN LOGIN
  ================================= */

  function showAdminLogin() {

    updateSidebarTitle(
      'Admin Login'
    );

    updateSidebarFooter();

    renderNav('guest');

    setActiveNav(
      'Admin Login'
    );

    mainContent.innerHTML = `

      <h2 class="section-title">
        Admin Login
      </h2>

      <form
        id="admin-login-form"
        autocomplete="off">

        <label for="admin-id">
          Admin ID
        </label>

        <input
          type="text"
          id="admin-id"
          required
          placeholder="Enter Admin ID"
        >

        <label for="admin-pass">
          Password
        </label>

        <input
          type="password"
          id="admin-pass"
          required
          placeholder="Enter Password"
        >

        <button
          class="primary"
          type="submit">

          Login

        </button>

        <p
          class="message"
          id="admin-login-msg">
        </p>

      </form>

    `;


    document
      .getElementById(
        'admin-login-form'
      )
      .onsubmit = e => {

        e.preventDefault();

        const id =
          document
            .getElementById('admin-id')
            .value
            .trim();

        const password =
          document
            .getElementById('admin-pass')
            .value;

        const message =
          document
            .getElementById(
              'admin-login-msg'
            );


        if (
          id === ADMIN_ID &&
          password === ADMIN_PASS
        ) {

          state.currentUser = {

            type: 'admin',

            id: id

          };

          saveCurrentUser();

          renderDashboard();

        } else {

          message.textContent =
            'Invalid admin credentials.';

        }

      };

  }


  /* ================================
     STUDENT LOGIN
  ================================= */

  function showStudentLogin() {

    updateSidebarTitle(
      'Student Login'
    );

    updateSidebarFooter();

    renderNav('guest');

    setActiveNav(
      'Student Login'
    );

    mainContent.innerHTML = `

      <h2 class="section-title">
        Student Login
      </h2>

      <form
        id="student-login-form"
        autocomplete="off">

        <label>
          Student ID
        </label>

        <input
          type="text"
          id="student-id"
          required
          placeholder="Enter Student ID"
        >

        <label>
          Password
        </label>

        <input
          type="password"
          id="student-pass"
          required
          placeholder="Enter Password"
        >

        <button
          class="primary"
          type="submit">

          Login

        </button>

        <p
          class="message"
          id="login-msg">
        </p>

      </form>

    `;


    document
      .getElementById(
        'student-login-form'
      )
      .onsubmit = e => {

        e.preventDefault();

        const id =
          document
            .getElementById(
              'student-id'
            )
            .value
            .trim();

        const password =
          document
            .getElementById(
              'student-pass'
            )
            .value;

        const message =
          document
            .getElementById(
              'login-msg'
            );


        const student =
          state.students.find(
            student =>
              student.id === id &&
              student.password === password
          );


        if (student) {

          state.currentUser = {

            type: 'student',

            id: id

          };

          saveCurrentUser();

          renderDashboard();

        } else {

          message.textContent =
            'Invalid student credentials.';

        }

      };

  }


  /* ================================
     STUDENT SIGNUP
  ================================= */

  function showStudentSignup() {

    updateSidebarTitle(
      'Student Signup'
    );

    updateSidebarFooter();

    renderNav('guest');

    setActiveNav(
      'Student Signup'
    );


    mainContent.innerHTML = `

      <h2 class="section-title">
        Student Signup
      </h2>

      <form
        id="student-signup-form"
        autocomplete="off">

        <label>
          Student ID
        </label>

        <input
          type="text"
          id="signup-id"
          required
          placeholder="Create Student ID"
        >

        <label>
          Contact
        </label>

        <input
          type="text"
          id="signup-contact"
          required
          placeholder="Contact"
        >

        <label>
          Class
        </label>

        <input
          type="text"
          id="signup-class"
          required
          placeholder="Class"
        >

        <label>
          Password
        </label>

        <input
          type="password"
          id="signup-pass"
          required
          minlength="4"
          placeholder="Create Password"
        >

        <button
          class="primary"
          type="submit">

          Signup

        </button>

        <p
          class="message"
          id="signup-msg">
        </p>

      </form>

    `;


    document
      .getElementById(
        'student-signup-form'
      )
      .onsubmit = e => {

        e.preventDefault();

        const id =
          document
            .getElementById(
              'signup-id'
            )
            .value
            .trim();

        const contact =
          document
            .getElementById(
              'signup-contact'
            )
            .value
            .trim();

        const className =
          document
            .getElementById(
              'signup-class'
            )
            .value
            .trim();

        const password =
          document
            .getElementById(
              'signup-pass'
            )
            .value;

        const message =
          document
            .getElementById(
              'signup-msg'
            );


        if (
          !id ||
          !contact ||
          !className ||
          !password
        ) {

          message.textContent =
            'Please fill all fields.';

          return;
        }


        if (
          state.students.some(
            student =>
              student.id === id
          )
        ) {

          message.textContent =
            'Student ID already exists.';

          return;
        }


        state.students.push({

          id: id,

          contact: contact,

          class: className,

          password: password

        });


        saveData(
          'students',
          state.students
        );


        message.textContent =
          'Signup successful!';

        message.classList.add(
          'success'
        );


        setTimeout(
          showStudentLogin,
          1500
        );

      };

  }


  /* ================================
     ADMIN DASHBOARD
  ================================= */

  function showAdminDashboard() {

    updateSidebarTitle(
      'Admin Dashboard'
    );

    updateSidebarFooter();

    renderNav('admin');

    setActiveNav(
      'Dashboard'
    );


    if (
      state.books.length === 0
    ) {

      mainContent.innerHTML = `

        <h2 class="section-title">
          Admin Dashboard
        </h2>

        <p>
          No books available.
          Use "Add Book".
        </p>

      `;

      return;
    }


    let html = `

      <h2 class="section-title">
        Books in Library
      </h2>

      <table>

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

        <tbody>

    `;


    state.books.forEach(
      book => {

        html += `

          <tr>

            <td>${book.id}</td>

            <td>${book.title}</td>

            <td>${book.author}</td>

            <td>
              ${book.price.toFixed(2)} RS
            </td>

            <td>
              ${book.stock}
            </td>

            <td>

              <button
                class="btn-delete-book sm-btn"
                data-id="${book.id}">

                Delete

              </button>

            </td>

          </tr>

        `;

      }
    );


    html += `

        </tbody>

      </table>

    `;


    mainContent.innerHTML =
      html;


    mainContent
      .querySelectorAll(
        '.btn-delete-book'
      )
      .forEach(button => {

        button.onclick = () => {

          const id =
            button.dataset.id;


          if (
            confirm(
              'Delete this book?'
            )
          ) {

            state.books =
              state.books.filter(
                book =>
                  book.id !== id
              );

            saveData(
              'books',
              state.books
            );

            showAdminDashboard();

          }

        };

      });

  }


  /* ================================
     ADD BOOK
  ================================= */

  function showAddBookForm() {

    updateSidebarTitle(
      'Add Book'
    );

    updateSidebarFooter();

    renderNav('admin');

    setActiveNav(
      'Add Book'
    );


    mainContent.innerHTML = `

      <h2 class="section-title">
        Add New Book
      </h2>

      <form
        id="add-book-form">

        <label>
          Book ID
        </label>

        <input
          type="text"
          id="book-id"
          required
          placeholder="Unique Book ID"
        >

        <label>
          Title
        </label>

        <input
          type="text"
          id="book-title"
          required
          placeholder="Book Title"
        >

        <label>
          Author
        </label>

        <input
          type="text"
          id="book-author"
          required
          placeholder="Author Name"
        >

        <label>
          Price
        </label>

        <input
          type="number"
          id="book-price"
          required
          min="0"
          step="0.01"
          placeholder="Price"
        >

        <label>
          Stock
        </label>

        <input
          type="number"
          id="book-stock"
          required
          min="0"
          placeholder="Stock"
        >

        <button
          class="primary"
          type="submit">

          Add Book

        </button>

        <p
          class="message"
          id="book-msg">
        </p>

      </form>

    `;


    document
      .getElementById(
        'add-book-form'
      )
      .onsubmit = e => {

        e.preventDefault();


        const id =
          document
            .getElementById(
              'book-id'
            )
            .value
            .trim();


        const message =
          document
            .getElementById(
              'book-msg'
            );


        if (
          state.books.some(
            book =>
              book.id === id
          )
        ) {

          message.textContent =
            'Book ID already exists!';

          return;
        }


        const title =
          document
            .getElementById(
              'book-title'
            )
            .value
            .trim();


        const author =
          document
            .getElementById(
              'book-author'
            )
            .value
            .trim();


        const price =
          parseFloat(
            document
              .getElementById(
                'book-price'
              )
              .value
          );


        const stock =
          parseInt(
            document
              .getElementById(
                'book-stock'
              )
              .value
          );


        state.books.push({

          id: id,

          title: title,

          author: author,

          price: price,

          stock: stock

        });


        saveData(
          'books',
          state.books
        );


        message.textContent =
          'Book added successfully!';

        message.classList.add(
          'success'
        );


        setTimeout(
          showAdminDashboard,
          1000
        );

      };

  }


  /* ================================
     STUDENTS
  ================================= */

  function showAllStudents() {

    updateSidebarTitle(
      'Students List'
    );

    updateSidebarFooter();

    renderNav('admin');

    setActiveNav(
      'Students'
    );


    if (
      state.students.length === 0
    ) {

      mainContent.innerHTML = `

        <h2 class="section-title">
          Students
        </h2>

        <p>
          No students registered yet.
        </p>

      `;

      return;
    }


    let html = `

      <h2 class="section-title">
        Students
      </h2>

      <table>

        <thead>

          <tr>

            <th>Student ID</th>
            <th>Contact</th>
            <th>Class</th>

          </tr>

        </thead>

        <tbody>

    `;


    state.students.forEach(
      student => {

        html += `

          <tr>

            <td>
              ${student.id}
            </td>

            <td>
              ${student.contact}
            </td>

            <td>
              ${student.class}
            </td>

          </tr>

        `;

      }
    );


    html += `

        </tbody>

      </table>

    `;


    mainContent.innerHTML =
      html;

  }


  /* ================================
     ALL ISSUED BOOKS
  ================================= */

  function showAllIssuedBooks() {

    updateSidebarTitle(
      'Issued Book Records'
    );

    updateSidebarFooter();

    renderNav('admin');

    setActiveNav(
      'All Issued Books'
    );


    if (
      state.issuedBooks.length === 0
    ) {

      mainContent.innerHTML = `

        <h2 class="section-title">
          Issued Book Records
        </h2>

        <p>
          No issued book records found.
        </p>

      `;

      return;
    }


    let html = `

      <h2 class="section-title">
        Issued Book Records
      </h2>

      <table>

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

        <tbody>

    `;


    state.issuedBooks.forEach(
      record => {

        const book =
          state.books.find(
            book =>
              book.id === record.bookId
          ) ||
          {
            title: 'Unknown'
          };


        const student =
          state.students.find(
            student =>
              student.id ===
              record.studentId
          ) ||
          {
            contact: '-',
            class: '-'
          };


        html += `

          <tr>

            <td>
              ${book.title}
            </td>

            <td>
              ${record.studentId}
            </td>

            <td>
              ${student.contact}
            </td>

            <td>
              ${student.class}
            </td>

            <td>
              ${formatDateTime(
                record.issueDate
              )}
            </td>

            <td>
              ${
                record.returnDate
                  ? formatDateTime(
                      record.returnDate
                    )
                  : '-'
              }
            </td>

          </tr>

        `;

      }
    );


    html += `

        </tbody>

      </table>

    `;


    mainContent.innerHTML =
      html;

  }


  /* ================================
     STUDENT BROWSE
  ================================= */

  function showStudentBrowse() {

    updateSidebarTitle(
      'Browse Books'
    );

    updateSidebarFooter();

    renderNav('student');

    setActiveNav(
      'Browse Books'
    );


    if (
      state.books.length === 0
    ) {

      mainContent.innerHTML = `

        <h2 class="section-title">
          Browse Books
        </h2>

        <p>
          No books available right now.
        </p>

      `;

      return;
    }


    let html = `

      <h2 class="section-title">
        Browse Books
      </h2>

      <table>

        <thead>

          <tr>

            <th>Title</th>
            <th>Author</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

    `;


    state.books.forEach(
      book => {

        const disabled =
          book.stock <= 0
            ? 'btn-disabled'
            : '';


        html += `

          <tr>

            <td>
              ${book.title}
            </td>

            <td>
              ${book.author}
            </td>

            <td>
              ${book.price.toFixed(2)} RS
            </td>

            <td>
              ${book.stock}
            </td>

            <td>

              <button
                class="
                  btn-purchase
                  sm-btn
                  ${disabled}
                "
                data-id="${book.id}"
                ${
                  disabled
                    ? 'disabled'
                    : ''
                }>

                Purchase

              </button>

            </td>

          </tr>

        `;

      }
    );


    html += `

        </tbody>

      </table>

    `;


    mainContent.innerHTML =
      html;


    mainContent
      .querySelectorAll(
        '.btn-purchase'
      )
      .forEach(button => {

        button.onclick = () => {

          purchaseBook(
            button.dataset.id
          );

        };

      });

  }


  /* ================================
     PURCHASE BOOK
  ================================= */

  function purchaseBook(bookId) {

    const book =
      state.books.find(
        book =>
          book.id === bookId
      );


    if (
      !book ||
      book.stock <= 0
    ) {

      alert(
        'Book not currently available.'
      );

      return;
    }


    const alreadyIssued =
      state.issuedBooks.find(
        record =>

          record.bookId === bookId &&

          record.studentId ===
            state.currentUser.id &&

          !record.returnDate
      );


    if (alreadyIssued) {

      alert(
        'You already have this book issued.'
      );

      return;
    }


    book.stock--;


    state.issuedBooks.push({

      bookId: book.id,

      studentId:
        state.currentUser.id,

      issueDate:
        new Date().toISOString(),

      returnDate: null

    });


    saveData(
      'books',
      state.books
    );

    saveData(
      'issuedBooks',
      state.issuedBooks
    );


    alert(
      `Successfully purchased "${book.title}".`
    );


    showStudentBrowse();

  }


  /* ================================
     MY ISSUED BOOKS
  ================================= */

  function showStudentIssuedBooks() {

    updateSidebarTitle(
      'My Issued Books'
    );

    updateSidebarFooter();

    renderNav('student');

    setActiveNav(
      'My Issued Books'
    );


    const issued =
      state.issuedBooks.filter(
        record =>
          record.studentId ===
          state.currentUser.id
      );


    if (
      issued.length === 0
    ) {

      mainContent.innerHTML = `

        <h2 class="section-title">
          My Issued Books
        </h2>

        <p>
          You have no issued books.
        </p>

      `;

      return;
    }


    let html = `

      <h2 class="section-title">
        My Issued Books
      </h2>

      <table>

        <thead>

          <tr>

            <th>Title</th>
            <th>Issued On</th>
            <th>Submitted On</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

    `;


    issued.forEach(
      record => {

        const book =
          state.books.find(
            book =>
              book.id ===
              record.bookId
          ) ||
          {
            title: 'Unknown'
          };


        html += `

          <tr>

            <td>
              ${book.title}
            </td>

            <td>
              ${formatDateTime(
                record.issueDate
              )}
            </td>

            <td>
              ${
                record.returnDate
                  ? formatDateTime(
                      record.returnDate
                    )
                  : '-'
              }
            </td>

            <td>

              ${
                !record.returnDate

                  ? `
                    <button
                      class="
                        btn-submit-book
                        sm-btn
                      "
                      data-id="${book.id}">

                      Submit

                    </button>
                  `

                  : `
                    <span class="badge">
                      Returned
                    </span>
                  `
              }

            </td>

          </tr>

        `;

      }
    );


    html += `

        </tbody>

      </table>

    `;


    mainContent.innerHTML =
      html;


    mainContent
      .querySelectorAll(
        '.btn-submit-book'
      )
      .forEach(button => {

        button.onclick = () => {

          submitBook(
            button.dataset.id
          );

        };

      });

  }


  /* ================================
     SUBMIT BOOK
  ================================= */

  function submitBook(bookId) {

    const index =
      state.issuedBooks.findIndex(
        record =>

          record.bookId === bookId &&

          record.studentId ===
            state.currentUser.id &&

          !record.returnDate
      );


    if (index < 0) {

      alert(
        'No issued record found.'
      );

      return;
    }


    state.issuedBooks[
      index
    ].returnDate =
      new Date().toISOString();


    const book =
      state.books.find(
        book =>
          book.id === bookId
      );


    if (book) {

      book.stock++;

    }


    saveData(
      'issuedBooks',
      state.issuedBooks
    );

    saveData(
      'books',
      state.books
    );


    alert(
      'Book submitted successfully.'
    );


    showStudentIssuedBooks();

  }


  /* ================================
     LOGOUT
  ================================= */

  function logout() {

    if (
      confirm(
        'Are you sure you want to logout?'
      )
    ) {

      state.currentUser = null;

      saveCurrentUser();

      showGuestView();

    }

  }


  /* ================================
     DASHBOARD
  ================================= */

  function renderDashboard() {

    if (
      state.currentUser.type ===
      'admin'
    ) {

      showAdminDashboard();

    }

    else if (
      state.currentUser.type ===
      'student'
    ) {

      showStudentBrowse();

    }

  }


  /* ================================
     INITIALIZATION
  ================================= */

  loadCurrentUser();


  if (state.currentUser) {

    renderDashboard();

  } else {

    showGuestView();

  }

})();
