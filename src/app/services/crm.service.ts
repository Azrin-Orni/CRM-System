// src/app/services/crm.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lead, Task, Contact, Meeting } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class CrmService {
  private leadsSubject = new BehaviorSubject<Lead[]>([]);
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  private meetingsSubject = new BehaviorSubject<Meeting[]>([]);

  leads$ = this.leadsSubject.asObservable();
  tasks$ = this.tasksSubject.asObservable();
  contacts$ = this.contactsSubject.asObservable();
  meetings$ = this.meetingsSubject.asObservable();

  constructor() {
    this.updateTasks([
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
  }

  // Method to get recent leads
  getRecentLeads(limit: number): Observable<Lead[]> {
    return this.leads$.pipe(
      map((leads) =>
        [...leads]
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, limit)
      )
    );
  }

  // Method to get upcoming tasks
  // getUpcomingTasks(limit: number): Observable<Task[]> {
  //   return this.tasks$.pipe(
  //     map((tasks) =>
  //       [...tasks]
  //         .filter((task) => task.status !== 'completed')
  //         .sort((a, b) => {
  //           // Date validation before calling getTime()
  //           if (a.dueDate instanceof Date && !isNaN(a.dueDate.getTime())) {
  //             if (b.dueDate instanceof Date && !isNaN(b.dueDate.getTime())) {
  //               return a.dueDate.getTime() - b.dueDate.getTime();
  //             } else {
  //               console.error('Invalid dueDate for task b', b.dueDate);
  //               return 0;
  //             }
  //           } else {
  //             console.error('Invalid dueDate for task a', a.dueDate);
  //             return 0;
  //           }
  //         })
  //         .slice(0, limit)
  //     )
  //   );
  // }

  getUpcomingTasks(limit: number): Observable<Task[]> {
    return this.tasks$.pipe(
      map((tasks) =>
        [...tasks]
          .filter((task) => task.status !== 'completed')
          .sort((a, b) => {
            // Convert dueDate to Date if it's not already a Date
            const aDueDate = new Date(a.dueDate);
            const bDueDate = new Date(b.dueDate);

            // Ensure both are valid dates before calling getTime()
            if (aDueDate instanceof Date && !isNaN(aDueDate.getTime())) {
              if (bDueDate instanceof Date && !isNaN(bDueDate.getTime())) {
                return aDueDate.getTime() - bDueDate.getTime();
              } else {
                console.error('Invalid dueDate for task b', b.dueDate);
                return 0;
              }
            } else {
              console.error('Invalid dueDate for task a', a.dueDate);
              return 0;
            }
          })
          .slice(0, limit)
      )
    );
  }

  // Method to update leads
  updateLeads(leads: Lead[]) {
    this.leadsSubject.next(leads);
  }

  // Method to update tasks
  updateTasks(tasks: Task[]) {
    this.tasksSubject.next(tasks);
  }

  // Method to update contacts
  updateContacts(contacts: Contact[]) {
    this.contactsSubject.next(contacts);
  }

  updateMeetings(meetings: Meeting[]) {
    this.meetingsSubject.next(meetings);
  }
}
