import {
  Network,
  StartedNetwork,
  StartedTestContainer,
  StoppableNetwork,
  TestContainer,
} from 'testcontainers';

export type EnsembleNetworkName = string;

export type EnsembleNetworks<
  Name extends EnsembleNetworkName = EnsembleNetworkName,
> = Array<[Name, Network]>;

export type EnsembleStartedNetworks<
  Name extends EnsembleNetworkName = EnsembleNetworkName,
> = Array<[Name, StartedNetwork & StoppableNetwork]>;

/**
 * A function that returns an array of networks ready to be started.
 */
export type EnsembleNetworksProvider<
  Name extends EnsembleNetworkName = EnsembleNetworkName,
> = (id: string) => EnsembleNetworks<Name>;

export type EnsembleServiceName = string;

export type EnsembleService<
  Name extends EnsembleServiceName = EnsembleServiceName,
> = Array<[Name, TestContainer]>;

export type EnsembleStartedServices<
  Name extends EnsembleServiceName = EnsembleServiceName,
> = Array<[Name, StartedTestContainer]>;

/**
 * A function that returns an array of containers ready to be started.
 */
export type EnsembleServicesProvider<
  Name extends EnsembleServiceName = EnsembleServiceName,
  Networks extends EnsembleStartedNetworks = EnsembleStartedNetworks,
> = (id: string, networks: Networks) => EnsembleService<Name>;

/**
 * Ensemble is a collection of services that are started and stopped together.
 */
export interface Ensemble<
  NetworkNames extends EnsembleNetworkName = EnsembleNetworkName,
  ServiceNames extends EnsembleServiceName = EnsembleServiceName,
> {
  /**
   * Start the ensemble.
   */
  start(): Promise<StartedEnsemble<NetworkNames, ServiceNames>>;
}

/**
 * A started ensemble of services.
 */
export interface StartedEnsemble<
  NetworkNames extends EnsembleNetworkName = EnsembleNetworkName,
  ServiceNames extends EnsembleServiceName = EnsembleServiceName,
> {
  /**
   * A map of network names to network instances.
   */
  networks: Readonly<Record<NetworkNames, StartedNetwork>>;

  /**
   * A map of service names to containers.
   */
  services: Readonly<Record<ServiceNames, StartedTestContainer>>;

  /**
   * Whether the ensemble is stopped.
   */
  isStopped(): boolean;

  /**
   * Stop the ensemble.
   */
  stop(): Promise<void>;
}
