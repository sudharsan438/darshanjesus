/* =========================================================
   DARSHAN VIDEO NEWS
   YouTube Data API via Netlify Function
   ========================================================= */

const API_URL = "/.netlify/functions/news-videos";

const categories = {
    india: { title: "India", query: "India news latest" },
    world: { title: "World", query: "world news latest" },
    technology: { title: "Technology", query: "technology news latest" },
    business: { title: "Business", query: "business news latest" },
    science: { title: "Science", query: "science news latest" },
    sports: { title: "Sports", query: "sports news latest" }
};

const grid = document.getElementById("video-grid");
const loading = document.getElementById("video-loading");
const errorBox = document.getElementById("video-error");
const errorText = document.getElementById("video-error-text");
const retryButton = document.getElementById("retry-button");
const refreshButton = document.getElementById("refresh-button");
const sectionTitle = document.getElementById("section-title");
const categoryButtons = document.querySelectorAll(".category-button");
const modal = document.getElementById("video-modal");
const frame = document.getElementById("video-frame");
const closeModalButton = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const modalChannel = document.getElementById("modal-channel");
const modalDate = document.getElementById("modal-date");

let currentCategory = "india";
let currentVideos = [];

function showLoading() {
    loading.hidden = false;
    grid.innerHTML = "";
    errorBox.hidden = true;
}

function showError(message) {
    loading.hidden = true;
    grid.innerHTML = "";
    errorText.textContent = message || "Please try again in a moment.";
    errorBox.hidden = false;
}

function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recently published";

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    }).format(date);
}

function createCard(video, index) {
    const card = document.createElement("article");
    card.className = "video-card";

    const thumb = video.thumbnail || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;
    const title = video.title || "News video";
    const channel = video.channelTitle || "YouTube";

    card.innerHTML = `
        <div class="video-thumb">
            <img src="${escapeHtml(thumb)}" alt="" loading="${index < 2 ? "eager" : "lazy"}">
            <button class="play-button" type="button" aria-label="Play ${escapeHtml(title)}">▶</button>
        </div>
        <div class="video-card-body">
            <p class="video-channel">${escapeHtml(channel)}</p>
            <h3 class="video-title">${escapeHtml(title)}</h3>
            <p class="video-date">${formatDate(video.publishedAt)}</p>
        </div>
    `;

    card.querySelector(".play-button").addEventListener("click", () => openModal(video));
    card.querySelector(".video-thumb").addEventListener("click", (event) => {
        if (!event.target.closest("button")) openModal(video);
    });

    return card;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function renderVideos(videos) {
    loading.hidden = true;
    errorBox.hidden = true;
    grid.innerHTML = "";

    if (!videos.length) {
        showError("No fresh videos were found for this category. Try another category.");
        return;
    }

    videos.forEach((video, index) => {
        grid.appendChild(createCard(video, index));
    });
}

async function fetchVideos(categoryKey = currentCategory) {
    currentCategory = categoryKey;
    const settings = categories[categoryKey];

    sectionTitle.textContent = settings.title;
    showLoading();

    try {
        const params = new URLSearchParams({
            q: settings.query,
            maxResults: "8",
            regionCode: "IN",
            language: "en"
        });

        const response = await fetch(`${API_URL}?${params.toString()}`, {
            headers: { Accept: "application/json" },
            cache: "no-store"
        });

        const data = await response.json();

        if (!response.ok || data.status !== "success") {
            throw new Error(data.message || "Video service is unavailable.");
        }

        currentVideos = Array.isArray(data.results) ? data.results : [];
        renderVideos(currentVideos);
    } catch (error) {
        console.error("Darshan Video News error:", error);
        showError(error.message || "We couldn't load fresh videos right now.");
    }
}

function openModal(video) {
    if (!video.videoId) return;

    frame.src = `https://www.youtube.com/embed/${encodeURIComponent(video.videoId)}?autoplay=1&rel=0&playsinline=1`;
    frame.title = video.title || "Darshan news video";
    modalTitle.textContent = video.title || "News video";
    modalChannel.textContent = video.channelTitle || "YouTube";
    modalDate.textContent = formatDate(video.publishedAt);

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    closeModalButton.focus();
}

function closeModal() {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    frame.src = "";
    document.body.classList.remove("modal-open");
}

categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        categoryButtons.forEach(item => item.classList.remove("active"));
        button.classList.add("active");
        fetchVideos(button.dataset.category);
    });
});

refreshButton.addEventListener("click", () => fetchVideos(currentCategory));
retryButton.addEventListener("click", () => fetchVideos(currentCategory));
closeModalButton.addEventListener("click", closeModal);
modal.querySelector("[data-close-modal]").addEventListener("click", closeModal);

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
});

fetchVideos("india");
