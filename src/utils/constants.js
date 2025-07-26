import { Home, Target, BarChart3, Calendar, BookOpen, TrendingUp } from 'lucide-react';

export const modules = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'plan-trader', name: 'Plan Trader', icon: Target },
  { id: 'smart-journal', name: 'Smart Journal', icon: BarChart3 },
  { id: 'daily-view', name: 'Daily View', icon: Calendar },
  { id: 'notebook', name: 'Notebook', icon: BookOpen },
  { id: 'performance', name: 'Performance', icon: TrendingUp }
];

export const POSITION_TYPES = {
  LONG: 'long',
  SHORT: 'short'
};

export const TRADE_STATUS = {
  PLANNED: 'planned',
  EXECUTED: 'executed',
  CANCELLED: 'cancelled'
};

export const TRADE_OUTCOMES = {
  WIN: 'win',
  LOSS: 'loss',
  BREAKEVEN: 'breakeven'
};