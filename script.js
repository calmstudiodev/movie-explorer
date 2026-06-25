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

searchBtn.addEventListener("click", function () {

    const movieName = movieInput.value.trim();
    results.innerHTML = "Searching";
    movieCard.style.display = "none";

    errorMessage.textContent = "";
   
    movieTitle.textContent = "";
    movieYear.textContent = "";
    movieGenre.textContent = "";
    movieRating.textContent = "";
    movieDirector.textContent = "";
    movieActors.textContent = "";
    movieRuntime.textContent = "";
    moviePlot.textContent = "";
    moviePoster.src = "";

    document.body.style.backgroundImage = "";

    if (movieName === "") {
        alert("Please enter a movie name");
        return;
    }

    const searchUrl =
        `https://www.omdbapi.com/?s=${movieName}&apikey=8a64af2f`;

    fetch(searchUrl)
        .then(response => response.json())
        .then(searchData => {

            results.innerHTML = "";

            if (searchData.Response === "False") {
                errorMessage.textContent = "Movie not found";
                movieCount.textContent = "";
                return;
            }

            errorMessage.textContent = "";
            movieCount.textContent = `Found ${searchData.Search.length} movies`;

            searchData.Search.forEach(function (movie) {

                const movieItem = document.createElement("div");

                movieItem.textContent =
                    `${movie.Title} - ${movie.Year}`;

                movieItem.style.cursor = "pointer";
                movieItem.style.margin = "10px";
                movieItem.style.fontWeight = "bold";
                movieItem.style.color = "white";

                movieItem.addEventListener("click", function () {

                    const detailUrl =
                        `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=8a64af2f`;

                    fetch(detailUrl)
                        .then(response => response.json())
                        .then(data => {

                            movieCard.style.display = "flex";
                            
                            movieTitle.textContent = data.Title;
                            movieYear.textContent = "Year: " + data.Year;
                            movieGenre.textContent = "Genre: " + data.Genre;
                            movieRating.textContent = "Rating: " + data.imdbRating;
                            movieDirector.textContent = "Director: " + data.Director;
                            movieActors.textContent = "Actors: " + data.Actors;
                            movieRuntime.textContent = "Runtime: " + data.Runtime;
                            moviePlot.textContent = data.Plot;

                            if (data.Poster === "N/A") {
                                moviePoster.style.display = "none";
                                moviePoster.alt = "";
                                moviePoster.removeAttribute("src");
                                document.body.style.backgroundImage = "none";
                            } else {
                                moviePoster.style.display = "block";
                                moviePoster.alt = "Movie poster";
                                
                                moviePoster.src =data.Poster;
                                moviePoster.onerror = function () {
                                    moviePoster.style.display = "none";
                                    moviePoster.removeAttribute("src");
                                };
                                document.body.style.backgroundImage = `url(${data.Poster})`;
                                document.body.style.backgroundSize = "cover";
                                document.body.style.backgroundPosition = "center";
                                document.body.style.backgroundRepeat = "no-repeat";


                                
                            }

                            results.style.display = "none";
                            movieInput.value = "";


                            

                        });
                });

                results.appendChild(movieItem);

            });


        })
        .catch(error => {
            console.log(error);
        });

});

movieInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        searchBtn.click();
    }

});

backBtn.addEventListener("click", function () {

    console.log(hero);

    movieCard.style.display = "none";
    
    results.style.display = "block";
    movieCount.style.display = "block";
    trailerContainer.style.display = "none";
    trailerContainer.innerHTML = "";

    document.body.style.backgroundImage = "";

    moviePoster.removeAttribute("src");
    moviePoster.style.display = "none";

    window.scrollTo(0 ,0);

    
});

trailerBtn.addEventListener("click", function () {

    const movieName = movieTitle.textContent;

    if (movieName === "") return;
    trailerContainer.style.display = "block";

    window.open (
        `https://www.youtube.com/results?search_query=${movieName}+official+trailer`
    );
});

favoriteBtn.addEventListener("click", function () {
    const movieName = movieTitle.textContent;
    if( movieName === "") return;
    if ( favorites.includes(movieName)) {
        return;
    }
    favorites.push(movieName);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    console.log(favorites);
    favoritesList.innerHTML = "";
    favorites.forEach(function(movie) {
        favoritesList.innerHTML += movie + "<br>";
    });
});

function renderFavorites() {
    favoritesList.innerHTML = "";

    favorites.forEach(function(movie, index) {
        favoritesList.innerHTML += movie + ` <button onclick="removeFavorite(${index})">Delete</button><br>`;
    });
}


window.removeFavorite = function (index) {
    favorites.splice(index, 1);

    localStorage.setItem("favorites", JSON.stringify(favorites))
        
        
    

    renderFavorites();
}

renderFavorites();







    

   


