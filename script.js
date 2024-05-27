document.getElementById('file-input').addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            parseCSV(content);
        };
        reader.readAsText(file);
    }
}

function showNewSection() {
    document.getElementById('upload-screen').style.display = 'none';
    document.getElementById('new-section').style.display = 'block';
}

function redirectToNetflix() {
    window.open('https://www.netflix.com/settings/viewed', '_blank');
}

document.getElementById('back-to-landing').addEventListener('click', () => {
    document.getElementById('new-section').style.display = 'none';
    document.getElementById('upload-screen').style.display = 'block';
});

function parseCSV(content) {
    const lines = content.split('\n');
    const titlesSet = new Set();

    // Ignorar la primera línea (asumimos que contiene los encabezados)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const [title] = line.split(',');
        if (title) {
            // Extraer el nombre de la serie sin la temporada
            const seriesNameMatch = title.match(/(.+?): (Season \d+|Limited Series|Part \d+|Chapter \d+)/);
            if (seriesNameMatch) {
                titlesSet.add(seriesNameMatch[1].trim());
            } else {
                titlesSet.add(title.trim());
            }
        }
    }

    const titles = Array.from(titlesSet);
    initializeApp(titles);
}

function initializeApp(titles) {
    document.getElementById('upload-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';

    let currentIndex = 0;
    const preferences = [];
    const toWatchList = [];

    const cardContainer = document.getElementById('card-container');
    const likeButton = document.getElementById('like');
    const dislikeButton = document.getElementById('dislike');
    const dontRememberButton = document.getElementById('dont-remember');
    const loveButton = document.getElementById('love');
    const addToListButton = document.getElementById('add-to-list');
    const previousButton = document.getElementById('previous');
    const downloadButton = document.getElementById('download');
    const counter = document.getElementById('counter');

    function updateCounter() {
        counter.innerHTML = `${preferences.length}/${titles.length} titles rated`;
    }

    function updateCard() {
        if (currentIndex < titles.length) {
            cardContainer.innerHTML = `<p>${titles[currentIndex]}</p>`;
            showButtons();
        } else {
            cardContainer.innerHTML = `<p>Listo! Ya tenemos tus opiniones, descárgalas <a id="download-link" href="#">acá</a>.</p>`;
            hideButtons();
            const downloadLink = document.getElementById('download-link');
            downloadLink.addEventListener('click', () => downloadPreferences());
        }
        updateCounter();
    }

    function showButtons() {
        likeButton.style.display = 'inline-flex';
        dislikeButton.style.display = 'inline-flex';
        dontRememberButton.style.display = 'inline-flex';
        loveButton.style.display = 'inline-flex';
        addToListButton.style.display = 'inline-flex';
        previousButton.style.display = 'inline-flex';
    }

    function hideButtons() {
        likeButton.style.display = 'none';
        dislikeButton.style.display = 'none';
        dontRememberButton.style.display = 'none';
        loveButton.style.display = 'none';
        addToListButton.style.display = 'none';
        previousButton.style.display = 'none';
        downloadButton.style.display = 'none';
    }

    likeButton.addEventListener('click', () => {
        preferences.push({ title: titles[currentIndex], preference: 'like' });
        currentIndex++;
        updateCard();
    });

    dislikeButton.addEventListener('click', () => {
        preferences.push({ title: titles[currentIndex], preference: 'dislike' });
        currentIndex++;
        updateCard();
    });

    dontRememberButton.addEventListener('click', () => {
        preferences.push({ title: titles[currentIndex], preference: "don't remember" });
        currentIndex++;
        updateCard();
    });

    loveButton.addEventListener('click', () => {
        preferences.push({ title: titles[currentIndex], preference: 'love' });
        currentIndex++;
        updateCard();
    });

    addToListButton.addEventListener('click', () => {
        toWatchList.push(titles[currentIndex]);
        currentIndex++;
        updateCard();
    });

    previousButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            preferences.pop();
            updateCard();
        } else {
            document.getElementById('app').style.display = 'none';
            document.getElementById('upload-screen').style.display = 'block';
        }
    });

    function downloadPreferences() {
        const csvContent = "data:text/csv;charset=utf-8," 
            + preferences.map(e => `${e.title},${e.preference}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "preferences.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Start with the first title
    updateCard();
}


    // Start with the first title
    updateCard();
}
