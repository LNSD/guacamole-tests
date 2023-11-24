import engine from './engine';

export interface UserMapping {
  username: string;
  password: string;
  passwordEncoding?: 'md5';
  defaultConnection?: Connection;
  connections?: Record<string, Connection>;
}

export interface Connection {
  protocol: string;
  params: Record<string, string | number | boolean>;
}

export function renderUserMappingConf(users: UserMapping[]): string {
  return engine.renderFileSync(`user-mapping.xml.liquid`, {
    users,
  }) as string;
}
