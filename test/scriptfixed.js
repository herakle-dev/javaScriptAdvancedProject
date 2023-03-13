  const testo = document.getElementById('testo');
  const buttonSubject = document.getElementById('button');
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
  function getBooks(query, type) {
    let apiUrl;
    if (type === "subject") {
      apiUrl = `https://openlibrary.org/subjects/${query}.json?limit=50`;
    } else if (type === "name") {
      apiUrl = `https://openlibrary.org/search.json?title=${query}&limit=50`;
    }
    axios.get(apiUrl)
      .then(response => {
        const books = type === "subject" ? response.data.works : response.data.docs;
        for (let i = 0; i < books.length; i++) {
          const book = books[i];
          let bookTitle = book.title;
          const listElement = createElement(`li`, `col-lg-3 listElement`, `book`);
          
          bookTitle = createElement('h2', `bookTitle col-lg-12`, `bookTitle`);
          let cover = `https://covers.openlibrary.org/b/id/${type === "subject" ? book.cover_id : book.cover_i}.jpg`;
          const imgCover = createElement('img', `bookCover img col-lg-8`, `bookCover`)
          imgCover.setAttribute("src", cover);
          imgCover.setAttribute("alt", "testo alternativo");
          const descriptionButton = createElement('button', 'descriptionButton btn btn-info  col-lg-12', `btnDescription${counter}`)
          descriptionButton.innerHTML='Mostra descrizione'
          listElement.appendChild(bookTitle);
     
          bookTitle.innerHTML += book.title;
          lista.appendChild(listElement);

          if (type === "subject") {
            printAuthorsNames(book.authors, listElement);
          } else if (type === "name") {
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
        console.log(`Errore durante la richiesta del titolo: ${error}`);
      });
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
  buttonName.addEventListener('click', (e) => {
    e.preventDefault();
    lista.innerHTML = '';
    getBooks(title.value, "name");  
  })
  buttonSubject.addEventListener('click', (e) => {
    e.preventDefault();
    lista.innerHTML = '';
  getBooks(testo.value, "subject");

  })

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
  

  function searchAuthors() {
    const url = `https://openlibrary.org/search/authors.json?q=${searchValue}`;
    axios.get(url)
      .then(response => {
        const results = response.data.docs;
  console.log(response.data.docs)
        for (let i = 0; i < results.length; i++) {
          const author = results[i];
          const key = author.key;
          const authorUrl = `https://openlibrary.org/authors/${key}`;
  
          console.log(`Author URL: ${authorUrl}`);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  
  // author pic dall' ogetto key dentro photos https://covers.openlibrary.org/a/id/${photos}-M.jpg

