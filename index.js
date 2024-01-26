const parentElement = document.querySelector(".main");
const seachInput = document.querySelector(".input");
const movieRatings = document.querySelector("#rating-select");
const movieGenres = document.querySelector("#genre-select");

let searchValue = "";
let ratings = 0;
let genre = "";
let ratingsResults = "";
let searchResults = "";
let genreResults = "";
let ratingsURL, genreURL, searchURL, mainURL;

const getData = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (err) { }
};
const baseURL = "http://localhost:3000/api/movies/filteredData?";
const URL = "http://localhost:3000/api/movies";
const genresURL = "http://localhost:3000/api/movies/genres";

let movies = await getData(URL);

const createElement = (element) => document.createElement(element);

// function to create movie cards
const createMovieCard = (movies) => {
  console.log(movies)
  if (movies.length > 0) {
    for (let movie of movies) {
      // creating parent container
      const cardContainer = createElement("div");
      cardContainer.classList.add("card", "shadow");

      // creating image container
      const imageContainer = createElement("div");
      imageContainer.classList.add("card-image-container");

      // creating card image
      const imageEle = createElement("img");
      imageEle.classList.add("card-image");
      imageEle.setAttribute("src", movie.img_link);
      imageEle.setAttribute("alt", movie.name);
      imageContainer.appendChild(imageEle);

      cardContainer.appendChild(imageContainer);

      // creating card details container

      const cardDetails = createElement("div");
      cardDetails.classList.add("movie-details");

      // card title

      const titleEle = createElement("p");
      titleEle.classList.add("title");
      titleEle.innerText = movie.name;
      cardDetails.appendChild(titleEle);

      // card genre

      const genreEle = createElement("p");
      genreEle.classList.add("genre");
      genreEle.innerText = `Genre: ${movie.genre}`;
      cardDetails.appendChild(genreEle);

      // ratings and length container
      const movieRating = createElement("div");
      movieRating.classList.add("ratings");

      // star/rating component

      const ratings = createElement("div");
      ratings.classList.add("star-rating");

      // star icon
      const starIcon = createElement("span");
      starIcon.classList.add("material-icons-outlined");
      starIcon.innerText = "star";
      ratings.appendChild(starIcon);

      // ratings
      const ratingValue = createElement("span");
      ratingValue.innerText = movie.imdb_rating;
      ratings.appendChild(ratingValue);

      movieRating.appendChild(ratings);

      // length
      const length = createElement("p");
      length.innerText = `${movie.duration} mins`;

      movieRating.appendChild(length);
      cardDetails.appendChild(movieRating);
      cardContainer.appendChild(cardDetails);

      parentElement.appendChild(cardContainer);
    }
  }
  else {
    const emptyResults = document.createElement('div')
    const textEle = document.createElement('p')
    emptyResults.classList.add("no-results-container")

    textEle.innerText = "Sorry, no results found :(";
    textEle.classList.add("no-results-text")
    emptyResults.appendChild(textEle)

    parentElement.appendChild(emptyResults);
  }

};

let genres = await getData(genresURL);

//create genre dropdown
for (let genre of genres) {
  const option = createElement("option");
  option.classList.add("option");
  option.setAttribute("value", genre);
  option.innerText = genre;
  movieGenres.appendChild(option);
}

function constructURL(baseURL, searchValue, ratings, genre) {
  let url = baseURL + (searchValue === "" ? "" : `s=${encodeURIComponent(searchValue)}`);
  if (ratings > 0) {
    url += `&i=${encodeURIComponent(ratings)}`;
  }
  if (genre !== "") {
    url += `&g=${genre}`;
  }
  return url;
}

async function handleSearch(event) {
  searchValue = event.target.value.toLowerCase();
  mainURL = constructURL(baseURL, searchValue, ratings, genre);
  searchResults = await getData(mainURL);
  parentElement.innerHTML = "";
  createMovieCard(searchResults);
}

async function handleRatingSelector(event) {
  ratings = event.target.value;
  mainURL = constructURL(baseURL, searchValue, ratings, genre);
  ratingsResults = await getData(mainURL);
  parentElement.innerHTML = "";
  createMovieCard(ratings ? ratingsResults : movies);
}

async function handleGenreSelect(event) {
  genre = event.target.value;
  mainURL = constructURL(baseURL, searchValue, ratings, genre);
  genreResults = await getData(mainURL);
  parentElement.innerHTML = "";
  createMovieCard(genre ? genreResults : movies);
}

function debounce(callback, delay) {
  let timerId;

  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

const debounceInput = debounce(handleSearch, 500);

seachInput.addEventListener("keyup", debounceInput);

movieRatings.addEventListener("change", handleRatingSelector);

movieGenres.addEventListener("change", handleGenreSelect);

createMovieCard(movies);