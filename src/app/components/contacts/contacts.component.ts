import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ContactsService } from '../../services/contact.service';
import { Contact } from '../../models/types';
import { Observable, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent implements OnInit {
  contactForm!: FormGroup;
  filteredContacts$: Observable<Contact[]>;
  searchControl = new FormControl('');
  editingContact: Contact | null = null;

  constructor(
    private fb: FormBuilder,
    private contactsService: ContactsService
  ) {
    this.initForm();

    // Set up search with debounce
    this.filteredContacts$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => this.contactsService.getFilteredContacts(term || ''))
    );
  }

  ngOnInit() {
    // Initially show all contacts
    this.filteredContacts$ = this.contactsService.contacts$;
  }

  private initForm(contact?: Contact) {
    this.contactForm = this.fb.group({
      name: [contact?.name || '', Validators.required],
      email: [contact?.email || '', [Validators.required, Validators.email]],
      phone: [contact?.phone || '', Validators.required],
      company: [contact?.company || '', Validators.required],
      status: [contact?.status || 'active', Validators.required],
      notes: [contact?.notes || ''],
      tags: [contact?.tags?.join(', ') || ''],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const formValue = this.contactForm.value;
      const contact: Contact = {
        id: this.editingContact?.id || Date.now().toString(),
        ...formValue,
        tags: formValue.tags
          ? formValue.tags.split(',').map((tag: string) => tag.trim())
          : [],
        lastContact: this.editingContact?.lastContact || new Date(),
      };

      if (this.editingContact) {
        this.contactsService.updateContact(contact);
      } else {
        this.contactsService.addContact(contact);
      }

      this.editingContact = null;
      this.initForm();
    }
  }

  editContact(contact: Contact) {
    this.editingContact = contact;
    this.initForm(contact);
  }

  cancelEdit() {
    this.editingContact = null;
    this.initForm();
  }

  deleteContact(id: string) {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.contactsService.deleteContact(id);
    }
  }
}
