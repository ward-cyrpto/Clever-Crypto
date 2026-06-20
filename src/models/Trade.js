// Trade Model
class Trade {
  constructor(id, userId, symbol, type, quantity, price, timestamp) {
    this.id = id;
    this.userId = userId;
    this.symbol = symbol;
    this.type = type; // 'BUY' or 'SELL'
    this.quantity = quantity;
    this.price = price;
    this.timestamp = timestamp || new Date();
    this.status = 'pending';
  }

  // TODO: Add database methods
  // static async findByUserId(userId) {}
  // async save() {}
  // async update() {}
  // static async findById(id) {}
}

module.exports = Trade;