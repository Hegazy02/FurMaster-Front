export class Status {
  constructor(
    public type: StatusType = StatusType.Initial,
    public message: string = ''
  ) {}
}
export enum StatusType {
  Initial,
  Loading,
  Success,
  Error,
}
