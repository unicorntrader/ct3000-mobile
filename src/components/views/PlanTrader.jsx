import React from 'react';
import { Plus, Trash2, Play, Target } from 'lucide-react';
import { calculateRiskReward } from '../../utils/calculations';

export const PlanTrader = (props) => {
  const { 
    tradePlans, 
    newPlan, 
    setNewPlan, 
    addTradePlan, 
    deleteTradePlan, 
    executeTradePlan,
    isMobile 
  } = props;

  const [showForm, setShowForm] = React.useState(false);

  // Calculate risk/reward for current plan
  const riskReward = React.useMemo(() => {
    if (!newPlan.entry || !newPlan.target || !newPlan.stopLoss) {
      return { risk: '0.00', reward: '0.00', ratio: '0.0' };
    }
    return calculateRiskReward(newPlan.entry, newPlan.target, newPlan.stopLoss, newPlan.position);
  }, [newPlan.entry, newPlan.target, newPlan.stopLoss, newPlan.position]);

  // Form validation
  const isFormValid = () => {
    return newPlan.ticker && 
           newPlan.entry && 
           newPlan.target && 
           newPlan.stopLoss && 
           newPlan.quantity &&
           parseFloat(newPlan.entry) > 0 &&
           parseFloat(newPlan.target) > 0 &&
           parseFloat(newPlan.stopLoss) > 0 &&
           parseFloat(newPlan.quantity) > 0;
  };

  // Plan analysis
  const getPlanAnalysis = () => {
    const ratio = parseFloat(riskReward.ratio);
    
    if (ratio >= 3) {
      return { 
        status: 'excellent', 
        message: 'Excellent risk/reward ratio!', 
        color: 'green' 
      };
    } else if (ratio >= 2) {
      return { 
        status: 'good', 
        message: 'Good risk/reward ratio', 
        color: 'blue' 
      };
    } else if (ratio >= 1.5) {
      return { 
        status: 'acceptable', 
        message: 'Acceptable risk/reward', 
        color: 'yellow' 
      };
    } else {
      return { 
        status: 'poor', 
        message: 'Poor risk/reward ratio', 
        color: 'red' 
      };
    }
  };

  const analysis = getPlanAnalysis();

  if (isMobile) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Trade Plans</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white p-2 rounded-lg"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold mb-4">New Trade Plan</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Ticker (AAPL)"
                value={newPlan.ticker}
                onChange={(e) => setNewPlan({...newPlan, ticker: e.target.value.toUpperCase()})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newPlan.position}
                  onChange={(e) => setNewPlan({...newPlan, position: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="long">Long</option>
                  <option value="short">Short</option>
                </select>
                <input
                  type="number"
                  placeholder="Entry Price"
                  value={newPlan.entry}
                  onChange={(e) => setNewPlan({...newPlan, entry: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Target Price"
                  value={newPlan.target}
                  onChange={(e) => setNewPlan({...newPlan, target: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                />
                <input
                  type="number"
                  placeholder="Stop Loss"
                  value={newPlan.stopLoss}
                  onChange={(e) => setNewPlan({...newPlan, stopLoss: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                />
              </div>

              <input
                type="number"
                placeholder="Quantity"
                value={newPlan.quantity}
                onChange={(e) => setNewPlan({...newPlan, quantity: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                placeholder="Notes (optional)"
                value={newPlan.notes}
                onChange={(e) => setNewPlan({...newPlan, notes: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
              />

              {newPlan.entry && newPlan.target && newPlan.stopLoss && (
                <div className={`text-center p-3 rounded-lg ${
                  analysis.status === 'excellent' ? 'bg-green-50 text-green-800' :
                  analysis.status === 'good' ? 'bg-blue-50 text-blue-800' :
                  analysis.status === 'acceptable' ? 'bg-yellow-50 text-yellow-800' :
                  'bg-red-50 text-red-800'
                }`}>
                  <p className="font-semibold">Risk/Reward: 1:{riskReward.ratio}</p>
                  <p className="text-sm">{analysis.message}</p>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    addTradePlan();
                    setShowForm(false);
                  }}
                  disabled={!isFormValid()}
                  className="flex-1 bg-blue-600 text-white p-3 rounded-lg font-medium disabled:bg-gray-300"
                >
                  Add Plan
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-3 border border-gray-300 rounded-lg text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {tradePlans.map(plan => (
            <div key={plan.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">{plan.ticker}</span>
                    <span className={`px-2 py-1 text-xs rounded ${
                      plan.position === 'long' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {plan.position.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded ${
                      plan.status === 'executed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {plan.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{new Date(plan.timestamp).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  {plan.status === 'planned' && (
                    <button
                      onClick={() => executeTradePlan(plan.id)}
                      className="bg-green-600 text-white p-2 rounded-lg"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteTradePlan(plan.id)}
                    className="bg-red-600 text-white p-2 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Entry</span>
                  <p className="font-medium">${plan.entry}</p>
                </div>
                <div>
                  <span className="text-gray-500">Target</span>
                  <p className="font-medium">${plan.target}</p>
                </div>
                <div>
                  <span className="text-gray-500">Stop</span>
                  <p className="font-medium">${plan.stopLoss}</p>
                </div>
              </div>

              {plan.notes && (
                <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                  <p className="text-gray-700">{plan.notes}</p>
                </div>
              )}
            </div>
          ))}
          
          {tradePlans.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No trade plans yet</p>
              <p className="text-sm">Create your first plan above!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Create New Trade Plan</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ticker Symbol</label>
              <input
                type="text"
                value={newPlan.ticker}
                onChange={(e) => setNewPlan({...newPlan, ticker: e.target.value.toUpperCase()})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="AAPL"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position Type</label>
              <select
                value={newPlan.position}
                onChange={(e) => setNewPlan({...newPlan, position: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="long">Long</option>
                <option value="short">Short</option>
              </select>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entry Price</label>
                <input
                  type="number"
                  value={newPlan.entry}
                  onChange={(e) => setNewPlan({...newPlan, entry: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="150.00"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Price</label>
                <input
                  type="number"
                  value={newPlan.target}
                  onChange={(e) => setNewPlan({...newPlan, target: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="155.00"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stop Loss</label>
                <input
                  type="number"
                  value={newPlan.stopLoss}
                  onChange={(e) => setNewPlan({...newPlan, stopLoss: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="145.00"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={newPlan.quantity}
                onChange={(e) => setNewPlan({...newPlan, quantity: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">Risk/Reward Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Risk per share:</span>
                  <span className="font-medium">${riskReward.risk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reward per share:</span>
                  <span className="font-medium">${riskReward.reward}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm text-gray-600">Risk/Reward Ratio:</span>
                  <span className="font-bold text-blue-600">
                    1:{riskReward.ratio}
                  </span>
                </div>
                <div className="mt-2 p-2 rounded text-sm text-blue-800 bg-blue-50">
                  {analysis.message}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={newPlan.notes}
                onChange={(e) => setNewPlan({...newPlan, notes: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="Trade rationale, setup details, etc."
              />
            </div>
            
            <button
              onClick={addTradePlan}
              disabled={!isFormValid()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-gray-300"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Trade Plan
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Trade Plans</h3>
        <div className="space-y-3">
          {tradePlans.map(plan => (
            <div key={plan.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-lg">{plan.ticker}</span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    plan.position === 'long' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {plan.position.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    plan.status === 'executed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {plan.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Entry: ${plan.entry} | Target: ${plan.target} | Stop: ${plan.stopLoss}
                </div>
                {plan.notes && (
                  <div className="text-sm text-gray-500 mt-1 italic">{plan.notes}</div>
                )}
              </div>
              <div className="flex space-x-2">
                {plan.status === 'planned' && (
                  <button
                    onClick={() => executeTradePlan(plan.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Execute
                  </button>
                )}
                <button
                  onClick={() => deleteTradePlan(plan.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          {tradePlans.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No trade plans yet</p>
              <p className="text-sm">Create your first plan above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
