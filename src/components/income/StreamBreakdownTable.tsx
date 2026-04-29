'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/format';
import type { MultiStreamResult } from '@/lib/tax/income-types';
import type { Province } from '@/lib/tax';

interface StreamBreakdownTableProps {
  result: MultiStreamResult;
  province: Province;
}

export function StreamBreakdownTable({ result, province }: StreamBreakdownTableProps) {
  const t = useTranslations();
  const isQuebec = province === 'QC';
  const isOntario = province === 'ON';

  const lines: { label: string; value: number; isCredit?: boolean; show?: boolean }[] = [
    { label: t('deductions.federalTax'), value: result.federalTax },
    { label: t('deductions.provincialTax'), value: result.provincialTax },
    {
      label: `${t('income.federalDTC')} (${t('income.eligible')})`,
      value: result.federalEligibleDTC,
      isCredit: true,
      show: result.federalEligibleDTC > 0,
    },
    {
      label: `${t('income.federalDTC')} (${t('income.ineligible')})`,
      value: result.federalIneligibleDTC,
      isCredit: true,
      show: result.federalIneligibleDTC > 0,
    },
    {
      label: `${t('income.provincialDTC')} (${t('income.eligible')})`,
      value: result.provincialEligibleDTC,
      isCredit: true,
      show: result.provincialEligibleDTC > 0,
    },
    {
      label: `${t('income.provincialDTC')} (${t('income.ineligible')})`,
      value: result.provincialIneligibleDTC,
      isCredit: true,
      show: result.provincialIneligibleDTC > 0,
    },
    {
      label: t('pension.pensionIncomeCreditFederal'),
      value: result.pensionCreditFederal,
      isCredit: true,
      show: result.pensionCreditFederal > 0,
    },
    {
      label: t('pension.pensionIncomeCreditProvincial'),
      value: result.pensionCreditProvincial,
      isCredit: true,
      show: result.pensionCreditProvincial > 0,
    },
    {
      label: result.ageAmountClawback > 0
        ? `${t('pension.ageAmountCreditFederal')} — ${t('pension.ageAmountClawback')}`
        : t('pension.ageAmountCreditFederal'),
      value: result.ageAmountCreditFederal,
      isCredit: true,
      show: result.ageAmountCreditFederal > 0,
    },
    {
      label: t('pension.ageAmountCreditProvincial'),
      value: result.ageAmountCreditProvincial,
      isCredit: true,
      show: result.ageAmountCreditProvincial > 0,
    },
    {
      label: isQuebec ? t('deductions.qpp') : t('deductions.cpp'),
      value: result.cppEmployee,
      show: result.cppEmployee > 0,
    },
    {
      label: t('income.selfEmployedCPP'),
      value: result.cppSelfEmployed,
      show: result.cppSelfEmployed > 0,
    },
    {
      label: t('deductions.cpp2'),
      value: result.cpp2Total,
      show: result.cpp2Total > 0,
    },
    {
      label: t('deductions.ei'),
      value: result.eiPremium,
      show: result.eiPremium > 0,
    },
    {
      label: t('deductions.qpip'),
      value: result.qpipPremium,
      show: isQuebec && result.qpipPremium > 0,
    },
    {
      label: t('deductions.ontarioHealth'),
      value: result.ontarioHealthPremium,
      show: isOntario && result.ontarioHealthPremium > 0,
    },
  ];

  const visibleLines = lines.filter((l) => l.show !== false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('income.detailedBreakdown')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {visibleLines.map((line) => (
          <div key={line.label} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{line.label}</span>
            <span
              className={`font-mono text-sm font-medium ${
                line.isCredit ? 'text-success' : 'text-destructive'
              }`}
            >
              {line.isCredit ? '-' : ''}{formatCurrency(line.value)}
            </span>
          </div>
        ))}

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{t('deductions.totalDeductions')}</span>
          <span className="font-mono font-semibold text-sm text-destructive">
            {formatCurrency(result.totalDeductions)}
          </span>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{t('income.netIncome')}</span>
          <span className="font-mono font-semibold text-base text-success">
            {formatCurrency(result.netIncome)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
