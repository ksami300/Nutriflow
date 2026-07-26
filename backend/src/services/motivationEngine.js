// 👑 NUTRIFLOW PREMIUM MOTIVATION ENGINE - SUROVI GLADIJATORSKI CITATI
const premiumQuotes = [
  "Treniraj danas. Odustani sutra. Ponovi ovo svaki dan.",
  "Dok ti spavaš ili tražiš izgovore, tvoj protivnik na terenu radi zgibove sa 135 kila ukupne mase. Ustaj i polomi šipku!",
  "Bol je privremen, ponos je večan. Ako odustaneš danas, plakaćeš sutra.",
  "Niko nije došao do dijamanata sedeći u fotelji i pijući hladnu kafu. Ustaj, Matrix te posmatra, pokaži im od čega si sazdan!",
  "U parku nema mesta za slabiće. Danas je težak dan, a teški dani stvaraju vrhunske preduzetnike i gladijatore.",
  "Tvoje telo može sve, samo tvoj mozak pokušava da te prevari jer traži luksuz i zonu komfora. Bonvivan uživa tek nakon prolivene krvi i znoja!"
];

const getRandomPremiumMotivation = () => {
  // Hirurški biramo nasumičnu zversku poruku iz arsenala za taj dan
  const randomIndex = Math.floor(Math.random() * premiumQuotes.length);
  return {
    title: "Današnji vojnički šamar motivacije:",
    quote: premiumQuotes[randomIndex]
  };
};

module.exports = { getRandomPremiumMotivation };
