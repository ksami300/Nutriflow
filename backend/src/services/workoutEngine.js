// 👑 NUTRIFLOW PREMIUM WORKOUT ENGINE - NFL & GLADIJATORSKI KUĆNI PROIZVOD
const generatePremiumWorkout = (daysCount) => {
  const parsedDays = Number(daysCount) || 2;

  // 🏋️‍♂️ ŠABLON ZA 2 DANA - FULL BODY TOTALNO UNIŠTENJE
  if (parsedDays === 2) {
    return {
      type: "Full Body Ofanziva",
      description: "Kratak, surov i jasan program za celo telo. Koristi sopstvenu težinu da aktivira maksimalan broj mišićnih vlakana, ubrza metabolizam i izgradi eksplozivnu snagu.",
      schedule: [
        {
          day: "Dan 1: Full Body Power",
          exercises: [
            { name: "NFL Skok-Čučnjevi", volume: "4 serije x 12 ponavljanja", form: "Spusti se u duboki čučanj, zadrži sekundu da ubiješ momentum, pa eksplodiraj ka plafonu najjače što možeš! Dočekuj se mekano." },
            { name: "Zverski Dijamant Sklekovi", volume: "4 serije x Maksimum", form: "Spoji palčeve i kažiprste na podu ispod grudi. Spuštaj se polako, laktovi uz telo, i eksplodiraj gore za brutalan triceps i unutrašnje grudi." },
            { name: "Pliometrijski Iskoraci u Skoku", volume: "4 serije x 12 ponavljanja (6 po nozi)", form: "Kreni iz iskoraka, skoči visoko i u vazduhu zameni noge. Drži trup pravo, ritam je leteći i nema stajanja!" }
          ]
        },
        {
          day: "Dan 2: Core & Conditioning Blast",
          exercises: [
            { name: "NFL Izometrijski Wall Sit", volume: "4 serije x 45 sekundi izdržašaja", form: "Sedni leđima uz zid pod uglom od 90 stepeni. Svesno stisni kvadricepse i guraj petama kroz pod dok mišići ne prokrvare!" },
            { name: "Eksplozivni Gladijatorski Marinci (Burpees)", volume: "4 serije x 10 ponavljanja", form: "Grudi na pod, skoči gore i opali dlanovima iznad glave. Svako ponavljanje radis maksimalnom brzinom." }
          ]
        }
      ]
    };
  }

  // 🏈 ŠABLON ZA 3 DANA - ELITNI GLADIJATORSKI SPLIT (SA TVOJIM NFL NOGAMA!)
  return {
    type: "Elitni Gladijatorski Split 3 Dana",
    description: "NFL šablon za snagu, eksplozivnost i volumen mišića bez kapi tegova. Strogo razdvajanje mišićnih grupa za maksimalnu hipertrofiju.",
    schedule: [
      {
        day: "Dan 1: Gornji Deo - Power Push & Core",
        exercises: [
          { name: "Eksplozivni Sklekovi sa Odvajanjem Šaka", volume: "4 serije x 10 ponavljanja", form: "Gurnite se sa poda toliko snažno da vam se šake odvoje od tla. Razvija surovu, eksplozivnu silu gornjeg dela tela." },
          { name: "Propadanja na Stolici (Chair Dips)", volume: "4 serije x 15 ponavljanja", form: "Postavi šake na ivicu stolice, noge ispred sebe. Spuštaj se dok laktovi ne pređu 90 stepeni i svesno stisni triceps na vrhu." },
          { name: "Plank Trkači (Mountain Climbers)", volume: "4 serije x 30 sekundi", form: "Iz pozicije skleka povlači kolena brzo ka grudima. Drži gluteus nisko, ritam mora da pršti!" }
        ]
      },
      {
        day: "Dan 2: NFL Kućni Pakao za Noge (Snaga & Volumen)",
        exercises: [
          { name: "NFL Skok-Čučnjevi iz Mrtve Tačke", volume: "5 serija x 10 ponavljanja", form: "Puni duboki čučanj, sekunda pauze na dnu, pa eksplozija u vazduh najjače što možeš! Razvija zverski start na terenu." },
          { name: "Izometrijski Zidni Čučanj (Wall Sit)", volume: "5 serija x 45 sekundi", form: "Leđa uz zid, ugao 90 stepeni. Drži napetost i guraj petama pod, svesno stiskaj gluteus i kvadriceps!" },
          { name: "Pistol Čučnjevi uz Podršku", volume: "5 serija x 6 ponavljanja po nozi", form: "Jedna noga ispred sebe, spuštaj se polako 4 sekunde na jednoj nozi dok gluteus ne dotakne stolicu, pa eksplodiraj nazad gore!" }
        ]
      },
      {
        day: "Dan 3: Kondicioni Finišer & Pliometrija",
        exercises: [
          { name: "Zverski Marinci sa Skokom u Dalj", volume: "4 serije x 8 ponavljanja", form: "Uradi sklek, a kada skočiš gore, baci telo u dalj što više možeš umesto klasičnog skoka uvis." },
          { name: "Ruski Tvist (Russian Twist)", volume: "4 serije x 20 ponavljanja", form: "Sedni na pod, blago podigni noge i rotiraj trup levo-desno dotičući pod šakama. Svaki okret stisni bočne trbušnjake." }
        ]
      }
    ]
  };
};

module.exports = { generatePremiumWorkout };
