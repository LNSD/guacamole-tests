import { EnsembleServiceProvider } from '../ensemble';
import { GuacdContainer } from '@guacamole-tests/guacamole-server/testlib/container';
import {
  GuacClientContainer,
  UserMappingXmlAuth,
} from '@guacamole-tests/guacamole-client/testlib/container';
import { StartedNetwork, TestContainer, Wait } from 'testcontainers';

export type FixtureServiceProvider = (
  ensembleId: string,
  fixtureNetwork: StartedNetwork
) => [string, TestContainer];

export type GuacdServiceProvider = (
  ensembleId: string,
  guacamoleNetwork: StartedNetwork,
  fixturesNetwork: StartedNetwork
) => [string, TestContainer];

export const defaultGuacdService: GuacdServiceProvider = (
  ensembleId,
  guacamoleNetwork,
  fixturesNetwork
) => {
  const guacd = new GuacdContainer()
    .withName(`guac-proxy-${ensembleId}`)
    .withNetwork(guacamoleNetwork)
    .withNetwork(fixturesNetwork)
    .withExposedPorts(4822)
    .withWaitStrategy(Wait.forListeningPorts());

  return ['guac-proxy', guacd];
};

/**
 * A function that provides a Guacamole client service.
 *
 * @param ensembleId - The ensemble ID.
 * @param networks - The ensemble networks.
 */
export const defaultGuacamoleClientService: EnsembleServiceProvider = (
  ensembleId,
  networks
) => {
  const guacamoleNetwork = networks.get('guacamole');
  if (!guacamoleNetwork) {
    throw new Error(`Guacamole network not found in the provided networks`);
  }

  const ingressNetwork = networks.get('ingress');
  if (!ingressNetwork) {
    throw new Error(`Ingress network not found in the provided networks`);
  }

  const guacamoleClient = new GuacClientContainer()
    .withName(`guac-server-${ensembleId}`)
    .withAuthConfiguration(
      new UserMappingXmlAuth(`<user-mapping></user-mapping>`)
    )
    .withNetwork(guacamoleNetwork)
    .withNetwork(ingressNetwork)
    .withExposedPorts(8080)
    .withWaitStrategy(Wait.forHttp('/guacamole', 8080));

  return ['guac-server', guacamoleClient];
};

/**
 * A function that returns the Guacamole ensemble array of services ready to
 * be started.
 */
export function defaultServices(): EnsembleServiceProvider[] {
  return [defaultGuacamoleClientService];
}
