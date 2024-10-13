const { dbClient } = require("../db/client.cjs");

class UserStorage {
  constructor() {
    this.dbClient = dbClient;
    this.dbClient.createTable();
    this.id = 0;
  }

  async addUser({ username, email, age, bio }) {
    const values = [username, email, Number(age) || null, bio || null];
    const status = await this.dbClient.createUser(values);
    console.log("added");
    console.log(status, values);
  }

  async updateUser(id, { username, email, age, bio }) {
    const values = [username, email, Number(age) || null, bio || null];
    const data = await this.dbClient.updateUser(id, values);
  }

  async deleteUser(id) {
    await this.dbClient.deleteUser(id);
  }

  async getUser(id) {
    const data = await this.dbClient.getUser(id);
    return data.rows[0];
  }

  async getUsers() {
    return await this.dbClient.getUsers();
  }

  async searchUser(text) {
    if (!text) return [];
    const data = await this.dbClient.searchUsers(text);
    return data || [];
  }
}

module.exports = new UserStorage();
