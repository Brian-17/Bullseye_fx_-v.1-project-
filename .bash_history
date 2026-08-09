    "next-env.d.ts",
    ".next/types/**/*.ts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": ["node_modules"]
}
EOF

cat > next-env.d.ts <<'EOF'
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
EOF

cd ~/Bullseye_fx_backup/frontend
npm instalcd ~/Bullseye_fx_backup/frontend
npm install
cat > package.json <<'EOF'
{
  "name": "bullseye-fx-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "15.5.6",
    "react": "19.1.0",
    "react-dom": "19.1.0"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.2"
  }
}
EOF

ls -l package.json
cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "next-env.d.ts",
    ".next/types/**/*.ts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": ["node_modules"]
}
EOF

ls -l package.json tsconfig.json
cat > next-env.d.ts <<'EOF'
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited manually.
EOF

ls -l package.json tsconfig.json next-env.d.ts
npm install
npm run build
cd ~/Bullseye_fx_backup/frontend
find app components -maxdepth 2 -type f -print | sort
ls -lb app/Dashboard components/Dashboard
cd ~/Bullseye_fx_backup/frontend
mv "app/Dashboard " app/Dashboard
find app -maxdepth 2 -type f -print | sort
cd ~/Bullseye_fx_backup/frontend
sed -i 's#components/dashboard/#components/Dashboard/#g' app/page.tsx
head -n 8 app/page.tsx
npm run build
cd ~/Bullseye_fx_backup/frontend
sed -i 's#PerformanceChart#performancechart#g' app/page.tsx
npm run build
cd ~/Bullseye_fx_backup/frontend
cat -n "app/Dashboard/page.tsx"
cd ~/Bullseye_fx_backup/frontend
cat > "app/Dashboard/page.tsx" <<'EOF'
import RiskRewardCalculator from "../../components/Dashboard/riskrewardcalculator";
import BullseyeSetupBuilder from "../../components/Dashboard/Bulles'eyesetupbuilder";
import EconomicCalendar from "../../components/Dashboard/Economic calender";
import AISignalPanel from "../../components/Dashboard/AIsignalpannel";
import MarketOverview from "../../components/Dashboard/market overview";
import StatsCard from "../../components/Dashboard/StatsCard";
import PerformanceChart from "../../components/Dashboard/performancechart";
import RecentTrades from "../../components/Dashboard/recenttrades";

