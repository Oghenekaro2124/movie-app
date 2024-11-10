const movieDataDiv =document.getElementById("movie-data");

let page = 1;
let totalMovieOnDb = 0;
let totalMovieFetched = 0;

const fetchMovieData = async (page) => {
    try {
        // send http Get request to TMBD API server
        const response = await fetch(
       `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
       {
        method: "GET",
        headers:{
        accept:"application/json",
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNTUzYzhhMThlZTI2ODJkZWFiYjE4MTI1ZDA2MzE1MSIsIm5iZiI6MTcyNjY1NjcxMC4wMzAzNTYsInN1YiI6IjY2ZWFhZGM4NWMwNTE5YTIzNGQzNTViYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xJDU1IrUXtwDiCbV3hpcWx3AoSknE-A_8xzDTaEAY7M"
        },
       }
        );


     const data = await response.json();


     if (data && data.results.length > 0) {
         totalMovieFetched += data.results.length;
         totalMovieOnDb = data.total_results;

         const fragment = document.createDocumentFragment(); // Use a document fragment for efficiency

         data.results.forEach((movie, index) => {
             const movieCol = document.createElement("div");
             movieCol.classList.add("col-12", "col-md-6", "col-lg-3", "mb-4");

             const modalId = `modal-page-${page}-index-${index}`; // Unique modal ID

             movieCol.innerHTML = `
             <div class="card" style="width: 100%;">
                 <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="..." class="card-img-top" />
                 <div class="card-body">
                     <h5 class="card-title">${movie.original_title}</h5>
                     <p class="card-text">
                         ${movie.overview.substring(0, 90)}...
                     </p>
                     <button type="button" class="btn btn-primary"
                         data-bs-toggle="modal"
                         data-bs-target="#${modalId}">
                         Click Me
                     </button>

                     <div class="modal fade" id="${modalId}">
                         <div class="modal-dialog modal-md">
                             <div class="modal-content">
                                 <div class="modal-header">
                                     <h1 class="modal-title" id="${modalId}Label">${movie.original_title}</h1>
                                     <button type="button" class="btn-close"
                                         data-bs-dismiss="modal" aria-label="Close">
                                     </button>
                                 </div>
                                 <div class="modal-body">
                                     <h2 class="card-text">${movie.id}</h2>
                                     <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" height="100%" width="100%" alt="..." class="d-block w-100" />
                                     <br>
                                     <p class="card-text">${movie.overview}</p>
                                     <br>
                                     <p class="card-text">${movie.release_date}</p>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>`;

             fragment.appendChild(movieCol);
         });

         movieDataDiv.appendChild(fragment); // Append all at once for efficiency
         console.log(data.results);
     }
// Throw new error("failed to fetch movie data");
    } catch (error ) {
        document.getElementById("error-message").textContent = 
        error.message || "something went wrong";
    } 
};

// on scroll function handler
const onScrollPage = async () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight -1000;
    const clientHeight = document.documentElement.clientHeight;

    // console.log(scrollTop, scrollHeight, clientHeight);

    // stop fetching data if all data i fetched
    if (totalMovieFetched >= totalMovieOnDb) {
        return;
    }

    if (scrollTop + clientHeight >= scrollHeight -200){ //adjust threshold dynamically
        page += 1;
        await fetchMovieData(page);
    }

};

 window.addEventListener("load", () => fetchMovieData(page));
 window.addEventListener("scroll", onScrollPage);