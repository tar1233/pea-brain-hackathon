export const handler = async (event) => {
  console.log("PEA Brain Orchestrator Lambda Invoked!");
  
  // CORS Headers for API Gateway
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,GET"
  };

  try {
    // 1. Simulate SAP ERP Plugin Integration
    const sapData = [
      { id: "10067", budgetPrice: 150000, unitPrice: 192800 },
      { id: "10066", budgetPrice: 85000, unitPrice: 120500 },
      { id: "20045", budgetPrice: 4200, unitPrice: 4500 }
    ];

    // 2. Simulate WMS Plugin Integration (Inventory)
    const wmsData = [
      { id: "10067", name: "160 kVA Transformer 3Ph", currentStock: 42, safetyStock: 250, sparkline: [400, 380, 250, 150, 80, 42] },
      { id: "10066", name: "100 kVA Transformer 3Ph", currentStock: 15, safetyStock: 100, sparkline: [120, 100, 80, 60, 40, 15] },
      { id: "20045", name: "Drop Out Fuse Cutout 24kV", currentStock: 1200, safetyStock: 5000, sparkline: [6000, 5200, 4100, 3000, 2100, 1200] }
    ];

    // Merge Systems
    const materials = wmsData.map(wmsItem => {
      const sapItem = sapData.find(sap => sap.id === wmsItem.id) || {};
      return { ...wmsItem, ...sapItem };
    });

    // 3. Simulate AI Orchestrator (Risk Alerts)
    const riskAlerts = [
      { id: "alt-1", severity: "critical", materialId: "10067", message: "Stock critical (42/250). Lead time risk.", costImpact: 169300000 },
      { id: "alt-2", severity: "critical", materialId: "10066", message: "Stock critical (15/100). Vendor delay.", costImpact: 84000000 }
    ];

    // 4. Return aggregated payload
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        materials,
        riskAlerts,
        totalVaR: 253300000,
        message: "Successfully fetched from AWS Lambda Orchestrator!"
      }),
    };
  } catch (error) {
    console.error("Lambda Orchestration Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to communicate with PEA plugins." }),
    };
  }
};
