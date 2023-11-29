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

export type GuacamoleClientServiceProvider = (
  ensembleId: string,
  guacamoleNetwork: StartedNetwork,
  ingressNetwork: StartedNetwork
) => [string, TestContainer];

/**
 * A function that provides a guacd service.
 *
 * @param ensembleId - The ensemble ID.
 * @param guacamoleNetwork - The Guacamole network.
 * @param fixturesNetwork - The fixtures network.
 */
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
 * @param guacamoleNetwork - The Guacamole network.
 * @param ingressNetwork - The ingress network.
 */
export const defaultGuacamoleClientService: GuacamoleClientServiceProvider = (
  ensembleId,
  guacamoleNetwork,
  ingressNetwork
) => {
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
