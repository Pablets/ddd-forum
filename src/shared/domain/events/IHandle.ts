
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type IDomainEvent } from "./IDomainEvent";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface IHandle<IDomainEvent> {
  setupSubscriptions(): void;
}
