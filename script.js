const API_KEY = config.API_KEY;
const url = "https://gnews.io/api/v4/search?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        console.log("Fetching news for:", query);
        console.log("Full URL:", `${url}${query}&token=${API_KEY}&lang=en`);
        
        const res = await fetch(`${url}${query}&token=${API_KEY}&lang=en`);
        console.log("Response status:", res.status);
        
        const data = await res.json();
        console.log("API Response:", data);
        
        if (data.errors) {
            console.error("API Errors:", data.errors);
            return;
        }
        
        if (!data.articles || data.articles.length === 0) {
            console.log("No articles found");
            return;
        }
        
        console.log("Number of articles:", data.articles.length);
        bindData(data.articles);
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    console.log("Processing articles:", articles);

    articles.forEach((article, index) => {
        console.log(`Article ${index}:`, article);
        
        // GNews API uses 'image' instead of 'urlToImage'
        if (!article.image) {
            console.log(`Article ${index} skipped: no image`);
            return;
        }
        
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
    
    console.log("Cards added to container");
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    // GNews API property mapping:
    newsImg.src = article.image; // was article.urlToImage
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
