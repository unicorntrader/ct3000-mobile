export const sampleData = {
  tradePlans: [
    {
      id: 1,
      ticker: 'AAPL',
      entry: '175.00',
      target: '185.00',
      stopLoss: '170.00',
      position: 'long',
      quantity: '100',
      notes: 'Breakout play above resistance',
      timestamp: '2025-07-26T09:30:00.000Z',
      status: 'planned'
    },
    {
      id: 2,
      ticker: 'TSLA',
      entry: '250.00',
      target: '270.00',
      stopLoss: '240.00',
      position: 'long',
      quantity: '50',
      notes: 'Momentum trade on earnings',
      timestamp: '2025-07-25T14:15:00.000Z',
      status: 'executed'
    },
    {
      id: 3,
      ticker: 'NVDA',
      entry: '450.00',
      target: '480.00',
      stopLoss: '430.00',
      position: 'long',
      quantity: '25',
      notes: 'AI momentum play',
      timestamp: '2025-07-24T10:00:00.000Z',
      status: 'planned'
    }
  ],
  trades: [
    {
      id: 1,
      ticker: 'AAPL',
      entry: 175.00,
      exitPrice: 183.00,
      pnl: 800,
      outcome: 'win',
      timestamp: '2025-07-25T10:30:00.000Z',
      quantity: 100
    },
    {
      id: 2,
      ticker: 'TSLA',
      entry: 250.00,
      exitPrice: 245.00,
      pnl: -250,
      outcome: 'loss',
      timestamp: '2025-07-24T14:15:00.000Z',
      quantity: 50
    },
    {
      id: 3,
      ticker: 'SPY',
      entry: 450.00,
      exitPrice: 455.00,
      pnl: 500,
      outcome: 'win',
      timestamp: '2025-07-23T11:00:00.000Z',
      quantity: 100
    }
  ],
  notes: {
    '2025-07-26': 'Strong market momentum today. Looking for breakout plays on high volume.',
    '2025-07-25': 'AAPL trade worked perfectly. Followed the plan exactly and took profits at target.',
    '2025-07-24': 'TSLA trade stopped out. Market turned bearish on tech earnings. Need to be more careful with earnings plays.'
  },
  activities: [
    {
      id: 1,
      type: 'trade',
      message: 'Executed AAPL trade for +$800 profit',
      timestamp: '2025-07-25T10:30:00.000Z',
      targetModule: 'daily-view'
    },
    {
      id: 2,
      type: 'plan',
      message: 'Created new trade plan for TSLA',
      timestamp: '2025-07-24T09:15:00.000Z',
      targetModule: 'plan-trader'
    },
    {
      id: 3,
      type: 'note',
      message: 'Added daily trading notes',
      timestamp: '2025-07-24T16:00:00.000Z',
      targetModule: 'notebook'
    },
    {
      id: 4,
      type: 'trade',
      message: 'SPY trade closed for +$500 profit',
      timestamp: '2025-07-23T11:00:00.000Z',
      targetModule: 'daily-view'
    }
  ]
};