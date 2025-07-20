const { initializeData } = require('../services/initData');

async function main() {
  try {
    await initializeData();
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

main(); 