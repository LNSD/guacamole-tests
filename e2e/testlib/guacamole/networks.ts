import { EnsembleNetworksProvider } from '../ensemble';
import { Network } from 'testcontainers';

/**
 * Guacamole network names.
 */
export type GuacamoleNetworkNames = 'ingress' | 'guacamole' | 'fixtures';

export type GuacamoleNetworksProvider =
  EnsembleNetworksProvider<GuacamoleNetworkNames>;

/**
 * A function that returns the Guacamole ensemble map of networks ready to
 * be started.
 */
export const defaultNetworks: GuacamoleNetworksProvider = (id) => {
  const networks = new Map<GuacamoleNetworkNames, Network>();
  networks.set('guacamole', new Network(`guacamole-${id}`));
  networks.set('ingress', new Network(`ingress-${id}`));
  networks.set('fixtures', new Network(`fixtures-${id}`));
  return networks;
};
