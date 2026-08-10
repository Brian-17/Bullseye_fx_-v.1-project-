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
git add .
git commit -m "Initial commit: Next.js app running on port 3001 - Bullseye is Live 🚀"
git remote add origin https://github.com/YOUR-USERNAME/bullseye.git
git branch -M main
git push -u origin main
git remote remove origin
git remote add origin https://github.com/Brian-17/bullseye.git
echo "node_modules/" >> .gitignore
git rm -r --cached node_modules
git add .gitignore
git commit -m "Add .gitignore"
git push -u origin main
git pull origin main --rebase
git push -u origin main
git add .gitignore
git commit -m "Add .gitignore and remove node_modules"
git pull origin main --rebase
git push -u origin main
echo "node_modules/" >> .gitignore
echo ".next/" >> .gitignore
echo ".gemini/" >> .gitignore
echo ".bash_history" >> .gitignore
echo "*.log" >> .gitignore
git add .gitignore app/ package.json package-lock.json
git commit -m "Initial commit: Next.js Bullseye app"
git pull origin main --rebase
git push -u origin main
git push -u origin main --force
cloudshe shell terminal echo ".next/" >> .gitignore
echo "node_modules/" >> .gitignore
git rm -r --cached .next node_modules 2>/dev/null
git add .gitignore
git commit -m "Cleanup: ignore build files"
git push
cd ~/Bullseye_fx_backup/frontend
npm run build
cd ~/Bullseye_fx_backup/frontend
pwd
cat package.json
npm run
cd ~/Bullseye_fx_backup
git status
git remote -v
cd ~/Bullseye_fx_backup
git rev-parse HEAD
git rev-parse origin/main
git log --oneline -3
cd ~/Bullseye_fx_backup/frontend
npm run build
cd ~/Bullseye_fx_backup/frontend
cat package.json
cd ~/Bullseye_fx_backup/frontend
npm pkg set scripts.dev="next dev"
npm pkg set scripts.build="next build"
npm pkg set scripts.start="next start"
cat package.json
cd ~/Bullseye_fx_backup/frontend
npm run build
cd ~/Bullseye_fx_backup/frontend
cat lib/Api.ts
cd ~/Bullseye_fx_backup/frontend
cat > lib/Api.ts <<'EOF'
const API_URL = "http://localhost:8000";

function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("access_token");
}

export async function getTrades() {
  const token = getToken();

  const response = await fetch(`${API_URL}/trades/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch trades: ${response.status}`);
  }

  return response.json();
}
EOF

tail -n 5 lib/Api.ts
npm run build
cd ~/Bullseye_fx_backup/frontend
cat > lib/Api.ts <<'EOF'
const API_URL = "http://localhost:8000";

function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("access_token");
}

async function apiFetch(path: string) {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export async function getTrades() {
  return apiFetch("/trades/");
}

export async function getDashboardStats() {
  return apiFetch("/dashboard/stats");
}
EOF

tail -n 12 lib/Api.ts
cd ~/Bullseye_fx_backup/frontend
npm run build
cd ~/Bullseye_fx_backup/frontend
find components -type f -iname 'positionsizecalculator.tsx' -print
cd ~/Bullseye_fx_backup/frontend
rm -f components/dashboard/positionsizecalculator.tsx
find components -type f -iname 'positionsizecalculator.tsx' -print
npm run build
cd ~/Bullseye_fx_backup/frontend
cat package.json
cd ~/Bullseye_fx_backup/frontend
npm pkg delete type
grep '"type"' package.json
npm run build
cd ~/Bullseye_fx_backup/frontend
cat > "app/Dashboard /page.tsx" <<'EOF'
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
find components/dashboard components/Dashboard -maxdepth 1 -type f -print 2>/dev/null | sort
cd ~/Bullseye_fx_backup/frontend
rm -rf components/dashboard
find components -maxdepth 2 -type f -print | sort
cd ~/Bullseye_fx_backup/frontend
grep -RniE 'components/dashboard|PerformanceChart|RecentTrades|AISignalPanel|EconomicCalendar|MarketOverview|RiskRewardCalculator|BullseyeSetupBuilder' app components --include='*.tsx'
cd ~/Bullseye_fx_backup/frontend
sed -i 's#components/dashboard/#components/Dashboard/#g' app/page.tsx app/dashboard/page.tsx
grep -Rni 'components/dashboard' app --include='*.tsx'
grep -Rn 'components/dashboard' app --include='*.tsx'
cd ~/Bullseye_fx_backup/frontend
mv "components/Dashboard/performancechart.tsx" "components/Dashboard/PerformanceChart.tsx"
mv "components/Dashboard/recenttrades.tsx" "components/Dashboard/RecentTrades.tsx"
mv "components/Dashboard/riskrewardcalculator.tsx" "components/Dashboard/RiskRewardCalculator.tsx"
mv "components/Dashboard/positionsizecalculator.tsx" "components/Dashboard/PositionSizeCalculator.tsx"
mv "components/Dashboard/market overview.tsx" "components/Dashboard/MarketOverview.tsx"
mv "components/Dashboard/Economic calender.tsx" "components/Dashboard/EconomicCalendar.tsx"
mv "components/Dashboard/AIsignalpannel.tsx" "components/Dashboard/AISignalPanel.tsx"
mv "components/Dashboard/Bulles'eyesetupbuilder.tsx" "components/Dashboard/BullseyeSetupBuilder.tsx"
cd ~/Bullseye_fx_backup/frontend
find components/Dashboard -maxdepth 1 -type f -print | sort
cd ~/Bullseye_fx_backup/frontend
find components/Dashboard -maxdepth 1 -type f -print | sort
cd ~/Bullseye_fx_backup/frontend
cat > "app/Dashboard /page.tsx" <<'EOF'
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

cd ~/Bullseye_fx_backup/frontend
find app -maxdepth 2 -type f -print | sort
cd ~/Bullseye_fx_backup/frontend
rm -rf "app/Dashboard "
find app -maxdepth 2 -type f -print | sort
cd ~/Bullseye_fx_backup/frontend
mv components components_tmp
mv components_tmp components
mv app app_tmp
mv app_tmp app
mv Journal journal_tmp 2>/dev/null || true
cd ~/Bullseye_fx_backup/frontend
mv components/Dashboard components/dashboard_tmp
mv components/dashboard_tmp components/dashboard
mv app/Journal app/journal_tmp
mv app/journal_tmp app/journal
mv app/Login app/login_tmp
mv app/login_tmp app/login
mv app/Dashboard app/dashboard_tmp 2>/dev/null || true
cd ~/Bullseye_fx_backup/frontend
find . -type d -print | sort
mv components/Dashboard components/dashboard
sed -i 's/components\/Dashboard/components\/dashboard/g' app/page.tsx app/dashboard/page.tsx
npm run build
cat -n app/Journal/Page.tsx
cd ~/Bullseye_fx_backup/frontend
cat > app/Journal/Page.tsx <<'EOF'
import TradeCard from "../../components/journal/TradeCard";

export default function TradingJournal() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>Trading Journal</h1>

      <p>Record every trade and improve your performance.</p>

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
    </div>
  );
}
EOF

