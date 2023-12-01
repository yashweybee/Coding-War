const BASE_API_URL = 'https://swapi.dev/api/people';
const BASE_IMAGE_URL = 'https://starwars-visualguide.com/assets/img/characters/';
let characters = [];
let pageNumber = 1;
const mainPage = document.getElementById('main-page');
const btnPre = document.querySelector('.previous');
const btnNxt = document.querySelector('.next');
const ul = document.getElementById('cardlist');
const span = document.getElementsByClassName('close')[0];
const model = document.getElementById('popUpModel');
const modelContainer = document.getElementsByClassName('grid-container')[0].children;
const modelContent = document.getElementsByClassName('modal-content')[0];
const loader = document.querySelector('.loader');

btnNxt.addEventListener('click', function () {
    pageNumber++;
    if (pageNumber >= 10) {
        alert("Page not Exist");
        pageNumber--;
        return;
    }
    characters = [];
    init(pageNumber, characters);
})

btnPre.addEventListener('click', function () {
    pageNumber--;
    if (!pageNumber) {
        alert("Page not Exist");
        pageNumber++;
        return;
    }
    characters = [];
    init(pageNumber, characters);
    console.log(pageNumber);
})

const getCharacterImage = (index) => {

    const ind = index + ((pageNumber - 1) * characters.length);
    const imgSrc = `${BASE_IMAGE_URL}${ind}.jpg`;
    return imgSrc;
};

const getCharacters = async (pageNumber, collection) => {

    await fetch(`${BASE_API_URL}?page=${pageNumber}`)
        .then((response) => response.json())
        .then(async (data) => {
            collection.push(...data.results);
        });
    collection.forEach((character, index) => (character.id = index + 1));
    console.log(collection);
};

const getCharacterInfo = async (url) => {
    if (url.toString()) {
        try {
            const response = await fetch(url);
            return response.json();
        } catch (err) {
            console.log(err);
        }
    } else {
        return { name: 'unknown' };
    }
};

const getCharacterFilms = async (urls) => {
    try {
        const movies = [];
        for (let i = 0; i < urls.length; i++) {
            const response = await fetch(urls[i]);
            const movie = await response.json();
            movies.push(movie.title);
        }
        return movies.join(' , ');
    } catch (err) {
        console.log(err);
    }
};

const openModel = async (e) => {
    model.style.display = 'block';
    loader.style.display = 'block';

    const [name, CharacterImg, birth, gender, species, homeworld, films] = [...modelContainer];
    const index = parseInt(e.target.id) - 1;

    console.log(index);
    // console.log(characters);

    name.innerHTML = characters[index].name;
    CharacterImg.src = getCharacterImage(index + 1);
    birth.innerHTML = `<b>Birth Year</b>: ${characters[index].birth_year}`;
    gender.innerHTML = `<b>Gender</b>: ${characters[index].gender}`;

    const planet = await getCharacterInfo(characters[index].homeworld);
    homeworld.innerHTML = `<b>Homeworld</b>: ${planet.name}`;

    const charSpecies = await getCharacterInfo(characters[index].species);
    species.innerHTML = `<b>Species</b>: ${charSpecies.name}`;

    const movies = await getCharacterFilms(characters[index].films);
    films.innerHTML = `<b>Films</b>: ${movies}`;

    loader.style.display = 'none';
    modelContent.style.display = 'block'

    span.onclick = () => {
        model.style.display = 'none';
        modelContent.style.display = 'none'
    };
};


const init = async function () {

    ul.innerHTML = "";
    loader.style.display = 'block';



    await getCharacters(pageNumber, characters);


    characters.forEach((character) => {

        const li = document.createElement('div');
        li.classList.add('card');
        li.id = character.id;

        const img = document.createElement('img');
        img.src = getCharacterImage(character.id);
        img.classList.add('CharacterImageList');
        img.id = character.id;

        const imgTitle = document.createElement('div');
        imgTitle.classList.add('title');
        imgTitle.innerHTML = character.name;

        li.appendChild(img);
        li.appendChild(imgTitle);
        ul.appendChild(li);

        li.onclick = openModel;
    });
    mainPage.style.display = 'block';
    loader.style.display = 'none';
};

init(pageNumber, characters);