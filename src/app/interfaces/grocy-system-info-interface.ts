export interface GrocySystemInfo {
  grocy_version: GrocyVersion;
  php_version: string;
  sqlite_version: string;
}

export interface GrocyVersion {
  Version: string;
  ReleaseDate: string;
}
