import { db } from "./client";
import { partners, rosterPlayers, services } from "./schema";
import {
  partners as staticPartners,
  rosterPlayers as staticRoster,
  services as staticServices,
} from "../lib/data";

async function seed() {
  const existingRoster = await db.select().from(rosterPlayers);
  if (existingRoster.length === 0) {
    await db.insert(rosterPlayers).values(
      staticRoster.map((p, i) => ({
        slug: p.id,
        ghost: p.ghost,
        pos: p.pos,
        jersey: p.jersey ?? null,
        name: p.name,
        team: p.team,
        photoUrl: p.photo ?? null,
        statsJson: JSON.stringify(p.stats),
        sortOrder: i,
      }))
    );
    console.log(`Seeded ${staticRoster.length} roster players`);
  } else {
    console.log("roster_players already has data, skipping");
  }

  const existingPartners = await db.select().from(partners);
  if (existingPartners.length === 0) {
    await db.insert(partners).values(
      staticPartners.map((p, i) => ({ name: p.name, logoUrl: p.src, sortOrder: i }))
    );
    console.log(`Seeded ${staticPartners.length} partners`);
  } else {
    console.log("partners already has data, skipping");
  }

  const existingServices = await db.select().from(services);
  if (existingServices.length === 0) {
    await db.insert(services).values(
      staticServices.map((s, i) => ({
        idx: s.idx,
        title: s.title,
        description: s.desc,
        iconPath: s.path,
        sortOrder: i,
      }))
    );
    console.log(`Seeded ${staticServices.length} services`);
  } else {
    console.log("services already has data, skipping");
  }

  console.log("Done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
