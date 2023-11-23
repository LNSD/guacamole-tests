import engine from './engine';

export interface UserMapping {
  username: string;
  password: string;
  passwordEncoding?: 'md5';
  defaultConnection?: Connection;
  connections?: { [key: string]: Connection };
}

export interface Connection {
  protocol: string;
  params: { [key: string]: string | number | boolean };
}

export async function renderUserMappingConf(
  users: UserMapping[]
): Promise<string> {
  return await engine.renderFile(`user-mapping.xml.liquid`, { users });
}
