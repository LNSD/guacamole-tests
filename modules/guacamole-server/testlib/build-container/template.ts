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
  | 'libpango1.0-dev'
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
  | 'libavformat-dev'
  | 'freerdp2-dev'
  | 'libvorbis-dev';

export interface DockerfileParams {
  buildSystem: BuildSystem;
  buildDeps?: BuildDependency[];
}

export function renderDockerfile(params: DockerfileParams): string {
  return engine.renderFileSync(
    `builder-${params.buildSystem}-ubuntu-lts.dockerfile.liquid`,
    {
      buildDeps: params.buildDeps,
    }
  ) as string;
}
