// contacts.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from '../models/types';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  contacts$ = this.contactsSubject.asObservable();

  constructor() {
    // Initialize with some sample data
    this.addContact({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      company: 'Tech Corp',
      status: 'active',
      lastContact: new Date(),
      tags: ['client', 'priority'],
    });
  }

  addContact(contact: Contact) {
    const currentContacts = this.contactsSubject.value;
    const newContact = {
      ...contact,
      id: contact.id || Date.now().toString(),
      lastContact: contact.lastContact || new Date(),
    };
    this.contactsSubject.next([...currentContacts, newContact]);
  }

  updateContact(updatedContact: Contact) {
    const currentContacts = this.contactsSubject.value;
    const index = currentContacts.findIndex((c) => c.id === updatedContact.id);
    if (index !== -1) {
      currentContacts[index] = updatedContact;
      this.contactsSubject.next([...currentContacts]);
    }
  }

  deleteContact(contactId: string) {
    const currentContacts = this.contactsSubject.value;
    this.contactsSubject.next(
      currentContacts.filter((c) => c.id !== contactId)
    );
  }

  getFilteredContacts(searchTerm: string): Observable<Contact[]> {
    return this.contacts$.pipe(
      map((contacts) =>
        contacts.filter(
          (contact) =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.company.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  getActiveContacts(): Observable<Contact[]> {
    return this.contacts$.pipe(
      map((contacts) =>
        contacts.filter((contact) => contact.status === 'active')
      )
    );
  }
}
