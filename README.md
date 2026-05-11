# Hidden Riviera

Hidden Riviera is an MVP travel recommendation app for the French Riviera.

Instead of sending every visitor to the same overcrowded hotspots, it helps people discover quieter, more local, and more responsible places based on trip preferences, live context, and overtourism-aware scoring.

## Live Demo

https://hiddenriviera.netlify.app

## What It Does

- Generates personalized French Riviera itineraries
- Recommends lesser-known villages, beaches, cultural stops, food places, and nature escapes
- Uses live context such as weather, air quality, and traffic
- Scores places using responsible-tourism signals such as capacity, fragility, local benefit, seasonality, and overtourism risk
- Explains why a stop is recommended today
- Separates real destinations from logistics/transit stops
- Logs anonymized recommendation results for future analysis

## Why It Exists

Tourism on the French Riviera is often concentrated around a small number of famous places.

Hidden Riviera explores a different approach: helping visitors make better decisions while supporting local communities and reducing pressure on fragile destinations.

The goal is not only to recommend beautiful places, but to understand when a place should — or should not — be recommended.

## Data & Scoring

Hidden Riviera combines multiple types of signals:

- Live context: weather, air quality, traffic
- Infrastructure proxies: parking, food options, cultural density, nearby amenities
- Responsible tourism signals: capacity, fragility, local benefit, seasonality, and overtourism risk
- User preferences: trip duration, travel style, and companion type

Some signals come from live APIs. Others are calculated through local scoring logic and proxy data.

## Built With

- React
- Vite
- Supabase
- Open-Meteo API
- TomTom API
- Geoapify API

## Status

MVP in active development.

The current version focuses on recommendation logic, live context, infrastructure scoring, and transparent explanations. Feedback is welcome.
