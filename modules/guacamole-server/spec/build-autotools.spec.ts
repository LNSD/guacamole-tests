import { newBuilder } from '@testlib/build-container';
import { Compile, Configure } from '@testlib/autotools';
import { GitClone } from '@testlib/git';

const GUAC_SERVER_GIT_FORK_URL = 'https://github.com/LNSD/guacamole-server.git';

// Set the default timeout interval (in milliseconds) for all spec and
// before/after hooks in this test file.
jest.setTimeout(120_000); // 120 seconds

describe('autotools build system', () => {
  it('should build guacamole-server from sources', async () => {
    /// Given
    const builder = await newBuilder({
      buildSystem: 'autotools',
      buildDeps: [
        'libpng-dev',
        'libjpeg-turbo8-dev',
        'libcairo2-dev',
        'uuid-dev',
      ],
    });
    await builder.run(new GitClone(GUAC_SERVER_GIT_FORK_URL, 'master'));

    /// When
    await builder.run(new Configure('/build/guacamole-server'));
    await builder.run(new Compile('/build/guacamole-server'));

    /// Cleanup
    await builder.stop();
  });
});
