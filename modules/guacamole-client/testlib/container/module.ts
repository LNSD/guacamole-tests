import { AbstractStartedContainer, GenericContainer } from 'testcontainers';
import { AuthConfiguration } from './auth';

/**
 * The official Guacamole client image.
 *
 * @see https://hub.docker.com/r/guacamole/guacamole
 */
export const GUACAMOLE_CLIENT_IMAGE = 'guacamole/guacamole';

export const DEFAULT_GUACAMOLE_HOME = '/etc/guacamole';

/**
 * The Guacamole client _guacd_ configuration.
 */
export interface GuacdConfiguration {
  /**
   * The _guacd_ hostname.
   */
  hostname: string;
  /**
   * The _guacd_ port.
   */
  port: number;
  /**
   * Whether to use SSL.
   */
  ssl: boolean;
}

/**
 * A  _Guacamole client_ container.
 *
 * @example Create a container with the latest version of the image
 * ```typescript
 * const container = new GuacClientContainer().start();
 * ```
 *
 * @example Create a container with a specific version of the image
 * ```typescript
 * const container = new GuacClientContainer(`${GUACAMOLE_CLIENT_IMAGE}:1.5.3').start();
 * ```
 *
 * By default, the official image's latest version is used.
 */
export class GuacClientContainer extends GenericContainer {
  private auth: boolean = false;
  private guacd: boolean = false;

  constructor(imageTag = GUACAMOLE_CLIENT_IMAGE) {
    super(imageTag);

    // Default configuration
    this.withGuacamoleHome(DEFAULT_GUACAMOLE_HOME);
  }

  /**
   * Set the home directory of the Guacamole client.
   *
   * Internally configures the container's `GUACAMOLE_HOME` environment variable.
   *
   * @param home - The home directory path.
   */
  public withGuacamoleHome(home: string): this {
    this.withEnvironment({ GUACAMOLE_HOME: home });
    return this;
  }

  /**
   * Set the authentication configuration of the Guacamole client.
   *
   * @param auth - The authentication configuration.
   */
  public withAuthConfiguration(auth: AuthConfiguration): this {
    auth.configure(this);

    this.auth = true;
    return this;
  }

  /**
   * Set the Guacamole daemon configuration of the Guacamole client.
   *
   * Defaults:
   * - `hostname`: `guac-proxy`
   * - `port`: `4822`
   * - `ssl`: `false`
   *
   * @param conf - The Guacamole daemon configuration.
   */
  public withGuacdConfiguration(conf?: Partial<GuacdConfiguration>): this {
    this.withEnvironment({
      GUACD_HOSTNAME: conf?.hostname ?? 'guac-proxy',
      GUACD_PORT: `${conf?.port ?? 4822}`,
      GUACD_SSL: `${conf?.ssl ?? false}`,
    });

    this.guacd = true;
    return this;
  }

  /**
   * Start the container.
   *
   * @returns A promise that resolves to a {@link GuacClientStartedContainer}.
   *
   * @throws {@link Error}
   * If no authentication configuration was provided.
   */
  public override async start() {
    // Auth configuration is required
    if (!this.auth) {
      throw new Error('No authentication configuration provided');
    }

    // If no guacd configuration was provided, use the default one
    if (!this.guacd) {
      this.withGuacdConfiguration();
    }

    return new GuacClientStartedContainer(await super.start());
  }
}

/**
 * A _Guacamole client_ started container.
 */
export class GuacClientStartedContainer extends AbstractStartedContainer {}