export default function DashboardPage() {
  return (
    <main
      style={{
        padding: "40px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1>Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <StatsCard title="Total Trades" value="0" />
        <StatsCard title="Win Rate" value="0%" />
        <StatsCard title="Account Balance" value="$0.00" />
        <StatsCard title="Active Signals" value="0" />
      </div>

      <PerformanceChart />
      <MarketOverview />
      <RecentTrades />
      <AISignalPanel />
      <EconomicCalendar />
      <BullseyeSetupBuilder />
      <RiskRewardCalculator />
    </main>
  );
}
EOF

npm run build
cd ~/Bullseye_fx_backup/frontend
cat > "app/Dashboard/page.tsx" <<'EOF'
import RiskRewardCalculator from "../../components/Dashboard/riskrewardcalculator";
import BullseyeSetupBuilder from "../../components/Dashboard/Bulles'eyesetupbuilder";
import EconomicCalendar from "../../components/Dashboard/Economic calender";
import AISignalPanel from "../../components/Dashboard/AIsignalpannel";
import MarketOverview from "../../components/Dashboard/market overview";
import StatsCard from "../../components/Dashboard/StatsCard";
import PerformanceChart from "../../components/Dashboard/performancechart";
import RecentTrades from "../../components/Dashboard/recenttrades";

export default function DashboardPage() {
  return (
    <main
      style={{
        padding: "40px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1>Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <StatsCard title="Total Trades" value="0" />
        <StatsCard title="Win Rate" value="0%" />
        <StatsCard title="Account Balance" value="$0.00" />
        <StatsCard title="Active Signals" value="0" />
      </div>

      <PerformanceChart />
      <MarketOverview />
      <RecentTrades />
      <AISignalPanel />
      <EconomicCalendar />
      <BullseyeSetupBuilder />
      <RiskRewardCalculator />
    </main>
  );
}
EOF

cat -n "app/Dashboard/page.tsx"
npm run build
cd ~/Bullseye_fx_backup/frontend
cat -n "app/Journal/Page.tsx"
cd ~/Bullseye_fx_backup/frontend
cat -n "app/Journal/Page.tsx"
cd ~/Bullseye_fx_backup/frontend
cat > "app/Journal/Page.tsx" <<'EOF'
import TradeCard from "../../components/journal/TradeCard";

export default function TradingJournal() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>Trading Journal</h1>

      <TradeCard
        pair="XAU/USD"
        type="BUY"
        result="+$250"
      />

      <TradeCard
        pair="NAS100"
        type="SELL"
        result="-$80"
      />

      <TradeCard
        pair="S&P 500"
        type="BUY"
        result="+$145"
      />

      <p>Record every trade and improve your performance.</p>
    </div>
  );
}
EOF

npm run build
cd ~/Bullseye_fx_backup/frontend
npm run build
cd ~/Bullseye_fx_backup/frontend
grep -Rni "performanceCharts" app components
cd ~/Bullseye_fx_backup/frontend
grep -Rni "performanceCharts" app components
cd ~/Bullseye_fx_backup/frontend
grep -Rni "performanceChart" app components
cd ~/Bullseye_fx_backup/frontend
nl -ba app/page.tsx | sed -n '100,115p'
cd ~/Bullseye_fx_backup/frontend
nl -ba app/page.tsx | sed -n '100,115p'
nl -ba app/Dashboard/page.tsx | sed -n '1,45p'
# Fix component casing in app/page.tsx
sed -i 's/<performancechart /<PerformanceChart /g' app/page.tsx
# Fix gridTemplateColumns typo
sed -i 's/minmax(250px,1fr)/minmax(250px,1fr))/g' app/Dashboard/page.tsx
cd components/Dashboard
mv performancechart.tsx PerformanceChart.tsx
mv recenttrades.tsx RecentTrades.tsx
mv "market overview.tsx" MarketOverview.tsx
mv "Economic calender.tsx" EconomicCalendar.tsx
mv AIsignalpannel.tsx AISignalPanel.tsx
mv "riskrewardcalculator.tsx" RiskRewardCalculator.tsx
mv "Bulles'eyesetupbuilder.tsx" BullseyeSetupBuilder.tsx
cd ../../
npm run build
sed -i 's#../../components/Dashboard/risk#../../components/Dashboard/RiskRewardCalculator#g; 
s#../../components/Dashboard/Bull#../../components/Dashboard/BullseyeSetupBuilder#g; 
s#../../components/Dashboard/Economic#../../components/Dashboard/EconomicCalendar#g; 
s#../../components/Dashboard/AI#../../components/Dashboard/AISignalPanel#g; 
s#../../components/Dashboard/market#../../components/Dashboard/MarketOverview#g' app/Dashboard/page.tsx
head -n 9 app/Dashboard/page.tsx
npm run build
vcat > app/Dashboard/page.tsx << 'EOF'
import RiskRewardCalculator from "../../components/Dashboard/RiskRewardCalculator";
import BullseyeSetupBuilder from "../../components/Dashboard/BullseyeSetupBuilder";
import EconomicCalendar from "../../components/Dashboard/EconomicCalendar";
import AISignalPanel from "../../components/Dashboard/AISignalPanel";
import MarketOverview from "../../components/Dashboard/MarketOverview";
import StatsCard from "../../components/Dashboard/StatsCard";
import PerformanceChart from "../../components/Dashboard/PerformanceChart";
import RecentTrades from "../../components/Dashboard/RecentTrades";

export default function DashboardPage() {
  return (
    <main
      style={{
        padding: "40px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1>Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <StatsCard title="Total Trades" value="0" />
        <StatsCard title="Win Rate" value="0%" />
        <StatsCard title="Account Balance" value="$0.00" />
        <StatsCard title="Active Signals" value="0" />
      </div>

      <PerformanceChart />
      <MarketOverview />
      <RecentTrades />
      <AISignalPanel />
      <EconomicCalendar />
      <BullseyeSetupBuilder />
      <RiskRewardCalculator />
    </main>
  );
}
EOF

npm run build
# 1. Rename folder to lowercase
mv app/Dashboard app/dashboard
# 2. Rewrite the file properly with imports
cat > app/dashboard/page.tsx << 'EOF'
'use client';

import RiskRewardCalculator from "../../components/Dashboard/RiskRewardCalculator";
import BullseyeSetupBuilder from "../../components/Dashboard/BullseyeSetupBuilder";
import EconomicCalendar from "../../components/Dashboard/EconomicCalendar";
import AISignalPanel from "../../components/Dashboard/AISignalPanel";
import MarketOverview from "../../components/Dashboard/MarketOverview";
import StatsCard from "../../components/Dashboard/StatsCard";
import PerformanceChart from "../../components/Dashboard/PerformanceChart";
import RecentTrades from "../../components/Dashboard/RecentTrades";

export default function DashboardPage() {
  return (
    <main
      style={{
        padding: "40px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1>Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <StatsCard title="Total Trades" value="0" />
        <StatsCard title="Win Rate" value="0%" />
        <StatsCard title="Account Balance" value="$0.00" />
        <StatsCard title="Active Signals" value="0" />
      </div>

      <PerformanceChart />
      <MarketOverview />
      <RecentTrades />
      <AISignalPanel />
      <EconomicCalendar />
      <BullseyeSetupBuilder />
      <RiskRewardCalculator />
    </main>
  );
}
EOF

npm run build
sed -i 's/import performancechart/import PerformanceChart/g' app/page.tsx
sed -i 's#../components/Dashboard#../components/dashboard#g' app/page.tsx
sed -i 's/<performancechart /<PerformanceChart /g' app/page.tsx
npm run build
# 1. Rename the folder
mv components/Dashboard components/dashboard
# 2. Rename all files inside to PascalCase
cd components/dashboard
mv sidebar.tsx Sidebar.tsx
mv topbar.tsx Topbar.tsx
mv statscard.tsx StatsCard.tsx
mv performancechart.tsx PerformanceChart.tsx
ls
cd ../../
npm run build
sed -i 's#../../components/Dashboard#../../components/dashboard#g' app/dashboard/page.tsx
head -n 8 app/dashboard/page.tsx
npm run build
# 1. Fix the import name and path
sed -i 's/performancechar/PerformanceChart/g' app/page.tsx
# 2. Make sure folder is lowercase
sed -i 's#../components/Dashboard#../components/dashboard#g' app/page.tsx
npm run build
sed -i 's/PerformanceChartt/PerformanceChart/g' app/page.tsx
grep "PerformanceChart" app/page.tsx
npm run build
cd ~/Bullseye_fx_backup/backend
npm install
ls -la ~/Bullseye_fx_backup/backend
# 1. Activate virtual env - create one if you don't have it
python3 -m venv venv
source venv/bin/activate
# 2. Install deps
pip install -r requirements.txt
# 3. Start FastAPI server
cd ~/Bullseye_fx_backup/frontend
npm install
cd ~/Bullseye_fx_backup/frontend
npm install
cd ~/Bullseye_fx_backup/backend
git pull
cd ~/Bullseye_fx_backup
git pull
cd ~/Bullseye_fx_backup
git fetch --all
git reset --hard origin/main
# Terminal 1: Backend
cd backend
uvicorn app.main:app --reload --port 5000 --host 0.0.0.0
# Terminal 2: Frontend  
cd ../frontend
npm run dev
pkill -f uvicorn
uvicorn app.main:app --reload --port 5000 --host 0.0.0.0
cd ~/Bullseye_fx_backup/backend
cd ~/Bullseye_fx_backup/frontend
rm package.json package-lock.json
git checkout package.json package-lock.json
npm install
npm run dev
# 1. Kill old backend
pkill -f uvicorn
# 2. Start backend
cd ~/Bullseye_fx_backup/backend
uvicorn app.main:app --reload --port 5000 --host 0.0.0.0
cd ~/Bullseye_fx_backup
# 1. Force restore frontend folder from github
git checkout HEAD -- frontend/
# 2. Go to frontend and install
cd frontend
npm install
# 3. Start frontend
npm run dev
cd ~/Bullseye_fx_backup/frontend
# 1. Delete the broken file
rm package.json
# 2. Create a new clean package.json
cat > package.json << 'EOF'
{
  "name": "bullseye-fx-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3002",
    "build": "next build",
    "start": "next start -p 3002",
    "lint": "next lint"
  },
  "dependencies": {
    "axios": "^1.7.2",
    "next": "14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.14.11",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.40",
    "tailwindcss": "^3.4.6",
    "typescript": "^5.5.3"
  }
}
EOF

# 3. Install and run
npm install
npm run devo
npm run dev
lsof -ti:3002 | xargs kill -9
npm run dev
pkill -f "next dev"
npm run dev
npm run dev
cd ~/Bullseye_fx_backup/frontend
cd ~/Bullseye_fx_backup/backend
pkill -f uvicorn
uvicorn app.main:app --reload --port 5000 --host 0.0.0.0
# 3. Fix and start frontend - new terminal
cd ~/Bullseye_fx_backup/frontend
rm package.json package-lock.json
git checkout package.json package-lock.json
npm install
npm run dev
uvicorn main:app --host 0.0.0.0 --port 5000 --reload --without-docs
axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`)
pkill -f "next dev"
npm run dev
npm run dev
cd ~/Bullseye_fx_backup/backend
pkill -f uvicorn
uvicorn main:app --host 0.0.0.0 --port 5000 --reload
cd ~/Bullseye_fx_backup/frontend
pkill -f "next dev"
cd ~/Bullseye_fx_backup/backend
ls
cd ~/Bullseye_fx_backup/backend
ls
cd ~/Bullseye_fx_backup/frontend
pkill -f "next dev"
cd ~/Bullseye_fx_backup/backend
uvicorn app.main:app --host 0.0.0.0 --port 5000 --reload
cd ~/Bullseye_fx_backup/frontend
pwd
ls
pkill -f "next dev"
npm install
npm run dev
find . -name package.jsofind . -name package.json
find . -name package.json
cd app
ls
cd ..
ls
npm init -y
npm install next react react-dom
npm install -D typescript @types/react @types/nodenpm install -D typescript @types/react @types/node
npm install -D typescript @types/react @types/node
echo '{
  "name": "bullseye-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^16.3.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8"
  },
  "devDependencies": {
    "@types/node": "^26.2.0",
    "@types/react": "^19.2.18",
    "typescript": "^7.0.2"
  }
}' > package.json
npm run dev
npm install
npm run dev
BLfuser -k 3000/tcp
lsof -i :3000
killall node
npm run dev
npm run dev -- -p 3001
npm run dev -- -p 3001 -H 0.0.0.0
mkdir -p app
echo 'export default function Home() {
  return <h1 style={{textAlign: "center", marginTop: "100px"}}>Bullseye is Live 🚀</h1>
}' > app/page.tsx
echo 'module.exports = {
  allowedDevOrigins: ["3001-cs-bb91e112-33e2-4412-8ee7-c5a901b58ff0.cs-europe-west1-onse.cloudshell.dev"]
}' > next.config.js
npm run dev -- -p 3001 -H 0.0.0.0
echo 'export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}' > app/layout.tsx
git init
