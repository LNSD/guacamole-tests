import {
  Network,
  StartedNetwork,
  StartedTestContainer,
  TestContainer,
} from 'testcontainers';

/**
 * A function that provides a set of networks for an ensemble.
 */
export type EnsembleNetworkProvider = (ensembleId: string) => [string, Network];

/**
 * A function that provides a set of services for an ensemble.
 */
export type EnsembleServiceProvider = (
  ensembleId: string,
  networks: Map<string, StartedNetwork>
) => [string, TestContainer];

/**
 * An ensemble of services.
 *
 * An ensemble is a collection of networks and services that are started together.
 */
export interface Ensemble {
  /**
   * Start the ensemble.
   *
   * This will create and start all the networks and services in the ensemble.
   *
   * @param id - The ensemble ID. If not specified, a random ID should be generated.
   * @returns A promise that resolves when the ensemble has started.
   */
  start(id?: string): Promise<StartedEnsemble>;
}

/**
 * A started ensemble.
 *
 * This is returned when an ensemble is started.
 */
export interface StartedEnsemble {
  /**
   * The ensemble ID.
   *
   * This is a unique identifier for the ensemble. It is generated when the
   * ensemble is started.
   */
  get id(): string;

  /**
   * The ensemble networks.
   *
   * A map of network names to started networks.
   */
  get networks(): Readonly<Map<string, StartedNetwork>>;

  /**
   * The ensemble services.
   *
   * A map of service names to started services.
   */
  get services(): Readonly<Map<string, StartedTestContainer>>;

  /**
   * Whether the ensemble is started.
   */
  isStarted(): boolean;

  /**
   * Stop the ensemble.
   *
   * This will stop and remove all the ensemble containers and networks. If the
   * ensemble is already stopped, this is a no-op.
   *
   * @returns A promise that resolves when the ensemble has stopped.
   */
  stop(): Promise<void>;
}

/**
 * Ensemble error.
 *
 * This is thrown when an error occurs while configuring, starting or stopping an ensemble.
 */
export class EnsembleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnsembleError';
  }
}
