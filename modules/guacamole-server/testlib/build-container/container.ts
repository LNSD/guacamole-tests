import { AbstractStartedContainer, GenericContainer } from 'testcontainers';
import tar from 'tar-stream';
import { DockerfileParams, renderDockerfile } from './template';
import { Command, CommandRunner } from '../command';

export class GuacServerBuilderContainer extends GenericContainer {
  public static async fromDockerfileTemplate(
    params: DockerfileParams
  ): Promise<GuacServerBuilderContainer> {
    const imageTag = `guacamole-server-builder:${params.buildSystem}-ubuntu-lts`;

    // Generate the Dockerfile and the context
    const dockerfile = await renderDockerfile(params);
    console.debug(dockerfile); // TODO: Add logging framework

    const dockerContext = tar.pack();
    dockerContext.entry({ name: 'Dockerfile' }, dockerfile);
    dockerContext.finalize();

    // Build the image
    await GenericContainer.fromContextArchive(dockerContext).build(imageTag, {
      deleteOnExit: false,
    });

    // Create the container
    return new GuacServerBuilderContainer(imageTag);
  }

  public override async start(): Promise<StartedGuacServerBuilderContainer> {
    return new StartedGuacServerBuilderContainer(await super.start());
  }
}

export class StartedGuacServerBuilderContainer
  extends AbstractStartedContainer
  implements CommandRunner
{
  public async run(cmd: Command): Promise<string> {
    const { output, exitCode } = await cmd.exec(this);
    if (exitCode !== 0) {
      console.debug(output);
      throw new Error('Command failed');
    }

    return output;
  }
}
