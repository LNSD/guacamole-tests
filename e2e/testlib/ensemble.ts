import { Network, StartedNetwork, TestContainer } from 'testcontainers';

export type EnsembleNetworksProvider<Names extends string = string> = (
  id: string
) => Map<Names, Network>;

export type EnsembleServicesProvider<
  Names extends string = string,
  NetworkNames extends string = string,
> = (
  id: string,
  networks: Map<NetworkNames, StartedNetwork>
) => Map<Names, TestContainer>;
