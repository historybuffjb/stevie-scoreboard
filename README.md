# Stevie Scoreboard

## Overview
Stevie Scoreboard is a Node.js-based scoreboard web app. It runs a local server and displays a scoreboard UI in a browser. You can control the scoreboard via API endpoints, making it easy to integrate with devices like Elgato Stream Deck.

## Installation
To set up the scoreboard as a Windows service and launch it in kiosk mode on startup, run the provided `install.ps1` PowerShell script as Administrator. This will:
- Install Node.js (if missing)
- Clone the repository
- Install dependencies
- Register a scheduled task to run the server and launch the browser on boot

## API Usage
The scoreboard server exposes API endpoints for updating scores, player names, and other data. You can send HTTP requests from any device or app, including Elgato Stream Deck (using the "Custom Actions" plugin or similar).

### Example Endpoints
Assuming your server runs on `http://localhost:3000`:

#### Update Player 1 Score
```
POST http://localhost:3000/api/score/player1
Content-Type: application/json

{
  "score": 5
}
```

#### Update Player 2 Score
```
POST http://localhost:3000/api/score/player2
Content-Type: application/json

{
  "score": 3
}
```

#### Update Player Names
```
POST http://localhost:3000/api/playernames
Content-Type: application/json

{
  "name1": "Alice",
  "name2": "Bob"
}
```

### Sending Requests from Stream Deck
1. Install the "Custom Actions" plugin (or any plugin that can send HTTP requests).
2. Configure an action to send a POST request to the desired endpoint (see above).
3. Set the Content-Type to `application/json` and provide the JSON body.

## Troubleshooting
- Make sure the server is running and accessible at `http://localhost:3000`.
- If using Stream Deck on a different machine, replace `localhost` with the server's IP address.
- Check Windows Firewall settings if requests are not reaching the server.

## Customization
You can modify endpoints or add new ones in `src/server.ts`.

## License
MIT
