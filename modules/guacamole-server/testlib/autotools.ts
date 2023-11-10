import { Command, CommandOutput, CommandRunner } from './command';

/**
 * Configuration for the configure script.
 */
export interface AutotoolsConfig {
  options: string[];
}

/**
 * Convert the given config into a list of arguments to pass to configure.
 *
 * @param config - The config to convert.
 */
function intoArgs(config?: Partial<AutotoolsConfig>): string[] {
  return [...(config?.options ?? [])];
}

/**
 * Autotools configure command.
 *
 * 1. Runs `autoreconf` to generate the configure script.
 * 2. Runs the `./configure` script with the given config.
 */
export class Configure implements Command {
  /**
   * @param workingDir - The directory containing the source code.
   * @param config - The configuration for the configure script.
   */
  constructor(
    private readonly workingDir: string,
    private readonly config?: Partial<AutotoolsConfig>
  ) {}

  public async exec(runner: CommandRunner): Promise<CommandOutput> {
    let output = '';

    // Run autoreconf to generate the configure script
    const { output: autoreconfOutput, exitCode: autoreconfExitCode } =
      await runner.exec(['autoreconf', '-fi'], {
        workingDir: this.workingDir,
      });
    if (autoreconfExitCode !== 0) {
      return {
        exitCode: autoreconfExitCode,
        output: autoreconfOutput,
      };
    }
    output += autoreconfOutput;

    // Run configure script
    const { output: configureOutput, exitCode: configureExitCode } =
      await runner.exec(['./configure', ...intoArgs(this.config)], {
        workingDir: this.workingDir,
      });
    if (configureExitCode !== 0) {
      return {
        exitCode: configureExitCode,
        output: configureOutput,
      };
    }
    output += configureOutput;

    return {
      exitCode: 0,
      output,
    };
  }

  public toString(): string {
    return `autotools configure`;
  }
}

/**
 * Autotools compile command.
 *
 * Runs `make` in the given directory.
 */
export class Compile implements Command {
  /**
   * @param workingDir - The directory containing the source code.
   */
  constructor(private readonly workingDir: string) {}

  exec(runner: CommandRunner): Promise<CommandOutput> {
    return runner.exec(['make'], {
      workingDir: this.workingDir,
    });
  }

  public toString(): string {
    return `autotools compile`;
  }
}
