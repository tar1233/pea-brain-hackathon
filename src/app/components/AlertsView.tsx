"use client";

import AlertHero from "./AlertHero";
import AlertTable from "./AlertTable";
import KPICards from "./KPICards";

export default function AlertsView() {
  return (
    <div className="space-y-4">
      <AlertHero />
      <KPICards />
      <AlertTable />
    </div>
  );
}
