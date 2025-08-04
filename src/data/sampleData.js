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
    },
    {
      id: 4,
      ticker: 'META',
      entry: '320.00',
      target: '340.00',
      stopLoss: '305.00',
      position: 'long',
      quantity: '30',
      notes: 'Social media rebound play',
      timestamp: '2025-07-23T11:30:00.000Z',
      status: 'planned'
    },
    {
      id: 5,
      ticker: 'GOOGL',
      entry: '135.00',
      target: '145.00',
      stopLoss: '128.00',
      position: 'long',
      quantity: '75',
      notes: 'Search dominance continues',
      timestamp: '2025-07-22T10:15:00.000Z',
      status: 'executed'
    }
  ],
  trades: [
    // July 26th - Multiple trades
    {
      id: 1,
      ticker: 'AAPL',
      entry: 175.50,
      exitPrice: 183.20,
      pnl: 770,
      outcome: 'win',
      timestamp: '2025-07-26T09:35:00.000Z',
      quantity: 100
    },
    {
      id: 2,
      ticker: 'MSFT',
      entry: 420.00,
      exitPrice: 415.50,
      pnl: -225,
      outcome: 'loss',
      timestamp: '2025-07-26T10:15:00.000Z',
      quantity: 50
    },
    {
      id: 3,
      ticker: 'NVDA',
      entry: 445.00,
      exitPrice: 460.00,
      pnl: 375,
      outcome: 'win',
      timestamp: '2025-07-26T11:20:00.000Z',
      quantity: 25
    },
    {
      id: 4,
      ticker: 'TSLA',
      entry: 248.00,
      exitPrice: 242.00,
      pnl: -300,
      outcome: 'loss',
      timestamp: '2025-07-26T14:30:00.000Z',
      quantity: 50
    },
    {
      id: 5,
      ticker: 'SPY',
      entry: 455.25,
      exitPrice: 458.75,
      pnl: 350,
      outcome: 'win',
      timestamp: '2025-07-26T15:45:00.000Z',
      quantity: 100
    },

    // July 25th - Heavy trading day
    {
      id: 6,
      ticker: 'AAPL',
      entry: 174.00,
      exitPrice: 177.50,
      pnl: 350,
      outcome: 'win',
      timestamp: '2025-07-25T09:31:00.000Z',
      quantity: 100
    },
    {
      id: 7,
      ticker: 'AAPL',
      entry: 177.80,
      exitPrice: 175.20,
      pnl: -260,
      outcome: 'loss',
      timestamp: '2025-07-25T10:45:00.000Z',
      quantity: 100
    },
    {
      id: 8,
      ticker: 'META',
      entry: 318.50,
      exitPrice: 325.00,
      pnl: 195,
      outcome: 'win',
      timestamp: '2025-07-25T11:15:00.000Z',
      quantity: 30
    },
    {
      id: 9,
      ticker: 'GOOGL',
      entry: 134.75,
      exitPrice: 138.25,
      pnl: 262.50,
      outcome: 'win',
      timestamp: '2025-07-25T13:20:00.000Z',
      quantity: 75
    },
    {
      id: 10,
      ticker: 'QQQ',
      entry: 375.00,
      exitPrice: 371.50,
      pnl: -525,
      outcome: 'loss',
      timestamp: '2025-07-25T14:10:00.000Z',
      quantity: 150
    },
    {
      id: 11,
      ticker: 'TSLA',
      entry: 252.00,
      exitPrice: 259.00,
      pnl: 350,
      outcome: 'win',
      timestamp: '2025-07-25T15:30:00.000Z',
      quantity: 50
    },

    // July 24th - Mixed day
    {
      id: 12,
      ticker: 'NVDA',
      entry: 448.00,
      exitPrice: 465.00,
      pnl: 425,
      outcome: 'win',
      timestamp: '2025-07-24T09:45:00.000Z',
      quantity: 25
    },
    {
      id: 13,
      ticker: 'AMD',
      entry: 145.50,
      exitPrice: 142.25,
      pnl: -162.50,
      outcome: 'loss',
      timestamp: '2025-07-24T10:30:00.000Z',
      quantity: 50
    },
    {
      id: 14,
      ticker: 'MSFT',
      entry: 418.00,
      exitPrice: 425.50,
      pnl: 375,
      outcome: 'win',
      timestamp: '2025-07-24T11:45:00.000Z',
      quantity: 50
    },
    {
      id: 15,
      ticker: 'SPY',
      entry: 453.00,
      exitPrice: 456.25,
      pnl: 325,
      outcome: 'win',
      timestamp: '2025-07-24T14:15:00.000Z',
      quantity: 100
    },

    // July 23rd - Rough day
    {
      id: 16,
      ticker: 'AAPL',
      entry: 172.50,
      exitPrice: 169.75,
      pnl: -275,
      outcome: 'loss',
      timestamp: '2025-07-23T09:30:00.000Z',
      quantity: 100
    },
    {
      id: 17,
      ticker: 'TSLA',
      entry: 255.00,
      exitPrice: 248.50,
      pnl: -325,
      outcome: 'loss',
      timestamp: '2025-07-23T10:45:00.000Z',
      quantity: 50
    },
    {
      id: 18,
      ticker: 'META',
      entry: 315.00,
      exitPrice: 310.25,
      pnl: -142.50,
      outcome: 'loss',
      timestamp: '2025-07-23T11:30:00.000Z',
      quantity: 30
    },
    {
      id: 19,
      ticker: 'NVDA',
      entry: 442.00,
      exitPrice: 455.00,
      pnl: 325,
      outcome: 'win',
      timestamp: '2025-07-23T13:15:00.000Z',
      quantity: 25
    },
    {
      id: 20,
      ticker: 'QQQ',
      entry: 372.00,
      exitPrice: 368.50,
      pnl: -525,
      outcome: 'loss',
      timestamp: '2025-07-23T15:00:00.000Z',
      quantity: 150
    },

    // July 22nd - Good momentum day
    {
      id: 21,
      ticker: 'AAPL',
      entry: 170.25,
      exitPrice: 175.50,
      pnl: 525,
      outcome: 'win',
      timestamp: '2025-07-22T09:35:00.000Z',
      quantity: 100
    },
    {
      id: 22,
      ticker: 'MSFT',
      entry: 415.00,
      exitPrice: 422.75,
      pnl: 387.50,
      outcome: 'win',
      timestamp: '2025-07-22T10:20:00.000Z',
      quantity: 50
    },
    {
      id: 23,
      ticker: 'GOOGL',
      entry: 132.50,
      exitPrice: 136.25,
      pnl: 281.25,
      outcome: 'win',
      timestamp: '2025-07-22T11:45:00.000Z',
      quantity: 75
    },
    {
      id: 24,
      ticker: 'TSLA',
      entry: 260.00,
      exitPrice: 267.50,
      pnl: 375,
      outcome: 'win',
      timestamp: '2025-07-22T13:30:00.000Z',
      quantity: 50
    },
    {
      id: 25,
      ticker: 'SPY',
      entry: 450.00,
      exitPrice: 453.75,
      pnl: 375,
      outcome: 'win',
      timestamp: '2025-07-22T14:45:00.000Z',
      quantity: 100
    },

    // July 21st - Weekend gap trades
    {
      id: 26,
      ticker: 'NVDA',
      entry: 440.00,
      exitPrice: 435.50,
      pnl: -112.50,
      outcome: 'loss',
      timestamp: '2025-07-21T09:30:00.000Z',
      quantity: 25
    },
    {
      id: 27,
      ticker: 'META',
      entry: 312.00,
      exitPrice: 318.75,
      pnl: 202.50,
      outcome: 'win',
      timestamp: '2025-07-21T10:15:00.000Z',
      quantity: 30
    },
    {
      id: 28,
      ticker: 'AMD',
      entry: 148.00,
      exitPrice: 151.25,
      pnl: 162.50,
      outcome: 'win',
      timestamp: '2025-07-21T11:30:00.000Z',
      quantity: 50
    },

    // July 20th - Smaller position day
    {
      id: 29,
      ticker: 'AAPL',
      entry: 168.50,
      exitPrice: 171.25,
      pnl: 137.50,
      outcome: 'win',
      timestamp: '2025-07-20T09:45:00.000Z',
      quantity: 50
    },
    {
      id: 30,
      ticker: 'TSLA',
      entry: 265.00,
      exitPrice: 261.75,
      pnl: -81.25,
      outcome: 'loss',
      timestamp: '2025-07-20T10:30:00.000Z',
      quantity: 25
    },
    {
      id: 31,
      ticker: 'SPY',
      entry: 448.00,
      exitPrice: 451.50,
      pnl: 175,
      outcome: 'win',
      timestamp: '2025-07-20T14:00:00.000Z',
      quantity: 50
    },

    // July 19th - Final batch
    {
      id: 32,
      ticker: 'GOOGL',
      entry: 130.00,
      exitPrice: 133.50,
      pnl: 175,
      outcome: 'win',
      timestamp: '2025-07-19T09:30:00.000Z',
      quantity: 50
    },
    {
      id: 33,
      ticker: 'MSFT',
      entry: 412.00,
      exitPrice: 408.25,
      pnl: -93.75,
      outcome: 'loss',
      timestamp: '2025-07-19T11:15:00.000Z',
      quantity: 25
    },
    {
      id: 34,
      ticker: 'QQQ',
      entry: 370.00,
      exitPrice: 373.25,
      pnl: 243.75,
      outcome: 'win',
      timestamp: '2025-07-19T13:45:00.000Z',
      quantity: 75
    }
  ],
  notes: {
    '2025-07-26': 'Strong opening with AAPL breakout. Made 5 trades total - mixed results but net positive. TSLA disappointed again, need to be more careful with momentum plays. SPY saved the day with late afternoon rally.',
    '2025-07-25': 'Heavy trading day - 6 trades! Started well with AAPL but got whipsawed on the second entry. META and GOOGL performed well. QQQ stop loss hit was painful but protected capital. Ended positive despite the loss.',
    '2025-07-24': 'More selective today with 4 trades. NVDA continues to be strong - this AI narrative is real. AMD disappointed, might avoid it for a while. MSFT and SPY were solid plays.',
    '2025-07-23': 'Rough day - market was choppy and I got caught in several fake moves. 5 trades, mostly losses. Only NVDA saved me from a complete disaster. Need to be more patient and wait for clearer setups.',
    '2025-07-22': 'Excellent day! 5 for 5 winners - everything worked perfectly. Market had strong momentum and I rode it well. This is what happens when you stick to the plan and let winners run.',
    '2025-07-21': 'Weekend gap trading - mixed results. 3 trades, 2 winners. NVDA gap down was a trap, but META and AMD recovered nicely. Smaller size was smart given the uncertainty.',
    '2025-07-20': 'Lighter trading day by choice. Only 3 positions, kept size smaller after yesterday. Market felt uncertain so I was more conservative. AAPL and SPY delivered as expected.',
    '2025-07-19': 'Final push for the week. 3 solid trades to close out. GOOGL morning breakout was textbook, MSFT disappointed slightly but QQQ afternoon rally was perfect timing. Good week overall.'
  },
  activities: [
    {
      id: 1,
      type: 'trade',
      message: 'Executed AAPL trade for +$770 profit',
      timestamp: '2025-07-26T09:35:00.000Z',
      targetModule: 'daily-view'
    },
    {
      id: 2,
      type: 'trade',
      message: 'TSLA stopped out for -$300 loss',
      timestamp: '2025-07-26T14:30:00.000Z',
      targetModule: 'daily-view'
    },
    {
      id: 3,
      type: 'plan',
      message: 'Created new trade plan for META',
      timestamp: '2025-07-23T11:30:00.000Z',
      targetModule: 'plan-trader'
    },
    {
      id: 4,
      type: 'note',
      message: 'Added daily trading notes for July 25th',
      timestamp: '2025-07-25T17:00:00.000Z',
      targetModule: 'notebook'
    },
    {
      id: 5,
      type: 'trade',
      message: 'Perfect 5/5 winning day on July 22nd',
      timestamp: '2025-07-22T16:00:00.000Z',
      targetModule: 'daily-view'
    },
    {
      id: 6,
      type: 'trade',
      message: 'QQQ rally saved the afternoon',
      timestamp: '2025-07-19T13:45:00.000Z',
      targetModule: 'daily-view'
    }
  ]
};
