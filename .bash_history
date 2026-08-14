/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '3000-cs-bb91e112-33e2-4412-8ee7-c5a901b58ff0.cs-europe-west1-onse.cloudshell.dev',
  ],
};

module.exports = nextConfig;
EOF

cat next.config.js
cd ~/bullseye-fx-v-1-project/frontend
pkill -f "next dev" || true
npm run dev
cd ~/bullseye-fx-v-1-project/frontend
python3 - <<'PY'
from pathlib import Path

p = Path("lib/Api.ts")
s = p.read_text()

s = s.replace(
    "const API_URL = 'http://localhost:8000';",
    """const API_URL =
  typeof window !== "undefined"
    ? `https://${window.location.hostname.replace(/^3000-/, "8000-")}`
    : "http://127.0.0.1:8000";"""
)

p.write_text(s)
PY

head -12 lib/Api.ts
cd ~/bullseye-fx-v-1-project/frontend
grep -Rni "localhost:8000" app lib components --include="*.tsx" --include="*.ts"
cd ~/bullseye-fx-v-1-project/frontend
grep -Rni "localhost:8000" app lib components --include="*.tsx" --include="*.ts"
cd ~/bullseye-fx-v-1-project/frontend
python3 - <<'PY'
from pathlib import Path

p = Path("app/login/page.tsx")
s = p.read_text()

s = s.replace(
    'fetch(\'http://localhost:8000/login\',',
    '''fetch(
        `https://${window.location.hostname.replace(/^3000-/, '8000-')}/auth/login`,'''
)

p.write_text(s)
PY

cd ~/bullseye-fx-v-1-project/frontend
python3 - <<'PY'
from pathlib import Path

p = Path("app/login/page.tsx")
s = p.read_text()

s = s.replace(
    'fetch(\'http://localhost:8000/login\',',
    '''fetch(
        `https://${window.location.hostname.replace(/^3000-/, '8000-')}/auth/login`,'''
)

p.write_text(s)
PY

grep -nE "fetch|localhost:8000|auth/login" app/login/page.tsx
cd ~/bullseye-fx-v-1-project/frontend
python3 - <<'PY'
from pathlib import Path

p = Path("app/login/page.tsx")
s = p.read_text()

s = s.replace(
    'const res = await fetch(\'http://localhost:8000/login\', {',
    '''const res = await fetch(
        `https://${window.location.hostname.replace(/^3000-/, "8000-")}/auth/login`,
        {'''
)

p.write_text(s)
PY

sed -n '8,22p' app/login/page.tsx
cd ~/bullseye-fx-v-1-project/frontend
python3 - <<'PY'
from pathlib import Path

p = Path("app/login/page.tsx")
s = p.read_text()

s = s.replace(
    '"http://localhost:8000/login"',
    '`https://${window.location.hostname.replace(/^3000-/, "8000-")}/auth/login`'
)

p.write_text(s)
PY

