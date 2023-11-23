import { GuacClientContainer, UserMappingXmlAuth } from '@testlib/container';
import { Wait } from 'testcontainers';
import { renderUserMappingConf } from '@testlib/config';
import { v4 as uuid } from 'uuid';

jest.setTimeout(120_000); // 2 minutes

describe('Guacamole client container', () => {
  it('should be able start a Guacamole client container', async () => {
    /// Given
    const authConf = await renderUserMappingConf([]);
    const containerName = `guac-client-${uuid()}`;

    const guacamoleClient = new GuacClientContainer()
      .withName(containerName)
      .withAuthConfiguration(new UserMappingXmlAuth(authConf))
      .withExposedPorts(8080)
      .withWaitStrategy(Wait.forHttp('/guacamole', 8080));

    /// When
    const container = await guacamoleClient.start();

    /// Then
    expect(container.getName()).toBeDefined();

    /// Cleanup
    await container.stop();
  });
});
