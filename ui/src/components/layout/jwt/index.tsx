import { useAuthStore } from "../../../stores";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { DateTime } from "luxon";
import { accountInfo as accountInfoAction, refreshToken as refreshTokenAction } from '../../../actions';

const JWT = () => {
  const [recoverAuth, setRecoverAuth] = useState(false);
  const [scheduledTokenRenew, setScheduledTokenRenew] = useState(false);

  const authContext = useAuthStore();

  // recovery account information from token stored in local storage
  useEffect(() => {
    if (authContext.token && !recoverAuth) {
      setRecoverAuth(true);
      const { exp } = jwt_decode<{ exp: number }>(authContext.token);
      const expiredAt = new Date(0);
      expiredAt.setUTCSeconds(exp);

      if (DateTime.fromJSDate(expiredAt).diffNow().milliseconds > 0) {
        accountInfoAction()
          .then(({ data: user }) => {
            authContext.setUser(user);
          });
      }
    }
  }, []);

  // schedule token refresh
  useEffect(() => {
    if (authContext.auth && !scheduledTokenRenew) {
      setScheduledTokenRenew(true);
      const renewAt = 10 * 60000; // renew in 10 minutes

      const { exp } = jwt_decode<{ exp: number }>(authContext.token!);
      const expiredAt = new Date(0);
      expiredAt.setUTCSeconds(exp);

      // if token will expire before we even get to scheduled renew
      if (DateTime.fromJSDate(expiredAt).diffNow().milliseconds <= renewAt) {
        refreshTokenAction()
          .then(({ data: user }) => {
            authContext.setToken(user);
          });
      }

      const interval = setInterval(() => {
        refreshTokenAction()
          .then(({ data: user }) => {
            authContext.setToken(user);
          });
      }, renewAt);

      return () => clearInterval(interval);
    }
  }, [authContext]);

  return <div style={{ display: 'none' }}>
    {authContext.token}
  </div>;
};

export default JWT;
