import {
  GuacServerBuilderContainer,
  StartedGuacServerBuilderContainer,
} from './container';
import { DockerfileParams } from './template';

export { DockerfileParams } from './template';

export async function newBuilder(
  params: DockerfileParams
): Promise<StartedGuacServerBuilderContainer> {
  const container =
    await GuacServerBuilderContainer.fromDockerfileTemplate(params);
  return await container.start();
}
