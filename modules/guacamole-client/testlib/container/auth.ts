import { TestContainer } from 'testcontainers';

/**
 * A guacamole client container authentication configuration.
 */
export interface AuthConfiguration {
  /**
   * Configures the container with the authentication configuration.
   * @param container - The container object to configure.
   */
  configure(container: TestContainer): void;
}

/**
 * User mapping authentication configuration.
 */
export class UserMappingXmlAuth implements AuthConfiguration {
  constructor(
    private readonly conf: string,
    private readonly home: string = '/etc/guacamole'
  ) {}

  configure(container: TestContainer) {
    container.withEnvironment({ GUACAMOLE_HOME: this.home });
    container.withCopyContentToContainer([
      {
        target: `${this.home}/user-mapping.xml`,
        content: this.conf,
      },
    ]);
  }

  /**
   * Returns a string representation of the configuration.
   */
  toString(): string {
    return this.conf;
  }
}
