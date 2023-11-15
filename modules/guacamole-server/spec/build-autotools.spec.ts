import { newBuilder } from '@testlib/build-container';
import { AutotoolsConfig, Compile, Configure } from '@testlib/autotools';
import { GitClone } from '@testlib/git';

const GUAC_SERVER_GIT_REPO_URL =
  'https://github.com/apache/guacamole-server.git';

// Set the default timeout interval (in milliseconds) for all spec and
// before/after hooks in this test file.
jest.setTimeout(120_000); // 120 seconds

describe('autotools build system', () => {
  it('should configure and build guacd', async () => {
    /// Given
    const builder = await newBuilder({
      buildSystem: 'autotools',
      buildDeps: ['libpng-dev', 'libjpeg-turbo8-dev', 'libcairo2-dev'],
    });
    await builder.run(new GitClone(GUAC_SERVER_GIT_REPO_URL, 'master'));

    /// When
    const config: AutotoolsConfig = { guacd: true };
    let configOutput = await builder.run(
      new Configure('/build/guacamole-server', config)
    );

    await builder.run(new Compile('/build/guacamole-server'));

    /// Then
    // Assert that guacd build is enabled
    expect(configOutput).toMatch(/guacd .+ yes/);
    // TODO: Assert that guacd binary exists

    /// Cleanup
    await builder.stop();
  });

  it('should configure and build guacd with libuuid support', async () => {
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
    await builder.run(new GitClone(GUAC_SERVER_GIT_REPO_URL, 'master'));

    /// When
    const config: AutotoolsConfig = {
      guacd: true,
      libuuid: true,
    };
    let configureOutput = await builder.run(
      new Configure('/build/guacamole-server', config)
    );

    await builder.run(new Compile('/build/guacamole-server'));

    /// Then
    // Assert that guacd build is enabled
    expect(configureOutput).toMatch(/guacd .+ yes/);
    expect(configureOutput).toMatch(/-luuid.+ yes/);
    // TODO: Assert that guacd binary exists

    /// Cleanup
    await builder.stop();
  });

  it('should configure and build guacd with WebP support', async () => {
    /// Given
    const builder = await newBuilder({
      buildSystem: 'autotools',
      buildDeps: [
        'libpng-dev',
        'libjpeg-turbo8-dev',
        'libcairo2-dev',
        'libwebp-dev',
      ],
    });
    await builder.run(new GitClone(GUAC_SERVER_GIT_REPO_URL, 'master'));

    /// When
    const config: AutotoolsConfig = {
      guacd: true,
      webp: true,
    };
    let configureOutput = await builder.run(
      new Configure('/build/guacamole-server', config)
    );

    await builder.run(new Compile('/build/guacamole-server'));

    /// Then
    // Assert that guacd build is enabled
    expect(configureOutput).toMatch(/guacd .+ yes/);
    expect(configureOutput).toMatch(/libwebp .+ yes/);
    // TODO: Assert that guacd binary exists

    /// Cleanup
    await builder.stop();
  });

  it('should configure and build guacd with PulseAudio support', async () => {
    /// Given
    const builder = await newBuilder({
      buildSystem: 'autotools',
      buildDeps: [
        'libpng-dev',
        'libjpeg-turbo8-dev',
        'libcairo2-dev',
        'libpulse-dev',
      ],
    });
    await builder.run(new GitClone(GUAC_SERVER_GIT_REPO_URL, 'master'));

    /// When
    const config: AutotoolsConfig = {
      guacd: true,
      pulse: true,
    };
    let configureOutput = await builder.run(
      new Configure('/build/guacamole-server', config)
    );

    await builder.run(new Compile('/build/guacamole-server'));

    /// Then
    // Assert that guacd build is enabled
    expect(configureOutput).toMatch(/guacd .+ yes/);
    expect(configureOutput).toMatch(/libpulse .+ yes/);
    // TODO: Assert that guacd binary exists

    /// Cleanup
    await builder.stop();
  });

  it('should configure and build guacd with Vorbis support', async () => {
    /// Given
    const builder = await newBuilder({
      buildSystem: 'autotools',
      buildDeps: [
        'libpng-dev',
        'libjpeg-turbo8-dev',
        'libcairo2-dev',
        'libvorbis-dev',
      ],
    });
    await builder.run(new GitClone(GUAC_SERVER_GIT_REPO_URL, 'master'));

    /// When
    const config: AutotoolsConfig = {
      guacd: true,
      vorbis: true,
    };
    let configureOutput = await builder.run(
      new Configure('/build/guacamole-server', config)
    );

    await builder.run(new Compile('/build/guacamole-server'));

    /// Then
    // Assert that guacd build is enabled
    expect(configureOutput).toMatch(/guacd .+ yes/);
    expect(configureOutput).toMatch(/vorbis .+ yes/);
    // TODO: Assert that guacd binary exists

    /// Cleanup
    await builder.stop();
  });

  it('should configure and build guacd with Telnet support', async () => {
    /// Given
    const builder = await newBuilder({
      buildSystem: 'autotools',
      buildDeps: [
        'libpng-dev',
        'libjpeg-turbo8-dev',
        'libcairo2-dev',
        'libpango1.0-dev',
        'libtelnet-dev',
      ],
    });
    await builder.run(new GitClone(GUAC_SERVER_GIT_REPO_URL, 'master'));

    /// When
    const config: AutotoolsConfig = {
      guacd: true,
      telnet: true,
    };
    let configureOutput = await builder.run(
      new Configure('/build/guacamole-server', config)
    );

    await builder.run(new Compile('/build/guacamole-server'));

    /// Then
    // Assert that guacd build is enabled
    expect(configureOutput).toMatch(/guacd .+ yes/);
    expect(configureOutput).toMatch(/Telnet .+ yes/);
    // TODO: Assert that guacd binary exists

    /// Cleanup
    await builder.stop();
  });

  it('should configure and build guacd with SSH support', async () => {
    /// Given
    const builder = await newBuilder({
      buildSystem: 'autotools',
      buildDeps: [
        'libpng-dev',
        'libjpeg-turbo8-dev',
        'libcairo2-dev',
        'libpango1.0-dev',
        'libssl-dev',
        'libssh2-1-dev',
      ],
    });
    await builder.run(new GitClone(GUAC_SERVER_GIT_REPO_URL, 'master'));

    /// When
    const config: AutotoolsConfig = { guacd: true, ssh: true };
    let configureOutput = await builder.run(
      new Configure('/build/guacamole-server', config)
    );

    await builder.run(new Compile('/build/guacamole-server'));

    /// Then
    // Assert that guacd build is enabled
    expect(configureOutput).toMatch(/guacd .+ yes/);
    expect(configureOutput).toMatch(/SSH .+ yes/);
    // TODO: Assert that guacd binary exists

    /// Cleanup
    await builder.stop();
  });

  it('should configure and build guacd with Kubernetes support', async () => {
    /// Given
    const builder = await newBuilder({
      buildSystem: 'autotools',
      buildDeps: [
        'libpng-dev',
        'libjpeg-turbo8-dev',
        'libcairo2-dev',
        'libssl-dev',
        'libpango1.0-dev',
        'libwebsockets-dev',
      ],
    });
    await builder.run(new GitClone(GUAC_SERVER_GIT_REPO_URL, 'master'));

    /// When
    const config: AutotoolsConfig = {
      guacd: true,
      kubernetes: true,
    };
    let configOutput = await builder.run(
      new Configure('/build/guacamole-server', config)
    );

    await builder.run(new Compile('/build/guacamole-server'));

    /// Then
    // Assert that guacd build is enabled
    expect(configOutput).toMatch(/guacd .+ yes/);
    expect(configOutput).toMatch(/Kubernetes .+ yes/);
    // TODO: Assert that guacd binary exists

    /// Cleanup
    await builder.stop();
  });

  it('should configure and build guacd with VNC support', async () => {
    /// Given
    const builder = await newBuilder({
      buildSystem: 'autotools',
      buildDeps: [
        'libpng-dev',
        'libjpeg-turbo8-dev',
        'libcairo2-dev',
        'libvncserver-dev',
      ],
    });
    await builder.run(new GitClone(GUAC_SERVER_GIT_REPO_URL, 'master'));

    /// When
    const config: AutotoolsConfig = { guacd: true, vnc: true };
    let configOutput = await builder.run(
      new Configure('/build/guacamole-server', config)
    );

    await builder.run(new Compile('/build/guacamole-server'));

    /// Then
    // Assert that guacd build is enabled
    expect(configOutput).toMatch(/guacd .+ yes/);
    expect(configOutput).toMatch(/VNC .+ yes/);
    // TODO: Assert that guacd binary exists

    /// Cleanup
    await builder.stop();
  });

  it('should configure and build guacd with RDP support', async () => {
    /// Given
    const builder = await newBuilder({
      buildSystem: 'autotools',
      buildDeps: [
        'libpng-dev',
        'libjpeg-turbo8-dev',
        'libcairo2-dev',
        'freerdp2-dev',
      ],
    });
    await builder.run(new GitClone(GUAC_SERVER_GIT_REPO_URL, 'master'));

    /// When
    const config: AutotoolsConfig = { guacd: true, vnc: true };
    let configOutput = await builder.run(
      new Configure('/build/guacamole-server', config)
    );

    await builder.run(new Compile('/build/guacamole-server'));

    /// Then
    // Assert that guacd build is enabled
    expect(configOutput).toMatch(/guacd .+ yes/);
    expect(configOutput).toMatch(/RDP .+ yes/);
    // TODO: Assert that guacd binary exists

    /// Cleanup
    await builder.stop();
  });

  it('should configure and build guaclog', async () => {
    /// Given
    const builder = await newBuilder({
      buildSystem: 'autotools',
      buildDeps: ['libpng-dev', 'libjpeg-turbo8-dev', 'libcairo2-dev'],
    });
    await builder.run(new GitClone(GUAC_SERVER_GIT_REPO_URL, 'master'));

    /// When
    const config: AutotoolsConfig = { guaclog: true };
    let configureOutput = await builder.run(
      new Configure('/build/guacamole-server', config)
    );

    await builder.run(new Compile('/build/guacamole-server'));

    /// Then
    // Assert that guaclog build is enabled
    expect(configureOutput).toMatch(/guaclog .+ yes/);
    // TODO: Assert that guaclog binary exists

    /// Cleanup
    await builder.stop();
  });

  it('should configure and build guacenc', async () => {
    /// Given
    const builder = await newBuilder({
      buildSystem: 'autotools',
      buildDeps: [
        'libpng-dev',
        'libjpeg-turbo8-dev',
        'libcairo2-dev',
        'libavcodec-dev',
        'libavformat-dev',
        'libavutil-dev',
        'libswscale-dev',
      ],
    });
    await builder.run(new GitClone(GUAC_SERVER_GIT_REPO_URL, 'master'));

    /// When
    const config: AutotoolsConfig = { guacenc: true };
    let configureOutput = await builder.run(
      new Configure('/build/guacamole-server', config)
    );

    await builder.run(new Compile('/build/guacamole-server'));

    /// Then
    // Assert that guacenc build is enabled
    expect(configureOutput).toMatch(/guacenc .+ yes/);
    // TODO: Assert that guacenc binary exists

    /// Cleanup
    await builder.stop();
  });
});
