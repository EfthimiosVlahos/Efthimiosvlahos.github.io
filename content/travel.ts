// The "Around the world in three words" series, carried over verbatim from the 2025 site.
// Photos are pre-sized by scripts/optimize-images.sh.

export interface TravelEntry {
  place: string;
  country: string;
  flag: string;
  /** ISO year-month of the trip. */
  date: string;
  words: [string, string, string];
  photo: { src: string; width: number; height: number };
  text: string;
}

export const travelIntro =
  "Travel has always been a passion of mine: a way to explore new cultures, challenge perspectives and collect stories along the way. As much as I love the destinations, I also enjoy reflecting on what made each one stand out, which is what inspired this series.";

export const threeWordsIntro =
  "I distill the essence of each place into three carefully chosen words, whether it’s the atmosphere, the people, the landscapes or the feelings they left behind. It’s my minimalist take on storytelling.";

/** ISO 3166-1 numeric codes, as used by world-atlas. */
export const visitedCountries: Record<string, string> = {
  "840": "United States",
  "586": "Pakistan",
  "784": "United Arab Emirates",
  "682": "Saudi Arabia",
  "050": "Bangladesh",
  "792": "Türkiye",
  "826": "United Kingdom",
  "352": "Iceland",
  "276": "Germany",
  "756": "Switzerland",
  "442": "Luxembourg",
  "724": "Spain",
  "250": "France",
  "380": "Italy",
  "336": "Vatican City",
  "528": "Netherlands",
  "040": "Austria",
  "056": "Belgium",
  "203": "Czechia",
  "300": "Greece",
  "392": "Japan",
  "344": "Hong Kong",
};

/** Places too small for the 1:110m map; drawn as markers at [longitude, latitude]. */
export const smallPlaces: { id: string; name: string; coordinates: [number, number] }[] = [
  { id: "336", name: "Vatican City", coordinates: [12.4534, 41.9029] },
  { id: "344", name: "Hong Kong", coordinates: [114.1694, 22.3193] },
];

/** State names as used by us-atlas. */
export const visitedStates: string[] = [
  "Alabama", "California", "Connecticut", "District of Columbia", "Florida", "Georgia", "Illinois",
  "Indiana", "Kentucky", "Louisiana", "Maine", "Massachusetts", "Michigan", "Missouri", "Nevada",
  "New Hampshire", "New Jersey", "New York", "North Carolina", "Pennsylvania", "Rhode Island",
  "South Carolina", "Tennessee", "Texas", "Virginia", "Washington",
];

