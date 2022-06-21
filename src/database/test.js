const { Pool, Client } = require('pg');
const { credentials } = require('./database');


// ========================== Testing Connection using both {Pool} and {client} ===========================
/**
 * Connect with a connection pool.
 * @returns
 */
async function poolDemo() {
  const pool = new Pool(credentials);
  const now = await pool.query('SELECT NOW()');
  await pool.end();

  return now;
}

/**
 * Connect with a client.
 * @returns
 */
async function clientDemo() {
  const client = new Client(credentials);
  await client.connect();
  const now = await client.query('SELECT NOW()');
  await client.end();

  return now;
}

/**
 * Connection Testing function
 * using both {Pool} and {client}
 */
const connectionTest = async () => {
  const poolResult = await poolDemo();
  console.log('Time with pool: ' + poolResult.rows[0]['now']);

  const clientResult = await clientDemo();
  console.log('Time with client: ' + clientResult.rows[0]['now']);
};

// ========================== Testing Full flow of a users table ==========================
const pool = new Pool(credentials);

/**
 * Register User test function
 * uses pg library
 * directly accessing DB without ORM
 * @param {*} user
 * @returns
 */
async function registerUser(user) {
  const text = `
      INSERT INTO users (name, gender, phone, age)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
  const values = [user.name, user.gender, user.phone, user.age];
  return pool.query(text, values);
}

/**
 * Get User test function
 * uses pg library
 * directly accessing DB without ORM
 * @param {*} userId
 * @returns
 */
async function getUser(userId) {
  const text = `SELECT * FROM users WHERE id = $1`;
  const values = [userId];
  return pool.query(text, values);
}

/**
 * Update User name test function
 * uses pg library
 * directly accessing DB without ORM
 * @param {*} userId
 * @param {*} name
 * @returns
 */
async function updateUserName(userId, name) {
  const text = `UPDATE users SET name = $2 WHERE id = $1`;
  const values = [userId, name];
  return pool.query(text, values);
}

/**
 * Remove User test function
 * uses pg library
 * directly accessing DB without ORM
 * @param {*} userId
 * @returns
 */
async function removeUser(userId) {
  const text = `DELETE FROM users WHERE id = $1`;
  const values = [userId];
  return pool.query(text, values);
}

/**
 * User table full flow Testing function
 */
const test = async () => {
  // Register a new user and get an id, which comes from the RETURNING clause.
  const registerResult = await registerUser({
    name: 'Jane Doe',
    gender: 'F',
    phone: '5555555555',
    age: 29,
  });

  const userId = registerResult.rows[0]['id'];
  console.log('Registered a user with id: ' + userId);

  // Obtain the full user object from the database.
  const getUserResult = await getUser(userId);
  console.log("Result of SELECT query for user '" + userId + "': " + JSON.stringify(getUserResult.rows[0], null, '  '));

  // Update the user's full name and query for them again to verify.
  await updateUserName(userId, 'Jane Johnson');
  const getChangedPersonResult = await getUser(userId);
  console.log(
    "Result of SELECT query for user after name change '" +
      userId +
      "': " +
      JSON.stringify(getChangedPersonResult.rows[0], null, '  ')
  );

  // Clean up the database by removing the user record.
  await removeUser(userId);

  await pool.end();
};

module.exports = { test, connectionTest };
