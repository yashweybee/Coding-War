const BASE_API_URL = 'https://swapi.dev/api';
const BASE_IMAGE_URL = 'https://starwars-visualguide.com/assets/img/characters/';
const characters = [];
const mainPage = document.getElementById('main-page');
const ul = document.getElementById('cardlist');
const dialog = document.getElementById('myModal');
const dialogContainer = document.getElementsByClassName('grid-container')[0].children;
const dialogContent = document.getElementsByClassName('modal-content')[0];
const span = document.getElementsByClassName('close')[0];
const btnPre = document.getElementsByClassName('previous');
const btnNxt = document.getElementsByClassName('next');


const getCharacterImage = (index) => `${BASE_IMAGE_URL}${index + 1}.jpg`;

const getCharactersWithAddedId = async ({ collection }) => {
    await fetch(`${BASE_API_URL}/people`)
        .then((response) => response.json())
        .then(async (data) => {
            collection.push(...data.results);
        });
    collection.forEach((character, index) => (character.id = index));
    console.log(collection);
};

const getCharacterFilms = async (urls) => {
    try {
        const movies = [];
        for (let i = 0; i < urls.length; i++) {
            const response = await fetch(urls[i]);
            const movie = await response.json();
            movies.push(movie.title);
        }
        return movies.join(', ');
    } catch (err) {
        console.log(err);
    }
};

const getStats = async (url) => {
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


const openModel = async (event) => {
    dialog.style.display = 'block';

    const index = parseInt(event.target.id);
    const [name, CharacterImg, birth, gender, species, homeworld, films] = [...dialogContainer];

    name.innerHTML = characters[index].name;
    CharacterImg.src = getCharacterImage(index);
    birth.innerHTML = `<b>Birth Year</b>: ${characters[index].birth_year}`;
    gender.innerHTML = `<b>Gender</b>: ${characters[index].gender}`;

    const race = await getStats(characters[index].species);
    species.innerHTML = `<b>Species</b>: ${race.name}`;

    const planet = await getStats(characters[index].homeworld);
    homeworld.innerHTML = `<b>Homeworld</b>: ${planet.name}`;

    const movies = await getCharacterFilms(characters[index].films);
    films.innerHTML = `<b>Films</b>: ${movies}`;
    dialogContent.style.display = 'block'

    span.onclick = () => {
        dialog.style.display = 'none';
        dialogContent.style.display = 'none'
    };

    window.onclick = (e) => {
        // if (event.target == dialog) {
        //     dialog.style.display = 'none';
        //     dialogContent.style.display = 'none'
        // }

        console.log("clicled window");
    };
};


const init = async function () {
    await getCharactersWithAddedId({ collection: characters });
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

    mainPage.style.display = 'block'
};

init();