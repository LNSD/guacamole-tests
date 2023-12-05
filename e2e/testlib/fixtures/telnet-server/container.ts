import path from 'path';
import { AbstractStartedContainer, GenericContainer } from 'testcontainers';
import {
  getContainerRuntimeClient,
  ImageName,
} from 'testcontainers/build/container-runtime';

const CONTEXT_PATH = path.join(__dirname, 'assets');

/**
 * The name of the Telnet server fixture image.
 */
export const TELNET_SERVER_IMAGE = 'telnet-server';

/**
 * A container that runs a Telnet server.
 *
 * @example Build and create a container with the latest version of the image
 * ```typescript
 * await TelnetServerContainer.buildImage();
 * const container = new TelnetServerContainer().start();
 * ```
 *
 * @example Build and Create a container with a specific version of the image
 * ```typescript
 * await TelnetServerContainer.buildImage(`${TELNET_SERVER_IMAGE}:1.0.0`);
 * const container = new TelnetServerContainer(`${TELNET_SERVER_IMAGE}:1.0.0').start();
 * ```
 *
 * The image must be built before the container can be created. If the image
 * does not exist, it will fail to create and start the container.
 */
export class TelnetServerContainer extends GenericContainer {
  /**
   * Build the Telnet server image.
   *
   * This builds the image with the tag `vnc-server:latest` by default. If the
   * image already exists, it will not be rebuilt unless the `force` parameter
   * is set to `true`.
   *
   * @param tag - The tag to set to the image.
   * @param force - Whether to force the image to be built, even if it already
   *                exists.
   */
  public static async buildImage(
    tag = `${TELNET_SERVER_IMAGE}:latest`,
    force = false
  ): Promise<void> {
    if (!force) {
      const client = await getContainerRuntimeClient();
      const imageName = ImageName.fromString(tag);

      // Avoid building the image if it already exists
      if (await client.image.exists(imageName)) {
        return;
      }
    }

    // Build
    await GenericContainer.fromDockerfile(CONTEXT_PATH).build(tag, {
      deleteOnExit: false,
    });
  }

  constructor(image = `${TELNET_SERVER_IMAGE}:latest`) {
    super(image);

    // Default configuration
    this.withBindMounts([
      { source: '/etc/localtime', target: '/etc/localtime', mode: 'ro' },
    ]);
  }

  /**
   * Start the container.
   *
   * @returns A promise that resolves to a started container.
   */
  public override async start(): Promise<TelnetServerStartedContainer> {
    return new TelnetServerStartedContainer(await super.start());
  }
}

export class TelnetServerStartedContainer extends AbstractStartedContainer {}