sed -n '10,20p' app/login/page.tsx
cd ~/bullseye-fx-v-1-project/frontend
npm run build
cd ~/bullseye-fx-v-1-project/frontend
grep -nE "fetch|auth/login|localhost:8000" app/login/page.tsx
cd ~/bullseye-fx-v-1-project/backend
curl -i -X POST http://127.0.0.1:8000/auth/login   -H "Content-Type: application/json"   -d '{"email":"dashboardtest@example.com","password":"TestPassword123!"}'
cd ~/bullseye-fx-v-1-project/frontend
grep -n "const res = await fetch" app/login/page.tsx
echo "https://$(echo "$CLOUD_SHELL_WEB_HOST" 2>/dev/null)"
hostname
echo "$CLOUD_SHELL_WEB_HOST"
env | grep -iE 'cloud.*shell|web.*host|preview'
cd ~/bullseye-fx-v-1-project
git status --short
cd ~/bullseye-fx-v-1-project
git status --short
cd ~/Bullseye_fx_-v.1-project
pwd
cd ~/Bullseye_fx_-v.1-project
ls
cd ~/Bullseye-fx-v-1-project
cd ~
ls
unzip -q "Bullseye_fx_-v.1-project--main (1).zip" -d bullseye-check
ls -lh
unzip -q 'Bullseye-fx-v-1-project--main (3).zip' -d bullseye
unzip -q ./*.zip -d bullseye
ls bullseye
cd bullseye/Bullseye-fx-v-1-project
cd bullseye/Bullseye-fx-v-1-project--main
ls -lb bullseye
cd bullseye/Bull
cd bullseye/B*
ls
cd frontend
ls
ls -lb lib
cat tsconfig.json
cat next.config.js
cd ..
pwd
cat next.config.js
ls -la frontend | grep -E "next.config|tsconfig|package"
grep -RIn "@/lib/Api" frontend --exclude-dir=node_modules --exclude-dir=.next
find frontend -type f \( -name "*.ts" -o -name "*.tsx" \) -print | grep -E "Api|api"
cat frontend/lib/Api.js
find frontend -type f -iname "api.*" -print
cat frontend/lib/Api.ts
cd frontend && node -e "let fs=require('fs');let p=JSON.parse(fs.readFileSync('tsconfig.json','utf8'));p.compilerOptions.baseUrl='.';p.compilerOptions.paths={'@/*':['./*']};fs.writeFileSync('tsconfig.json',JSON.stringify(p,null,2)+'\n')"
cat package.json
find app components lib -type f | sort
grep -RInE "@/lib/[Aa]pi|lib/[Aa]pi" app components lib --exclude-dir=node_modules
npm run build
npm install
npm run build
sed -i '/"baseUrl":/d' tsconfig.json
npm run build
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
cd ../backend
pwd
cd ~/bullseye/Bullseye-fx-v-1-project--main/frontend
cd ~/bullseye
ls
cd ~/bullseye/B*
cd frontend
curl http://localhost:8000/health
curl http://localhost:8000/dashboard/stats
curl -i http://localhost:8000/docs
cat app/register/page.tsx
pdw
ls
pdw
cd backend 
cd backend
c
cd frontend
cat app/register/page.tsx
find app -type f -iname "*register*" -print
pwd
cd ~/bullseye/B*/frontend
pwd
find app -type f -iname "*register*" -print
find app -maxdepth 3 -type f -print
cat app/register/page.tsx
grep -nE "form|onSubmit|button|Register|disabled|fetch|api" app/register/page.tsx
sed -n '40,65p' app/register/page.tsx
cd ../backend
grep -RInE "register|@router.post" app/routes/auth.py
cd ../backend
grep -RInE "register|@router.post" app/routes/auth.py
grep -RIn "class UserRegister" app
sed -n '1,20p' app/schemas/out.py
find app -type f -name "out.py" -print
grep -RIn "class UserRegister" app
sed -n '1,30p' app/schemas/auth.py
sed -n '1,35p' app/routes/auth.py
grep -RInE "NEXT_PUBLIC|localhost:8000|API_URL|BASE_URL" . --exclude-dir=node_modules --exclude-dir=.next
grep -RInE "localhost:8000|/register|fetch\(|axios|API_URL|NEXT_PUBLIC" app components lib --exclude-dir=node_modules
cd ../frontend
pwd
cd ~/bullseye/B*/frontend
pwd
grep -RInE "localhost:8000|NEXT_PUBLIC|API_URL|BASE_URL" app components lib --exclude-dir=node_modules --exclude-dir=.next
grep -nE "^export|register|login" lib/Api.ts
sed -n '1,45p' lib/Api.ts
cp app/register/page.tsx app/register/page.tsx.backup
cp lib/Api.ts lib/Api.ts.backup
cat >> lib/Api.ts <<'EOF'

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.detail || result?.message || "Registration failed"
    );
  }

  return result;
}
EOF

cat > app/register/page.tsx <<'EOF'
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../lib/Api";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!username.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      router.push("/login");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "60px auto", padding: 20 }}>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Brian17"
            required
            style={{ display: "block", width: "100%", padding: 10 }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="brian@example.com"
            required
            style={{ display: "block", width: "100%", padding: 10 }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="StrongPassword123"
            required
            minLength={6}
            style={{ display: "block", width: "100%", padding: 10 }}
          />
        </div>

        {error && (
          <p style={{ color: "red", marginBottom: 16 }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p style={{ marginTop: 20 }}>
        Already have an account?{" "}
        <a href="/login">Log in</a>
      </p>
    </main>
  );
}
EOF

npm run build
grep -nE "export|login|Login|fetch|POST" lib/Api.ts app/login/page.tsx
cp app/login/page.tsx app/login/page.tsx.backup
cat >> lib/Api.ts <<'EOF'

export async function loginUser(data: {
  username: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.detail || result?.message || "Login failed"
    );
  }

  if (result?.access_token) {
    localStorage.setItem("access_token", result.access_token);
  }

  return result;
}
EOF

cat > app/login/page.tsx <<'EOF'
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../lib/Api";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser({
        username: username.trim(),
        password,
      });

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "60px auto", padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>Login</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: 10,
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: 10,
            }}
          />
        </div>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: 20, textAlign: "center" }}>
        Don't have an account?{" "}
        <a href="/register">Create one</a>
      </p>
    </main>
  );
}
EOF

npm run build
git status
git add .
git commit -m "Fix registration flow"
git push
git remote -v
git remote set-url origin https://github.com/Brian-17/Bullseye_FX_-V.1-project-.git
git remote -v
git push
git pull --rebase origin main
git push origin main
git pull --rebase origin main
git status
git add .
git commit -m "Fix registration and login flows"
git pull --rebase origin main
git status
