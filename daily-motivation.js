const configReady =
    window.DARSHAN_SUPABASE_URL &&
    window.DARSHAN_SUPABASE_ANON_KEY &&
    !window.DARSHAN_SUPABASE_URL.includes("YOUR_") &&
    !window.DARSHAN_SUPABASE_ANON_KEY.includes("YOUR_");

const loading = document.getElementById("loading");
const post = document.getElementById("today-post");
const empty = document.getElementById("empty");
const error = document.getElementById("error");

function indiaToday() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date());
}

function prettyDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`);
    return new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(date);
}

async function loadToday() {
    document.getElementById("today-date").textContent = prettyDate(indiaToday());
    document.getElementById("year").textContent = new Date().getFullYear();

    if (!configReady) {
        loading.hidden = true;
        error.hidden = false;
        error.textContent = "Darshan Daily is waiting for its Supabase configuration.";
        return;
    }

    try {
        const { createClient } = window.supabase;
        const client = createClient(
            window.DARSHAN_SUPABASE_URL,
            window.DARSHAN_SUPABASE_ANON_KEY
        );

        const { data, error: queryError } = await client
            .from("daily_motivation")
            .select("publish_date,title,motivation,quote,history,reflection")
            .eq("publish_date", indiaToday())
            .eq("published", true)
            .maybeSingle();

        if (queryError) throw queryError;

        loading.hidden = true;

        if (!data) {
            empty.hidden = false;
            return;
        }

        document.getElementById("post-title").textContent = data.title;
        document.getElementById("motivation").textContent = data.motivation;

        if (data.quote) {
            document.getElementById("quote").textContent = data.quote;
            document.getElementById("quote-card").hidden = false;
        }

        if (data.history) {
            document.getElementById("history").textContent = data.history;
            document.getElementById("history-section").hidden = false;
        }

        if (data.reflection) {
            document.getElementById("reflection").textContent = data.reflection;
            document.getElementById("reflection-section").hidden = false;
        }

        post.hidden = false;
    } catch (err) {
        console.error("Darshan Daily Motivation error:", err);
        loading.hidden = true;
        error.hidden = false;
    }
}

loadToday();
