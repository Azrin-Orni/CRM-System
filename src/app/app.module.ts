import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { CrmService } from './services/crm.service';
import { AnalyticsService } from './services/analytics.service';
import { TaskManagementComponent } from './components/task-management/task-management.component';
import { ContactsModule } from './components/contacts/contacts.module';
import { CalendarComponent } from './components/calender/calender.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ToastComponent } from './components/toast/toast.component';
import { ModalCalendarComponent } from './components/modal-calendar/modal-calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TaskManagementComponent,
    CalendarComponent,
    ToastComponent,
    ModalCalendarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ContactsModule,
    FullCalendarModule,
    FormsModule,
  ],
  providers: [CrmService, AnalyticsService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
