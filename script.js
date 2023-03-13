const searchParameter = document.getElementById("searchParameter");
const searchValue = document.getElementById("searchValue");
const buttonSearch = document.getElementById('search');
const lista = document.getElementById('lista');
let counter = 0;
function createElement(tag, className, id) {
  counter++;
  const element = document.createElement(tag);
  element.className = className;
  element.id = `${id}${counter}`;
  return element;
}
function getBooks(searchValue, searchParameter) {
  let apiUrl;
  if (searchParameter === "subject") {
    searchValue = searchValue.trim().toLowerCase();
    if (searchValue.indexOf(' ') !== -1) {
      let toast = createElement('div','toast error show', 'toast');
      let message = document.createTextNode('La ricerca per categoria accetta una sola parola');
      toast.appendChild(message);
lista.appendChild(toast);
    return;
    }
    apiUrl =` https://openlibrary.org/subjects/${searchValue}.json?limit=50`;
    } else if (searchParameter === "name") {
    apiUrl = `https://openlibrary.org/search.json?title=${searchValue}&limit=50`;
  } else if (searchParameter === "author") {
    apiUrl = `https://openlibrary.org/search.json?author=${searchValue}&limit=50`;
  }
  axios.get(apiUrl)
    .then(response => {
    
      const books = searchParameter === "subject" ? response.data.works : response.data.docs;
      if (books.length<=0){
let toast = createElement('div','toast error show', 'toast' )
let message = document.createTextNode('La ricerca non ha prodotto nessun risultato');
toast.appendChild(message);
lista.appendChild(toast);
setTimeout(() => {
  lista.removeChild(toast);
}, 5000);
      }
      for (let i = 0; i < books.length; i++) {
        const book = books[i];
        let bookTitle = book.title;
        const listElement = createElement(`li`, `col-lg-3 listElement`, `book`);
        bookTitle = createElement('h2', `bookTitle col-lg-12`, `bookTitle`);
        let cover = `https://covers.openlibrary.org/b/id/${searchParameter === "subject" ? book.cover_id : book.cover_i}.jpg`;
        const imgCover = createElement('img', `bookCover img col-lg-8`, `bookCover`)
        imgCover.setAttribute("src", cover);
        imgCover.setAttribute("alt", "testo alternativo");
        const descriptionButton = createElement('button', 'descriptionButton btn btn-info  col-lg-12', `btnDescription${counter}`)
        descriptionButton.innerHTML='Mostra descrizione'
        listElement.appendChild(bookTitle);
        bookTitle.innerHTML += book.title;
        lista.appendChild(listElement);
        if (searchParameter=== "subject") {
          printAuthorsNames(book.authors, listElement);
        } else if (searchParameter=== "name") {
          printAuthorsNames(book.author_name, listElement, false);
        } 
        descriptionButton.addEventListener('click', () => {
          toggleDescription(listElement, book);         
        })  
        listElement.appendChild(imgCover);
        listElement.appendChild(descriptionButton);
      }
    })
    .catch(error => {
      console.log(` ${error}`);
    });
}
function printAuthorsNames(authorsArray, listElement, byName = true) {
  const authorsList = byName
    ? authorsArray.map(author => author.name).join(', ')
    : authorsArray.join(', ');
  
  let printAuthorsName = createElement('p', 'authorsPara col-lg-12', 'authors');
  
  if (!listElement.printAuthorsName) {
    listElement.printAuthorsName = true;
    printAuthorsName.innerHTML = authorsList;
    listElement.appendChild(printAuthorsName);
  }
  
  
}
function recuperaDescrizione(work, listElement) {
  const key = work.key;
  console.log(`Questo è il link per le api dove si trova la descrizione: https://openlibrary.org/${key}.json`);
  axios.get(`https://openlibrary.org${key}.json`)
    .then(response => {
      let descrizione = response.data.description;
      let descriptionPara = createElement('p', 'col-lg-12 descriptionPara', 'para')
      if (!listElement.descriptionPara) {
        if (!descrizione) {
          descrizione = 'Nessuna descrizione disponibile.';
          descriptionPara.innerHTML += descrizione
          listElement.appendChild(descriptionPara)
        }
        else if (typeof descrizione === "object") {          
          descriptionPara.innerHTML = descrizione.value
          listElement.appendChild(descriptionPara)
        } else {          
          descriptionPara.innerHTML = descrizione
          listElement.appendChild(descriptionPara)
        }     
      } 
      listElement.descriptionVisible = true;
      listElement.descriptionPara = true;   
           
    })
    .catch(error => {
      console.log(`Errore durante la richiesta della descrizione: ${error}`);
    });
}
function toggleDescription(listElement, book) {
  const descriptionPara = listElement.querySelector('.descriptionPara');
 const descriptionButton=listElement.querySelector('.descriptionButton')
  if (listElement.descriptionVisible) {
    // Rimuovi la descrizione
    if (descriptionPara) {
      descriptionPara.remove();
      listElement.descriptionPara = false;
      descriptionButton.innerHTML=' Mostra descrizione'
    }
    listElement.descriptionVisible = false;
  } else {
    if (!descriptionPara) {
      // La descrizione è già presente
      recuperaDescrizione(book, listElement);
      listElement.descriptionVisible = true;
      descriptionButton.innerHTML=' Nascondi descrizione'

    } 
  
}}


buttonSearch.addEventListener('click', (e) => {
  e.preventDefault();
  lista.innerHTML = '';
  getBooks(searchValue.value, searchParameter.value)
 
})