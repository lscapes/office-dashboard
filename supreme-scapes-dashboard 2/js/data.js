// ============================================================
//  Supreme Scapes — Dashboard Data
//  Edit this file to update all numbers across the dashboard.
//  No coding knowledge needed — just change the values below.
// ============================================================

const SS = {

  // ---- KPI: Revenue ----------------------------------------
  revenue: {
    goal:    2200000,   // Annual revenue goal
    actual:  1347000,   // YTD actual revenue (update monthly)
    month:   "May 2026"
  },

  // ---- KPI: AP as % of COGS --------------------------------
  ap: {
    current: 13,        // Current AP % of COGS
    goal:    10,        // Target
    stressed: 19        // Stressed benchmark (where you were)
  },

  // ---- KPI: Leads in Pipeline ------------------------------
  leads: {
    new:         12,    // New leads this month
    qualified:    8,    // Qualified / consult booked
    estimateSent: 6,    // Estimates sent
    won:          3,    // Jobs won this month
    avgJobValue:  9400  // Average job value ($)
  },

  // ---- KPI: Revenue by type --------------------------------
  revenueByType: [
    { label: "Hardscape",    value: 540000,  color: "#b45309" },
    { label: "Lawn",         value: 310000,  color: "#65a30d" },
    { label: "Landscape",    value: 275000,  color: "#15803d" },
    { label: "Commercial",   value: 158000,  color: "#0369a1" },
    { label: "Snow",         value: 64000,   color: "#6366f1" },
  ],

  // ---- Photo Tracker Projects -------------------------------
  // type options: "Hardscape" | "Landscape Install" | "Lawn" | "Commercial Maint." | "Snow"
  // shots: mark true when captured in CompanyCam
  projects: [
    {
      id: 1, name: "Henderson Patio & Wall", type: "Hardscape",
      pm: "Kevin", date: "2026-05-01", notes: "",
      jessaNeeded: true, jessaDone: false, organized: false,
      shots: {}
    },
    {
      id: 2, name: "Riverside Commons", type: "Commercial Maint.",
      pm: "Jake", date: "2026-05-02", notes: "",
      jessaNeeded: false, jessaDone: false, organized: true,
      shots: { Before_stills: true, Before_walkthrough: true, During_stills: true, After_stills: true, After_walkthrough: true }
    },
    {
      id: 3, name: "Callahan Backyard", type: "Hardscape",
      pm: "Kevin", date: "2026-05-03", notes: "Drone after still needed",
      jessaNeeded: false, jessaDone: false, organized: false,
      shots: { Before_stills: true, Before_walkthrough: true, Before_drone_stills: true, Before_drone_video: true }
    },
    {
      id: 4, name: "Morrison Landscape", type: "Landscape Install",
      pm: "Jake", date: "2026-05-05", notes: "",
      jessaNeeded: true, jessaDone: true, organized: true,
      shots: { Before_stills: true, Before_walkthrough: true, Before_drone_stills: true, Before_drone_video: true, During_stills: true }
    },
    {
      id: 5, name: "Chen Lawn Install", type: "Lawn",
      pm: "Kevin", date: "2026-05-06", notes: "",
      jessaNeeded: false, jessaDone: false, organized: false,
      shots: { Before_stills: true, Before_walkthrough: true, During_stills: true, During_walkthrough: true, After_stills: true, After_walkthrough: true }
    },
    {
      id: 6, name: "Whitmore Retaining Wall", type: "Hardscape",
      pm: "Jake", date: "2026-05-08", notes: "Scheduled next week",
      jessaNeeded: false, jessaDone: false, organized: false,
      shots: {}
    },
    {
      id: 7, name: "Pinnacle Office Park", type: "Commercial Maint.",
      pm: "Jake", date: "2026-05-09", notes: "",
      jessaNeeded: false, jessaDone: false, organized: false,
      shots: { Before_stills: true, Before_walkthrough: true, After_stills: true, After_walkthrough: true }
    },
  ],

  // ---- Lead Pipeline ----------------------------------------
  pipeline: [
    { id: 1, name: "Tanner Property",     type: "Hardscape",         value: 18500, stage: "New",           source: "Web Form",   pm: "Jamie", date: "2026-05-01" },
    { id: 2, name: "Greystone HOA",       type: "Commercial Maint.", value: 42000, stage: "Consult Booked", source: "Referral",   pm: "Jamie", date: "2026-04-28" },
    { id: 3, name: "Kirkland Residence",  type: "Landscape Install", value: 11200, stage: "Estimate Sent",  source: "Web Form",   pm: "Jamie", date: "2026-04-25" },
    { id: 4, name: "Elm Street Commons",  type: "Commercial Maint.", value: 36000, stage: "Estimate Sent",  source: "Cold Outreach", pm: "Jamie", date: "2026-04-22" },
    { id: 5, name: "Novak Backyard",      type: "Hardscape",         value: 9800,  stage: "New",           source: "Web Form",   pm: "Jamie", date: "2026-05-02" },
    { id: 6, name: "Pearson Pool Patio",  type: "Hardscape",         value: 22000, stage: "Won",           source: "Referral",   pm: "Jamie", date: "2026-04-15" },
    { id: 7, name: "Summit Business Park",type: "Commercial Maint.", value: 54000, stage: "Consult Booked", source: "Cold Outreach", pm: "Jamie", date: "2026-04-29" },
    { id: 8, name: "Huang Lawn",          type: "Lawn",              value: 3200,  stage: "Won",           source: "Web Form",   pm: "Jamie", date: "2026-04-10" },
    { id: 9, name: "Fischer Estate",      type: "Landscape Install", value: 15500, stage: "New",           source: "Referral",   pm: "Jamie", date: "2026-05-03" },
    { id:10, name: "Birchwood Condos",    type: "Commercial Maint.", value: 28000, stage: "Estimate Sent",  source: "Cold Outreach", pm: "Jamie", date: "2026-05-01" },
  ]

};
