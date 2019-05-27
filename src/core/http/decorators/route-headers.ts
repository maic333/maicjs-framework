import RoutePropertyName from '../types/route-property-name';
import InjectRouteData from './inject-route-data';

/**
 * Decorator used to inject the request HTTP Headers in a request handler method
 */
export default function RouteHeaders() {
  return InjectRouteData(RoutePropertyName.HEADERS);
}
