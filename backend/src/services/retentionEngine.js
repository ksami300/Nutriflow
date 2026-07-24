const cron = require('node-cron');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 🛡️ RETENTION ENGINE 2.0 - OKIDA SE AUTOMATSKI SVAKE VEČERI U 20:00
const startRetentionEngine = () => {
  cron.schedule('0 20 * * *', async () => {
    console.log('🔄 Retention Engine 2.0: Pokrećem automatsko skeniranje korisnika...');
    
    try {
      const vremenskaGranica = new Date(Date.now() - 24 * 60 * 60 * 1000); // Korisnici stariji od 24h

      // Hirurški pronalazimo korisnike koji nisu kupili Premium, a registrovani su u zadnjih par dana
      const freeKorisnici = await User.find({
        isPremium: false,
        createdAt: { $lte: vremenskaGranica }
      });

      console.log(`📊 Pronađeno ${freeKorisnici.length} korisnika za re-engagement sekvencu.`);

      for (const korisnik of freeKorisnici) {
        const mailOptions = {
          from: `"NutriFlow AI Coach" <${process.env.EMAIL_USER}>`,
          to: korisnik.email,
          subject: '🎁 Specijalna Ponuda: Otključaj Svoj AI Plan Ishrane Sa 50% Popusta!',
          text: `Zdravo ${korisnik.name},\n\nOvde Nemanja Mihajlović iz NutriFlow tima.\n\nPrimetio sam da tvoj lični AI Coach još uvek čeka da bude aktiviran. Znam da povratak u formu i transformacija zahtevaju napor, i zato želim da ti olakšam prve korake!\n\nSamo večeras, dajem ti EKSKLUZIVAN popust od 50% na prvu pretplatu. Umesto 9.99€, otključaj neograničeni pristup svom džepnom nutricionisti i fitnes treneru za samo 4.99€!\n\nPonuda ističe uskoro. Iskoristi priliku i pokreni transformaciju odmah!\n\nLink do platforme: https://vercel.app\n\nVidimo se na Dashboard-u,\nTvoj NutriFlow AI Tim`
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Retention ponuda uspešno ispaljena na: ${korisnik.email}`);
      }
    } catch (err) {
      console.error('❌ Greška unutar Retention Engine-a:', err.message);
    }
  });
  
  console.log('🚀 Retention Engine 2.0 uspešno postavljen i osluškuje u pozadini (20:00h)!');
};

module.exports = { startRetentionEngine };
