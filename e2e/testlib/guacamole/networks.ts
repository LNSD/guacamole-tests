import { EnsembleNetworksProvider, EnsembleStartedNetworks } from '../ensemble';
import { Network } from 'testcontainers';

/**
 * Guacamole network names.
 */
export type GuacamoleNetworkNames = 'ingress' | 'guacamole' | 'fixtures';

export type GuacamoleEnsembleStartedNetworks =
  EnsembleStartedNetworks<GuacamoleNetworkNames>;

export type GuacamoleNetworksProvider =
  EnsembleNetworksProvider<GuacamoleNetworkNames>;

/**
 * A function that returns the Guacamole ensemble array of networks ready to
 * be started.
 */
export const defaultNetworks: GuacamoleNetworksProvider = (id) => {
  return [
    ['guacamole', new Network(`guacamole-${id}`)],
    ['ingress', new Network(`ingress-${id}`)],
    ['fixtures', new Network(`fixtures-${id}`)],
  ];
};
