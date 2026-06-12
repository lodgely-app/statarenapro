import { motion } from "framer-motion";
import { Trophy, ChevronDown, CalendarDays } from "lucide-react";

export function DashboardMockup() {
  return (
    <div
      className="relative w-full max-w-[900px] mx-auto select-none"
      style={{ perspective: "1500px" }}
    >
      <motion.div
        initial={{ rotateX: 10, rotateY: -15, opacity: 0, y: 40 }}
        animate={{ rotateX: 5, rotateY: -10, opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        style={{ transformStyle: "preserve-3d" }}
        className="rounded-xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.1)] bg-[#F4F7FB]"
      >
        {/* Fake Browser Top (Optional, but gives context) */}
        <div className="h-6 bg-[#E2E8F0] flex items-center px-3 gap-1.5 border-b border-[#CBD5E1]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F87171]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
        </div>

        {/* Header - App Color */}
        <div className="h-12 bg-[#2E5CFF] flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <Trophy className="w-4 h-4 text-[#2E5CFF]" />
            </div>
            <div className="flex items-center text-white font-black text-sm uppercase tracking-wider">
              STATARENA <span className="font-light opacity-80 ml-1">PRO</span>
              <span className="mx-3 opacity-30 text-lg font-light">|</span>
              <span className="text-[10px] tracking-widest font-bold">DEMO</span>
            </div>
          </div>
          <div className="flex gap-6 text-[10px] text-white font-bold uppercase tracking-widest">
            <span className="border-b-2 border-white pb-4 pt-4">SCORES</span>
            <span className="opacity-70 pt-4">ADMIN</span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 flex gap-6 h-[400px]">
          
          {/* Left Column (Standings) */}
          <div className="flex-1 flex flex-col gap-4">
            
            {/* Top controls */}
            <div className="flex items-center justify-between">
              <div className="bg-white border border-slate-200 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-sm">
                <Trophy className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-bold text-slate-700">KN</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="flex gap-2">
                <div className="bg-white border border-slate-200 rounded-full px-3 py-1 text-[9px] font-bold text-slate-600 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200 flex items-center justify-center">8</span> CLUBS
                </div>
                <div className="bg-white border border-slate-200 rounded-full px-3 py-1 text-[9px] font-black italic text-slate-600 shadow-sm">
                  GROUP+KNOCKOUT
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200 text-[10px] font-bold uppercase tracking-widest">
              <span className="text-[#2E5CFF] border-b-2 border-[#2E5CFF] pb-2">TABLES</span>
              <span className="text-slate-400 pb-2">BRACKET</span>
            </div>

            {/* Tables Area */}
            <div className="flex-1 overflow-hidden flex flex-col gap-4">
              {/* Group A */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-3">
                <div className="text-[9px] font-black text-slate-800 uppercase tracking-widest mb-2">GROUP A</div>
                <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 border-b border-slate-100 pb-1.5 flex">
                  <span className="w-6">#</span>
                  <span className="flex-1">TEAM</span>
                  <span className="w-6 text-center">P</span>
                  <span className="w-6 text-center">W</span>
                  <span className="w-6 text-center">D</span>
                  <span className="w-6 text-center">L</span>
                  <span className="w-8 text-center">G</span>
                  <span className="w-8 text-center">+/-</span>
                  <span className="w-8 text-center">PTS</span>
                </div>
                {[
                  { pos: 1, team: 'CRYSTAL PALACE', p: 5, w: 4, d: 0, l: 1, g: '12:5', gd: '+7', pts: 12 },
                  { pos: 2, team: 'ARSENAL', p: 4, w: 1, d: 1, l: 2, g: '4:10', gd: '-6', pts: 4 },
                  { pos: 3, team: 'BRENTFORD', p: 3, w: 1, d: 0, l: 2, g: '6:7', gd: '-1', pts: 3 },
                  { pos: 4, team: 'EVERTON', p: 3, w: 0, d: 1, l: 2, g: '4:6', gd: '-2', pts: 1 }
                ].map((row, i) => (
                  <div key={i} className="flex text-[9px] font-bold text-slate-700 py-1.5 border-b border-slate-50 last:border-0 items-center relative">
                    {i < 2 && <div className={`absolute -left-3 top-0 bottom-0 w-0.5 ${i===0 ? 'bg-[#2E5CFF]' : 'bg-[#2E5CFF]'}`} />}
                    {i >= 2 && <div className={`absolute -left-3 top-0 bottom-0 w-0.5 bg-green-500`} />}
                    
                    <span className="w-6">{row.pos}</span>
                    <span className="flex-1 text-slate-900">{row.team}</span>
                    <span className="w-6 text-center font-normal">{row.p}</span>
                    <span className="w-6 text-center font-normal">{row.w}</span>
                    <span className="w-6 text-center font-normal">{row.d}</span>
                    <span className="w-6 text-center font-normal">{row.l}</span>
                    <span className="w-8 text-center text-slate-400 font-normal">{row.g}</span>
                    <span className={`w-8 text-center ${row.gd.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{row.gd}</span>
                    <span className="w-8 text-center text-slate-900 font-black">{row.pts}</span>
                  </div>
                ))}
              </div>
              
              {/* Group B (Partial) */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-3">
                <div className="text-[9px] font-black text-slate-800 uppercase tracking-widest mb-2">GROUP B</div>
                <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 border-b border-slate-100 pb-1.5 flex">
                  <span className="w-6">#</span>
                  <span className="flex-1">TEAM</span>
                  <span className="w-6 text-center">P</span>
                  <span className="w-6 text-center">W</span>
                  <span className="w-6 text-center">D</span>
                  <span className="w-6 text-center">L</span>
                  <span className="w-8 text-center">G</span>
                  <span className="w-8 text-center">+/-</span>
                  <span className="w-8 text-center">PTS</span>
                </div>
                {[
                  { pos: 1, team: 'CHELSEA', p: 5, w: 4, d: 1, l: 0, g: '15:7', gd: '+8', pts: 13 },
                  { pos: 2, team: 'BRIGHTON & HOVE ALBION', p: 4, w: 2, d: 1, l: 1, g: '8:7', gd: '+1', pts: 7 }
                ].map((row, i) => (
                  <div key={i} className="flex text-[9px] font-bold text-slate-700 py-1.5 border-b border-slate-50 last:border-0 items-center relative">
                    {i < 2 && <div className={`absolute -left-3 top-0 bottom-0 w-0.5 bg-[#2E5CFF]`} />}
                    <span className="w-6">{row.pos}</span>
                    <span className="flex-1 text-slate-900">{row.team}</span>
                    <span className="w-6 text-center font-normal">{row.p}</span>
                    <span className="w-6 text-center font-normal">{row.w}</span>
                    <span className="w-6 text-center font-normal">{row.d}</span>
                    <span className="w-6 text-center font-normal">{row.l}</span>
                    <span className="w-8 text-center text-slate-400 font-normal">{row.g}</span>
                    <span className={`w-8 text-center ${row.gd.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{row.gd}</span>
                    <span className="w-8 text-center text-slate-900 font-black">{row.pts}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Fixtures) */}
          <div className="w-[300px] flex flex-col gap-4">
            
            <div className="flex items-center gap-1.5 text-slate-500">
              <CalendarDays className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black italic uppercase tracking-widest">FIXTURES</span>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-100 flex overflow-hidden">
              <div className="flex-1 py-2 text-center text-[8px] font-bold text-slate-400 uppercase tracking-widest">UPCOMING</div>
              <div className="flex-1 py-2 text-center text-[8px] font-bold text-[#2E5CFF] uppercase tracking-widest border-b-2 border-[#2E5CFF]">RESULTS</div>
              <div className="flex-1 py-2 text-center text-[8px] font-bold text-slate-400 uppercase tracking-widest">UNSCHEDULED</div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col gap-3">
              {/* Date Group 1 */}
              <div>
                <div className="text-[9px] font-bold text-slate-800 mb-1.5 px-1">Saturday 20 June</div>
                <div className="bg-white rounded-lg shadow-sm border border-slate-100 divide-y divide-slate-50">
                  <div className="p-2.5 flex items-center justify-between text-[10px]">
                    <span className="text-slate-600 font-medium flex-1 text-right">Brentford</span>
                    <div className="flex items-center gap-2 mx-3">
                      <div className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center font-black text-[#2E5CFF]">1</div>
                      <span className="text-[8px] text-slate-400 font-bold">FT</span>
                      <div className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center font-black text-[#2E5CFF]">2</div>
                    </div>
                    <span className="text-slate-600 font-medium flex-1">Arsenal</span>
                  </div>
                </div>
              </div>

              {/* Date Group 2 */}
              <div>
                <div className="text-[9px] font-bold text-slate-800 mb-1.5 px-1">Friday 26 June</div>
                <div className="bg-white rounded-lg shadow-sm border border-slate-100 divide-y divide-slate-50">
                  <div className="p-2.5 flex items-center justify-between text-[10px]">
                    <span className="text-slate-600 font-medium flex-1 text-right">Everton</span>
                    <div className="flex items-center gap-2 mx-3">
                      <div className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center font-black text-[#2E5CFF]">1</div>
                      <span className="text-[8px] text-slate-400 font-bold">FT</span>
                      <div className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center font-black text-[#2E5CFF]">2</div>
                    </div>
                    <span className="text-slate-600 font-medium flex-1">Crystal Palace</span>
                  </div>
                  <div className="p-2.5 flex items-center justify-between text-[10px]">
                    <span className="text-slate-600 font-medium flex-1 text-right">Brentford</span>
                    <div className="flex items-center gap-2 mx-3">
                      <div className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center font-black text-[#2E5CFF]">2</div>
                      <span className="text-[8px] text-slate-400 font-bold">FT</span>
                      <div className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center font-black text-[#2E5CFF]">3</div>
                    </div>
                    <span className="text-slate-600 font-medium flex-1">Crystal Palace</span>
                  </div>
                  <div className="p-2.5 flex items-center justify-between text-[10px]">
                    <span className="text-slate-600 font-medium flex-1 text-right">Arsenal</span>
                    <div className="flex items-center gap-2 mx-3">
                      <div className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center font-black text-[#2E5CFF]">1</div>
                      <span className="text-[8px] text-slate-400 font-bold">FT</span>
                      <div className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center font-black text-[#2E5CFF]">1</div>
                    </div>
                    <span className="text-slate-600 font-medium flex-1">Everton</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </motion.div>
    </div>
  );
}
