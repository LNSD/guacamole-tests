import xmlrpc from 'xmlrpc';

function rpcCall<T>(
  client: xmlrpc.Client,
  method: string,
  ...params: unknown[]
): Promise<T> {
  return new Promise((resolve, reject) => {
    client.methodCall(method, params, (error, value) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (error) {
        reject(error);
      } else {
        resolve(value as T);
      }
    });
  });
}

/**
 * What Supervisord believes to be its current operational state.
 */
export const enum SupervisorState {
  /**
   * Supervisor is in the process of shutting down.
   */
  SHUTDOWN = -1,

  /**
   * Supervisor is in the process of restarting.
   */
  RESTARTING = 0,

  /**
   * Supervisor is working normally.
   */
  RUNNING = 1,

  /**
   * Supervisor has experienced a serious error.
   */
  FATAL = 2,
}

/**
 * A process controlled by supervisord will be in one of the below states at any given time. You may see these state
 * names in various user interface elements in clients.
 *
 * @see http://supervisord.org/subprocess.html#process-states
 */
export const enum ProcessState {
  /**
   * The process has been stopped due to a stop request or has never been started.
   */
  STOPPED = 0,

  /**
   * The process is starting due to a start request.
   */
  STARTING = 10,

  /**
   * The process is running.
   */
  RUNNING = 20,

  /**
   * The process is stopping due to a stop request.
   */
  BACKOFF = 30,

  /**
   * The process entered the {@link STARTING} state but subsequently exited too quickly (before the time defined in
   * `startsecs`) to move to the {@link RUNNING} state.
   */
  STOPPING = 40,

  /**
   * The process exited from the {@link RUNNING} state (expectedly or unexpectedly).
   * */
  EXITED = 100,

  /**
   * The process could not be started successfully.
   */
  FATAL = 200,

  /**
   * The process is an unknown state (supervisord programming error).
   */
  UNKNOWN = 1000,
}

/**
 * A structure containing data about a process.
 */
export interface ProcessInfo {
  /**
   * Name of the process.
   */
  name: string;

  /**
   * Name of the process' group.
   */
  group: string;

  /**
   * Process description.
   *
   * If the process state is `RUNNING`, this will be set to `process_id` and uptime. If process state is `STOPPED`,
   * this will be set to the stop time.
   */
  description: string;

  /**
   * UNIX timestamp of when the process was started.
   */
  start: number;

  /**
   * UNIX timestamp of when the process last ended, or 0 if the process has never been stopped.
   */
  stop: number;

  /**
   * UNIX timestamp of the current time, which can be used to calculate process uptime.
   */
  now: number;

  /**
   * Process state code.
   */
  state: ProcessState;

  /**
   * Process state name.
   */
  statename: keyof typeof ProcessState;

  /**
   * Absolute path and filename to the STDOUT logfile.
   */
  stdout_logfile: string;

  /**
   * Absolute path and filename to the STDERR logfile.
   */
  stderr_logfile: string;

  /**
   * Description of error that occurred during spawn, or empty string if none.
   */
  spawnerr: string;

  /**
   * Exit status (errorlevel) of process, or 0 if the process is still running.
   */
  exitstatus: number;

  /**
   * UNIX process ID (PID) of the process, or 0 if the process is not running.
   */
  pid: number;
}

/**
 * A client for the supervisord XML-RPC API.
 */
export class Client {
  private readonly client: xmlrpc.Client;

  constructor(host: string, port: number) {
    this.client = xmlrpc.createClient({
      host: host,
      port: port,
      path: '/RPC2',
    });
  }

  /**
   * Get the version of the RPC API used by supervisord.
   *
   * @returns The version of the RPC API used by supervisord.
   */
  public async getAPIVersion(): Promise<string> {
    return rpcCall<string>(this.client, 'supervisor.getAPIVersion');
  }

  /**
   * Get the version of the supervisor package in use by supervisord.
   *
   * @returns The version of the supervisor package in use by supervisord.
   */
  public async getSupervisorVersion(): Promise<string> {
    return rpcCall<string>(this.client, 'supervisor.getSupervisorVersion');
  }

  /**
   * Get the current state of supervisord.
   *
   * This is an internal value maintained by Supervisor that determines what Supervisor believes to be its current
   * operational state.
   *
   * @returns The current state of supervisord.
   */
  public async getState(): Promise<SupervisorState> {
    const { statecode } = await rpcCall<{
      statecode: SupervisorState;
      statename: keyof typeof SupervisorState;
    }>(this.client, 'supervisor.getState');

    return statecode;
  }

  /**
   * Get info about a process (or process group) by name.
   *
   * @param name - The name of the process (or ‘group:name’).
   * @returns A structure containing data about the process.
   */
  public async getProcessInfo(name: string): Promise<ProcessInfo> {
    return rpcCall<ProcessInfo>(this.client, 'supervisor.getProcessInfo', name);
  }

  /**
   * Get info about all processes.
   *
   * Each element contains a struct, and this struct contains the exact same elements as the struct returned by
   * {@link getProcessInfo}. If the process table is empty, an empty array is returned.
   *
   * @returns  An array of process status results.
   */
  public async getAllProcessInfo(): Promise<ProcessInfo[]> {
    return rpcCall<ProcessInfo[]>(this.client, 'supervisor.getAllProcessInfo');
  }
}
