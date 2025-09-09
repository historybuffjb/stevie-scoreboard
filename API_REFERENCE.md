# Stevie Scoreboard API Reference

This document provides comprehensive API endpoints for controlling the scoreboard, specifically designed for StreamDeck integration.

## Base URL
```
http://localhost:3000
```

## Score Control Endpoints

### 1. Increment Player Score

**Endpoint:** `POST /api/scoreboard/{boardNumber}/player/{playerNumber}/increment`

**Description:** Increases a player's score by the specified amount (default: 1)

**Parameters:**
- `boardNumber`: `1` or `2` (Scoreboard 1 or Scoreboard 2)
- `playerNumber`: `1` or `2` (Player 1 or Player 2 on that board)

**Request Body:**
```json
{
  "amount": 1
}
```
*Note: `amount` is optional, defaults to 1*

**StreamDeck Examples:**

**Scoreboard 1, Player 1 +1:**
```
URL: http://localhost:3000/api/scoreboard/1/player/1/increment
Method: POST
Content-Type: application/json
Body: {"amount": 1}
```

**Scoreboard 1, Player 2 +1:**
```
URL: http://localhost:3000/api/scoreboard/1/player/2/increment
Method: POST
Content-Type: application/json
Body: {"amount": 1}
```

**Scoreboard 2, Player 1 +1:**
```
URL: http://localhost:3000/api/scoreboard/2/player/1/increment
Method: POST
Content-Type: application/json
Body: {"amount": 1}
```

**Scoreboard 2, Player 2 +1:**
```
URL: http://localhost:3000/api/scoreboard/2/player/2/increment
Method: POST
Content-Type: application/json
Body: {"amount": 1}
```

### 2. Decrement Player Score

**Endpoint:** `POST /api/scoreboard/{boardNumber}/player/{playerNumber}/decrement`

**Description:** Decreases a player's score by the specified amount (default: 1, minimum: 0)

**Parameters:**
- `boardNumber`: `1` or `2` (Scoreboard 1 or Scoreboard 2)
- `playerNumber`: `1` or `2` (Player 1 or Player 2 on that board)

**Request Body:**
```json
{
  "amount": 1
}
```
*Note: `amount` is optional, defaults to 1. Scores cannot go below 0.*

**StreamDeck Examples:**

**Scoreboard 1, Player 1 -1:**
```
URL: http://localhost:3000/api/scoreboard/1/player/1/decrement
Method: POST
Content-Type: application/json
Body: {"amount": 1}
```

**Scoreboard 1, Player 2 -1:**
```
URL: http://localhost:3000/api/scoreboard/1/player/2/decrement
Method: POST
Content-Type: application/json
Body: {"amount": 1}
```

**Scoreboard 2, Player 1 -1:**
```
URL: http://localhost:3000/api/scoreboard/2/player/1/decrement
Method: POST
Content-Type: application/json
Body: {"amount": 1}
```

**Scoreboard 2, Player 2 -1:**
```
URL: http://localhost:3000/api/scoreboard/2/player/2/decrement
Method: POST
Content-Type: application/json
Body: {"amount": 1}
```

### 3. Set Player Score

**Endpoint:** `POST /api/scoreboard/{boardNumber}/player/{playerNumber}/set`

**Description:** Sets a player's score to a specific value

**Parameters:**
- `boardNumber`: `1` or `2` (Scoreboard 1 or Scoreboard 2)
- `playerNumber`: `1` or `2` (Player 1 or Player 2 on that board)

**Request Body:**
```json
{
  "score": 5
}
```
*Note: `score` is required and must be 0 or greater*

**StreamDeck Examples:**

**Set Scoreboard 1, Player 1 to 5:**
```
URL: http://localhost:3000/api/scoreboard/1/player/1/set
Method: POST
Content-Type: application/json
Body: {"score": 5}
```

### 4. Reset All Scores

**Endpoint:** `POST /api/scoreboard/reset-scores`

