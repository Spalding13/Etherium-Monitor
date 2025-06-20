# Ethereum Monitor

A Node.js application to monitor Ethereum blockchain transactions based on configurable filters.  
It supports tracking ETH transfers, stablecoin movements, contract interactions, and more.

---

## Features

- Configurable transaction filters (block number, gas price, transaction type, etc.)
- Dynamic configuration management via MongoDB
- Real-time monitoring using Infura as Ethereum provider
- REST API endpoints for monitoring and configuration management

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally or remotely

---

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd <your-repo-directory>

2. Install dependencies:

   ```bash
   npm install

3. Make sure MongoDB is running:

   On Windows/macOS/Linux run:

   ```bash
   mongod

Or start MongoDB service via your OS-specific commands

4. Run the application:

   ```bash
   node ./rootdir/main.js
   Replace ./rootdir/main.js with your actual main file path if different.

Environment Variables
MONGO_URI: MongoDB connection URI (default: mongodb://localhost:27017/eth-monitor)

API Endpoints
/monitor - Access monitoring endpoints

/configure - Access configuration management endpoints

Notes
On first run, the database will be populated with default monitoring configurations.

The app connects to the Ethereum mainnet using Infura by default.

