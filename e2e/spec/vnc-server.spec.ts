import { expect, test } from '@playwright/test';
import {
  VncServerContainer,
  Wait as Wait2,
} from '@testlib/fixtures/vnc-server';
import { Wait } from 'testcontainers';

test.beforeAll(async () => {
  // Build the VNC server image, if it does not exist
  await VncServerContainer.buildImage();
});

test.describe('VNC server fixture @smoke', () => {
  test('should wait for all processes to start', async () => {
    /// When
    const vncServer = await new VncServerContainer()
      .withExposedPorts(
        5900, // VNC
        9090 // Supervisord
      )
      .withWaitStrategy(
        Wait.forAll([
          Wait.forListeningPorts(),
          Wait2.forSupervisor(9090),
          Wait2.forSupervisorProcesses(
            9090,
            'xvfb',
            'pulseaudio',
            'x11vnc',
            'fluxbox'
          ),
        ])
      )
      .start();

    /// Then
    expect(vncServer.getId()).not.toBeFalsy();

    /// Cleanup
    await vncServer.stop();
  });
});
