export class Status {
  constructor(
    public type: StatusType = StatusType.Loading,
    public message: string = ''
  ) {}
}
export enum StatusType {
  Loading,
  Success,
  Error,
}
