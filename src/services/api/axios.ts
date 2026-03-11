import axios from 'axios';
import Constants from 'expo-constants';
import { NativeModules, Platform } from 'react-native';

function extractHost(value?: string | null): string | undefined {
  if (!value) return undefined;

  const normalized = value.includes('://') ? value : `http://${value}`;
  const match = normalized.match(/https?:\/\/([^/:]+)/);
  return match?.[1];
}

function getDevMachineHost(): string | undefined {
  const expoConfigHost = extractHost((Constants.expoConfig as any)?.hostUri);
  if (expoConfigHost) return expoConfigHost;

  const manifest2Host = extractHost((Constants as any)?.manifest2?.extra?.expoClient?.hostUri);
  if (manifest2Host) return manifest2Host;

  const manifestHost = extractHost(
    (Constants as any)?.manifest?.debuggerHost ?? (Constants as any)?.manifest?.hostUri
  );
  if (manifestHost) return manifestHost;

  const linkingHost = extractHost((Constants as any)?.linkingUri);
  if (linkingHost) return linkingHost;

  const scriptHost = extractHost(NativeModules.SourceCode?.scriptURL);
  return scriptHost;
}

const devHost = getDevMachineHost();
const defaultBaseUrl = devHost
  ? `http://${devHost}:3000`
  : Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000';

export const axiosInstance = axios.create({
  baseURL: defaultBaseUrl,
  timeout: 15000,
});

export const apiBaseURL = defaultBaseUrl;
