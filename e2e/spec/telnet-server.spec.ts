import { expect, test } from '@playwright/test';
import {
  TelnetServerContainer,
  Wait as Wait2,
} from '@testlib/fixtures/telnet-server';
import { Wait } from 'testcontainers';

test.beforeAll(async () => {
  // Build the Telnet server image, if it does not exist
  await TelnetServerContainer.buildImage();
});

test.describe('Telnet server fixture @smoke', () => {
  test('should wait for server to start', async () => {
    /// When
    const telnetServer = await new TelnetServerContainer()
      .withExposedPorts(
        8023 // Telnetd
      )
      .withWaitStrategy(
        Wait.forAll([Wait.forListeningPorts(), Wait2.forTelnetServer(8023)])
      )
      .start();

    /// Then
    expect(telnetServer.getId()).not.toBeFalsy();

    /// Cleanup
    await telnetServer.stop();
  });
});
