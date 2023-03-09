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
    
    console.log(authorsList);
  }

  function recuperaDescrizione(work, listElement) {
    const key = work.key;
    console.log(`Questo è il link per le api dove si trova la descrizione: https://openlibrary.org/${key}.json`);
    axios.get(`https://openlibrary.org${key}.json`)
      .then(response => {
        let descrizione = response.data.description;
        let descriptionPara = createElement('p', 'col-lg-12 descriptionPara', 'para')

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
        } 
        listElement.descriptionPara = true;   
        if (listElement.descriptionVisible) {
          descriptionPara.style.display = 'none';
          listElement.descriptionVisible = false;
        } else {
          descriptionPara.style.display = 'block';
          listElement.descriptionVisible = true;
        }          
      })
      .catch(error => {
        console.log(`Errore durante la richiesta della descrizione: ${error}`);
      });
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
          const listElement = createElement(`li`, `col-lg-4 listElement`, `book`);
          listElement.descriptionVisible = false;
          bookTitle = createElement('h2', `bookTitle col-lg-12`, `bookTitle`);
          let cover = `https://covers.openlibrary.org/b/id/${type === "subject" ? book.cover_id : book.cover_i}.jpg`;
          const imgCover = createElement('img', `bookCover img col-lg-8`, `bookCover`)
          imgCover.setAttribute("src", cover);
          imgCover.setAttribute("alt", "testo alternativo");
          const button = createElement('button', 'btn btn-primary col-lg-12', 'btnDescription')
          button.innerHTML='CLICKME'
          listElement.appendChild(bookTitle);
          listElement.appendChild(imgCover);
          listElement.appendChild(button);
          bookTitle.innerHTML += book.title;
          lista.appendChild(listElement);

          if (type === "subject") {
            printAuthorsNames(book.authors, listElement);
          } else if (type === "name") {
            printAuthorsNames(book.author_name, listElement, false);
          }

          button.addEventListener('click', () => {  
            // Nascondi la descrizione del libro precedente
            const prevListElement = document.querySelector('.listElement.active');
            if (prevListElement && prevListElement !== listElement) {
              prevListElement.descriptionVisible = false;
              const prevDescriptionPara = prevListElement.querySelector('.descriptionPara');
              if (prevDescriptionPara) {
                prevDescriptionPara.style.display = 'none';
              }
              prevListElement.classList.remove('active');
            }
          
            // Recupera la descrizione del libro attuale
            recuperaDescrizione(book, listElement);
          
            // Aggiorna la classe del listElement corrente per tenerlo traccia
            listElement.classList.add('active')})  
        }
      })
      .catch(error => {
        console.log(`Errore durante la richiesta del titolo: ${error}`);
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




