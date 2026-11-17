
const STORAGE_KEY = "sasiya_movies_v1";
const WATCH_KEY = "sasiya_watchlist_v1";

const sampleMovies = [
  {
    id:"m1", title:"Inception", year:2010, genre:"Sci-Fi",
    poster:"https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    description:"A skilled thief enters dreams to perform a complex mission."
  },
  {
    id:"m2", title:"Interstellar", year:2014, genre:"Sci-Fi",
    poster:"https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    description:"A team travels beyond Earth in search of a future for humanity."
  },
  {
    id:"m3", title:"The Dark Knight", year:2008, genre:"Action",
    poster:"https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    description:"A hero faces a dangerous new challenge in Gotham City."
  },
  {
    id:"m4", title:"Avatar", year:2009, genre:"Adventure",
    poster:"https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    description:"A new world changes the life of a former marine."
  },
  {
    id:"m5", title:"Coco", year:2017, genre:"Animation",
    poster:"https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg",
    description:"A young musician discovers family stories and traditions."
  },
  {
    id:"m6", title:"Gladiator", year:2000, genre:"Drama",
    poster:"https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    description:"A former general faces the challenges of the Roman arena."
  },
  {
    id:"m7", title:"Dune", year:2021, genre:"Adventure",
    poster:"https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    description:"A young noble enters a world of political conflict."
  },
  {
    id:"m8", title:"Spider-Man: Into the Spider-Verse", year:2018, genre:"Animation",
    poster:"https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
    description:"A young hero discovers a world of alternate dimensions."
  }
];

let movies = loadMovies();
let watchlist = loadWatchlist();
let currentCategory = "All";

function loadMovies() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : sampleMovies;
  } catch {
    return sampleMovies;
  }
}

