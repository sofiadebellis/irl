
// User Types
export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    bio: string;
    image: string;
    pronouns: string;
    university: University;
    availability: boolean[][];
    eventNotifications: boolean;
    messageNotifications: boolean;
    location: string;
    privateAccount: boolean;
    chats: UserChat[];
    events: UserEvent[];
    friends: string[];
    interest: EventCategory[];
  }

export enum University {
    UNSW = "University of New South Wales",
    USYD = "University of Sydney",
    MQ = "Macquarie University",
    ACU = "Australian Catholic University",
    OTHER = "Other",
  }

export interface Event {
    id: string;
    name: string;
    coverPhoto: string;
    location: string;
    description: string;
    host: string;
    start: string;
    end: string;
    groupChat: string;
    category: EventCategory;
    price: EventPrice;
  }

  export enum EventPrice {
    FREE = "Free",
    LOW = "Low",
    MED = "Medium",
    HIGH = "High",
  }

  export enum EventCategory {
    ENTERTAINMENT = "Entertainment",
    CREATIVE = "Creative",
    FOOD_RELATED = "Food Related",
    FITNESS = "Fitness",
    PUZZLES = "Puzzles",
    TRAVEL = "Travel",
    CHARITY = "Charity",
  }

  // Chat and Message Types
  export interface UserChat {
    id: string;
    name: string;
    groupChat: boolean;
    archived?: boolean;
  }

  export interface Chat {
    id: string;
    name: string;
    coverPhoto: string;
    members: string[];
    admins?: string[];
    messages: Message[];
    groupChat: boolean;
    archived?: boolean;
  }

  export interface Message {
    sender: string;
    timestamp: string;
    message: string;
  }

  // User Event Types
  export interface UserEvent {
    id: string;
    status: Status;
    type: EventType;
  }

  export enum Status {
    NONE = "None",
    GOING = "Going",
    INTERESTED = "Interested",
    CANT_GO = "Can't Go",
    WENT = "Went",
  }

  export enum EventType {
    PAST = "Past",
    CREATED = "Created",
    RSVP = "RSVPd",
  }

  // Filters Type
  export interface Filters {
    availability: boolean;
    rsvp: boolean;
    category: EventCategory[];
    distance: Distance[];
    price: EventPrice[];
  }

  export enum Distance {
    ONE = "ONE",
    FIVE = "FIVE",
    TEN = "TEN",
    TWENTY_FIVE = "TWENTY_FIVE",
    FIFTY = "FIFTY",
    OVER_FIFTY = "OVER_FIFTY",
  }

  // Sort Type
  export enum Sort {
    DATE = "DATE",
    DISTANCE_ASC = "DISTANCE_ASC",
    DISTANCE_DES = "DISTANCE_DES",
    PRICE_ASC = "PRICE_ASC",
    PRICE_DES = "PRICE_DES",
  }

  // Collections
  export interface Collections {
    Users: User[];
    Events: Event[];
    GroupChats: Chat[];
    PrivateChats: Chat[];
  }