import { Network } from 'testcontainers';
import { EnsembleNetworkProvider } from '../ensemble';

export const guacamoleNetwork: EnsembleNetworkProvider = (id) => [
  'guacamole',
  new Network(`guacamole-${id}`),
];

export const ingressNetwork: EnsembleNetworkProvider = (id) => [
  'ingress',
  new Network(`ingress-${id}`),
];

export const fixturesNetwork: EnsembleNetworkProvider = (id) => [
  'fixtures',
  new Network(`fixtures-${id}`),
];

/**
 * A function that returns the Guacamole ensemble map of networks ready to
 * be started.
 */
export function defaultNetworks(): EnsembleNetworkProvider[] {
  return [guacamoleNetwork, ingressNetwork, fixturesNetwork];
}
