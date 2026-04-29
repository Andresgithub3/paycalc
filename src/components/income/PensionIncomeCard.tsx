'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, Info } from 'lucide-react';

interface PensionIncomeCardProps {
  value: string;
  onChange: (v: string) => void;
}

export function PensionIncomeCard({ value, onChange }: PensionIncomeCardProps) {
  const t = useTranslations('pension');
  const hasValue = parseFloat(value) > 0;
  const [open, setOpen] = useState(hasValue);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border bg-card px-4 py-3 text-left hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{t('pensionIncome')}</span>
          {hasValue && !open && (
            <span className="text-xs font-mono text-muted-foreground">
              ${parseFloat(value).toLocaleString('en-CA')}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 pt-3 border border-t-0 rounded-b-lg bg-card">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="income-pension" className="sr-only">
              {t('pensionIncome')}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">
                $
              </span>
              <Input
                id="income-pension"
                type="number"
                min="0"
                step="100"
                placeholder="0"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-7 h-11 font-mono"
              />
            </div>
          </div>
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            {t('pensionIncomeNote')}
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
