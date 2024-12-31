Google Maps Location Picker with Database Integration==>



Project Overview=>

This project utilizes Google Maps API to allow users to click on a location on the map, retrieve its latitude and longitude, and display the corresponding address. The location data is then saved to a database for further processing or use. The main objective is to simplify the process of capturing geographical coordinates and associating them with human-readable addresses.



Features=>

Map Display: Integrates Google Maps into your webpage.
Location Picker: Users can click on the map to select a location.
Address Lookup: The application uses Google Maps Reverse Geocoding API to convert latitude and longitude into a readable address.
Database Integration: Saves the picked location (latitude, longitude, and address) into a database (PostgreSQL).



operate =>
in frontend and backend folder => npm install
frontend start=> npm run dev
backend start=> cd src ==> nodemon index.js