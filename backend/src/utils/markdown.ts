import { Pokemon } from "../controllers/PokemonController";

export function pokemonToMarkdown(pokemon: Pokemon): string {
  const {
    name = "Unknown",
    pokedexId,
    slug,
    image,
    sprite,
    apiGeneration,
    stats = {},
    apiTypes = [],
    apiResistances = [],
    resistanceModifyingAbilitiesForApi,
    apiEvolutions = [],
    apiPreEvolution,
    apiResistancesWithAbilities = [],
  } = pokemon;

  const statsTable = Object.entries(stats)
    .map(([k, v]) => `| ${k.toUpperCase()} | ${v} |`)
    .join("\n");

  const typesMd = apiTypes
    .map((t: any) => `- ![](${t.image}) **${t.name}**`)
    .join("\n");

  const resistancesMd = apiResistances
    .map(
      (r: any) =>
        `| ${r.name} | ${r.damage_multiplier} | ${r.damage_relation} |`
    )
    .join("\n");

  const resistancesWithAbilitiesMd = apiResistancesWithAbilities
    .map(
      (r: any) =>
        `| ${r.name} | ${r.damage_multiplier} | ${r.damage_relation} |`
    )
    .join("\n");

  const evolutionsMd =
    apiEvolutions.length > 0
      ? apiEvolutions
          .map((e: any) => `- ${e.name} (#${e.pokedexId})`)
          .join("\n")
      : "Aucune";

  const preEvolutionMd =
    typeof apiPreEvolution === "string"
      ? apiPreEvolution
      : apiPreEvolution
      ? apiEvolutions
          .map((e: any) => `- ${e.name} (#${e.pokedexId})`)
          .join("\n")
      : "Aucune";

  const abilityMd =
    resistanceModifyingAbilitiesForApi &&
    Object.keys(resistanceModifyingAbilitiesForApi).length
      ? `**${(resistanceModifyingAbilitiesForApi as any).name}** (${
          (resistanceModifyingAbilitiesForApi as any).slug
        })`
      : "Aucune";

  return `# ${name} (#${pokedexId})

**Slug**: ${slug}  
**Génération API**: ${apiGeneration}
**Id**: ${pokedexId}

![Artwork](${image})  
![Sprite](${sprite})

## Types
${typesMd || "Aucun"}

## Stats
| Stat | Valeur |
|------|--------|
${statsTable}

## Résistances
| Type | Multiplicateur | Relation |
|------|----------------|----------|
${resistancesMd || "| - | - | - |"}

## Résistances avec capacité modifiante
| Type | Multiplicateur | Relation |
|------|----------------|----------|
${resistancesWithAbilitiesMd || "| - | - | - |"}

## Capacité modifiante
${abilityMd}

## Pré-évolution
${preEvolutionMd}

## Évolutions
${evolutionsMd}
`;
}
