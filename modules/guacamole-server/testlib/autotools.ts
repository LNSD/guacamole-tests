import { Command, CommandOutput, CommandRunner } from './command';

/**
 * Configuration for the configure script.
 */
export interface AutotoolsConfig {
  /**
   * Build the Guacamole proxy daemon.
   */
  guacd?: boolean;
  /**
   * Build the Guacamole video encoding tool.
   */
  guacenc?: boolean;
  /**
   * Build the Guacamole input logging tool.
   */
  guaclog?: boolean;
  /**
   * Build the support for attaching to Kubernetes pods.
   */
  kubernetes?: boolean;
  /**
   * Use libuuid to generate unique identifiers.
   */
  libuuid?: boolean;
  /**
   * Use libavcodec when encoding video.
   */
  libavcodec?: boolean;
  /**
   * Use libavformat when encoding video.
   */
  libavformat?: boolean;
  /**
   * Use libavutil when encoding video.
   */
  libavutil?: boolean;
  /**
   * Use libswscale when encoding video.
   */
  libswscale?: boolean;
  /**
   * Support SSL encryption.
   */
  ssl?: boolean;
  /**
   * Support Windows Sockets API.
   */
  winsock?: boolean;
  /**
   * Support Ogg Vorbis.
   */
  vorbis?: boolean;
  /**
   * Support PulseAudio.
   */
  pulse?: boolean;
  /**
   * Support Pango text layout.
   */
  pango?: boolean;
  /**
   * Support text-based protocols.
   */
  terminal?: boolean;
  /**
   * Support VNC.
   */
  vnc?: boolean;
  /**
   * Support RDP.
   */
  rdp?: boolean;
  /**
   * Install FreeRDP plugins to the given directory.
   */
  freeRdpPluginDir?: string;
  /**
   * Allow building against unknown development snapshots of FreeRDP.
   */
  allowFreeRdpSnapshots?: boolean;
  /**
   * Support SSH.
   */
  ssh?: boolean;
  /**
   * Enable built-in ssh-agent.
   */
  sshAgent?: boolean;
  /**
   * Support Telnet.
   */
  telnet?: boolean;
  /**
   * Support WebP image encoding.
   */
  webp?: boolean;
  /**
   * Support WebSockets.
   */
  websockets?: boolean;
}

/**
 * Convert the given config into a list of arguments to pass to configure.
 *
 * @param config - The config to enableconvert.
 */
function intoArgs(config?: Partial<AutotoolsConfig>): string[] {
  const args: string[] = [];
  if (!config?.guacd) {
    args.push('--disable-guacd');
  }
  if (!config?.guacenc) {
    args.push('--disable-guacenc');
  }
  if (!config?.guaclog) {
    args.push('--disable-guaclog');
  }
  if (!config?.kubernetes) {
    args.push('--disable-kubernetes');
  }
  if (config?.libuuid) {
    args.push('--with-libuuid');
  }
  if (config?.libavcodec) {
    args.push('--with-libavcodec');
  }
  if (config?.libavformat) {
    args.push('--with-libavformat');
  }
  if (config?.libavutil) {
    args.push('--with-libavutil');
  }
  if (config?.libswscale) {
    args.push('--with-libswscale');
  }
  if (config?.ssl) {
    args.push('--with-ssl');
  }
  if (config?.winsock) {
    args.push('--with-winsock');
  }
  if (config?.vorbis) {
    args.push('--with-vorbis');
  }
  if (config?.pulse) {
    args.push('--with-pulse');
  }
  if (config?.pango) {
    args.push('--with-pango');
  }
  if (config?.terminal) {
    args.push('--with-terminal');
  }
  if (config?.vnc) {
    args.push('--with-vnc');
  }
  if (config?.rdp) {
    args.push('--with-rdp');
  }
  if (config?.freeRdpPluginDir) {
    args.push(`--with-freerdp-plugins=${config.freeRdpPluginDir}`);
  }
  if (config?.allowFreeRdpSnapshots) {
    args.push('--enable-freerdp-snapshots');
  }
  if (config?.ssh) {
    args.push('--with-ssh');
  }
  if (config?.sshAgent) {
    args.push('--enable-ssh-agent');
  }
  if (config?.telnet) {
    args.push('--with-telnet');
  }
  if (config?.webp) {
    args.push('--with-webp');
  }
  if (config?.websockets) {
    args.push('--with-websockets');
  }

  return args;
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