npm run build
cat > app/Journal/Page.tsx << 'EOF'
export default function TradingJournal() {
  return (
    <div>
      <h1>Trading Journal</h1>
      <p>Record every trade and improve your performance.</p>

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
    </div>
  );
}
EOF

cd ~/Bullseye_fx_backup/frontend
sed -n '1,80p' app/journal/Page.tsx
head -n 25 app/Journal/Page.tsx > app/Journal/Page.tmp && mv app/Journal/Page.tmp app/Journal/Page.tsx
npm run build
cd ~/Bullseye_fx_backup/frontend
python3 - <<'PY'
from pathlib import Path

p = Path("app/journal/Page.tsx")
text = p.read_text()

marker = '\nexport default function TradingJournal() {'
first = text.find(marker)
second = text.find(marker, first + 1)

if second != -1:
    text = text[:second].rstrip() + '\n'

p.write_text(text)
PY

cat app/journal/Page.tsx
cd ~/Bullseye_fx_backup/frontend
npm run build
cd ~/Bullseye_fx_backup/frontend
npm run build
cd ~/Bullseye_fx_backup
git status
cd ~/Bullseye_fx_backup && git status --short
cat >> .gitignore << 'EOF'
__pycache__/
*.pyc
*.swp
backend/venv/
node_modules/
.next/
EOF

git add -A
git commit -m "fix: resolve case sensitivity issues - rename Dashboard to dashboard and Journal files"
git push
git remote set-url origin https://github.com/Brian-17/bullseye.git
git push -u origin main
git pull origin main
git remote set-url origin https://github.com/Brian-17/bullseye.git
git push -u origin main
git push -f origin main
vercel login
vercel clone bullseye-fx-v-1-project
cd bullseye-fx-v-1-project
npm install -g vercel
vercel login
vercel pull --yes --environment=Production --token=$(vercel whoami)
vercel link
vercel pull --yes --environment=Production
vercel pull --yes --environment=production
npm install @supabase/supabase-js
mkdir -p lib
cat > lib/supabaseClient.ts << 'EOF'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
EOF

vercel --prod
ls
cd bullseye-fx-v-1-project
rm -rf lib
mkdir -p lib
cat > lib/supabaseClient.ts << 'EOF'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
EOF

vercel --prod
vercel unlink
rm .vercel/project.json
vercel link
rm -rf .vercel
vercel link
rm -rf .vercel
vercel link --project=bullseye-fx-v-1-project
cat .vercel/project.json
vercel --prod
rm -rf node_modules .vercel
npm install
vercel link --project=bullseye-fx-v-1-project --yes
vercel --prod
rm -rf node_modules .vercel
npm install
vercel link --project=bullseye-fx-v-1-project --yes
vercel --prod
rm -rf node_modules .vercel
pwd
ls -la
cat package.json | grep name
rm -rf .vercel
vercel link --project=bullseye-fx-v-1-project --yes
vercel --prod
cat > .vercelignore << EOF
node_modules
.next
.git
*.log
EOF

rm -rf .vercel
vercel link --project=bullseye-fx-v-1-project --yes
vercel --prod --force --no-git
cat > .vercelignore << EOF
node_modules
.next
.git
*.log
EOF

rm -rf .vercel
vercel link --project=bullseye-fx-v-1-project --yes
vercel --prod --force --no-git
vercel --prod --force
vercel --prod --force --no-git
vercel --prod --force
git init
