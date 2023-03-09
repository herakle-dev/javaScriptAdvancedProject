const testo = document.getElementById('testo');
const button = document.getElementById('button');
const lista = document.getElementById('lista');
const buttonName = document.getElementById('button2');
const title = document.getElementById('title');
let coverId = '';
let counter = 0;
function createElement(tag, className, id) {
  
  counter++
  const element = document.createElement(tag);
  element.className = className;
  element.id = `${id}-${counter}`;
  return element;
}
function addBookToList(book, listElement) {
  const bookTitle = createElement('h2', `bookTitle col-lg-12`, `bookTitle`);
  const imgCover = createElement('img', `bookCover col-lg-8`, `bookCover`);
  let cover = `https://covers.openlibrary.org/b/id/${coverId}.jpg`;
  imgCover.setAttribute('src', cover);
  imgCover.setAttribute('alt', 'testo alternativo');
  bookTitle.innerHTML = book.title;
  listElement.appendChild(bookTitle);
  listElement.appendChild(imgCover);
  lista.appendChild(listElement);
}
function addAuthorList(authorsList, listElement) {
  const printAuthorsName = createElement('p', 'col-lg-12 authorsPara', 'authors');
  if (!listElement.printAuthorsName) {
    listElement.printAuthorsName = true;
    printAuthorsName.innerHTML = authorsList;
    listElement.appendChild(printAuthorsName);
  }
}
function recuperaDescrizione(work, listElement) {
  const key = work.key;
 // console.log(`Questo è il link per le api dove si trova la descrizione: https://openlibrary.org/${key}.json`);
  axios.get(`https://openlibrary.org${key}.json`)
    .then(response => {
      let descrizione = response.data.description;
      let descriptionPara = createElement('p', 'col-lg-12 descriptionPara', 'descriptionPara')

      //console.log(descrizione)
      if (!listElement.descriptionPara) {
       
        if (!descrizione) {
          descrizione = 'Nessuna descrizione disponibile.';
          descriptionPara.innerHTML += descrizione
          listElement.appendChild(descriptionPara)
        }
       
        else if (typeof descrizione === "object") {
         // console.log(descrizione.value);
          descriptionPara.innerHTML = descrizione.value
          listElement.appendChild(descriptionPara)
        } else {
        //  console.log(descrizione);
          descriptionPara.innerHTML = descrizione
          listElement.appendChild(descriptionPara)
        }
      } listElement.descriptionPara = true;
    })
    .catch(error => {
      console.log(`Errore durante la richiesta della descrizione: ${error}`);
    });
}
function addBookTitleClickListener(book, listElement) {
  const bookTitle = listElement.querySelector('.bookTitle');

  bookTitle.addEventListener('click', () => {
    recuperaDescrizione(book, listElement);
  });
}
function getBookBySubject() {
  axios.get(`https://openlibrary.org/subjects/${testo.value}.json?limit=50`)
    .then(response => {
     
      const booksBySubject = response.data.works;

      for (let i = 0; i < booksBySubject.length; i++) {
        const book = booksBySubject[i];
        coverId=book.cover_id;
        let listElement = createElement('li', 'col-lg-4 listElement', 'book');
 
        addBookToList(book, listElement);
        addAuthorList(book.authors.map(author => author.name).join(', '), listElement);
        addBookTitleClickListener(book, listElement);
      }
    })
    .catch(error => {
      console.log(`Errore durante la richiesta del libro: ${error}`);
    });
}

function getBookByName() {
  axios.get(`https://openlibrary.org/search.json?title=${title.value}&limit=50`)
    .then(response => {
      const booksByName = response.data.docs;

      for (let i = 0; i < booksByName.length; i++) {
        const book = booksByName[i];
        let listElement = createElement('li', 'col-lg-4 listElement', 'book');
         coverId=booksByName[i].cover_i;
        addBookToList(book, listElement);
        addAuthorList(book.author_name.join(', '), listElement);
        addBookTitleClickListener(book, listElement);
      }
    })
    .catch(error => {
      console.log(`Errore durante la richiesta del libro: ${error}`);
    });
}
button.addEventListener('click', (e) => {
  e.preventDefault();
  lista.innerHTML = '';
  getBookBySubject();
});
buttonName.addEventListener('click', (e) => {
  e.preventDefault();
  lista.innerHTML = '';
  getBookByName();
});