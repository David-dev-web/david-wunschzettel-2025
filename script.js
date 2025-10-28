// ==========================================================
// WEIHNACHTS-COUNTDOWN FUNKTION
// (Bleibt unverändert)
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

    const countdownElement = document.getElementById('countdownTimer');
    
    if (countdownElement) {
        if (distance < 0) {
            // Falls der Zähler abgelaufen ist
            countdownElement.innerHTML = "🎄 FROHE WEIHNACHTEN! 🎅";
        } else {
            // Zeigt den Countdown an
            countdownElement.innerHTML = `${days} TAGE, ${hours} STD., ${minutes} MIN., ${seconds} SEK.`;
        }
    }
}

// Countdown sofort starten und jede Sekunde aktualisieren
updateCountdown();
setInterval(updateCountdown, 1000);


// ==========================================================
// NEU: AGENT FUNKTION - DATEN FETCHEN & BERECHNEN
// ==========================================================

async function fetchAndCalculatePrices() {
    let total = 0;
    const totalPriceElement = document.getElementById('totalPrice');
    
    try {
        // 1. Daten von der JSON-Datei abrufen (simuliert den Agenten-Output)
        const response = await fetch('./prices.json');
        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }
        const priceData = await response.json();

        // 2. Wunsch-Status laden (welche Wünsche sind erfüllt?)
        const storedStatus = JSON.parse(localStorage.getItem('wishlistStatus') || '{}');

        // 3. Durch alle Preise aus dem JSON iterieren
        priceData.wishes.forEach(wish => {
            const wishItem = document.querySelector(`.wunsch-item[data-wish-id="${wish.id}"]`);
            
            // Preis- und Datumselemente aktualisieren
            const priceElement = document.getElementById(`price-${wish.id}`);
            const dateElement = document.getElementById(`date-${wish.id}`);

            if (priceElement && dateElement) {
                // Preis formatieren (z.B. 599.99 zu 599,99 €)
                const formattedPrice = wish.price.toLocaleString('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 2,
                });

                priceElement.textContent = formattedPrice;
                dateElement.textContent = priceData.last_updated; // Datum vom Agenten
            }

            // 4. Gesamtpreis nur für unerfüllte Wünsche berechnen
            const isFulfilled = storedStatus[wish.id];
            if (!isFulfilled) {
                total += wish.price;
            }
            
            // Wichtig: data-price Attribut im HTML temporär aktualisieren, 
            // damit die "Erfüllt"-Funktion den Preis noch kennt, falls nötig
            if(wishItem) {
                 wishItem.dataset.price = wish.price;
            }
        });

        // 5. Gesamtpreis aktualisieren
        const formattedTotal = total.toLocaleString('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
        });

        if (totalPriceElement) {
            totalPriceElement.textContent = formattedTotal;
        }

    } catch (error) {
        console.error('Fehler beim Abrufen der Preisdaten:', error);
        if (totalPriceElement) {
            totalPriceElement.textContent = "Fehler beim Laden";
        }
    }
}


// ==========================================================
// KATEGORIE FILTER FUNKTION
// (Bleibt unverändert)
// ==========================================================

/**
 * Filtert die Wishlist-Elemente basierend auf der ausgewählten Kategorie.
 * @param {string} category - Die Kategorie nach der gefiltert werden soll (z.B. 'hardware', 'all').
 */
function filterByCategory(category) {
    // Alle Artikel abrufen
    const items = document.getElementById('wishlistContainer').getElementsByClassName('wunsch-item');
    
    // Alle Filter-Buttons abrufen, um den aktiven Button zu stylen
    const filterButtons = document.querySelectorAll('.filter-btn');

    // 1. Buttons stylen
    filterButtons.forEach(button => {
        if (button.dataset.filter === category) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    // 2. Elemente filtern
    for (let i = 0; i < items.length; i++) {
        const itemCategory = items[i].dataset.category;

        if (category === 'all' || itemCategory === category) {
            // Zeige das Element
            items[i].style.display = ""; 
        } else {
            // Verstecke das Element
            items[i].style.display = "none";
        }
    }
}


// ==========================================================
// WUNSCHLISTE & DARK MODE LOGIK & MOUSEOVER
// (Nur Anpassungen für fetchAndCalculatePrices)
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- WUNSCHZETTEL LOGIK: Erfüllt/Zurücksetzen ---
    const fulfilledButtons = document.querySelectorAll('.mark-fulfilled');
    const wishItems = document.querySelectorAll('.wunsch-item');

    const saveWishStatus = () => {
        const status = {};
        wishItems.forEach(item => {
            const id = item.dataset.wishId;
            status[id] = item.classList.contains('fulfilled');
        });
        localStorage.setItem('wishlistStatus', JSON.stringify(status));
    };

    const loadWishStatus = () => {
        const storedStatus = localStorage.getItem('wishlistStatus');
        if (storedStatus) {
            const status = JSON.parse(storedStatus);
            wishItems.forEach(item => {
                const id = item.dataset.wishId;
                if (status[id]) {
                    item.classList.add('fulfilled');
                } else {
                    item.classList.remove('fulfilled');
                }
            });
        }
    };

    fulfilledButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const targetButton = event.target.closest('.mark-fulfilled'); 
            const wishId = targetButton.dataset.wishId;
            const wishItem = document.querySelector(`.wunsch-item[data-wish-id="${wishId}"]`);
            if (wishItem) {
                wishItem.classList.toggle('fulfilled');
                saveWishStatus();
                // Beim Statuswechsel die Preise neu abrufen und berechnen
                fetchAndCalculatePrices(); 
            }
        });
    });

    window.resetWishes = () => {
        if (confirm("Möchtest du wirklich alle Wünsche auf 'Unerfüllt' zurücksetzen?")) {
            wishItems.forEach(item => {
                item.classList.remove('fulfilled');
            });
            saveWishStatus();
            // Beim Reset die Preise neu abrufen und berechnen
            fetchAndCalculatePrices(); 
        }
    };

    // --- MOUSEOVER HIGHLIGHT LOGIK ---
    wishItems.forEach(item => {
        const id = item.dataset.wishId;
        const linkButton = document.getElementById(`wish-link-${id}`);

        if (linkButton) {
            item.addEventListener('mouseenter', () => {
                linkButton.classList.add('highlight-link');
            });

            item.addEventListener('mouseleave', () => {
                linkButton.classList.remove('highlight-link');
            });
        }
    });


    // --- DARK MODE LOGIK ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = darkModeToggle ? darkModeToggle.querySelector('i') : null;

    const setDarkMode = (isEnabled) => {
        if (isEnabled) {
            document.body.classList.add('dark-mode');
            if (darkModeIcon) {
                darkModeIcon.classList.replace('fa-moon', 'fa-sun');
                darkModeToggle.childNodes[1].nodeValue = ' Light Mode';
            }
        } else {
            document.body.classList.remove('dark-mode');
            if (darkModeIcon) {
                darkModeIcon.classList.replace('fa-sun', 'fa-moon');
                darkModeToggle.childNodes[1].nodeValue = ' Dark Mode';
            }
        }
    };

    if (localStorage.getItem('darkMode') === 'enabled') {
        setDarkMode(true);
    } else if (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches) {
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
    
    // Beim Laden den Standardfilter ('all') aktivieren
    filterByCategory('all');
});