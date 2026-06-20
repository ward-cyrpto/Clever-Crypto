// Validation utility
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 8;
};

const validateTradeData = (data) => {
  const { symbol, type, quantity, price } = data;
  return symbol && type && quantity > 0 && price > 0;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateTradeData
};