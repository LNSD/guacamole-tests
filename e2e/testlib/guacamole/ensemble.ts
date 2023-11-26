import {
  StartedNetwork,
  StartedTestContainer,
  StoppableNetwork,
} from 'testcontainers';
import {
  Ensemble,
  EnsembleService,
  EnsembleNetworks,
  EnsembleStartedServices,
  EnsembleStartedNetworks,
  StartedEnsemble,
  EnsembleServiceName,
  EnsembleNetworkName,
} from '../ensemble';
import {
  defaultNetworks,
  GuacamoleEnsembleStartedNetworks,
  GuacamoleNetworkNames,
  GuacamoleNetworksProvider,
} from './networks';
import { v4 as uuid } from 'uuid';
import {
  defaultServices,
  GuacamoleEnsembleStartedServices,
  GuacamoleServiceNames,
  GuacamoleServicesProvider,
} from './services';

/**
 * Start sequentially all the networks in the ensemble.
 *
 * @param networks - The networks to start.
 * @returns A promise that resolves when all the networks have started.
 */
async function startNetworks<
  Names extends EnsembleNetworkName = EnsembleNetworkName,
>(networks: EnsembleNetworks<Names>): Promise<EnsembleStartedNetworks<Names>> {
  const started = [];
  for (const n of networks.map(
    async ([name, net]): Promise<
      [Names, StartedNetwork & StoppableNetwork]
    > => [name, await net.start()]
  )) {
    started.push(await n);
  }
  return started;
}

/**
 * Start sequentially all the services in the ensemble.
 *
 * @param services - The services to start.
 * @returns A promise that resolves when all the services have started.
 */
async function startServices<
  Names extends EnsembleServiceName = EnsembleServiceName,
>(services: EnsembleService<Names>): Promise<EnsembleStartedServices<Names>> {
  const started = [];
  for (const n of services.map(
    async ([name, svc]): Promise<[Names, StartedTestContainer]> => [
      name,
      await svc.start(),
    ]
  )) {
    started.push(await n);
  }
  return started;
}

/**
 * An ensemble of Guacamole services.
 */
// TODO: Add a way to configure the ensemble
//  - Configure the Guacamole client (.withGuacamoleClient(...))
//  - Configure the Guacamole server (.withGuacdServer(...))
//  - Add a fixture container (.withFixtureContainer(...))

export class GuacamoleEnsemble
  implements Ensemble<GuacamoleNetworkNames, GuacamoleServiceNames>
{
  private readonly _id?: string;
  private networksProvider?: GuacamoleNetworksProvider;
  private servicesProvider?: GuacamoleServicesProvider;

  constructor(id?: string) {
    this._id = id;
  }

  /**
   * Start the ensemble.
   *
   * This can be called multiple times to start multiple ensembles.
   *
   * @returns A promise that resolves when the ensemble has started.
   */
  async start(id?: string): Promise<GuacamoleStartedEnsemble> {
    const ensembleId = id ?? this._id ?? uuid();

    // Create the networks and start them.
    const networksProvider = this.networksProvider ?? defaultNetworks;
    const networks = await startNetworks(networksProvider(ensembleId));

    // Create the services and start them.
    const servicesProvider = this.servicesProvider ?? defaultServices;
    const services = await startServices(
      servicesProvider(ensembleId, networks)
    );

    return new GuacamoleStartedEnsemble(networks, services);
  }
}

/**
 * A started ensemble of Guacamole services.
 */
export class GuacamoleStartedEnsemble
  implements StartedEnsemble<GuacamoleNetworkNames, GuacamoleServiceNames>
{
  private stopped = false;

  constructor(
    private readonly _networks: GuacamoleEnsembleStartedNetworks,
    private readonly _services: GuacamoleEnsembleStartedServices
  ) {}

  /**
   * A map of service names to containers.
   */
  get services(): Readonly<
    Record<GuacamoleServiceNames, StartedTestContainer>
  > {
    // Return a frozen services map to prevent mutation.
    return Object.freeze(
      this._services.reduce(
        (record, [name, service]) => {
          record[name] = service;
          return record;
        },
        // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
        {} as Record<GuacamoleServiceNames, StartedTestContainer>
      )
    );
  }

  /**
   * A map of network names to network instances.
   */
  get networks(): Readonly<Record<GuacamoleNetworkNames, StartedNetwork>> {
    // Return a frozen networks map to prevent mutation.
    return Object.freeze(
      this._networks.reduce(
        (acc, [name, network]) => {
          acc[name] = network;
          return acc;
        },
        // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
        {} as Record<GuacamoleNetworkNames, StartedNetwork>
      )
    );
  }

  /**
   * Check if the ensemble has been stopped.
   */
  isStopped(): boolean {
    return this.stopped;
  }

  /**
   * Stop the ensemble.
   *
   * This will stop and remove all the ensemble containers and networks. If
   * the ensemble is already stopped, this is a no-op.
   *
   * @returns A promise that resolves when the ensemble has stopped.
   */
  async stop(): Promise<void> {
    if (this.stopped) {
      return;
    }

    // Services are stopped sequentially in reverse order to avoid stopping a
    // service that is depended on by another service.
    for (let i = this._services.length - 1; i >= 0; i--) {
      const [, service] = this._services[i];
      await service.stop();
    }

    // Stop all the networks sequentially in reverse order.
    for (let i = this._networks.length - 1; i >= 0; i--) {
      const [, network] = this._networks[i];
      await network.stop();
    }

    this.stopped = true;
  }
}
