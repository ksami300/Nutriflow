const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendMotivationEmail = async (toEmail, firstName) => {
  const mailOptions = {
    from: `"NutriFlow AI Coach" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '🔥 Gladijatore, Tvoj AI Trener Te Čeka! Postani Svoja Najbolja Verzija!',
    text: `Zdravo ${firstName},\n\nVideo sam da skeniraš NutriFlow platformu. Dok drugi traže izgovore i odlažu uspeh za sutra, ti imaš priliku da preuzmeš kontrolu nad svojim telom i životom ODMAH!\n\nNaš AI Coach ti je generisao brutalan plan ishrane i fitnes režim prilagođen tvojoj kilaži i gladijatorskim ciljevima. Sve barijere su pale.\n\nKlikni na link, otključaj svoj Premium paket za samo 9.99€ i hajde da zgazimo ove ciljeve zajedno!\n\nLink do platforme: https://nutriflow-indol.vercel.app\n\nTvoj lični AI Coach & Nemanja Mihajlović`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 Motivacioni mejl uspešno poslat na: ' + toEmail);
  } catch (err) {
    console.error('❌ Mejl greška:', err.message);
  }
};
