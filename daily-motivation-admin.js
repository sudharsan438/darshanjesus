const ready =
    window.DARSHAN_SUPABASE_URL &&
    window.DARSHAN_SUPABASE_ANON_KEY &&
    !window.DARSHAN_SUPABASE_URL.includes("YOUR_") &&
    !window.DARSHAN_SUPABASE_ANON_KEY.includes("YOUR_");

const loginPanel = document.getElementById("login-panel");
const editorPanel = document.getElementById("editor-panel");
const loginStatus = document.getElementById("login-status");
const saveStatus = document.getElementById("save-status");
const logoutButton = document.getElementById("logout");
const form = document.getElementById("post-form");

let client = null;
let currentPosts = [];

function indiaToday() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date());
}

function setStatus(element, message, isError = false) {
    element.textContent = message;
    element.classList.toggle("error", isError);
}

function resetForm() {
    form.reset();
    document.getElementById("post-id").value = "";
    document.getElementById("publish-date").value = indiaToday();
    document.getElementById("published").checked = true;
    setStatus(saveStatus, "");
}

function showEditor(user) {
    loginPanel.hidden = true;
    editorPanel.hidden = false;
    logoutButton.hidden = false;
    document.getElementById("signed-in-as").textContent = user.email || "";
    resetForm();
    loadPosts();
}

async function loadPosts() {
    const list = document.getElementById("posts-list");
    list.textContent = "Loading…";

    const { data, error } = await client
        .from("daily_motivation")
        .select("id,publish_date,title,motivation,quote,history,reflection,published")
        .order("publish_date", { ascending: false })
        .limit(30);

    if (error) {
        list.textContent = error.message;
        return;
    }

    currentPosts = data || [];

    if (!currentPosts.length) {
        list.textContent = "No posts yet. Create your first day above.";
        return;
    }

    list.innerHTML = currentPosts.map(item => `
        <div class="post-item">
            <div class="post-meta">
                <div class="post-date">${item.publish_date} · ${item.published ? "PUBLISHED" : "DRAFT"}</div>
                <div class="post-title">${escapeHtml(item.title)}</div>
            </div>
            <div class="post-actions">
                <button class="secondary" type="button" data-edit="${item.id}">EDIT</button>
                <button class="secondary" type="button" data-delete="${item.id}">DELETE</button>
            </div>
        </div>
    `).join("");

    list.querySelectorAll("[data-edit]").forEach(button => {
        button.addEventListener("click", () => editPost(Number(button.dataset.edit)));
    });

    list.querySelectorAll("[data-delete]").forEach(button => {
        button.addEventListener("click", () => deletePost(Number(button.dataset.delete)));
    });
}

function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[char]));
}

