// ==========================================================
// WEIHNACHTS-COUNTDOWN FUNKTION
// ==========================================================

function updateCountdown() {
    // Ziel: Heiligabend, 24. Dezember dieses Jahres (00:00 Uhr)
    const now = new Date();
    
    // Wir nehmen das aktuelle Jahr, um den 24. Dezember festzulegen.
    let year = now.getFullYear();
    
    // Überprüfen, ob Weihnachten dieses Jahr schon vorbei ist (nach dem 24. Dez)
    if (now.getMonth() === 11 && now.getDate() > 24) {
        year = year + 1; // Zähle bis nächstes Jahr
    }

    // Heiligabend am 24. Dezember um 00:00:00 Uhr
    const christmas = new Date(year, 11, 24, 0, 0, 0).getTime();
    
    const distance = christmas - now.getTime();

    // Berechnung für Tage, Stunden, Minuten und Sekunden
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const countdownElement = document.getElementById('countdown-timer');
    if (countdownElement) {
        if (distance < 0) {
            countdownElement.innerHTML = "Frohe Weihnachten! 🎁";
        } else {
            countdownElement.innerHTML = `${days} Tage, ${hours} Stunden, ${minutes} Minuten, ${seconds} Sekunden`;
        }
    }
}

// Initialer Aufruf und Intervall
updateCountdown();
setInterval(updateCountdown, 1000);

// ==========================================================
// NEU: PREIS-ABRUF UND BERECHNUNG (CORE DES BOT-AGENTS)
// ==========================================================

async function fetchAndCalculatePrices() {
    try {
        const response = await fetch('./prices.json');
        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }
        const data = await response.json();
        
        let totalPrice = 0;

        // 1. Aktualisiere jeden einzelnen Wunsch und berechne die Summe
        data.wishes.forEach(item => {
            const priceElement = document.getElementById(`price-${item.id}`);
            const dateElement = document.getElementById(`date-${item.id}`);
            
            // Führe nur aus, wenn das Element existiert
            if (priceElement) {
                // Formatiere den Preis in Euro
                const formattedPrice = item.price.toLocaleString('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 2,
                });
                priceElement.textContent = formattedPrice;
                dateElement.textContent = data.last_updated;

                totalPrice += item.price;
            }
        });

        // 2. Aktualisiere den Gesamtpreis und das Update-Datum
        const totalElement = document.getElementById('total-price');
        const lastUpdateElement = document.getElementById('last-update');
        
        if (totalElement) {
            const formattedTotal = totalPrice.toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2,
            });
            totalElement.textContent = formattedTotal;
        }

        if (lastUpdateElement) {
            lastUpdateElement.textContent = data.last_updated;
        }

    } catch (error) {
        console.error("Fehler beim Laden oder Verarbeiten der Preise aus prices.json:", error);
        
        // Zeige Fehlermeldung auf der Seite an
        const totalElement = document.getElementById('total-price');
        if (totalElement) {
             totalElement.textContent = "Fehler beim Laden";
        }
    }
}

// ==========================================================
// STATUS (ERFÜLLT) LOGIK
// ==========================================================

function saveWishStatus(id, isFulfilled) {
    const status = JSON.parse(localStorage.getItem('wishStatus')) || {};
    status[id] = isFulfilled;
    localStorage.setItem('wishStatus', JSON.stringify(status));
}

function loadWishStatus() {
    const status = JSON.parse(localStorage.getItem('wishStatus')) || {};
    
    document.querySelectorAll('.wunsch-item').forEach(item => {
        const id = item.getAttribute('data-wish-id');
        if (status[id]) {
            item.classList.add('fulfilled');
            const button = item.querySelector('.mark-fulfilled');
            if (button) {
                 button.textContent = 'Erfüllt!';
                 button.disabled = true;
            }
        }
    });
}

function resetWishes() {
    localStorage.removeItem('wishStatus');
    window.location.reload(); 
}

// Event Listener für "Erfüllt" Buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('mark-fulfilled')) {
        const button = e.target;
        const id = button.getAttribute('data-wish-id');
        const item = button.closest('.wunsch-item');

        item.classList.add('fulfilled');
        button.textContent = 'Erfüllt!';
        button.disabled = true; 
        
        saveWishStatus(id, true);
    }
});


// ==========================================================
// FILTER FUNKTION
// ==========================================================

function filterWishes(category) {
    const wishItems = document.querySelectorAll('.wunsch-item');
    
    wishItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block'; 
        } else {
            item.style.display = 'none';
        }
    });
    
    // Aktiviere den richtigen Button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === category) {
            btn.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.getAttribute('data-filter');
            filterWishes(category);
        });
    });
    
    // Initialen Filter auf 'all' setzen, falls nicht anders gespeichert
    filterWishes('all');
});


// ==========================================================
// DARL MODE LOGIK & DOMContentLoaded (Ende des Scripts)
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    // ... (dein Dark Mode Code) ...
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = darkModeToggle ? darkModeToggle.querySelector('i') : null;

    const setDarkMode = (isEnabled) => {
        document.body.classList.toggle('dark-mode', isEnabled);
        if (darkModeIcon) {
            darkModeIcon.classList.replace(isEnabled ? 'fa-moon' : 'fa-sun', isEnabled ? 'fa-sun' : 'fa-moon');
            darkModeToggle.childNodes[1].nodeValue = isEnabled ? ' Light Mode' : ' Dark Mode';
        }
    };
    
    // Status beim Start prüfen
    if (localStorage.getItem('darkMode') === 'enabled' || (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setDarkMode(true); 
    } else {
        setDarkMode(false);
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const isDarkMode = document.body.classList.toggle('dark-mode');
            
            if (isDarkMode) {
                localStorage.setItem('darkMode', 'enabled');
                darkModeIcon.classList.replace('fa-moon', 'fa-sun');
                darkModeToggle.childNodes[1].nodeValue = ' Light Mode';
            } else {
                localStorage.setItem('darkMode', 'disabled');
                darkModeIcon.classList.replace('fa-sun', 'fa-moon');
                darkModeToggle.childNodes[1].nodeValue = ' Dark Mode';
            }
        });
    }

    // --- SCROLL ANIMATION LOGIK ---
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });

    // Status beim Laden der Seite laden
    loadWishStatus();
    
    // NEU: Beim Laden die Preise via Agent-Daten abrufen und berechnen
    fetchAndCalculatePrices();
});