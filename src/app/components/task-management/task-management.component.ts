// src/app/features/tasks/task-management.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrmService } from '../../services/crm.service';
import { Task, Meeting } from '../../models/types';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
})
export class TaskManagementComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  taskForm: FormGroup;
  tasks: Task[] = [];
  meetings: Meeting[] = [];
  editingTask: Task | null = null;

  constructor(private fb: FormBuilder, private crmService: CrmService) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['medium', Validators.required],
      status: ['pending', Validators.required],
      assignedTo: ['', Validators.required],
      relatedTo: this.fb.group({
        type: ['contact'],
        id: [''],
      }),
    });
  }

  ngOnInit() {
    console.log('TaskManagementComponent ngOnInit', this.tasks);

    // Subscribe to tasks and meetings updates
    this.subscription = this.crmService.tasks$.subscribe((tasks) => {
      this.tasks = tasks; // Update task list whenever the tasks observable emits
    });

    this.subscription.add(
      this.crmService.meetings$.subscribe((meetings) => {
        this.meetings = meetings; // Update meetings list
      })
    );
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions on destroy
    this.subscription.unsubscribe();
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const newTask: Task = {
        id: this.editingTask?.id || Date.now().toString(),
        ...formValue,
        dueDate: new Date(formValue.dueDate), // Ensure dueDate is a Date object
      };

      if (this.editingTask) {
        // Update the existing task
        this.crmService.tasks$.pipe(take(1)).subscribe((currentTasks) => {
          const updatedTasks = currentTasks.map((task) =>
            task.id === newTask.id ? newTask : task
          );
          this.crmService.updateTasks(updatedTasks);
        });
      } else {
        // Add the new task
        this.crmService.tasks$.pipe(take(1)).subscribe((currentTasks) => {
          this.crmService.updateTasks([...currentTasks, newTask]);
        });
      }

      // Reset the form and editingTask after submission
      this.editingTask = null;
      this.taskForm.reset({
        priority: 'medium',
        status: 'pending',
        relatedTo: { type: 'contact' },
      });
    }
  }

  editTask(task: Task) {
    this.editingTask = task;
    this.taskForm.patchValue({
      ...task,
      dueDate: task.dueDate.toISOString().split('T')[0], // Format date for input[type="date"]
    });
  }

  cancelEdit() {
    this.editingTask = null;
    this.taskForm.reset({
      priority: 'medium',
      status: 'pending',
      relatedTo: { type: 'contact' },
    });
  }

  deleteTask(taskId: string) {
    this.crmService.tasks$.pipe(take(1)).subscribe((currentTasks) => {
      // Remove the task by filtering out the task with the specified ID
      const updatedTasks = currentTasks.filter((task) => task.id !== taskId);
      this.crmService.updateTasks(updatedTasks); // Update the task list
    });
  }

  // This method will be called when a new task is created from the calendar modal
  addTaskFromCalendar(taskData: {
    taskTitle: string;
    dueDate: Date;
    assignedTo: string;
  }) {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.taskTitle,
      description: `Calendar event: ${taskData.taskTitle}`,
      dueDate: taskData.dueDate,
      priority: 'medium',
      status: 'pending',
      assignedTo: taskData.assignedTo,
    };

    // Add the new task to the crmService
    this.crmService.tasks$.pipe(take(1)).subscribe((currentTasks) => {
      this.crmService.updateTasks([...currentTasks, newTask]); // Update task list with the new task
    });
  }
}
