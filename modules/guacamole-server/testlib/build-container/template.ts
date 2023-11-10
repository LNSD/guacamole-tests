import { Liquid } from 'liquidjs';
import path from 'path';

const ASSETS_DIR = path.join(__dirname, 'assets');

const engine = new Liquid({
  extname: '.liquid',
  root: ASSETS_DIR,
});

export type BuildSystem = 'autotools';
export type BuildDependency =
  | 'libpng-dev'
  | 'libjpeg-turbo8-dev'
  | 'libcairo2-dev'
  | 'uuid-dev'
  | 'libossp-uuid-dev'
  | 'libpango1.'
  | 'libssh2-1-dev'
  | 'libssl-dev'
  | 'libtelnet-dev'
  | 'libvncserver-dev'
  | 'libwebsockets-dev'
  | 'libwebp-dev'
  | 'libpulse-dev'
  | 'libswscale-dev'
  | 'libavcodec-dev'
  | 'libavutil-dev'
  | 'libavformat';

export interface DockerfileParams {
  buildSystem: BuildSystem;
  buildDeps?: BuildDependency[];
}

export async function renderDockerfile(
  params: DockerfileParams
): Promise<string> {
  return await engine.renderFile(
    `builder-${params.buildSystem}-ubuntu-lts.dockerfile.liquid`,
    {
      buildDeps: params.buildDeps,
    }
  );
}
