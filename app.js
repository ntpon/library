class App {
  constructor() {
    this.btnAddBook = document.getElementById('add-book-btn');
    this.btnClearBook = document.getElementById('clear-book-btn');
    this.btnAddBook.addEventListener('click', this.showForm.bind(this));
    this.btnClearBook.addEventListener('click', this.clearLibrary);
    this.library = new Library();
  }
  showForm() {
    this.modalTemplateEl = document.getElementById('modal-template');
    const modalElements = document.importNode(
      this.modalTemplateEl.content,
      true
    );

    this.modalElement = modalElements.querySelector('.modal');
    this.backdropElement = modalElements.querySelector('.backdrop');
    this.formElement = document.getElementById('book-form-template');

    const contentElement = document.importNode(this.formElement.content, true);
    const cancelBtn = contentElement.querySelector('#cancel-btn');
    const form = contentElement.querySelector('form');

    this.modalElement.appendChild(contentElement);
    cancelBtn.addEventListener('click', this.hideForm.bind(this));
    form.addEventListener('submit', this.submitForm);

    document.body.insertAdjacentElement('afterbegin', this.modalElement);
    document.body.insertAdjacentElement('afterbegin', this.backdropElement);
  }

  hideForm() {
    if (this.modalElement) {
      document.body.removeChild(this.modalElement);
      document.body.removeChild(this.backdropElement);
      this.modalElement = null;
      this.backdropElement = null;
      this.formElement = null;
    }
  }
  clearLibrary() {
    this.library = new Library();
  }

  submitForm(event) {
    event.preventDefault();
    this.library.createBook();
  }
}

class Library {
  constructor() {
    this.books = [];
  }
  createBook(data) {
    const book = new Book(data);
    this.books.push(book);
  }
  updateBook(id) {}
  removeBook(id) {}
  getBooks() {}
}

class Book {
  constructor(title, author, length, language, isRead) {
    this.title = title;
    this.author = author;
    this.length = length;
    this.language = language;
    this.isRead = isRead;
  }
}

new App();
