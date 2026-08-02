export function calculateBullseyeScore(checks: boolean[]) {
  const total = checks.length;
  const passed = checks.filter(Boolean).length;

  const score = Math.round((passed / total) * 100);

  let recommendation = "Avoid Trade";

  if (score >= 90) {
    recommendation = "🎯 Bullseye Setup Confirmed";
  } else if (score >= 70) {
    recommendation = "🟡 Wait For More Confirmation";
  }

  return {
    score,
    recommendation,
  };
}
