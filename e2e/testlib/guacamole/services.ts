import { EnsembleServicesProvider } from '../ensemble';
import { GuacdContainer } from '@guacamole-tests/guacamole-server/testlib/container';
import {
  GuacClientContainer,
  UserMappingXmlAuth,
} from '@guacamole-tests/guacamole-client/testlib/container';
import { TestContainer, Wait } from 'testcontainers';
import { GuacamoleNetworkNames } from '@testlib/guacamole/networks';

/**
 * Guacamole service (container) names.
 */
export type GuacamoleServiceNames = 'guac-proxy' | 'guac-server';

export type GuacamoleServicesProvider = EnsembleServicesProvider<
  GuacamoleServiceNames,
  GuacamoleNetworkNames
>;

/**
 * A function that returns the Guacamole ensemble array of services ready to
 * be started.
 */
export const defaultServices: GuacamoleServicesProvider = (id, networks) => {
  const guacamoleNetwork = networks.get('guacamole');
  if (!guacamoleNetwork) {
    throw new Error(`Guacamole network not found in the provided networks`);
  }

  const ingressNetwork = networks.get('ingress');
  if (!ingressNetwork) {
    throw new Error(`Ingress network not found in the provided networks`);
  }

  const fixturesNetwork = networks.get('fixtures');
  if (!fixturesNetwork) {
    throw new Error(`Fixtures network not found in the provided networks`);
  }

  // Specify the services to start
  const services = new Map<GuacamoleServiceNames, TestContainer>();

  const guacd = new GuacdContainer()
    .withName(`guac-proxy-${id}`)
    .withNetwork(guacamoleNetwork)
    .withNetwork(fixturesNetwork)
    .withExposedPorts(4822)
    .withWaitStrategy(Wait.forListeningPorts());
  services.set('guac-proxy', guacd);

  const guacamoleClient = new GuacClientContainer()
    .withName(`guac-server-${id}`)
    .withAuthConfiguration(
      new UserMappingXmlAuth(`<user-mapping></user-mapping>`)
    )
    .withNetwork(guacamoleNetwork)
    .withNetwork(ingressNetwork)
    .withExposedPorts(8080)
    .withWaitStrategy(Wait.forHttp('/guacamole', 8080));
  services.set('guac-server', guacamoleClient);

  return services;
};
