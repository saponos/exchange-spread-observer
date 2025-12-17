# Exchange Spread Observer

A Node.js application for observing and calculating exchange spreads, mid prices, and moving averages in real-time. The application connects to a cryptocurrency exchange API via REST and WebSocket to monitor BTC/USDT order book data, calculate mid prices and spreads, and maintain a rolling average of spreads over time.

## Chosen Exchange

**MEXC** (MEXC Global)

- **Website**: [https://www.mexc.com](https://www.mexc.com)
- **API Documentation**: [https://mexcdevelop.github.io/apidocs/contract_v1_en/](https://mexcdevelop.github.io/apidocs/contract_v1_en/)
- **REST API Base URL**: `https://contract.mexc.com` (configurable via `EXCHANGE_HTTP_BASE_URL`)
- **WebSocket URL**: `wss://contract.mexc.com/edge` (configurable via `EXCHANGE_WS_URL`)

## Features

- ✅ Real-time order book monitoring via WebSocket
- ✅ Periodic REST API updates every 60 seconds
- ✅ Mid price calculation
- ✅ Spread percentage calculation
- ✅ Moving average of spread (last 10 values)
- ✅ Redis storage for data persistence
- ✅ File logging (logs/app.log)
- ✅ TypeScript implementation
- ✅ Docker support with docker-compose
- ✅ Unit tests with Jest

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v18 or higher recommended, v24.12 used in development)
- **npm** (v9 or higher)
- **Redis** (v7 or higher) - can be run via Docker
- **Docker** and **Docker Compose** (optional, for containerized deployment)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd exchange-spread-observer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
NODE_ENV=production
EXCHANGE_NAME=MEXC
EXCHANGE_HTTP_BASE_URL=https://contract.mexc.com
EXCHANGE_WS_URL=wss://contract.mexc.com/edge
EXCHANGE_SYMBOL=BTC_USDT

# Redis configuration (optional if using Docker Compose)
REDIS_HOST=localhost
REDIS_PORT=6379
# OR use REDIS_URL directly
# REDIS_URL=redis://localhost:6379

LOG_LEVEL=info
```

## Usage

### Local Development

1. **Start Redis** (if not using Docker):
```bash
# Using Docker
docker run -d -p 6379:6379 redis:7-alpine

# Or using local Redis installation
redis-server
```

2. **Run the application**:
```bash
# Development mode with hot reload
npm run dev

# Production mode (requires build first)
npm run build
npm start
```

### Docker Compose (Recommended)

1. **Start all services** (Redis + Application):
```bash
docker-compose up -d
```

2. **View logs**:
```bash
docker-compose logs -f app
```

3. **Stop services**:
```bash
docker-compose down
```

### Additional Commands

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build TypeScript
npm run build

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## Output

The application outputs real-time updates to the console and log files. Example output:

```
[2025-01-04 14:32:00] [info]: Starting Exchange Spread Observer...
[2025-01-04 14:32:00] [info]: Connected to Redis at redis://localhost:6379
[2025-01-04 14:32:00] [info]: Connected to MEXC REST API at https://contract.mexc.com
[2025-01-04 14:32:00] [info]: Connected to MEXC WebSocket at wss://contract.mexc.com/edge
[2025-01-04 14:32:00] [info]: REST mid=65432.50 spread=0.12%
[2025-01-04 14:32:05] [info]: WS last=65431.10 mid=65432.20 spread=0.11%
[2025-01-04 14:32:10] [info]: WS last=65433.00 mid=65433.55 spread=0.09%
[2025-01-04 14:32:01] [info]: Average spread=0.10%
[2025-01-04 14:33:00] [info]: REST mid=65435.20 spread=0.13%
[2025-01-04 14:33:05] [info]: WS last=65434.50 mid=65434.85 spread=0.10%
```

### Output Format

- **REST updates**: `REST mid=<midPrice> spread=<spread>%` - Updates every 60 seconds from REST API
- **WebSocket updates**: `WS last=<lastPrice> mid=<midPrice> spread=<spread>%` - Real-time updates from WebSocket
- **Average spread**: `Average spread=<average>%` - Calculated every minute from the last 10 stored values

### Log Files

Logs are written to:
- `logs/app.log` - All application logs
- `logs/error.log` - Error logs only

## Calculation Formulas

### Mid Price

The mid price is calculated as the midpoint between the best bid and best ask:

```
mid = (bestBid + bestAsk) / 2
```

**Example:**
- Best Bid: 65,400.00
- Best Ask: 65,500.00
- Mid Price: (65,400.00 + 65,500.00) / 2 = 65,450.00

### Spread Percentage

The spread is calculated as a percentage of the mid price:

```
spreadPercent = ((bestAsk - bestBid) / mid) * 100
```

**Example:**
- Best Bid: 65,400.00
- Best Ask: 65,500.00
- Mid Price: 65,450.00
- Spread: ((65,500.00 - 65,400.00) / 65,450.00) * 100 = 0.15%

### Moving Average

The application stores the last 10 spread values in Redis and calculates the average:

```
averageSpread = (spread1 + spread2 + ... + spread10) / 10
```

The average is recalculated every minute and includes the most recent 10 spread values (from both REST and WebSocket updates).

## Architecture

The codebase follows a modular architecture:

```
src/
  api/
    restClient.ts      # REST API client for order book data
    wsClient.ts        # WebSocket client for real-time updates
    redisClient.ts     # Redis connection and client
  core/
    calculator.ts      # Mid price, spread, and moving average calculations
    logger.ts         # Winston logger configuration
    ws.channels.ts    # WebSocket channel subscriptions
  cron/
    index.ts          # Scheduled tasks (REST updates, average calculation)
  dto/
    bestPrices.dto.ts # Data transfer objects
  lib/
    const.ts          # Constants and configuration
    decorators.ts     # Function decorators for logging/error handling
    interfaces.ts     # TypeScript interfaces
    types.ts          # Type definitions
    utils.ts          # Utility functions
  repository/
    spread.repository.ts # Redis repository for spread data
  services/
    orderBook/
      implementations.ts    # Order book service implementations
      orderBook.service.ts  # Order book service with decorators
  index.ts            # Application entry point
```

## How It Works

1. **Initialization**: The application connects to Redis, initializes the REST client, and establishes a WebSocket connection.

2. **REST Updates**: Every 60 seconds, the application fetches the order book depth via REST API, calculates mid price and spread, and stores the spread value in Redis.

3. **WebSocket Updates**: The application subscribes to real-time ticker updates via WebSocket. When a new price update is received, it calculates the mid price and spread, stores the spread value, and logs the update.

4. **Moving Average**: Every minute, the application retrieves the last 10 spread values from Redis, calculates the average, and logs it.

5. **Data Storage**: Spread values are stored in Redis with a key pattern: `exchange:spreads:BTC_USDT`. The application maintains the last 10 values using Redis list operations.

## Testing

The project includes unit tests for the core calculation functions:

```bash
npm test
```

Tests cover:
- Mid price calculation with various inputs
- Spread percentage calculation
- Moving average calculation
- Error handling for invalid inputs

Test files are located in:
- `src/core/calculator.test.ts`

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `EXCHANGE_NAME` | Exchange name | `MEXC` | No |
| `EXCHANGE_HTTP_BASE_URL` | REST API base URL | - | Yes |
| `EXCHANGE_WS_URL` | WebSocket URL | `wss://contract.mexc.com/edge` | No |
| `EXCHANGE_SYMBOL` | Trading pair symbol | `BTC_USDT` | No |
| `REDIS_HOST` | Redis host | `localhost` | No* |
| `REDIS_PORT` | Redis port | `6379` | No* |
| `REDIS_URL` | Full Redis URL | `redis://localhost:6379` | No* |
| `LOG_LEVEL` | Logging level | `info` | No |
| `NODE_ENV` | Environment | - | No |
| `DOCKER` | Docker flag | - | No |

\* Redis configuration is required if not using Docker Compose

## Docker

### Dockerfile

The application includes a multi-stage Dockerfile for optimized production builds.

### Docker Compose

The `docker-compose.yml` includes:
- **Redis**: Data storage service
- **App**: Main application container
- **Logger UI**: Dozzle for viewing logs (optional, available at http://localhost:8080)

To use Docker Compose:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and start
docker-compose up -d --build
```

## License

ISC
