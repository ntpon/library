class App {
  constructor() {
    this.btnAddBook = document.getElementById('add-book-btn');
    this.btnClearBook = document.getElementById('clear-book-btn');
    this.bookTemplate = document.getElementById('card-book-template');

    this.btnAddBook.addEventListener('click', this.showForm.bind(this));
    this.btnClearBook.addEventListener('click', this.clearLibrary.bind(this));
    this.library = new Library('001', [
      new Book('Clean Code', 'ART', 100, 'Thai', true),
      new Book('Clean Code v2', 'ART', 100, 'Thai', true),
    ]);
    this.render();
  }

  render() {
    const containerBook = document.getElementById('books-container');
    containerBook.innerHTML = '';

    const books = this.library.getBooks();
    books.forEach((book) => {
      const bookCard = document.importNode(this.bookTemplate.content, true);
      const name = bookCard.querySelector('.name');
      const author = bookCard.querySelector('.author span');
      const length = bookCard.querySelector('.detail-length span');
      const language = bookCard.querySelector('.detil-language span');
      const isRead = bookCard.querySelector('.detil-read span');
      const btnRead = bookCard.querySelector('.btn-read');
      const btnRemove = bookCard.querySelector('.btn-remove');
      name.textContent = book.title;
      author.textContent = book.author;
      length.textContent = book.length;
      language.textContent = book.language;
      isRead.textContent = book.isRead ? 'Yes' : 'No';

      btnRead.addEventListener('click', this.updateBook.bind(this, book.id));
      btnRemove.addEventListener('click', this.removeBook.bind(this, book.id));
      containerBook.append(bookCard);
    });

    const totalRead = this.library.books.reduce((prev, curr) => {
      if (curr.isRead) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);

    const totalBook = document.getElementById('total-book');
    const totalReadBook = document.getElementById('total-read');
    const totalNotReadBook = document.getElementById('total-not-read');
    totalBook.textContent = this.library.books.length;
    totalReadBook.textContent = totalRead;
    totalNotReadBook.textContent = this.library.books.length - totalRead;
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

    this.formTitle = contentElement.getElementById('title');
    this.formAuthor = contentElement.getElementById('author');
    this.formPages = contentElement.getElementById('pages');
    this.formLanguage = contentElement.getElementById('language');
    this.formIsRead = contentElement.getElementById('isRead');

    this.modalElement.appendChild(contentElement);
    cancelBtn.addEventListener('click', this.hideForm.bind(this));

    form.addEventListener('submit', this.submitForm.bind(this));

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
    this.library.clear();
    this.render();
  }

  submitForm(event) {
    event.preventDefault();
    if (
      !this.formTitle.value.trim() ||
      !this.formAuthor.value.trim() ||
      !this.formPages.value.trim()
    ) {
      return;
    }
    this.library.createBook(
      new Book(
        this.formTitle.value,
        this.formAuthor.value,
        parseInt(this.formPages.value),
        this.formLanguage.value,
        this.formIsRead.value === 'y' ? true : false
      )
    );
    this.hideForm();
    this.render();
  }

  removeBook(id) {
    this.library.removeBook(id);
    this.render();
  }

  updateBook(id) {
    this.library.updateBook(id);
    this.render();
  }
}

class Library {
  constructor(id, books = []) {
    this.id = id;
    this.books = localStorage.getItem(id)
      ? JSON.parse(localStorage.getItem(id))
      : [];
  }
  createBook(book) {
    this.books.push(book);
    this.updateStorage();
  }
  updateBook(id) {
    const book = this.books.find((book) => {
      if (book.id === id) return book;
    });
    book.isRead = !book.isRead;
    this.updateStorage();
  }
  removeBook(id) {
    this.books = this.books.filter((book) => {
      return book.id !== id;
    });
    this.updateStorage();
  }
  getBooks() {
    return this.books;
  }
  updateStorage() {
    localStorage.setItem(this.id, JSON.stringify(this.books));
  }
  clear() {
    this.books = [];
    localStorage.removeItem(this.id);
  }
}

class Book {
  constructor(title, author, length, language, isRead) {
    this.id = parseInt(Math.random() * 100000);
    this.title = title;
    this.author = author;
    this.length = length;
    this.language = language;
    this.isRead = isRead;
  }
}

new App();
