export interface CommandRunner {
  exec(
    command: string[],
    options?: { workingDir?: string }
  ): Promise<{ output: string; exitCode: number }>;
}

export interface CommandOutput {
  output: string;
  exitCode: number;
}

export interface Command {
  exec(runner: CommandRunner): Promise<CommandOutput>;
}
