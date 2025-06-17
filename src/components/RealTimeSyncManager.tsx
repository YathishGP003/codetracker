
import React, { useState } from 'react';
import { Play, Pause, RefreshCw, Clock, Activity, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useRealTimeSync } from '@/hooks/useRealTimeSync';
import { useDarkMode } from '@/contexts/DarkModeContext';

const RealTimeSyncManager = () => {
  const { isDarkMode } = useDarkMode();
  const { syncStatus, isLoading, startRealTimeSync, stopRealTimeSync, performSync } = useRealTimeSync();
  const [selectedInterval, setSelectedInterval] = useState('30');

  const handleStart = () => {
    startRealTimeSync(parseInt(selectedInterval));
  };

  const getNextSyncCountdown = () => {
    if (!syncStatus.nextSync) return null;
    
    const now = Date.now();
    const nextSyncTime = new Date(syncStatus.nextSync).getTime();
    const diff = nextSyncTime - now;
    
    if (diff <= 0) return 'Due now';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Card className={`relative overflow-hidden ${
      isDarkMode 
        ? 'bg-slate-900/70 border-slate-800/50 shadow-2xl' 
        : 'bg-white/90 border-gray-200/50 shadow-xl'
    } backdrop-blur-xl transition-all duration-300 hover:shadow-2xl`}>
      {/* Gradient background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5"></div>
      
      <CardHeader className="relative z-10 pb-4">
        <CardTitle className={`flex items-center justify-between ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <Activity size={20} className="text-white" />
            </div>
            <div>
              <span className="text-lg font-semibold">Real-Time Sync Manager</span>
              <div className={`flex items-center space-x-2 mt-1 ${
                syncStatus.isActive ? 'text-emerald-500' : 'text-gray-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  syncStatus.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <span className="text-xs font-medium">
                  {syncStatus.isActive ? 'Running' : 'Stopped'}
                </span>
              </div>
            </div>
          </div>
          <Badge 
            variant={syncStatus.isActive ? 'default' : 'secondary'}
            className={`${
              syncStatus.isActive 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                : 'bg-gray-500 text-white'
            }`}
          >
            {syncStatus.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </CardTitle>
        <CardDescription className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm`}>
          Automatically sync Codeforces data at regular intervals
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-6">
        {/* Control Section */}
        <div className={`p-4 rounded-xl ${
          isDarkMode 
            ? 'bg-slate-800/40 border border-slate-700/30' 
            : 'bg-gray-50/80 border border-gray-200/50'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            <div className="flex-1">
              <label className={`text-sm font-semibold block mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Sync Interval
              </label>
              <Select
                value={selectedInterval}
                onValueChange={setSelectedInterval}
                disabled={syncStatus.isActive || isLoading}
              >
                <SelectTrigger className={`${
                  isDarkMode 
                    ? 'bg-slate-800/60 border-slate-700/50 text-white hover:bg-slate-800' 
                    : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                } transition-colors`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Every 5 minutes</SelectItem>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                  <SelectItem value="60">Every hour</SelectItem>
                  <SelectItem value="180">Every 3 hours</SelectItem>
                  <SelectItem value="360">Every 6 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-3">
              {syncStatus.isActive ? (
                <Button
                  onClick={stopRealTimeSync}
                  disabled={isLoading}
                  variant="destructive"
                  size="sm"
                  className="shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              ) : (
                <Button
                  onClick={handleStart}
                  disabled={isLoading}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              )}
              
              <Button
                onClick={performSync}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className={`shadow-lg hover:shadow-xl transition-all duration-200 ${
                  isDarkMode 
                    ? 'border-slate-600 hover:bg-slate-800 text-slate-300' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Sync Now
              </Button>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className={`p-5 rounded-xl ${
          isDarkMode 
            ? 'bg-slate-800/30 border border-slate-700/30' 
            : 'bg-gray-100/60 border border-gray-200/40'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-3 rounded-lg ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/70'
            }`}>
              <div className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Status
              </div>
              <div className="flex items-center space-x-2">
                {syncStatus.isActive ? (
                  <>
                    <Zap className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-500">Running</span>
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                    <span className="text-sm font-medium text-gray-500">Stopped</span>
                  </>
                )}
              </div>
            </div>

            <div className={`p-3 rounded-lg ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/70'
            }`}>
              <div className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Last Sync
              </div>
              <div className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                {syncStatus.lastSync 
                  ? new Date(syncStatus.lastSync).toLocaleString()
                  : 'Never'
                }
              </div>
            </div>

            <div className={`p-3 rounded-lg ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/70'
            }`}>
              <div className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Next Sync
              </div>
              <div className={`text-sm font-medium flex items-center space-x-1 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                <Clock size={12} />
                <span>{getNextSyncCountdown() || 'Not scheduled'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Info */}
        {syncStatus.isActive && (
          <div className={`text-xs space-y-1 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-500'
          }`}>
            <p className="flex items-center space-x-2">
              <span className="w-1 h-1 bg-current rounded-full"></span>
              <span>Sync runs every {syncStatus.interval} minutes</span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="w-1 h-1 bg-current rounded-full"></span>
              <span>All active students will be synchronized automatically</span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="w-1 h-1 bg-current rounded-full"></span>
              <span>Rate limiting is applied to respect Codeforces API limits</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeSyncManager;
