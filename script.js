const movieInput = document.getElementById("movieInput");
const searchBtn = document.getElementById("searchBtn");
const hero = document.querySelector(".hero");

const movieTitle = document.getElementById("movieTitle");
const movieYear = document.getElementById("movieYear");
const movieGenre = document.getElementById("movieGenre");
const movieRating = document.getElementById("movieRating");
const moviePoster = document.getElementById("moviePoster");
const moviePlot = document.getElementById("moviePlot");
const movieDirector = document.getElementById("movieDirector");
const movieActors = document.getElementById("movieActors");
const movieRuntime = document.getElementById("movieRuntime");
const movieCard = document.querySelector(".movie-card");

const trailerBtn = document.getElementById("trailerBtn");
const favoriteBtn = document.getElementById("favoriteBtn");
const favoritesList = document.getElementById("favoritesList");
const trailerContainer = document.getElementById("trailerContainer");
const backBtn = document.getElementById("backBtn");
const results = document.getElementById("results");
const errorMessage = document.getElementById("errorMessage");
const movieCount = document.getElementById("movieCount");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const apiKey = "8a64af2f";

searchBtn.addEventListener("click", searchMovies);

movieInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchMovies();
  }
});

function searchMovies() {
  const movieName = movieInput.value.trim();

  errorMessage.textContent = "";
  results.innerHTML = "";
  movieCount.textContent = "";
  movieCard.style.display = "none";
  trailerContainer.style.display = "none";
  trailerContainer.innerHTML = "";

  results.style.display = "block";
  movieCount.style.display = "block";

  document.body.style.backgroundImage = "";

  if (movieName === "") {
    errorMessage.textContent = "Please enter a movie name";
    return;
  }

  results.innerHTML = "Searching...";

  const searchUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(movieName)}&apikey=${apiKey}`;

  fetch(searchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (searchData) {
      results.innerHTML = "";

      if (searchData.Response === "False") {
        errorMessage.textContent = "Movie not found";
        movieCount.textContent = "";
        return;
      }

      movieCount.textContent = `Found ${searchData.Search.length} movies`;

      searchData.Search.forEach(function (movie) {
        const movieItem = document.createElement("div");

        movieItem.textContent = `${movie.Title} - ${movie.Year}`;
        movieItem.style.cursor = "pointer";
        movieItem.style.margin = "10px";
        movieItem.style.fontWeight = "bold";
        movieItem.style.color = "white";

        movieItem.addEventListener("click", function () {
          showMovieDetails(movie.imdbID);
        });

        results.appendChild(movieItem);
      });
    })
    .catch(function (error) {
      console.log(error);
      results.innerHTML = "";
      errorMessage.textContent = "Something went wrong";
    });
}

function showMovieDetails(imdbID) {
  const detailUrl = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;

  fetch(detailUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      movieCard.style.display = "flex";

      movieTitle.textContent = data.Title || "N/A";
      movieYear.textContent = "Year: " + (data.Year || "N/A");
      movieGenre.textContent = "Genre: " + (data.Genre || "N/A");
      movieRating.textContent = "Rating: " + (data.imdbRating || "N/A");
      movieDirector.textContent = "Director: " + (data.Director || "N/A");
      movieActors.textContent = "Actors: " + (data.Actors || "N/A");
      movieRuntime.textContent = "Runtime: " + (data.Runtime || "N/A");
      moviePlot.textContent = data.Plot || "No plot available.";

      results.style.display = "none";
      movieCount.style.display = "none";
      movieInput.value = "";
      trailerContainer.style.display = "none";
      trailerContainer.innerHTML = "";

      if (data.Poster === "N/A") {
        moviePoster.style.display = "none";
        moviePoster.removeAttribute("src");
        document.body.style.backgroundImage = "";
      } else {
        moviePoster.style.display = "block";
        moviePoster.src = data.Poster;
        moviePoster.alt = "Movie poster";

        document.body.style.backgroundImage = `url(${data.Poster})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
      }

      window.scrollTo(0, 0);
    })
    .catch(function (error) {
      console.log(error);
      errorMessage.textContent = "Movie details could not be loaded";
    });
}

backBtn.addEventListener("click", function () {
  movieCard.style.display = "none";
  results.style.display = "block";
  movieCount.style.display = "block";
  trailerContainer.style.display = "none";
  trailerContainer.innerHTML = "";
  document.body.style.backgroundImage = "";
  moviePoster.removeAttribute("src");
  moviePoster.style.display = "none";
  window.scrollTo(0, 0);
});

trailerBtn.addEventListener("click", function () {
  const movieName = movieTitle.textContent;

  if (movieName === "") return;

  window.open(
    `https://www.youtube.com/results?search_query=${encodeURIComponent(movieName)}+official+trailer`
  );
});

favoriteBtn.addEventListener("click", function () {
  const movieName = movieTitle.textContent;

  if (movieName === "") return;

  if (favorites.includes(movieName)) {
    return;
  }

  favorites.push(movieName);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
});

function renderFavorites() {
  favoritesList.innerHTML = "";

  favorites.forEach(function (movie, index) {
    favoritesList.innerHTML += `${movie} <button onclick="removeFavorite(${index})">Delete</button><br>`;
  });
}

window.removeFavorite = function (index) {
  favorites.splice(index, 1);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
};

renderFavorites();