**Description:** Resets all player scores on both scoreboards to 0

**Request Body:** None required

**StreamDeck Example:**
```
URL: http://localhost:3000/api/scoreboard/reset-scores
Method: POST
Content-Type: application/json
Body: {}
```

## Scoreboard Visibility Control Endpoints

### 5. Show Scoreboard

**Endpoint:** `POST /api/scoreboard/{scoreboardId}/show`

**Description:** Makes a specific scoreboard visible

**Parameters:**
- `scoreboardId`: `scorebar1`, `scorebar2`, `mini-scorebar1`, or `mini-scorebar2`

**Request Body:** None required

**StreamDeck Examples:**

**Show Full Scoreboard 1:**
```
URL: http://localhost:3000/api/scoreboard/scorebar1/show
Method: POST
Content-Type: application/json
Body: {}
```

**Show Full Scoreboard 2:**
```
URL: http://localhost:3000/api/scoreboard/scorebar2/show
Method: POST
Content-Type: application/json
Body: {}
```

**Show Mini Scoreboard 1:**
```
URL: http://localhost:3000/api/scoreboard/mini-scorebar1/show
Method: POST
Content-Type: application/json
Body: {}
```

**Show Mini Scoreboard 2:**
```
URL: http://localhost:3000/api/scoreboard/mini-scorebar2/show
Method: POST
Content-Type: application/json
Body: {}
```

### 6. Hide Scoreboard

**Endpoint:** `POST /api/scoreboard/{scoreboardId}/hide`

**Description:** Hides a specific scoreboard

**Parameters:**
- `scoreboardId`: `scorebar1`, `scorebar2`, `mini-scorebar1`, or `mini-scorebar2`

**Request Body:** None required

**StreamDeck Examples:**

**Hide Full Scoreboard 1:**
```
URL: http://localhost:3000/api/scoreboard/scorebar1/hide
Method: POST
Content-Type: application/json
Body: {}
```

**Hide Full Scoreboard 2:**
```
URL: http://localhost:3000/api/scoreboard/scorebar2/hide
Method: POST
Content-Type: application/json
Body: {}
```

**Hide Mini Scoreboard 1:**
```
URL: http://localhost:3000/api/scoreboard/mini-scorebar1/hide
Method: POST
Content-Type: application/json
Body: {}
```

**Hide Mini Scoreboard 2:**
```
URL: http://localhost:3000/api/scoreboard/mini-scorebar2/hide
Method: POST
Content-Type: application/json
Body: {}
```

### 7. Toggle Scoreboard Visibility

**Endpoint:** `POST /api/scoreboard/{scoreboardId}/toggle`

**Description:** Toggles the visibility of a specific scoreboard (show if hidden, hide if visible)

**Parameters:**
- `scoreboardId`: `scorebar1`, `scorebar2`, `mini-scorebar1`, or `mini-scorebar2`

**Request Body:** None required

**StreamDeck Examples:**

**Toggle Full Scoreboard 1:**
```
URL: http://localhost:3000/api/scoreboard/scorebar1/toggle
Method: POST
Content-Type: application/json
Body: {}
```

**Toggle Full Scoreboard 2:**
```
URL: http://localhost:3000/api/scoreboard/scorebar2/toggle
Method: POST
Content-Type: application/json
Body: {}
```

**Toggle Mini Scoreboard 1:**
```
URL: http://localhost:3000/api/scoreboard/mini-scorebar1/toggle
Method: POST
Content-Type: application/json
Body: {}
```

**Toggle Mini Scoreboard 2:**
```
URL: http://localhost:3000/api/scoreboard/mini-scorebar2/toggle
Method: POST
Content-Type: application/json
Body: {}
```

## Response Format

All endpoints return JSON responses:

**Success Response for Visibility:**
```json
{
  "success": true,
  "scoreboard": "scorebar1",
  "visible": true,
  "message": "scorebar1 is now visible"
}
```

