import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import { Refine, Authenticated } from "@refinedev/core";
import {
  ErrorComponent,
  ThemedLayoutV2,
  RefineThemes,
  useNotificationProvider,
  RefineSnackbarProvider,
  AuthPage,
} from "@refinedev/mui";
import routerBindings, { NavigateToResource, UnsavedChangesNotifier, CatchAllNavigate } from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import { BlogPostEdit } from "./pages/blog-posts/edit";
import { BlogPostList } from "./pages/blog-posts/list";
import { BlogPostShow } from "./pages/blog-posts/show";
import { BlogPostCreate } from "./pages/blog-posts/create";

import authProvider from "./authProvider";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={RefineThemes.Blue}>
      <CssBaseline />
      <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
      <RefineSnackbarProvider>
        <BrowserRouter>
          <Refine
            authProvider={authProvider}
            routerProvider={routerBindings}
            dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: "blog_posts",
                list: "/blog-posts",
                show: "/blog-posts/show/:id",
                create: "/blog-posts/create",
                edit: "/blog-posts/edit/:id",
                meta: {
                  canDelete: true,
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated key="key1" fallback={<CatchAllNavigate to="/login" />}>
                    <ThemedLayoutV2>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route index element={<NavigateToResource resource="blog_posts" />} />

                <Route path="blog-posts">
                  <Route index element={<BlogPostList />} />
                  <Route path="show/:id" element={<BlogPostShow />} />
                  <Route path="edit/:id" element={<BlogPostEdit />} />
                  <Route path="create" element={<BlogPostCreate />} />
                </Route>
              </Route>
              <Route
                element={
                  <Authenticated key="key2" fallback={<Outlet />}>
                    <NavigateToResource />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<AuthPage type="login" />} />
                <Route path="/register" element={<AuthPage type="register" />} />
                <Route path="/forgot-password" element={<AuthPage type="forgotPassword" />} />
                <Route path="/update-password" element={<AuthPage type="updatePassword" />} />
              </Route>
              <Route
                element={
                  <Authenticated key="key3" fallback={<Outlet />}>
                    <ThemedLayoutV2>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>
            <UnsavedChangesNotifier />
          </Refine>
        </BrowserRouter>
      </RefineSnackbarProvider>
    </ThemeProvider>
  );
};
export default App;