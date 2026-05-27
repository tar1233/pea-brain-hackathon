"use client";

import AlertHero from "./AlertHero";
import AlertTable from "./AlertTable";
import KPICards from "./KPICards";
import MacroMonitor from "./MacroMonitor";

export default function AlertsView({ approvedPlans = [] }: { approvedPlans?: any[] }) {
  return (
    <div className="space-y-4">
      <AlertHero />
      <MacroMonitor />
      <KPICards />
      <AlertTable approvedPlans={approvedPlans} />
    </div>
  );
}