export const travelEntries: TravelEntry[] = [
  {
    place: "Hong Kong",
    country: "Hong Kong",
    flag: "🇭🇰",
    date: "2025-06",
    words: ["Contrasting", "Vertical", "Luxurious"],
    photo: { src: "/travel/hk_image.jpg", width: 750, height: 1000 },
    text: "Hong Kong is a city of contrasts, where ancient temples sit in the shadows of futuristic towers, and quiet fishing villages coexist with bustling financial districts, blending tradition with modernity at every turn. Its vertical nature is unmistakable, with a skyline that pierces the clouds—skyscrapers rising dramatically between emerald green mountains and a sparkling harbor, creating one of the most iconic urban landscapes in the world. Adding to its allure is Hong Kong’s luxurious side, evident in its grand malls adorned with high-end designer boutiques, gleaming sports cars weaving through the streets, and a distinct sense of refined elegance woven into the fabric of city life. Altogether, Hong Kong offers a mesmerizing fusion of the old and the new, the grounded and the grand.",
  },
  {
    place: "Florida",
    country: "United States",
    flag: "🇺🇸",
    date: "2024-04",
    words: ["Tropical", "Historical", "Whimsical"],
    photo: { src: "/travel/fl_image.jpg", width: 750, height: 1000 },
    text: "Florida is renowned for being tropical, boasting a climate that beckons visitors with its warm breezes and lush landscapes, offering a haven for those seeking sun-kissed days and vibrant natural beauty. The state's rich historical tapestry adds depth to its allure, with sites like St. Augustine—the oldest continuously inhabited European-established settlement in the United States. From Spanish colonial architecture to Civil War battlefields, Florida’s history comes alive, inviting visitors to explore its storied past and diverse cultural heritage. Moreover, Florida’s charm extends to its whimsical side, epitomized by its world-class amusement parks and fantastical attractions. From the enchanting realms of Disney World to the cinematic magic of Universal Studios, these destinations ignite the imaginations of visitors of all ages, promising unforgettable adventures and moments of pure joy.",
  },
  {
    place: "Michigan",
    country: "United States",
    flag: "🇺🇸",
    date: "2023-11",
    words: ["Industrial", "Scenic", "Halal"],
    photo: { src: "/travel/mi_image.jpg", width: 750, height: 1000 },
    text: "Michigan hosts major players in the automotive industry, including General Motors, Ford Motors, and Stellantis. Detroit, renowned as the Motor City and the global auto capital, shares the spotlight with Kalamazoo, home to the global headquarters of medical technology giants Pfizer and Stryker. Battle Creek holds the title of the world's cereal capital. As the only bi-peninsula state in the U.S., Michigan features America's largest freshwater shoreline, with 90% of the Upper Peninsula cloaked in trees. Aptly nicknamed the Great Lake State, it is bordered by four of the five Great Lakes. Dearborn, Michigan, boasts the largest mosque in the U.S., and Detroit and other major cities offer abundant options for halal food.",
  },
  {
    place: "Japan",
    country: "Japan",
    flag: "🇯🇵",
    date: "2023-07",
    words: ["Clean", "Tech-advanced", "Heritage-rich"],
    photo: { src: "/travel/jp_image.jpg", width: 750, height: 1000 },
    text: "Japan, a captivating destination, seamlessly blends the charm of pristine cleanliness with its cutting-edge technological advancements, creating a truly remarkable experience. The streets gleam with impeccable tidiness, reflecting the Japanese commitment to maintaining a spotless environment. Beyond its cleanliness, Japan stands tall as a beacon of innovation, boasting a technologically advanced landscape that dazzles visitors from around the globe. From high-speed trains to futuristic robotics, Japan's technological prowess is nothing short of awe-inspiring. Amidst this modernity, Japan cherishes its rich heritage with a deep appreciation for its cultural traditions. Ancient customs, arts, and historical architecture thrive alongside the country's technological achievements. This perfect blend of cleanliness, technological innovation, and cultural heritage is what makes Japan an enchanting destination that leaves an indelible impression on all who have the pleasure of exploring its wonders.",
  },
  {
    place: "Athens",
    country: "Greece",
    flag: "🇬🇷",
    date: "2023-06",
    words: ["Mythical", "Historic", "Timeless"],
    photo: { src: "/travel/gr_image.jpg", width: 749, height: 1000 },
    text: "Nestled amidst Greece's sunny landscapes, Athens captivates with its ancient tales, timeless charm, and rich history. Its winding streets, adorned with famous ruins and marble landmarks, whisper stories of a bygone era and legendary figures. Exploring its historic sites unveils a tapestry of civilizations that flourished long ago, leaving an unforgettable imprint on the city's culture. But Athens is more than just its past. It goes beyond time, combining its lively atmosphere and vibrant cosmopolitan vibe with the echoes of centuries, creating a truly unique and timeless destination for everyone to enjoy.",
  },
  {
    place: "New Orleans",
    country: "United States",
    flag: "🇺🇸",
    date: "2023-05",
    words: ["Historic", "Jazz-infused", "Spirited"],
    photo: { src: "/travel/nola_image.jpg", width: 750, height: 1000 },
    text: "Situated along the beautiful Mississippi River, the city blends its rich history with vibrant jazz melodies and a lively atmosphere. Walking through its charming streets, you can't help but be captivated by the stunning historic architecture adorned with intricate details. The city's soul is deeply connected to its jazz heritage, with the melodic notes flowing from lively clubs, street corners, and festivals, mesmerizing both locals and visitors. From the exhilarating Mardi Gras celebrations to the energetic second-line parades, the city pulsates with an irresistible energy that leaves a lasting impression. In New Orleans, you'll be swept away by the perfect blend of its captivating history, soulful jazz rhythms, and a refreshing vibe that keeps the city vibrant and alive.",
  },
  {
    place: "Seattle",
    country: "United States",
    flag: "🇺🇸",
    date: "2022-05",
    words: ["Coffee", "Geo-Metro-Fusion", "Clean"],
    photo: { src: "/travel/seattle_image.jpg", width: 750, height: 1000 },
    text: "Known as the Coffee Capital of the US due to its enduring coffee culture (and being the birthplace of Starbucks), Seattle boasts a stunning skyline against the backdrop of the Pacific Ocean and Mount Rainier, seamlessly blending artificial and natural beauty. Housing major Fortune 500 companies like Amazon, Microsoft, Alaska Airlines, Starbucks, and Nordstrom, the city showcases a wealth of modern architecture seen in landmarks such as the Space Needle, Museum of Pop Culture, Amazon Spheres, Rainier Square Tower, and The Great Wheel. Surprisingly cleaner than many other metropolises, possibly owing to its frequent rain, Seattle has earned a coveted spot on my list of the top five cities to live in.",
  },
  {
    place: "Prague",
    country: "Czech Republic",
    flag: "🇨🇿",
    date: "2018-12",
    words: ["Timeless", "Gothic", "Enchanting"],
    photo: { src: "/travel/cz_image.jpg", width: 750, height: 1000 },
    text: "Prague feels timeless, a city where centuries seem to overlap in every cobblestone and cathedral. Home to the world’s oldest working astronomical clock, it invites you to pause and marvel at a city that has measured time for over 600 years, yet feels untouched by it. The city’s Gothic architecture looms majestically—soaring spires, shadowy alleys, and medieval towers paint a dramatic skyline that whispers tales of kings, alchemists, and empires past. But beyond the history books, Prague is enchanting, with its labyrinth of bridges—more than a hundred—gracefully spanning the Vltava River, especially magical at sunset when the city glows in hues of gold and rose. Together, Prague weaves history and fantasy into a living fairytale.",
  },
  {
    place: "Madrid",
    country: "Spain",
    flag: "🇪🇸",
    date: "2018-10",
    words: ["Vibrant", "Regal", "Social"],
    photo: { src: "/travel/madrid_image.jpg", width: 750, height: 1000 },
    text: "Madrid is a city that pulses with life, where grand boulevards lead to sunlit plazas buzzing with conversation, and historic palaces stand proudly beside lively tapas bars, blending royalty with everyday charm. Its regal character is unmistakable, with landmarks like the Royal Palace and the Prado Museum showcasing centuries of art, culture, and Spanish heritage in stunning detail. Adding to its spirit is Madrid’s deeply social nature—locals fill the streets late into the night, sharing laughs over churros and café con leche, dancing to the rhythm of flamenco, and embracing the joy of togetherness. Altogether, Madrid offers an experience that is both majestic and full of heart—a city where history lives loudly and life is always in motion.",
  },
  {
    place: "Brussels",
    country: "Belgium",
    flag: "🇧🇪",
    date: "2018-09",
    words: ["Sweet", "Multilingual", "Imaginative"],
    photo: { src: "/travel/be_image.jpg", width: 750, height: 1000 },
    text: "Belgium is a country that delights the senses, where the smell of freshly baked waffles drifts through medieval town squares, and artisanal chocolate shops await on nearly every corner, making indulgence a part of everyday life. Its multilingual nature defines its cultural richness—Dutch, French, and German are spoken across its regions, each language bringing its own identity, flavors, and traditions to the national character. Adding to its charm is Belgium’s playful imagination, proudly on display through its deep love for comic art—walls painted with Tintin, the Smurfs, and other beloved characters turn ordinary streets into open-air storybooks. Altogether, Belgium offers a warm, whimsical experience where language, sweetness, and creativity come together in perfect harmony.",
  },
  {
    place: "Vienna",
    country: "Austria",
    flag: "🇦🇹",
    date: "2017-01",
    words: ["Imperial", "Melodic", "Grand"],
    photo: { src: "/travel/at_image.jpg", width: 750, height: 1000 },
    text: "Vienna exudes imperial elegance, with its grand palaces and stately boulevards echoing the legacy of the Habsburg Empire. The city resonates with music, from the haunting notes of Mozart and Beethoven to the uplifting rhythms of Strauss, performed in storied concert halls. Everywhere you turn, Vienna offers a sense of grandeur — in its gilded cafés, majestic architecture, and its deeply embedded cultural traditions.",
  },
  {
    place: "Amsterdam",
    country: "Netherlands",
    flag: "🇳🇱",
    date: "2017-01",
    words: ["Scenic", "Liberal", "Artistic"],
    photo: { src: "/travel/amsterdam_image.jpg", width: 1000, height: 750 },
    text: "Amsterdam is a picturesque city of canals lined with charming gabled houses and blooming tulips. Its liberal spirit is felt in its progressive culture and open-mindedness, while its rich artistic heritage includes masterpieces by Rembrandt and Van Gogh. Whether cycling through cobbled streets or cruising past historic bridges, Amsterdam captures the heart with its beauty and vibrance.",
  },
  {
    place: "Paris",
    country: "France",
    flag: "🇫🇷",
    date: "2016-01",
    words: ["Romantic", "Elegant", "Timeless"],
    photo: { src: "/travel/fr_image.jpg", width: 750, height: 1000 },
    text: "Paris enchants with its romantic atmosphere, where lovers stroll along the Seine and sip espresso at sidewalk cafés. The city's elegance is reflected in its haute couture, refined cuisine, and stunning architecture, from the Eiffel Tower to the ornate bridges and boulevards. Timeless in its charm, Paris remains a symbol of love, art, and sophistication.",
  },
  {
    place: "Barcelona",
    country: "Spain",
    flag: "🇪🇸",
    date: "2016-12",
    words: ["Vibrant", "Artistic", "Mediterranean"],
    photo: { src: "/travel/barcelona_image.jpg", width: 750, height: 1000 },
    text: "Barcelona dazzles with its Mediterranean zest — a city where life is lived outdoors, meals are shared late into the night, and festivals explode with color. Its artistic soul is embodied in Gaudí’s fantastical architecture and Picasso’s legacy. From sun-drenched beaches to the bustling energy of La Rambla, Barcelona pulses with vibrance and creativity.",
  },
  {
    place: "Venice",
    country: "Italy",
    flag: "🇮🇹",
    date: "2016-12",
    words: ["Enchanting", "Aquatic", "Melancholic"],
    photo: { src: "/travel/venice_image.jpg", width: 1000, height: 750 },
    text: "Venice enchants with its labyrinth of canals, whispering gondolas, and crumbling facades that speak of faded glory. The city’s aquatic nature sets it apart — a floating marvel where alleyways are water and streets lead to glittering piazzas. There's a melancholic beauty to Venice, a romantic sense of timelessness shaped by its history and unique rhythm of life.",
  },
  {
    place: "Rome",
    country: "Italy",
    flag: "🇮🇹",
    date: "2016-12",
    words: ["Eternal", "Monumental", "Passionate"],
    photo: { src: "/travel/rome_image.jpg", width: 1000, height: 750 },
    text: "Rome is a living museum where ancient ruins rise beside buzzing cafés, and every stone seems to whisper stories of emperors and saints. The city's monumental legacy is unmatched, from the Colosseum to the Vatican, and its passionate character is felt in its lively piazzas, fiery cuisine, and expressive people. Rome is eternal in its allure — always dramatic, always unforgettable.",
  },
  {
    place: "Zurich",
    country: "Switzerland",
    flag: "🇨🇭",
    date: "2016-12",
    words: ["Ornaments", "Medieval", "Landscape"],
    photo: { src: "/travel/switzerland_image.jpg", width: 750, height: 1000 },
    text: "In the heart of Switzerland's main urban centers, one cannot help but notice a striking abundance of high-end boutiques specializing in luxurious watches and jewelry—true ornaments of elegance and craftsmanship. Lucerne and Zurich both proudly showcase meticulously preserved medieval buildings and structures, offering a glimpse into the captivating allure of their historical heritage. Zurich’s Bahnhofstrasse, a renowned shopping avenue, evokes comparisons to London’s Oxford Street or Piccadilly Circus, yet with a distinctly more serene atmosphere. The awe-inspiring vistas of the Swiss Alps unfold like a surreal masterpiece—landscapes so extraordinary they seem unreal. Enhancing the experience is Switzerland's highly efficient and navigable transportation system, making exploration of both urban and alpine environments convenient and seamless.",
  },
  {
    place: "Frankfurt",
    country: "Germany",
    flag: "🇩🇪",
    date: "2016-12",
    words: ["Dynamic", "Financial Hub", "Cultural"],
    photo: { src: "/travel/frankfurt_image.jpg", width: 750, height: 1000 },
    text: "Frankfurt is often seen as a dynamic city, pulsating with energy and modernity. Its role as a major financial hub is central to its identity—it is home to the European Central Bank and plays a vital part in the global economy. The skyline is dotted with contemporary architecture and the atmosphere is fast-paced and forward-looking. Beyond its financial stature, Frankfurt is deeply cultural. The Museumsufer along the River Main offers a rich tapestry of museums covering everything from art to science. The city also retains touches of its past, including the medieval Altstadt and landmarks like the Römer. Its international airport, one of the busiest in the world, positions Frankfurt as a major entry point to Europe.",
  },
  {
    place: "Reykjavík",
    country: "Iceland",
    flag: "🇮🇸",
    date: "2016-12",
    words: ["Charming", "Friendly", "Wonders"],
    photo: { src: "/travel/iceland_image.jpg", width: 667, height: 1000 },
    text: "Reykjavík, the capital of Iceland, exudes charm with its colorful buildings, small-town feel, and cozy ambiance. Despite being a capital city, it maintains a welcoming atmosphere that feels intimate and accessible. The friendliness of the Icelandic people adds to the experience—warm, helpful, and hospitable, they contribute significantly to the country's high global happiness rankings. Reykjavík also serves as the perfect launchpad for exploring Iceland’s natural wonders. From geysers and waterfalls to glaciers and the iconic Blue Lagoon, the surrounding landscapes are nothing short of spectacular. This proximity to breathtaking nature, combined with its urban warmth, makes Reykjavík a destination like no other.",
  },
  {
    place: "Istanbul",
    country: "Turkiye",
    flag: "🇹🇷",
    date: "2016-08",
    words: ["Historic", "Cosmopolitan", "Breathtaking Views"],
    photo: { src: "/travel/istanbul_image.jpg", width: 1000, height: 748 },
    text: "Istanbul is a city steeped in history, having served as the capital of both the Byzantine and Ottoman Empires. Its rich heritage is reflected in its architectural marvels and cultural landmarks, from the Hagia Sophia to the Blue Mosque. The city’s cosmopolitan nature stems from its unique geographic position bridging Europe and Asia—this cross-continental identity has shaped a vibrant mosaic of cultures, cuisines, and lifestyles. Istanbul also offers breathtaking views, especially along the Bosphorus Strait, where minarets and palaces line the waterfront under golden sunsets. Iconic spots like the Grand Bazaar, Topkapi Palace, and the Spice Bazaar provide immersive experiences in both history and sensory delight, blending tradition with modern energy.",
  },
];
