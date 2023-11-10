import { Command, CommandOutput, CommandRunner } from './command';

/**
 * Git clone command.
 *
 * Runs `git clone` in the given directory.
 */
export class GitClone implements Command {
  /**\
   * @param repoUrl - The URL of the repository to clone.
   * @param branch - The branch to clone.
   * @param workingDir - The directory to clone into.
   */
  constructor(
    private readonly repoUrl: string,
    private readonly branch = 'master',
    private readonly workingDir?: string
  ) {}

  async exec(runner: CommandRunner): Promise<CommandOutput> {
    const command = [
      'git',
      'clone',
      '--branch',
      this.branch,
      '--single-branch',
      this.repoUrl,
      '--depth',
      '1',
      ...(this.workingDir ?? []),
    ];

    return await runner.exec(command);
  }

  public toString(): string {
    return `git clone`;
  }
}
