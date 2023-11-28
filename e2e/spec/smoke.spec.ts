import {
  GuacamoleStartedEnsemble,
  GuacamoleEnsemble,
} from '@testlib/guacamole';

jest.setTimeout(120_000); // 120 seconds

describe('Guacamole ensemble start and stop', () => {
  let ensemble: GuacamoleStartedEnsemble;

  it('should start the ensemble', async () => {
    /// When
    ensemble = await new GuacamoleEnsemble()
      .withDefaultNetworks()
      .withDefaultServices()
      .start();

    /// Then
    expect(ensemble.isStarted()).toBe(true);
  });

  it('should stop the ensemble', async () => {
    /// When
    await ensemble.stop();

    /// Then
    expect(ensemble.isStarted()).toBe(false);
  });
});
