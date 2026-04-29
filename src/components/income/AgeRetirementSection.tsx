'use client';

import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, Info } from 'lucide-react';
import type { Province } from '@/lib/tax';

const PROVINCES: Province[] = [
  'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT',
];

interface AgeRetirementSectionProps {
  isAge65Plus: boolean;
  onAge65Change: (v: boolean) => void;

  // Pension splitting controls (only visible when age 65+ and pension > 0)
  hasPension: boolean;
  splitEnabled: boolean;
  onSplitEnabledChange: (v: boolean) => void;
  splitPercentage: string;
  onSplitPercentageChange: (v: string) => void;
  spouseIncome: string;
  onSpouseIncomeChange: (v: string) => void;
  spouseProvince: Province;
  onSpouseProvinceChange: (v: Province) => void;
  spouseAge65: boolean;
  onSpouseAge65Change: (v: boolean) => void;
}

export function AgeRetirementSection({
  isAge65Plus,
  onAge65Change,
  hasPension,
  splitEnabled,
  onSplitEnabledChange,
  splitPercentage,
  onSplitPercentageChange,
  spouseIncome,
  onSpouseIncomeChange,
  spouseProvince,
  onSpouseProvinceChange,
  spouseAge65,
  onSpouseAge65Change,
}: AgeRetirementSectionProps) {
  const t = useTranslations('pension');
  const tIncome = useTranslations('income');
  const tProv = useTranslations('provinces');
  const yes = tIncome('yes');
  const no = tIncome('no');

  const showSplitting = isAge65Plus && hasPension;

  return (
    <Collapsible defaultOpen={isAge65Plus}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border bg-card px-4 py-3 text-left hover:bg-muted/50 transition-colors">
        <span className="text-sm font-medium">{t('ageRetirement')}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform ui-open:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 pt-3 border border-t-0 rounded-b-lg bg-card space-y-4">
        {/* Age 65+ toggle */}
        <div className="flex items-center justify-between gap-3">
          <Label className="text-sm">{t('age65Toggle')}</Label>
          <div className="flex gap-1">
            <ToggleButton
              active={!isAge65Plus}
              onClick={() => onAge65Change(false)}
              label={no}
            />
            <ToggleButton
              active={isAge65Plus}
              onClick={() => onAge65Change(true)}
              label={yes}
            />
          </div>
        </div>

        {/* Pension splitting controls */}
        {showSplitting && (
          <div className="space-y-3 pt-2 border-t">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t('pensionSplitting')}
            </p>

            {/* Split toggle */}
            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm">{t('splitToggle')}</Label>
              <div className="flex gap-1">
                <ToggleButton
                  active={!splitEnabled}
                  onClick={() => onSplitEnabledChange(false)}
                  label={no}
                />
                <ToggleButton
                  active={splitEnabled}
                  onClick={() => onSplitEnabledChange(true)}
                  label={yes}
                />
              </div>
            </div>

            {splitEnabled && (
              <div className="space-y-3">
                {/* Split percentage */}
                <div className="space-y-1.5">
                  <Label htmlFor="split-pct" className="text-sm">
                    {t('splitPercentage')}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="split-pct"
                      type="number"
                      min="0"
                      max="50"
                      step="5"
                      value={splitPercentage}
                      onChange={(e) => onSplitPercentageChange(e.target.value)}
                      className="w-20 h-9 font-mono text-center"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="5"
                      value={splitPercentage || '50'}
                      onChange={(e) => onSplitPercentageChange(e.target.value)}
                      className="flex-1 h-2 accent-primary"
                    />
                  </div>
                </div>

                {/* Spouse income */}
                <div className="space-y-1.5">
                  <Label htmlFor="spouse-income" className="text-sm">
                    {t('spouseIncome')}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">
                      $
                    </span>
                    <Input
                      id="spouse-income"
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="0"
                      value={spouseIncome}
                      onChange={(e) => onSpouseIncomeChange(e.target.value)}
                      className="pl-7 h-9 font-mono"
                    />
                  </div>
                  <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    {t('spouseIncomeNote')}
                  </p>
                </div>

                {/* Spouse province */}
                <div className="space-y-1.5">
                  <Label className="text-sm">{t('spouseProvince')}</Label>
                  <Select value={spouseProvince} onValueChange={(v) => onSpouseProvinceChange(v as Province)}>
                    <SelectTrigger className="w-full h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((p) => (
                        <SelectItem key={p} value={p}>{tProv(p)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Spouse age 65+ */}
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-sm">{t('spouseAge65')}</Label>
                  <div className="flex gap-1">
                    <ToggleButton
                      active={!spouseAge65}
                      onClick={() => onSpouseAge65Change(false)}
                      label={no}
                    />
                    <ToggleButton
                      active={spouseAge65}
                      onClick={() => onSpouseAge65Change(true)}
                      label={yes}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Retirement disclaimer */}
        {isAge65Plus && (
          <p className="text-xs text-muted-foreground pt-1">
            {t('retirementDisclaimer')}
          </p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

function ToggleButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
        active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      }`}
    >
      {label}
    </button>
  );
}
