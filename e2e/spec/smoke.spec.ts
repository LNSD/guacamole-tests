import { GuacamoleEnsemble } from '@testlib/guacamole';
import { Wait } from 'testcontainers';
import {
  VncServerContainer,
  Wait as Wait2,
} from '@testlib/fixtures/vnc-server';
import { StartedEnsemble } from '@testlib/ensemble';

jest.setTimeout(120_000); // 120 seconds

beforeAll(async () => {
  // Build the VNC server image, if it does not exist
  await VncServerContainer.buildImage();
});

describe('Guacamole ensemble start and stop', () => {
  let ensemble: StartedEnsemble;

  it('should start the ensemble', async () => {
    /// When
    ensemble = await new GuacamoleEnsemble()
      .withDefaultNetworks()
      .withDefaultServices()
      .withFixtureService((ensembleId, fixtureNetwork) => {
        const vncServer = new VncServerContainer()
          .withName(`vnc-server-${ensembleId}`)
          .withNetwork(fixtureNetwork)
          .withExposedPorts(
            5900, // VNC
            9090 // Supervisord
          )
          .withWaitStrategy(
            Wait.forAll([Wait.forListeningPorts(), Wait.forHttp('/', 9090)])
          );

        return ['vnc-server', vncServer];
      })
      .start();

    /// Then
    expect(ensemble.isStarted()).toBe(true);

    // Assert that the networks have been created
    for (const [, net] of ensemble.networks) {
      expect(net.getId()).not.toBeFalsy();
    }

    // Assert that the services have been created
    for (const [, service] of ensemble.services) {
      expect(service.getId()).not.toBeFalsy();
      expect(service.getNetworkNames()).not.toBe([]);
    }
  });

  it('should stop the ensemble', async () => {
    /// When
    await ensemble.stop();

    /// Then
    expect(ensemble.isStarted()).toBe(false);
  });
});

describe('VNC server fixture', () => {
  it('should wait for all processes to start', async () => {
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
            'fluxbox',
            'chrome'
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
