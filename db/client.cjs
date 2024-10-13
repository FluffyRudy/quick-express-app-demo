const { Pool } = require("pg");
require("dotenv").config();

const userTableCreateQuery = `
CREATE TABLE usernames (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    age INTEGER CHECK (age >= 0),
    bio TEXT
);
`;
const userCreateQuery = `
INSERT INTO usernames (username, email, age, bio)
VALUES ($1, $2, $3, $4);
`;
const userGetQuery = `
SELECT * FROM usernames WHERE id=$1;
`;
const userUpdateQuery = `
UPDATE usernames 
SET username=$1,
    email=$2,
    age=$3,
    bio=$4    
WHERE id=$5;
`;
const userDeleteQuery = `
DELETE FROM usernames WHERE id=$1;
`;
const userSearchQuery = `
SELECT * FROM usernames 
WHERE username LIKE $1
   OR email LIKE $1
   OR bio LIKE $1;
`;

const SUCCESS = 1;
const FAILED = 0;

class DBClient {
  constructor() {
    this.pool = this.initPool();
  }

  initPool() {
    return new Pool({
      connectionString: process.env.CONNECTION_STRING,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  async createTable() {
    const tableName = "usernames";
    const checkTableExistsQuery = `
      SELECT EXISTS (
        SELECT 1 
        FROM pg_catalog.pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = $1
      );
    `;

    try {
      const res = await this.pool.query(checkTableExistsQuery, [tableName]);
      const tableExists = res.rows[0].exists;

      if (!tableExists) {
        await this.pool.query(userTableCreateQuery);
        return { msg: "Table created successfully", status: SUCCESS };
      } else {
        return { msg: "Table already exists", status: SUCCESS };
      }
    } catch (error) {
      console.error(error.message);
      return { msg: "Failed to check or create table", status: FAILED };
    }
  }

  async createUser(data) {
    try {
      await this.pool.query(userCreateQuery, data);
      return { status: SUCCESS, message: "User added successfully" };
    } catch (error) {
      return { status: FAILED, message: error.message };
    }
  }

  async getUser(id) {
    const data = await this.pool.query(userGetQuery, [id]);
    return data;
  }

  async getUsers() {
    const users = await this.pool.query("SELECT * FROM usernames");
    return users.rows;
  }

  async updateUser(id, data) {
    await this.pool.query(userUpdateQuery, [...data, id]);
  }

  async deleteUser(id) {
    await this.pool.query(userDeleteQuery, [id]);
  }

  async searchUsers(text) {
    try {
      const data = await this.pool.query(userSearchQuery, [`%${text}%`]);
      return data.rows;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }

  async close() {
    this.pool.end();
  }
}

module.exports = {
  dbClient: new DBClient(),
  success: SUCCESS,
  failed: FAILED,
};
