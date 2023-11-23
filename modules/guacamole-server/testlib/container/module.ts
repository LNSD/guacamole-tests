import { AbstractStartedContainer, GenericContainer } from 'testcontainers';

/**
 * The official _Guacamole server (guacd)_ image.
 *
 * @see https://hub.docker.com/r/guacamole/guacd
 */
export const GUACAMOLE_SERVER_IMAGE = 'guacamole/guacd';

/**
 * A  _Guacamole server (guacd)_ container.
 *
 * @example Create a container with the latest version of the image
 * ```typescript
 * const container = new GuacdContainer().start();
 * ```
 *
 * @example Create a container with a specific version of the image
 * ```typescript
 * const container = new GuacdContainer(`${GUACAMOLE_SERVER_IMAGE}:1.5.3').start();
 * ```
 *
 * By default, the official image's latest version is used.
 */
export class GuacdContainer extends GenericContainer {
  constructor(imageTag = GUACAMOLE_SERVER_IMAGE) {
    super(imageTag);
  }

  /**
   * Start the container.
   *
   * @returns A promise that resolves to a {@link GuacdStartedContainer}.
   */
  public override async start() {
    return new GuacdStartedContainer(await super.start());
  }
}

/**
 * A _Guacamole server_ started container.
 */
export class GuacdStartedContainer extends AbstractStartedContainer {}
