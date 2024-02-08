interface NetworkConfig {
  studioEndpoint: string;
  hostedEndpoint: string;
  lastV: string;
}
export interface NetworkConfigs {
  [networkId: string]: NetworkConfig;
}

/*
 * IMPORTANT: Increment all lastV after deployment please
 */
export const networks: NetworkConfigs = {
  "arbitrum-one": {
    studioEndpoint: "",
    hostedEndpoint: "",
    lastV: "v0.0.21",
  },
  polygon: {
    studioEndpoint: "",
    hostedEndpoint: "",
    lastV: "v0.0.4",
  },
  optimism: {
    studioEndpoint: "",
    hostedEndpoint: "",
    lastV: "v0.0.5",
  },
};

export default networks;
