export const calculateRiskReward = (entry, target, stopLoss, position) => {
  const e = parseFloat(entry) || 0;
  const t = parseFloat(target) || 0;
  const s = parseFloat(stopLoss) || 0;

  if (position === 'long') {
    const risk = e - s;
    const reward = t - e;
    return {
      risk: risk.toFixed(2),
      reward: reward.toFixed(2),
      ratio: risk > 0 ? (reward / risk).toFixed(1) : '0.0'
    };
  } else {
    const risk = s - e;
    const reward = e - t;
    return {
      risk: risk.toFixed(2),
      reward: reward.toFixed(2),
      ratio: risk > 0 ? (reward / risk).toFixed(1) : '0.0'
    };
  }
};

export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatPercentage = (value) => {
  return `${value}%`;
};