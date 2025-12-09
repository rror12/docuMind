
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export enum DocStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  ERROR = 'ERROR',
}
