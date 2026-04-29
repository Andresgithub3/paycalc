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

interface IncomeInputCardProps {
  /** Translation key for the income type label, e.g. "employmentIncome" */
  labelKey: string;
  /** Translation key for the note below the input */
  noteKey?: string;
  /** Current string value */
  value: string;
  /** Setter */
  onChange: (v: string) => void;
  /** Whether the card starts expanded */
  defaultOpen?: boolean;
  /** Extra content below the input (e.g. EI toggle) */
  children?: React.ReactNode;
}

export function IncomeInputCard({
  labelKey,
  noteKey,
  value,
  onChange,
  defaultOpen = false,
  children,
}: IncomeInputCardProps) {
  const t = useTranslations('income');
  const [open, setOpen] = useState(defaultOpen || (parseFloat(value) > 0));
  const hasValue = parseFloat(value) > 0;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border bg-card px-4 py-3 text-left hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{t(labelKey)}</span>
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
            <Label htmlFor={`income-${labelKey}`} className="sr-only">
              {t(labelKey)}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">
                $
              </span>
              <Input
                id={`income-${labelKey}`}
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
          {noteKey && (
            <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              {t(noteKey)}
            </p>
          )}
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
