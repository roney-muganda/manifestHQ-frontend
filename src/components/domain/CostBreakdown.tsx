// src/components/domain/CostBreakdown.tsx
import { formatKES } from '@/lib/utils';
import type { CalculatorResult } from '@/types';

export function CostBreakdown({ result }: { result: CalculatorResult }) {
  const rows = [
    { label: 'CIF Value (KES)', value: result.cif_value_kes },
    { label: `Import Duty (${result.import_duty_rate_pct}%)`, value: result.import_duty_kes },
    { label: `Excise Duty (${result.excise_duty_rate_pct}%)`, value: result.excise_duty_kes },
    { label: 'IDF Levy (2.5%)', value: result.idf_levy_kes },
    { label: 'RDL Levy (2%)', value: result.rdl_levy_kes },
    { label: 'VAT (16%)', value: result.vat_kes },
    { label: 'KPA Handling (estimate)', value: result.kpa_handling_estimate_kes },
  ];

  return (
    <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between px-6 py-3 bg-card">
          <span className="text-sm text-slate font-body">{r.label}</span>
          <span className="text-sm font-data font-semibold text-body">
            {formatKES(r.value)}
          </span>
        </div>
      ))}
      <div className="flex items-center justify-between px-6 py-4 bg-teal-pale">
        <span className="text-sm font-semibold text-teal font-body">Total Landed Cost</span>
        <span className="text-base font-data font-bold text-teal">
          {formatKES(result.total_landed_cost_kes)}
        </span>
      </div>
    </div>
  );
}