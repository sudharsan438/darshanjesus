(() => {
    "use strict";

    const { createClient } = window.supabase || {};

    const ready =
        typeof createClient === "function" &&
        window.DARSHAN_SUPABASE_URL &&
        !window.DARSHAN_SUPABASE_URL.includes("YOUR_") &&
        window.DARSHAN_SUPABASE_ANON_KEY &&
        !window.DARSHAN_SUPABASE_ANON_KEY.includes("YOUR_");

    const client = ready
        ? createClient(
            window.DARSHAN_SUPABASE_URL,
            window.DARSHAN_SUPABASE_ANON_KEY
        )
        : null;

    const grid = document.getElementById("grid");
    const loading = document.getElementById("loading");
    const empty = document.getElementById("empty");
    const error = document.getElementById("error");
    const modal = document.getElementById("story-modal");
    const modalMedia = document.getElementById("modal-media");
    const modalCategory = document.getElementById("modal-category");
    const modalTitle = document.getElementById("modal-title");
    const modalStory = document.getElementById("modal-story");
    const modalSource = document.getElementById("modal-source");
    const backButton = document.getElementById("back-to-sacred");

    let stories = [];
    let filter = "all";
    let lastFocusedElement = null;

    const labels = {
        temple: "TEMPLES",
        mystery: "MYSTERY PLACES",
        ancient: "ANCIENT STORIES",
        spiritual: "SPIRITUAL",
        video: "FEATURED VIDEO"
    };

    function youtubeId(url) {
        try {
            const u = new URL(url);
            const host = u.hostname.replace(/^www\./, "");

            if (host === "youtu.be") {
                return u.pathname.slice(1).split("/")[0] || null;
            }

            if (host === "youtube.com" || host === "m.youtube.com") {
                if (u.searchParams.get("v")) {
                    return u.searchParams.get("v");
                }

                const parts = u.pathname.split("/").filter(Boolean);
                const index = parts.findIndex(part =>
                    part === "embed" || part === "shorts" || part === "live"
                );

                if (index >= 0 && parts[index + 1]) {
                    return parts[index + 1];
                }
            }
        } catch (e) {
            console.warn("Invalid YouTube URL:", url);
        }

        return null;
    }

    function esc(value) {
        return String(value || "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char]));
    }

    function render() {
        const list = filter === "all"
            ? stories
            : stories.filter(item => item.category === filter);

        grid.innerHTML = "";
        empty.hidden = list.length !== 0;

        list.forEach(item => {
            const card = document.createElement("article");
            card.className = "story-card";

            let media = "";

            if (item.image_url) {
                media = `
                    <div class="card-media">
                        <img
                            src="${esc(item.image_url)}"
                            alt="${esc(item.title)}"
                            loading="lazy"
                        >
                        ${item.video_url ? '<span class="video-badge">▶ VIDEO</span>' : ""}
                    </div>
                `;
            } else {
                media = '<div class="card-media no-image">DARSHAN</div>';
            }

            card.innerHTML = `
                ${media}
                <div class="card-body">
                    <div class="tag">${esc(labels[item.category] || "DARSHAN DAILY")}</div>
                    <h2>${esc(item.title)}</h2>
                    <p>${esc(item.excerpt)}</p>
                    <button class="read" type="button">
                        ${item.video_url ? "WATCH STORY →" : "DISCOVER →"}
                    </button>
                    <div class="card-meta">${esc(item.publish_date || "")}</div>
                </div>
            `;

            const image = card.querySelector("img");
            if (image) {
                image.addEventListener("error", () => {
                    const mediaBox = image.closest(".card-media");
                    if (mediaBox) {
                        mediaBox.classList.add("no-image");
                        image.remove();
                    }
                });
            }

            card.querySelector(".read").addEventListener("click", () => {
                openStory(item);
            });

            grid.appendChild(card);
        });
    }

    function openStory(item) {
        lastFocusedElement = document.activeElement;

        modalCategory.textContent = labels[item.category] || "DARSHAN DAILY";
        modalTitle.textContent = item.title || "";
        modalStory.textContent = item.story || item.excerpt || "";
        modalSource.textContent = item.source_name
            ? `Source: ${item.source_name}`
            : "";

        const id = item.video_url ? youtubeId(item.video_url) : null;

        if (id) {
            modalMedia.innerHTML = `
                <iframe
                    src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0"
                    title="${esc(item.title)}"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                ></iframe>
            `;
        } else if (item.image_url) {
            modalMedia.innerHTML = `
                <img src="${esc(item.image_url)}" alt="${esc(item.title)}">
            `;
        } else {
            modalMedia.innerHTML = "";
        }

        modal.hidden = false;
        document.body.classList.add("modal-open");
        backButton.focus();
    }

    function closeStory() {
        modal.hidden = true;
        modalMedia.innerHTML = "";
        document.body.classList.remove("modal-open");

        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
            lastFocusedElement.focus();
        }
    }

    document.querySelectorAll("[data-close]").forEach(element => {
        element.addEventListener("click", closeStory);
    });

    backButton.addEventListener("click", closeStory);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !modal.hidden) {
            closeStory();
        }
    });

    document.querySelectorAll("#filters button").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll("#filters button").forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");
            filter = button.dataset.category || "all";
            render();
        });
    });

    async function load() {
        document.getElementById("year").textContent = new Date().getFullYear();

        if (!client) {
            loading.hidden = true;
            error.hidden = false;
            return;
        }

        try {
            const { data, error: queryError } = await client
                .from("darshan_stories")
                .select(
                    "id,publish_date,category,title,excerpt,story,image_url,video_url,source_name,source_url"
                )
                .eq("published", true)
                .order("publish_date", { ascending: false })
                .order("created_at", { ascending: false })
                .limit(30);

            if (queryError) {
                throw queryError;
            }

            stories = data || [];
            loading.hidden = true;

            if (!stories.length) {
                empty.hidden = false;
                return;
            }

            render();
        } catch (loadError) {
            console.error("Sacred & Mystery load error:", loadError);
            loading.hidden = true;
            error.hidden = false;
        }
    }

    load();
})();
