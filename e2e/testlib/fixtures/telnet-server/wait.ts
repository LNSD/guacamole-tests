import {
  AbstractWaitStrategy,
  WaitStrategy,
} from 'testcontainers/build/wait-strategies/wait-strategy';
import { BoundPorts } from 'testcontainers/build/utils/bound-ports';
import { log } from 'testcontainers';
import { getContainerRuntimeClient } from 'testcontainers/build/container-runtime';
import type Dockerode from 'dockerode';
import { IntervalRetry } from 'testcontainers/build/common';
import { ConnectOptions, Telnet } from 'telnet-client';

/**
 * Wait strategy that waits until Telnet server is listening.
 */
export class TelnetServerListeningWaitStrategy extends AbstractWaitStrategy {
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

    // these parameters are just examples and most probably won't work for your use-case.
    const params: ConnectOptions = {
      host: containerRuntimeClient.info.containerRuntime.host,
      port: boundPorts.getBinding(this.port),
      shellPrompt: '/ # ',
      timeout: this.retryInterval,
    };

    // Wait for supervisord to be RUNNING
    await new IntervalRetry<boolean | null, Error>(
      this.retryInterval
    ).retryUntil(
      async () => {
        const connection = new Telnet();

        try {
          await connection.connect(params);
        } catch (error) {
          return null;
        }

        return true;
      },
      (response) => {
        return response === true;
      },
      () => {
        const message = `Telnet server is not running after ${this.startupTimeout}ms`;
        log.error(message, { containerId: container.id });
        throw new Error(message);
      },
      this.startupTimeout
    );

    log.debug('Telnet server is running', { containerId: container.id });
  }
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Wait {
  /**
   * Wait for Telnet server to be runnSupervisordRunningWaitStrategying.
   *
   * @param port - Telnet port
   */
  public static forTelnetServer(port: number): WaitStrategy {
    return new TelnetServerListeningWaitStrategy(port);
  }
}
