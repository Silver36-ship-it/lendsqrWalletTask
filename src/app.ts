import db from "./config/database";

async function testDB() {
  try {
    const result = await db.raw("SELECT 1+1 AS result");
    console.log("DB Connected:", result[0]);
  } catch (err) {
    console.error(err);
  }
}

testDB();
