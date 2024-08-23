export interface ServerInfo {
  id: number;
  name: string;
  icon: string;
}

export interface Chat {
  id: number;
  username: string;
  message: string;
  error?: boolean;
}
