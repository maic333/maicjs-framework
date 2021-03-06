import RoutePropertyName from '../types/route-property-name';
import RouteHandlerMetadata from '../types/route-handler-metadata';

/**
 * Decorator used to inject route data in a request handler method
 */
export default function InjectRouteData(token: RoutePropertyName) {
  /* tslint:disable-next-line no-any */
  return function (target: any, key: string, parameterIndex: number) {
    // get currently injected properties
    const injectProps: RoutePropertyName[] = target[key][RouteHandlerMetadata.INJECT_ROUTE_DATA] || [];

    // inject the Headers on current index
    injectProps[parameterIndex] = token;

    // update injected properties
    target[key][RouteHandlerMetadata.INJECT_ROUTE_DATA] = injectProps;
  };
}
