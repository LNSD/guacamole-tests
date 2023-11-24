import path from 'path';
import { AbstractStartedContainer, GenericContainer } from 'testcontainers';
import {
  getContainerRuntimeClient,
  ImageName,
} from 'testcontainers/build/container-runtime';

const CONTEXT_PATH = path.join(__dirname, 'assets');

/**
 * The name of the VNC server fixture image.
 */
export const VNC_SERVER_IMAGE = 'vnc-server';

/**
 * A container that runs a VNC server.
 *
 * @example Build and create a container with the latest version of the image
 * ```typescript
 * await VncServerContainer.buildImage();
 * const container = new VncServerContainer().start();
 * ```
 *
 * @example Build and Create a container with a specific version of the image
 * ```typescript
 * await VncServerContainer.buildImage(`${VNC_SERVER_IMAGE}:1.0.0`);
 * const container = new VncServerContainer(`${VNC_SERVER_IMAGE}:1.0.0').start();
 * ```
 *
 * The image must be built before the container can be created. If the image
 * does not exist, it will fail to create and start the container.
 */
export class VncServerContainer extends GenericContainer {
  /**
   * Build the VNC server image.
   *
   * @param tag - The tag to set to the image.
   * @param force - Whether to force the image to be built, even if it already
   *                exists.
   */
  public static async buildImage(
    tag = `${VNC_SERVER_IMAGE}:latest`,
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

  constructor(image = `${VNC_SERVER_IMAGE}:latest`) {
    super(image);

    // Default configuration
    this.withBindMounts([
      { source: '/etc/localtime', target: '/etc/localtime', mode: 'ro' },
    ]);
    this.withSharedMemorySize(1024 * 1024 * 1024); // 1GB
  }

  /**
   * Start the container.
   *
   * @returns A promise that resolves to a started container.
   */
  public override async start(): Promise<VncServerStartedContainer> {
    return new VncServerStartedContainer(await super.start());
  }
}

export class VncServerStartedContainer extends AbstractStartedContainer {}
