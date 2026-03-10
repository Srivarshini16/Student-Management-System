const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const collection = mongoose.connection.collection('users');

    // Remove existing admin@gmail.com if any (so we can re-seed cleanly)
    await collection.deleteOne({ email: 'admin@gmail.com' });

    const hashed = await bcrypt.hash('admin123', 12);
    await collection.insertOne({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: hashed,
        role: 'admin',
        picture: '',
        createdAt: new Date(),
        updatedAt: new Date()
    });

    console.log('✅ Admin account created: admin@gmail.com / admin123');
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
});
