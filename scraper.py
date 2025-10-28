import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

# Definitionen der Wünsche mit ID, URL und einem CSS-Selektor 
# (Der Selector muss exakt den Preis im HTML-Code der Seite finden!)
WISH_ITEMS = [
    {
        "id": 1,
        "name": "Samsung Galaxy S24",
        "url": "https://www.samsung.com/de-de/smartphones/galaxy-s24/", 
        # Platzhalter-Selektor, da Samsung sehr dynamische Seiten hat
        "selector": ".price-container .sales-price" 
    },
    {
        "id": 2,
        "name": "FL Studio Producer Edition",
        "url": "https://www.amazon.de/Image-Line-FL-Studio-20-Producer/dp/B07C895FTM",
        # Selektor für den Preis auf Amazon (kann sich jederzeit ändern!)
        "selector": ".a-price-whole" 
    },
    {
        "id": 3,
        "name": "Pioneer DDJ-FLX4 DJ-Mischpult",
        "url": "https://www.thomann.de/de/pioneer_dj_ddj_flx4.htm", # Beispiel Thomann
        # Selektor für den Preis auf Thomann (kann sich ändern!)
        "selector": ".price__main" 
    }
]

# Browser-Header simulieren, um Blockaden zu vermeiden
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7'
}

def scrape_price(item):
    """Ruft die URL ab und versucht, den Preis mithilfe des Selektors zu finden."""
    try:
        response = requests.get(item['url'], headers=HEADERS, timeout=15)
        response.raise_for_status() # Löst einen Fehler für schlechte Statuscodes aus (4xx, 5xx)
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Versucht, das Element anhand des CSS-Selektors zu finden
        price_element = soup.select_one(item['selector'])

        if price_element:
            # Text extrahieren und bereinigen (z.B. Eurozeichen, Kommas)
            price_text = price_element.get_text(strip=True)
            
            # Bereinigung: Nur Ziffern, Komma/Punkt behalten. 
            # Ersetzt Komma durch Punkt für Python float()
            cleaned_price = price_text.replace('.', '').replace(',', '.').strip()
            
            # Extrahiert nur die Zahl vor den Nachkommastellen bei Amazon/Thomann
            if '.' in cleaned_price:
                cleaned_price = cleaned_price.split('.')[0] 
                
            # Konvertiert den bereinigten String in eine Zahl
            return float(cleaned_price)
        
        return 0.0 # Bei Fehler 0.0 zurückgeben

    except Exception as e:
        print(f"Fehler beim Abruf von {item['name']} ({item['url']}): {e}")
        return 0.0

def main():
    """Führt den Scraper aus und schreibt die Ergebnisse in prices.json."""
    scraped_wishes = []
    
    for item in WISH_ITEMS:
        price = scrape_price(item)
        scraped_wishes.append({
            "id": item["id"],
            "name": item["name"],
            "price": price if price > 0.0 else item.get("fallback_price", 0.0)
        })

    # Erstellt das finale JSON-Objekt
    output_data = {
        "last_updated": datetime.now().strftime("%d.%m.%Y"),
        "wishes": scraped_wishes
    }

    # Speichert das JSON in der Datei prices.json
    with open('prices.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print("Preise erfolgreich aktualisiert und in prices.json gespeichert.")

if __name__ == "__main__":
    main()