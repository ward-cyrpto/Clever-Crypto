// User Model
class User {
  constructor(id, email, username, passwordHash, createdAt) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt || new Date();
    this.updatedAt = new Date();
  }

  // TODO: Add database methods
  // static async findById(id) {}
  // static async findByEmail(email) {}
  // async save() {}
  // async update() {}
  // async delete() {}
}

module.exports = User;