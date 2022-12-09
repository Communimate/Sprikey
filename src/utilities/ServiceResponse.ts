/* eslint-disable id-denylist */
// eslint-disable-next-line unicorn/custom-error-definition
export class ServiceError extends Error {
  readonly errored = true;
}

export class ServiceData<Data = void> {
  readonly errored = false;
  readonly data: Data;

  constructor(data: Data) {
    this.data = data;
  }
}

export type ServiceResponse<Data> = ServiceData<Data> | ServiceError;