function editPost(id) {
    const item = currentPosts.find(post => post.id === id);
    if (!item) return;

    document.getElementById("post-id").value = item.id;
    document.getElementById("publish-date").value = item.publish_date;
    document.getElementById("title").value = item.title || "";
    document.getElementById("motivation").value = item.motivation || "";
    document.getElementById("quote").value = item.quote || "";
    document.getElementById("history").value = item.history || "";
    document.getElementById("reflection").value = item.reflection || "";
    document.getElementById("published").checked = !!item.published;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deletePost(id) {
    const item = currentPosts.find(post => post.id === id);
    if (!item) return;

    if (!confirm(`Delete the post for ${item.publish_date}?`)) return;

    const { error } = await client
        .from("daily_motivation")
        .delete()
        .eq("id", id);

    if (error) {
        setStatus(saveStatus, error.message, true);
        return;
    }

    setStatus(saveStatus, "Post deleted.");
    loadPosts();
    resetForm();
}

document.getElementById("login").addEventListener("click", async () => {
    if (!ready) {
        setStatus(loginStatus, "Add the Supabase URL and anon/publishable key first.", true);
        return;
    }

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    setStatus(loginStatus, "Signing in…");

    const { data, error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
        setStatus(loginStatus, error.message, true);
        return;
    }

    showEditor(data.user);
});

logoutButton.addEventListener("click", async () => {
    await client.auth.signOut();
    editorPanel.hidden = true;
    loginPanel.hidden = false;
    logoutButton.hidden = true;
    setStatus(loginStatus, "Signed out.");
});

document.getElementById("new-post").addEventListener("click", resetForm);

form.addEventListener("submit", async event => {
    event.preventDefault();

    const id = document.getElementById("post-id").value;
    const payload = {
        publish_date: document.getElementById("publish-date").value,
        title: document.getElementById("title").value.trim(),
        motivation: document.getElementById("motivation").value.trim(),
        quote: document.getElementById("quote").value.trim() || null,
        history: document.getElementById("history").value.trim() || null,
        reflection: document.getElementById("reflection").value.trim() || null,
        published: document.getElementById("published").checked
    };

    setStatus(saveStatus, "Saving…");

    const result = id
        ? await client.from("daily_motivation").update(payload).eq("id", Number(id))
        : await client.from("daily_motivation").insert(payload);

    if (result.error) {
        setStatus(saveStatus, result.error.message, true);
        return;
    }

    setStatus(saveStatus, id ? "Post updated successfully." : "Post published successfully.");
    resetForm();
    loadPosts();
});

(async function init() {
    if (!ready) {
        setStatus(loginStatus, "Supabase configuration is not set yet.", true);
        return;
    }

    client = window.supabase.createClient(
        window.DARSHAN_SUPABASE_URL,
        window.DARSHAN_SUPABASE_ANON_KEY
    );

    const { data } = await client.auth.getSession();

    if (data.session?.user) {
        showEditor(data.session.user);
    }
})();


// SACRED & MYSTERY STORY ADMIN
const storyForm=document.getElementById("story-form");
if(storyForm){
const storyStatus=document.getElementById("story-status"),storiesList=document.getElementById("stories-list");
const storyDate=document.getElementById("story-date");
function storyToday(){return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date())}
function storyReset(){storyForm.reset();document.getElementById("story-id").value="";storyDate.value=storyToday();document.getElementById("story-published").checked=true}
async function loadStories(){if(!client)return;const {data,error}=await client.from("darshan_stories").select("*").order("publish_date",{ascending:false}).order("created_at",{ascending:false}).limit(30);if(error){storiesList.textContent=error.message;return}storiesList.innerHTML=(data||[]).map(x=>`<div class="post-item"><div class="post-meta"><div class="post-date">${x.publish_date} · ${x.published?"PUBLISHED":"DRAFT"}</div><div class="post-title">${escapeHtml(x.title)}</div></div><div class="post-actions"><button class="secondary" type="button" data-story-edit="${x.id}">EDIT</button><button class="secondary" type="button" data-story-delete="${x.id}">DELETE</button></div></div>`).join("")||"No stories yet.";storiesList.querySelectorAll("[data-story-edit]").forEach(b=>b.onclick=()=>editStory(Number(b.dataset.storyEdit)));storiesList.querySelectorAll("[data-story-delete]").forEach(b=>b.onclick=()=>deleteStory(Number(b.dataset.storyDelete)))}
let storyCache=[];async function refreshStoryCache(){const {data}=await client.from("darshan_stories").select("*").order("publish_date",{ascending:false}).limit(30);storyCache=data||[];await loadStories()}
function editStory(id){const x=storyCache.find(a=>a.id===id);if(!x)return;document.getElementById("story-id").value=x.id;storyDate.value=x.publish_date;document.getElementById("story-category").value=x.category;document.getElementById("story-title").value=x.title||"";document.getElementById("story-excerpt").value=x.excerpt||"";document.getElementById("story-story").value=x.story||"";document.getElementById("story-image").value=x.image_url||"";document.getElementById("story-video").value=x.video_url||"";document.getElementById("story-source").value=x.source_name||"";document.getElementById("story-source-url").value=x.source_url||"";document.getElementById("story-published").checked=!!x.published;storyForm.scrollIntoView({behavior:"smooth"})}
async function deleteStory(id){if(!confirm("Delete this story?"))return;const {error}=await client.from("darshan_stories").delete().eq("id",id);if(error){setStatus(storyStatus,error.message,true);return}setStatus(storyStatus,"Story deleted.");storyReset();refreshStoryCache()}
storyForm.addEventListener("submit",async e=>{e.preventDefault();const id=document.getElementById("story-id").value;const payload={publish_date:storyDate.value,category:document.getElementById("story-category").value,title:document.getElementById("story-title").value.trim(),excerpt:document.getElementById("story-excerpt").value.trim(),story:document.getElementById("story-story").value.trim(),image_url:document.getElementById("story-image").value.trim()||null,video_url:document.getElementById("story-video").value.trim()||null,source_name:document.getElementById("story-source").value.trim()||null,source_url:document.getElementById("story-source-url").value.trim()||null,published:document.getElementById("story-published").checked};setStatus(storyStatus,"Saving…");const r=id?await client.from("darshan_stories").update(payload).eq("id",Number(id)):await client.from("darshan_stories").insert(payload);if(r.error){setStatus(storyStatus,r.error.message,true);return}setStatus(storyStatus,id?"Story updated successfully.":"Story published successfully.");storyReset();refreshStoryCache()});
const oldShowEditor=showEditor;showEditor=function(user){oldShowEditor(user);setTimeout(()=>{storyReset();refreshStoryCache()},0)};
}
