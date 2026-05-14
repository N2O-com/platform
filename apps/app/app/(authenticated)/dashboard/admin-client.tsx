"use client";

import { CoreAdmin, CustomRoutes, Resource } from "ra-core";
import { Route } from "react-router-dom";
import { dataProvider } from "./data-provider";
import { Nav } from "./nav";
import { OrganizationEdit } from "./organizations/edit";
import { OrganizationList } from "./organizations/list";
import { Overview } from "./overview";
import { UserCreate } from "./users/create";
import { UserEdit } from "./users/edit";
import { UserList } from "./users/list";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen">
    <Nav />
    {children}
  </div>
);

const AdminClient = () => (
  <CoreAdmin
    dashboard={Overview}
    dataProvider={dataProvider}
    layout={Layout}
    requireAuth
  >
    <Resource
      create={UserCreate}
      edit={UserEdit}
      list={UserList}
      name="users"
    />
    <Resource
      edit={OrganizationEdit}
      list={OrganizationList}
      name="organizations"
    />
    <CustomRoutes>
      <Route element={<Overview />} path="/overview" />
    </CustomRoutes>
  </CoreAdmin>
);

export default AdminClient;
