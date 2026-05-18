export enum BookStatus {
  AVAILABLE = 'Available',
  RESERVED = 'Reserved',
  LOANED = 'Loaned',
  LOST = 'Lost',
}

export enum ReservationStatus {
  WAITING = 'Waiting',
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  CANCELED = 'Canceled',
  NONE = 'None',
}

export enum AccountStatus {
  ACTIVE = 'Active',
  CLOSED = 'Closed',
  CANCELED = 'Canceled',
  BLACKLISTED = 'Blacklisted',
  NONE = 'None',
}

export enum UserRole {
  LIBRARIAN = 'Librarian',
  MEMBER = 'Member',
}

export interface Author {
  name: string;
  description: string;
}

export interface Rack {
  number: string;
  location: string;
}

export interface Book {
  isbn: string;
  title: string;
  subject: string;
  authors: Author[];
  publisher: string;
  language: string;
  pages: number;
}

export interface BookItem extends Book {
  barcode: string;
  isReferenceOnly: boolean;
  borrowed?: Date;
  dueDate?: Date;
  price: number;
  format: string;
  status: BookStatus;
  dateOfPurchase: Date;
  publicationDate: Date;
  rack: Rack;
  coverImage?: string; // URL to the book cover image
  borrowedBy?: string; // ID of the member who borrowed it
  reservedBy?: string; // ID of the member who reserved it
}

export interface Account {
  id: string;
  password?: string;
  status: AccountStatus;
  role: UserRole;
  avatarUrl?: string; // Profile picture URL
  email?: string;
}

export interface Member extends Account {
  name: string;
  cardNumber: string;
  totalBooksCheckedOut: number;
}

export interface Librarian extends Account {
  // Librarian specific fields if any
}

export interface BookLending {
  id: string;
  creationDate: Date;
  dueDate: Date;
  returnDate?: Date;
  bookItemBarcode: string;
  memberId: string;
}

export interface BookReservation {
  id: string;
  creationDate: Date;
  status: ReservationStatus;
  bookItemBarcode: string;
  memberId: string;
}

export interface Fine {
  id: string;
  amount: number;
  date: Date;
  memberId: string;
}

export interface Notification {
  id: string;
  content: string;
  date: Date;
  memberId: string;
}
