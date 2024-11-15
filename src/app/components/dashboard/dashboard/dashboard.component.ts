import { Component, OnInit, OnDestroy } from '@angular/core';
import { CrmService } from '../../../services/crm.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { Lead, Task, Meeting } from '../../../models/types';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  salesMetrics$ = this.analyticsService.salesMetrics$;
  recentLeads$ = this.crmService.getRecentLeads(5);
  upcomingTasks$ = this.crmService.getUpcomingTasks(15);

  salesChart: any;
  pipelineChart: any;
  meetings: Meeting[] = [];

  constructor(
    private crmService: CrmService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.subscription = this.crmService.leads$.subscribe((leads) => {
      this.analyticsService.calculateMetrics(leads);
      this.updateCharts(leads);
    });
    this.crmService.updateLeads([
      {
        id: '1',
        contactId: '1',
        status: 'new',
        value: 10000,
        description: 'New software deal',
        createdAt: new Date(),
        probability: 50,
        assignedTo: 'John Doe',
      },
      {
        id: '2',
        contactId: '2',
        status: 'proposal',
        value: 15000,
        description: 'Hardware upgrade project',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        probability: 75,
        assignedTo: 'Jane Smith',
      },
      {
        id: '3',
        contactId: '3',
        status: 'closed',
        value: 20000,
        description: 'Cloud migration services',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        probability: 100,
        assignedTo: 'John Doe',
      },
    ]);

    this.crmService.updateTasks([
      {
        id: '1',
        title: 'Finish report for Q4',
        description:
          'Complete and submit the quarterly report by the end of the month.',
        dueDate: new Date('2024-12-15'),
        status: 'in-progress',
        priority: 'high',
        assignedTo: 'John Doe',
        relatedTo: {
          type: 'deal',
          id: 'd-1001',
        },
      },
      {
        id: '2',
        title: 'Prepare presentation for client meeting',
        description:
          'Create slides and gather relevant data for the upcoming client meeting.',
        dueDate: new Date('2024-11-20'),
        status: 'pending',
        priority: 'medium',
        assignedTo: 'Alice Smith',
        relatedTo: {
          type: 'contact',
          id: 'c-305',
        },
      },
      {
        id: '3',
        title: 'Follow up on lead',
        description:
          'Contact the lead to discuss potential opportunities and next steps.',
        dueDate: new Date('2024-11-25'),
        status: 'pending',
        priority: 'low',
        assignedTo: 'Bob Johnson',
        relatedTo: {
          type: 'lead',
          id: 'l-4302',
        },
      },
      {
        id: '4',
        title: 'Submit invoice for project work',
        description:
          'Ensure the invoice is prepared and submitted to finance by due date.',
        dueDate: new Date('2024-12-05'),
        status: 'completed',
        priority: 'medium',
        assignedTo: 'Sara Lee',
      },
      {
        id: '5',
        title: 'Research market trends',
        description:
          'Analyze recent trends in the industry and compile a report for the team.',
        dueDate: new Date('2024-12-01'),
        status: 'in-progress',
        priority: 'high',
        assignedTo: 'David Brown',
        relatedTo: {
          type: 'deal',
          id: 'd-2085',
        },
      },
      {
        id: '6',
        title: 'Schedule team meeting',
        description:
          'Organize a monthly meeting to discuss project updates and team goals.',
        dueDate: new Date('2024-11-18'),
        status: 'pending',
        priority: 'low',
        assignedTo: 'Chris White',
      },
    ]);

    this.initializeSalesChart();
    this.initializePipelineChart();

    this.crmService.leads$.subscribe((leads) => {
      this.analyticsService.calculateMetrics(leads);
      this.updateCharts(leads);
    });

    this.crmService.meetings$.subscribe((meetings) => {
      this.meetings = meetings;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private initializeSalesChart() {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    this.salesChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Monthly Sales',
            data: [],
            borderColor: 'rgb(59, 130, 246)',
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  private initializePipelineChart() {
    const ctx = document.getElementById('pipelineChart') as HTMLCanvasElement;
    this.pipelineChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation'],
        datasets: [
          {
            data: [],
            backgroundColor: [
              '#60A5FA',
              '#34D399',
              '#FBBF24',
              '#F87171',
              '#818CF8',
            ],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  private updateCharts(leads: Lead[]) {
    if (this.salesChart) {
      // Update Sales Chart
      const monthlySales = this.calculateMonthlySales(leads);
      this.salesChart.data.labels = monthlySales.map((m) => m.month);
      this.salesChart.data.datasets[0].data = monthlySales.map((m) => m.value);
      this.salesChart.update();
    }

    if (this.pipelineChart) {
      // Update Pipeline Chart
      const pipelineData = this.calculatePipelineData(leads);
      this.pipelineChart.data.datasets[0].data = pipelineData;
      this.pipelineChart.update();
    }
  }

  private calculateMonthlySales(
    leads: Lead[]
  ): { month: string; value: number }[] {
    // Group and sum sales by month
    const salesByMonth = leads
      .filter((lead) => lead.status === 'closed')
      .reduce((acc, lead) => {
        const month = new Date(lead.createdAt).toLocaleString('default', {
          month: 'short',
        });
        acc[month] = (acc[month] || 0) + lead.value;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(salesByMonth).map(([month, value]) => ({
      month,
      value: value as number,
    }));
  }

  private calculatePipelineData(leads: Lead[]): number[] {
    const stages = ['new', 'contacted', 'qualified', 'proposal', 'negotiation'];
    return stages.map(
      (stage) => leads.filter((lead) => lead.status === stage).length
    );
  }
}
