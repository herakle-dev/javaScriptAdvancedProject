const testo = document.getElementById('testo');
const button = document.getElementById('button');
const lista = document.getElementById('lista');
const buttonName = document.getElementById('button2');
const title = document.getElementById('title');
let counter = 0;

function createElement(tag, className, id) {
  counter++;
  const element = document.createElement(tag);
  element.className = className;
  element.id = `${id}${counter}`;
  return element;
}


function printAuthorsNamesFromSubject(authorsArray, listElement) {
  const authorsList = authorsArray.map(author => author.name).join(', ');
  let printAuthorsName = createElement('p', 'col-lg-12', 'authors');
  if (!listElement.printAuthorsName) {
    listElement.printAuthorsName = true;
    printAuthorsName.innerHTML = authorsList;
    listElement.appendChild(printAuthorsName);
  }
  console.log(authorsList);
}

function printAuthorsNamesByName(authorsArray, listElement) {
  const authorsList = authorsArray.map(author_name => author_name).join(', ');
  let printAuthorsName = createElement('p', 'col-lg-12', 'authors');
  if (!listElement.printAuthorsName) {
    listElement.printAuthorsName = true;
    printAuthorsName.innerHTML = authorsList;
    listElement.appendChild(printAuthorsName);
  }
  console.log(authorsList);
}
function recuperaDescrizione(work, listElement) {
  const key = work.key;
  console.log(`Questo è il link per le api dove si trova la descrizione: https://openlibrary.org/${key}.json`);
  axios.get(`https://openlibrary.org${key}.json`)
    .then(response => {
      let descrizione = response.data.description;
      let descriptionPara = createElement('p', 'col-lg-12', 'para')

      console.log(descrizione)
      if (!listElement.descriptionPara) {
       
        if (!descrizione) {
          descrizione = 'Nessuna descrizione disponibile.';
          descriptionPara.innerHTML += descrizione
          listElement.appendChild(descriptionPara)
        }
       
        else if (typeof descrizione === "object") {
          console.log(descrizione.value);
          descriptionPara.innerHTML = descrizione.value
          listElement.appendChild(descriptionPara)
        } else {
          console.log(descrizione);
          descriptionPara.innerHTML = descrizione
          listElement.appendChild(descriptionPara)
        }
      } listElement.descriptionPara = true;
    })
    .catch(error => {
      console.log(`Errore durante la richiesta della descrizione: ${error}`);
    });
}

function getBookBySubject() {
  axios.get(`https://openlibrary.org/subjects/${testo.value}.json?limit=50`)
    .then(response => {
      console.log(response.data)
      const booksBySubject = response.data.works;
      for (let i = 0; i < booksBySubject.length; i++) {
        const book = booksBySubject[i]; 
        let bookTitle = book.title;
        const listElement = createElement(`li`, `col-lg-4 list`, `book`)
        bookTitle = createElement('h2', `bookTitle col-lg-12`, `bookTitle`)
        let cover = `https://covers.openlibrary.org/b/id/${book.cover_id}.jpg`;
        const imgCover = createElement('img', `img col-lg-8`, `bookCover`)
        imgCover.setAttribute("src", cover);
        imgCover.setAttribute("alt", "testo alternativo");
        listElement.appendChild(bookTitle);
        listElement.appendChild(imgCover);
        bookTitle.innerHTML += book.title;
        lista.appendChild(listElement);
        printAuthorsNamesFromSubject(book.authors, listElement);
        
        bookTitle.addEventListener('click', () => {
          recuperaDescrizione(book, listElement)

        })
      }
    })

    .catch(error => {
      console.log(`Errore durante la richiesta del titolo: ${error}`);
    })  
}


function getBookByName() {
  axios.get(`https://openlibrary.org/search.json?title=${title.value}&limit=50`)
    .then(response => {

      const booksByName = response.data.docs;

      for (let i = 0; i < booksByName.length; i++) {
        const book = booksByName[i];
        let bookTitle = book.title;
        console.log(book.author_name)
        const listElement = createElement(`li`, `col-lg-4 list`, `book`)
        bookTitle = createElement('h2', `bookTitle col-lg-12`, `bookTitle`)
        let cover = `https://covers.openlibrary.org/b/id/${booksByName[i].cover_i}.jpg`;
        const coverByName = createElement('img', `img col-lg-8`, `bookCover`)
        coverByName.setAttribute("src", cover);
        coverByName.setAttribute("alt", "testo alternativo");
        listElement.appendChild(bookTitle);
        listElement.appendChild(coverByName);
        bookTitle.innerHTML = book.title;
        lista.appendChild(listElement);
        printAuthorsNamesByName(book.author_name, listElement)
        bookTitle.addEventListener('click', () => {
          recuperaDescrizione(book, listElement)

        }

        )
      }
    })
    .catch(error => {
      console.log(`Errore durante la richiesta del titolo: ${error}`);
    })
}
buttonName.addEventListener('click', (e) => {
  e.preventDefault();
  lista.innerHTML = '';
  getBookByName();
})
button.addEventListener('click', (e) => {
  e.preventDefault();
  lista.innerHTML = '';
  getBookBySubject();

})