function loadWatchlist() {
  try {
    const data = JSON.parse(localStorage.getItem(WATCH_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveMovies() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

function saveWatchlist() {
  localStorage.setItem(WATCH_KEY, JSON.stringify(watchlist));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;",
    '"':"&quot;", "'":"&#39;"
  })[char]);
}

function renderMovies() {
  const search = document.getElementById("searchInput").value.toLowerCase();

  const filtered = movies.filter(movie => {
    const matchesCategory = currentCategory === "All" ||
      movie.genre.toLowerCase() === currentCategory.toLowerCase();

    const matchesSearch =
      movie.title.toLowerCase().includes(search) ||
      movie.genre.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  document.getElementById("movieGrid").innerHTML =
    filtered.map(movieCard).join("");

  document.getElementById("emptyState").hidden = filtered.length > 0;
  document.getElementById("movieCount").textContent = movies.length;
}

function movieCard(movie) {
  const id = escapeHTML(movie.id);

  return `
    <article class="movie-card">
      <div class="poster-wrap">
        <img src="${escapeHTML(movie.poster)}"
             alt="${escapeHTML(movie.title)} poster"
             loading="lazy"
             onerror="this.src='https://placehold.co/400x600/171725/ffffff?text=No+Poster'">
      </div>
      <div class="movie-info">
        <h3>${escapeHTML(movie.title)}</h3>
        <p>${escapeHTML(movie.year)} • ${escapeHTML(movie.genre)}</p>
        <div class="card-actions">
          <button class="btn-primary" onclick="showMovie('${id}')">Details</button>
          <button class="btn-outline" onclick="toggleWatchlist('${id}')">
            ${watchlist.includes(movie.id) ? "✓ Saved" : "+ Watchlist"}
          </button>
        </div>
      </div>
    </article>
  `;
}

function setCategory(category, button) {
  currentCategory = category;
  document.querySelectorAll(".filter").forEach(el => el.classList.remove("active"));
  button.classList.add("active");
  renderMovies();
}

function renderWatchlist() {
  const saved = movies.filter(movie => watchlist.includes(movie.id));

  document.getElementById("watchlistGrid").innerHTML =
    saved.length ? saved.map(movieCard).join("") :
    '<p class="empty">Your watchlist is empty.</p>';
}

function toggleWatchlist(id) {
  if (watchlist.includes(id)) {
    watchlist = watchlist.filter(item => item !== id);
    toast("Removed from watchlist");
  } else {
    watchlist.push(id);
    toast("Added to watchlist");
  }

  saveWatchlist();
  renderMovies();
  renderWatchlist();
  updateAdminStats();
}

function showMovie(id) {
  const movie = movies.find(item => item.id === id);
  if (!movie) return;

  document.getElementById("detailImage").src = movie.poster;
  document.getElementById("detailTitle").textContent = movie.title;
  document.getElementById("detailDescription").textContent = movie.description;
  document.getElementById("detailMeta").textContent =
    `${movie.year} • ${movie.genre}`;

  document.getElementById("detailWatchlist").onclick = () =>
    toggleWatchlist(movie.id);

  openModal("movieModal");
}

function showFeatured() {
  if (movies.length) showMovie(movies[0].id);
}

function openLogin() {
  openModal("loginModal");
}

function openAdmin() {
  openModal("adminModal");
}

function openModal(id) {
  document.getElementById(id).classList.add("show");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("show");
}

function toggleMenu() {
  document.querySelector("nav").classList.toggle("open");
}

function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2500);
}

document.getElementById("authForm").addEventListener("submit", event => {
  event.preventDefault();
  toast("Demo only: connect a secure authentication backend.");
  event.target.reset();
  closeModal("loginModal");
});

document.getElementById("adminLoginForm").addEventListener("submit", event => {
  event.preventDefault();

  toast("Demo admin panel unlocked.");
  document.getElementById("adminPanel").hidden = false;
  document.getElementById("adminLoginForm").hidden = true;
  renderAdmin();
});

function renderAdmin() {
  updateAdminStats();

  document.getElementById("adminMovieList").innerHTML = movies.map(movie => `
    <div class="admin-row">
      <span>${escapeHTML(movie.title)}</span>
      <div>
        <button class="btn-outline" onclick="editMovie('${escapeHTML(movie.id)}')">Edit</button>
        <button class="btn-outline" onclick="deleteMovie('${escapeHTML(movie.id)}')">Delete</button>
      </div>
    </div>
  `).join("");
}

function updateAdminStats() {
  document.getElementById("adminMovieCount").textContent = movies.length;
  document.getElementById("adminWatchCount").textContent = watchlist.length;
}

document.getElementById("movieForm").addEventListener("submit", event => {
  event.preventDefault();

  const id = document.getElementById("editId").value || crypto.randomUUID();

  const movie = {
    id,
    title: document.getElementById("movieTitle").value.trim(),
    year: Number(document.getElementById("movieYear").value),
    genre: document.getElementById("movieGenre").value.trim(),
    poster: document.getElementById("moviePoster").value.trim(),
    description: document.getElementById("movieDescription").value.trim()
  };

  const existingIndex = movies.findIndex(item => item.id === id);

  if (existingIndex >= 0) {
    movies[existingIndex] = movie;
  } else {
    movies.unshift(movie);
  }

  saveMovies();
  event.target.reset();
  document.getElementById("editId").value = "";

  renderMovies();
  renderWatchlist();
  renderAdmin();
  toast("Movie saved successfully");
});

function editMovie(id) {
  const movie = movies.find(item => item.id === id);
  if (!movie) return;

  document.getElementById("editId").value = movie.id;
  document.getElementById("movieTitle").value = movie.title;
  document.getElementById("movieYear").value = movie.year;
  document.getElementById("movieGenre").value = movie.genre;
  document.getElementById("moviePoster").value = movie.poster;
  document.getElementById("movieDescription").value = movie.description;

  document.getElementById("movieTitle").focus();
}

function deleteMovie(id) {
  if (!confirm("Delete this movie?")) return;

  movies = movies.filter(movie => movie.id !== id);
  watchlist = watchlist.filter(item => item !== id);

  saveMovies();
  saveWatchlist();

  renderMovies();
  renderWatchlist();
  renderAdmin();
  toast("Movie deleted");
}

document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", event => {
    if (event.target === modal) modal.classList.remove("show");
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal.show").forEach(modal =>
      modal.classList.remove("show")
    );
  }
});

document.getElementById("heroPoster").style.backgroundImage =
  `url("${movies[0]?.poster || ""}")`;

renderMovies();
renderWatchlist();