**Toggle Response (includes previous state):**
```json
{
  "success": true,
  "scoreboard": "scorebar1",
  "visible": false,
  "previousState": true,
  "message": "scorebar1 is now hidden"
}
```

**Error Response:**
```json
{
  "error": "Invalid scoreboard ID. Must be: scorebar1, scorebar2, mini-scorebar1, or mini-scorebar2"
}
```

## Response Format

All endpoints return JSON responses:

**Success Response:**
```json
{
  "success": true,
  "board": "1",
  "player": "1",
  "newScore": 3,
  "change": 1
}
```

**Error Response:**
```json
{
  "error": "Invalid board or player number"
}
```

## StreamDeck Configuration Guide

### For Elgato StreamDeck:

1. **Add an API Button:**
   - Drag "API" action to a button
   - Set the URL to one of the endpoints above
   - Set Method to "POST"
   - Set Content-Type to "application/json"
   - Add the appropriate JSON body

2. **Example Button Setup for "Player 1 +1":**
   - **URL:** `http://localhost:3000/api/scoreboard/1/player/1/increment`
   - **Method:** `POST`
   - **Headers:** `Content-Type: application/json`
   - **Body:** `{"amount": 1}`

### Quick Setup Template

Copy these exact configurations for your StreamDeck buttons:

#### Scoreboard 1 Controls:
| Button | URL | Body |
|--------|-----|------|
| P1 +1 | `http://localhost:3000/api/scoreboard/1/player/1/increment` | `{"amount": 1}` |
| P1 -1 | `http://localhost:3000/api/scoreboard/1/player/1/decrement` | `{"amount": 1}` |
| P2 +1 | `http://localhost:3000/api/scoreboard/1/player/2/increment` | `{"amount": 1}` |
| P2 -1 | `http://localhost:3000/api/scoreboard/1/player/2/decrement` | `{"amount": 1}` |

#### Scoreboard 2 Controls:
| Button | URL | Body |
|--------|-----|------|
| P3 +1 | `http://localhost:3000/api/scoreboard/2/player/1/increment` | `{"amount": 1}` |
| P3 -1 | `http://localhost:3000/api/scoreboard/2/player/1/decrement` | `{"amount": 1}` |
| P4 +1 | `http://localhost:3000/api/scoreboard/2/player/2/increment` | `{"amount": 1}` |
| P4 -1 | `http://localhost:3000/api/scoreboard/2/player/2/decrement` | `{"amount": 1}` |

#### Utility Buttons:
| Button | URL | Body |
|--------|-----|------|
| Reset All | `http://localhost:3000/api/scoreboard/reset-scores` | `{}` |

## Advanced Usage

### Custom Increment/Decrement Values

You can change the `amount` in the body to increment/decrement by different values:

**Increment by 2:**
```json
{"amount": 2}
```

**Increment by 5:**
```json
{"amount": 5}
```

### Testing with curl

You can test these endpoints using curl:

```bash
# Increment Player 1 on Scoreboard 1
curl -X POST http://localhost:3000/api/scoreboard/1/player/1/increment \
  -H "Content-Type: application/json" \
  -d '{"amount": 1}'

# Decrement Player 2 on Scoreboard 1  
curl -X POST http://localhost:3000/api/scoreboard/1/player/2/decrement \
  -H "Content-Type: application/json" \
  -d '{"amount": 1}'

# Reset all scores
curl -X POST http://localhost:3000/api/scoreboard/reset-scores \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Troubleshooting

### Common Issues:

1. **Connection Refused:** Make sure the server is running on port 3000
2. **404 Error:** Check the URL spelling and parameters
3. **Invalid Parameters:** Ensure `boardNumber` and `playerNumber` are 1 or 2
4. **JSON Parsing Error:** Ensure Content-Type is set to "application/json"

### Server Status Check:

You can verify the server is running by visiting:
```
http://localhost:3000/api/scoreboard
```

This should return the current scoreboard data.
