import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
} from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CrmService } from '../../services/crm.service';
import { Meeting, Task } from '../../models/types';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { take } from 'rxjs';
import { ToastService } from 'src/app/services/toast.service';
import { ModalCalendarComponent } from '../modal-calendar/modal-calendar.component';
import { TaskManagementComponent } from '../task-management/task-management.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calender.component.html',
})
export class CalendarComponent implements AfterViewInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  @ViewChild('modalCalendar') modalCalendar!: ModalCalendarComponent;

  @Input() meetings: Meeting[] = [];

  modalOpen: boolean = false; // Flag to control modal visibility
  @ViewChild(TaskManagementComponent)
  taskManagementComponent!: TaskManagementComponent; // Reference to TaskManagementComponent
  selectedDate: Date | null = null; // Property to store the selected date

  ngAfterViewInit(): void {
    // Ensure modalCalendar is initialized after the view is fully rendered
    if (this.modalCalendar) {
      console.log('Modal component is available:', this.modalCalendar);
    } else {
      console.error('Modal component is not available');
    }
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    events: this.meetings,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay',
    },
    selectable: true,
    editable: true,
    height: '450px',
    dayMaxEventRows: 2,
    views: {
      dayGrid: {
        dayMaxEventRows: 2,
      },
    },
    eventClassNames: 'text-xs p-1',
    dayHeaderClassNames: 'text-sm py-2',
    dayCellClassNames: 'text-sm',
    titleFormat: { year: 'numeric', month: 'short' },
  };

  constructor(
    private crmService: CrmService,
    private toastService: ToastService
  ) {}

  handleDateSelect(selectInfo: DateSelectArg) {
    this.selectedDate = new Date(selectInfo.start);

    this.modalOpen = true;

    // Ensure modalCalendar is initialized before accessing its properties
    if (this.modalCalendar) {
      this.modalCalendar.title = '';
    } else {
      console.error('ModalCalendarComponent is not initialized');
    }
  }

  closeModal() {
    this.modalOpen = false; // Close the modal
    console.log('Modal closed:', this.modalOpen);
  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log(clickInfo, 'clicked event');
    // Handle the event click logic here
  }

  saveEvent(eventData: { title: string }) {
    const { title } = eventData;

    const dueDate = this.selectedDate;

    if (!dueDate || isNaN(dueDate.getTime())) {
      console.error('Invalid dueDate:', dueDate);
      return;
    }

    // Now, handle the logic for saving the task and meeting
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title: title, // Use taskTitle
      start: dueDate,
      end: dueDate, // Adjust as necessary
      allDay: false, // Adjust this if needed
    };

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: title, // Use taskTitle
      description: `Calendar event: ${title}`,
      dueDate: dueDate,
      priority: 'medium',
      status: 'pending',
      assignedTo: '', // No assignedTo field
      relatedTo: { type: 'meeting', id: newMeeting.id },
    };

    // Update the meetings and tasks list
    this.crmService.meetings$.pipe(take(1)).subscribe((currentMeetings) => {
      this.crmService.updateMeetings([...currentMeetings, newMeeting]);
    });

    this.crmService.tasks$.pipe(take(1)).subscribe((currentTasks) => {
      this.crmService.updateTasks([...currentTasks, newTask]); // Add the new task
    });

    // Show success toast
    this.toastService.show({
      title: 'Event Added Successfully',
      description: `"${title}" has been added`,
      type: 'success',
    });

    // Close the modal
    this.modalOpen = false;
    console.log('Modal closed after save:', this.modalOpen);
  }
}
