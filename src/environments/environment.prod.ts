import { Environment } from "src/app/types/pointmotion";

export const environment: Environment = {
  production: true,
  name: 'prod',
  googleAnalyticsTrackingID: 'G-MTGG72G6ND',
  gqlEndpoint: 'https://api.prod.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.prod.pointmotioncontrol.com',
  activityEndpoint: 'https://session.prod.pointmotioncontrol.com',
  auth0Domain: 'dev--os8qz4a.us.auth0.com',
  auth0ClientId: 'ih7Um6SvveMSxudXkmzA3h6vOT7cBElL',
  auth0Audience: 'https://services.prod.pointmotioncontrol.com/',
  auth0Scope: 'openid profile email offline_access',
  auth0CbUrl: 'https://app.pointmotion.us/oauth/callback',
  auth0LogoutUrl: 'https://app.pointmotion.us'
};
