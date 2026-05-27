# KoinX — Tax Loss Harvesting Tool

A responsive React application for the KoinX Frontend Intern Assignment.

## Screenshots

<img width="1470" height="815" alt="Screenshot 2026-05-27 at 1 49 25 PM" src="https://github.com/user-attachments/assets/64b58b01-8a6c-4dc3-bad7-e3d07ff77eff" />
<img width="1470" height="609" alt="Screenshot 2026-05-27 at 1 49 32 PM" src="https://github.com/user-attachments/assets/6f328c6c-64f7-4bc5-bb20-0b1553fe74e4" />


## Setup Instructions

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd koinx-tax-loss-harvesting

# Install dependencies
npm install

# Start development server
npm start
```

The app runs on [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

## Deployment

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Drag the `build/` folder into Netlify's deploy dashboard
```

Or connect your GitHub repo in Netlify/Vercel and it deploys automatically on push.

## Project Structure

```
src/
├── api/
│   └── mockData.js     # Mock API responses (Holdings + Capital Gains)
├── App.js              # Main component with all logic
├── App.css             # Complete styles (responsive)
└── index.js            # React entry point
```

## Features

- **Pre-Harvesting card** — shows Short-term & Long-term profits/losses and Realised Capital Gains from the Capital Gains API
- **After-Harvesting card** — mirrors Pre-Harvesting initially; updates in real-time as holdings are selected
- **Holdings Table** — rendered from Holdings API with checkbox selection, select-all, and "View All" pagination
- **Business Logic** — selecting a holding adds its gain to profits (if positive) or losses (if negative); updates After-Harvesting card instantly
- **Savings Banner** — shown only when After-Harvesting realised gains < Pre-Harvesting realised gains
- **Skeleton Loaders** — for both API calls
- **Responsive** — works on mobile and desktop
- **Disclaimer accordion** — expandable important notes section

## Assumptions

1. The "Amount to Sell" column populates with `totalHoldings` when the row is selected (as specified in the Figma).
2. API mocking is done via Promises inside `src/api/mockData.js` with realistic delays (600–800ms).
3. Coin logos are loaded from CoinGecko CDN; a fallback initial circle is shown if the image fails.
4. `ETH2` and `USDT2` represent additional Ethereum/Tether positions as separate line items.
5. Currency is displayed in USD ($) format using `en-IN` locale for comma formatting.
