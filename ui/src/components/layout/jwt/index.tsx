import { useAuthStore } from "../../../stores";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { DateTime } from "luxon";
import { accountInfo as accountInfoAction, refreshToken as refreshTokenAction } from '../../../actions';
import ms from 'ms';

const JWT = () => {
  const [recoverAuth, setRecoverAuth] = useState(false);
  const [scheduledTokenRenew, setScheduledTokenRenew] = useState(false);

  const authContext = useAuthStore();

  // recovery account information from token stored in local storage
  useEffect(() => {
    if (authContext.token && !recoverAuth) {
      setRecoverAuth(true);
      const { exp } = jwtDecode<{ exp: number }>(authContext.token);
      const expiredAt = new Date(0);
      expiredAt.setUTCSeconds(exp!);

      if (DateTime.fromJSDate(expiredAt).diffNow().milliseconds > 0) {
        accountInfoAction()
          .then(({ data: user }) => {
            authContext.setUser(user);
          })
          .catch((error) => {
            console.error('Failed to recover account info:', error);
            authContext.logout();
          });
      }
    }
  }, []);

  // schedule token refresh
  useEffect(() => {
    if (authContext.auth && !scheduledTokenRenew) {
      setScheduledTokenRenew(true);
      
      const { exp } = jwtDecode<{ exp: number }>(authContext.token!);
      const expiredAt = new Date(0);
      expiredAt.setUTCSeconds(exp!);
      
      // Calculate refresh time as 75% of token lifetime or 5 minutes before expiry
      const timeToExpiry = DateTime.fromJSDate(expiredAt).diffNow().milliseconds;
      const refreshTime = Math.max(0, Math.min(timeToExpiry * 0.75, timeToExpiry - ms("5min")));
      
      if (refreshTime <= 0) {
        // Token already expired or about to expire
        handleTokenRefresh();
        return;
      }
      
      const timeoutId = setTimeout(() => {
        handleTokenRefresh();
      }, refreshTime);
      
      return () => clearTimeout(timeoutId);
    }
  }, [authContext.auth, scheduledTokenRenew]);

  const handleTokenRefresh = async () => {
    try {
      const { data: user } = await refreshTokenAction();
      authContext.setToken(user);
      setScheduledTokenRenew(false); // Allow rescheduling
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Handle refresh failure - maybe redirect to login
      authContext.logout();
    }
  };

  return <div style={{ display: 'none' }}>
    {authContext.token}
  </div>;
};

export default JWT;
