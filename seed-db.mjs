import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

const seedProjects = [
  { kunde: "BI", projekt: "BI-UK", status: "BD", geplanterStart: "", bestellung: 1, mentorSupport: "John Nichols", ktmLead: "Diego Castillo", mitarbeiter: "Peter B. / Gerald Thermer", qaa: "Dominik Emerich", stunden: null, wahrscheinlichkeit: 100, bemerkung: "Schulung CopaData FlexLink" },
  { kunde: "CSL USA", projekt: "IGZAP", status: "CD", geplanterStart: "", bestellung: 1, mentorSupport: "", ktmLead: "", mitarbeiter: "Laura Brus", qaa: "", stunden: 150, wahrscheinlichkeit: 80, bemerkung: "" },
  { kunde: "CSL USA", projekt: "IGZAP", status: "BD/DD", geplanterStart: "", bestellung: 0, mentorSupport: "Laura Brus", ktmLead: "", mitarbeiter: "Diego Castillo Aaron", qaa: "", stunden: null, wahrscheinlichkeit: 50, bemerkung: "" },
  { kunde: "Daiichi", projekt: "FZDSE", status: "läuft", geplanterStart: "", bestellung: 1, mentorSupport: "Reinhart Meckel", ktmLead: "", mitarbeiter: "Patrizia Steinhoff", qaa: "Dominik Emerich", stunden: null, wahrscheinlichkeit: 100, bemerkung: "Indien + Dominik E." },
  { kunde: "GENMAR", projekt: "GENLU", status: "DD", geplanterStart: "", bestellung: 0, mentorSupport: "Josef Suchanek", ktmLead: "Jan Leinweber", mitarbeiter: "", qaa: "", stunden: null, wahrscheinlichkeit: 90, bemerkung: "" },
  { kunde: "ITM-Neufahrn", projekt: "ITM", status: "Angebot", geplanterStart: "", bestellung: 0, mentorSupport: "Reinhart Meckel", ktmLead: "Lydia Kreuter", mitarbeiter: "Matthias Kilger", qaa: "Lukas Holländer", stunden: null, wahrscheinlichkeit: 80, bemerkung: "" },
  { kunde: "Octapharma", projekt: "FIBRY", status: "Angebot", geplanterStart: "", bestellung: 0, mentorSupport: "Laura Brus", ktmLead: "Christian Trippler", mitarbeiter: "Max Müller", qaa: "Dominik Emerich", stunden: null, wahrscheinlichkeit: 90, bemerkung: "Indien + TBD / Gerald Thermer" },
  { kunde: "Octapharma", projekt: "FZOPS", status: "Angebot", geplanterStart: "", bestellung: 0, mentorSupport: "", ktmLead: "", mitarbeiter: "Patrizia Steinhoff", qaa: "Dominik Emerich", stunden: null, wahrscheinlichkeit: 90, bemerkung: "Indien + TBD" },
  { kunde: "Octapharma", projekt: "Freeze", status: "Angebot", geplanterStart: "", bestellung: 0, mentorSupport: "", ktmLead: "", mitarbeiter: "", qaa: "", stunden: null, wahrscheinlichkeit: 20, bemerkung: "PD oder BL" },
  { kunde: "Octapharma", projekt: "PANOC", status: "Angebot", geplanterStart: "", bestellung: 0, mentorSupport: "Laura Brus", ktmLead: "", mitarbeiter: "", qaa: "Dominik Emerich", stunden: null, wahrscheinlichkeit: 20, bemerkung: "" },
  { kunde: "Pfizer", projekt: "FZPG3", status: "läuft", geplanterStart: "", bestellung: 1, mentorSupport: "Reinhart Meckel", ktmLead: "Diego Castillo", mitarbeiter: "Sathish (IND)", qaa: "Dominik Emerich", stunden: null, wahrscheinlichkeit: 100, bemerkung: "Wechsel vollzogen" },
  { kunde: "ROCHE Penzberg", projekt: "BCM13", status: "läuft", geplanterStart: "", bestellung: 1, mentorSupport: "", ktmLead: "Verena Lindner", mitarbeiter: "Laura Brus, Jacob Holländer", qaa: "Dominik Emerich, Lukas Holländer", stunden: null, wahrscheinlichkeit: 100, bemerkung: "Ankit, Manoj (IND)" },
  { kunde: "ROCHE Penzberg", projekt: "DCPRP", status: "Angebot", geplanterStart: "", bestellung: 0, mentorSupport: "Laura Brus", ktmLead: "", mitarbeiter: "", qaa: "Dominik Emerich", stunden: null, wahrscheinlichkeit: 50, bemerkung: "" },
  { kunde: "SMS Canzler", projekt: "HYVRO", status: "Angebot", geplanterStart: "", bestellung: 0, mentorSupport: "Markus Garcia", ktmLead: "Dominik Emerich", mitarbeiter: "Felix Renner", qaa: "Lukas Holländer", stunden: null, wahrscheinlichkeit: 80, bemerkung: "" },
  { kunde: "SMS Canzler", projekt: "HYVA3", status: "Angebot", geplanterStart: "", bestellung: 0, mentorSupport: "Markus Garcia", ktmLead: "Dominik Emerich", mitarbeiter: "Felix Renner", qaa: "Lukas Holländer", stunden: null, wahrscheinlichkeit: 50, bemerkung: "" },
  { kunde: "STULLN Pharma", projekt: "STULN", status: "läuft", geplanterStart: "KW 10", bestellung: 1, mentorSupport: "", ktmLead: "Matej Deronja", mitarbeiter: "Reinhart Meckel", qaa: "Dominik Emerich", stunden: null, wahrscheinlichkeit: 100, bemerkung: "Reinhart umgeplant ab KW 10 - Reinhart KW 15 - Domi/Kathi KW 21- Kathi Ende KW 48" },
  { kunde: "TEVA", projekt: "XDTV3", status: "Angebot", geplanterStart: "", bestellung: 0, mentorSupport: "Verena Lindner", ktmLead: "Matthias Kilger", mitarbeiter: "", qaa: "Lukas Holländer", stunden: null, wahrscheinlichkeit: 70, bemerkung: "" },
  { kunde: "Octapharma", projekt: "OPXDE", status: "läuft", geplanterStart: "", bestellung: 1, mentorSupport: "", ktmLead: "Manuel Kämpf", mitarbeiter: "Christian Trippler", qaa: "", stunden: null, wahrscheinlichkeit: 100, bemerkung: "Indien + Alex Dentel" },
];

async function seed() {
  const db = drizzle(process.env.DATABASE_URL);
  
  // Check if projects already exist
  const existing = await db.execute(sql`SELECT COUNT(*) as cnt FROM projects`);
  const count = existing[0][0]?.cnt || 0;
  
  if (count > 0) {
    console.log(`Database already has ${count} projects. Skipping seed.`);
    process.exit(0);
  }

  for (const p of seedProjects) {
    await db.execute(sql`INSERT INTO projects (kunde, projekt, status, geplanterStart, bestellung, mentorSupport, ktmLead, mitarbeiter, qaa, stunden, wahrscheinlichkeit, bemerkung) VALUES (${p.kunde}, ${p.projekt}, ${p.status}, ${p.geplanterStart}, ${p.bestellung}, ${p.mentorSupport}, ${p.ktmLead}, ${p.mitarbeiter}, ${p.qaa}, ${p.stunden}, ${p.wahrscheinlichkeit}, ${p.bemerkung})`);
  }

  console.log(`Seeded ${seedProjects.length} projects successfully!`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
