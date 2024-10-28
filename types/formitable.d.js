declare module 'formidable' {
  import { IncomingForm as OriginalIncomingForm } from 'formidable';

  export class IncomingForm extends OriginalIncomingForm {
    constructor(options?: any);
    parse(req: any, callback: (err: any, fields: any, files: any) => void): void;
  }

  export interface File {
    newFilename?: string; // Add newFilename to the File type
    [key: string]: any;  // Allow other properties
  }
}
