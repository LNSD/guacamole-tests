import {
  EnsembleStartedNetworks,
  EnsembleServicesProvider,
  EnsembleStartedServices,
} from '../ensemble';
import { GuacdContainer } from '@guacamole-tests/guacamole-server/testlib/container';
import {
  GuacClientContainer,
  UserMappingXmlAuth,
} from '@guacamole-tests/guacamole-client/testlib/container';
import { Wait } from 'testcontainers';
import { GuacamoleNetworkNames } from '@testlib/guacamole/networks';

/**
 * Guacamole service (container) names.
 */
export type GuacamoleServiceNames = 'guac-proxy' | 'guac-server';

export type GuacamoleEnsembleStartedServices =
  EnsembleStartedServices<GuacamoleServiceNames>;

export type GuacamoleServicesProvider = EnsembleServicesProvider<
  GuacamoleServiceNames,
  EnsembleStartedNetworks<GuacamoleNetworkNames>
>;

/**
 * A function that returns the Guacamole ensemble array of services ready to
 * be started.
 */
export const defaultServices: GuacamoleServicesProvider = (id, networks) => {
  // TODO: Fix service provider provide a way to access the network by name safely
  //   The following code is not safe, it assumes that the network entries are
  //   present. It will throw a TypeError if the network entry is not present.
  const [[, guacamoleNetwork]] = networks.filter(
    ([name]) => name === 'guacamole'
  );
  const [[, ingressNetwork]] = networks.filter(([name]) => name === 'ingress');
  const [[, fixturesNetwork]] = networks.filter(
    ([name]) => name === 'fixtures'
  );

  const guacd = new GuacdContainer()
    .withName(`guac-proxy-${id}`)
    .withNetwork(guacamoleNetwork)
    .withNetwork(fixturesNetwork);

  const guacamoleClient = new GuacClientContainer()
    .withName(`guac-server-${id}`)
    .withAuthConfiguration(
      new UserMappingXmlAuth(`<user-mapping></user-mapping>`)
    )
    .withNetwork(guacamoleNetwork)
    .withNetwork(ingressNetwork)
    .withExposedPorts(8080)
    .withWaitStrategy(Wait.forHttp('/guacamole', 200));

  return [
    ['guac-proxy', guacd],
    ['guac-server', guacamoleClient],
  ];
};
