import { Wait } from 'testcontainers';
import { v4 as uuid } from 'uuid';
import { GuacdContainer } from '@testlib/container';

jest.setTimeout(120_000); // 2 minutes

describe('Guacamole server (guacd) container', () => {
  it('should be able start a container', async () => {
    /// Given
    const containerName = `guac-server-${uuid()}`;

    const guacd = new GuacdContainer()
      .withName(containerName)
      .withExposedPorts(4822)
      .withWaitStrategy(Wait.forListeningPorts());

    /// When
    const container = await guacd.start();

    /// Then
    expect(container.getName()).toContain(containerName);

    /// Cleanup
    await container.stop();
  });
});
