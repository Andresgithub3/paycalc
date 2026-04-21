'use client';

import { useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { getProvinceFAQ } from '@/lib/province-faq';
import type { Province } from '@/lib/tax';

interface ProvinceFAQProps {
  province: Province;
}

export function ProvinceFAQ({ province }: ProvinceFAQProps) {
  const locale = useLocale() as 'en' | 'fr';
  const faqs = getProvinceFAQ(province);

  if (faqs.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">FAQ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {faqs.map((faq, i) => (
          <Collapsible key={i}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-medium hover:bg-muted/50 transition-colors">
              <span>{faq.q[locale]}</span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform [[data-state=open]>&]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3 pt-1 text-sm text-muted-foreground leading-relaxed">
              {faq.a[locale]}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
}
