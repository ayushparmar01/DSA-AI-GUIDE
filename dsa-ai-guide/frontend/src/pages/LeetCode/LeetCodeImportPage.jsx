import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { UploadCloud, CheckCircle2, FileText, Sparkles, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LeetCodeImportPage = () => {
  const [parsedRows, setParsedRows] = useState([]);
  const [importStatus, setImportStatus] = useState('');

  const sampleCSV = `Problem,Difficulty,Topic,Status,Attempts,Date
Two Sum,Easy,Hashing,Solved,1,2026-08-15
Binary Search,Easy,Binary Search,Solved,1,2026-08-18
3Sum,Medium,Two Pointers,Solved,3,2026-08-20
Longest Substring Without Repeating Characters,Medium,Sliding Window,Solved,2,2026-08-25
Course Schedule,Medium,Graphs,Attempted,4,2026-08-28`;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      parseCSVContent(text);
    };
    reader.readAsText(file);
  };

  const parseCSVContent = (text) => {
    const lines = text.trim().split('\n');
    if (lines.length <= 1) return;

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim());
      if (cols.length >= 4) {
        rows.push({
          title: cols[0],
          difficulty: cols[1],
          topic: cols[2],
          status: cols[3],
          attempts: cols[4] || 1,
          date: cols[5] || 'Recent'
        });
      }
    }
    setParsedRows(rows);
    setImportStatus(`Successfully parsed ${rows.length} LeetCode problem records.`);
    confetti({ particleCount: 60, spread: 60 });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Import LeetCode Progress</h1>
        <p className="text-xs text-gray-400">
          Sync your past solve history via CSV import to refine your AI Skill Profile and skip prerequisite basics.
        </p>
      </div>

      {/* Upload Zone */}
      <Card className="p-8 border-2 border-dashed border-gray-800 hover:border-brand-500/50 transition text-center space-y-4 bg-gray-950/60">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center mx-auto text-brand-400">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-gray-200">Upload LeetCode Submissions CSV</h3>
          <p className="text-xs text-gray-400">Drag and drop your exported progress CSV or browse files</p>
        </div>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="csv-upload"
        />
        <label htmlFor="csv-upload">
          <span className="inline-flex items-center justify-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-lg cursor-pointer border border-gray-700 transition">
            Browse CSV File
          </span>
        </label>

        <div className="pt-2">
          <button
            onClick={() => parseCSVContent(sampleCSV)}
            className="text-xs text-brand-400 hover:underline font-semibold"
          >
            Or load sample LeetCode CSV template
          </button>
        </div>
      </Card>

      {/* Parsed Telemetry Table */}
      {parsedRows.length > 0 && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {importStatus}
            </h3>
            <Badge variant="brand">{parsedRows.length} Solved Records</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-gray-400 uppercase font-mono border-b border-gray-800">
                <tr>
                  <th className="pb-3 font-semibold">Problem</th>
                  <th className="pb-3 font-semibold">Topic</th>
                  <th className="pb-3 font-semibold">Difficulty</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Attempts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-mono">
                {parsedRows.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-850/50">
                    <td className="py-2.5 font-bold text-gray-200 font-sans">{r.title}</td>
                    <td className="py-2.5 text-gray-400">{r.topic}</td>
                    <td className="py-2.5 text-brand-400">{r.difficulty}</td>
                    <td className="py-2.5 text-emerald-400">{r.status}</td>
                    <td className="py-2.5 text-gray-400">{r.attempts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-3">
            <Button variant="primary" onClick={() => alert('LeetCode data integrated! Topic masteries updated.')}>
              <Sparkles className="w-4 h-4 mr-1.5" /> Integrate into AI Knowledge Profile
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
