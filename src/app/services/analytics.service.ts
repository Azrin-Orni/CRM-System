import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Lead, SalesMetrics } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private salesMetrics = new BehaviorSubject<SalesMetrics>({
    totalRevenue: 0,
    totalDeals: 0,
    averageDealSize: 0,
    conversionRate: 0,
    pipelineValue: 0,
  });

  salesMetrics$ = this.salesMetrics.asObservable();

  calculateMetrics(leads: Lead[]) {
    const closedDeals = leads.filter((lead) => lead.status === 'closed');
    const totalRevenue = closedDeals.reduce((sum, deal) => sum + deal.value, 0);
    const totalDeals = closedDeals.length;
    const pipelineValue = leads
      .filter((lead) => lead.status !== 'closed')
      .reduce(
        (sum, lead) => sum + (lead.value * (lead.probability || 0)) / 100,
        0
      );

    this.salesMetrics.next({
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalDeals,
      averageDealSize: totalDeals
        ? parseFloat((totalRevenue / totalDeals).toFixed(2))
        : 0,
      conversionRate: leads.length
        ? parseFloat(((totalDeals / leads.length) * 100).toFixed(2))
        : 0,
      pipelineValue: parseFloat(pipelineValue.toFixed(2)),
    });
  }
}
