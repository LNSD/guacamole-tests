import {
  AbstractWaitStrategy,
  WaitStrategy,
} from 'testcontainers/build/wait-strategies/wait-strategy';
import { BoundPorts } from 'testcontainers/build/utils/bound-ports';
import { log } from 'testcontainers';
import { getContainerRuntimeClient } from 'testcontainers/build/container-runtime';
import {
  Client,
  ProcessInfo,
  ProcessState,
  SupervisorState,
} from '../../supervisord';
import type Dockerode from 'dockerode';
import { IntervalRetry } from 'testcontainers/build/common';

/**
 * Wait strategy that waits until supervisord is in the {@link SupervisorState.RUNNING} state.
 */
export class SupervisordRunningWaitStrategy extends AbstractWaitStrategy {
  private retryInterval = 500;

  constructor(private readonly port: number) {
    super();
  }

  /**
   * Set the interval between each attempt to check if the container is ready.
   *
   * The default value is 500 milliseconds.
   *
   * @param retryInterval - The interval (in milliseconds)
   */
  public withRetryInterval(retryInterval: number): this {
    this.retryInterval = retryInterval;
    return this;
  }

  public async waitUntilReady(
    container: Dockerode.Container,
    boundPorts: BoundPorts
  ): Promise<void> {
    log.debug('Waiting for supervisord to be running');
    const containerRuntimeClient = await getContainerRuntimeClient();

    const client = new Client(
      containerRuntimeClient.info.containerRuntime.host,
      boundPorts.getBinding(this.port)
    );

    // Wait for supervisord to be RUNNING
    await new IntervalRetry<SupervisorState | null, Error>(
      this.retryInterval
    ).retryUntil(
      async () => {
        try {
          return await client.getState();
        } catch {
          return null;
        }
      },
      (response) => {
        return response === SupervisorState.RUNNING;
      },
      () => {
        const message = `Supervisord is not running after ${this.startupTimeout}ms`;
        log.error(message, { containerId: container.id });
        throw new Error(message);
      },
      this.startupTimeout
    );

    log.debug('Supervisord is running', { containerId: container.id });
  }
}

/**
 * Wait strategy that waits until supervisord processes are in the {@link ProcessState.RUNNING} state.
 */
export class SupervisordProcessesRunningWaitStrategy extends AbstractWaitStrategy {
  private readonly port: number;
  private readonly processNames: string[];
  private retryInterval = 500;

  constructor(port: number, ...processNames: string[]) {
    super();
    if (processNames.length === 0) {
      throw new Error('At least one process name must be specified');
    }

    this.port = port;
    this.processNames = processNames;
  }

  /**
   * Set the interval between each attempt to check if the container is ready.
   *
   * The default value is 500 milliseconds.
   *
   * @param retryInterval - The interval (in milliseconds)
   */
  public withRetryInterval(retryInterval: number): this {
    this.retryInterval = retryInterval;
    return this;
  }

  public async waitUntilReady(
    container: Dockerode.Container,
    boundPorts: BoundPorts
  ): Promise<void> {
    log.debug('Waiting for supervisord services to be running');
    const containerRuntimeClient = await getContainerRuntimeClient();

    const client = new Client(
      containerRuntimeClient.info.containerRuntime.host,
      boundPorts.getBinding(this.port)
    );

    // Wait for supervisord processes to be RUNNING
    await new IntervalRetry<ProcessInfo[] | null, Error>(
      this.retryInterval
    ).retryUntil(
      async () => {
        try {
          return await client.getAllProcessInfo();
        } catch {
          return null;
        }
      },
      (response) => {
        if (response === null) {
          return false;
        }

        return response
          .filter((processInfo) => this.processNames.includes(processInfo.name))
          .every((processInfo) => {
            return processInfo.state === ProcessState.RUNNING;
          });
      },
      () => {
        const message = `Supervisord services not running after ${this.startupTimeout}ms`;
        log.error(message, { containerId: container.id });
        throw new Error(message);
      },
      this.startupTimeout
    );

    log.debug('Supervisord processes running', {
      containerId: container.id,
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Wait {
  /**
   * Wait for supervisord to be running.
   *
   * @param port - Supervisord RPC port
   */
  public static forSupervisor(port: number): WaitStrategy {
    return new SupervisordRunningWaitStrategy(port);
  }

  /**
   * Wait for supervisord processes to be running.
   *
   * @param port - Supervisord RPC port
   * @param process - A list of process names to wait for
   */
  public static forSupervisorProcesses(
    port: number,
    ...process: string[]
  ): WaitStrategy {
    return new SupervisordProcessesRunningWaitStrategy(port, ...process);
  }
}
