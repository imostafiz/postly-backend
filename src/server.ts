import app from './app';
import prisma from './app/prisma';
import config from './app/config';

async function main() {
  try {
    await prisma.$connect();
    app.listen(config.port, () => {
      console.log(` app running on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
