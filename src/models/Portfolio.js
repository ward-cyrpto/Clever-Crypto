// Portfolio Model
class Portfolio {
  constructor(userId, totalValue, assets = []) {
    this.userId = userId;
    this.totalValue = totalValue;
    this.assets = assets; // Array of {symbol, quantity, avgPrice}
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  getTotalValue() {
    return this.totalValue;
  }

  getAssetQuantity(symbol) {
    const asset = this.assets.find(a => a.symbol === symbol);
    return asset ? asset.quantity : 0;
  }

  // TODO: Add database methods
}

module.exports = Portfolio;