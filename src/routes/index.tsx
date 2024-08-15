import { ReactNode } from "react";
import { Route } from "react-router-dom";
import { RouteType } from "./config";
import PageContent from "../components/layout/PageContent";
import appRoutes from "./AppRoute";

const generateRoute = (routes: RouteType[]): ReactNode => {
  return routes.map((route, index) =>
    route.index ? (
      <Route
        index
        path={route.path}
        element={<PageContent state={route.state}>{route.element}</PageContent>}
        key={index}
      />
    ) : (
      <Route
        path={route.path}
        element={
          <PageContent state={route.child ? undefined : route.state}>
            {route.element}
          </PageContent>
        }
        key={index}
      >
        {route.child && generateRoute(route.child)}
      </Route>
    )
  );
};

export const routes: ReactNode = generateRoute(appRoutes);
