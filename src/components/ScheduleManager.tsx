import React, { useState } from 'react';
import type { Match, Team } from '@/types/tournament';
import { CalendarPlus, Trash2, X, Save, Play, Plus } from 'lucide-react';

export interface ScheduleBucket {
  id: string;
  date: string;
  matchSelections: { matchId: string; time?: string; }[];
}

interface ScheduleManagerProps {
  matches: Match[];
  teams: Team[];
  onSave: (scheduledMatches: Match[]) => void;
  onBack?: () => void;
  isWizard?: boolean;
}

export const ScheduleManager = ({ matches, teams, onSave, onBack, isWizard }: ScheduleManagerProps) => {
  const [scheduleBuckets, setScheduleBuckets] = useState<ScheduleBucket[]>([]);
  const [activeBucketId, setActiveBucketId] = useState<string | null>(null);
  const [tempDateInput, setTempDateInput] = useState('');

  const handleSave = () => {
    const updatedMatches = matches.map(m => {
      const bucket = scheduleBuckets.find(b => b.matchSelections.some(s => s.matchId === m.id));
      if (bucket) {
        const selection = bucket.matchSelections.find(s => s.matchId === m.id)!;
        const dateTimeStr = `${bucket.date}T${selection.time || '12:00'}:00`;
        const ts = new Date(dateTimeStr).getTime();
        if (!isNaN(ts)) return { ...m, date: ts, status: 'scheduled' as const };
      }
      return m;
    });
    onSave(updatedMatches);
    if (!isWizard) {
      setScheduleBuckets([]); // Clear after save for manage view
    }
  };

  const schedulableMatches = isWizard ? matches : matches.filter(m => m.status !== 'completed' && m.date === null);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-2 text-sofa-text">
        <CalendarPlus className="w-5 h-5 text-sofa-blue" />
        <span className="text-xs font-black uppercase tracking-widest">{isWizard ? 'Schedule Setup' : 'Manage Schedule'}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-sofa-border space-y-3">
             <span className="text-[10px] font-black uppercase tracking-widest text-sofa-muted">Add Match Date</span>
             <input type="date" value={tempDateInput} onChange={e => setTempDateInput(e.target.value)} className="w-full bg-white border border-sofa-border rounded-lg px-3 py-2 text-xs font-bold text-sofa-text" />
             <button 
               onClick={() => {
                 if (!tempDateInput) return;
                 setScheduleBuckets([...scheduleBuckets, { id: `bucket-${Date.now()}`, date: tempDateInput, matchSelections: [] }]);
                 setTempDateInput('');
               }}
               className="w-full py-2 bg-sofa-blue text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all"
             >
               Create Date
             </button>
          </div>
        </div>
        
        <div className="md:col-span-3 space-y-4">
          {scheduleBuckets.length === 0 ? (
            <div className="bg-slate-50 border border-sofa-border border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center opacity-50">
              <CalendarPlus className="w-10 h-10 text-sofa-muted mb-3" />
              <span className="text-[10px] font-black uppercase tracking-widest text-sofa-muted">No Dates Created Yet</span>
              <span className="text-[8px] text-sofa-muted mt-1">Create a date on the left to start scheduling matches</span>
            </div>
          ) : (
            scheduleBuckets.map(bucket => (
              <div key={bucket.id} className="bg-white rounded-xl border border-sofa-border overflow-hidden">
                <div className="bg-slate-50 border-b border-sofa-border p-3 flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-sofa-text">{new Date(bucket.date).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setActiveBucketId(bucket.id)} className="text-[9px] font-black text-sofa-blue uppercase hover:underline">Add Matches</button>
                    <button onClick={() => setScheduleBuckets(scheduleBuckets.filter(b => b.id !== bucket.id))} className="text-sofa-border hover:text-sofa-live"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {bucket.matchSelections.length === 0 && <span className="text-[9px] text-sofa-muted italic col-span-full">No matches assigned.</span>}
                  {bucket.matchSelections.map(sel => {
                    const m = matches.find(fix => fix.id === sel.matchId);
                    if (!m) return null;
                    return (
                      <div key={sel.matchId} className="flex flex-col gap-2 p-2 border border-sofa-border rounded bg-slate-50">
                         <div className="flex justify-between items-center">
                           <span className="text-[9px] font-bold text-sofa-text truncate">{teams.find(t => t.id === m.homeTeamId)?.name} v {teams.find(t => t.id === m.awayTeamId)?.name}</span>
                           <button onClick={() => {
                             const newBuckets = [...scheduleBuckets];
                             const b = newBuckets.find(b => b.id === bucket.id)!;
                             b.matchSelections = b.matchSelections.filter(s => s.matchId !== sel.matchId);
                             setScheduleBuckets(newBuckets);
                           }} className="text-sofa-border hover:text-sofa-live"><X className="w-3 h-3" /></button>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="text-[8px] font-black uppercase text-sofa-muted">Time:</span>
                           <input type="time" value={sel.time || ''} onChange={(e) => {
                             const newBuckets = [...scheduleBuckets];
                             const b = newBuckets.find(b => b.id === bucket.id)!;
                             const s = b.matchSelections.find(s => s.matchId === sel.matchId)!;
                             s.time = e.target.value;
                             setScheduleBuckets(newBuckets);
                           }} className="bg-white border border-sofa-border rounded px-1.5 py-0.5 text-[10px] font-bold outline-none focus:border-sofa-blue flex-1" />
                         </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-6 border-t border-sofa-border mt-6">
        {onBack ? (
          <button onClick={onBack} className="px-6 py-3 text-sofa-muted hover:text-sofa-text font-black text-[10px] uppercase tracking-widest transition-colors">
            Back to Fixtures
          </button>
        ) : <div />}
        <button 
          onClick={handleSave} 
          disabled={scheduleBuckets.length === 0 || scheduleBuckets.every(b => b.matchSelections.length === 0)}
          className="px-12 py-3.5 bg-sofa-success text-white rounded-lg font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 shadow-lg disabled:opacity-30 transition-all"
        >
          {isWizard ? (
            <><Play className="w-4 h-4 fill-current" /> Launch Tournament</>
          ) : (
            <><Save className="w-4 h-4 fill-current" /> Save Schedule</>
          )}
        </button>
      </div>

      {/* Match Selector Modal */}
      {activeBucketId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-sofa-navy/60 backdrop-blur-sm" onClick={() => setActiveBucketId(null)} />
          <div className="bg-white rounded-xl max-w-2xl w-full relative z-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
            <div className="bg-sofa-blue p-4 flex justify-between items-center">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Select Matches for Date</h3>
              <X className="w-4 h-4 text-white cursor-pointer" onClick={() => setActiveBucketId(null)} />
            </div>
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 bg-slate-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {schedulableMatches
                  .filter(f => !scheduleBuckets.some(b => b.matchSelections.some(s => s.matchId === f.id)))
                  .map(f => (
                    <div key={f.id} className="flex items-center gap-3 bg-white p-3 border border-sofa-border rounded-lg hover:border-sofa-blue cursor-pointer transition-colors" onClick={() => {
                      const newBuckets = [...scheduleBuckets];
                      const b = newBuckets.find(b => b.id === activeBucketId)!;
                      b.matchSelections.push({ matchId: f.id });
                      setScheduleBuckets(newBuckets);
                    }}>
                      <div className="w-4 h-4 rounded border border-sofa-border flex items-center justify-center bg-slate-50"><Plus className="w-3 h-3 text-sofa-muted" /></div>
                      <span className="text-[10px] font-bold text-sofa-text flex-1 truncate">{teams.find(t => t.id === f.homeTeamId)?.name || 'TBD'} <span className="text-sofa-muted mx-1">v</span> {teams.find(t => t.id === f.awayTeamId)?.name || 'TBD'}</span>
                      {f.round && <span className="text-[8px] font-black uppercase text-sofa-muted">R{f.round}</span>}
                    </div>
                ))}
                {schedulableMatches.filter(f => !scheduleBuckets.some(b => b.matchSelections.some(s => s.matchId === f.id))).length === 0 && (
                  <div className="col-span-full py-10 text-center text-sofa-muted text-[10px] font-black uppercase">
                    All matches have been scheduled!
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 bg-white border-t border-sofa-border">
              <button onClick={() => setActiveBucketId(null)} className="w-full py-3 bg-sofa-success text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow hover:brightness-110">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
