import {
  Network,
  StartedNetwork,
  StartedTestContainer,
  StoppableNetwork,
  TestContainer,
} from 'testcontainers';
import { defaultNetworks, GuacamoleNetworkNames } from './networks';
import { v4 as uuid } from 'uuid';
import { defaultServices, GuacamoleServiceNames } from './services';
import {
  EnsembleNetworksProvider,
  EnsembleServicesProvider,
} from '../ensemble';

/**
 * Start sequentially all the networks in the ensemble.
 *
 * @param networks - The networks to start.
 * @returns A promise that resolves when all the networks have started.
 */
async function startNetworks<Names extends string = string>(
  networks: Map<Names, Network>
): Promise<Map<Names, StartedNetwork & StoppableNetwork>> {
  const started = new Map<Names, StartedNetwork & StoppableNetwork>();
  for (const [name, network] of networks) {
    started.set(name, await network.start());
  }
  return started;
}

/**
 * Start sequentially all the services in the ensemble.
 *
 * @param services - The services to start.
 * @returns A promise that resolves when all the services have started.
 */
async function startServices<Names extends string = string>(
  services: Map<Names, TestContainer>
): Promise<Map<Names, StartedTestContainer>> {
  const started = new Map<Names, StartedTestContainer>();
  for (const [name, service] of services) {
    started.set(name, await service.start());
  }
  return started;
}

/**
 * An ensemble of Guacamole services.
 */
export class GuacamoleEnsemble {
  private readonly _id?: string;
  private readonly networkProviders: Array<
    EnsembleNetworksProvider<GuacamoleNetworkNames>
  > = [];
  private readonly servicesProviders: Array<
    EnsembleServicesProvider<GuacamoleServiceNames, GuacamoleNetworkNames>
  > = [];

  constructor(id?: string) {
    this._id = id;
  }

  /**
   * Set the ensemble networks provider.
   *
   * If called multiple times, the networks provided will be merged before
   * started.
   *
   * @param provider - A function that returns a map of networks ready to be
   *                   started.
   */
  private withNetworks(
    provider: EnsembleNetworksProvider<GuacamoleNetworkNames>
  ): this {
    this.networkProviders.push(provider);
    return this;
  }

  /**
   * Set the default ensemble networks provider.
   */
  public withDefaultNetworks(): this {
    this.withNetworks(defaultNetworks);
    return this;
  }

  /**
   * Set the ensemble services provider.
   *
   * If called multiple times, the services provided are merged.
   *
   * @param provider - A function that returns a map of services ready to be
   *                   started.
   */
  private withServices(
    provider: EnsembleServicesProvider<
      GuacamoleServiceNames,
      GuacamoleNetworkNames
    >
  ): this {
    this.servicesProviders.push(provider);
    return this;
  }

  /**
   * Set the default ensemble services provider.
   */
  public withDefaultServices(): this {
    this.withServices(defaultServices);
    return this;
  }

  /**
   * Start the ensemble.
   *
   * This can be called multiple times to start multiple ensembles.
   *
   * @returns A promise that resolves when the ensemble has started.
   */
  public async start(id?: string): Promise<GuacamoleStartedEnsemble> {
    const ensembleId = id ?? this._id ?? uuid();

    // Create the networks and start them.
    const networks = this.networkProviders.reduce<
      Map<GuacamoleNetworkNames, Network>
    >((networks, provider) => {
      provider(ensembleId).forEach((value, key) => networks.set(key, value));
      return networks;
    }, new Map());
    if (networks.size === 0) {
      throw new Error('No networks provided');
    }
    const startedNetworks = await startNetworks(networks);

    // Create the services and start them.
    const services = this.servicesProviders.reduce<
      Map<GuacamoleServiceNames, TestContainer>
    >((services, provider) => {
      provider(ensembleId, startedNetworks).forEach((value, key) =>
        services.set(key, value)
      );
      return services;
    }, new Map());
    if (services.size === 0) {
      throw new Error('No services provided');
    }
    const startedServices = await startServices(services);

    return new GuacamoleStartedEnsemble(startedNetworks, startedServices);
  }
}

/**
 * A started ensemble of Guacamole services.
 */
export class GuacamoleStartedEnsemble {
  private started = true;

  constructor(
    private readonly _networks: Map<
      GuacamoleNetworkNames,
      StartedNetwork & StoppableNetwork
    >,
    private readonly _services: Map<GuacamoleServiceNames, StartedTestContainer>
  ) {}

  /**
   * A map of network names to network instances.
   */
  get networks(): Readonly<Map<GuacamoleNetworkNames, StartedNetwork>> {
    // Return a frozen map object to prevent mutation.
    return Object.freeze(this._networks);
  }

  /**
   * A map of service names to containers.
   */
  get services(): Readonly<Map<GuacamoleServiceNames, StartedTestContainer>> {
    // Return a frozen services map to prevent mutation.
    return Object.freeze(this._services);
  }

  /**
   * Check if the ensemble is started.
   */
  public isStarted(): boolean {
    return this.started;
  }

  /**
   * Stop the ensemble.
   *
   * This will stop and remove all the ensemble containers and networks. If
   * the ensemble is already started, this is a no-op.
   *
   * @returns A promise that resolves when the ensemble has started.
   */
  async stop(): Promise<void> {
    if (!this.started) {
      return;
    }

    // Services are started sequentially in reverse order to avoid stopping a
    // service that is depended on by another service.
    const serviceNames = Array.from(this._services.keys());
    for (let i = serviceNames.length - 1; i >= 0; i--) {
      const name = serviceNames[i];
      const service = this._services.get(name);
      if (!service) {
        continue;
      }

      await service.stop();
    }

    // // Stop all the networks sequentially in reverse order.
    const networkNames = Array.from(this._networks.keys());
    for (let i = networkNames.length - 1; i >= 0; i--) {
      const name = networkNames[i];
      const network = this._networks.get(name);
      if (!network) {
        continue;
      }

      await network.stop();
    }

    this.started = false;
  }
}
