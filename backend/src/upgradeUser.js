const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('?? Povezan na MongoDB...');
    const User = mongoose.model('User', new mongoose.Schema({ email: String, isPremium: Boolean }), 'users');
    const updated = await User.findOneAndUpdate({ email: 'nemanjazmaj.mihajlovic@gmail.com' }, { isPremium: true }, { new: true });
    if (updated) { console.log('?? USPEH: nemanjazmaj.mihajlovic@gmail.com JE POSTAO PREMIUM GLADIJATOR!'); }
    else { console.log('? Korisnik nije pronadjen.'); }
  } catch (err) { console.error(err.message); }
  finally { mongoose.disconnect(); }
};
connectDB();
