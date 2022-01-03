export type Event = {
  name: string;
  eventStarts?: Date;
  eventEnds?: Date;
  type: 'Conference' | 'Meetup';
  website: string;
  cfpOpens?: Date;
  city: string;
  country: string;
};
